const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const DEFAULT_NAME = 'Zoológico Expedición en la Selva';
const PRECIO = { adulto: 8000, nino: 4000 };

const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};
const norm = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const el = (tag, cls, txt) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (txt != null) n.textContent = txt;
  return n;
};
const iso = d => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
const hoyISO = () => iso(new Date());
const sumarDias = n => { const d = new Date(); d.setDate(d.getDate() + n); return iso(d); };
const CLP = n => '$' + n.toLocaleString('es-CL');
const setErr = (sel, msg) => { $(sel).textContent = msg; };
const ESTRELLAS = n => '★'.repeat(n) + '☆'.repeat(5 - n);

/* ---------- Datos propios del zoológico ---------- */
const ZONAS = {
  'Sabana':  { color: '#e0a526' },
  'Selva':   { color: '#2e8b57' },
  'Montaña': { color: '#7a5cc2' },
  'Polar':   { color: '#2f8fc4' },
  'Aves':       { color: '#e8833a' },
  'Serpientes': { color: '#6a8f2a' },
  'Arácnidos':  { color: '#8a5a3c' },
  'Acuática': { color: '#1e88e5' }
};
const colorDe = z => ZONAS[z].color;

/* ===== FOTOS ===== */
/* 1) Carpeta donde están tus fotos (junto al archivo index.html). */
const CARPETA_FOTOS = 'images/';

/* 2) Nombre de cada foto dentro de la carpeta, exactamente como está escrito.
   Si una especie tiene '' la página busca su foto en internet. */
const FOTOS_PROPIAS = {
  leon: 'leon.jpg',
  jirafa: 'jirafa.jpg',
  cebra: 'cebra.jpeg',
  hipopotamo: 'hipopotamo.jpg',
  rinoceronte: 'rinoceronte.jpg',
  avestruz: 'avestruz.jpg',
  gacela: 'gacela.jpg',
  suricata: 'suricata.jpg',
  jaguar: 'jaguar.jpg',
  mono: 'monoarana.jpg',
  guacamayo: 'loros.jpg',
  perezoso: 'pererozo.jpg',
  tucan: 'tucan.jpg',
  anaconda: 'serpienteverde.jpg',
  iguana: 'iguanaverde.jpg',
  perico: 'perico.jpg',
  oso: 'osodeanteojos.jpg',
  llama: ['llama.jpg', 'Llama.jpg', 'LLAMA.jpg'],
  puma: ['puma.jpg', 'Puma.jpg', 'PUMA.jpg'],
  vicuna: 'vicuna.jpg',
  zorro_andino: 'zorroandino.jpg',
  panda_rojo: 'pandarojo.jpg',
  guanaco: 'guanaco.jpg',
  marmota: 'marmota.jpg',
  pinguino: ['pinguinoemperador.jpg', 'pinguinoempera.jpg', 'pinguino.jpg', 'Pinguinoemperador.jpg'],
  foca: 'foca.jpg',
  cocodrilo: 'cocodrilo.jpg',
  nutria: 'nutria.jpg',
  tapir: 'tapir.jpg',
  flamenco: 'flamenco.jpg',
  caiman: 'caiman.jpg',
  garza: ['garzablanca.jpg', 'garza.jpg', 'Garzablanca.jpg', 'garza_blanca.jpg'],
  aguila_real: 'aguilareal.jpg',
  colibri: 'colibri.jpg',
  boa: 'boa.jpg',
  tarantula: 'tarantula.jpg',
  escorpion: 'escorpion.jpg',
  viuda: 'viudanegra.jpg',
  tortuga: 'tortuga.jpg',
  pez_payaso: 'peces.jpg',
  ajolote: 'aguolote.jpg',
  camello: 'camello.jpg',
  canguro: 'canguro.jpg',
  lemur: 'lemur.jpg',
  pez_koi: 'peceskoi.jpg',
  colonia_pinguinos: 'pinguinos.jpg',
  tigre: 'tigre.jpg',
  tigre_blanco: 'tigreblanco.jpg',
};
const ANIMALES = [
  { id:'leon',      nombre:'León',               zona:'Sabana',  tamano:'Grande',  dieta:'Carnívoro', img:'', dato:'Pasa gran parte del día descansando y se reúne en manadas para cazar en equipo.' },
  { id:'jirafa',    nombre:'Jirafa',             zona:'Sabana',  tamano:'Grande',  dieta:'Herbívoro', img:'', dato:'Cada jirafa tiene un patrón de manchas único, como una huella digital.' },
  { id:'cebra',     nombre:'Cebra',              zona:'Sabana',  tamano:'Mediano', dieta:'Herbívoro', img:'', dato:'Sus rayas son distintas en cada individuo y ayudan a confundir a los depredadores.' },
  { id:'jaguar',    nombre:'Jaguar',             zona:'Selva',   tamano:'Grande',  dieta:'Carnívoro', img:'', dato:'Tiene una mordida tan potente que puede perforar el caparazón de una tortuga.' },
  { id:'mono',      nombre:'Mono araña',         zona:'Selva',   tamano:'Mediano', dieta:'Frugívoro', img:'', dato:'Su cola prensil funciona como una quinta mano para colgarse de las ramas.' },
  { id:'guacamayo', nombre:'Guacamayo',          zona:'Selva',   tamano:'Mediano', dieta:'Frugívoro', img:'', dato:'Usa su fuerte pico para partir nueces y también para trepar.' },
  { id:'perezoso',  nombre:'Perezoso',           zona:'Selva',   tamano:'Mediano', dieta:'Herbívoro', img:'', dato:'Se mueve tan lento que algas crecen en su pelaje y lo camuflan entre las hojas.' },
  { id:'oso',       nombre:'Oso de anteojos',    zona:'Montaña', tamano:'Grande',  dieta:'Omnívoro',  img:'', dato:'Construye nidos en los árboles donde descansa durante el día.' },
  { id:'llama',     nombre:'Llama',              zona:'Montaña', tamano:'Mediano', dieta:'Herbívoro', img:'', dato:'Se comunica con la postura de sus orejas y se defiende escupiendo cuando se siente amenazada.' },
  { id:'puma',      nombre:'Puma',               zona:'Montaña', tamano:'Grande',  dieta:'Carnívoro', img:'', dato:'Puede dar saltos enormes desde una posición de reposo para atrapar a sus presas.' },
  { id:'pinguino',  nombre:'Pingüino emperador', zona:'Polar',   tamano:'Grande',  dieta:'Carnívoro', img:'', dato:'Los machos incuban el huevo sobre sus patas durante semanas, sin comer.' },
  { id:'foca',      nombre:'Foca',               zona:'Polar',   tamano:'Mediano', dieta:'Carnívoro', img:'', dato:'Puede aguantar la respiración bajo el agua durante bastante tiempo.' },
  { id:'cocodrilo', nombre:'Cocodrilo',          zona:'Acuática', tamano:'Grande',  dieta:'Carnívoro', img:'', dato:'Puede pasar largos periodos sin comer después de una gran comida.' },
  { id:'nutria',    nombre:'Nutria',             zona:'Acuática', tamano:'Pequeño', dieta:'Carnívoro', img:'', dato:'Usa piedras como herramientas para abrir moluscos.' },
  { id:'tapir',     nombre:'Tapir',              zona:'Selva', tamano:'Mediano', dieta:'Herbívoro', img:'', dato:'Su trompa corta le sirve para tomar hojas, frutos y hasta algo de agua.' },
  { id:'hipopotamo',   nombre:'Hipopótamo',         zona:'Sabana',  tamano:'Grande',  dieta:'Herbívoro', img:'', dato:'Pasa el día casi completo dentro del agua para mantener la piel húmeda y fresca.' },
  { id:'rinoceronte',  nombre:'Rinoceronte blanco', zona:'Sabana',  tamano:'Grande',  dieta:'Herbívoro', img:'', dato:'Aunque parece pesado, puede correr a gran velocidad cuando se siente amenazado.' },
  { id:'avestruz',     nombre:'Avestruz',           zona:'Sabana',  tamano:'Grande',  dieta:'Omnívoro',  img:'', dato:'Es el ave más grande del mundo y, aunque no vuela, puede correr muy rápido.' },
  { id:'tucan',        nombre:'Tucán',              zona:'Selva',   tamano:'Pequeño', dieta:'Frugívoro', img:'', dato:'Su pico grande parece pesado, pero es muy liviano porque está lleno de pequeños espacios.' },
  { id:'anaconda',     nombre:'Anaconda verde',     zona:'Selva',   tamano:'Grande',  dieta:'Carnívoro', img:'', dato:'Es una serpiente acuática que puede pasar gran parte del día casi inmóvil en el agua.' },
  { id:'vicuna',       nombre:'Vicuña',             zona:'Montaña', tamano:'Mediano', dieta:'Herbívoro', img:'', dato:'Produce una de las lanas más finas del mundo, que se obtiene cada cierto tiempo sin dañarla.' },
  { id:'zorro_andino', nombre:'Zorro andino',       zona:'Montaña', tamano:'Mediano', dieta:'Omnívoro',  img:'', dato:'Es uno de los zorros más grandes de Sudamérica y se adapta bien a zonas frías y secas.' },
  { id:'flamenco',     nombre:'Flamenco',           zona:'Aves', tamano:'Mediano', dieta:'Omnívoro',  img:'', dato:'Su plumaje rosado viene de los pigmentos de los pequeños crustáceos que come.' },
  { id:'caiman',       nombre:'Caimán',             zona:'Acuática', tamano:'Grande',  dieta:'Carnívoro', img:'', dato:'Se distingue del cocodrilo por su hocico más ancho y redondeado.' },
  { id:'panda_rojo',   nombre:'Panda rojo',         zona:'Montaña',    tamano:'Mediano', dieta:'Herbívoro', img:'', dato:'Se alimenta casi solo de bambú, al que dedica gran parte del día.' },
  { id:'aguila_real',  nombre:'Águila real',        zona:'Aves',       tamano:'Grande',  dieta:'Carnívoro', img:'', dato:'Tiene una vista tan aguda que puede detectar una presa desde muy alto.' },
  { id:'boa',          nombre:'Boa constrictora',   zona:'Serpientes', tamano:'Grande',  dieta:'Carnívoro', img:'', dato:'Sujeta a sus presas con el cuerpo y las aprieta poco a poco hasta inmovilizarlas.' },
  { id:'tarantula',    nombre:'Tarántula',          zona:'Arácnidos',  tamano:'Pequeño', dieta:'Carnívoro', img:'', dato:'Usa pelos urticantes de su abdomen para defenderse de sus enemigos.' },
  { id:'escorpion',    nombre:'Escorpión emperador', zona:'Arácnidos', tamano:'Pequeño', dieta:'Carnívoro', img:'', dato:'Brilla bajo la luz ultravioleta gracias a una sustancia de su cuerpo.' },
  { id:'viuda',        nombre:'Viuda negra',        zona:'Arácnidos',  tamano:'Pequeño', dieta:'Carnívoro', img:'', dato:'Teje telarañas irregulares y tiene un brillo negro característico.' },
  { id:'gacela',     nombre:'Gacela',              zona:'Sabana',     tamano:'Mediano', dieta:'Herbívoro', img:'', dato:'Puede alcanzar gran velocidad y dar saltos altos para escapar de sus depredadores.' },
  { id:'suricata',   nombre:'Suricata',            zona:'Sabana',     tamano:'Pequeño', dieta:'Carnívoro', img:'', dato:'Vive en grupos y siempre hay un centinela que vigila desde una posición alta.' },
  { id:'iguana',     nombre:'Iguana verde',        zona:'Selva',      tamano:'Mediano', dieta:'Herbívoro', img:'', dato:'Es muy buena nadadora y puede dejarse caer desde las ramas sin lastimarse.' },
  { id:'perico',     nombre:'Perico',              zona:'Selva',      tamano:'Pequeño', dieta:'Frugívoro', img:'', dato:'Vive en bandadas ruidosas y se comunica constantemente con sus compañeros.' },
  { id:'guanaco',    nombre:'Guanaco',             zona:'Montaña',    tamano:'Grande',  dieta:'Herbívoro', img:'', dato:'Es el camélido silvestre más grande de Sudamérica y muy veloz en terrenos abiertos.' },
  { id:'marmota',    nombre:'Marmota',             zona:'Montaña',    tamano:'Mediano', dieta:'Herbívoro', img:'', dato:'Pasa gran parte del año hibernando bajo tierra para sobrevivir al invierno.' },
  { id:'garza',      nombre:'Garza blanca',        zona:'Aves',    tamano:'Mediano', dieta:'Carnívoro', img:'', dato:'Se queda inmóvil junto al agua durante largos minutos antes de atrapar un pez.' },
  { id:'colibri',    nombre:'Colibrí',             zona:'Aves',       tamano:'Pequeño', dieta:'Néctar',    img:'', dato:'Puede quedarse suspendido en el aire y volar hacia atrás.' },
  { id:'tortuga',   nombre:'Tortuga marina',          zona:'Acuática', tamano:'Grande',  dieta:'Herbívoro', img:'', dato:'Recorre miles de kilómetros en el mar y vuelve a la misma playa donde nació para poner sus huevos.' },
  { id:'pez_payaso', nombre:'Pez payaso',             zona:'Acuática', tamano:'Pequeño', dieta:'Omnívoro',  img:'', dato:'Vive entre los tentáculos de las anémonas, que le protegen de sus depredadores.' },
  { id:'ajolote', nombre:'Ajolote', zona:'Acuática', tamano:'Pequeño', dieta:'Carnívoro', img:'', dato:'Puede regenerar partes de su cuerpo, como patas, cola e incluso parte del corazón.' },
  { id:'camello', nombre:'Camello', zona:'Sabana', tamano:'Grande', dieta:'Herbívoro', img:'', dato:'Almacena grasa en su joroba, no agua, y puede pasar días sin beber.' },
  { id:'canguro', nombre:'Canguro', zona:'Sabana', tamano:'Grande', dieta:'Herbívoro', img:'', dato:'Las crías nacen muy pequeñas y viven dentro de la bolsa de su madre durante meses.' },
  { id:'lemur', nombre:'Lémur de cola anillada', zona:'Selva', tamano:'Mediano', dieta:'Frugívoro', img:'', dato:'Tiene una cola con anillos negros y blancos que usa para comunicarse con su grupo.' },
  { id:'pez_koi', nombre:'Pez koi', zona:'Acuática', tamano:'Pequeño', dieta:'Omnívoro', img:'', dato:'Puede vivir más de 20 años y reconoce a las personas que lo alimentan.' },
  { id:'colonia_pinguinos', nombre:'Colonia de pingüinos', zona:'Polar', tamano:'Mediano', dieta:'Carnívoro', img:'', dato:'Se agrupan muy apretados para protegerse del viento y del frío.' },
  { id:'tigre', nombre:'Tigre', zona:'Selva', tamano:'Grande', dieta:'Carnívoro', img:'', dato:'Cada tigre tiene un patrón de rayas único, como una huella digital.' },
  { id:'tigre_blanco', nombre:'Tigre blanco', zona:'Selva', tamano:'Grande', dieta:'Carnívoro', img:'', dato:'Su color claro viene de una mutación genética, no es una especie distinta.' }

];

