// Motor de animación del sitio. Todo movimiento respeta la regla de marca:
// el isotipo solo se traslada o escala de forma uniforme, nunca se rota ni
// se deforma, y las diagonales siguen el ángulo de 37°.

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);

const raiz = document.documentElement;
const conMovimiento = raiz.classList.contains("js-anim");
const punteroFino = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

// Vector unitario de la diagonal de la marca, hacia arriba y a la derecha.
const RAD = (37 * Math.PI) / 180;
const DIAG = { x: Math.cos(RAD), y: -Math.sin(RAD) };
const TAN = Math.tan(RAD);

const $ = <T extends Element = HTMLElement>(sel: string, ctx: ParentNode = document) => ctx.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string, ctx: ParentNode = document) =>
  Array.from(ctx.querySelectorAll<T>(sel));

let lenis: Lenis | null = null;

/* ==========================================================================
   Funciones que operan con o sin animación
   ========================================================================== */

function iniciarReloj() {
  const reloj = $("[data-reloj]");
  if (!reloj) return;
  const formato = new Intl.DateTimeFormat("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Mexico_City",
  });
  const pintar = () => {
    reloj.textContent = formato.format(new Date());
  };
  pintar();
  setInterval(pintar, 15_000);
}

function iniciarMenu() {
  const boton = $<HTMLButtonElement>("[data-menu-boton]");
  const menu = $("[data-menu]");
  if (!boton || !menu) return;
  const enlaces = $$("[data-menu-enlace]", menu);

  const abrir = (abierto: boolean) => {
    boton.setAttribute("aria-expanded", String(abierto));
    boton.querySelector(".sr-only")!.textContent = abierto ? "Cerrar menú" : "Abrir menú";
    if (abierto) {
      menu.hidden = false;
      lenis?.stop();
      if (conMovimiento) {
        gsap.fromTo(
          menu,
          { clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)" },
          { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", duration: 0.8, ease: "expo.out" },
        );
        gsap.from(enlaces, { yPercent: 60, opacity: 0, stagger: 0.05, duration: 0.7, ease: "expo.out", delay: 0.15 });
      }
    } else {
      lenis?.start();
      if (conMovimiento) {
        gsap.to(menu, {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
          duration: 0.6,
          ease: "expo.inOut",
          onComplete: () => {
            menu.hidden = true;
          },
        });
      } else {
        menu.hidden = true;
      }
    }
  };

  boton.addEventListener("click", () => abrir(boton.getAttribute("aria-expanded") !== "true"));
  enlaces.forEach((a) => a.addEventListener("click", () => abrir(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && boton.getAttribute("aria-expanded") === "true") abrir(false);
  });
}

function iniciarFiltros() {
  const grupo = $("[data-filtros]");
  if (!grupo) return;
  const botones = $$<HTMLButtonElement>("button", grupo);
  const filas = $$("[data-servicios] [data-linea]");
  botones.forEach((b) =>
    b.addEventListener("click", () => {
      const filtro = b.dataset.filtro;
      botones.forEach((o) => o.setAttribute("aria-pressed", String(o === b)));
      filas.forEach((f) => f.classList.toggle("atenuada", filtro !== "todos" && f.dataset.linea !== filtro));
    }),
  );
}

function iniciarAnclas() {
  $$<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href")!;
      const destino = id === "#" ? null : $(id);
      if (!destino) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(destino as HTMLElement, { offset: 0, duration: 1.6 });
      else destino.scrollIntoView({ behavior: "smooth" });
      history.replaceState(null, "", id);
    });
  });
}

/* ==========================================================================
   Desplazamiento suave
   ========================================================================== */

