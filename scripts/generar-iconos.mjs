// Genera favicon PNG, íconos de la PWA y la imagen para redes (og.png)
// a partir de los SVG oficiales de /public/marca. Uso: pnpm iconos
import { readFile } from "node:fs/promises";
import sharp from "sharp";

const publico = new URL("../public/", import.meta.url);
const leer = (f) => readFile(new URL(f, publico), "utf8");

const isoSvg = await leer("marca/aps-isotipo.svg");
const [estructura, acento] = [...isoSvg.matchAll(/<path d="([^"]+)"/g)].map((m) => m[1]);
const logoNegativo = await leer("marca/aps-logo-negativo.svg");

const GRAFITO = "#2A2F31";
const MARFIL = "#F4F1EA";

// Isotipo centrado sobre un cuadrado; `escala` = fracción del lado que ocupa
function cuadro(lado, { fondo, color, escala, radio = 0 }) {
  const w = lado * escala;
  const s = w / 628;
  const x = (lado - w) / 2;
  const y = (lado - 530 * s) / 2;
  const bg = fondo ? `<rect width="${lado}" height="${lado}" rx="${radio}" fill="${fondo}"/>` : "";
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${lado}" height="${lado}">${bg}<g transform="translate(${x} ${y}) scale(${s})" fill="${color}"><path d="${estructura}"/><path d="${acento}"/></g></svg>`,
  );
}

const salidas = [
  ["favicon-32.png", cuadro(32, { color: "#353B3D", escala: 0.94 })],
  ["apple-touch-icon.png", cuadro(180, { fondo: GRAFITO, color: MARFIL, escala: 0.58 })],
  ["icon-192.png", cuadro(192, { fondo: GRAFITO, color: MARFIL, escala: 0.58, radio: 40 })],
  ["icon-512.png", cuadro(512, { fondo: GRAFITO, color: MARFIL, escala: 0.58, radio: 108 })],
  ["icon-512-maskable.png", cuadro(512, { fondo: GRAFITO, color: MARFIL, escala: 0.46 })],
];
for (const [nombre, svg] of salidas) {
  await sharp(svg).png().toFile(new URL(nombre, publico).pathname);
}

// Imagen para redes: logotipo negativo + las tres barras de la marca
const anchoLogo = 560;
const logoPng = await sharp(Buffer.from(logoNegativo)).resize({ width: anchoLogo }).png().toBuffer();
const altoLogo = Math.round((anchoLogo * 90) / 312);
const barras = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
    <rect width="1200" height="630" fill="${GRAFITO}"/>
    <g transform="translate(${600 - 87} 470)">
      <rect width="54" height="6" rx="3" fill="${MARFIL}"/>
      <rect x="60" width="54" height="6" rx="3" fill="#C9A54E"/>
      <rect x="120" width="54" height="6" rx="3" fill="#4FA3AB"/>
    </g>
  </svg>`,
);
await sharp(barras)
  .composite([{ input: logoPng, left: Math.round(600 - anchoLogo / 2), top: Math.round(290 - altoLogo / 2) }])
  .png()
  .toFile(new URL("og.png", publico).pathname);

console.log("Íconos y og.png generados en /public");