/* Fichas ampliadas: dos párrafos y un dato curioso por animal */
const FICHAS = {
  leon: { habitat: 'Sabana y praderas de África', vida: 'Hasta 15 años', peso: 'Machos: 150 a 250 kg', estado: 'Vulnerable', p: [
    'Los leones son los únicos felinos que viven en manadas estables. Suelen reunir hembras emparentadas, sus crías y uno o pocos machos que defienden el territorio.',
    'Las hembras son las principales cazadoras y se coordinan para acercarse a sus presas sin ser vistas. Pueden dormir entre 16 y 20 horas al día, porque cazar gasta mucha energía.' ],
    dato: 'Su rugido puede escucharse a varios kilómetros de distancia.' },
  elefante: { habitat: 'Sabana, bosques y zonas con agua', vida: 'Hasta 60 años', peso: 'Hasta 6 toneladas', estado: 'En peligro', p: [
    'Es el animal terrestre más grande del mundo. Vive en familias lideradas por la hembra más anciana, que recuerda rutas, fuentes de agua y lugares de alimento.',
    'Su trompa sirve para oler, respirar, beber y tomar objetos finos. Los elefantes se comunican con sonidos de baja frecuencia que viajan largas distancias.' ],
    dato: 'Pueden reconocer a otros elefantes y recordarlos durante años.' },
  jirafa: { habitat: 'Sabanas y zonas de árboles abiertos', vida: 'Entre 20 y 25 años', peso: 'Machos: hasta 1.200 kg', estado: 'Vulnerable', p: [
    'Es el animal terrestre más alto del planeta. Su cuello largo le permite comer hojas en lo alto de los árboles que otros herbívoros no alcanzan.',
    'Cada jirafa tiene un patrón de manchas único, como una huella digital. Duerme muy poco, a menudo solo unos minutos repartidos durante el día.' ],
    dato: 'Su lengua es oscura para protegerse del sol y puede medir cerca de 50 centímetros.' },
  cebra: { habitat: 'Praderas y sabanas de África', vida: 'Hasta 25 años', peso: 'Entre 230 y 350 kg', estado: 'Varía según la especie', p: [
    'Las cebras viven en manadas y se desplazan juntas en busca de pasto y agua. Sus rayas son únicas en cada individuo y funcionan como una carta de identidad.',
    'Se acicalan entre sí y tienen una vista y un oído muy finos, por eso siempre están atentas a cualquier movimiento a su alrededor.' ],
    dato: 'Cada cebra tiene un patrón de rayas tan único como una huella.' },
  jaguar: { habitat: 'Selvas tropicales y humedales de América', vida: 'Hasta 12 años', peso: 'Machos: 60 a 100 kg', estado: 'Casi amenazado', p: [
    'Es el felino más grande de América. Es un cazador solitario y muy territorial que se mueve sobre todo al amanecer y al atardecer.',
    'Tiene una mordida muy potente, capaz de atravesar caparazones de tortuga. Además nada muy bien y a menudo se mete al agua para cazar.' ],
    dato: 'Es uno de los pocos felinos que disfruta nadando.' },
  mono: { habitat: 'Copas de los árboles de la selva', vida: 'Hasta 25 años', peso: 'Entre 6 y 9 kg', estado: 'En peligro', p: [
    'Vive en grupos y pasa casi toda su vida en lo alto de los árboles. Sus brazos y piernas largas le permiten avanzar de rama en rama a gran velocidad.',
    'Su cola prensil funciona como una quinta mano. Se alimenta sobre todo de frutas, por eso ayuda a dispersar semillas en el bosque.' ],
    dato: 'Su cola es tan sensible que la usa para tocar y explorar objetos.' },
  guacamayo: { habitat: 'Selvas y bosques de Centro y Sudamérica', vida: 'Varias décadas', peso: 'Entre 800 g y 1,5 kg', estado: 'Varía según la especie', p: [
    'Son grandes loros de colores intensos. Viven en parejas o bandadas, y muchas especies mantienen su vínculo de pareja durante muchos años.',
    'Su pico es muy fuerte: les permite partir nueces duras y también les sirve como una tercera pata para trepar por las ramas.' ],
    dato: 'Algunas especies pueden aprender a imitar sonidos y palabras.' },
  perezoso: { habitat: 'Copas de árboles de selvas tropicales', vida: 'Hasta 30 años', peso: 'Entre 4 y 6 kg', estado: 'Varía según la especie', p: [
    'Se mueve muy despacio porque tiene un metabolismo muy lento. Pasa la mayor parte del día colgado de las ramas, descansando y comiendo hojas.',
    'Su pelaje es casi un ecosistema: en él crecen algas verdes que lo camuflan entre las hojas. Baja al suelo muy pocas veces, quizá una vez por semana.' ],
    dato: 'Puede pasar horas sin moverse porque casi no gasta energía.' },
  oso: { habitat: 'Bosques nubosos y páramos de los Andes', vida: 'Hasta 30 años', peso: 'Machos: hasta 200 kg', estado: 'Vulnerable', p: [
    'Es la única especie de oso que vive en Sudamérica. Recibe su nombre por las marcas claras que rodean sus ojos, que parecen anteojos.',
    'Es muy adaptable: come frutas, bromelias, hojas y, a veces, pequeños animales. Construye plataformas de ramas en los árboles donde descansa.' ],
    dato: 'Su pelaje puede ser negro, marrón o rojizo.' },
  condor: { habitat: 'Montañas y acantilados de los Andes', vida: 'Hasta 50 años', peso: 'Hasta 15 kg', estado: 'Vulnerable', p: [
    'Es una de las aves voladoras más grandes del mundo. Puede tener una envergadura de hasta tres metros y planea durante horas aprovechando las corrientes de aire.',
    'Es carroñero: se alimenta de animales muertos y ayuda a limpiar el ambiente. Pone pocos huevos, por eso cada cóndor es muy valioso para su especie.' ],
    dato: 'Puede pasar muchas horas en el aire sin batir las alas.' },
  llama: { habitat: 'Altiplano y zonas de montaña de los Andes', vida: 'Entre 15 y 25 años', peso: 'Entre 130 y 200 kg', estado: 'Doméstica', p: [
    'Es un camélido andino domesticado hace miles de años. Se usó para transportar cargas y como fuente de lana.',
    'Vive en rebaños pequeños y es muy curiosa. Se comunica con la postura de sus orejas y, cuando se siente amenazada, puede escupir.' ],
    dato: 'Su lana es muy suave y se usa para fabricar prendas abrigadas.' },
  puma: { habitat: 'Montañas, bosques y desiertos de América', vida: 'Hasta 20 años', peso: 'Machos: 50 a 80 kg', estado: 'Preocupación menor', p: [
    'Tiene uno de los territorios más amplios de cualquier mamífero terrestre americano. Puede recorrer grandes distancias en busca de presas.',
    'Es un cazador solitario y sigiloso. Puede saltar grandes alturas desde una posición de reposo para atrapar presas que parecen fuera de su alcance.' ],
    dato: 'Puede dar varios metros de salto de un solo impulso.' },
  pinguino: { habitat: 'Hielo marino de la Antártida', vida: 'Hasta 20 años', peso: 'Entre 22 y 45 kg', estado: 'Casi amenazado', p: [
    'Es el pingüino más grande del mundo. Vive en colonias numerosas sobre el hielo antártico, donde las temperaturas caen a decenas de grados bajo cero.',
    'Los machos incuban el huevo sobre sus patas durante semanas, sin comer. Para protegerse del frío, se apiñan y rotan sus posiciones.' ],
    dato: 'Puede bucear a gran profundidad y permanecer bajo el agua por largos periodos.' },
  oso_polar: { habitat: 'Hielo marino del Ártico', vida: 'Entre 20 y 30 años', peso: 'Machos: hasta 600 kg', estado: 'Vulnerable', p: [
    'Es el mayor carnívoro terrestre del planeta. Depende del hielo marino para cazar focas, su principal alimento.',
    'Aunque su pelaje parece blanco, los pelos son en realidad transparentes y la piel debajo es negra, lo que absorbe mejor el calor del sol.' ],
    dato: 'Puede nadar durante días y recorrer muchos kilómetros sin descansar en tierra.' },
  foca: { habitat: 'Costas, islas y mares fríos', vida: 'Entre 20 y 30 años', peso: 'Varía según la especie', estado: 'Varía según la especie', p: [
    'Son mamíferos marinos con cuerpo aerodinámico y aletas que les permiten nadar con gran agilidad.',
    'Pueden aguantar la respiración bajo el agua durante mucho tiempo. Descansan en la costa o sobre el hielo para regular su temperatura.' ],
    dato: 'Pueden bajar el ritmo de sus latidos mientras bucean para ahorrar oxígeno.' },
  cocodrilo: { habitat: 'Ríos, lagos y humedales tropicales', vida: 'Hasta 70 años', peso: 'Varía según la especie', estado: 'Varía según la especie', p: [
    'Pertenecen a un grupo de reptiles que existe desde hace millones de años. Son excelentes cazadores acuáticos que esperan a sus presas cerca de la orilla.',
    'Pueden pasar mucho tiempo sin comer después de una gran comida. Muchas especies cuidan a sus crías y ayudan a los pequeños a salir del cascarón.' ],
    dato: 'Pueden mantenerse casi inmóviles durante horas esperando una presa.' },
  nutria: { habitat: 'Ríos, lagos y costas con vegetación', vida: 'Hasta 15 años', peso: 'Entre 5 y 10 kg', estado: 'Varía según la especie', p: [
    'Son mamíferos semiacuáticos muy activos. Pasan parte de su vida en el agua y parte en la orilla, donde descansan y se acicalan.',
    'Viven en familias, se comunican con silbidos y suelen deslizarse por las pendientes de la orilla.' ],
    dato: 'Algunas usan piedras como yunque para romper conchas duras.' },
  tapir: { habitat: 'Selvas, bosques y zonas húmedas', vida: 'Hasta 30 años', peso: 'Entre 150 y 300 kg', estado: 'Varía según la especie', p: [
    'Es uno de los mamíferos más antiguos de su linaje. Tiene un cuerpo robusto, patas cortas y una trompa corta para tomar hojas, frutos y agua.',
    'Es un excelente nadador y pasa mucho tiempo en ríos y lagunas. Al dispersar semillas, cumple una función importante para la selva.' ],
    dato: 'Sus crías tienen un patrón de manchas que las camufla en el bosque.' },
  hipopotamo: { habitat: 'Ríos, lagos y pastizales de África', vida: 'Hasta 45 años', peso: 'Machos: hasta 1.500 kg', estado: 'Vulnerable', p: [
    'Es un gran mamífero semiacuático que vive en grupos en ríos y lagos. Pasa las horas del día en el agua para mantener su piel húmeda y protegerla del sol.',
    'De noche sale a pastar, y puede recorrer varios kilómetros para alimentarse. Aunque parece lento, es un animal territorial y muy poderoso.' ],
    dato: 'Pese a su tamaño, pueden correr más rápido de lo que uno imagina.' },
  rinoceronte: { habitat: 'Pastizales y sabanas de África', vida: 'Hasta 45 años', peso: 'Hasta 2.300 kg', estado: 'Casi amenazado', p: [
    'El rinoceronte blanco es uno de los animales terrestres más grandes. Se alimenta de pasto y pasa buena parte del día comiendo y descansando a la sombra.',
    'Tiene una visión limitada pero un oído y un olfato muy finos, con los que detecta peligros a distancia. Por su gran tamaño, casi no tiene depredadores naturales.' ],
    dato: 'Su cuerno está hecho de queratina, el mismo material de nuestras uñas.' },
  avestruz: { habitat: 'Desiertos, sabanas y estepas de África', vida: 'Hasta 40 años', peso: 'Hasta 130 kg', estado: 'Preocupación menor', p: [
    'Es el ave más grande del mundo. No vuela, pero sus patas fuertes le permiten correr a gran velocidad y dar pasos de varios metros.',
    'Los machos incuban los huevos durante la noche y las hembras de día. Sus huevos son los más grandes entre las aves actuales.' ],
    dato: 'Sus ojos son tan grandes que cada uno es más grande que su cerebro.' },
  tucan: { habitat: 'Selvas tropicales de América', vida: 'Hasta 20 años', peso: 'Entre 300 y 600 g', estado: 'Preocupación menor', p: [
    'Es un ave de colores llamativos con un pico muy grande. Aunque el pico parece pesado, está formado por una estructura liviana llena de pequeños espacios.',
    'Se alimenta sobre todo de frutos, y al comerlos ayuda a dispersar semillas por el bosque. Vive en parejas o pequeños grupos.' ],
    dato: 'Usa el pico para alcanzar frutos lejanos y también para regular su temperatura.' },
  ocelote: { habitat: 'Selvas, bosques y matorrales de América', vida: 'Hasta 20 años', peso: 'Entre 8 y 16 kg', estado: 'Preocupación menor', p: [
    'Es un felino de tamaño mediano con un pelaje manchado que le permite pasar desapercibido entre la vegetación. Es sobre todo nocturno.',
    'Caza pequeños mamíferos, aves y reptiles. Es un excelente trepador y nadador, y marca su territorio con sus propios olores.' ],
    dato: 'Sus manchas son únicas en cada individuo, como una huella dactilar.' },
  anaconda: { habitat: 'Ríos, pantanos y zonas inundables de Sudamérica', vida: 'Hasta 30 años', peso: 'Hasta 200 kg', estado: 'Preocupación menor', p: [
    'Es una serpiente de gran tamaño que vive casi siempre en el agua. Puede pasar horas inmóvil, esperando a que se acerque una presa.',
    'Atrapa a sus presas y las envuelve con su cuerpo para sujetarlas. Es una gran nadadora y puede permanecer largos periodos bajo el agua.' ],
    dato: 'Las hembras son mucho más grandes que los machos.' },
  vicuna: { habitat: 'Altiplano andino', vida: 'Hasta 20 años', peso: 'Entre 35 y 55 kg', estado: 'Preocupación menor', p: [
    'Es un camélido silvestre que vive en las alturas de los Andes. Se desplaza en pequeños grupos y es muy atenta a cualquier movimiento a su alrededor.',
    'Su lana es extraordinariamente fina y cálida. Por eso fue muy valorada durante siglos y hoy se obtiene de forma controlada.' ],
    dato: 'Puede vivir en zonas de gran altura, donde el aire tiene muy poco oxígeno.' },
  zorro_andino: { habitat: 'Montañas, praderas y matorrales andinos', vida: 'Entre 10 y 12 años', peso: 'Entre 6 y 12 kg', estado: 'Preocupación menor', p: [
    'Es uno de los zorros más grandes de Sudamérica. Tiene un pelaje grueso que le ayuda a resistir el frío de las montañas.',
    'Es muy adaptable: come roedores, aves, frutas e insectos. Suele vivir en parejas y recorre su territorio en busca de alimento.' ],
    dato: 'Su cola es espesa y la usa para mantenerse abrigado al dormir.' },
  morsa: { habitat: 'Hielo marino y costas del Ártico', vida: 'Hasta 40 años', peso: 'Machos: hasta 1.500 kg', estado: 'Vulnerable', p: [
    'Es un mamífero marino muy grande que pasa parte de su vida sobre el hielo. Vive en grandes grupos que se agrupan para descansar y protegerse.',
    'Sus colmillos son muy largos y los usa para subirse al hielo, defender su territorio y buscar alimento en el fondo del mar.' ],
    dato: 'Puede bucear cientos de metros de profundidad para alimentarse de moluscos.' },
  zorro_artico: { habitat: 'Tundra y hielo del Ártico', vida: 'Entre 3 y 6 años', peso: 'Entre 3 y 8 kg', estado: 'Preocupación menor', p: [
    'Es un zorro pequeño adaptado al frío extremo. Tiene orejas cortas y un pelaje muy denso que lo mantiene abrigado durante los inviernos.',
    'Cambia el color de su pelaje según la estación: en invierno es blanco y en verano toma tonos grises o marrones para camuflarse.' ],
    dato: 'Sus patas tienen pelo para caminar sobre la nieve sin hundirse tanto.' },
  capibara: { habitat: 'Ríos, lagunas y pastizales de Sudamérica', vida: 'Entre 8 y 10 años', peso: 'Hasta 65 kg', estado: 'Preocupación menor', p: [
    'Es el roedor más grande del mundo y vive en grupos. Pasa buena parte del día en el agua o junto a ella, donde se refresca y se siente seguro.',
    'Es un animal muy social y tranquilo. Se alimenta de pasto y plantas acuáticas, y suele convivir sin problemas con otras especies.' ],
    dato: 'Pueden permanecer bajo el agua durante varios minutos cuando se sienten en peligro.' },
  flamenco: { habitat: 'Lagunas salinas y humedales', vida: 'Hasta 30 años', peso: 'Entre 2 y 4 kg', estado: 'Preocupación menor', p: [
    'Es un ave de patas muy largas que vive en grandes colonias. Se alimenta filtrando agua y barro en busca de pequeños organismos.',
    'Su color rosado se debe a los pigmentos de los crustáceos y algas que come. Los pollos nacen con plumas grises y cambian de color con el tiempo.' ],
    dato: 'Duerme de pie sobre una sola pata, lo que le ayuda a conservar calor.' },
  caiman: { habitat: 'Ríos, lagos y humedales de América', vida: 'Hasta 40 años', peso: 'Varía según la especie', estado: 'Varía según la especie', p: [
    'Es un reptil emparentado con los cocodrilos, con un hocico más ancho y redondeado. Vive en ríos, lagos y zonas pantanosas.',
    'Es un excelente cazador que se alimenta de peces, aves y mamíferos. Las madres cuidan a sus crías durante los primeros días de vida.' ],
    dato: 'Puede pasar largos periodos casi inmóvil, flotando con los ojos y la nariz fuera del agua.' },
  panda_rojo: { habitat: 'Bosques de bambú de montaña en Asia', vida: 'Hasta 12 años', peso: 'Entre 3 y 6 kg', estado: 'En peligro', p: [
    'El panda rojo es un mamífero pequeño de pelaje denso y cola larga y anillada. Vive en los bosques de bambú de las montañas y pasa casi todo el tiempo en los árboles.',
    'Aunque es carnívoro de origen, come casi solo bambú, por eso necesita comer muchas horas al día. Es un animal solitario y de hábitos sobre todo nocturnos y crepusculares.' ],
    dato: 'Tiene un pulgar falso, un hueso alargado de la muñeca, que le ayuda a sujetar el bambú.' },
  aguila_real: { habitat: 'Montañas, bosques abiertos y llanuras', vida: 'Hasta 30 años', peso: 'Entre 3 y 6 kg', estado: 'Preocupación menor', p: [
    'Es una de las aves rapaces más grandes del hemisferio norte. Construye nidos muy grandes en acantilados o árboles altos, y los reutiliza durante años.',
    'Caza mamíferos y aves mientras vuela con gran precisión. Su vista es tan aguda que puede ver una presa de muy lejos y lanzarse sobre ella a gran velocidad.' ],
    dato: 'Puede alcanzar velocidades superiores a 150 km por hora cuando se lanza en picada.' },
  buho_real: { habitat: 'Bosques, montañas y zonas rocosas', vida: 'Hasta 20 años', peso: 'Entre 2 y 4 kg', estado: 'Preocupación menor', p: [
    'Es uno de los búhos más grandes del mundo. Tiene penachos sobre la cabeza y ojos naranjas muy intensos, y caza sobre todo al atardecer y de noche.',
    'Vuela en silencio gracias a las plumas de sus alas, lo que le permite sorprender a sus presas sin ser oído.' ],
    dato: 'Sus oídos están en posiciones distintas, así puede ubicar una presa sólo por el sonido.' },
  ave_paraiso: { habitat: 'Bosques tropicales de Nueva Guinea y Australia', vida: 'Hasta 20 años', peso: 'Entre 100 y 400 g', estado: 'Preocupación menor', p: [
    'Es un grupo de aves famosas por sus plumas coloridas y ornamentadas. Los machos son los que tienen esos adornos, que usan para llamar la atención de las hembras.',
    'Durante el cortejo realizan danzas y exhibiciones muy elaboradas. Se alimentan de frutos, insectos y pequeños animales del bosque.' ],
    dato: 'Muchas especies tienen plumas de tonos que cambian según el ángulo de la luz.' },
  boa: { habitat: 'Selvas, sabanas y zonas húmedas de América', vida: 'Hasta 30 años', peso: 'Hasta 30 kg', estado: 'Preocupación menor', p: [
    'Es una serpiente grande que no tiene veneno. Caza mamíferos, aves y reptiles, a los que sujeta con su cuerpo y aprieta hasta inmovilizarlos.',
    'Es una gran trepadora y nadadora, y pasa mucho tiempo inmóvil esperando el momento para atacar. Digiere sus presas poco a poco, por eso puede pasar semanas sin comer.' ],
    dato: 'Tiene unas pequeñas espuelas en las patas traseras que son restos de sus antiguas extremidades.' },
  cobra: { habitat: 'Bosques, sabanas y zonas agrícolas de Asia y África', vida: 'Hasta 25 años', peso: 'Hasta 7 kg', estado: 'Varía según la especie', p: [
    'Es una serpiente venenosa que, cuando se siente amenazada, levanta la parte delantera de su cuerpo y ensancha el cuello en forma de capucha.',
    'Se alimenta de roedores, aves y otras serpientes. Es activa de día y de noche según el clima, y prefiere alejarse antes que atacar.' ],
    dato: 'Puede lanzar veneno a distancia contra un posible agresor, apuntando a los ojos.' },
  cascabel: { habitat: 'Desiertos, praderas y bosques de América', vida: 'Hasta 20 años', peso: 'Entre 1 y 3 kg', estado: 'Preocupación menor', p: [
    'Es una serpiente venenosa que se reconoce por el cascabel de su cola, formado por anillos de queratina que se van sumando con cada muda.',
    'Caza roedores y pequeños mamíferos. Prefiere quedarse quieta y avisar con su cascabel antes que acercarse a una amenaza.' ],
    dato: 'Los anillos del cascabel no indican la edad exacta de la serpiente, porque se pueden perder.' },
  tarantula: { habitat: 'Selvas, sabanas y desiertos de América, África y Asia', vida: 'Hasta 25 años', peso: 'Hasta 85 g', estado: 'Varía según la especie', p: [
    'Es una araña grande y peluda que vive en madrigueras o en la vegetación. Caza insectos y otros pequeños animales que atrapa con sus patas delanteras.',
    'Cuando se siente amenazada, usa sus pelos urticantes, que lanza con las patas traseras. Muchas especies tienen una vida muy larga para ser arañas.' ],
    dato: 'Las hembras pueden vivir muchos años, mientras que los machos viven menos.' },
  escorpion: { habitat: 'Desiertos, bosques y zonas rocosas de África y América', vida: 'Hasta 8 años', peso: 'Hasta 30 g', estado: 'Varía según la especie', p: [
    'Es un artrópodo de cuerpo alargado con pinzas y una cola con aguijón. Caza insectos y arácnidos durante la noche, y de día se esconde bajo las piedras.',
    'Su cuerpo tiene una cutícula que contiene sustancias fluorescentes. Por eso, con luz ultravioleta, se ve de un color que brilla en la oscuridad.' ],
    dato: 'Puede sobrevivir mucho tiempo sin comer gracias a su metabolismo lento.' },
  viuda: { habitat: 'Zonas templadas y cálidas de todo el mundo', vida: 'Hasta 3 años', peso: 'Menos de 1 g', estado: 'Varía según la especie', p: [
    'Es una araña pequeña de cuerpo negro brillante y, en algunas especies, una marca roja en el abdomen. Teje telarañas irregulares en lugares oscuros.',
    'Su veneno es potente, aunque la araña suele evitar a las personas y solo muerde cuando se siente acorralada.' ],
    dato: 'Las hembras son mucho más grandes que los machos y son las que tejen las telarañas.' },
  gacela: { habitat: 'Sabanas y praderas de África y Asia', vida: 'Entre 10 y 12 años', peso: 'Entre 20 y 30 kg', estado: 'Varía según la especie', p: [
    'Es un antílope ágil y de patas delgadas que vive en manadas. Su velocidad le permite huir de los depredadores con rapidez.',
    'Cuando se siente segura, puede dar saltos muy altos en el aire, una conducta que se conoce como rebote o pronking.' ],
    dato: 'Puede alcanzar velocidades cercanas a los 80 km por hora en distancias cortas.' },
  nu: { habitat: 'Sabanas de África oriental', vida: 'Hasta 20 años', peso: 'Entre 150 y 290 kg', estado: 'Preocupación menor', p: [
    'El ñu es un antílope grande que vive en grandes rebaños. Cada año participa en una migración que recorre cientos de kilómetros en busca de agua y pasto.',
    'Durante la migración los ñus cruzan ríos llenos de cocodrilos, en un recorrido lleno de riesgos que se repite año tras año.' ],
    dato: 'Los machos suelen tener una crin densa en el cuello que los hace fácilmente reconocibles.' },
  suricata: { habitat: 'Desiertos y praderas del sur de África', vida: 'Hasta 12 años', peso: 'Entre 600 g y 1 kg', estado: 'Preocupación menor', p: [
    'La suricata es un pequeño mamífero que vive en colonias organizadas. Cava madrigueras y trabaja en equipo para cuidar a las crías.',
    'Siempre hay un vigilante que se sostiene sobre sus patas traseras para observar el horizonte y avisar si se acerca un peligro.' ],
    dato: 'Sus cuidadores enseñan a las crías a cazar presas como escorpiones y lagartijas.' },
  iguana: { habitat: 'Selvas y bosques de América tropical', vida: 'Entre 10 y 20 años', peso: 'Hasta 6 kg', estado: 'Preocupación menor', p: [
    'Es un reptil de gran tamaño que pasa la mayor parte del tiempo en los árboles. Se alimenta sobre todo de hojas, flores y frutos.',
    'Es una gran nadadora y, si se siente amenazada, puede lanzarse al agua y permanecer sumergida durante un tiempo.' ],
    dato: 'Tiene una cresta de escamas a lo largo del cuerpo que la ayuda a regular su temperatura.' },
  perico: { habitat: 'Selvas y bosques abiertos de América', vida: 'Hasta 25 años', peso: 'Entre 60 y 100 g', estado: 'Preocupación menor', p: [
    'El perico es un ave pequeña y muy social que vive en bandadas. Su plumaje verde le permite camuflarse entre las hojas de los árboles.',
    'Se comunica de forma constante con sus compañeros mediante chillidos. Las parejas suelen mantenerse juntas durante toda la vida.' ],
    dato: 'Pueden aprender a imitar algunos sonidos y palabras cuando conviven con personas.' },
  oso_hormiguero: { habitat: 'Sabanas, selvas y praderas de América Central y del Sur', vida: 'Hasta 15 años', peso: 'Entre 22 y 41 kg', estado: 'Vulnerable', p: [
    'Es un mamífero sin dientes que se alimenta de hormigas y termitas. Tiene un hocico largo y una lengua que puede superar los 60 centímetros.',
    'Sus garras delanteras son muy grandes y las usa para romper nidos de insectos y también para defenderse de sus enemigos.' ],
    dato: 'Puede capturar miles de hormigas en un solo día gracias a su lengua pegajosa.' },
  guanaco: { habitat: 'Estepas, montañas y zonas abiertas de los Andes', vida: 'Entre 20 y 25 años', peso: 'Entre 90 y 140 kg', estado: 'Preocupación menor', p: [
    'El guanaco es un camélido silvestre que vive en grupos y se mueve con gran agilidad en terrenos abiertos y montañosos.',
    'Tiene una vista muy aguda y avisa a su grupo con silbidos cuando detecta un peligro. Puede correr a gran velocidad durante largos trayectos.' ],
    dato: 'Es el antecesor silvestre de la llama y de la alpaca.' },
  marmota: { habitat: 'Praderas y zonas montañosas de Europa, Asia y América del Norte', vida: 'Entre 10 y 15 años', peso: 'Entre 3 y 6 kg', estado: 'Varía según la especie', p: [
    'La marmota es un roedor que vive en madrigueras y pasa el verano comiendo para acumular grasa antes del invierno.',
    'Durante el invierno hiberna bajo tierra y reduce mucho su ritmo de vida. Al despertar, vuelve a la superficie y emite silbidos para avisar al grupo.' ],
    dato: 'Durante la hibernación su corazón puede latir mucho más lento de lo normal.' },
  lobo_artico: { habitat: 'Tundra y hielo del Ártico', vida: 'Entre 7 y 10 años', peso: 'Entre 40 y 60 kg', estado: 'Preocupación menor', p: [
    'El lobo ártico vive en manadas que suelen estar formadas por una pareja y sus crías. Recorre grandes distancias sobre el hielo en busca de alimento.',
    'Su pelaje grueso y sus patas anchas le permiten caminar sobre la nieve sin hundirse demasiado y resistir temperaturas extremas.' ],
    dato: 'Puede aguantar largos periodos sin comer cuando la presa escasea.' },
  caribu: { habitat: 'Tundra, bosques boreales y montañas del norte', vida: 'Hasta 15 años', peso: 'Entre 70 y 300 kg', estado: 'Varía según la especie', p: [
    'El caribú es un cérvido que vive en manadas. Cada año recorre largas distancias entre sus zonas de invierno y de verano.',
    'Tanto machos como hembras tienen astas, algo poco común entre los ciervos. Se alimenta de líquenes, hierbas y hojas.' ],
    dato: 'Sus pezuñas se abren mucho y le sirven para caminar sobre la nieve y el hielo.' },
  nutria_gigante: { habitat: 'Ríos y lagunas de la Amazonía', vida: 'Entre 10 y 15 años', peso: 'Entre 26 y 30 kg', estado: 'En peligro', p: [
    'La nutria gigante es una de las especies de nutria más grandes del mundo. Vive en familias numerosas y pasa casi todo el día en el agua.',
    'Se alimenta de peces y crustáceos, y marca su territorio con sonidos y olores. Su comunicación es muy intensa y se escucha a distancia.' ],
    dato: 'Cada familia de nutrias gigantes puede defender un territorio amplio en el río.' },
  garza: { habitat: 'Lagos, ríos y humedales de todo el mundo', vida: 'Hasta 20 años', peso: 'Entre 1 y 2 kg', estado: 'Preocupación menor', p: [
    'La garza blanca es un ave de patas largas y cuello esbelto que se alimenta de peces, anfibios y pequeños animales acuáticos.',
    'Puede quedarse inmóvil junto al agua durante mucho tiempo y luego atrapar a su presa con un movimiento rápido del cuello y el pico.' ],
    dato: 'Vuela con el cuello recogido en forma de S, algo que la distingue de otras aves zancudas.' },
  quetzal: { habitat: 'Bosques nubosos de Centroamérica', vida: 'Hasta 20 años', peso: 'Entre 150 y 200 g', estado: 'Casi amenazado', p: [
    'El quetzal es una de las aves más hermosas de los bosques de montaña. Los machos tienen plumas verdes brillantes y una cola muy larga.',
    'Se alimenta sobre todo de frutos, y al comerlos ayuda a dispersar semillas por el bosque. Construye sus nidos en troncos huecos.' ],
    dato: 'Sus colas largas no son para volar: la usan más bien para la exhibición durante el cortejo.' },
  colibri: { habitat: 'Bosques, jardines y zonas con flores de América', vida: 'Hasta 5 años', peso: 'Entre 2 y 20 g', estado: 'Varía según la especie', p: [
    'El colibrí es el ave más pequeña del mundo en muchas de sus especies. Bate las alas a gran velocidad y puede quedarse suspendido en el aire.',
    'Se alimenta del néctar de las flores, para lo que necesita comer con frecuencia durante el día. Su metabolismo es muy rápido.' ],
    dato: 'Puede volar hacia atrás y en cualquier dirección, algo muy raro entre las aves.' },
  delfin: { habitat: 'Mares y costas templadas', vida: 'Hasta 50 años', peso: 'Entre 150 y 650 kg', estado: 'Preocupación menor', p: [
    'El delfín nariz de botella es un mamífero marino muy social. Vive en grupos, caza en equipo y se comunica con silbidos, clics y otros sonidos.',
    'Respira aire en la superficie y puede dormir con medio cerebro a la vez, dejando el otro despierto para vigilar y respirar.' ],
    dato: 'Cada delfín tiene un silbido propio que funciona como un nombre.' },
  tiburon: { habitat: 'Mares cálidos y templados de todo el mundo', vida: 'Varias décadas', peso: 'Hasta varios cientos de kilos', estado: 'Vulnerable', p: [
    'El tiburón blanco es uno de los grandes depredadores del océano. Nada de forma constante y tiene un cuerpo hidrodinámico que le permite recorrer largas distancias.',
    'Su olfato y su vista le ayudan a detectar presas a distancia. Tiene cientos de dientes en filas, que se reemplazan a lo largo de su vida.' ],
    dato: 'Puede detectar pequeñas cantidades de sangre en el agua gracias a su olfato.' },
  pulpo: { habitat: 'Fondos marinos rocosos y arrecifes', vida: 'Entre 1 y 2 años', peso: 'Entre 1 y 3 kg', estado: 'Preocupación menor', p: [
    'El pulpo es un molusco muy inteligente. Tiene ocho brazos llenos de terminaciones nerviosas y puede resolver problemas, abrir recipientes y reconocer personas.',
    'Su piel contiene células que le permiten cambiar de color y textura para camuflarse. Tiene tres corazones y su sangre es azul.' ],
    dato: 'Cada uno de sus brazos puede actuar, en parte, de forma independiente.' },
  tortuga: { habitat: 'Mares tropicales y subtropicales, y playas de anidación', vida: 'Varias décadas', peso: 'Hasta 150 kg', estado: 'En peligro', p: [
    'La tortuga marina pasa casi toda su vida en el mar. Las hembras salen a la playa solo para poner sus huevos en la arena.',
    'Algunas especies recorren miles de kilómetros entre las zonas donde se alimentan y las playas donde nacieron. Se alimentan de algas, pastos marinos y, en algunas especies, de medusas.' ],
    dato: 'El sexo de las crías depende de la temperatura de la arena donde se incuban los huevos.' },
  pez_payaso: { habitat: 'Arrecifes de coral del océano Índico y Pacífico', vida: 'Entre 6 y 10 años', peso: 'Pocos gramos', estado: 'Preocupación menor', p: [
    'El pez payaso es un pez de colores llamativos que vive asociado a las anémonas. Gracias a una capa protectora en su piel, puede moverse entre sus tentáculos sin ser picado.',
    'Vive en grupos con una estructura social definida: una pareja dominante y varios individuos más pequeños.' ],
    dato: 'Si el macho dominante desaparece, la hembra más grande puede cambiar de sexo para ocupar su lugar.' },
  caballito: { habitat: 'Praderas marinas y arrecifes de aguas poco profundas', vida: 'Entre 1 y 4 años', peso: 'Pocos gramos', estado: 'Varía según la especie', p: [
    'El caballito de mar es un pez con cabeza parecida a la de un caballo y cola prensil. Nada en posición vertical y se sujeta a las plantas marinas con su cola.',
    'El macho incuba los huevos en una bolsa en su cuerpo y da a luz a las crías. Se alimenta de pequeños crustáceos que aspira con su hocico.' ],
    dato: 'Tiene un hocico en forma de tubo que le permite succionar pequeños alimentos del agua.' },
  ajolote: { habitat: 'Lagos y canales de México', vida: 'Hasta 15 años', peso: 'Pocos gramos', estado: 'En peligro', p: [
    'El ajolote es un anfibio que conserva sus branquias externas durante toda la vida, por eso parece que siempre tiene plumas alrededor de la cabeza.',
    'Puede regenerar partes de su cuerpo, algo que lo convierte en un animal muy estudiado por los científicos.' ],
    dato: 'Puede regenerar extremidades completas, como patas y cola, en pocas semanas.' },
  camello: { habitat: 'Desiertos y zonas áridas de Asia y África', vida: 'Entre 40 y 50 años', peso: 'Entre 400 y 700 kg', estado: 'Varía según la especie', p: [
    'El camello es un mamífero adaptado al desierto. Su cuerpo puede soportar grandes cambios de temperatura y la falta de agua durante días.',
    'La joroba almacena grasa, que el cuerpo transforma en energía cuando hay escasez de alimento.' ],
    dato: 'Puede perder hasta un 25 % de su peso corporal en agua sin enfermarse gravemente.' },
  canguro: { habitat: 'Praderas y bosques abiertos de Australia', vida: 'Hasta 20 años', peso: 'Entre 20 y 85 kg', estado: 'Preocupación menor', p: [
    'El canguro es un marsupial que se desplaza dando grandes saltos con sus patas traseras. Su cola le ayuda a mantener el equilibrio.',
    'Las crías nacen muy pequeñas y completan su desarrollo dentro de la bolsa de la madre, donde reciben alimento y protección.' ],
    dato: 'Puede saltar varios metros de un solo impulso y alcanzar velocidades altas.' },
  lemur: { habitat: 'Bosques de Madagascar', vida: 'Entre 15 y 20 años', peso: 'Entre 2 y 3 kg', estado: 'En peligro', p: [
    'El lémur de cola anillada vive en grupos y pasa buena parte del día en el suelo y en los árboles. Su cola con anillos le sirve para comunicarse.',
    'Se alimenta de frutas, hojas y flores. Es muy social y se acicala constantemente con sus compañeros.' ],
    dato: 'Las hembras son las que lideran a los grupos de lémures.' },
  pez_koi: { habitat: 'Estanques y ríos de Asia, criados en todo el mundo', vida: 'Hasta 30 años', peso: 'Hasta varios kilos', estado: 'Varía según la especie', p: [
    'El pez koi es una variedad de carpa de colores llamativos. Se cría en estanques y es muy apreciado por su belleza y su larga vida.',
    'Es un pez muy sociable que se acerca a la superficie cuando reconoce a quien lo alimenta.' ],
    dato: 'Algunos ejemplares llegan a vivir más de 50 años.' },
  colonia_pinguinos: { habitat: 'Costas y colonias en el hielo y el mar frío', vida: 'Entre 15 y 20 años', peso: 'Entre 3 y 5 kg', estado: 'Varía según la especie', p: [
    'Los pingüinos viven en colonias numerosas, donde se reconocen por su voz y su aspecto. Son excelentes nadadores aunque no vuelan.',
    'En la colonia se turnan para cuidar a las crías y para buscar alimento en el mar.' ],
    dato: 'Pueden bucear a gran profundidad para cazar peces y calamares.' },
  tigre: { habitat: 'Bosques, selvas y praderas de Asia', vida: 'Entre 10 y 15 años', peso: 'Machos: entre 180 y 260 kg', estado: 'En peligro', p: [
    'El tigre es el felino más grande del mundo. Es un cazador solitario que marca su territorio y se mueve de noche con gran sigilo.',
    'Es un excelente nadador y no le teme al agua, algo poco común entre los felinos.' ],
    dato: 'Cada tigre tiene un patrón de rayas único, como una huella digital.' },
  tigre_blanco: { habitat: 'Bosques de Asia, en cautiverio en la mayoría de los casos', vida: 'Entre 10 y 15 años', peso: 'Machos: entre 180 y 260 kg', estado: 'Varía según la especie', p: [
    'El tigre blanco es una variante del tigre de Bengala con un pelaje claro por una mutación genética. No es una especie distinta.',
    'Su color lo hace menos camuflado en la naturaleza, por eso casi todos los ejemplares viven en zoológicos.' ],
    dato: 'Sus ojos son azules, y el color de su pelaje no afecta su fuerza.' }
};