function iniciarLenis() {
  lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis!.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ==========================================================================
   Intro: el isotipo se arma con sus dos piezas y la cortina sale a 37°
   ========================================================================== */

function intro(): Promise<void> {
  const capa = $("[data-intro]");
  if (!capa || raiz.classList.contains("sin-intro") || getComputedStyle(capa).display === "none") {
    return Promise.resolve();
  }
  try {
    sessionStorage.setItem("aps-intro", "1");
  } catch {}

  lenis?.stop();
  const estructura = $(".iso-estructura", capa);
  const acento = $(".iso-acento", capa);
  const num = $("[data-intro-num]", capa)!;
  const contador = { v: 0 };
  const L = 140;

  return new Promise((resolver) => {
    const tl = gsap.timeline({
      defaults: { ease: "expo.out" },
      onComplete: () => {
        capa.remove();
        lenis?.start();
        resolver();
      },
    });

    tl.from(estructura, { x: -DIAG.x * L, y: -DIAG.y * L, opacity: 0, duration: 1.2 }, 0.1)
      .from(acento, { x: DIAG.x * L, y: -DIAG.y * L, opacity: 0, duration: 1.2 }, 0.35)
      .to(contador, {
        v: 100,
        duration: 1.5,
        ease: "power2.inOut",
        onUpdate: () => {
          num.textContent = String(Math.round(contador.v));
        },
      }, 0)
      .from($$(".intro-pie, .intro-lema", capa), { opacity: 0, y: 12, duration: 0.8, stagger: 0.1 }, 0.2)
      .to($(".intro-centro", capa), { y: -40, opacity: 0, duration: 0.6, ease: "power3.in" }, 1.75);

    // Cortina: un borde a 37° que sube y descubre la página
    const cortina = { y: 0 };
    tl.add(() => {
      const W = innerWidth;
      const H = innerHeight;
      const d = W * TAN;
      cortina.y = H;
      gsap.to(cortina, {
        y: -d,
        duration: 1.1,
        ease: "expo.inOut",
        onUpdate: () => {
          capa.style.clipPath = `polygon(0 0, 100% 0, 100% ${cortina.y + d}px, 0 ${cortina.y}px)`;
        },
      });
    }, 2.05);
    tl.to({}, { duration: 1.1 }, 2.05);
  });
}

/* ==========================================================================
   Hero
   ========================================================================== */

function hero(conIntro: boolean) {
  const titulo = $("[data-hero-titulo]");
  const iso = $("[data-hero-iso]");
  const sube = $$("[data-hero-sube]");
  if (!titulo || !iso) return;

  gsap.set([titulo, iso, ...sube], { opacity: 1 });

  const split = SplitText.create(titulo, { type: "lines,chars", mask: "lines", linesClass: "linea" });
  const tl = gsap.timeline({ delay: conIntro ? 0 : 0.15, defaults: { ease: "expo.out" } });

  tl.from(split.chars, { yPercent: 115, duration: 1.4, stagger: 0.035 }, 0)
    .from(iso, { x: -DIAG.x * 220, y: -DIAG.y * 220, opacity: 0, duration: 2.2 }, 0.1)
    .from(".reticula-lineas line", { drawSVG: 0, duration: 1.8, ease: "power3.inOut", stagger: 0.12 }, 0)
    .from(".reticula-diagonales line", { opacity: 0, x: -DIAG.x * 60, y: -DIAG.y * 60, duration: 1.6, stagger: 0.1 }, 0.3)
    .from(sube, { y: 30, opacity: 0, duration: 1.1, stagger: 0.08 }, 0.55);

  // Al salir: el isotipo sigue avanzando sobre su diagonal y el texto se aleja
  gsap.to(iso.querySelector(".isotipo"), {
    x: DIAG.x * 160,
    y: DIAG.y * 160,
    ease: "none",
    scrollTrigger: { trigger: "[data-hero]", start: "top top", end: "bottom top", scrub: true },
  });
  gsap.to(".hero-contenido", {
    yPercent: -18,
    opacity: 0.2,
    ease: "none",
    scrollTrigger: { trigger: "[data-hero]", start: "top top", end: "bottom top", scrub: true },
  });

  // Reacción suave al puntero
  if (punteroFino) {
    const mx = gsap.quickTo(iso, "xPercent", { duration: 1.6, ease: "power3.out" });
    const my = gsap.quickTo(iso, "yPercent", { duration: 1.6, ease: "power3.out" });
    $("[data-hero]")!.addEventListener("pointermove", (e) => {
      mx((e.clientX / innerWidth - 0.5) * 3);
      my((e.clientY / innerHeight - 0.5) * 3);
    });
  }
}

/* ==========================================================================
   Zoom a través del isotipo
   ========================================================================== */

function zoomIsotipo() {
  const seccion = $("[data-zoom]");
  const grupo = $<SVGGElement>("[data-zoom-iso]");
  const velo = $("[data-zoom-velo]");
  const palabras = $$("[data-zoom-palabras] span");
  const indicacion = $("[data-zoom-indicacion]");
  if (!seccion || !grupo || !velo) return;

  // Punto dentro de la parte más gruesa de la estructura (coordenadas 628×530)
  const P = { x: 470, y: 182 };
  const RADIO_SEGURO = 80;
  const estado = { p: 0 };

  const pintar = () => {
    const W = innerWidth;
    const H = innerHeight;
    const s0 = Math.min((W * 0.36) / 628, (H * 0.46) / 530);
    const s1 = Math.hypot(W, H) / 2 / RADIO_SEGURO;
    const t0x = W / 2 - 314 * s0;
    const t0y = H / 2 - 265 * s0;
    const p = estado.p;
    const s = s0 * Math.pow(s1 / s0, p);
    // El punto P viaja de su posición inicial al centro de la pantalla
    const k = gsap.parseEase("power2.inOut")(Math.min(1, p * 1.25));
    const px = t0x + P.x * s0 + (W / 2 - (t0x + P.x * s0)) * k;
    const py = t0y + P.y * s0 + (H / 2 - (t0y + P.y * s0)) * k;
    grupo.setAttribute("transform", `translate(${px - P.x * s} ${py - P.y * s}) scale(${s})`);
  };

  gsap.set(palabras, { opacity: 0, yPercent: 40 });
  pintar();

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: seccion,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.6,
    },
  });
  tl.to(estado, { p: 1, duration: 1, ease: "power1.in", onUpdate: pintar }, 0)
    .to(indicacion, { opacity: 0, duration: 0.15 }, 0)
    .to(palabras, { opacity: 1, yPercent: 0, stagger: 0.06, duration: 0.25, ease: "power2.out" }, 0.62)
    .to(velo, { opacity: 0, duration: 0.08 }, 0.92);

  addEventListener("resize", pintar);
}

