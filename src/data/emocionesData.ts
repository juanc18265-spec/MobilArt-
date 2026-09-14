export interface TallerEmocional {
  nombre: string;
  emoji: string;
  claseColor: string;
  claseBoton: string;
  reflexion: string;
  taller: string;
  objetivo: string;
  pasos: string[];
  materiales: string[];
  mensajePaz: string;
  // Custom theme colors for drawing and piano
  colorPincel: string;
  gradientCanvas: string[];
}

export const EMOCIONES: Record<string, TallerEmocional> = {
  ira: {
    nombre: "Enojo o Ira",
    emoji: "😡",
    claseColor: "bg-red-50 border-red-350 text-red-950 shadow-[6px_6px_0_rgba(239,68,68,1)]",
    claseBoton: "bg-red-500 hover:bg-red-600 text-white border-red-700",
    reflexion: "El enojo es una energía poderosa que a veces se acumula en nuestro cuerpo. En lugar de explotar contra los demás, podemos usar esa fuerza para crear obras de arte llenas de energía y textura.",
    taller: "🌋 El Volcán de Colores Expansivo",
    objetivo: "Liberar la tensión muscular y canalizar la impulsividad mediante trazos fuertes y técnicas de soplado o salpicado.",
    pasos: [
      "Toma un pliego de papel grande o cartón reciclado y colócalo en el piso o mesa.",
      "Aplica gotas grandes de pintura líquida (témpera o acuarela) de colores cálidos (rojo, naranja, amarillo) en el centro de la hoja.",
      "Usa un pitillo (sorbete) para soplar la pintura con fuerza en diferentes direcciones, creando la apariencia de una erupción volcánica, o golpea suavemente el pincel cargado para salpicar la pintura sobre el papel.",
      "Al finalizar, observa el dinamismo de las líneas y respira profundamente 3 veces, sintiendo cómo la tensión salió de tu cuerpo hacia el papel."
    ],
    materiales: ["Papel o cartón grande", "Témperas líquidas", "Pitillo o pinceles viejos"],
    mensajePaz: "🕊️ Mediación: El arte nos enseña que la fuerza no tiene que dañar a otros; se puede transformar en belleza y movimiento libre.",
    colorPincel: "#ef4444",
    gradientCanvas: ["#f87171", "#f97316", "#fbbf24"]
  },
  tristeza: {
    nombre: "Tristeza",
    emoji: "😢",
    claseColor: "bg-blue-50 border-blue-305 text-blue-950 shadow-[6px_6px_0_rgba(59,130,246,1)]",
    claseBoton: "bg-blue-500 hover:bg-blue-600 text-white border-blue-700",
    reflexion: "La tristeza nos invita a mirar hacia adentro, a descansar y a procesar los cambios. Es un momento propicio para el arte delicado, donde los colores se mezclan suavemente como lágrimas que sanan el alma.",
    taller: "🍃 El Jardín Secreto de las Acuarelas",
    objetivo: "Favorecer la introspección y la autocompasión mediante la mezcla fluida de colores en húmedo sobre húmedo.",
    pasos: [
      "Humedece toda la superficie de una hoja de papel grueso con un pincel y agua limpia.",
      "Coloca gotas suaves de pintura azul, violeta y verde. Observa cómo el agua expande los colores por sí sola de forma sutil y delicada.",
      "Dibuja líneas suaves con un lápiz o marcador fino encima de las manchas húmedas, creando formas de hojas, flores caídas o gotas de lluvia.",
      "Escribe una palabra de aliento para ti mismo en el borde del papel (ej. 'Está bien sentirme así', 'Soy valioso')."
    ],
    materiales: ["Papel grueso (ópalina o acuarela)", "Pincel", "Acuarelas o tinta", "Agua", "Marcador fino"],
    mensajePaz: "🕊️ Mediación: Reconocer nuestra propia tristeza nos ayuda a ser más empáticos con el dolor y los sentimientos de nuestros compañeros.",
    colorPincel: "#3b82f6",
    gradientCanvas: ["#60a5fa", "#818cf8", "#c084fc"]
  },
  ansiedad: {
    nombre: "Ansiedad o Miedo",
    emoji: "😰",
    claseColor: "bg-amber-50 border-amber-300 text-amber-950 shadow-[6px_6px_0_rgba(245,158,11,1)]",
    claseBoton: "bg-amber-500 hover:bg-amber-600 text-white border-amber-700",
    reflexion: "Cuando sentimos miedo o ansiedad, nuestra mente va muy rápido y el corazón late con prisa. El arte repetitivo e hilado nos ayuda a anclar el cuerpo en el presente y a calmar la respiración.",
    taller: "🌀 El Laberinto de Líneas Infinitas (Mandalas)",
    objetivo: "Disminuir el ritmo cardíaco y centrar la atención selectiva mediante patrones rítmicos y repetitivos.",
    pasos: [
      "Dibuja un círculo grande en el centro de tu hoja usando una taza o compás.",
      "Desde el centro del círculo, empieza a trazar líneas repetitivas: espirales, pequeños puntos, ondas o figuras geométricas continuas.",
      "Concéntrate únicamente en la punta del lápiz o marcador y en el sonido que hace al rozar el papel. Rellena el círculo despacio, sin prisa.",
      "Cada vez que sientas que tu mente se distrae con preocupaciones, regresa suavemente tu atención a la siguiente línea que vas a dibujar."
    ],
    materiales: ["Papel blanco", "Marcadores de colores o micropuntas", "Objetos circulares para calcar"],
    mensajePaz: "🕊️ Mediación: Encontrar la calma personal es el primer paso para poder escuchar y resolver pacíficamente cualquier malentendido.",
    colorPincel: "#f59e0b",
    gradientCanvas: ["#fbbf24", "#a78bfa", "#f472b6"]
  },
  alegria: {
    nombre: "Alegría",
    emoji: "🌟",
    claseColor: "bg-yellow-50 border-yellow-300 text-yellow-950 shadow-[6px_6px_0_rgba(234,179,8,1)]",
    claseBoton: "bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-700",
    reflexion: "La alegría es expansiva, luminosa y nos llena de ganas de compartir y reír. Es la chispa perfecta para crear proyectos colectivos que contagien de energía positiva a todo nuestro entorno escolar.",
    taller: "🎈 El Colaje Colectivo de la Gratitud",
    objetivo: "Fomentar la expresión de sentimientos positivos y el reconocimiento de valores comunitarios.",
    pasos: [
      "Busca revistas viejas, folletos de colores y papeles de regalo que ya no uses.",
      "Recorta imágenes, formas vibrantes y palabras que te hagan sentir feliz o agradecido.",
      "Pega estos elementos en una cartulina formando una composición libre llena de brillo, contrastes y dinamismo.",
      "Presenta tu colaje al salón y regálale una palabra bonita o un elogio sincero a un compañero de clase."
    ],
    materiales: ["Revistas viejas", "Tijeras", "Pegamento", "Cartulina escolar"],
    mensajePaz: "🕊️ Mediación: Compartir la alegría fortalece el tejido social del aula y crea lazos de confianza que previenen el acoso escolar.",
    colorPincel: "#eab308",
    gradientCanvas: ["#fef08a", "#f472b6", "#2dd4bf"]
  },
  calma: {
    nombre: "Calma",
    emoji: "🍃",
    claseColor: "bg-emerald-50 border-emerald-300 text-emerald-950 shadow-[6px_6px_0_rgba(16,185,129,1)]",
    claseBoton: "bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-700",
    reflexion: "La calma es el estado de paz y balance. Nos permite pensar con claridad y sentirnos en armonía. Es ideal para la contemplación, el detallismo y la creación con elementos suaves de la naturaleza.",
    taller: "🌸 Esculturas de Viento y Hojas Secas",
    objetivo: "Desarrollar la paciencia y el respeto por el medio ambiente mediante esculturas efímeras o arreglos naturales.",
    pasos: [
      "Recolecta hojas de árboles caídas de diferentes formas, ramitas, pétalos secos y piedrecillas.",
      "Sobre tu mesa, organiza estos elementos sin usar pegamento, creando patrones concéntricos, figuras de animales o mandalas orgánicos.",
      "Toma una fotografía digital de tu diseño (ya que es arte efímero que el viento se puede llevar).",
      "Devuelve los elementos suavemente a la tierra, agradeciendo por la tranquilidad del momento vivido."
    ],
    materiales: ["Elementos naturales sueltos", "Cámara de celular (opcional)"],
    mensajePaz: "🕊️ Mediación: Mantener la mente serena nos ayuda a tomar decisiones sabias y a ser gestores de reconciliación en nuestra comunidad.",
    colorPincel: "#10b981",
    gradientCanvas: ["#34d399", "#2dd4bf", "#60a5fa"]
  }
};