/* ---------- Estado ---------- */
const state = {
  zona: 'Todas', q: '', soloFavs: false,
  favs: store.get('favs', []),
  fichas: store.get('fichasVistas', []),
  resenas: store.get('resenas', []),
  estrella: 0
};

/* ---------- Avisos ---------- */
function toast(titulo, texto) {
  const t = el('div', 'toast');
  t.append(el('strong', null, titulo), el('span', null, texto));
  $('#toasts').append(t);
  setTimeout(() => t.classList.add('salir'), 3000);
  setTimeout(() => t.remove(), 3500);
}

/* ---------- Estado de apertura ---------- */
function pintarEstado() {
  const ahora = new Date();
  const m = ahora.getHours() * 60 + ahora.getMinutes();
  const abierto = m >= 540 && m < 1080;
  $('#punto').classList.toggle('abierto', abierto);
  $('#estadoTxt').textContent = abierto
    ? 'Abierto ahora · cerramos a las 18:00'
    : (m < 540 ? 'Cerrado por ahora · abrimos a las 09:00' : 'Cerrado · abrimos mañana a las 09:00');
}
pintarEstado();
setInterval(pintarEstado, 30000);

/* ---------- Foto ---------- */
/* Posición de cada foto dentro de su cuadro.
   'center' = centro. Si un animal sale cortado, cambia el valor:
   'center top' muestra más arriba, 'center bottom' más abajo. */
