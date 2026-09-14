const { Server } = require('socket.io');
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

/**
 * Verifies admin JWT from socket handshake cookies.
 * Returns the decoded payload if valid, null otherwise.
 */
function verifyAdminSocket(socket) {
  try {
    const cookieHeader = socket.handshake.headers.cookie || '';
    const cookies = Object.fromEntries(
      cookieHeader.split(';').map(c => {
        const [k, ...v] = c.trim().split('=');
        return [k, v.join('=')];
      })
    );
    const token = cookies['admin_session'];
    if (!token) return null;

    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [header, data, signature] = parts;
    const secret = process.env.JWT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || 'mobilart-local-fallback-secret-key-2026';
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${header}.${data}`)
      .digest('base64url');

    const sigBuf = Buffer.from(signature, 'base64url');
    const expectedBuf = Buffer.from(expectedSignature, 'base64url');
    if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) return null;

    const payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf8'));
    if (Date.now() > payload.expiresAt) return null;

    return payload;
  } catch {
    return null;
  }
}

// Cliente Supabase server-side para el WebSocket
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, serviceRoleKey);

async function saveSurveyToHistory(state) {
  try {
    if (!state || !state.question || !state.active) return;
    const historyItem = {
      id: state.id || Math.random().toString(36).substring(2, 9),
      question: state.question,
      type: state.type,
      duration: state.duration,
      options: state.options || [],
      date: new Date().toISOString(),
      votes: { ...state.votes },
      total_votes: state.votedUsers ? state.votedUsers.length : 0,
    };
    const { error } = await supabase.from('encuestas').insert(historyItem);
    if (error) console.error('Error al guardar encuesta en Supabase:', error.message);
    else console.log('📝 Encuesta guardada en Supabase:', historyItem.question);
  } catch (err) {
    console.error('Error al guardar encuesta en el historial:', err);
  }
}

function initializeWebSockets(server) {
  const io = new Server(server, { cors: { origin: '*' } });

  // State Machine del Juego en Memoria
  const gameState = {
    players: [],
    currentTurnIndex: 0,
    status: 'waiting' // waiting, playing, challenge
  };

  // Estado de la encuesta en tiempo real
  let surveyTimeout = null;
  const surveyState = {
    active: false,
    id: null,
    question: '',
    type: '', // 'choice' o 'rating'
    duration: 30,
    options: [],
    endsAt: null,
    votes: {},
    votedUsers: []
  };

  io.on('connection', async (socket) => {
    console.log('🔌 Nuevo cliente conectado:', socket.id);

    // Enviar estado de encuesta activa si existe al conectarse
    socket.emit('active_survey_state', surveyState);

    // Enviar estado actual de evaluaciones desde Supabase
    try {
      const { data: grupos, error } = await supabase
        .from('grupos')
        .select('id, triviarte_enabled');
      if (!error && grupos) {
        const evaluacionStates = {};
        for (const g of grupos) {
          evaluacionStates[g.id] = g.triviarte_enabled || false;
        }
        socket.emit('evaluacion_states_sync', evaluacionStates);
        console.log('📤 Estados de evaluación enviados al cliente:', socket.id, evaluacionStates);
      }
    } catch (err) {
      console.error('Error enviando estados de evaluación:', err);
    }

    // Lanzamiento de encuesta desde el administrador
    socket.on('launch_survey', (data) => {
      const admin = verifyAdminSocket(socket);
      if (!admin) {
        console.warn('⚠️ Intento no autorizado de lanzar encuesta desde:', socket.id);
        return;
      }
      
      // Validate duration (min 1 second, max 7 days)
      const duration = Math.max(1, Math.min(604800, parseInt(data.duration) || 30));
      
      console.log('🚀 Servidor recibió launch_survey:', data);
      if (surveyTimeout) {
        clearTimeout(surveyTimeout);
        surveyTimeout = null;
      }

      // Si ya hay una encuesta activa, guardarla antes de sobrescribirla
      if (surveyState.active) {
        saveSurveyToHistory(surveyState);
      }

      surveyState.active = true;
      surveyState.id = data.id || Math.random().toString(36).substring(2, 9);
      surveyState.question = data.question;
      surveyState.type = data.type;
      surveyState.duration = duration;
      surveyState.options = data.options || [];
      surveyState.endsAt = Date.now() + (duration * 1000);
      surveyState.votes = {};
      surveyState.votedUsers = [];

      // Inicializar votos en cero
      if (data.type === 'choice') {
        surveyState.options.forEach(opt => { surveyState.votes[opt] = 0; });
      } else if (data.type === 'rating') {
        ['🤩', '😊', '😐', '😢', '😡'].forEach(emo => { surveyState.votes[emo] = 0; });
      }

      console.log('📡 Emitiendo survey_started a todos:', surveyState);
      io.emit('survey_started', surveyState);

      // Temporizador para cerrar la encuesta automáticamente
      surveyTimeout = setTimeout(() => {
        console.log('⏱️ Tiempo de encuesta finalizado automáticamente');
        saveSurveyToHistory(surveyState);
        surveyState.active = false;
        io.emit('survey_ended', surveyState);
        surveyTimeout = null;
      }, duration * 1000);
    });

    // Envío de voto del estudiante
    socket.on('submit_vote', (data) => {
      console.log('🗳️ Servidor recibió submit_vote:', data, 'de socket:', socket.id);
      if (!surveyState.active || surveyState.id !== data.surveyId) return;
      if (surveyState.votedUsers.includes(socket.id)) return;

      surveyState.votedUsers.push(socket.id);
      const voteVal = data.vote;
      surveyState.votes[voteVal] = (surveyState.votes[voteVal] || 0) + 1;

      console.log('📡 Actualizando votos a todos:', surveyState.votes);
      io.emit('survey_votes_updated', {
        votes: surveyState.votes,
        totalVotes: surveyState.votedUsers.length
      });
    });

    // Cierre manual de la encuesta por el docente
    socket.on('close_survey_manual', () => {
      const admin = verifyAdminSocket(socket);
      if (!admin) {
        console.warn('⚠️ Intento no autorizado de cerrar encuesta desde:', socket.id);
        return;
      }
      console.log('🛑 Cierre manual de encuesta solicitado por el docente');
      if (surveyTimeout) {
        clearTimeout(surveyTimeout);
        surveyTimeout = null;
      }
      saveSurveyToHistory(surveyState);
      surveyState.active = false;
      io.emit('survey_ended', surveyState);
    });

    // Control de acceso a Triviarte (habilitar/deshabilitar evaluación)
    socket.on('toggle_evaluacion', (data) => {
      const admin = verifyAdminSocket(socket);
      if (!admin) {
        console.warn('⚠️ Intento no autorizado de toggle evaluación desde:', socket.id);
        return;
      }
      console.log('🔒 Toggle evaluación recibido:', data);
      io.emit('evaluacion_state_changed', {
        grupoId: data.grupoId,
        enabled: data.enabled
      });
    });

    socket.on('join_game', (data) => {
      console.log('🎮 Jugador unido al juego:', data.name, 'socket:', socket.id);
      gameState.players.push({ id: socket.id, name: data.name, position: 0, inJail: false });
      io.emit('update_state', { ...gameState, currentTurn: gameState.players[gameState.currentTurnIndex]?.id });
    });

    socket.on('roll_dice', () => {
      const playerIndex = gameState.players.findIndex(p => p.id === socket.id);
      if (playerIndex !== gameState.currentTurnIndex) return;

      const dice = Math.floor(Math.random() * 6) + 1;
      const player = gameState.players[playerIndex];
      const newPos = player.position + dice;
      player.position = newPos;

      if ([5, 10, 15].includes(newPos) || player.inJail) {
        io.emit('trigger_challenge', {
          id: 'chal-001',
          art_discipline: 'Literature',
          challenge_text: 'Escribe una metáfora de 5 palabras para calmar el enojo',
          time_limit_seconds: 10
        });
      } else {
        gameState.currentTurnIndex = (gameState.currentTurnIndex + 1) % gameState.players.length;
      }
      io.emit('update_state', { ...gameState, currentTurn: gameState.players[gameState.currentTurnIndex]?.id });
    });

    socket.on('submit_challenge', (data) => {
      const success = data.answer.length > 5;
      const playerIndex = gameState.players.findIndex(p => p.id === socket.id);
      if (success && gameState.players[playerIndex]) {
        gameState.players[playerIndex].inJail = false;
        gameState.players[playerIndex].position += 2;
      }
      gameState.currentTurnIndex = (gameState.currentTurnIndex + 1) % gameState.players.length;
      io.emit('update_state', { ...gameState, currentTurn: gameState.players[gameState.currentTurnIndex]?.id });
    });

    socket.on('disconnect', () => {
      console.log('❌ Cliente desconectado:', socket.id);
      gameState.players = gameState.players.filter(p => p.id !== socket.id);
      io.emit('update_state', gameState);
    });
  });
}

module.exports = { initializeWebSockets };