// 🎹 25-Key Piano Setup (2 Octaves: C4 to C6)
export interface PianoKey {
  note: string;
  label: string;
  freq: number;
  isBlack: boolean;
  rightBlack?: string; // Note name of black key sitting on the right edge
}

export const PIANO_KEYS: PianoKey[] = [
  { note: "C4", label: "Do", freq: 261.63, isBlack: false, rightBlack: "C#4" },
  { note: "C#4", label: "Do#", freq: 277.18, isBlack: true },
  { note: "D4", label: "Re", freq: 293.66, isBlack: false, rightBlack: "D#4" },
  { note: "D#4", label: "Re#", freq: 311.13, isBlack: true },
  { note: "E4", label: "Mi", freq: 329.63, isBlack: false },
  { note: "F4", label: "Fa", freq: 349.23, isBlack: false, rightBlack: "F#4" },
  { note: "F#4", label: "Fa#", freq: 369.99, isBlack: true },
  { note: "G4", label: "Sol", freq: 392.00, isBlack: false, rightBlack: "G#4" },
  { note: "G#4", label: "Sol#", freq: 415.30, isBlack: true },
  { note: "A4", label: "La", freq: 440.00, isBlack: false, rightBlack: "A#4" },
  { note: "A#4", label: "La#", freq: 466.16, isBlack: true },
  { note: "B4", label: "Si", freq: 493.88, isBlack: false },
  
  { note: "C5", label: "Do", freq: 523.25, isBlack: false, rightBlack: "C#5" },
  { note: "C#5", label: "Do#", freq: 554.37, isBlack: true },
  { note: "D5", label: "Re", freq: 587.33, isBlack: false, rightBlack: "D#5" },
  { note: "D#5", label: "Re#", freq: 622.25, isBlack: true },
  { note: "E5", label: "Mi", freq: 659.25, isBlack: false },
  { note: "F5", label: "Fa", freq: 698.46, isBlack: false, rightBlack: "F#5" },
  { note: "F#5", label: "Fa#", freq: 739.99, isBlack: true },
  { note: "G5", label: "Sol", freq: 783.99, isBlack: false, rightBlack: "G#5" },
  { note: "G#5", label: "Sol#", freq: 830.61, isBlack: true },
  { note: "A5", label: "La", freq: 880.00, isBlack: false, rightBlack: "A#5" },
  { note: "A#5", label: "La#", freq: 932.33, isBlack: true },
  { note: "B5", label: "Si", freq: 987.77, isBlack: false },
  
  { note: "C6", label: "Do", freq: 1046.50, isBlack: false }
];