const POSICION_FOTOS = {
  garza: 'center top',
  pinguino: 'center top',
  llama: 'center top',
  puma: 'center 45%',
  rinoceronte: 'center 30%',
};

function foto(a) {
  const caja = el('div', 'photo');
  if (a.img) {
    caja.append(el('div', 'ph', 'Cargando foto…'));
    mostrarImagen(caja, a.img, a, () => sinFoto(a, caja));
    return caja;
  }
  const nombres = [].concat(FOTOS_PROPIAS[a.id] || []).filter(Boolean);
  if (!nombres.length) { sinFoto(a, caja); return caja; }
  caja.append(el('div', 'ph', 'Cargando foto…'));
  const probar = i => {
    if (i >= nombres.length) return sinFoto(a, caja);
    mostrarImagen(caja, CARPETA_FOTOS + nombres[i], a, () => probar(i + 1));
  };
  probar(0);
  return caja;
}

/* Muestra una imagen dentro de la caja; si falla, ejecuta siFalla() */
function mostrarImagen(caja, src, a, siFalla) {
  const im = new Image();
  im.alt = a.nombre;
  im.style.objectPosition = POSICION_FOTOS[a.id] || 'center 30%';
  im.onload = () => caja.replaceChildren(im);
  im.onerror = siFalla;
  im.src = src;
}

