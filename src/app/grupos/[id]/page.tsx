"use client";
import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import ErrorBoundary from '@/components/ErrorBoundary';
import Reveal from "@/components/Reveal";
import DownloadPlaneacionPDF from "@/components/DownloadPlaneacionPDF";
import StudentAlbum from "@/components/StudentAlbum";
import InteractiveDove from "@/components/InteractiveDove";
import { io } from 'socket.io-client';
import { getAudioContext } from '@/lib/audioUtils';


interface Resource { id: string; url: string; title?: string; }
interface Ficha { id: string; url: string; title: string; }
interface TestQuestion { id: string; question: string; options: string[]; correctAnswerIndex: number; }
interface GrupoData {
  id: string; name: string; info: string; videos: Resource[]; images: Resource[]; fichas: Ficha[]; tests: TestQuestion[]; triviarteEnabled?: boolean;
}

// Datos curriculares extraídos y diseñados directamente de las Orientaciones MEN 2022 para todos los grupos de grados de Primaria
import { CURRICULUM_DATA } from '@/data/curriculumData';

export default function GrupoPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const [data, setData] = useState<GrupoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'sensibilidad' | 'creacion' | 'comprension'>('sensibilidad');

  // Gamified Step Controller
  const [triviarteStep, setTriviarteStep] = useState<'trivia' | 'colormix' | 'puzzle' | 'matching' | 'rhythm' | 'roulette'>('trivia');

  // Hearts / Lives System (Duolingo Style)
  const [hearts, setHearts] = useState(7);
  const [lastResult, setLastResult] = useState<'none' | 'correct' | 'incorrect'>('none');

  // Step 1: Knowledge Trivia
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const oldPoints = localStorage.getItem("movi" + "lart_artipuntos");
      const savedPoints = localStorage.getItem("mobilart_artipuntos") || oldPoints;
      if (savedPoints) {
        setPoints(Number(savedPoints));
        localStorage.setItem("mobilart_artipuntos", savedPoints);
      }
      
      const oldName = localStorage.getItem("movi" + "lart_student_name");
      const savedName = localStorage.getItem("mobilart_student_name") || oldName;
      if (savedName) {
        setStudentSubmissionName(savedName);
        localStorage.setItem("mobilart_student_name", savedName);
      }

      // Migrate badge completion if applicable
      const badges = ['trivia', 'colormix', 'puzzle', 'matching', 'rhythm', 'roulette'];
      badges.forEach(b => {
        const oldVal = localStorage.getItem("movi" + `lart_completed_${b}`);
        if (oldVal && !localStorage.getItem(`mobilart_completed_${b}`)) {
          localStorage.setItem(`mobilart_completed_${b}`, oldVal);
        }
      });
    }
  }, []);

  const addPoints = (amount: number) => {
    setPoints((prev) => {
      const next = prev + amount;
      localStorage.setItem("mobilart_artipuntos", next.toString());
      return next;
    });
  };

  const resetStudentProgress = () => {
    if (typeof window !== "undefined") {
      // Clear new namespace
      localStorage.removeItem("mobilart_completed_trivia");
      localStorage.removeItem("mobilart_completed_colormix");
      localStorage.removeItem("mobilart_completed_puzzle");
      localStorage.removeItem("mobilart_completed_matching");
      localStorage.removeItem("mobilart_completed_rhythm");
      localStorage.removeItem("mobilart_completed_roulette");
      localStorage.removeItem("mobilart_student_name");
      localStorage.setItem("mobilart_artipuntos", "0");

      // Clear old namespace
      localStorage.removeItem("movi" + "lart_completed_trivia");
      localStorage.removeItem("movi" + "lart_completed_colormix");
      localStorage.removeItem("movi" + "lart_completed_puzzle");
      localStorage.removeItem("movi" + "lart_completed_matching");
      localStorage.removeItem("movi" + "lart_completed_rhythm");
      localStorage.removeItem("movi" + "lart_completed_roulette");
      localStorage.removeItem("movi" + "lart_student_name");
      localStorage.removeItem("movi" + "lart_artipuntos");
    }
    
    // Reset React States
    setHearts(7);
    setPoints(0);
    setLastResult('none');
    setTriviarteStep('trivia');
    
    setCurrentQuestionIdx(0);
    setSelectedOptionIdx(null);
    setIsAnswered(false);
    
    setSelectedMixColors([]);
    setMixCompleted(false);
    
    // Re-scramble puzzle
    const puzzleList = [
      { id: 0, text: "☀️ El Sol Radiante (Cielo)", correctPos: 0 },
      { id: 1, text: "⛰️ Las Grandes Montañas (Fondo)", correctPos: 1 },
      { id: 2, text: "🌴 Las Palmeras de Cera (Centro)", correctPos: 2 },
      { id: 3, text: "🌾 Las Flores del Valle (Suelo)", correctPos: 3 }
    ];
    setPuzzlePieces([...puzzleList].sort(() => Math.random() - 0.5));
    setPuzzleCompleted(false);
    setSelectedPieceIdx(null);
    
    // Re-initialize Match Madness Pairs
    const pairs = MATCHING_PAIRS[id] || MATCHING_PAIRS['primero'];
    setMatchPairs(pairs.map(p => ({ ...p, matched: false })));
    setMatchShuffledDefs([...Array(pairs.length).keys()].sort(() => Math.random() - 0.5));
    setMatchCompleted(false);
    setMatchSelectedTerm(null);
    setMatchSelectedDef(null);
    
    setRhythmGoalIdx(Math.floor(Math.random() * 3));
    setRhythmSelectedIdx(null);
    setRhythmAnswered(false);
    
    setSelectedMission(null);
    setMissionCompleted(false);
    setRouletteAngle(0);
    setIsSubmissionSuccess(false);
    setStudentSubmissionName("");
  };

  // Step 2: Color Mix
  const [selectedMixColors, setSelectedMixColors] = useState<string[]>([]);
  const [mixCompleted, setMixCompleted] = useState(false);
  const [mixGoal, setMixGoal] = useState({ name: 'Verde (Esmeralda)', colorClass: 'bg-emerald-500', inputs: ['Azul', 'Amarillo'] });

  // Step 3: Scrambled Puzzle
  const [puzzlePieces, setPuzzlePieces] = useState([
    { id: 0, text: "☀️ El Sol Radiante (Cielo)", correctPos: 0 },
    { id: 2, text: "🌴 Las Palmeras de Cera (Centro)", correctPos: 2 },
    { id: 1, text: "⛰️ Las Grandes Montañas (Fondo)", correctPos: 1 },
    { id: 3, text: "🌾 Las Flores del Valle (Suelo)", correctPos: 3 }
  ]);
  const [selectedPieceIdx, setSelectedPieceIdx] = useState<number | null>(null);
  const [puzzleCompleted, setPuzzleCompleted] = useState(false);

  // Step 4: Rhythm Beat
  const [rhythmGoalIdx, setRhythmGoalIdx] = useState(0);
  const [rhythmSelectedIdx, setRhythmSelectedIdx] = useState<number | null>(null);
  const [rhythmAnswered, setRhythmAnswered] = useState(false);

  // Step 5: Creative Roulette
  const [spinning, setSpinning] = useState(false);
  const [rouletteAngle, setRouletteAngle] = useState(0);
  const [selectedMission, setSelectedMission] = useState<string | null>(null);
  const [missionCompleted, setMissionCompleted] = useState(false);
  const [studentSubmissionName, setStudentSubmissionName] = useState("");
  const [isSubmittingExam, setIsSubmittingExam] = useState(false);
  const [isSubmissionSuccess, setIsSubmissionSuccess] = useState(false);

  // Step 4: Match Madness (Emparejar Parejas)
  const [matchPairs, setMatchPairs] = useState<{term: string; definition: string; matched: boolean}[]>([]);
  const [matchSelectedTerm, setMatchSelectedTerm] = useState<number | null>(null);
  const [matchSelectedDef, setMatchSelectedDef] = useState<number | null>(null);
  const [matchShuffledDefs, setMatchShuffledDefs] = useState<number[]>([]);
  const [matchCompleted, setMatchCompleted] = useState(false);
  const [matchShaking, setMatchShaking] = useState(false);

  // Matching Pairs Data per Group
  const MATCHING_PAIRS: Record<string, { term: string; definition: string }[]> = {
    primero: [
      { term: "🔴🔵🟡 Colores Primarios", definition: "Rojo, Azul y Amarillo" },
      { term: "📖 Artículo 67", definition: "La educación y el arte son un derecho" },
      { term: "👆 Textura Rugosa", definition: "Sensación áspera al tacto" },
      { term: "😊 Emociones Primarias", definition: "Alegría, tristeza y enojo" },
    ],
    segundo: [
      { term: "🎵 Ritmo Visual", definition: "El trazo sigue el sonido del tambor" },
      { term: "❄️ Colores Fríos", definition: "Azul, verde y violeta" },
      { term: "📐 Forma Orgánica", definition: "Forma irregular como una hoja natural" },
      { term: "⚖️ Ley 115 Art. 23", definition: "9 áreas obligatorias incluyendo Artes" },
    ],
    tercero: [
      { term: "🏔️ Perspectiva", definition: "Objetos lejanos se ven más claros y pequeños" },
      { term: "🔴🟢 Complementarios", definition: "Colores opuestos en la rueda cromática" },
      { term: "🏫 Patrimonio Local", definition: "Memoria histórica del colegio y barrio" },
      { term: "📋 Autonomía Escolar", definition: "Art. 77: El colegio adapta su currículo" },
    ],
    cuarto: [
      { term: "☀️ Claroscuro", definition: "Luz y sombra dan volumen al dibujo" },
      { term: "🥔 Grabado en Relieve", definition: "Multiplicar imágenes con una matriz tallada" },
      { term: "🎭 Máscaras Folclóricas", definition: "Tradición cultural del Carnaval colombiano" },
      { term: "📜 Decreto 1075", definition: "Regula horarios e intensidad de Artes" },
    ],
    quinto: [
      { term: "👁️ Sensibilidad", definition: "Percibir colores, texturas y emociones" },
      { term: "🎨 Producción-Creación", definition: "Transformar materiales con técnica artística" },
      { term: "🏛️ Comprensión Crítica", definition: "Analizar el contexto social de las obras" },
      { term: "📚 Ley General de Educación", definition: "Artes es obligatoria en todo el país" },
    ],
  };

  // Dove Mood computed from hearts
  const doveMood: 'happy' | 'neutral' | 'sad' = hearts >= 5 ? 'happy' : hearts >= 3 ? 'neutral' : 'sad';
  const doveMessage = lastResult === 'correct'
    ? '¡Excelente respuesta! ¡El arte y las leyes colombianas te iluminan! ✨'
    : lastResult === 'incorrect'
    ? '¡Ánimo! Recuerda: la Educación Artística es obligatoria según el MEN. ¡Tú puedes! 💪'
    : hearts >= 5
    ? '¡Bienvenido a la aventura artística! Demuestra lo que sabes. 🕊️'
    : hearts >= 3
    ? 'Ten cuidado con tus corazones... ¡Piensa bien antes de responder! 🤔'
    : '¡Última oportunidad! Concéntrate y confía en lo que has aprendido. 🎯';

  // Play dynamic synth sound chimes
  const playSound = (type: 'correct' | 'incorrect' | 'triumph') => {
    if (typeof window === 'undefined') return;
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      if (type === 'correct') {
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.07);
          gain.gain.setValueAtTime(0, now + idx * 0.07);
          gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.07 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.07);
          osc.stop(now + idx * 0.07 + 0.4);
        });
      } else if (type === 'incorrect') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(130, now + 0.22);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(now + 0.3);
      } else if (type === 'triumph') {
        const freqs = [329.63, 392.00, 523.25, 659.25]; // E4, G4, C5, E5
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          
          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.value = 1500;

          osc.frequency.setValueAtTime(freq, now);
          osc.frequency.setValueAtTime(freq * 1.25, now + 0.12);
          
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.1, now + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);
          
          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);
          
          osc.start();
          osc.stop(now + 0.7);
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const playRhythmSound = (patternIdx: number) => {
    if (typeof window === 'undefined') return;
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      // Simple percussion generator: generates a drum-like sound at a specific time
      const playDrumHit = (time: number, freq: number = 150) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);
        osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.15);
        gain.gain.setValueAtTime(0.3, time);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + 0.2);
      };

      if (patternIdx === 0) {
        // Patrón A: Tres golpes rápidos y silencio
        playDrumHit(now, 180);
        playDrumHit(now + 0.25, 180);
        playDrumHit(now + 0.5, 180);
      } else if (patternIdx === 1) {
        // Patrón B: Dos golpes lentos alternados
        playDrumHit(now, 140);
        playDrumHit(now + 0.6, 140);
      } else if (patternIdx === 2) {
        // Patrón C: Dos golpes rápidos, silencio y golpe final
        playDrumHit(now, 160);
        playDrumHit(now + 0.2, 160);
        playDrumHit(now + 0.7, 200);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Polling periódico para verificar el estado de evaluación (fallback robusto sin WebSocket)
  useEffect(() => {
    let lastKnownState: boolean | undefined = undefined;
    const controller = new AbortController();

    const checkEvaluacionState = async () => {
      try {
        const res = await fetch('/api/grupos?t=' + Date.now(), { signal: controller.signal });
        const db = await res.json();
        if (db[id]) {
          const newEnabled = db[id].triviarteEnabled === true;
          // Si el estado cambió, actualizar y notificar
          if (lastKnownState !== undefined && lastKnownState !== newEnabled) {
            setData(prev => {
              if (!prev) return null;
              return { ...prev, triviarteEnabled: newEnabled };
            });
            if (newEnabled) {
              playSound('triumph');
              alert("🟢 ¡La evaluación ha sido abierta por el docente! Ya puedes iniciar.");
            } else {
              playSound('incorrect');
              alert("🔒 La evaluación ha sido cerrada por el docente.");
            }
          } else {
            // Actualizar silenciosamente sin alerta
            setData(prev => {
              if (!prev) return null;
              return { ...prev, triviarteEnabled: newEnabled };
            });
          }
          lastKnownState = newEnabled;
        }
      } catch (err) {
        if ((err as Error).name !== 'AbortError') console.warn("Error en polling de evaluación:", err);
      }
    };

    // Polling cada 5 segundos
    const pollingInterval = setInterval(checkEvaluacionState, 5000);

    return () => {
      controller.abort();
      clearInterval(pollingInterval);
    };
  }, [id]);

  useEffect(() => {
    fetch('/api/grupos?t=' + Date.now()).then(res => res.json()).then(db => {
      setData(db[id] || null);
      setLoading(false);
    });

    const socketInstance = io();
    
    // Sync del estado de evaluación al conectarse/reconectarse
    socketInstance.on('evaluacion_states_sync', (states: Record<string, boolean>) => {
      console.log('📥 Estados de evaluación recibidos:', states);
      if (states[id] !== undefined) {
        setData(prev => {
          if (!prev) return null;
          return {
            ...prev,
            triviarteEnabled: states[id]
          };
        });
      }
    });

    socketInstance.on('evaluacion_state_changed', (payload: { grupoId: string; enabled: boolean }) => {
      if (payload.grupoId === id) {
        setData(prev => {
          if (!prev) return null;
          return {
            ...prev,
            triviarteEnabled: payload.enabled
          };
        });
        if (payload.enabled) {
          playSound('triumph');
          alert("🟢 ¡La evaluación ha sido abierta por el docente! Ya puedes iniciar.");
        } else {
          playSound('incorrect');
          alert("🔒 La evaluación ha sido cerrada por el docente.");
        }
      }
    });

    // Randomize Color Goal
    const mixGoals = [
      { name: 'Verde (Esmeralda)', colorClass: 'bg-emerald-500', inputs: ['Azul', 'Amarillo'] },
      { name: 'Naranja (Atardecer)', colorClass: 'bg-orange-500', inputs: ['Rojo', 'Amarillo'] },
      { name: 'Morado (Orquídea)', colorClass: 'bg-purple-500', inputs: ['Rojo', 'Azul'] }
    ];
    setMixGoal(mixGoals[Math.floor(Math.random() * mixGoals.length)]);

    // Scramble Puzzle Pieces
    const puzzleList = [
      { id: 0, text: "☀️ El Sol Radiante (Cielo)", correctPos: 0 },
      { id: 1, text: "⛰️ Las Grandes Montañas (Fondo)", correctPos: 1 },
      { id: 2, text: "🌴 Las Palmeras de Cera (Centro)", correctPos: 2 },
      { id: 3, text: "🌾 Las Flores del Valle (Suelo)", correctPos: 3 }
    ];
    const scrambled = [...puzzleList].sort(() => Math.random() - 0.5);
    setPuzzlePieces(scrambled);

    // Randomize Rhythm Goal
    setRhythmGoalIdx(Math.floor(Math.random() * 3));

    // Initialize Match Madness Pairs
    const pairs = MATCHING_PAIRS[id] || MATCHING_PAIRS['primero'];
    setMatchPairs(pairs.map(p => ({ ...p, matched: false })));
    setMatchShuffledDefs([...Array(pairs.length).keys()].sort(() => Math.random() - 0.5));
    setMatchCompleted(false);
    setMatchSelectedTerm(null);
    setMatchSelectedDef(null);

    // Sincronización del Token de Reinicio Escolar
    fetch('/api/reset-progress')
      .then(res => res.json())
      .then(resData => {
        if (resData.resetToken) {
          const localToken = localStorage.getItem("mobilart_reset_token");
          if (localToken && localToken !== resData.resetToken) {
            resetStudentProgress();
            localStorage.setItem("mobilart_reset_token", resData.resetToken);
            alert("🔔 El profesor ha reiniciado el progreso de los exámenes. ¡Tu test ha vuelto a empezar desde cero!");
          } else {
            localStorage.setItem("mobilart_reset_token", resData.resetToken);
          }
        }
      })
      .catch(err => console.warn("Error sincronizando resetToken:", err));

    return () => {
      socketInstance.disconnect();
    };
  }, [id]);

  if (loading) return <div className="min-h-screen pt-32 text-center text-slate-800 font-bold">Cargando contenido...</div>;
  if (!data) return <div className="min-h-screen pt-32 text-center text-red-500 font-bold">Grupo no encontrado.</div>;

  const curData = CURRICULUM_DATA[id];

  return (
    <ErrorBoundary label="Grupo Escolar">
    <main className="min-h-screen bg-mural-escolar pt-24 pb-20">
      <div className="absolute inset-0 bg-white/90 backdrop-blur-[1px] z-0"></div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <Link href="/#grupos" className="btn-secondary text-sm px-6 py-2 border-2 border-slate-900 bg-white text-slate-800 hover:bg-slate-50 font-bold rounded-full mb-6 inline-block">
            ← Volver al Inicio
          </Link>
          <Reveal>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-4">{data.name}</h1>
            <p className="text-xl text-slate-700 max-w-2xl mx-auto font-bold">{data.info}</p>
          </Reveal>
        </div>

        {/* ========================================================
            CAJA DE HERRAMIENTAS DOCENTE (ENFOQUE PRÁCTICO MEN 2022)
            ======================================================== */}
        {curData && (
          <section className="mb-16">
            <Reveal>
              <div className="bg-white border-4 border-slate-900 p-8 rounded-3xl shadow-[8px_8px_0_rgba(15,23,42,1)]">
                <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
                  <div className="flex items-center gap-3">
                    <span className="bg-amber-100 text-amber-800 text-xs font-extrabold px-3 py-1 rounded-full border border-amber-300 uppercase">Caja de Herramientas Docente</span>
                    <span className="text-slate-500 text-sm font-bold">Vigente MEN - {curData.gradeGroup}</span>
                  </div>
                  <DownloadPlaneacionPDF
                    grupoName={data.name}
                    competencia={curData.tabs[activeTab].tituloTab}
                    desempenos={curData.tabs[activeTab].desempenos}
                    orientaciones={curData.tabs[activeTab].sugerencias}
                    actividad={{
                      nombre: curData.tabs[activeTab].actividad.titulo,
                      descripcion: curData.tabs[activeTab].actividad.objetivo,
                      materiales: curData.tabs[activeTab].actividad.materiales,
                      criterios: [curData.tabs[activeTab].actividad.evaluacion]
                    }}
                  />
                </div>

                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-950 mb-4" style={{ fontFamily: "'Outfit', 'DM Sans', sans-serif" }}>
                  Planificador de Actividades Prácticas
                </h2>
                <p className="text-slate-600 font-bold text-sm md:text-base mb-8">
                  Diseña tus clases con los referentes de calidad oficiales del Ministerio de Educación Nacional de Colombia. Selecciona una competencia específica para desplegar los desempeños requeridos, sugerencias pedagógicas y una actividad de aula lista para aplicar.
                </p>

                {/* Tabs Selector */}
                <div className="flex flex-col sm:flex-row gap-3 border-b-2 border-slate-200 pb-6 mb-8">
                  {(Object.keys(curData.tabs) as Array<keyof typeof curData.tabs>).map((tabKey) => {
                    const tab = curData.tabs[tabKey];
                    const isActive = activeTab === tabKey;
                    return (
                      <button
                        key={tabKey}
                        onClick={() => setActiveTab(tabKey)}
                        className={`flex-1 text-center py-3 px-4 font-bold rounded-xl border-2 transition-all text-sm md:text-base hover:scale-[1.02]
                          ${isActive 
                            ? 'bg-slate-900 border-slate-900 text-white shadow-[4px_4px_0_rgba(249,115,22,0.6)]' 
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
                          }
                        `}
                      >
                        {tab.tituloTab}
                      </button>
                    );
                  })}
                </div>

                {/* Active Tab Content */}
                <div className="space-y-8 animate-fade-in">
                  
                  {/* Desempeños y Sugerencias Grid */}
                  <div className="grid md:grid-cols-2 gap-8">
                    
                    {/* Desempeños del Estudiante */}
                    <div className="bg-emerald-50/50 p-6 rounded-2xl border-2 border-emerald-200">
                      <h3 className="font-extrabold text-emerald-950 mb-4 flex items-center gap-2">
                        <span>🎯</span> Desempeños Clave (Lo que logra el alumno)
                      </h3>
                      <ul className="space-y-3">
                        {curData.tabs[activeTab].desempenos.map((des, index) => (
                          <li key={index} className="text-xs md:text-sm text-emerald-900 font-semibold flex items-start gap-2">
                            <span className="text-emerald-500 font-extrabold">✓</span>
                            <span>{des}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Sugerencias para el Docente */}
                    <div className="bg-blue-50/50 p-6 rounded-2xl border-2 border-blue-200">
                      <h3 className="font-extrabold text-blue-950 mb-4 flex items-center gap-2">
                        <span>💡</span> Orientaciones Metodológicas (Para el Profe)
                      </h3>
                      <ul className="space-y-3">
                        {curData.tabs[activeTab].sugerencias.map((sug, index) => (
                          <li key={index} className="text-xs md:text-sm text-blue-900 font-semibold flex items-start gap-2">
                            <span className="text-blue-500">✦</span>
                            <span>{sug}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                  {/* Actividad de Aula Recomendada (ENFOQUE TOTALMENTE PRÁCTICO) */}
                  <div className="bg-orange-50/40 p-6 md:p-8 rounded-2xl border-3 border-dashed border-orange-300">
                    <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                      <h3 className="text-lg md:text-xl font-extrabold text-orange-950 flex items-center gap-2">
                        <span>🚀</span> Propuesta de Actividad Práctica Aplicada
                      </h3>
                      <span className="bg-orange-100 text-orange-800 text-[11px] font-extrabold px-3 py-1 rounded-full border border-orange-300 uppercase">Clase Lista para Usar</span>
                    </div>

                    <h4 className="text-xl font-extrabold text-slate-900 mb-3">
                      {curData.tabs[activeTab].actividad.titulo}
                    </h4>
                    
                    <p className="text-slate-700 text-xs md:text-sm font-semibold mb-6">
                      <span className="font-extrabold text-orange-900">Objetivo del taller:</span> {curData.tabs[activeTab].actividad.objetivo}
                    </p>

                    {/* Pasos */}
                    <div className="mb-6">
                      <h5 className="font-bold text-slate-900 text-sm mb-3">🛠️ Paso a paso en el Aula:</h5>
                      <ol className="space-y-3 pl-4 list-decimal text-xs md:text-sm text-slate-600 font-semibold">
                        {curData.tabs[activeTab].actividad.pasos.map((paso, idx) => (
                          <li key={idx} className="pl-1">
                            {paso}
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Materiales y Rúbrica */}
                    <div className="grid sm:grid-cols-2 gap-6 pt-4 border-t border-orange-200">
                      <div>
                        <h5 className="font-bold text-slate-900 text-sm mb-2">🎒 Materiales Necesarios:</h5>
                        <div className="flex flex-wrap gap-2">
                          {curData.tabs[activeTab].actividad.materiales.map((mat, idx) => (
                            <span key={idx} className="bg-white border border-slate-200 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-md shadow-sm">
                              {mat}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-900 text-sm mb-2">📊 Criterio de Evaluación Formativa:</h5>
                        <p className="text-slate-600 text-xs font-semibold leading-relaxed">
                          {curData.tabs[activeTab].actividad.evaluacion}
                        </p>
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            </Reveal>
          </section>
        )}

        {/* Videos Section */}
        {data.videos.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-slate-800 border-b-2 border-teal-200 pb-2 mb-6">🎥 Videos Complementarios</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {data.videos.map(vid => (
                <div key={vid.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200">
                  {vid.url.includes('youtube.com') || vid.url.includes('youtu.be') ? (
                    <iframe 
                      className="w-full aspect-video" 
                      src={vid.url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')} 
                      allowFullScreen 
                    />
                  ) : (
                    <video controls src={vid.url} className="w-full aspect-video bg-black" />
                  )}
                  {vid.title && <p className="p-4 font-bold text-slate-700">{vid.title}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Fichas Section */}
        {data.fichas.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-slate-800 border-b-2 border-amber-200 pb-2 mb-6">📝 Fichas y Material Descargable</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {data.fichas.map(ficha => (
                <a key={ficha.id} href={ficha.url} target="_blank" rel="noreferrer" className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all flex items-center gap-4 group">
                  <span className="text-3xl group-hover:scale-110 transition-transform">📄</span>
                  <span className="font-bold text-slate-700">{ficha.title}</span>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Images Section */}
        {data.images.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-slate-800 border-b-2 border-purple-200 pb-2 mb-6">🖼️ Galería del Grupo</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {data.images.map(img => (
                <div key={img.id} className="aspect-square rounded-xl overflow-hidden bg-slate-200 border border-slate-200">
                  <img src={img.url} alt="Galería" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Triviarte: Aventura Sensorial y Evaluativa (Gamified Test) */}
        {data.tests && data.tests.length > 0 && (
          <section className="mb-16">
            <Reveal>
              <div className="bg-slate-900 border-4 border-slate-900 p-6 md:p-8 rounded-3xl shadow-[8px_8px_0_rgba(13,148,136,0.4)] text-white select-none">
                
                {/* Header info */}
                <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <span className="bg-teal-500/20 text-teal-300 text-xs font-extrabold px-3 py-1 rounded-full border border-teal-500/30 uppercase tracking-widest">
                      🎮 TRIVIARTE SENSORIAL
                    </span>
                    <button
                      onClick={() => {
                        if (confirm("¿Deseas reiniciar tu test evaluativo escolar y empezar desde cero?")) {
                          resetStudentProgress();
                        }
                      }}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-750 text-slate-300 hover:text-white rounded-lg text-[10px] font-bold cursor-pointer transition-all active:scale-95 flex items-center gap-1"
                    >
                      <span>🔄</span>
                      <span>Reiniciar Test</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-4 text-xs sm:text-sm font-bold text-slate-300">
                    <span>⭐ Artipuntos: <strong className="text-yellow-400 text-base">{points}</strong></span>
                    {/* Hearts Display */}
                    <span className="flex items-center gap-0.5">
                      {[...Array(7)].map((_, i) => (
                        <span key={i} className={`text-base sm:text-lg transition-all duration-300 ${i < hearts ? 'anim-heart' : 'opacity-20 grayscale'}`}>
                          {i < hearts ? '❤️' : '🖤'}
                        </span>
                      ))}
                    </span>
                  </div>
                </div>

                {/* Interactive Dove Guide */}
                <div className="mb-6">
                  <InteractiveDove mood={doveMood} message={doveMessage} />
                </div>

                {/* Progress bar / Board game path nodes (6 steps) */}
                <div className="flex justify-between items-center gap-1 mb-8 bg-slate-950/40 p-3 rounded-2xl border border-white/5 overflow-x-auto">
                  {[
                    { key: 'trivia', label: '1. Trivia' },
                    { key: 'colormix', label: '2. Colores' },
                    { key: 'puzzle', label: '3. Puzzle' },
                    { key: 'matching', label: '4. Parejas' },
                    { key: 'rhythm', label: '5. Oído' },
                    { key: 'roulette', label: '6. Misión' }
                  ].map((step, idx) => {
                    const steps = ['trivia', 'colormix', 'puzzle', 'matching', 'rhythm', 'roulette'];
                    const currentIdx = steps.indexOf(triviarteStep);
                    const isCurrent = step.key === triviarteStep;
                    const isCompleted = steps.indexOf(step.key) < currentIdx;
                    return (
                      <div key={step.key} className="flex-1 flex items-center justify-center relative min-w-[55px]">
                        <div 
                          className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 border-2
                            ${isCurrent ? 'bg-teal-500 border-teal-300 text-slate-950 scale-110 shadow-[0_0_12px_rgba(20,184,166,0.6)] animate-pulse' : ''}
                            ${isCompleted ? 'bg-emerald-500 border-emerald-400 text-slate-950' : ''}
                            ${!isCurrent && !isCompleted ? 'bg-slate-800 border-slate-700 text-slate-500' : ''}
                          `}
                        >
                          {idx + 1}
                        </div>
                        <span className="hidden sm:block text-[10px] font-bold text-slate-400 ml-1.5">{step.label}</span>
                        {idx < 5 && (
                          <div className={`absolute left-[50%] right-[-50%] top-[50%] h-[3px] -translate-y-1/2 z-[-1]
                            ${isCompleted ? 'bg-emerald-500/60' : 'bg-slate-800'}
                          `} />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* ═══ GAMEPLAY AREA ═══ */}
                {!data.triviarteEnabled ? (
                  <div className="bg-slate-950/40 border border-slate-800 p-6 md:p-8 rounded-2xl text-center anim-fade-in space-y-4 max-w-xl mx-auto w-full">
                    {/* Small Lock Alert Badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider">
                      <span>🔒</span>
                      <span>Acceso Protegido por el Docente</span>
                    </div>
                    
                    <h3 className="text-lg sm:text-xl font-bold text-slate-100" style={{ fontFamily: "'Outfit', sans-serif" }}>
                      Prueba en Espera de Habilitación
                    </h3>
                    
                    <p className="text-slate-400 text-xs sm:text-sm font-semibold leading-relaxed max-w-md mx-auto">
                      Esta prueba evaluativa interactiva se activará automáticamente en tu pantalla cuando el docente inicie la sesión de examen oficial en el aula de clases.
                    </p>
                    
                    <div className="pt-2 flex justify-center gap-3 flex-wrap">
                      <button 
                        onClick={() => {
                          fetch('/api/grupos?t=' + Date.now()).then(res => res.json()).then(db => {
                            if (db[id]) {
                              setData(db[id]);
                              if (db[id].triviarteEnabled) {
                                alert("🟢 ¡La evaluación ha sido abierta por el docente! Ya puedes iniciar.");
                              } else {
                                alert("🔒 La evaluación sigue cerrada. Por favor, espera a que el docente la habilite.");
                              }
                            }
                          });
                        }}
                        className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 font-bold rounded-xl transition-all text-xs cursor-pointer active:scale-95 flex items-center gap-1.5"
                      >
                        <span>🔄</span>
                        <span>Verificar Estado</span>
                      </button>
                    </div>
                  </div>
                ) : hearts <= 0 ? (
                  <div className="bg-slate-950/30 border border-red-500/20 p-8 md:p-12 rounded-2xl text-center anim-fade-in space-y-6">
                    <InteractiveDove mood="sad" message="¡Oh no! Has perdido todas tus vidas... Pero un verdadero artista nunca se rinde. ¡Vuelve a intentarlo! 🎨" />
                    <span className="text-6xl block">💔</span>
                    <h3 className="text-2xl md:text-3xl font-extrabold text-red-400">¡Se acabaron tus vidas!</h3>
                    <p className="text-slate-400 text-sm font-bold max-w-md mx-auto">
                      No te preocupes, cada error es una pincelada más en tu aprendizaje. Repasa el contenido del Marco Normativo y las actividades de tu grupo, y vuelve a intentar la aventura.
                    </p>
                    <button
                      onClick={() => {
                        setHearts(7);
                        setLastResult('none');
                        setCurrentQuestionIdx(0);
                        setSelectedOptionIdx(null);
                        setIsAnswered(false);
                        setPoints(0);
                        setTriviarteStep('trivia');
                        setSelectedMixColors([]);
                        setMixCompleted(false);
                        const scrambled = [
                          { id: 0, text: '☀️ El Sol Radiante (Cielo)', correctPos: 0 },
                          { id: 1, text: '⛰️ Las Grandes Montañas (Fondo)', correctPos: 1 },
                          { id: 2, text: '🌴 Las Palmeras de Cera (Centro)', correctPos: 2 },
                          { id: 3, text: '🌾 Las Flores del Valle (Suelo)', correctPos: 3 }
                        ].sort(() => Math.random() - 0.5);
                        setPuzzlePieces(scrambled);
                        setPuzzleCompleted(false);
                        setSelectedPieceIdx(null);
                        const pairs = MATCHING_PAIRS[id] || MATCHING_PAIRS['primero'];
                        setMatchPairs(pairs.map(p => ({ ...p, matched: false })));
                        setMatchShuffledDefs([...Array(pairs.length).keys()].sort(() => Math.random() - 0.5));
                        setMatchCompleted(false);
                        setMatchSelectedTerm(null);
                        setMatchSelectedDef(null);
                        setRhythmGoalIdx(Math.floor(Math.random() * 3));
                        setRhythmSelectedIdx(null);
                        setRhythmAnswered(false);
                        setSelectedMission(null);
                        setMissionCompleted(false);
                        setRouletteAngle(0);
                        localStorage.setItem('mobilart_artipuntos', '0');
                      }}
                      className="px-10 py-4 bg-gradient-to-r from-rose-500 to-red-500 text-white font-black rounded-xl hover:brightness-110 active:scale-95 transition-all text-sm uppercase tracking-wider shadow-lg cursor-pointer"
                    >
                      🔄 Reiniciar Aventura
                    </button>
                  </div>
                ) : (<>

                {/* ── STEP 1: KNOWLEDGE TRIVIA ── */}
                {triviarteStep === 'trivia' && (
                  <>
                    {!studentSubmissionName ? (
                      <div className="bg-slate-950/30 border border-teal-500/20 p-8 md:p-12 rounded-2xl text-center anim-fade-in space-y-6 max-w-lg mx-auto w-full">
                        <span className="text-5xl block animate-bounce">🎒</span>
                        <h3 className="text-2xl md:text-3xl font-extrabold text-teal-300" style={{ fontFamily: "'Outfit', sans-serif" }}>¡Bienvenido a Triviarte!</h3>
                        <p className="text-slate-300 text-sm font-semibold leading-relaxed">
                          Antes de iniciar tu gran aventura de artes y ganar tus Artipuntos, por favor escribe tu nombre y apellido completo para que tu profesor reciba tu examen:
                        </p>
                        
                        <form 
                          onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            const name = (formData.get('playerName') as string).trim();
                            if (!name) return alert("Por favor escribe tu nombre y apellido");
                            
                            setStudentSubmissionName(name);
                            if (typeof window !== "undefined") {
                              localStorage.setItem("mobilart_student_name", name);
                            }
                            playSound('correct');
                          }}
                          className="space-y-4 text-left"
                        >
                          <div>
                            <label className="text-[10px] font-black text-teal-400 uppercase tracking-wider block mb-1">Nombre Completo del Alumno:</label>
                            <input
                              name="playerName"
                              type="text"
                              required
                              placeholder="Escribe tu nombre y apellido..."
                              className="w-full bg-slate-900 border-2 border-slate-700 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/50 px-4 py-3.5 rounded-2xl text-sm font-bold text-slate-100 placeholder-slate-500 focus:outline-none transition-all text-center"
                            />
                          </div>
                          
                          <button
                            type="submit"
                            className="w-full py-4 bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-black rounded-2xl hover:brightness-110 active:scale-95 transition-all text-xs sm:text-sm uppercase tracking-wider shadow-lg cursor-pointer"
                          >
                            🚀 ¡Comenzar mi Examen!
                          </button>
                        </form>
                      </div>
                    ) : (
                      <div className="bg-slate-950/30 border border-white/10 p-6 md:p-8 rounded-2xl min-h-[300px] flex flex-col justify-between anim-fade-in">
                        <div>
                          <span className="text-teal-400 font-extrabold text-xs uppercase tracking-widest block mb-2">Desafío Conceptual</span>
                          <h3 className="text-lg md:text-xl font-extrabold text-white mb-6 leading-relaxed">
                            {data.tests[currentQuestionIdx].question}
                          </h3>

                          <div className="grid sm:grid-cols-2 gap-4">
                            {data.tests[currentQuestionIdx].options.map((opt, oIdx) => {
                              const isSelected = selectedOptionIdx === oIdx;
                              const isCorrect = oIdx === data.tests[currentQuestionIdx].correctAnswerIndex;
                              
                              let btnStyle = "bg-slate-800/60 border-slate-700 hover:bg-slate-800 hover:border-slate-600 text-slate-200";
                              if (isAnswered) {
                                if (isCorrect) {
                                  btnStyle = "bg-emerald-500 border-emerald-400 text-slate-950 font-black shadow-[0_0_15px_rgba(16,185,129,0.3)] scale-[1.01]";
                                } else if (isSelected) {
                                  btnStyle = "bg-red-500 border-red-400 text-white font-black shadow-[0_0_15px_rgba(239,68,68,0.3)]";
                                } else {
                                  btnStyle = "bg-slate-900/40 border-slate-800 text-slate-600 opacity-60 pointer-events-none";
                                }
                              }

                              return (
                                <button
                                  key={oIdx}
                                  disabled={isAnswered}
                                  onClick={() => {
                                    if (isAnswered) return;
                                    setSelectedOptionIdx(oIdx);
                                    setIsAnswered(true);
                                    const correct = oIdx === data.tests[currentQuestionIdx].correctAnswerIndex;
                                    if (correct) {
                                      addPoints(1);
                                      playSound('correct');
                                      setLastResult('correct');
                                    } else {
                                      playSound('incorrect');
                                      setHearts(prev => Math.max(0, prev - 1));
                                      setLastResult('incorrect');
                                    }
                                  }}
                                  className={`w-full text-left p-4 rounded-xl border-2 transition-all text-xs sm:text-sm font-bold flex items-center justify-between gap-3 active:scale-95 duration-200 cursor-pointer ${btnStyle}`}
                                >
                                  <span>{opt}</span>
                                  {isAnswered && isCorrect && <span className="text-base">🎉</span>}
                                  {isAnswered && isSelected && !isCorrect && <span className="text-base">💡</span>}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {isAnswered && (
                          <div className="mt-8 flex justify-end">
                            <button
                              onClick={() => {
                                if (currentQuestionIdx < data.tests.length - 1) {
                                  setCurrentQuestionIdx(p => p + 1);
                                  setSelectedOptionIdx(null);
                                  setIsAnswered(false);
                                } else {
                                  if (typeof window !== "undefined") {
                                    localStorage.setItem("mobilart_completed_trivia", "true");
                                  }
                                  setTriviarteStep('colormix');
                                  playSound('correct');
                                }
                              }}
                              className="px-8 py-3 bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-black rounded-xl hover:brightness-110 hover:scale-[1.02] active:scale-95 transition-all text-xs sm:text-sm flex items-center gap-2 shadow-lg"
                            >
                              <span>{currentQuestionIdx < data.tests.length - 1 ? 'Siguiente Desafío ➡️' : '🧪 Ir al Desafío del Color'}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}

                {/* ── STEP 2: MAGICAL COLOR MIXER ── */}
                {triviarteStep === 'colormix' && (
                  <div className="bg-slate-950/30 border border-white/10 p-6 md:p-8 rounded-2xl min-h-[300px] flex flex-col justify-between anim-fade-in space-y-6">
                    <div className="text-center">
                      <span className="text-teal-400 font-extrabold text-xs uppercase tracking-widest block mb-2">Desafío Cromático</span>
                      <h3 className="text-xl md:text-2xl font-black text-white leading-relaxed">
                        ¡Combinador de Colores Mágicos! 🧪
                      </h3>
                      <p className="text-slate-300 text-xs sm:text-sm font-semibold max-w-md mx-auto mt-2">
                        Selecciona exactamente **dos colores primarios** que combinen para dar como resultado el color objetivo:
                      </p>
                      
                      <div className="inline-flex items-center gap-3 bg-slate-900 border border-white/10 p-3 rounded-2xl mt-4 px-6">
                        <span className="text-xs font-bold text-slate-400">OBJETIVO:</span>
                        <div className={`w-6 h-6 rounded-full border border-white/25 ${mixGoal.colorClass}`} />
                        <span className="text-sm font-black text-white">{mixGoal.name}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto w-full py-4">
                      {[
                        { name: 'Rojo', colorClass: 'bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.2)] text-white' },
                        { name: 'Azul', colorClass: 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.2)] text-white' },
                        { name: 'Amarillo', colorClass: 'bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.2)] text-slate-950' }
                      ].map((col) => {
                        const isSelected = selectedMixColors.includes(col.name);
                        return (
                          <button
                            key={col.name}
                            disabled={mixCompleted}
                            onClick={() => {
                              if (isSelected) {
                                setSelectedMixColors(prev => prev.filter(c => c !== col.name));
                              } else {
                                if (selectedMixColors.length < 2) {
                                  setSelectedMixColors(prev => [...prev, col.name]);
                                } else {
                                  setSelectedMixColors(prev => [prev[0], col.name]);
                                }
                              }
                            }}
                            className={`aspect-square rounded-2xl flex flex-col items-center justify-center font-black text-sm sm:text-base border-4 transition-all duration-200 cursor-pointer active:scale-95
                              ${col.colorClass}
                              ${isSelected ? 'border-teal-300 scale-105 shadow-[0_0_20px_rgba(20,184,166,0.6)] animate-pulse' : 'border-slate-800 hover:border-slate-700'}
                            `}
                          >
                            <span className="text-xl mb-1">{col.name === 'Rojo' ? '🔴' : col.name === 'Azul' ? '🔵' : '🟡'}</span>
                            <span className="text-xs uppercase tracking-wider">{col.name}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex flex-col items-center justify-center space-y-4">
                      {selectedMixColors.length === 2 && !mixCompleted && (
                        <button
                          onClick={() => {
                            const hasMatch = mixGoal.inputs.every(input => selectedMixColors.includes(input));
                            if (hasMatch) {
                              setMixCompleted(true);
                              addPoints(2);
                              if (typeof window !== "undefined") {
                                localStorage.setItem("mobilart_completed_colormix", "true");
                              }
                              playSound('correct');
                            } else {
                              playSound('incorrect');
                              alert(`❌ ¡Casi! La mezcla de ${selectedMixColors[0]} + ${selectedMixColors[1]} no da ${mixGoal.name}. ¡Prueba con otra combinación!`);
                              setSelectedMixColors([]);
                            }
                          }}
                          className="px-8 py-3 bg-teal-500 text-slate-950 font-black rounded-xl hover:brightness-110 active:scale-95 transition-all text-xs uppercase tracking-wider shadow-lg cursor-pointer font-bold"
                        >
                          🧪 Combinar Colores
                        </button>
                      )}

                      {mixCompleted && (
                        <div className="text-center space-y-4 anim-fade-in w-full">
                          <div className="inline-block p-4 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-2xl text-emerald-400 font-extrabold text-sm max-w-sm">
                            ✨ ¡Fórmula Descubierta! La combinación de **{mixGoal.inputs[0]}** y **{mixGoal.inputs[1]}** crea perfectamente el color **{mixGoal.name}**. (+2 Puntos)
                          </div>
                          <div className="flex justify-center mt-2">
                            <button
                              onClick={() => {
                                setTriviarteStep('puzzle');
                                playSound('correct');
                              }}
                              className="px-8 py-3 bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-black rounded-xl hover:brightness-110 active:scale-95 transition-all text-xs sm:text-sm shadow-md cursor-pointer"
                            >
                              Continuar al Rompecabezas 🧩 ➡️
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ── STEP 3: VISUAL COMPOSITION PUZZLE ── */}
                {triviarteStep === 'puzzle' && (
                  <div className="bg-slate-950/30 border border-white/10 p-6 md:p-8 rounded-2xl min-h-[300px] flex flex-col justify-between anim-fade-in space-y-6">
                    <div className="text-center">
                      <span className="text-amber-400 font-extrabold text-xs uppercase tracking-widest block mb-2">Composición Visual</span>
                      <h3 className="text-xl md:text-2xl font-black text-white">
                        ¡Rompecabezas del Paisaje! 🧩
                      </h3>
                      <p className="text-slate-300 text-xs sm:text-sm font-semibold max-w-lg mx-auto mt-2">
                        Intercambia las piezas haciendo clic sobre ellas para ordenar la pintura de arriba hacia abajo (desde el Cielo hasta el Suelo):
                      </p>
                    </div>

                    <div className="grid gap-3 max-w-md mx-auto w-full py-4">
                      {puzzlePieces.map((piece, idx) => {
                        const isSelected = selectedPieceIdx === idx;
                        const isCorrect = piece.correctPos === idx;
                        return (
                          <button
                            key={piece.id}
                            disabled={puzzleCompleted}
                            onClick={() => {
                              if (selectedPieceIdx === null) {
                                setSelectedPieceIdx(idx);
                                playSound('correct');
                              } else {
                                const updated = [...puzzlePieces];
                                const temp = updated[selectedPieceIdx];
                                updated[selectedPieceIdx] = updated[idx];
                                updated[idx] = temp;
                                setPuzzlePieces(updated);
                                setSelectedPieceIdx(null);
                                
                                const completed = updated.every((p, i) => p.correctPos === i);
                                if (completed) {
                                  setPuzzleCompleted(true);
                                  addPoints(3);
                                  if (typeof window !== "undefined") {
                                    localStorage.setItem("mobilart_completed_puzzle", "true");
                                  }
                                  playSound('triumph');
                                } else {
                                  playSound('correct');
                                }
                              }
                            }}
                            className={`w-full p-4 rounded-xl border-2 transition-all text-xs sm:text-sm font-black flex items-center justify-between gap-3 cursor-pointer
                              ${isSelected ? 'bg-teal-500 border-teal-300 text-slate-950 scale-[1.01] shadow-[0_0_12px_rgba(20,184,166,0.5)]' : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800 text-slate-200'}
                              ${puzzleCompleted && isCorrect ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-extrabold cursor-default' : ''}
                            `}
                          >
                            <span>{piece.text}</span>
                            <div className="flex items-center gap-2">
                              {puzzleCompleted ? (
                                <span className="text-emerald-400 text-xs">✓ Correcto</span>
                              ) : (
                                <span className="text-[10px] text-slate-500 px-2 py-0.5 bg-slate-950/40 rounded font-semibold">Posición {idx + 1}</span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex flex-col items-center">
                      {puzzleCompleted && (
                        <div className="text-center space-y-4 anim-fade-in w-full">
                          <div className="inline-block p-4 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-2xl text-emerald-400 font-extrabold text-sm max-w-sm">
                            🎉 ¡Paisaje En Armonía! Has compuesto la escena de forma natural y equilibrada. (+3 Puntos)
                          </div>
                          <div className="flex justify-center mt-2">
                            <button
                              onClick={() => {
                                setTriviarteStep('matching');
                                setLastResult('none');
                                playSound('correct');
                              }}
                              className="px-8 py-3 bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-black rounded-xl hover:brightness-110 active:scale-95 transition-all text-xs sm:text-sm shadow-md cursor-pointer"
                            >
                              Continuar a Emparejar Parejas 🃏 ➡️
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ── STEP 4: MATCH MADNESS (EMPAREJAR PAREJAS) ── */}
                {triviarteStep === 'matching' && (
                  <div className={`bg-slate-950/30 border border-white/10 p-6 md:p-8 rounded-2xl min-h-[300px] flex flex-col justify-between anim-fade-in space-y-6 ${matchShaking ? 'anim-shake' : ''}`}>
                    <div className="text-center">
                      <span className="text-purple-400 font-extrabold text-xs uppercase tracking-widest block mb-2">Match Madness</span>
                      <h3 className="text-xl md:text-2xl font-black text-white">
                        ¡Emparejar Conceptos! 🃏
                      </h3>
                      <p className="text-slate-300 text-xs sm:text-sm font-semibold max-w-lg mx-auto mt-2">
                        Conecta cada concepto de la izquierda con su definición correcta a la derecha. ¡Cuidado, un error te cuesta un corazón!
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto w-full py-4">
                      {/* Left Column: Terms */}
                      <div className="space-y-3">
                        {matchPairs.map((pair, idx) => (
                          <button
                            key={`term-${idx}`}
                            disabled={pair.matched || matchCompleted}
                            onClick={() => {
                              if (pair.matched) return;
                              setMatchSelectedTerm(idx);
                              playSound('correct');
                            }}
                            className={`w-full p-3 rounded-xl border-2 text-xs sm:text-sm font-bold text-left transition-all duration-200 cursor-pointer active:scale-95
                              ${pair.matched ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 cursor-default' : ''}
                              ${matchSelectedTerm === idx && !pair.matched ? 'bg-purple-500 border-purple-300 text-white scale-[1.02] shadow-[0_0_12px_rgba(168,85,247,0.5)]' : ''}
                              ${matchSelectedTerm !== idx && !pair.matched ? 'bg-slate-800/60 border-slate-700 hover:bg-slate-800 text-slate-200' : ''}
                            `}
                          >
                            {pair.matched ? '✓ ' : ''}{pair.term}
                          </button>
                        ))}
                      </div>

                      {/* Right Column: Shuffled Definitions */}
                      <div className="space-y-3">
                        {matchShuffledDefs.map((origIdx, displayIdx) => {
                          const pair = matchPairs[origIdx];
                          if (!pair) return null;
                          return (
                            <button
                              key={`def-${displayIdx}`}
                              disabled={pair.matched || matchCompleted}
                              onClick={() => {
                                if (pair.matched || matchSelectedTerm === null) return;
                                setMatchSelectedDef(origIdx);

                                // Check if term and definition match
                                if (origIdx === matchSelectedTerm) {
                                  // CORRECT match!
                                  const updated = [...matchPairs];
                                  updated[origIdx] = { ...updated[origIdx], matched: true };
                                  setMatchPairs(updated);
                                  addPoints(2);
                                  playSound('correct');
                                  setLastResult('correct');
                                  setMatchSelectedTerm(null);
                                  setMatchSelectedDef(null);

                                  // Check if all are matched
                                  const allMatched = updated.every(p => p.matched);
                                  if (allMatched) {
                                    setMatchCompleted(true);
                                    if (typeof window !== "undefined") {
                                      localStorage.setItem("mobilart_completed_matching", "true");
                                    }
                                    playSound('triumph');
                                  }
                                } else {
                                  // INCORRECT match!
                                  playSound('incorrect');
                                  setHearts(prev => Math.max(0, prev - 1));
                                  setLastResult('incorrect');
                                  setMatchShaking(true);
                                  setTimeout(() => {
                                    setMatchShaking(false);
                                    setMatchSelectedTerm(null);
                                    setMatchSelectedDef(null);
                                  }, 500);
                                }
                              }}
                              className={`w-full p-3 rounded-xl border-2 text-xs sm:text-sm font-bold text-left transition-all duration-200 cursor-pointer active:scale-95
                                ${pair.matched ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 cursor-default' : ''}
                                ${matchSelectedDef === origIdx && !pair.matched ? 'bg-amber-500 border-amber-300 text-slate-950 scale-[1.02]' : ''}
                                ${matchSelectedDef !== origIdx && !pair.matched ? 'bg-slate-800/60 border-slate-700 hover:bg-slate-800 text-slate-200' : ''}
                              `}
                            >
                              {pair.matched ? '✓ ' : ''}{pair.definition}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex flex-col items-center">
                      {matchCompleted && (
                        <div className="text-center space-y-4 anim-fade-in w-full">
                          <div className="inline-block p-4 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-2xl text-emerald-400 font-extrabold text-sm max-w-sm">
                            🃏 ¡Match Perfecto! Has conectado todos los conceptos con sus definiciones. (+8 Puntos)
                          </div>
                          <div className="flex justify-center mt-2">
                            <button
                              onClick={() => {
                                setTriviarteStep('rhythm');
                                setLastResult('none');
                                playSound('correct');
                              }}
                              className="px-8 py-3 bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-black rounded-xl hover:brightness-110 active:scale-95 transition-all text-xs sm:text-sm shadow-md cursor-pointer"
                            >
                              Continuar al Desafío Auditivo 🎵 ➡️
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ── STEP 4: RHYTHMIC PATTERN MATCHER ── */}
                {triviarteStep === 'rhythm' && (
                  <div className="bg-slate-950/30 border border-white/10 p-6 md:p-8 rounded-2xl min-h-[300px] flex flex-col justify-between anim-fade-in space-y-6">
                    <div className="text-center">
                      <span className="text-blue-400 font-extrabold text-xs uppercase tracking-widest block mb-2">Sensibilidad Auditiva</span>
                      <h3 className="text-xl md:text-2xl font-black text-white">
                        ¡Ritmo Mimético y Oído Crítico! 🎵
                      </h3>
                      <p className="text-slate-300 text-xs sm:text-sm font-semibold max-w-lg mx-auto mt-2">
                        Presiona el botón para reproducir la melodía y selecciona la secuencia de emojis que represente exactamente el patrón de sonidos que oíste:
                      </p>
                    </div>

                    <div className="flex justify-center py-4">
                      <button
                        onClick={() => {
                          playRhythmSound(rhythmGoalIdx);
                        }}
                        className="px-6 py-4 bg-slate-900 border-2 border-blue-400/40 text-blue-300 font-black rounded-3xl hover:bg-slate-800 hover:border-blue-300 transition-all flex items-center gap-3 shadow-lg active:scale-95 cursor-pointer text-xs sm:text-sm font-bold"
                      >
                        <span className="text-2xl animate-pulse">🔊</span>
                        <span>Escuchar Ritmo Secreto</span>
                      </button>
                    </div>

                    <div className="grid gap-3 max-w-md mx-auto w-full">
                      {[
                        { idx: 0, pattern: "🥁 Patrón A: [ 🥁  🥁  🥁  🤫 ] (Tres golpes rápidos y silencio)" },
                        { idx: 1, pattern: "🥁 Patrón B: [ 🥁  🤫  🥁  🤫 ] (Dos golpes lentos alternados)" },
                        { idx: 2, pattern: "🥁 Patrón C: [ 🥁  🥁  🤫  🥁 ] (Dos golpes rápidos, silencio y golpe final)" }
                      ].map((opt) => {
                        const isSelected = rhythmSelectedIdx === opt.idx;
                        const isCorrect = opt.idx === rhythmGoalIdx;
                        
                        let btnStyle = "bg-slate-800/60 border-slate-700 hover:bg-slate-800 hover:border-slate-600 text-slate-200";
                        if (rhythmAnswered) {
                          if (isCorrect) {
                            btnStyle = "bg-emerald-500 border-emerald-400 text-slate-950 font-black shadow-[0_0_15px_rgba(16,185,129,0.3)]";
                          } else if (isSelected) {
                            btnStyle = "bg-red-500 border-red-400 text-white font-black shadow-[0_0_15px_rgba(239,68,68,0.3)]";
                          } else {
                            btnStyle = "bg-slate-900/40 border-slate-800 text-slate-600 opacity-60 pointer-events-none";
                          }
                        }

                        return (
                          <button
                            key={opt.idx}
                            disabled={rhythmAnswered}
                            onClick={() => {
                              if (rhythmAnswered) return;
                              setRhythmSelectedIdx(opt.idx);
                              setRhythmAnswered(true);
                              if (isCorrect) {
                                addPoints(2);
                                if (typeof window !== "undefined") {
                                  localStorage.setItem("mobilart_completed_rhythm", "true");
                                }
                                playSound('correct');
                              } else {
                                playSound('incorrect');
                                alert("❌ ¡Casi! Vuelve a escuchar con atención y reintenta.");
                                setRhythmSelectedIdx(null);
                                setRhythmAnswered(false);
                              }
                            }}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all text-xs sm:text-sm font-bold flex items-center justify-between gap-3 cursor-pointer active:scale-95 duration-200 ${btnStyle}`}
                          >
                            <span>{opt.pattern}</span>
                            {rhythmAnswered && isCorrect && <span className="text-emerald-400 font-extrabold">🎉 Correcto</span>}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex flex-col items-center">
                      {rhythmAnswered && rhythmSelectedIdx === rhythmGoalIdx && (
                        <div className="text-center space-y-4 anim-fade-in w-full mt-4">
                          <div className="inline-block p-4 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-2xl text-emerald-400 font-extrabold text-sm max-w-sm">
                            🎵 ¡Excelente Sentido Rítmico! Has identificado correctamente el compás del sonido. (+2 Puntos)
                          </div>
                          <div className="flex justify-center mt-2">
                            <button
                              onClick={() => {
                                setTriviarteStep('roulette');
                                playSound('correct');
                              }}
                              className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 font-black rounded-xl hover:brightness-110 active:scale-95 transition-all text-xs sm:text-sm shadow-md cursor-pointer"
                            >
                              Ir a la Ruleta Final 🎯 ➡️
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ── STEP 5: CREATIVE CHALLENGE ROULETTE ── */}
                {triviarteStep === 'roulette' && (
                  <div className="bg-slate-950/30 border border-white/10 p-6 md:p-8 rounded-2xl text-center anim-fade-in space-y-8">
                    <div>
                      <span className="text-yellow-400 text-4xl block animate-bounce">🏆</span>
                      <h3 className="text-2xl md:text-3xl font-extrabold text-white mt-3">¡Impresionante Aventura Artística!</h3>
                      <p className="text-slate-300 text-sm md:text-base font-semibold mt-2">
                        Has superado todos los desafíos de conocimientos y acumulado:
                      </p>
                      <div className="inline-block bg-teal-500/10 border border-teal-500/30 px-6 py-2 rounded-2xl mt-4">
                        <span className="text-3xl font-black text-teal-400">{points}</span> 
                        <span className="text-slate-400 text-xs font-bold block">Puntos Acumulados</span>
                      </div>
                    </div>

                    <div className="h-px bg-white/10 w-full" />

                    {/* Spinning Roulette UI */}
                    <div className="space-y-6 max-w-lg mx-auto flex flex-col items-center">
                      <h4 className="font-black text-xl text-teal-300">🎯 Ruleta de Desafíos Prácticos</h4>
                      <p className="text-slate-400 text-xs max-w-sm">
                        Gira el disco multicolor para recibir un desafío interactivo y divertido para realizar en tu salón.
                      </p>

                      {/* Visual Roulette Disk */}
                      <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full border-4 border-slate-800 shadow-2xl flex items-center justify-center overflow-hidden">
                        {/* Pointer arrow */}
                        <div className="absolute top-0 z-20 text-yellow-400 text-2xl font-black -translate-y-1">
                          ▼
                        </div>
                        
                        {/* Colors segments rotating */}
                        <div 
                          style={{ 
                            transform: `rotate(${rouletteAngle}deg)`, 
                            transition: spinning ? 'transform 2.5s cubic-bezier(0.2, 0.8, 0.3, 1)' : 'none'
                          }} 
                          className="w-full h-full rounded-full grid grid-cols-2 grid-rows-2 relative"
                        >
                          <div className="bg-red-500 border border-slate-900/10 flex items-center justify-center text-xs font-black text-white">🎨</div>
                          <div className="bg-blue-500 border border-slate-900/10 flex items-center justify-center text-xs font-black text-white">🦁</div>
                          <div className="bg-yellow-400 border border-slate-900/10 flex items-center justify-center text-xs font-black text-slate-950">🌋</div>
                          <div className="bg-emerald-500 border border-slate-900/10 flex items-center justify-center text-xs font-black text-slate-950">🎵</div>
                        </div>

                        {/* Center button */}
                        <div className="absolute w-12 h-12 bg-slate-900 border-2 border-white rounded-full flex items-center justify-center shadow-lg z-10">
                          <span className="text-base">⭐</span>
                        </div>
                      </div>

                      {!selectedMission ? (
                        // Spin Trigger button
                        <button
                          disabled={spinning}
                          onClick={() => {
                            if (spinning) return;
                            setSpinning(true);
                            const targetAngle = 1440 + Math.random() * 360;
                            setRouletteAngle(targetAngle);
                            
                            // Trigger continuous clicking sounds
                            let count = 0;
                            const timer = setInterval(() => {
                              if (count < 18) {
                                playSound('correct');
                                count++;
                              } else {
                                clearInterval(timer);
                              }
                            }, 130);

                            setTimeout(() => {
                              setSpinning(false);
                              const list = id === 'cuarto' || id === 'quinto' 
                                ? [
                                    "⛰️ Mira por la ventana, encuentra el objeto o montaña que esté más lejos y dibuja su silueta en el aire con tu dedo índice.",
                                    "🎭 Haz gestos de enojo, tristeza y alegría frente a tu compañero. ¡Observa cómo cambia tu cara!",
                                    "💡 Sombras mágicas: Usa la luz de la linterna de tu celular para proyectar la sombra de tu mano en la mesa. ¡Crea una criatura!",
                                    "🎨 Encuentra dos objetos de colores complementarios en tu salón (ej. rojo y verde o azul y naranja) y colócalos juntos.",
                                    "🏛️ Describe en voz alta a tres compañeros un mural o artesanía que hayas visto en tu barrio y qué mensaje te transmitió."
                                  ]
                                : [
                                    "🎨 Cierra los ojos y dibuja en el aire una espiral gigante usando todo tu brazo de color amarillo. ¡Siente el ritmo!",
                                    "🦁 Busca tres texturas distintas en tu salón (liso, rugoso, suave) y descríbeselas en secreto a tu compañero de equipo.",
                                    "🌋 Agarra un pedazo de papel o plastilina y moldéalo en forma de un guardián mágico que proteja las plantas de la escuela.",
                                    "🎵 Da 4 aplausos rápidos y luego 4 pisadas lentas en silencio para crear un contraste de ritmos corporales.",
                                    "🤝 Pregúntale a tu compañero de al lado qué emoción siente hoy en el colegio y dibújasela en una pequeña hoja de papel."
                                  ];
                              const chosen = list[Math.floor(Math.random() * list.length)];
                              setSelectedMission(chosen);
                              playSound('triumph');
                            }, 2500);
                          }}
                          className="px-10 py-3 bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-black rounded-xl hover:brightness-110 active:scale-95 transition-all text-xs uppercase tracking-wider disabled:opacity-50 cursor-pointer font-bold"
                        >
                          {spinning ? '🎰 Girando la Ruleta...' : '🎯 Girar la Ruleta'}
                        </button>
                      ) : (
                        // Landing Mission Display
                        <div className="bg-slate-900 border-2 border-teal-500/30 p-5 rounded-2xl text-center space-y-4 max-w-sm anim-fade-in w-full">
                          <span className="text-yellow-400 text-2xl font-black block">✨ Misión Obtenida ✨</span>
                          <p className="text-white font-extrabold text-sm leading-relaxed">
                            "{selectedMission}"
                          </p>
                          
                          {!missionCompleted ? (
                            <button
                              onClick={() => {
                                setMissionCompleted(true);
                                addPoints(5);
                                if (typeof window !== "undefined") {
                                  localStorage.setItem("mobilart_completed_roulette", "true");
                                }
                                playSound('triumph');
                              }}
                              className="w-full py-3 bg-emerald-500 text-slate-950 font-black rounded-xl hover:bg-emerald-400 active:scale-95 transition-all text-xs cursor-pointer font-bold"
                            >
                              ✨ ¡Misión Cumplida! ✨
                            </button>
                          ) : (
                            <div className="space-y-4">
                              <p className="text-emerald-400 text-xs font-black animate-pulse flex items-center justify-center gap-1.5">
                                <span>🎉</span> ¡Taller Completado con Éxito!
                              </p>

                              {/* Formulario de envío del test evaluativo al profesor */}
                              <div className="bg-slate-950 p-4 rounded-xl border border-teal-500/25 space-y-3 text-left">
                                <label className="text-[10px] font-black text-teal-400 uppercase block">
                                  Enviar mi Examen al Profesor:
                                </label>
                                
                                {isSubmissionSuccess ? (
                                  <div className="p-3 rounded bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-black text-center animate-pulse">
                                    ✓ ¡Test enviado con éxito al panel del profesor! 👍
                                  </div>
                                ) : (
                                  <div className="flex gap-2">
                                    <input
                                      type="text"
                                      value={studentSubmissionName}
                                      onChange={(e) => setStudentSubmissionName(e.target.value)}
                                      placeholder="Escribe tu nombre y apellido..."
                                      className="flex-1 bg-slate-900 border border-slate-700 px-3 py-2 rounded-lg text-xs font-bold text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-400"
                                      disabled={isSubmittingExam}
                                    />
                                    <button
                                      onClick={async () => {
                                        if (!studentSubmissionName.trim()) {
                                          return alert("Por favor ingresa tu nombre antes de enviar.");
                                        }
                                        setIsSubmittingExam(true);
                                        try {
                                          const res = await fetch('/api/evaluaciones', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({
                                              studentName: studentSubmissionName,
                                              grupoId: id,
                                              grupoName: data.name,
                                              points: points,
                                              heartsLeft: hearts
                                            })
                                          });
                                          if (res.ok) {
                                            setIsSubmissionSuccess(true);
                                            playSound('triumph');
                                          } else {
                                            alert("Error al enviar el examen.");
                                          }
                                        } catch (e) {
                                          alert("Error de red.");
                                        } finally {
                                          setIsSubmittingExam(false);
                                        }
                                      }}
                                      disabled={isSubmittingExam}
                                      className="px-4 py-2 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-950 font-black rounded-lg text-xs cursor-pointer active:scale-95 transition-all"
                                    >
                                      {isSubmittingExam ? "Enviando..." : "🚀 Enviar Test"}
                                    </button>
                                  </div>
                                )}
                              </div>
                              <button
                                onClick={() => {
                                  setHearts(7);
                                  setLastResult('none');
                                  setCurrentQuestionIdx(0);
                                  setSelectedOptionIdx(null);
                                  setIsAnswered(false);
                                  setPoints(0);
                                  setTriviarteStep('trivia');
                                  
                                  setSelectedMixColors([]);
                                  setMixCompleted(false);

                                  const scrambled = [
                                    { id: 0, text: "☀️ El Sol Radiante (Cielo)", correctPos: 0 },
                                    { id: 1, text: "⛰️ Las Grandes Montañas (Fondo)", correctPos: 1 },
                                    { id: 2, text: "🌴 Las Palmeras de Cera (Centro)", correctPos: 2 },
                                    { id: 3, text: "🌾 Las Flores del Valle (Suelo)", correctPos: 3 }
                                  ].sort(() => Math.random() - 0.5);
                                  setPuzzlePieces(scrambled);
                                  setPuzzleCompleted(false);
                                  setSelectedPieceIdx(null);

                                  const pairs = MATCHING_PAIRS[id] || MATCHING_PAIRS['primero'];
                                  setMatchPairs(pairs.map(p => ({ ...p, matched: false })));
                                  setMatchShuffledDefs([...Array(pairs.length).keys()].sort(() => Math.random() - 0.5));
                                  setMatchCompleted(false);
                                  setMatchSelectedTerm(null);
                                  setMatchSelectedDef(null);

                                  setRhythmGoalIdx(Math.floor(Math.random() * 3));
                                  setRhythmSelectedIdx(null);
                                  setRhythmAnswered(false);

                                  setSelectedMission(null);
                                  setMissionCompleted(false);
                                  setRouletteAngle(0);
                                  localStorage.setItem('mobilart_artipuntos', '0');
                                }}
                                className="w-full py-2 bg-slate-800 text-slate-300 font-bold rounded-xl hover:bg-slate-700 active:scale-95 transition-all text-xs cursor-pointer"
                              >
                                🔄 Repetir Aventura Evaluativa
                              </button>
                              
                              <div className="text-slate-400 text-[10px] font-semibold leading-relaxed border-t border-white/5 pt-3">
                                Has puesto en práctica los tres ejes de Educación Artística del MEN: <strong>Sensibilidad</strong>, <strong>Creación</strong> y <strong>Comprensión</strong>. ¡Excelente labor de aprendizaje activo!
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                </>)}

              </div>
            </Reveal>
          </section>
        )}

      </div>
      <StudentAlbum />
    </main>
    </ErrorBoundary>
  );
}