export interface Song {
  id: string;
  name: string;
  difficulty: "Muy Fácil" | "Fácil" | "Medio" | "Difícil";
  difficultyClass: string;
  emoji: string;
  notes: string[];
}

export const SONGS: Song[] = [
  {
    id: "pollitos",
    name: "Los Pollitos Dicen 🐣",
    difficulty: "Muy Fácil",
    difficultyClass: "bg-emerald-100 text-emerald-800 border-emerald-300",
    emoji: "🐣",
    notes: ["C4", "D4", "E4", "F4", "G4", "G4", "A4", "A4", "G4", "F4", "F4", "E4", "E4", "D4", "D4", "C4"]
  },
  {
    id: "campanero",
    name: "Campanero (Martinillo) 🔔",
    difficulty: "Fácil",
    difficultyClass: "bg-teal-100 text-teal-800 border-teal-300",
    emoji: "🔔",
    notes: ["C4", "D4", "E4", "C4", "C4", "D4", "E4", "C4", "E4", "F4", "G4", "E4", "F4", "G4"]
  },
  {
    id: "estrellita",
    name: "Estrellita Dónde Estás 🌟",
    difficulty: "Fácil",
    difficultyClass: "bg-sky-100 text-sky-800 border-sky-300",
    emoji: "⭐",
    notes: ["C4", "C4", "G4", "G4", "A4", "A4", "G4", "F4", "F4", "E4", "E4", "D4", "D4", "C4"]
  },
  {
    id: "cumpleanos",
    name: "Feliz Cumpleaños Tradicional 🎂",
    difficulty: "Medio",
    difficultyClass: "bg-purple-100 text-purple-800 border-purple-300",
    emoji: "🎉",
    notes: ["C4", "C4", "D4", "C4", "F4", "E4", "C4", "C4", "D4", "C4", "G4", "F4"]
  },
  {
    id: "himno_alegria",
    name: "Himno a la Alegría 🕊️",
    difficulty: "Medio",
    difficultyClass: "bg-amber-100 text-amber-800 border-amber-300",
    emoji: "🕊️",
    notes: ["E4", "E4", "F4", "G4", "G4", "F4", "E4", "D4", "C4", "C4", "D4", "E4", "E4", "D4", "D4"]
  },
  {
    id: "patria_paz",
    name: "Melodía de la Paz Andina ⛰️",
    difficulty: "Difícil",
    difficultyClass: "bg-rose-100 text-rose-800 border-rose-300",
    emoji: "🎵",
    notes: ["E4", "G4", "A4", "C5", "A4", "G4", "E4", "G4", "A4", "G4", "E4", "D4", "C4"]
  }
];