/* Si falta la foto del animal, muestra un aviso */
function sinFoto(a, caja) {
  caja.replaceChildren(el('div', 'ph', `Foto de ${a.nombre} no disponible`));
}

/* ---------- ANIMALES ---------- */
function renderChips() {
  $('#zonaChips').replaceChildren(...['Todas', ...Object.keys(ZONAS)].map(z => {
    const b = el('button', 'chip', z);
    b.type = 'button';
    b.dataset.z = z;
    b.style.setProperty('--zc', z === 'Todas' ? 'var(--tinta)' : colorDe(z));
    b.setAttribute('aria-pressed', String(z === state.zona));
    return b;
  }));
}
$('#zonaChips').addEventListener('click', e => {
  const b = e.target.closest('[data-z]');
  if (!b) return;
  state.zona = b.dataset.z;
  renderChips();
  renderGrid();
});
function listaFiltrada() {
  const q = norm(state.q.trim());
  return ANIMALES.filter(a =>
    (state.zona === 'Todas' || a.zona === state.zona) &&
    (!state.soloFavs || state.favs.includes(a.id)) &&
    (!q || norm(a.nombre).includes(q) || norm(a.zona).includes(q))
  ).sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
}
/* Dibujos de fondo de cada área */
const PATRON = {
  'Sabana': 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'70\' height=\'70\'%3E%3Cpath d=\'M0 45 Q17 28 35 45 T70 45\' fill=\'none\' stroke=\'%23c28a2c\' stroke-width=\'4\' opacity=\'.35\'/%3E%3Ccircle cx=\'55\' cy=\'15\' r=\'4\' fill=\'%23c28a2c\' opacity=\'.35\'/%3E%3C/svg%3E")',
  'Selva': 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'70\' height=\'70\'%3E%3Cpath d=\'M10 60 Q30 10 60 20 Q40 50 10 60Z\' fill=\'%232e8b57\' opacity=\'.25\'/%3E%3C/svg%3E")',
  'Montaña': 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'70\' height=\'70\'%3E%3Cpath d=\'M0 70 L20 35 L40 70Z M30 70 L50 40 L70 70Z\' fill=\'%237a5cc2\' opacity=\'.25\'/%3E%3C/svg%3E")',
  'Polar': 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'70\' height=\'70\'%3E%3Cpath d=\'M15 10 V26 M7 18 H23 M50 40 V56 M42 48 H58\' stroke=\'%232f8fc4\' stroke-width=\'3\' opacity=\'.35\'/%3E%3C/svg%3E")',
  'Humedal': 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'70\' height=\'70\'%3E%3Cpath d=\'M0 20 Q9 10 17 20 T35 20 T52 20 T70 20\' fill=\'none\' stroke=\'%231f9d8b\' stroke-width=\'3\' opacity=\'.35\'/%3E%3C/svg%3E")',
  'Aves': 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'70\' height=\'70\'%3E%3Cpath d=\'M10 60 Q40 50 60 10\' fill=\'none\' stroke=\'%23e8833a\' stroke-width=\'3\' opacity=\'.3\'/%3E%3C/svg%3E")',
  'Serpientes': 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'70\' height=\'70\'%3E%3Cpath d=\'M0 15 L17 30 L35 15 L52 30 L70 15\' fill=\'none\' stroke=\'%236a8f2a\' stroke-width=\'4\' opacity=\'.3\'/%3E%3C/svg%3E")',
  'Arácnidos': 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'70\' height=\'70\'%3E%3Ccircle cx=\'35\' cy=\'35\' r=\'22\' fill=\'none\' stroke=\'%238a5a3c\' stroke-width=\'2\' opacity=\'.3\'/%3E%3Ccircle cx=\'35\' cy=\'35\' r=\'10\' fill=\'none\' stroke=\'%238a5a3c\' stroke-width=\'2\' opacity=\'.3\'/%3E%3C/svg%3E")'
};
function tarjeta(a, i) {
  const on = state.favs.includes(a.id);
  const flip = el('article', 'flip');
  flip.style.setProperty('--d', `${Math.min(i * 40, 400)}ms`);
  flip.style.setProperty('--zc', colorDe(a.zona));
  flip.tabIndex = 0;
  flip.setAttribute('role', 'button');
  flip.setAttribute('aria-label', `${a.nombre}. Enter para girar la tarjeta`);
  const inner = el('div', 'inner');
  const front = el('div', 'face front');
  front.append(foto(a), el('h3', null, a.nombre), el('span', 'zona', `${a.zona} · ${a.tamano}`));
  const back = el('div', 'face back');
  back.style.setProperty('--patron', PATRON[a.zona] || 'none');
  const fb = el('button', 'ficha-btn', 'Ficha completa');
  fb.type = 'button';
  fb.dataset.id = a.id;
  const fav = el('button', 'fav', on ? '♥' : '♡');
  fav.type = 'button';
  fav.dataset.id = a.id;
  fav.setAttribute('aria-pressed', String(on));
  fav.setAttribute('aria-label', `Favorito: ${a.nombre}`);
  back.append(el('h3', null, a.nombre), el('p', 'dato', a.dato), el('p', 'meta', `Dieta: ${a.dieta} · Tamaño: ${a.tamano}`), fb, fav);
  inner.append(front, back);
  flip.append(inner);
  return flip;
}
function renderGrid() {
  const l = listaFiltrada();
  $('#grid').replaceChildren(...l.map(tarjeta));
  $('#vacio').hidden = l.length > 0;
  $('#conteo').textContent = `Mostrando ${l.length} de ${ANIMALES.length} animales.`;
}
$('#grid').addEventListener('click', e => {
  const fb = e.target.closest('.ficha-btn');
  if (fb) { e.stopPropagation(); return abrirFicha(fb.dataset.id); }
  const fav = e.target.closest('.fav');
  if (fav) { e.stopPropagation(); return toggleFav(fav.dataset.id); }
  const f = e.target.closest('.flip');
  if (f) f.classList.toggle('flipped');
});
$('#grid').addEventListener('keydown', e => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const f = e.target.closest('.flip');
  if (!f) return;
  e.preventDefault();
  f.classList.toggle('flipped');
});
$('#buscar').addEventListener('input', e => { state.q = e.target.value.slice(0, 40); renderGrid(); });
$('#soloFavs').addEventListener('click', e => {
  state.soloFavs = !state.soloFavs;
  e.currentTarget.setAttribute('aria-pressed', String(state.soloFavs));
  renderGrid();
});
function toggleFav(id) {
  const i = state.favs.indexOf(id);
  if (i > -1) state.favs.splice(i, 1); else state.favs.push(id);
  store.set('favs', state.favs);
  $$('.fav[data-id]').forEach(b => {
    const on = state.favs.includes(b.dataset.id);
    b.textContent = on ? '♥' : '♡';
    b.setAttribute('aria-pressed', String(on));
  });
  $('#sFav').textContent = state.favs.length;
  pintarFavoritos();
  if (state.soloFavs) renderGrid();
}
function abrirFicha(id) {
  const an = ANIMALES.find(a => a.id === id);
  const f = FICHAS[id];
  if (!an || !f) return;
  $('#fdZona').textContent = `${an.zona} · ${an.tamano}`;
  $('#fdTitulo').textContent = an.nombre;
  $('#fdFoto').replaceChildren(foto(an));
  $('#fdDatos').replaceChildren(...[
    ['Hábitat', f.habitat], ['Vida', f.vida], ['Peso', f.peso], ['Dieta', an.dieta], ['Conservación', f.estado]
  ].map(([k, v]) => el('span', null, `${k}: ${v}`)));
  $('#fdTexto').replaceChildren(...f.p.map(t => el('p', null, t)), el('p', 'fd-dato', `Dato curioso: ${f.dato}`));
  $('#ficha').showModal();
}
$('#fdCerrar').addEventListener('click', () => $('#ficha').close());
$('#ficha').addEventListener('click', e => { if (e.target === $('#ficha')) $('#ficha').close(); });