/* ==========================================================================
   Textos
   ========================================================================== */

function titulosDivididos() {
  $$("[data-dividir]").forEach((el) => {
    SplitText.create(el, {
      type: "lines",
      mask: "lines",
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.lines, {
          yPercent: 105,
          duration: 1.3,
          stagger: 0.1,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        }),
    });
  });
}

function palabrasManifiesto() {
  $$("[data-palabras]").forEach((el) => {
    SplitText.create(el, {
      type: "words",
      wordsClass: "palabra",
      autoSplit: true,
      onSplit: (self) =>
        gsap.to(self.words, {
          color: "#353B3D",
          stagger: 0.1,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top 78%", end: "bottom 42%", scrub: true },
        }),
    });
  });
}

function revelados() {
  ScrollTrigger.batch("[data-revelar]", {
    start: "top 88%",
    once: true,
    onEnter: (lote) => gsap.to(lote, { opacity: 1, y: 0, duration: 1.1, stagger: 0.08, ease: "expo.out" }),
  });
  gsap.set("[data-revelar]", { y: 30 });
}

/* ==========================================================================
   Secciones
   ========================================================================== */

function marquesina() {
  const pista = $("[data-marquesina]");
  if (!pista) return;
  const bucle = gsap.to(pista, { xPercent: -50, duration: 38, ease: "none", repeat: -1 });
  let direccion = 1;
  ScrollTrigger.create({
    trigger: pista,
    start: "top bottom",
    end: "bottom top",
    onUpdate: (self) => {
      direccion = self.direction;
      const v = Math.min(Math.abs(self.getVelocity()) / 300, 6);
      gsap.to(bucle, { timeScale: direccion * (1 + v), duration: 0.2, overwrite: true });
      gsap.to(bucle, { timeScale: direccion, duration: 1.2, delay: 0.2, overwrite: false });
    },
  });
}

