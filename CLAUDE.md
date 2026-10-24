# Instrucciones para Claude Code — aranaprostudio.com

Sitio web personal de **APS · AranaProStudio** (Nacho Arana, León, Gto.). Sitio estático muy animado que presenta la marca madre y sus dos líneas: **APS Moments** y **APS Business**.

## Reglas de trabajo

- **Responde siempre en español.** El sitio va en es-MX.
- **Al empezar una sesión:** ejecuta `git pull` y lee [docs/ESTADO.md](docs/ESTADO.md), que es la fuente de verdad.
- **Al terminar cada bloque:** actualiza `docs/ESTADO.md`, haz commit y push. Pide confirmación antes del push si el cambio es grande o destructivo.
- **Secretos:** nunca pidas claves en el chat ni las escribas en archivos versionados. Las credenciales FTP viven en los Secrets de GitHub.

## Marca (Manual de identidad v1.0)

La marca es la regla. Antes de diseñar algo nuevo revisa [docs/MARCA.md](docs/MARCA.md).

- Usa solo los trazos oficiales: [src/lib/marca.ts](src/lib/marca.ts) y [public/marca/](public/marca/). Nunca escribas "APS" con una fuente para hacer de logotipo.
- El isotipo **no se rota, no se inclina, no se deforma y no lleva sombras ni brillos**. En las animaciones solo se traslada o se escala de forma uniforme.
- Un solo ángulo: **37°** para todas las diagonales (`--angulo`, `--tan37`, `DIAG` en el JS).
- Colores: solo los tokens de [src/styles/global.css](src/styles/global.css). Proporción: neutros claros 55 %, carbón/grafito 30 %, acento de la línea 10 % y apoyo 5 %.
- Tipografía: Unbounded 500 para títulos, Jost para textos y Cormorant Garamond itálica **solo** en frases cortas de Moments.
- Voz: frases cortas, beneficio antes que equipo, de tú con clase, sin exceso (máximo un emoji y nunca dobles signos de exclamación).

## Stack

- Astro 7 (salida estática) + TypeScript.
- GSAP 3 (ScrollTrigger, SplitText y DrawSVG) + Lenis para el desplazamiento suave.
- Fuentes autoalojadas con Fontsource.
- Despliegue: GitHub Actions → FTP → Hostinger. Ver [docs/DESPLIEGUE.md](docs/DESPLIEGUE.md).
- Accesibilidad: con `prefers-reduced-motion` o sin JS todo el contenido es visible y estático.