/* ---------- VISITA: clima (Open-Meteo) y boletos ---------- */
const CODIGOS = [
  [[0, 0], 'Despejado'], [[1, 3], 'Parcialmente nublado'], [[45, 48], 'Niebla'],
  [[51, 67], 'Lluvia o llovizna'], [[71, 77], 'Nieve'], [[80, 82], 'Chubascos'], [[95, 99], 'Tormenta']
];
const descCodigo = c => (CODIGOS.find(([r]) => c >= r[0] && c <= r[1]) || [null, 'Variable'])[1];
$('#fecha').min = hoyISO();
$('#fecha').max = sumarDias(15);
$('#climaForm').addEventListener('submit', async e => {
  e.preventDefault();
  const ciudad = $('#ciudad').value.trim();
  const fecha = $('#fecha').value;
  const hoy = hoyISO(), max = sumarDias(15);
  let err = '';
  if (ciudad.length < 2) err = 'Escribe una ciudad (mínimo 2 letras).';
  else if (!fecha) err = 'Elige una fecha.';
  else if (fecha < hoy) err = 'La fecha no puede ser anterior a hoy.';
  else if (fecha > max) err = `El pronóstico llega hasta el ${max}.`;
  setErr('#climaErr', err);
  if (err) return;
  $('#climaRes').textContent = 'Consultando el pronóstico…';
  try {
    const geo = await (await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(ciudad)}&count=1&language=es&format=json`)).json();
    if (!geo.results || !geo.results.length) throw new Error('no encontré esa ciudad.');
    const { latitude, longitude, name, country } = geo.results[0];
    const pr = await (await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=16`)).json();
    const i = pr.daily.time.indexOf(fecha);
    if (i < 0) throw new Error('no hay datos para esa fecha.');
    const codigo = pr.daily.weather_code[i];
    const mx = Math.round(pr.daily.temperature_2m_max[i]);
    const mn = Math.round(pr.daily.temperature_2m_min[i]);
    const consejo = codigo >= 51
      ? 'Se espera lluvia: lleva paraguas y revisa los recorridos techados.'
      : 'Buen día para recorrer todo el zoológico. Lleva agua y protector solar.';
    $('#climaRes').replaceChildren(
      el('p', 'temp', `${mx}° / ${mn}°`),
      el('p', null, `${descCodigo(codigo)} en ${name}${country ? ', ' + country : ''} el ${fecha}.`),
      el('p', null, consejo)
    );
  } catch (ex) {
    $('#climaRes').textContent = 'No pude consultar el clima: ' + ex.message;
  }
});
function calcularBoletos() {
  const a = parseInt($('#adultos').value, 10);
  const n = parseInt($('#ninos').value, 10);
  let err = '';
  if (isNaN(a) || isNaN(n)) err = 'Escribe números válidos.';
  else if (a < 0 || n < 0 || a > 10 || n > 10) err = 'Cada categoría admite de 0 a 10 boletos.';
  else if (a + n === 0) err = 'Elige al menos un boleto.';
  else if (n > 0 && a === 0) err = 'Los niños deben venir con al menos un adulto.';
  setErr('#boletosErr', err);
  $('#total').textContent = err ? '' : `Total: ${CLP(a * PRECIO.adulto + n * PRECIO.nino)}`;
}
['#adultos', '#ninos'].forEach(s => $(s).addEventListener('input', calcularBoletos));