function lineas() {
  const paneles = $$("[data-panel]");
  if (!paneles.length) return;
  // En pantallas angostas los paneles van uno debajo del otro: cada uno se revela solo
  const apilados = matchMedia("(max-width: 900px)").matches;
  const cerrado = ["polygon(0% 0%, 0% 0%, -50% 100%, -50% 100%)", "polygon(150% 0%, 150% 0%, 100% 100%, 100% 100%)"];
  paneles.forEach((panel, i) => {
    gsap.fromTo(
      panel,
      { clipPath: cerrado[i] },
      {
        clipPath: "polygon(0% 0%, 150% 0%, 100% 100%, -50% 100%)",
        ease: "expo.out",
        duration: 1.6,
        delay: apilados ? 0 : i * 0.12,
        clearProps: "clipPath",
        scrollTrigger: { trigger: apilados ? panel : "[data-lineas]", start: "top 75%" },
      },
    );
    gsap.from(panel.querySelector(".panel-cuerpo"), {
      y: 60,
      opacity: 0,
      duration: 1.3,
      delay: apilados ? 0.3 : 0.35 + i * 0.12,
      ease: "expo.out",
      scrollTrigger: { trigger: apilados ? panel : "[data-lineas]", start: "top 75%" },
    });
  });
}

function vistaServicios() {
  const lista = $("[data-servicios]");
  const vista = $("[data-vista]");
  const interior = $("[data-vista-interior]");
  if (!lista || !vista || !interior || !punteroFino) return;

  const x = gsap.quickTo(vista, "x", { duration: 0.6, ease: "power3.out" });
  const y = gsap.quickTo(vista, "y", { duration: 0.6, ease: "power3.out" });
  const ancho = 260;

  lista.addEventListener("pointerenter", () =>
    gsap.to(vista, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "expo.out" }),
  );
  lista.addEventListener("pointerleave", () =>
    gsap.to(vista, { autoAlpha: 0, scale: 0.6, duration: 0.4, ease: "power3.in" }),
  );
  lista.addEventListener("pointermove", (e) => {
    x(e.clientX + 40);
    y(e.clientY - ancho * 0.6);
    const fila = (e.target as HTMLElement).closest<HTMLElement>("[data-linea]");
    if (fila && interior.dataset.linea !== fila.dataset.linea) {
      interior.dataset.linea = fila.dataset.linea;
      gsap.fromTo(
        interior.querySelector("svg"),
        { x: -DIAG.x * 30, y: -DIAG.y * 30, opacity: 0 },
        { x: 0, y: 0, opacity: 1, duration: 0.6, ease: "expo.out" },
      );
    }
  });
}

function proceso() {
  const seccion = $("[data-proceso]");
  const pista = $("[data-proceso-pista]");
  const barra = $("[data-proceso-barra]");
  if (!seccion || !pista) return;

  const mm = gsap.matchMedia();
  mm.add("(min-width: 821px)", () => {
    const distancia = () => Math.max(0, pista.scrollWidth - innerWidth);
    gsap.to(pista, {
      x: () => -distancia(),
      ease: "none",
      scrollTrigger: {
        trigger: seccion,
        start: "top top",
        end: () => `+=${distancia() * 1.4}`,
        pin: true,
        scrub: 0.8,
        invalidateOnRefresh: true,
        onUpdate: (self) => barra && gsap.set(barra, { scaleX: self.progress }),
      },
    });
    gsap.from(".paso:not(.paso--intro) .paso-num", {
      yPercent: 40,
      opacity: 0,
      stagger: 0.1,
      duration: 1.2,
      ease: "expo.out",
      scrollTrigger: { trigger: seccion, start: "top 60%" },
    });
  });
  mm.add("(max-width: 820px)", () => {
    seccion.classList.add("nativo");
    return () => seccion.classList.remove("nativo");
  });
}

