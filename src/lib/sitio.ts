// Contenido editable del sitio. Cambia aquí textos, servicios y datos de contacto
// sin tocar los componentes.

export const SITIO = {
  nombre: "APS · AranaProStudio",
  dominio: "aranaprostudio.com",
  url: "https://aranaprostudio.com",
  lema: "Creativity · Technology · Results",
  vision: "Vision into results.",
  descripcion:
    "APS une creatividad y tecnología para transformar ideas en experiencias y soluciones reales: fotografía, video, sitios web, apps y estrategia digital desde León, Guanajuato.",
  autor: "Nacho Arana",
  ciudad: "León, Guanajuato · México",
  zonaHoraria: "America/Mexico_City",
  correo: "hola@aranaprostudio.com",
  telefono: "+52 428 107 5882",
  whatsapp: "524281075882",
  redes: [
    { nombre: "Instagram · Moments", usuario: "@aps.moments", url: "https://instagram.com/aps.moments" },
    { nombre: "Instagram · Business", usuario: "@aps.business", url: "https://instagram.com/aps.business" },
  ],
} as const;

export type Linea = "moments" | "business";

export const LINEAS = {
  moments: {
    nombre: "Moments",
    promesa: "Lo que merece recordarse.",
    publico: "Personas, parejas y familias",
    tono: "Cálido, emocional, cercano",
    texto:
      "Retratos, bodas e historias que se cuentan con luz. Su día merece recordarse como se sintió.",
    cta: "Agenda tu fecha",
    usuario: "@aps.moments",
  },
  business: {
    nombre: "Business",
    promesa: "Tu aliado digital estratégico.",
    publico: "Negocios, profesionistas y empresas",
    tono: "Claro, seguro, orientado a resultados",
    texto:
      "Tu imagen habla antes que tú. Sitio web, video y estrategia para que tu negocio venda más.",
    cta: "Impulsa tu negocio",
    usuario: "@aps.business",
  },
} as const;

export const SERVICIOS: { titulo: string; detalle: string; linea: Linea }[] = [
  { titulo: "Retrato", detalle: "Sesiones que te hacen verte como eres en tu mejor día.", linea: "moments" },
  { titulo: "Bodas foto + film", detalle: "Su historia completa, en foto y video, sin perder un momento.", linea: "moments" },
  { titulo: "Invitaciones web", detalle: "Una invitación que se abre en cualquier teléfono y emociona.", linea: "moments" },
  { titulo: "XV años y eventos", detalle: "Cobertura completa con entrega ágil y cuidada.", linea: "moments" },
  { titulo: "Sitios web", detalle: "Rápidos, claros y hechos para vender. Tu negocio abierto las 24 horas.", linea: "business" },
  { titulo: "Marketing digital", detalle: "Estrategia y contenido para que te encuentren y te elijan.", linea: "business" },
  { titulo: "Apps y sistemas", detalle: "Herramientas a la medida que ordenan y aceleran tu operación.", linea: "business" },
  { titulo: "Foto y video comercial", detalle: "Producto, marca y equipo con nivel profesional.", linea: "business" },
];

export const ATRIBUTOS = [
  { nombre: "Elegante", texto: "Paleta sobria, espacio en blanco y acabados cuidados. Nunca saturado ni estridente." },
  { nombre: "Preciso", texto: "Geometría exacta, un solo ángulo, retícula estricta. Lo mismo en el diseño que en la entrega." },
  { nombre: "Veloz", texto: "Mensajes cortos, procesos ágiles y tiempos de entrega claros." },
];

export const PROCESO = [
  { titulo: "Platiquemos", texto: "Escuchamos tu idea, tu público y lo que quieres lograr. Sin tecnicismos." },
  { titulo: "Propuesta", texto: "Recibes alcance, tiempos y costo claros antes de empezar." },
  { titulo: "Producción", texto: "Diseño, sesión, desarrollo o rodaje con avances que puedes ver." },
  { titulo: "Entrega", texto: "Tu proyecto listo, a tiempo y con el acabado que mereces." },
];

// Proyectos de muestra. Sustituye `imagen` por fotos reales en /public/trabajo/.
export const PROYECTOS: { titulo: string; categoria: string; linea: Linea; anio: string; imagen?: string }[] = [
  { titulo: "Proyecto web", categoria: "Sitio web", linea: "business", anio: "2026" },
  { titulo: "Boda", categoria: "Foto + film", linea: "moments", anio: "2026" },
  { titulo: "Marca comercial", categoria: "Video comercial", linea: "business", anio: "2026" },
  { titulo: "Retrato", categoria: "Sesión", linea: "moments", anio: "2026" },
];

export const NAV = [
  { texto: "Estudio", href: "#estudio" },
  { texto: "Líneas", href: "#lineas" },
  { texto: "Servicios", href: "#servicios" },
  { texto: "Proceso", href: "#proceso" },
  { texto: "Trabajo", href: "#trabajo" },
];