/* ---------- QUIZ ---------- */
const PREGUNTAS = [
  { q: '¿Cómo es tu sábado ideal?', o: [
    ['Explorar una sabana abierta', 'leon'], ['Escalar montañas al amanecer', 'condor'],
    ['Trepar y columpiarte entre árboles', 'mono'], ['Nadar en aguas frías y tranquilas', 'pinguino'] ] },
  { q: '¿Cuál es tu mayor virtud?', o: [
    ['Mi valentía', 'leon'], ['Mi visión de largo alcance', 'condor'],
    ['Mi curiosidad y buen humor', 'mono'], ['Mi paciencia y lealtad', 'pinguino'] ] },
  { q: 'En un grupo, ¿qué papel tomas?', o: [
    ['Lidero y tomo decisiones', 'leon'], ['Observo todo desde lejos', 'condor'],
    ['Animo a todos y hago reír', 'mono'], ['Cuido a los que están cerca', 'pinguino'] ] },
  { q: '¿Dónde te gustaría vivir?', o: [
    ['En una pradera dorada', 'leon'], ['En una cumbre nevada', 'condor'],
    ['En la copa de un árbol', 'mono'], ['En una costa helada', 'pinguino'] ] },
  { q: '¿Qué comida te gusta más?', o: [
    ['Una buena presa', 'leon'], ['Lo que encuentro desde las alturas', 'condor'],
    ['Frutas recién maduras', 'mono'], ['Peces frescos del mar', 'pinguino'] ] }
];
const RESULTADOS = {
  leon:     { nombre: 'León', t: 'Eres líder natural. Te gusta proteger a los tuyos y tomar decisiones con seguridad.' },
  condor:   { nombre: 'Cóndor andino', t: 'Tienes una mirada amplia y paciencia para esperar el momento justo.' },
  mono:     { nombre: 'Mono araña', t: 'Eres curioso, ágil y contagias alegría. Siempre encuentras un camino nuevo.' },
  pinguino: { nombre: 'Pingüino emperador', t: 'Eres leal y constante. Esperarías semanas por lo que importa.' }
};
$('#preguntas').replaceChildren(...PREGUNTAS.map((p, i) => {
  const fs = el('fieldset', 'pregunta');
  fs.append(el('legend', null, `${i + 1}. ${p.q}`));
  p.o.forEach(op => {
    const lab = el('label', 'opcion');
    const inp = document.createElement('input');
    inp.type = 'radio';
    inp.name = `q${i}`;
    inp.value = op[1];
    lab.append(inp, el('span', null, op[0]));
    fs.append(lab);
  });
  return fs;
}));
$('#quizForm').addEventListener('submit', e => {
  e.preventDefault();
  const marcadas = PREGUNTAS.map((_, i) => document.querySelector(`input[name="q${i}"]:checked`));
  const faltan = marcadas.filter(m => !m).length;
  if (faltan) { setErr('#quizErr', `Te faltan ${faltan} pregunta(s) por responder.`); return; }
  setErr('#quizErr', '');
  const puntos = { leon: 0, condor: 0, mono: 0, pinguino: 0 };
  marcadas.forEach(m => puntos[m.value]++);
  const ganador = Object.keys(puntos).reduce((a, b) => puntos[b] > puntos[a] ? b : a);
  const r = RESULTADOS[ganador];
  const box = $('#quizRes');
  box.replaceChildren(el('p', 'k', 'Tu resultado'), el('h3', null, r.nombre), el('p', null, r.t));
  box.hidden = false;
  box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

/* ---------- EXPERIENCIA: puntuación ---------- */
$('#estrellas').append(...[1, 2, 3, 4, 5].map(n => {
  const b = el('button', 'estrella', '★');
  b.type = 'button';
  b.dataset.n = n;
  b.setAttribute('aria-label', `${n} de 5 estrellas`);
  return b;
}));
$('#estrellas').addEventListener('click', e => {
  const b = e.target.closest('.estrella');
  if (!b) return;
  state.estrella = +b.dataset.n;
  $$('.estrella').forEach(x => x.classList.toggle('on', +x.dataset.n <= state.estrella));
});
function pintarPuntuacion() {
  const r = state.resenas;
  const barras = $('#barras');
  if (!r.length) {
    $('#promNum').textContent = '–';
    $('#promEst').textContent = '☆☆☆☆☆';
    $('#promTxt').textContent = 'Aún no hay calificaciones';
    barras.replaceChildren();
  } else {
    const prom = r.reduce((a, x) => a + x.s, 0) / r.length;
    $('#promNum').textContent = prom.toFixed(1);
    $('#promEst').textContent = ESTRELLAS(Math.round(prom));
    $('#promTxt').textContent = `${r.length} calificación${r.length > 1 ? 'es' : ''}`;
    barras.replaceChildren(...[5, 4, 3, 2, 1].map(n => {
      const c = r.filter(x => x.s === n).length;
      const pct = Math.round(c / r.length * 100);
      const fila = el('div', 'barra');
      const pista = el('div', 'pista-b');
      const rel = el('div', 'relleno');
      rel.style.width = pct + '%';
      pista.append(rel);
      fila.append(el('span', null, `${n} ★`), pista, el('span', null, String(c)));
      return fila;
    }));
  }
  $('#muro').replaceChildren(...r.slice(0, 5).map(x => {
    const c = el('div', 'comentario');
    c.append(el('strong', null, x.n || 'Visitante'), el('div', 'r', ESTRELLAS(x.s)));
    if (x.t) c.append(el('p', null, x.t));
    return c;
  }));
}
$('#expForm').addEventListener('submit', e => {
  e.preventDefault();
  const t = $('#expTexto').value.trim();
  const err = !state.estrella ? 'Elige una calificación con las estrellas.' : (t && t.length < 10 ? 'Si escribes un comentario, que tenga al menos 10 caracteres.' : '');
  setErr('#expErr', err);
  if (err) return;
  state.resenas.unshift({ n: $('#expNombre').value.trim(), s: state.estrella, t });
  state.resenas = state.resenas.slice(0, 100);
  store.set('resenas', state.resenas);
  $('#expOk').textContent = '¡Gracias por tu calificación!';
  $('#expTexto').value = '';
  $('#expNombre').value = '';
  state.estrella = 0;
  $$('.estrella').forEach(x => x.classList.remove('on'));
  pintarPuntuacion();
  toast('Calificación guardada', 'Gracias por opinar.');
});

/* ---------- AJUSTES ---------- */
function aplicarNombre() {
  const n = DEFAULT_NAME;
  $('#titulo').replaceChildren(document.createTextNode(n.split(' ')[0] + ' '), el('em', null, n.split(' ').slice(1).join(' ') || ''));
  $('#pieNombre').textContent = n;
  const corto = n.replace(/^Zoológico\s+/i, '').replace(/^Expedición\s+/i, '');
  $('#logoNombre').replaceChildren(document.createTextNode('Zoológico '), el('span', null, corto));
  document.title = n;
}
function aplicarTema(t) {
  document.documentElement.dataset.theme = t;
  $('#temaBtn').textContent = t === 'noche' ? 'Modo claro' : 'Modo oscuro';
  $('#temaBtn').setAttribute('aria-pressed', String(t === 'noche'));
  store.set('tema', t);
}
$('#temaBtn').addEventListener('click', () => {
  document.documentElement.style.removeProperty('--verde');
  store.set('acento', null);
  $('#acento').value = '#2e7d55';
  aplicarTema(document.documentElement.dataset.theme === 'noche' ? 'dia' : 'noche');
});
$('#acento').addEventListener('input', e => {
  document.documentElement.style.setProperty('--verde', e.target.value);
  store.set('acento', e.target.value);
});

/* ---------- Menú activo ---------- */
const enlaces = $$('.menu a');
$$('section[id], header[id]').forEach(s => new IntersectionObserver(entradas => {
  entradas.forEach(en => { if (en.isIntersecting) enlaces.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + s.id)); });
}, { rootMargin: '-45% 0px -50% 0px' }).observe(s));

/* ---------- Inicio ---------- */
renderChips();
renderGrid();
calcularBoletos();
pintarPuntuacion();
aplicarNombre();
const acento = store.get('acento', null);
if (acento) { document.documentElement.style.setProperty('--verde', acento); $('#acento').value = acento; }
aplicarTema(store.get('tema', 'dia'));
/* ================= MOVIMIENTO E INTERACCIÓN ================= */
const reduceMov = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Barra de progreso al desplazarse */
const barraProg = el('div', 'progreso');
document.body.prepend(barraProg);
addEventListener('scroll', () => {
  const h = document.documentElement.scrollHeight - innerHeight;
  barraProg.style.width = (h > 0 ? (scrollY / h) * 100 : 0) + '%';
}, { passive: true });

/* Puntos flotantes de la portada */
(function decorar() {
  const d = el('div', 'decor');
  d.setAttribute('aria-hidden', 'true');
  d.append(el('span', 'punto-d p1'), el('span', 'punto-d p2'), el('span', 'punto-d p3'));
  $('#inicio').prepend(d);
})();
const portada = $('#inicio');
portada.addEventListener('pointermove', e => {
  const r = portada.getBoundingClientRect();
  portada.style.setProperty('--px', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
  portada.style.setProperty('--py', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
});
portada.addEventListener('pointerleave', () => {
  portada.style.setProperty('--px', 0);
  portada.style.setProperty('--py', 0);
});

/* Contadores que suben al entrar a la vista */
function contar(nodo, hasta) {
  if (reduceMov) { nodo.textContent = hasta; return; }
  const t0 = performance.now();
  (function paso(t) {
    const p = Math.min(1, (t - t0) / 900);
    nodo.textContent = Math.round(hasta * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(paso);
  })(t0);
}
const observadorStats = new IntersectionObserver(entradas => {
  entradas.forEach(en => {
    if (!en.isIntersecting) return;
    contar($('#sEsp'), ANIMALES.length);
    contar($('#sHab'), Object.keys(ZONAS).length);
    contar($('#sFav'), state.favs.length);
    observadorStats.disconnect();
  });
}, { threshold: 0.5 });
observadorStats.observe($('.stats'));
document.addEventListener('click', e => {
  if (e.target.closest('.fav')) setTimeout(() => { $('#sFav').textContent = state.favs.length; }, 0);
});

/* Dato curioso que cambia al pulsar el botón */
const DATOS = [
  'El jaguar es el felino más grande de América y nada muy bien.',
  'Las jirafas duermen apenas unos minutos al día.',
  'Los pingüinos emperador cuidan el huevo sobre sus patas.',
  'El mono araña usa su cola como una quinta mano.',
  'El cóndor andino puede planear durante horas sin batir las alas.'
];
let idxDato = Math.floor(Math.random() * DATOS.length);
const sabiasTxt = $('#sabiasTxt');
sabiasTxt.textContent = DATOS[idxDato];
$('#sabiasBtn').addEventListener('click', () => {
  sabiasTxt.classList.add('cambiando');
  setTimeout(() => {
    idxDato = (idxDato + 1) % DATOS.length;
    sabiasTxt.textContent = DATOS[idxDato];
    sabiasTxt.classList.remove('cambiando');
  }, 300);
});

/* Onda al presionar botones */
document.addEventListener('pointerdown', e => {
  const b = e.target.closest('.btn,.chip,.toggle');
  if (!b || reduceMov) return;
  const r = b.getBoundingClientRect();
  const d = Math.max(r.width, r.height);
  const onda = el('span', 'ripple');
  onda.style.width = onda.style.height = d + 'px';
  onda.style.left = (e.clientX - r.left - d / 2) + 'px';
  onda.style.top = (e.clientY - r.top - d / 2) + 'px';
  b.append(onda);
  onda.addEventListener('animationend', () => onda.remove());
});

/* Aparición de cada sección al desplazarse */
$$('.bloque').forEach(b => b.classList.add('rv'));
const observadorRv = new IntersectionObserver(entradas => {
  entradas.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('in'); observadorRv.unobserve(en.target); }
  });
}, { threshold: 0, rootMargin: "0px 0px -5% 0px" });
$$('.bloque').forEach(b => observadorRv.observe(b));