function trabajo() {
  $$("[data-tarjeta]").forEach((tarjeta) => {
    const media = tarjeta.querySelector(".tarjeta-media");
    const imagen = tarjeta.querySelector("[data-parallax]");
    gsap.fromTo(
      media,
      { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" },
      {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 1.5,
        ease: "expo.out",
        scrollTrigger: { trigger: tarjeta, start: "top 85%" },
      },
    );
    gsap.from(tarjeta.querySelector(".tarjeta-info"), {
      y: 24,
      opacity: 0,
      duration: 1,
      delay: 0.3,
      ease: "expo.out",
      scrollTrigger: { trigger: tarjeta, start: "top 85%" },
    });
    if (imagen) {
      gsap.fromTo(
        imagen,
        { yPercent: -7 },
        { yPercent: 7, ease: "none", scrollTrigger: { trigger: tarjeta, start: "top bottom", end: "bottom top", scrub: true } },
      );
    }
  });
}

function pie() {
  const logo = $("[data-pie-logo] .logo");
  if (!logo) return;
  gsap.from(logo, {
    yPercent: 70,
    ease: "none",
    scrollTrigger: { trigger: "[data-pie-logo]", start: "top bottom", end: "bottom bottom", scrub: true },
  });
}

/* ==========================================================================
   Cabecera, cursor y botones magnéticos
   ========================================================================== */

function cabecera() {
  const cab = $("[data-cabecera]");
  if (!cab) return;

  ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate: (self) => {
      const y = self.scroll();
      cab.classList.toggle("compacta", y > 60);
      const menuAbierto = $("[data-menu-boton]")?.getAttribute("aria-expanded") === "true";
      cab.classList.toggle("oculta", !menuAbierto && self.direction === 1 && y > innerHeight * 0.6);
    },
  });

  $$("[data-tema]").forEach((sec) => {
    if (sec === cab) return;
    ScrollTrigger.create({
      trigger: sec,
      start: "top 40px",
      end: "bottom 40px",
      onToggle: (self) => {
        if (self.isActive) cab.dataset.tema = sec.dataset.tema;
      },
    });
  });
}

function cursor() {
  if (!punteroFino) return;
  const punto = $("[data-cursor-punto]");
  const aro = $("[data-cursor-aro]");
  const texto = $("[data-cursor-texto]");
  if (!punto || !aro || !texto) return;

  const px = gsap.quickTo(punto, "x", { duration: 0.12, ease: "power3.out" });
  const py = gsap.quickTo(punto, "y", { duration: 0.12, ease: "power3.out" });
  const ax = gsap.quickTo(aro, "x", { duration: 0.55, ease: "power3.out" });
  const ay = gsap.quickTo(aro, "y", { duration: 0.55, ease: "power3.out" });

  addEventListener("pointermove", (e) => {
    px(e.clientX);
    py(e.clientY);
    ax(e.clientX);
    ay(e.clientY);
  });

  document.addEventListener("pointerover", (e) => {
    const t = e.target as HTMLElement;
    const conEtiqueta = t.closest<HTMLElement>("[data-cursor]");
    const interactivo = t.closest("a, button");
    raiz.classList.toggle("cursor-etiqueta", !!conEtiqueta);
    raiz.classList.toggle("cursor-activo", !conEtiqueta && !!interactivo);
    if (conEtiqueta) texto.textContent = conEtiqueta.dataset.cursor ?? "";
  });
  document.addEventListener("pointerleave", () => gsap.to([punto, aro], { opacity: 0, duration: 0.3 }));
  document.addEventListener("pointerenter", () => gsap.to([punto, aro], { opacity: 1, duration: 0.3 }));
}

function magneticos() {
  if (!punteroFino) return;
  $$("[data-magnetico]").forEach((el) => {
    const x = gsap.quickTo(el, "x", { duration: 0.8, ease: "elastic.out(1, 0.4)" });
    const y = gsap.quickTo(el, "y", { duration: 0.8, ease: "elastic.out(1, 0.4)" });
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      x((e.clientX - (r.left + r.width / 2)) * 0.28);
      y((e.clientY - (r.top + r.height / 2)) * 0.38);
    });
    el.addEventListener("pointerleave", () => {
      x(0);
      y(0);
    });
  });
}

/* ==========================================================================
   Arranque
   ========================================================================== */

async function iniciar() {
  iniciarReloj();
  iniciarMenu();
  iniciarFiltros();

  if (!conMovimiento) {
    iniciarAnclas();
    raiz.classList.add("listo");
    return;
  }

  raiz.classList.add("listo");
  iniciarLenis();
  iniciarAnclas();

  await document.fonts.ready;

  cabecera();
  cursor();
  magneticos();
  zoomIsotipo();
  titulosDivididos();
  palabrasManifiesto();
  revelados();
  marquesina();
  lineas();
  vistaServicios();
  proceso();
  trabajo();
  pie();

  const hayIntro = !raiz.classList.contains("sin-intro");
  if (hayIntro) {
    // El hero arranca mientras la cortina sale
    gsap.delayedCall(2.35, () => hero(true));
    await intro();
  } else {
    hero(false);
  }

  ScrollTrigger.refresh();
}

iniciar();
