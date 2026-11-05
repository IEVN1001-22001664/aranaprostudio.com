// Catálogo de APS Business. Viene de AppWorkflow (la app donde se administran los
// servicios): lo que se marque como «Publicado en web» allá aparece aquí.
//
// Se lee al compilar, no en el navegador: las tarjetas quedan en el HTML, Google las
// indexa y GSAP las anima como cualquier otra parte del sitio. Si la API no responde,
// el build falla a propósito y en Hostinger se queda la versión anterior (nunca se
// publica un catálogo vacío por un error de red).
//
// Contrato de la API: appworkflow/docs/integracion-sitio.md (version 1).

export interface ServicioCatalogo {
  nombre: string;
  slug: string;
  categoria: string | null;
  descripcion: string | null;
  /** Uno por elemento, ya sin viñetas. */
  beneficios: string[];
  unidad: "proyecto" | "hora" | "pieza" | "sesion" | "mes" | "anual" | "licencia";
  /** Precio «desde» en MXN, o null si no se muestra. */
  precio: number | null;
  imagen_url: string | null;
  orden: number;
}

// CATALOGO_API permite compilar contra otra instancia (pruebas locales).
const API = import.meta.env.CATALOGO_API || "https://appworkflow-pi.vercel.app/api/catalogo";

export async function leerCatalogo(): Promise<ServicioCatalogo[]> {
  let respuesta: Response;
  try {
    respuesta = await fetch(API, { headers: { accept: "application/json" } });
  } catch (e) {
    throw new Error(`No se pudo conectar con el catálogo de AppWorkflow (${API}): ${String(e)}`);
  }
  if (!respuesta.ok) throw new Error(`El catálogo de AppWorkflow respondió ${respuesta.status} (${API})`);
  const datos = (await respuesta.json()) as { version?: number; servicios?: ServicioCatalogo[] };
  if (datos.version !== 1 || !Array.isArray(datos.servicios)) {
    throw new Error(`El catálogo de AppWorkflow cambió de formato (version ${String(datos.version)})`);
  }
  return datos.servicios;
}

export const POR_UNIDAD: Record<ServicioCatalogo["unidad"], string> = {
  proyecto: "por proyecto",
  hora: "por hora",
  pieza: "por pieza",
  sesion: "por sesión",
  mes: "al mes",
  anual: "al año",
  licencia: "por licencia",
};

const mxn = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });
export const formatoPrecio = (n: number) => `${mxn.format(n)} MXN`;