/* Confeti */
function confeti(x, y, n = 26) {
  if (reduceMov) return;
  const cols = ['#ffc02e', '#2e7d55', '#ff6f4c', '#2f8fc4', '#7a5cc2'];
  for (let i = 0; i < n; i++) {
    const c = el('span', 'confeti');
    const a = Math.random() * Math.PI * 2, d = 60 + Math.random() * 120;
    c.style.left = x + 'px';
    c.style.top = y + 'px';
    c.style.background = cols[i % cols.length];
    c.style.setProperty('--x', Math.cos(a) * d + 'px');
    c.style.setProperty('--y', (Math.sin(a) * d + 80) + 'px');
    document.body.append(c);
    c.addEventListener('animationend', () => c.remove());
  }
}
new MutationObserver(() => {
  if (!$('#quizRes').hidden) {
    const r = $('#quizRes').getBoundingClientRect();
    confeti(r.left + r.width / 2, r.top + 40);
  }
}).observe($('#quizRes'), { attributes: true, attributeFilter: ['hidden'] });
$('#expForm').addEventListener('submit', () => {
  const antes = state.resenas.length;
  setTimeout(() => {
    if (state.resenas.length > antes) {
      const r = $('#expForm').getBoundingClientRect();
      confeti(r.left + r.width / 2, r.top + 60, 40);
    }
  }, 0);
});

/* Vista previa de estrellas al pasar el mouse */
$('#estrellas').addEventListener('mouseover', e => {
  const b = e.target.closest('.estrella');
  if (!b) return;
  const n = +b.dataset.n;
  $$('.estrella').forEach(x => x.classList.toggle('prev', +x.dataset.n <= n));
});
$('#estrellas').addEventListener('mouseleave', () => $$('.estrella').forEach(x => x.classList.remove('prev')));
/* ================= MOSAICO Y ACTIVIDADES ================= */
const MOSAICO = [
  { id: 'leon', rot: '-4deg', ty: '0px' },
  { id: 'pinguino', rot: '3deg', ty: '18px' },
  { id: 'mono', rot: '2deg', ty: '-8px' },
  { id: 'aguila_real', rot: '-3deg', ty: '12px' }
];
$('#mosaico').replaceChildren(...MOSAICO.map((m, i) => {
  const a = ANIMALES.find(x => x.id === m.id);
  const t = el('div', 'tile');
  t.style.setProperty('--rot', m.rot);
  t.style.setProperty('--ty', m.ty);
  t.style.setProperty('--d', (i * 120) + 'ms');
  t.setAttribute('role', 'button');
  t.tabIndex = 0;
  t.setAttribute('aria-label', `Ver ficha de ${a.nombre}`);
  t.append(foto(a), el('span', 'nom', a.nombre));
  t.addEventListener('click', () => abrirFicha(a.id));
  t.addEventListener('keydown', e => { if (e.key === 'Enter') abrirFicha(a.id); });
  return t;
}));

const ACTIVIDADES = [
  { id: 'pinguinos', t: 'Alimentación de pingüinos', cat: 'Animales', dia: 0, hora: '11:00', lugar: 'Zona polar', d: 'Mira cómo los cuidadores preparan el pescado y alimentan a los pingüinos.' },
  { id: 'sabana', t: 'Paseo guiado por la sabana', cat: 'Recorridos', dia: 1, hora: '10:00', lugar: 'Sabana', d: 'Un guía te lleva a conocer jirafas, cebras y elefantes, y explica sus costumbres.' },
  { id: 'rapaces', t: 'Show de aves rapaces', cat: 'Espectáculos', dia: 3, hora: '15:00', lugar: 'Montaña', d: 'Águilas y búhos vuelan sobre el público en una exhibición de vuelo.' },
  { id: 'taller', t: 'Taller: pinta tu animal', cat: 'Niños', dia: 4, hora: '11:00', lugar: 'Pabellón de aves', d: 'Dibuja a tu animal favorito con materiales del zoológico. Ideal para niños.' },
  { id: 'estrellas', t: 'Noche de las estrellas', cat: 'Especiales', dia: 6, hora: '19:30', lugar: 'Explanada', d: 'Observación del cielo con telescopios y una charla sobre los animales nocturnos.' },
  { id: 'charla', t: 'Charla de conservación', cat: 'Charlas', dia: 9, hora: '17:00', lugar: 'Auditorio', d: 'Veterinarios y biólogos explican cómo protegemos a las especies en peligro.' }
];
let actCat = 'Todas';
let actInteres = store.get('interes', []);
const etiquetaDia = d => d === 0 ? 'Hoy' : d === 1 ? 'Mañana' : `En ${d} días`;

function renderActs() {
  const cats = ['Todas', ...new Set(ACTIVIDADES.map(a => a.cat))];
  $('#actChips').replaceChildren(...cats.map(c => {
    const b = el('button', 'chip', c);
    b.type = 'button';
    b.dataset.c = c;
    b.setAttribute('aria-pressed', String(c === actCat));
    return b;
  }));
  const lista = ACTIVIDADES.filter(a => actCat === 'Todas' || a.cat === actCat);
  $('#actLista').replaceChildren(...lista.map((a, i) => {
    const card = el('article', 'tarjeta act');
    card.style.setProperty('--d', (i * 70) + 'ms');
    const on = actInteres.includes(a.id);
    const btn = el('button', 'interes', on ? '♥ Me interesa' : '♡ Me interesa');
    btn.type = 'button';
    btn.dataset.id = a.id;
    btn.setAttribute('aria-pressed', String(on));
    const pie = el('div', 'pie-act');
    pie.append(el('span', 'meta', a.lugar), btn);
    card.append(el('span', 'cuando', `${etiquetaDia(a.dia)} · ${a.hora}`), el('h3', null, a.t), el('p', null, a.d), pie);
    return card;
  }));
}
$('#actChips').addEventListener('click', e => {
  const b = e.target.closest('[data-c]');
  if (!b) return;
  actCat = b.dataset.c;
  renderActs();
});
$('#actLista').addEventListener('click', e => {
  const b = e.target.closest('.interes');
  if (!b) return;
  const id = b.dataset.id;
  const i = actInteres.indexOf(id);
  if (i > -1) actInteres.splice(i, 1); else actInteres.push(id);
  store.set('interes', actInteres);
  const on = actInteres.includes(id);
  b.textContent = on ? '♥ Me interesa' : '♡ Me interesa';
  b.setAttribute('aria-pressed', String(on));
  if (on) {
    const r = b.getBoundingClientRect();
    confeti(r.left + r.width / 2, r.top, 18);
    toast('Anotado', 'Te recordaremos esta actividad.');
  }
});
renderActs();
/* ================= LOGO DEL ZOOLÓGICO ================= */
/* Pon tu imagen junto al archivo HTML con este nombre (o cambia el nombre aquí). */
const LOGO_ARCHIVO = 'logo.jpg';
const logoZoo = $('#logoZoo');
logoZoo.addEventListener('error', () => { logoZoo.removeAttribute('src'); logoZoo.alt = ''; logoZoo.classList.add('vacio'); });
logoZoo.src = LOGO_ARCHIVO;
/* ================= COLORES ================= */
const colorSol = $('#colorSol');
function aplicarSol(v) { document.documentElement.style.setProperty('--sol', v); }
const solGuardado = store.get('colorSol', null);
if (solGuardado) { aplicarSol(solGuardado); colorSol.value = solGuardado; }
colorSol.addEventListener('input', e => {
  aplicarSol(e.target.value);
  store.set('colorSol', e.target.value);
});
/* ================= FAVORITOS Y CUENTA REGRESIVA ================= */
function pintarFavoritos() {
  const favs = ANIMALES.filter(a => state.favs.includes(a.id));
  if (!favs.length) {
    $('#favLista').replaceChildren(el('p', 'meta', 'Aún no tienes favoritos. Marca el corazón de un animal en la sección Animales.'));
    return;
  }
  $('#favLista').replaceChildren(...favs.map(a => {
    const c = el('button', 'mini');
    c.type = 'button';
    c.append(foto(a), el('strong', null, a.nombre));
    c.addEventListener('click', () => abrirFicha(a.id));
    return c;
  }));
}
document.addEventListener('click', e => {
  if (e.target.closest('.fav')) setTimeout(pintarFavoritos, 0);
});

const regIn = $('#regFecha');
regIn.min = hoyISO();
let regTimer = null;
function pintarRegresiva(fechaStr) {
  clearInterval(regTimer);
  const objetivo = new Date(fechaStr + 'T09:00:00');
  const tick = () => {
    const diff = objetivo - new Date();
    if (diff <= 0) {
      $('#regCajas').replaceChildren(el('p', 'meta', '¡Hoy es tu visita! Que disfrutes el zoológico.'));
      clearInterval(regTimer);
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor(diff / 3600000) % 24;
    const m = Math.floor(diff / 60000) % 60;
    const seg = Math.floor(diff / 1000) % 60;
    $('#regCajas').replaceChildren(...[[d, 'días'], [h, 'horas'], [m, 'minutos'], [seg, 'segundos']].map(([n, l]) => {
      const c = el('div', 'reg-caja');
      c.append(el('b', null, String(n).padStart(2, '0')), el('span', null, l));
      return c;
    }));
  };
  tick();
  regTimer = setInterval(tick, 1000);
}
$('#regForm').addEventListener('submit', e => {
  e.preventDefault();
  const f = regIn.value;
  const err = !f ? 'Elige la fecha de tu visita.' : (f < hoyISO() ? 'Elige una fecha de hoy en adelante.' : '');
  setErr('#regErr', err);
  if (err) return;
  store.set('fechaVisita', f);
  pintarRegresiva(f);
});
const fechaGuardada = store.get('fechaVisita', '');
if (fechaGuardada && fechaGuardada >= hoyISO()) {
  regIn.value = fechaGuardada;
  pintarRegresiva(fechaGuardada);
}
pintarFavoritos();
