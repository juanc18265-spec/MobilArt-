"use client";
import { useState, useRef, useEffect } from "react";
import Reveal from "./Reveal";

import { TallerEmocional, EMOCIONES, PianoKey, PIANO_KEYS, Song, SONGS } from '@/data/emocionesData';

export default function Emocionometro() {
  const [emocionActiva, setEmocionActiva] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"taller" | "canvas" | "piano">("taller");

  // 🖌️ Drawing Canvas State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [brushColor, setBrushColor] = useState("#3b82f6");
  const [brushWidth, setBrushWidth] = useState(12);
  const [brushStyle, setBrushStyle] = useState<"standard" | "watercolor" | "neon" | "mirror">("standard");
  const [canvasSound, setCanvasSound] = useState(true);

  // Audio Context reference for synthesizer drawing
  const audioCtxRef = useRef<AudioContext | null>(null);
  const drawOscRef = useRef<OscillatorNode | null>(null);
  const drawGainRef = useRef<GainNode | null>(null);

  // 🎹 Piano State
  const [activeSongIdx, setActiveSongIdx] = useState<number | null>(null);
  const [songProgressIdx, setSongProgressIdx] = useState(0);
  const [songCompleted, setSongCompleted] = useState(false);
  const [playedPianoKey, setPlayedPianoKey] = useState<string | null>(null);

  // Synced theme brushes when emotion shifts
  useEffect(() => {
    if (emocionActiva) {
      setBrushColor(EMOCIONES[emocionActiva].colorPincel);
      // Auto assign special sensory styles based on feelings
      if (emocionActiva === "ira") setBrushStyle("neon");
      else if (emocionActiva === "tristeza") setBrushStyle("watercolor");
      else if (emocionActiva === "calma") setBrushStyle("mirror");
      else setBrushStyle("standard");
    }
  }, [emocionActiva]);

  // Prevent scrolling while drawing on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const preventScroll = (e: TouchEvent) => e.preventDefault();
    canvas.addEventListener("touchstart", preventScroll, { passive: false });
    canvas.addEventListener("touchmove", preventScroll, { passive: false });
    return () => {
      canvas.removeEventListener("touchstart", preventScroll);
      canvas.removeEventListener("touchmove", preventScroll);
    };
  }, [activeTab]);

  // Set up canvas size exactly ONCE per tab change to prevent wipeouts
  useEffect(() => {
    if (activeTab === "canvas" && canvasRef.current) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      
      // Assign size only if not matching, to prevent canvas erasure
      if (canvas.width !== (rect.width || 600) || canvas.height !== 380) {
        canvas.width = rect.width || 600;
        canvas.height = 380;
        
        const ctx = canvas.getContext("2d");
        if (ctx && emocionActiva) {
          const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
          gradient.addColorStop(0, "#0f172a");
          gradient.addColorStop(0.5, "#1e293b");
          gradient.addColorStop(1, "#0f172a");
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }
    }
    // Shut down any drawing oscillator
    stopDrawSound();
  }, [activeTab, emocionActiva]);

  // Cleanup drawing synthesizer audio on unmount
  useEffect(() => {
    return () => {
      stopDrawSound();
    };
  }, []);

  // 🔊 Audio Synth Helper for Piano
  const playPianoTone = (freq: number) => {
    if (typeof window === "undefined") return;
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtxClass();
      
      const osc = ctx.createOscillator();
      const subOsc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Flute + Triangle piano-like texture
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      subOsc.type = "triangle";
      subOsc.frequency.setValueAtTime(freq * 0.5, ctx.currentTime); // rich sub-body

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1200, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.9);

      gainNode.gain.setValueAtTime(0.35, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

      osc.connect(filter);
      subOsc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start();
      subOsc.start();
      osc.stop(ctx.currentTime + 1.3);
      subOsc.stop(ctx.currentTime + 1.3);
    } catch (e) {
      console.warn("Audio Context blocked or unsupported:", e);
    }
  };

  // 🔊 Theremin Synth for Drawing Canvas
  const startDrawSound = (initialYRatio: number) => {
    if (!canvasSound || typeof window === "undefined") return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioCtxClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Custom wave signature depending on style
      if (brushStyle === "neon") {
        osc.type = "sawtooth";
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(400, ctx.currentTime);
      } else if (brushStyle === "watercolor") {
        osc.type = "triangle";
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(300, ctx.currentTime);
      } else {
        osc.type = "sine";
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(800, ctx.currentTime);
      }

      const freq = 180 + (1 - initialYRatio) * 600;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(brushStyle === "neon" ? 0.04 : 0.12, ctx.currentTime + 0.05);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      drawOscRef.current = osc;
      drawGainRef.current = gain;
    } catch (e) {
      console.warn(e);
    }
  };

  const updateDrawSound = (yRatio: number) => {
    if (!canvasSound || !drawOscRef.current || !audioCtxRef.current) return;
    const freq = 180 + (1 - yRatio) * 600;
    drawOscRef.current.frequency.setTargetAtTime(freq, audioCtxRef.current.currentTime, 0.05);
  };

  const stopDrawSound = () => {
    try {
      if (drawGainRef.current && audioCtxRef.current) {
        const g = drawGainRef.current;
        const ctx = audioCtxRef.current;
        g.gain.cancelScheduledValues(ctx.currentTime);
        g.gain.setValueAtTime(g.gain.value, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        
        const osc = drawOscRef.current;
        setTimeout(() => {
          try { osc?.stop(); } catch(e){}
        }, 120);
      }
    } catch(e){}
    drawOscRef.current = null;
    drawGainRef.current = null;
  };

  // 🖌️ Coordinates helper
  const getCoordinates = (e: any) => {
    if (!canvasRef.current) return { x: 0, y: 0, yRatio: 0.5 };
    const rect = canvasRef.current.getBoundingClientRect();
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
      yRatio: Math.max(0, Math.min(1, (clientY - rect.top) / rect.height))
    };
  };

  const startPainting = (e: any) => {
    e.preventDefault();
    if (!canvasRef.current) return;

    const { x, y, yRatio } = getCoordinates(e);
    setIsDrawing(true);
    setLastPos({ x, y });

    // Audio Theremin
    startDrawSound(yRatio);
  };

  // Draws a beautiful, high-performance continuous segment
  const drawStroke = (e: any) => {
    if (!isDrawing || !canvasRef.current) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const { x, y, yRatio } = getCoordinates(e);
    
    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(x, y);

    ctx.lineWidth = brushWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Style brush settings
    if (brushStyle === "neon") {
      ctx.strokeStyle = brushColor;
      ctx.shadowBlur = 12;
      ctx.shadowColor = brushColor;
    } else if (brushStyle === "watercolor") {
      ctx.strokeStyle = brushColor + "22"; // wet watercolor trail
      ctx.shadowBlur = 0;
      ctx.shadowColor = "transparent";
    } else {
      ctx.strokeStyle = brushColor;
      ctx.shadowBlur = 0;
      ctx.shadowColor = "transparent";
    }

    ctx.stroke();

    // Symmetrical drawing
    if (brushStyle === "mirror") {
      const width = canvasRef.current.width;
      const mirrorStartX = width - lastPos.x;
      const mirrorEndX = width - x;
      
      ctx.beginPath();
      ctx.moveTo(mirrorStartX, lastPos.y);
      ctx.lineTo(mirrorEndX, y);
      ctx.stroke();
    }

    setLastPos({ x, y });
    updateDrawSound(yRatio);
  };

  const stopPainting = () => {
    setIsDrawing(false);
    stopDrawSound();
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // Draw background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvasRef.current.width, canvasRef.current.height);
    gradient.addColorStop(0, "#0f172a");
    gradient.addColorStop(0.5, "#1e293b");
    gradient.addColorStop(1, "#0f172a");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const downloadCanvas = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = `mi_emocion_canvas.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  // 🎹 Piano Logics
  const handlePianoKeyClick = (key: PianoKey) => {
    playPianoTone(key.freq);
    setPlayedPianoKey(key.note);
    setTimeout(() => setPlayedPianoKey(null), 300);

    // If a peace song is active, check note matching
    if (activeSongIdx !== null) {
      const activeSong = SONGS[activeSongIdx];
      const targetNote = activeSong.notes[songProgressIdx];

      if (key.note === targetNote) {
        const nextIdx = songProgressIdx + 1;
        if (nextIdx >= activeSong.notes.length) {
          setSongCompleted(true);
          // Play triumph chime
          setTimeout(() => playPianoTone(523.25 * 1.5), 150); 
        } else {
          setSongProgressIdx(nextIdx);
        }
      }
    }
  };

  return (
    <div className="bg-white border-4 border-slate-900 rounded-3xl p-6 md:p-8 shadow-[8px_8px_0_rgba(15,23,42,1)]" id="emocionometro">
      
      {/* Header Info */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="bg-rose-100 text-rose-800 text-xs font-extrabold px-3 py-1 rounded-full border border-rose-300 uppercase">
            Innovación en el Aula
          </span>
          <span className="text-slate-500 text-sm font-bold">Herramienta de Regulación</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-slate-900" style={{ fontFamily: "'Outfit', 'DM Sans', sans-serif" }}>
          🎭 El Emocionómetro del Arte
        </h2>
        <p className="text-slate-600 font-semibold text-sm md:text-base mt-2">
          ¿Cómo te sientes hoy? Selecciona tu estado emocional para desbloquear talleres colectivos, un lienzo interactivo táctil que dibuja con sonidos y un piano sensorial para aprender canciones de paz.
        </p>
      </div>

      {/* Grid of Emotions */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
        {Object.keys(EMOCIONES).map((key) => {
          const em = EMOCIONES[key];
          const isSelected = emocionActiva === key;
          return (
            <button
              key={key}
              onClick={() => {
                setEmocionActiva(key);
                setActiveTab("taller"); // resets to workshop instructions
                setSongCompleted(false);
                setSongProgressIdx(0);
              }}
              className={`flex flex-col items-center justify-center p-5 rounded-2xl border-3 transition-all duration-300 hover:scale-[1.05] cursor-pointer
                ${isSelected 
                  ? 'bg-slate-900 border-slate-900 text-white shadow-[4px_4px_0_rgba(20,184,166,1)] scale-[1.03]' 
                  : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100 hover:border-slate-350'
                }
              `}
            >
              <span className={`text-4xl mb-2 transition-transform duration-300 ${isSelected ? 'scale-125 rotate-6' : ''}`}>
                {em.emoji}
              </span>
              <span className="font-black text-xs md:text-sm">{em.nombre}</span>
            </button>
          );
        })}
      </div>

      {/* Activated Tabs inside selected emotion */}
      {emocionActiva ? (
        <Reveal key={emocionActiva}>
          <div className={`border-3 p-5 md:p-8 rounded-3xl transition-all duration-500 ${EMOCIONES[emocionActiva].claseColor}`}>
            
            {/* Emotion Card Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b-2 border-slate-900/10 pb-4">
              <div>
                <span className="text-[10px] font-extrabold tracking-widest text-slate-500 uppercase block mb-1">
                  Módulo de Arteterapia y Expresión
                </span>
                <h3 className="text-2xl font-black text-slate-950 flex items-center gap-2">
                  <span>{EMOCIONES[emocionActiva].emoji}</span>
                  {EMOCIONES[emocionActiva].nombre}
                </h3>
              </div>
              
              {/* Tab Selector */}
              <div className="flex bg-slate-950/10 p-1 rounded-xl border border-slate-950/10">
                <button
                  onClick={() => setActiveTab("taller")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${activeTab === "taller" ? "bg-white text-slate-950 shadow-sm" : "text-slate-700 hover:text-slate-950"}`}
                >
                  🛠️ Taller Aula
                </button>
                <button
                  onClick={() => setActiveTab("canvas")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${activeTab === "canvas" ? "bg-white text-slate-950 shadow-sm" : "text-slate-700 hover:text-slate-950"}`}
                >
                  🖌️ Lienzo Táctil
                </button>
                <button
                  onClick={() => setActiveTab("piano")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${activeTab === "piano" ? "bg-white text-slate-950 shadow-sm" : "text-slate-700 hover:text-slate-950"}`}
                >
                  🎹 Piano Sensorial
                </button>
              </div>
            </div>

            {/* TAB 1: TRADITIONAL MANUAL WORKSHOP */}
            {activeTab === "taller" && (
              <div className="space-y-6 anim-fade-in">
                {/* Reflection Card */}
                <div className="bg-white/40 p-4 rounded-xl border border-white/60">
                  <h4 className="font-extrabold text-sm mb-1 text-slate-900">🧘 Conciencia Emocional:</h4>
                  <p className="text-sm font-semibold leading-relaxed text-slate-800">
                    {EMOCIONES[emocionActiva].reflexion}
                  </p>
                </div>

                {/* Workshop Name & Goal */}
                <div>
                  <span className="font-extrabold uppercase text-[10px] tracking-wider block text-slate-500 mb-0.5">Taller Físico Sugerido:</span>
                  <h4 className="text-lg font-black text-slate-950 mb-1">{EMOCIONES[emocionActiva].taller}</h4>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
                    <strong>Objetivo:</strong> {EMOCIONES[emocionActiva].objetivo}
                  </p>
                </div>

                {/* Step-by-Step */}
                <div>
                  <h4 className="font-extrabold text-sm mb-2 text-slate-900">🛠️ Paso a paso en el salón de clases:</h4>
                  <ol className="space-y-3.5 pl-4 list-decimal text-xs md:text-sm font-semibold leading-relaxed text-slate-800">
                    {EMOCIONES[emocionActiva].pasos.map((paso, idx) => (
                      <li key={idx} className="pl-1">
                        {paso}
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Materials and Peace Message Footer */}
                <div className="grid sm:grid-cols-2 gap-6 pt-6 border-t border-slate-900/10">
                  <div>
                    <h4 className="font-extrabold text-sm mb-2 text-slate-900">🎒 Materiales Requeridos:</h4>
                    <div className="flex flex-wrap gap-2">
                      {EMOCIONES[emocionActiva].materiales.map((mat, idx) => (
                        <span key={idx} className="bg-white border border-slate-200 text-slate-800 text-xs font-black px-3 py-1.5 rounded-lg shadow-sm">
                          {mat}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white/60 p-4 rounded-xl border border-slate-900/10 flex items-center justify-center">
                    <p className="text-xs md:text-sm font-extrabold italic text-center leading-relaxed text-slate-950">
                      {EMOCIONES[emocionActiva].mensajePaz}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: TACTILE SENSORY CANVAS (DRAW & MAKE SOUNDS) */}
            {activeTab === "canvas" && (
              <div className="space-y-6 anim-fade-in">
                <div className="bg-slate-950/5 p-4 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 border border-slate-950/10">
                  ⚡ <strong>Lienzo Expresivo Táctil:</strong> Arrastra tu dedo o mouse sobre la pantalla para pintar. Al dibujar, se creará un **sonido Theremin** continuo que sube y baja de tono según la altura de tu trazo. ¡Una verdadera sinfonía de tus emociones!
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Tools Panel */}
                  <div className="lg:w-1/4 space-y-4 bg-white/50 p-4 rounded-2xl border border-slate-900/5 flex flex-col justify-between">
                    <div className="space-y-4">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Ajustes del Pincel</span>
                      
                      {/* Color list */}
                      <div>
                        <span className="text-xs font-black block mb-2 text-slate-700">Paleta de Colores:</span>
                        <div className="flex flex-wrap gap-2">
                          {["#ef4444", "#3b82f6", "#f59e0b", "#eab308", "#10b981", "#ec4899", "#8b5cf6", "#1e293b"].map((c) => (
                            <button
                              key={c}
                              onClick={() => setBrushColor(c)}
                              className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer ${brushColor === c ? "border-slate-950 scale-110 shadow-md" : "border-transparent"}`}
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Brush thickness slider */}
                      <div>
                        <div className="flex justify-between text-xs font-black text-slate-700 mb-1">
                          <span>Grosor:</span>
                          <span>{brushWidth}px</span>
                        </div>
                        <input
                          type="range"
                          min="4"
                          max="40"
                          value={brushWidth}
                          onChange={(e) => setBrushWidth(parseInt(e.target.value))}
                          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                        />
                      </div>

                      {/* Brush style */}
                      <div>
                        <span className="text-xs font-black block mb-2 text-slate-700">Efecto Sensorial:</span>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: "standard", label: "🎨 Normal" },
                            { id: "watercolor", label: "💧 Acuarela" },
                            { id: "neon", label: "✨ Neón Reluciente" },
                            { id: "mirror", label: "🪞 Espejo Zen" }
                          ].map((style) => (
                            <button
                              key={style.id}
                              onClick={() => setBrushStyle(style.id as any)}
                              className={`px-2 py-1.5 rounded-lg text-[10px] font-black border transition-all cursor-pointer
                                ${brushStyle === style.id 
                                  ? "bg-slate-900 border-slate-900 text-white" 
                                  : "bg-white/60 border-slate-200 text-slate-800 hover:bg-white"
                                }
                              `}
                            >
                              {style.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Sound toggle */}
                      <div className="flex items-center justify-between border-t border-slate-900/10 pt-3">
                        <span className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                          <span>🔊</span> Theremin Sonoro:
                        </span>
                        <button
                          onClick={() => {
                            setCanvasSound(!canvasSound);
                            stopDrawSound();
                          }}
                          className={`px-3 py-1 rounded-full text-xs font-black cursor-pointer border ${canvasSound ? "bg-emerald-500 text-white border-emerald-600" : "bg-slate-300 text-slate-700 border-slate-400"}`}
                        >
                          {canvasSound ? "ACTIVADO" : "MUTEAR"}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 pt-4 border-t border-slate-900/10">
                      <button
                        onClick={clearCanvas}
                        className="w-full py-2.5 bg-slate-800 text-white font-black text-xs rounded-xl hover:bg-slate-900 transition-all cursor-pointer uppercase tracking-wider"
                      >
                        🧹 Reiniciar Lienzo
                      </button>
                      <button
                        onClick={downloadCanvas}
                        className="w-full py-2.5 bg-white text-slate-900 border-2 border-slate-900 font-black text-xs rounded-xl hover:bg-slate-50 transition-all cursor-pointer uppercase tracking-wider"
                      >
                        💾 Guardar Dibujo
                      </button>
                    </div>
                  </div>

                  {/* Responsive Drawing Area */}
                  <div className="flex-1 bg-slate-950 rounded-2xl overflow-hidden border-4 border-slate-900 shadow-md relative">
                    <canvas
                      ref={canvasRef}
                      onMouseDown={startPainting}
                      onMouseMove={drawStroke}
                      onMouseUp={stopPainting}
                      onMouseLeave={stopPainting}
                      onTouchStart={startPainting}
                      onTouchMove={drawStroke}
                      onTouchEnd={stopPainting}
                      className="w-full block bg-[#0f172a] h-[380px] cursor-crosshair touch-none"
                    />

                    {/* Canvas Floating Tip */}
                    <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 pointer-events-none text-[10px] text-white/60 font-medium">
                      Pincel Activo: <strong className="text-teal-400 uppercase">{brushStyle}</strong> | {brushWidth}px
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: SENSORY PIANO (LEARN SONGS FOR PEACE) */}
            {activeTab === "piano" && (
              <div className="space-y-6 anim-fade-in">
                
                {/* Melodías catalog selector */}
                <div className="bg-slate-950/5 p-4 rounded-xl border border-slate-950/10 space-y-4">
                  <div>
                    <h4 className="text-sm font-black text-slate-950 mb-1">🎹 Escuela de Melodías de la Paz</h4>
                    <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                      Elige una de las partituras didácticas a continuación. El piano iluminará con una guía amarilla la siguiente nota que debes tocar. ¡Completa la melodía para recibir tu premio artístico!
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {SONGS.map((song, idx) => {
                      const isActive = activeSongIdx === idx;
                      return (
                        <button
                          key={song.id}
                          onClick={() => {
                            setActiveSongIdx(idx);
                            setSongProgressIdx(0);
                            setSongCompleted(false);
                            playPianoTone(261.63); // chime cue
                          }}
                          className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between h-20
                            ${isActive
                              ? "bg-slate-900 border-slate-900 text-white shadow-md scale-[1.02]"
                              : "bg-white/80 border-slate-200 text-slate-800 hover:bg-white"
                            }
                          `}
                        >
                          <span className="font-extrabold text-xs leading-tight line-clamp-1">{song.name}</span>
                          <div className="flex justify-between items-center w-full">
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-wider ${song.difficultyClass}`}>
                              {song.difficulty}
                            </span>
                            <span className="text-lg">{song.emoji}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Piano Interactive Song Visual Guide */}
                {activeSongIdx !== null && (
                  <div className="bg-white/40 p-4 rounded-2xl border border-white/60 space-y-3 anim-fade-in">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-slate-700">Melodía en Curso:</span>
                      <button
                        onClick={() => {
                          setActiveSongIdx(null);
                          setSongCompleted(false);
                        }}
                        className="text-xs font-black text-slate-500 hover:text-slate-800 underline cursor-pointer"
                      >
                        ❌ Cancelar Partitura
                      </button>
                    </div>

                    {!songCompleted ? (
                      <div className="space-y-3">
                        {/* Progressive Notes Ribbon */}
                        <div className="flex items-center gap-1.5 flex-wrap bg-slate-900/5 p-3 rounded-xl border border-slate-950/5 justify-center">
                          {SONGS[activeSongIdx].notes.map((note, i) => {
                            const isCurrent = i === songProgressIdx;
                            const isPassed = i < songProgressIdx;
                            return (
                              <div
                                key={i}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black border transition-all
                                  ${isCurrent ? "bg-yellow-400 border-yellow-500 text-slate-950 scale-110 shadow-md animate-bounce" : ""}
                                  ${isPassed ? "bg-emerald-500 border-emerald-600 text-white opacity-60" : ""}
                                  ${!isCurrent && !isPassed ? "bg-white border-slate-200 text-slate-600" : ""}
                                `}
                              >
                                {PIANO_KEYS.find(k => k.note === note)?.label || note}
                              </div>
                            );
                          })}
                        </div>
                        
                        <p className="text-center text-xs font-black text-slate-800 uppercase tracking-wide">
                          👉 Toca la nota <strong className="text-amber-600 text-sm bg-yellow-300 px-2 py-0.5 rounded shadow-sm">{PIANO_KEYS.find(k => k.note === SONGS[activeSongIdx].notes[songProgressIdx])?.label}</strong> en el teclado inferior
                        </p>
                      </div>
                    ) : (
                      <div className="text-center space-y-2 py-3 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-xl anim-fade-in">
                        <span className="text-3xl block">🏆 ¡Maravilloso!</span>
                        <p className="text-xs sm:text-sm font-black text-emerald-800">
                          Has interpretado &quot;{SONGS[activeSongIdx].name}&quot; con sensibilidad y destreza musical.
                        </p>
                        <button
                          onClick={() => {
                            setSongProgressIdx(0);
                            setSongCompleted(false);
                          }}
                          className="px-4 py-1.5 bg-emerald-500 text-white font-black text-xs rounded-lg hover:bg-emerald-600 transition-colors cursor-pointer"
                        >
                          🔄 Volver a Tocar
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* THE PIANO KEYBOARD DESIGN (2 Octaves) */}
                <div className="bg-slate-950 p-4 md:p-6 rounded-3xl border-4 border-slate-900 shadow-lg relative select-none">
                  {/* Piano Brand Accent */}
                  <div className="w-full text-center text-white/20 text-[9px] font-black uppercase tracking-widest border-b border-white/5 pb-2.5 mb-4">
                    🔊 MOBILART SENSORY POLYPHONIC SYNTHESIZER
                  </div>

                  {/* Keyboard Frame */}
                  <div className="relative flex justify-center bg-slate-900/60 p-2 rounded-2xl overflow-x-auto min-w-0">
                    <div className="flex relative h-48 w-full max-w-4xl justify-between border-t border-slate-950">
                      
                      {/* White Keys Renderer */}
                      {PIANO_KEYS.filter(k => !k.isBlack).map((key, wIdx) => {
                        const isPlayed = playedPianoKey === key.note;
                        const isTarget = activeSongIdx !== null && !songCompleted && SONGS[activeSongIdx].notes[songProgressIdx] === key.note;
                        
                        return (
                          <button
                            key={key.note}
                            onClick={() => handlePianoKeyClick(key)}
                            className={`relative flex-1 h-full rounded-b-xl border-r border-slate-350 cursor-pointer shadow-inner flex flex-col justify-end items-center pb-3 text-[10px] font-extrabold transition-all duration-100 select-none
                              ${isPlayed 
                                ? "bg-slate-200 border-slate-400 translate-y-0.5 shadow-none" 
                                : "bg-white border-slate-200 hover:bg-slate-50"
                              }
                              ${isTarget ? "bg-yellow-100 border-yellow-300 ring-2 ring-yellow-400 ring-inset" : ""}
                            `}
                          >
                            <span className={`${isTarget ? "text-amber-800 scale-110 font-black animate-pulse" : "text-slate-400"}`}>
                              {key.label}
                            </span>
                            <span className="text-[7px] text-slate-300 block uppercase font-bold mt-0.5">{key.note}</span>

                            {/* Nest absolute black keys over the white keys' dividing lines */}
                            {key.rightBlack && (
                              <div
                                onClick={(e) => {
                                  e.stopPropagation(); // prevent triggering parent white key
                                  const bk = PIANO_KEYS.find(k => k.note === key.rightBlack);
                                  if (bk) handlePianoKeyClick(bk);
                                }}
                                className={`absolute top-0 right-0 translate-x-1/2 w-6 h-28 bg-slate-900 border-2 border-slate-950 rounded-b-md shadow-md cursor-pointer hover:bg-slate-800 active:bg-slate-950 transition-colors z-20 flex flex-col justify-end items-center pb-2 text-[8px] font-black select-none
                                  ${playedPianoKey === key.rightBlack ? "bg-slate-950 translate-y-0.5 shadow-none" : "bg-slate-900"}
                                  ${activeSongIdx !== null && !songCompleted && SONGS[activeSongIdx].notes[songProgressIdx] === key.rightBlack ? "bg-yellow-400 text-slate-950 border-yellow-500 animate-pulse" : "text-white/60"}
                                `}
                              >
                                <span>{PIANO_KEYS.find(k => k.note === key.rightBlack)?.label.replace("#", "#")}</span>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Ambient help footnote */}
                  <div className="text-center text-slate-500 text-[10px] font-semibold mt-3 flex items-center justify-center gap-1.5">
                    <span>💡</span> <em>Presiona o haz click sobre las teclas para reproducir hermosas vibraciones sintéticas en tiempo real.</em>
                  </div>
                </div>

              </div>
            )}

          </div>
        </Reveal>
      ) : (
        <Reveal>
          <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300">
            <span className="text-5xl block mb-3">🎭</span>
            <p className="text-slate-500 font-extrabold text-sm">
              Haz clic en una emoción arriba para cargar tu propuesta de taller personalizado.
            </p>
          </div>
        </Reveal>
      )}

    </div>
  );
}
