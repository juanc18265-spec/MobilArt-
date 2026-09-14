export const CURRICULUM_DATA: Record<string, {
  gradeGroup: string;
  tabs: {
    sensibilidad: {
      tituloTab: string;
      desempenos: string[];
      sugerencias: string[];
      actividad: { titulo: string; objetivo: string; pasos: string[]; materiales: string[]; evaluacion: string; }
    };
    creacion: {
      tituloTab: string;
      desempenos: string[];
      sugerencias: string[];
      actividad: { titulo: string; objetivo: string; pasos: string[]; materiales: string[]; evaluacion: string; }
    };
    comprension: {
      tituloTab: string;
      desempenos: string[];
      sugerencias: string[];
      actividad: { titulo: string; objetivo: string; pasos: string[]; materiales: string[]; evaluacion: string; }
    };
  }
}> = {
  primero: {
    gradeGroup: "Grados Primero a Tercero (1° a 3°)",
    tabs: {
      sensibilidad: {
        tituloTab: "Exploración Sensorial 👁️",
        desempenos: [
          "Reconozco y diferencio colores primarios y secundarios en el entorno escolar.",
          "Identifico texturas básicas (liso, áspero, suave, rugoso) mediante el tacto libre.",
          "Manifiesto asombro y curiosidad por los sonidos, colores e imágenes de mi escuela."
        ],
        sugerencias: [
          "Organizar caminatas y safaris sensoriales por el patio o salones para afinar los sentidos.",
          "Utilizar retazos de telas, lija, algodón y hojas secas para el desarrollo del tacto infantil."
        ],
        actividad: {
          titulo: "🦁 El Safari Táctil y la Textura Animal",
          objetivo: "Diferenciar texturas naturales mediante el tacto y pintar un colaje usando colores primarios.",
          pasos: [
            "Tocar varios objetos del aula (tableros, mochilas, hojas secas) con los ojos cerrados para identificar texturas.",
            "Recortar formas libres de diferentes papeles texturizados (lija fina, papel seda suave, periódico, cartón corrugado).",
            "Pegar los retazos rellenando la silueta de su animal favorito dibujado previamente en una hoja de bloc.",
            "Pintar las zonas restantes usando pinceles o dedos con los tres colores primarios puros."
          ],
          materiales: ["Hojas de bloc", "Papeles texturizados de descarte", "Témperas de colores primarios", "Pegamento escolar"],
          evaluacion: "Se evalúa la capacidad de clasificar texturas táctiles y el reconocimiento de colores puros."
        }
      },
      creacion: {
        tituloTab: "Expresión Creativa 🎨",
        desempenos: [
          "Modelo formas libres e ideas con plastilina, arcilla o masa de harina casera.",
          "Represento mis emociones primarias (alegría, tristeza, enojo) mediante la dactilopintura.",
          "Sigo instrucciones sencillas para elaborar juguetes u objetos lúdicos en clase."
        ],
        sugerencias: [
          "Ofrecer materiales blandos de fácil moldeo y pinturas de dedos libres de tóxicos para la dactilopintura.",
          "Propiciar espacios de juego simbólico y motivar al estudiante a hablar espontáneamente de sus creaciones."
        ],
        actividad: {
          titulo: "🌋 Escultura Emocional con Masa de Harina",
          objetivo: "Moldear formas que expresen sentimientos básicos y compartirlas de forma empática con el salón.",
          pasos: [
            "Preparar una masa simple en el salón mezclando harina de trigo, agua, sal de cocina y gotas de colorante.",
            "Modelar pequeños rostros o figuras tridimensionales que reflejen cómo se sienten hoy en la escuela.",
            "Dejar secar la masa al aire libre en bandejas de plástico.",
            "Reunir el grupo en círculo para exponer los trabajos y relatar el motivo de sus emociones."
          ],
          materiales: ["Harina de trigo", "Agua", "Sal", "Colorantes vegetales", "Bandejas"],
          evaluacion: "Se valora la destreza motriz en el modelado y la expresión oral de sus sentimientos."
        }
      },
      comprension: {
        tituloTab: "Aprecio de Obras 🏛️",
        desempenos: [
          "Reconozco los dibujos de mis compañeros como expresiones valiosas y diferentes a la mía.",
          "Asocio canciones infantiles y relatos ilustrados con tradiciones de mi región y familia.",
          "Respeto el turno y las opiniones de los demás durante las exposiciones grupales."
        ],
        sugerencias: [
          "Enseñar el aprecio constructivo y evitar la calificación dicotómica de 'bonito o feo' en las artes de primaria.",
          "Incorporar relatos locales y música folclórica colombiana sencilla durante el desarrollo de las sesiones."
        ],
        actividad: {
          titulo: "🌳 El Árbol Colectivo del Aprecio",
          objetivo: "Valorar de forma respetuosa y empática las creaciones artísticas de los compañeros de clase.",
          pasos: [
            "Dibujar en un pliego de papel periódico el tronco de un gran árbol y pegarlo en una pared del aula.",
            "Cada estudiante realiza un dibujo libre sobre su familia o juego favorito en el colegio.",
            "Recortar el dibujo en forma de hoja de árbol y pegarlo sobre las ramas del tronco común del salón.",
            "Por parejas, cada alumno comparte una frase de admiración sobre el dibujo de su compañero de equipo."
          ],
          materiales: ["Pliego de papel", "Hojas de bloc", "Colores y marcadores", "Cinta adhesiva"],
          evaluacion: "Se evalúa el comportamiento respetuoso, la cooperación grupal y la empatía oral."
        }
      }
    }
  },
  segundo: {
    gradeGroup: "Grados Primero a Tercero (1° a 3°)",
    tabs: {
      sensibilidad: {
        tituloTab: "Ritmo y Trazos 👁️",
        desempenos: [
          "Descubro sonidos corporales y su relación con el trazo lineal rítmico en papel.",
          "Identifico y contrasto formas orgánicas de la naturaleza con formas geométricas tradicionales.",
          "Expreso sensaciones térmicas (frío-cálido) y visuales a través del juego con acuarelas."
        ],
        sugerencias: [
          "Utilizar música instrumental nacional de fondo mientras los estudiantes dibujan líneas continuas.",
          "Guiar a los niños a observar las nervaduras de las hojas secas y compararlas con las líneas de su mano."
        ],
        actividad: {
          titulo: "🎵 El Ritmo que Dibuja mi Mano",
          objetivo: "Conectar estímulos auditivos rítmicos con la fluidez del trazo visual en el soporte de papel.",
          pasos: [
            "El docente reproduce ritmos variables con un tambor, pandereta o palmadas en el salón.",
            "Los niños siguen el ritmo trazando líneas curvas y lentas (ritmo suave) o en zig-zag (ritmo alegre y rápido).",
            "Pintar el espacio comprendido entre las líneas usando crayolas de colores cálidos y fríos según la música.",
            "Compartir el resultado y conversar sobre cómo influyó el ritmo musical en el movimiento de sus manos."
          ],
          materiales: ["Papel kraft o papel periódico", "Crayolas y lápices de colores", "Instrumento rítmico"],
          evaluacion: "Se valora la sincronía psicomotriz rítmica y la exploración de contrastes lineales."
        }
      },
      creacion: {
        tituloTab: "Creación Compartida 🎨",
        desempenos: [
          "Elaboro colajes sencillos usando material reciclado recolectado en casa o la escuela.",
          "Reconozco y utilizo la silueta humana básica en mis dibujos y juegos plásticos.",
          "Construyo juguetes sonoros tradicionales usando botellas vacías y semillas."
        ],
        sugerencias: [
          "Fomentar el trabajo colaborativo en parejas para fortalecer las habilidades sociales y el diálogo sincero.",
          "Proporcionar residuos limpios y seguros del hogar para darles una nueva vida artística (reciclaje)."
        ],
        actividad: {
          titulo: "🤝 Mi Silueta y la Tuya: Dibujo de Compañeros",
          objetivo: "Explorar la autoimagen y la imagen del otro mediante el trazo respetuoso de siluetas de manos o rostros.",
          pasos: [
            "Por parejas, un estudiante coloca su mano o el perfil de su rostro suavemente sobre una cartulina.",
            "El compañero traza el contorno con un lápiz suavemente y luego intercambian los roles.",
            "Adornar el interior de la silueta del compañero escribiendo o dibujando cualidades bonitas de él/ella.",
            "Pintar los fondos del dibujo con colores fríos que transmitan tranquilidad y amistad."
          ],
          materiales: ["Cartulinas escolares", "Lápices y marcadores", "Pinturas de agua"],
          evaluacion: "Se evalúa el trato respetuoso con el compañero y la riqueza expresiva de los detalles de la silueta."
        }
      },
      comprension: {
        tituloTab: "Tradiciones y Relatos 🏛️",
        desempenos: [
          "Identifico relatos de tradición oral que incluyan cantos o coplas de mi entorno regional.",
          "Interpreto y valoro los dibujos antiguos de las culturas indígenas de Colombia.",
          "Emito apreciaciones sencillas y respetuosas sobre mis propios avances artísticos."
        ],
        sugerencias: [
          "Presentar leyendas tradicionales colombianas asociadas al cuidado del agua y la fauna regional.",
          "Mostrar imágenes sencillas de arte pictográfico antiguo en piedras colombianas."
        ],
        actividad: {
          titulo: "🗺️ Pictogramas Ancestrales y la Piedra de la Paz",
          objetivo: "Comprender el arte indígena antiguo y expresar mensajes de respeto comunitario sobre piedras.",
          pasos: [
            "El docente muestra imágenes de figuras geométricas pintadas en piedra por los indígenas precolombinos.",
            "Cada niño busca una piedra lisa y limpia del patio del colegio.",
            "Con pinceles delgados y témpera blanca o negra, pintan pictogramas antiguos inspirados en los mostrados.",
            "Añaden al lado un símbolo personal inventado que represente la unión y reconciliación en el salón.",
            "Colocar todas las piedras juntas en un rincón del salón formando el Círculo de la Convivencia."
          ],
          materiales: ["Piedras lisas", "Témperas blanca/negra", "Pinceles delgados", "Imágenes precolombinas"],
          evaluacion: "Se valora la comprensión del arte como memoria y la destreza al pintar sobre superficies rocosas."
        }
      }
    }
  },
  tercero: {
    gradeGroup: "Grados Primero a Tercero (1° a 3°)",
    tabs: {
      sensibilidad: {
        tituloTab: "Muralismo y Espacio 👁️",
        desempenos: [
          "Percibo y describo la profundidad (cerca-lejos) en los paisajes naturales del colegio.",
          "Identifico y agrupo colores análogos y complementarios en ilustraciones escolares.",
          "Siento empatía al observar expresiones gestuales de enojo o agitación en mis compañeros."
        ],
        sugerencias: [
          "Guiar a los niños a observar cómo las montañas lejanas cambian de tono a colores más suaves debido a la distancia.",
          "Realizar dinámicas lúdicas de espejo gestual para concientizar sobre el lenguaje corporal de la calma."
        ],
        actividad: {
          titulo: "⛰️ El Paisaje Escolar con Profundidad",
          objetivo: "Representar la distancia espacial mediante planos de color y tamaño relativo de las formas.",
          pasos: [
            "Salir al patio del colegio a observar el paisaje: elementos cercanos (árboles grandes) y distantes (nubes, montañas).",
            "Trazar en la hoja de bloc una línea de horizonte y tres planos: primer plano (cercano), plano medio y fondo.",
            "Pintar el plano cercano con colores muy fuertes y definidos, y los planos de fondo más claros e indefinidos.",
            "Añadir pequeños dibujos de nubes o aves al fondo para reforzar la ilusión visual de lejanía."
          ],
          materiales: ["Hojas de bloc", "Témperas o lápices de colores", "Pinceles de diferentes grosores"],
          evaluacion: "Se evalúa la comprensión física de planos de profundidad y el difuminado tonal correcto."
        }
      },
      creacion: {
        tituloTab: "Creación Colectiva 🎨",
        desempenos: [
          "Diseño y pinto dibujos colectivos de gran formato en rollos de papel común.",
          "Modelo personajes mitológicos locales usando técnicas mixtas de modelado de plastilina.",
          "Colaboro activamente en la organización y limpieza del aula de arte escolar."
        ],
        sugerencias: [
          "Fomentar el hábito de limpiar cooperativamente el aula, asociando el orden con la paz comunitaria.",
          "Utilizar pliegos extensos de papel kraft pegados a lo largo de la pared del aula."
        ],
        actividad: {
          titulo: "🐉 Criaturas Mitológicas del Cuidado Ambiental",
          objetivo: "Crear una escultura combinando el modelado clásico de plastilina con elementos naturales secos.",
          pasos: [
            "Investigar una leyenda local colombiana que proteja el medio ambiente (ejemplo: la Madre Monte).",
            "Modelar el cuerpo del personaje con plastilina escolar de colores variados.",
            "Añadir detalles tridimensionales usando ramas secas, semillas, cortezas u hojas recolectadas del patio.",
            "Escribir una pequeña ficha en papel donde la criatura cuente su superpoder para cuidar los árboles del colegio.",
            "Montar una galería central en el salón con todas las esculturas ambientales."
          ],
          materiales: ["Plastilina de colores", "Semillas y ramitas secas", "Cartulina pequeña", "Marcadores"],
          evaluacion: "Se valora la originalidad del modelado y la integración armónica de materiales orgánicos."
        }
      },
      comprension: {
        tituloTab: "Identidad y Territorio 🏛️",
        desempenos: [
          "Comprendo que mi barrio y mi escuela tienen una memoria histórica plasmada en sus fachadas.",
          "Identifico y respeto las artesanías de los pueblos tradicionales colombianos de mi región.",
          "Formulo preguntas sencillas sobre el significado de un grafiti o pintura mural del barrio."
        ],
        sugerencias: [
          "Promover diálogos críticos y respetuosos frente a expresiones de arte urbano contemporáneo.",
          "Llevar al salón artesanías típicas colombianas reales (sombreros, mochilas) para debatir su función e historia."
        ],
        actividad: {
          titulo: "🏫 El Cronista de mi Escuela: Dibujando la Fachada",
          objetivo: "Indagar la memoria cultural del colegio y representarla artísticamente.",
          pasos: [
            "Hacer un breve recorrido grupal buscando paredes antiguas, murales del pasado o placas del colegio.",
            "Preguntar a un profesor veterano del colegio una anécdota alegre sobre los inicios de la institución.",
            "Dibujar en cartulina la fachada del colegio, integrando un elemento de la anécdota contada.",
            "Exponer el dibujo en clase detallando la historia y redactando un compromiso de cuidado del colegio."
          ],
          materiales: ["Cartulina escolar", "Lápices de dibujo", "Colores de madera y marcadores"],
          evaluacion: "Se evalúa la rigurosidad en la indagación del relato escolar y la representación de símbolos identitarios."
        }
      }
    }
  },
  cuarto: {
    gradeGroup: "Grados Cuarto y Quinto (4° a 5°)",
    tabs: {
      sensibilidad: {
        tituloTab: "Luz y Sombras 👁️",
        desempenos: [
          "Identifico la dirección de la luz y cómo genera volumen mediante sombras propias y proyectadas.",
          "Discrimino y mezclo una amplia variedad de tonos cromáticos usando el círculo de colores.",
          "Registro contrastes visuales de mi entorno escolar usando cámaras de celulares."
        ],
        sugerencias: [
          "Experimentar en el aula con linternas de celulares enfocando objetos para mostrar luces y sombras.",
          "Guiar a los alumnos en el uso de encuadres y planos fotográficos para capturar formas interesantes."
        ],
        actividad: {
          titulo: "☀️ El Taller de la Sombra y el Volumen Visual",
          objetivo: "Comprender la función del claroscuro para dar sensación de volumen tridimensional en una hoja plana.",
          pasos: [
            "Colocar un objeto del salón (taza, fruta o libro) sobre una mesa escolar con iluminación lateral clara.",
            "Observar detalladamente la zona de luz directa, la sombra propia en el objeto y la sombra proyectada en la mesa.",
            "Dibujar con lápiz suave (2B o 6B) el contorno del objeto imitando la dirección de los trazos del modelo.",
            "Difuminar suavemente los bordes con un algodón para degradar los tonos desde el negro profundo hasta el blanco."
          ],
          materiales: ["Hojas de dibujo", "Lápices 2B/6B", "Algodón o difuminador", "Objeto del salón"],
          evaluacion: "Se evalúa la correcta degradación tonal y la representación tridimensional de luces y sombras."
        }
      },
      creacion: {
        tituloTab: "Técnicas Mixtas 🎨",
        desempenos: [
          "Creo ensambles y estructuras tridimensionales con cartones y residuos de madera segura.",
          "Exploro la técnica del grabado en relieve utilizando patatas cortadas o planchas de fomi blandas.",
          "Demuestro persistencia y limpieza en el acabado estético final de todos mis proyectos artísticos."
        ],
        sugerencias: [
          "Introducir la importancia del 'acabado estético' y de cuidar la limpieza final de los trabajos entregados.",
          "Facilitar herramientas de grabado sencillas e inofensivas que no representen peligro físico."
        ],
        actividad: {
          titulo: "🥔 Grabado con Sello de Papa: Patrones Colectivos",
          objetivo: "Experimentar con técnicas de grabado y multiplicación de imágenes para crear estampados en equipo.",
          pasos: [
            "Cortar una papa cruda a la mitad bajo la supervisión directa y apoyo del docente.",
            "Tallar con una cuchara de plástico una forma sencilla en relieve (estrella, paloma, corazón).",
            "Impregnar la papa tallada con témpera espesa de colores alegres.",
            "Estampar repetidamente la papa sobre un gran rollo de papel kraft, creando un estampado rítmico grupal."
          ],
          materiales: ["Papas crudas grandes", "Témperas espesas", "Cucharas plásticas", "Rollo de papel kraft"],
          evaluacion: "Se valora la regularidad del estampado de patrones y el trabajo coordinado de los integrantes."
        }
      },
      comprension: {
        tituloTab: "Cultura y Diversidad 🏛️",
        desempenos: [
          "Identifico y respeto la diversidad plástica tradicional de los pueblos afrocolombianos e indígenas.",
          "Establezco diferencias básicas entre el arte académico de museo y las manifestaciones populares de mi región.",
          "Redacto descripciones sencillas de obras plásticas nacionales reconociendo su contexto social."
        ],
        sugerencias: [
          "Promover discusiones críticas sobre la importancia de las artes populares en la identidad colombiana.",
          "Estudiar el vestuario y las máscaras tradicionales de los carnavales de las diferentes regiones del país."
        ],
        actividad: {
          titulo: "🎭 Las Máscaras del Carnaval de Barranquilla",
          objetivo: "Analizar el valor de las máscaras folclóricas colombianas y modelar una réplica en cartón reciclado.",
          pasos: [
            "El docente presenta videos sobre los personajes tradicionales de los carnavales colombianos (ej. el Torito).",
            "Cada alumno recibe una base de cartón de huevo vacía o cartulina gruesa prensada.",
            "Recortar y decorar la base para recrear la máscara, usando colores brillantes y colajes de lanas o papeles.",
            "Redactar una ficha corta detallando la fiesta a la que pertenece la máscara y su importancia nacional."
          ],
          materiales: ["Cartón de huevo vacío", "Lanas y retazos de papel de color", "Témperas", "Ficha en blanco"],
          evaluacion: "Se valora el respeto por el trasfondo folclórico y la recursividad en el modelado tridimensional."
        }
      }
    }
  },
  quinto: {
    gradeGroup: "Grados Cuarto y Quinto (4° a 5°)",
    tabs: {
      sensibilidad: {
        tituloTab: "Sensibilidad Perceptiva 👁️",
        desempenos: [
          "Contrasto características del entorno natural que enriquezcan mi expresión, relacionándome experiencialmente.",
          "Exploro en la Web imágenes de la producción cultural que enriquezcan mis estructuras de referencia perceptivas.",
          "Me intereso por la comprensión del espacio y de las relaciones que percibo entre formas, tamaños, colores, texturas y volumen.",
          "Manifiesto mis experiencias sensoriales y emocionales con respecto a preferencias por expresiones plásticas, visuales y artesanales."
        ],
        sugerencias: [
          "Propiciar experiencias que motiven a los estudiantes a hacer conciencia de lo que ocurre en su mundo perceptivo (sensitividad), tanto natural como del colegio, barrio y entornos virtuales.",
          "Realizar actividades y proponer ejemplos que amplíen la capacidad de comprensión del espacio (relaciones espaciales, profundidad, línea horizonte, distancias cerca-lejos, discriminación del color, tonos y matices)."
        ],
        actividad: {
          titulo: "🔍 Cazadores del Color y el Detalle Natural",
          objetivo: "Agudizar la sensibilidad perceptiva y la discriminación de matices del color y texturas a través del entorno inmediato.",
          pasos: [
            "El docente organiza una salida pedagógica de 15 minutos al patio del colegio o parque cercano.",
            "Cada estudiante debe recolectar 5 elementos naturales (hojas secas, piedras, corteza de árbol, flores caídas, etc.).",
            "En el aula, usando la cámara de un celular con zoom o lupas, cada alumno debe observar a detalle las rugosidades y degradados de color.",
            "En una hoja de bloc, dibujarán cada objeto a gran escala (ampliando la forma y el volumen), pintando con lápices de colores intentando imitar con fidelidad los matices reales."
          ],
          materiales: ["Hojas de bloc", "Lápices de colores", "Lupas o cámaras de celular", "Elementos naturales recolectados"],
          evaluacion: "Se valora la capacidad del estudiante para identificar detalles en las texturas y representar la relación entre tamaño y espacio real."
        }
      },
      creacion: {
        tituloTab: "Producción-Creación 🎨",
        desempenos: [
          "Me expreso creativamente a partir de una idea y la búsqueda de posibles soluciones para su realización.",
          "Articulo mis intenciones expresivas con aspectos compositivos básicos del lenguaje de las artes plásticas.",
          "Persisto en la ejecución de mis trabajos expresivos aplicando conocimientos técnicos y procedimientos del lenguaje plástico y visual.",
          "Exploro posibilidades de expresión visual mediante herramientas digitales y nuevos medios."
        ],
        sugerencias: [
          "Promover el afinamiento de la motricidad mediante la exploración de los materiales para comprender su plasticidad (capacidad de ser transformada), introduciendo el concepto de técnica.",
          "Aprovechar los nuevos medios como recursos que permiten expresarse (herramientas visuales como cámaras de celulares, programas gráficos básicos).",
          "Familiarizar a los estudiantes con nociones de temática y narrativa que les permitan dar sentido a lo que hacen."
        ],
        actividad: {
          titulo: "🎨 El Mural del Portafolio de Paz: Ensamble Mixto",
          objetivo: "Expresar sentimientos de paz y reconciliación combinando técnicas plásticas manuales con herramientas digitales.",
          pasos: [
            "Cada estudiante recibe un pedazo de cartón reciclado cuadrado de 20x20 cm.",
            "Se dibuja una silueta que simbolice la paz o reconciliación familiar/escolar.",
            "Se decora usando técnicas mixtas: témperas mezcladas con aserrín o arena (para dar relieve/textura), colaje de papel periódico y elementos de la naturaleza.",
            "Se ensamblan todas las piezas individuales de los alumnos sobre un gran pliego de papel kraft en la pared del aula, formando un mural colectivo.",
            "Los estudiantes toman fotografías digitales del mural con sus celulares, explorando diferentes encuadres e iluminación, y las compilan en un portafolio fotográfico del salón."
          ],
          materiales: ["Cartón reciclado", "Témperas", "Aserrín o arena", "Colbón (pegamento)", "Cámaras de celular"],
          evaluacion: "Se evalúa la exploración técnica, la persistencia en el acabado físico, y el uso creativo de fotos digitales para el portafolio."
        }
      },
      comprension: {
        tituloTab: "Comprensión Crítico-Cultural 🏛️",
        desempenos: [
          "Comprendo que las creaciones artísticas, plásticas y visuales, son manifestaciones de los diversos contextos sociales, históricos y culturales.",
          "Realizo valoraciones básicas sobre aspectos formales de obras y prácticas plásticas y visuales (composición, técnicas, tratamiento del tema, etc.).",
          "Emito apreciaciones de obras y prácticas que circulan en los contextos artístico-culturales (análogos y virtuales), expresándome sobre sus significados."
        ],
        sugerencias: [
          "Motivar a la observación reflexiva de obras y prácticas artísticas plásticas (clásicas y contemporáneas), reparando en sus autores y contextos en que fueron producidas.",
          "Favorecer la consideración de los ejercicios plásticos realizados en clase, señalando características interesantes de forma respetuosa.",
          "Realizar visitas culturales o consultas virtuales para diferenciar los diversos tipos de producción artística y tradicional de la región."
        ],
        actividad: {
          titulo: "🏛️ Galería de Historias y Saberes Locales",
          objetivo: "Reflexionar sobre el arte como manifestación cultural regional y realizar crítica respetuosa de obras entre pares.",
          pasos: [
            "El docente propone a los estudiantes investigar en casa sobre alguna leyenda local, artesanía tradicional o una manifestación artística representativa del barrio o región.",
            "En clase, cada estudiante expone un objeto tradicional (una mochila tejida, una vasija, una foto antigua) o un dibujo de un mito local.",
            "Se realiza una exposición circular (los estudiantes ponen sus trabajos en sus mesas y todos caminan alrededor apreciándolos).",
            "Cada estudiante escribe una reseña crítica (de 3 a 5 líneas) sobre el trabajo de un compañero, usando vocabulario técnico trabajado en clase (color, composición, temática) y destacando su contexto histórico o social."
          ],
          materiales: ["Objetos tradicionales", "Libretas de apuntes", "Acceso a internet para indagación rápida"],
          evaluacion: "Se valora el uso de vocabulario técnico artístico y el respeto y comprensión del trasfondo cultural y social del trabajo expuesto."
        }
      }
    }
  }
};
