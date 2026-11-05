# Estado del proyecto

_Última actualización: 5 de noviembre de 2026_

## Hecho

### Fase 1: base del sitio
- Proyecto Astro 7 estático con TypeScript, pnpm, GSAP, Lenis y fuentes autoalojadas (Unbounded, Jost y Cormorant Garamond).
- Sistema de diseño con los tokens del manual en `src/styles/global.css`.
- Trazos oficiales del logo extraídos a `src/lib/marca.ts`; los SVG oficiales están en `public/marca/`.
- Contenido editable centralizado en `src/lib/sitio.ts` (servicios, proceso, proyectos y contacto).
- Secciones de la página:
  1. **Intro**: el isotipo se arma con sus dos piezas sobre la diagonal de 37°, con contador, y sale con una cortina a 37°.
  2. **Hero**: "Vision into results." con revelado por letra, retícula de construcción, isotipo tono sobre tono con parallax y reloj de León en vivo.
  3. **Zoom del isotipo**: escena fijada en la que el isotipo negativo crece hasta llenar la pantalla y revela "Creatividad. Tecnología. Resultados."
  4. **Estudio**: manifiesto que se colorea palabra por palabra y los atributos Elegante, Preciso y Veloz.
  5. **Marquesina** "Creativity · Technology · Results" que reacciona a la velocidad del scroll.
  6. **Líneas**: paneles de Moments y Business con sus logos oficiales, que se expanden al pasar el cursor.
  7. **Servicios**: lista filtrable por línea, con tarjeta que sigue al cursor.
  8. **Proceso**: scroll horizontal fijado con cuatro pasos y barra de avance.
  9. **Trabajo**: rejilla de proyectos con revelado y parallax. Por ahora solo hay espacios de muestra.
  10. **Contacto**: correo, WhatsApp, teléfono y redes.
  11. **Pie**: logotipo oficial a gran escala.
- Cursor personalizado, botones magnéticos y cabecera que cambia de color según la sección y se oculta al bajar.
- Menú móvil, página 404, favicon claro/oscuro, íconos de PWA, `og.png`, sitemap, robots y JSON-LD.
- `.htaccess` para Hostinger: HTTPS, sin www, caché y cabeceras de seguridad.
- GitHub Actions: compila en cada push y despliega por FTP cuando existen los Secrets.
- Accesibilidad: con `prefers-reduced-motion` o sin JS todo el contenido se ve estático; hay enlace para saltar al contenido.

### Planes de APS Business desde AppWorkflow (5 de noviembre de 2026)
- Bloque **«APS Business · Planes»** dentro de Servicios (`src/components/CatalogoBusiness.astro`), debajo de la lista: tarjetas con imagen, categoría, descripción, beneficios, precio «Desde … MXN» y botón **Cotizar** por WhatsApp (`SITIO.whatsapp`) con el nombre del servicio en el mensaje.
- Filtros por categoría (si hay dos o más), con `ScrollTrigger.refresh()` al filtrar para que la sección fijada de Proceso no se desfase.
- Los datos vienen de `https://appworkflow-pi.vercel.app/api/catalogo` (`src/lib/catalogo.ts`): lo que se marque como **Publicado en web** en AppWorkflow → Servicios. Si no hay nada publicado, el bloque no aparece.
- Se leen **al compilar**: compilación diaria a la 01:17 de CDMX (`schedule` en `desplegar.yml`) y a mano con **Actions → Compilar y desplegar → Run workflow**.
- Si la API no responde, **el build falla a propósito** y en Hostinger se queda la versión anterior.
- Para compilar contra otra instancia: `CATALOGO_API=http://localhost:3200/api/catalogo pnpm build`.

## Decisiones

- **Astro estático en lugar de Next.js**: es un sitio de presentación sin backend. Genera HTML puro, ideal para el hosting compartido de Hostinger.
- **El isotipo solo se traslada o escala**: así se cumple la regla de no deformar ni rotar.
- **La intro se muestra una vez por sesión** (`sessionStorage`).
- **Correo de contacto `hola@aranaprostudio.com`**: el manual muestra `info@aps.com`, que parece un marcador; el registro DMARC usa `hola@`.
- **Planes de Business al compilar y no en el navegador**: el HTML queda completo para Google y para GSAP (sin saltos de ScrollTrigger), y el sitio no depende de AppWorkflow para cargar. A cambio, los cambios tardan hasta un día o una ejecución manual del workflow.
- **Los planes son de Business**: las tarjetas usan petróleo y la franja a 37°; la lista de Servicios de arriba sigue mostrando las dos líneas.
- **El contacto es por enlaces** (correo, WhatsApp y teléfono), sin formulario por ahora.

## Pendientes del usuario

- [ ] Crear la cuenta FTP en Hostinger y cargar los Secrets en GitHub (ver `docs/DESPLIEGUE.md`).
- [ ] Agregar en Cloudflare el registro A de `@` y el CNAME de `www` apuntando a Hostinger, y activar el SSL.
- [ ] Confirmar que el buzón `hola@aranaprostudio.com` existe en Hostinger Mail.
- [ ] Confirmar las cuentas de Instagram (@aps.moments y @aps.business) y si hay LinkedIn.
- [ ] Elegir las fotos y proyectos reales para la sección Trabajo.

## Siguiente

- Sustituir los espacios de Trabajo por proyectos reales (fotos en `public/trabajo/`, optimizadas con `astro:assets`).
- Páginas propias para `/moments` y `/business` con su paleta y su tono.
- Formulario de contacto (PHP de Hostinger o un servicio como Formspree).
- Analítica respetuosa con la privacidad (Plausible o Umami).
- Medir con Lighthouse en producción.
