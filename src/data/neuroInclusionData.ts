export interface ConditionData {
  id: string;
  name: string;
  emoji: string;
  color: string;
  borderColor: string;
  bgColor: string;
  definition: string;
  classroomManifestation: string;
  artisticFocus: string;
  practicalAppStrategy: string;
  classroomTips: string[];
}

export const CONDITIONS: ConditionData[] = [
  {
    id: "tdah",
    name: "TDAH",
    emoji: "⚡",
    color: "from-amber-400 to-orange-500",
    borderColor: "border-orange-200",
    bgColor: "bg-orange-50/50",
    definition: "El Trastorno por Déficit de Atención e Hiperactividad es una condición del neurodesarrollo que influye en cómo el cerebro procesa la concentración, regula los impulsos y canaliza la energía física.",
    classroomManifestation: "En el aula, se observa como dificultad para seguir instrucciones largas, distractibilidad ante pequeños estímulos, inquietud motora constante (moverse en el asiento) e impulsividad al responder o tomar turnos.",
    artisticFocus: "Canalizar la energía mediante el arte cinético y altamente táctil. Se deben dividir los procesos en micro-desafíos estructurados que ofrezcan recompensas visuales inmediatas para mantener la dopamina y el interés altos.",
    practicalAppStrategy: "El 'Lienzo Táctil' con pintura continua y efectos mágicos interactivos, junto con el 'Piano Didáctico' de guía visual amarilla y confeti inmediato, son ideales. Mantienen la atención activa a través del feedback sensorial instantáneo sin provocar frustración por fallas.",
    classroomTips: [
      "Divide los proyectos artísticos en pasos cortos (máximo 10 minutos por paso).",
      "Permite que realicen actividades de pie o usando técnicas que impliquen movimiento de todo el cuerpo (ej. muralismo o modelado de arcilla).",
      "Dale un rol activo en la organización de los materiales para canalizar su inquietud motora de forma positiva."
    ]
  },
  {
    id: "dislexia",
    name: "Dislexia",
    emoji: "✏️",
    color: "from-blue-400 to-indigo-500",
    borderColor: "border-indigo-200",
    bgColor: "bg-indigo-50/50",
    definition: "La dislexia es una condición de origen neurobiológico que afecta el procesamiento fonológico y la decodificación verbal, lo que repercute directamente en la fluidez de lectura y ortografía.",
    classroomManifestation: "En el aula, se nota cuando un estudiante confunde el orden o la orientación de letras (como b/d o p/q), lee de forma lenta o pausada, y tiene dificultades para memorizar instrucciones que son 100% basadas en texto.",
    artisticFocus: "Potenciar el pensamiento visual y espacial como un lenguaje alternativo de baja carga cognitiva. Las artes visuales puras, el color y la música permiten al alumno expresarse con total elocuencia y asimilar conceptos abstractos sin la barrera de la lectoescritura.",
    practicalAppStrategy: "Las 'Galerías Sensoriales 3D' de Colombia Viva eliminan la presión textual. Permiten al estudiante sumergirse en paisajes sonoros y formas monumentales autoiluminadas, asimilando conceptos sobre la paz, la identidad y la naturaleza a través del canal visual y auditivo.",
    classroomTips: [
      "Sustituye bloques largos de texto por diagramas, iconos de colores y elementos visuales.",
      "Evalúa sus ideas a través de dibujos, mapas conceptuales visuales o maquetas en lugar de ensayos escritos largos.",
      "Usa fuentes amigables para dislexia y contrastes altos de fondo oscuro (como nuestro modo 3D premium)."
    ]
  },
  {
    id: "discalculia",
    name: "Discalculia",
    emoji: "🧩",
    color: "from-teal-400 to-emerald-500",
    borderColor: "border-teal-200",
    bgColor: "bg-teal-50/50",
    definition: "La discalculia es una condición específica del aprendizaje que afecta la adquisición de habilidades matemáticas, dificultando la comprensión del sentido numérico, proporciones y secuencias.",
    classroomManifestation: "En el aula, se hace visible cuando el estudiante tiene problemas severos para contar colecciones de objetos, estimar proporciones visuales en un dibujo, orientarse en el plano del papel o comprender secuencias de tiempo y ritmo.",
    artisticFocus: "Abordar la matemática de forma intuitiva, física y estética. El arte utiliza patrones geométricos, simetrías, ritmos y escalas. Esto permite al cerebro asimilar las relaciones espaciales y de cantidad mediante estímulos tangibles, acústicos y de color.",
    practicalAppStrategy: "El minijuego de 'Mezcla Cromática' (proporciones de color sin números) y el 'Rompecabezas Espacial' (organización de capas arriba-abajo) entrenan de forma lúdica las habilidades visuoespaciales. De igual forma, el 'Oído Rítmico' traduce secuencias numéricas en ritmos acústicos intuitivos.",
    classroomTips: [
      "Enseña matemáticas y geometría a través del arte: patrones de mosaicos, origami y plegado de papel.",
      "Utiliza colores específicos para representar cantidades o proporciones en lugar de números abstractos.",
      "Permite el uso de herramientas físicas de medición y comparación táctil (regletas coloreadas, bloques táctiles)."
    ]
  }
];

// Datos del Test TDAH
export const TDAH_KEYWORDS = ["sensibilidad", "creatividad", "inclusión", "expresión", "sentidos"];
export const TDAH_TEXT_WORDS = [
  "La", "educación", "artística", "es", "un", "pilar", "de", "sensibilidad", "y", 
  "creatividad.", "Fomenta", "la", "inclusión", "y", "permite", "la", "libre", "expresión", 
  "de", "las", "emociones,", "logrando", "que", "el", "arte", "sea", "el", "canal", "que", 
  "conecte", "los", "sentidos", "con", "el", "aprendizaje."
];

export const TDAH_DISTRACTIONS = [
  "¡Mira afuera! Un pajarito 🐦",
  "Tengo hambre... ¿Qué cenaré hoy? 🍕",
  "¿El profesor me estará mirando? 😳",
  "¡Mensaje de WhatsApp! 📱",
  "Qué aburrida esta clase... 💤",
  "Tengo calor en el salón 🥵",
  "Necesito mover el pie ya 🦶",
  "Ese foco hace un zumbido... 💡"
];

// Texto base de Dislexia
export const DYSLEXIA_BASE_TEXT = 
  "La educación artística es un derecho fundamental estipulado en el Artículo 67. Desarrolla la sensibilidad, la creatividad y fomenta el pensamiento crítico en los niños y jóvenes, permitiéndoles transformar la sociedad desde la empatía.";
