"use client";

import { useEffect, useRef } from "react";

declare const gsap: any;
declare const THREE: any;

/* ────────────────────────────────────────────────────────────
   ROFOF — EDITORIAL HERO v2
   Concept: a luxury Saudi bazaar rendered as a moving magazine.
   - Liquid mercury split-reveal between slides (custom GLSL)
   - Arabic glyphs that explode into strokes on transition
   - Vertical "spine" of categories like a magazine binding
   - Flip-counter for slide index, trilingual marquee at the foot
   ──────────────────────────────────────────────────────────── */

const SLIDES = [
  { ar: "أزياء",      en: "Couture",     fr: "Couture",     sub: "أرقى التصاميم",        img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1800&q=92" },
  { ar: "عطور",       en: "Perfumery",   fr: "Parfumerie",  sub: "روائح استثنائية",      img: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1800&q=92" },
  { ar: "إلكترونيات", en: "Electronics", fr: "Électronique", sub: "أحدث التقنيات",       img: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1800&q=92" },
  { ar: "ديكور",      en: "Interiors",   fr: "Intérieurs",  sub: "فن الإقامة",           img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1800&q=92" },
  { ar: "رياضة",      en: "Athletics",   fr: "Athlétique",  sub: "أدوات الأبطال",        img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1800&q=92" },
  { ar: "مجوهرات",    en: "Jewelry",     fr: "Joaillerie",  sub: "تألق لا محدود",        img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1800&q=92" },
];

/* ─── SHADERS ───────────────────────────────────────────── */

const VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/*  Liquid mercury split: a vertical seam opens from the centre,
    its edge perturbed by fbm noise. Chromatic dispersion runs
    along the seam, paper-grain settles into the new image.       */
const FRAG = `
  precision highp float;
  uniform sampler2D uT1;
  uniform sampler2D uT2;
  uniform float uProgress;
  uniform float uTime;
  uniform vec2  uRes;
  uniform vec2  uS1;
  uniform vec2  uS2;
  varying vec2 vUv;

  // ── cover-fit UV ──
  vec2 cover(vec2 uv, vec2 ts) {
    vec2 s = uRes / ts;
    float k = max(s.x, s.y);
    vec2 sz = ts * k;
    vec2 off = (uRes - sz) * 0.5;
    return (uv * uRes - off) / sz;
  }

  // ── classic 2D noise + fbm ──
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
    return v;
  }

  // ── grain ──
  float grain(vec2 uv) {
    return (hash(uv * 1500.0 + uTime * 0.001) - 0.5) * 0.06;
  }

  void main() {
    vec2 uv1 = cover(vUv, uS1);
    vec2 uv2 = cover(vUv, uS2);

    // ─── seam geometry ───
    // seam runs vertically from x = 0.5; opens with progress
    float p   = smoothstep(0.0, 1.0, uProgress);
    float ease = p * p * (3.0 - 2.0 * p);

    // wobble the seam with fbm so it reads as liquid, not a wipe
    float wob = (fbm(vec2(vUv.y * 4.5, uTime * 0.4)) - 0.5) * 0.08;
    float seamX = 0.5 + wob;

    // distance from seam, scaled so opening width = ease
    float dist = abs(vUv.x - seamX);
    float openHalf = ease * 0.55;                      // half-width of opening
    float edge = smoothstep(openHalf + 0.005, openHalf - 0.005, dist);

    // ─── new image with displacement near the seam ───
    float prox = 1.0 - smoothstep(0.0, 0.18, dist - openHalf);  // 1 near seam, 0 far
    prox = clamp(prox, 0.0, 1.0);

    // mercury pull: drag UVs toward the seam as it opens
    vec2 pull = vec2(sign(vUv.x - seamX) * prox * 0.04 * (1.0 - ease), 0.0);
    vec2 nUv  = uv2 + pull;

    // chromatic aberration along the seam edge
    float ca = prox * 0.012;
    vec3 newCol;
    newCol.r = texture2D(uT2, nUv + vec2( ca, 0.0)).r;
    newCol.g = texture2D(uT2, nUv).g;
    newCol.b = texture2D(uT2, nUv - vec2( ca, 0.0)).b;

    // ─── old image with a faint shear as it parts ───
    vec2 oUv = uv1 + vec2(sign(vUv.x - seamX) * ease * 0.06, 0.0);
    vec3 oldCol = texture2D(uT1, oUv).rgb;

    // ─── seam highlight (the silver line of mercury) ───
    float silver = smoothstep(0.012, 0.0, abs(dist - openHalf)) * (1.0 - ease);
    vec3 silverTint = vec3(1.0, 0.96, 0.88);  // warm-white catch-light

    // ─── compose ───
    vec3 col = mix(oldCol, newCol, edge);
    col += silver * silverTint * 0.35;

    // tiny global grain — keeps it editorial, not plasticky
    col += grain(vUv);

    // a whisper of vignette, very soft
    float vig = smoothstep(1.2, 0.4, length(vUv - 0.5));
    col *= mix(0.92, 1.0, vig);

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /* ── script loader ── */
    const loadScript = (src: string, g: string): Promise<void> =>
      new Promise((res, rej) => {
        if ((window as any)[g]) return res();
        const ex = document.querySelector(`script[src="${src}"]`);
        if (ex) {
          const t = setInterval(() => { if ((window as any)[g]) { clearInterval(t); res(); } }, 50);
          setTimeout(() => { clearInterval(t); rej(); }, 10000);
          return;
        }
        const s = document.createElement("script");
        s.src = src; s.onload = () => setTimeout(res, 80); s.onerror = rej;
        document.head.appendChild(s);
      });

    let cleanup: (() => void) | undefined;

    const init = async () => {
      try {
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js", "gsap");
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js", "THREE");
      } catch { return; }

      const root = containerRef.current;
      if (!root) return;
      const canvas = root.querySelector(".rf-canvas") as HTMLCanvasElement;
      if (!canvas) return;

      /* ── three.js setup ── */
      const scene  = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const material = new THREE.ShaderMaterial({
        uniforms: {
          uT1:       { value: null },
          uT2:       { value: null },
          uProgress: { value: 0 },
          uTime:     { value: 0 },
          uRes:      { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
          uS1:       { value: new THREE.Vector2(1, 1) },
          uS2:       { value: new THREE.Vector2(1, 1) },
        },
        vertexShader: VERT, fragmentShader: FRAG,
      });
      scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

      /* ── load textures ── */
      const loader = new THREE.TextureLoader();
      loader.crossOrigin = "anonymous";
      const loadTex = (src: string): Promise<any> =>
        new Promise((res, rej) =>
          loader.load(src, (t: any) => {
            t.minFilter = t.magFilter = THREE.LinearFilter;
            t.userData = { size: new THREE.Vector2(t.image.width, t.image.height) };
            res(t);
          }, undefined, rej)
        );

      // REPLACE WITH:
const results = await Promise.allSettled(SLIDES.map(s => loadTex(s.img)));
const textures: any[] = results.map(r => r.status === "fulfilled" ? r.value : null);
if (textures.filter(Boolean).length < 2) return;

      const firstIdx = textures.findIndex(t => t !== null);
const secondIdx = textures.findIndex((t, i) => t !== null && i !== firstIdx);
if (firstIdx === -1 || secondIdx === -1) return;

material.uniforms.uT1.value = textures[firstIdx];
material.uniforms.uT2.value = textures[secondIdx];
material.uniforms.uS1.value = textures[firstIdx].userData.size;
material.uniforms.uS2.value = textures[secondIdx].userData.size;

      gsap.to(root, { opacity: 1, duration: 0.9, ease: "power2.out" });

      /* ── render loop ── */
      const start = performance.now();
      let raf = 0;
      const render = () => {
        material.uniforms.uTime.value = (performance.now() - start) * 0.001;
        renderer.render(scene, camera);
        raf = requestAnimationFrame(render);
      };
      render();

      /* ── state ── */
      let current = 0;
      let transitioning = false;
      let progressTimer: any = null;
      let autoTimer: any = null;
      const AUTO = 5400;
      const DUR  = 2.0;
      const TICK = 50;

      /* ── DOM refs ── */
      const titleEl = root.querySelector("#rf-title")    as HTMLElement;
      const subEl   = root.querySelector("#rf-sub")      as HTMLElement;
      const enEl    = root.querySelector("#rf-en")       as HTMLElement;
      const frEl    = root.querySelector("#rf-fr")       as HTMLElement;
      const numTopEl= root.querySelector("#rf-num-top")  as HTMLElement;
      const numBotEl= root.querySelector("#rf-num-bot")  as HTMLElement;
      const marqueeEl=root.querySelector("#rf-marquee")  as HTMLElement;
      const spineList=root.querySelector("#rf-spine")    as HTMLElement;
      const dotList = root.querySelector("#rf-dots")     as HTMLElement;

      /* ── glyph splitter (RTL-safe, preserves order) ── */
      const splitGlyphs = (text: string) =>
  text.split(" ").map(word =>
    `<span class="rf-g" style="display:inline-block;opacity:0;transform:translateY(60px) rotateX(-40deg)">${word}</span>`
  ).join(" ");

      /* ── flip counter ── */
      const setNum = (n: number) => {
  const txt = String(n + 1).padStart(2, "0");
  if (!numTopEl || !numBotEl) return;

  // Animate top out
  gsap.fromTo(numTopEl,
    { y: 0, opacity: 1 },
    { y: -28, opacity: 0, duration: 0.32, ease: "power3.in" }
  );

  // Animate bottom up and in
  gsap.fromTo(numBotEl,
    { y: 28, opacity: 0 },
    {
      y: 0, opacity: 1, duration: 0.32, ease: "power3.out", delay: 0.1,
      onComplete: () => {
        // Snap top to new value, reset bottom back to hidden below
        numTopEl.textContent = txt;
        numBotEl.textContent = txt;
        gsap.set(numTopEl, { y: 0, opacity: 1 });
        gsap.set(numBotEl, { y: 28, opacity: 0 });
      }
    }
  );
};

      /* ── animate text in ── */
      const animateText = (idx: number) => {
        if (!titleEl || !subEl) return;
        const slide = SLIDES[idx];

        // out
        gsap.to(titleEl.children, {
          y: -50, opacity: 0, rotateX: 35,
          duration: 0.5, stagger: { each: 0.025, from: "end" }, ease: "power3.in",
        });
        gsap.to([subEl, enEl, frEl], { y: -14, opacity: 0, duration: 0.4, ease: "power2.in" });

        setTimeout(() => {
          titleEl.innerHTML = splitGlyphs(slide.ar);
          subEl.textContent = slide.sub;
          if (enEl) enEl.textContent = slide.en;
          if (frEl) frEl.textContent = slide.fr;

          gsap.set([subEl, enEl, frEl], { y: 18, opacity: 0 });

          // dramatic stagger reveal
          gsap.to(titleEl.children, {
            y: 0, opacity: 1, rotateX: 0,
            duration: 1.05,
            stagger: { each: 0.05, from: "start" },
            ease: "expo.out",
          });
          gsap.to(enEl, { y: 0, opacity: 0.55, duration: 0.7, delay: 0.2, ease: "power3.out" });
          gsap.to(subEl, { y: 0, opacity: 0.55, duration: 0.7, delay: 0.3, ease: "power3.out" });
          gsap.to(frEl, { y: 0, opacity: 0.4, duration: 0.7, delay: 0.4, ease: "power3.out" });
        }, 510);
      };

      /* ── spine + dots state ── */
      const updateActive = (idx: number) => {
        spineList?.querySelectorAll(".rf-spine-item").forEach((el, i) => {
          el.classList.toggle("active", i === idx);
        });
        dotList?.querySelectorAll(".rf-dot").forEach((el, i) => {
          el.classList.toggle("active", i === idx);
        });
      };

      /* ── progress fill ── */
      const progressFill = (idx: number, pct: number) => {
        const fill = root.querySelectorAll(".rf-dot-fill")[idx] as HTMLElement;
        if (fill) fill.style.width = `${pct}%`;
      };
      const resetFill = (idx: number) => {
        const fill = root.querySelectorAll(".rf-dot-fill")[idx] as HTMLElement;
        if (fill) fill.style.width = "0%";
      };

      /* ── timers ── */
      const stopTimers = () => {
        clearInterval(progressTimer); clearTimeout(autoTimer);
        progressTimer = null; autoTimer = null;
      };
      const startTimers = (delay = 0) => {
        stopTimers();
        const go = () => {
          let pct = 0;
          const inc = (100 / AUTO) * TICK;
          progressTimer = setInterval(() => {
            pct += inc;
            progressFill(current, pct);
            if (pct >= 100) { clearInterval(progressTimer); if (!transitioning) next(); }
          }, TICK);
        };
        delay > 0 ? (autoTimer = setTimeout(go, delay)) : go();
      };

      /* ── transition ── */
      // REPLACE WITH:
const goTo = (target: number) => {
  if (transitioning || target === current) return;
  if (!textures[target] || !textures[current]) return;
  stopTimers(); resetFill(current);

  const t1 = textures[current], t2 = textures[target];
  if (!t1 || !t2) return;

        transitioning = true;
        material.uniforms.uT1.value = t1;
        material.uniforms.uT2.value = t2;
        material.uniforms.uS1.value = t1.userData.size;
        material.uniforms.uS2.value = t2.userData.size;

        animateText(target);
        setNum(target);
        // marquee scroll
        if (marqueeEl) {
          gsap.fromTo(marqueeEl, { x: "30%", opacity: 0 }, { x: "0%", opacity: 1, duration: 1.1, ease: "expo.out", delay: 0.2 });
        }

        current = target;
        updateActive(current);

        gsap.fromTo(material.uniforms.uProgress,
          { value: 0 },
          {
            value: 1, duration: DUR, ease: "power2.inOut",
            onComplete: () => {
              material.uniforms.uProgress.value = 0;
              material.uniforms.uT1.value = textures[target];
              material.uniforms.uS1.value = textures[target].userData.size;
              transitioning = false;
              startTimers(150);
            },
          }
        );
      };
      const next = () => goTo((current + 1) % SLIDES.length);

      /* ── build spine ── */
      if (spineList) {
        SLIDES.forEach((s, i) => {
          const item = document.createElement("button");
          item.className = `rf-spine-item${i === 0 ? " active" : ""}`;
          item.innerHTML = `
            <span class="rf-spine-num">${String(i + 1).padStart(2, "0")}</span>
            <span class="rf-spine-label">${s.ar}</span>
            <span class="rf-spine-en">${s.en}</span>
          `;
          item.addEventListener("click", () => { if (!transitioning && i !== current) goTo(i); });
          spineList.appendChild(item);
        });
      }

      /* ── build dots ── */
      if (dotList) {
        SLIDES.forEach((_, i) => {
          const d = document.createElement("button");
          d.className = `rf-dot${i === 0 ? " active" : ""}`;
          d.innerHTML = `<span class="rf-dot-track"><span class="rf-dot-fill"></span></span>`;
          d.addEventListener("click", () => { if (!transitioning && i !== current) goTo(i); });
          dotList.appendChild(d);
        });
      }

      /* ── initial mount ── */
      if (titleEl && subEl) {
        titleEl.innerHTML = splitGlyphs(SLIDES[0].ar);
        subEl.textContent = SLIDES[0].sub;
        if (enEl) enEl.textContent = SLIDES[0].en;
        if (frEl) frEl.textContent = SLIDES[0].fr;

        gsap.fromTo(titleEl.children,
          { y: 60, opacity: 0, rotateX: -40 },
          { y: 0, opacity: 1, rotateX: 0, duration: 1.2, stagger: 0.06, ease: "expo.out", delay: 0.7 }
        );
        gsap.fromTo(enEl, { y: 18, opacity: 0 }, { y: 0, opacity: 0.55, duration: 0.8, delay: 0.9, ease: "power3.out" });
        gsap.fromTo(subEl,{ y: 18, opacity: 0 }, { y: 0, opacity: 0.55, duration: 0.8, delay: 1.05, ease: "power3.out" });
        gsap.fromTo(frEl, { y: 18, opacity: 0 }, { y: 0, opacity: 0.4, duration: 0.8, delay: 1.2, ease: "power3.out" });
      }

      // chrome reveal
      gsap.fromTo(".rf-spine-item",     { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, stagger: 0.06, ease: "power3.out", delay: 0.4 });
      gsap.fromTo(".rf-nav-row > *",    { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: "power3.out", delay: 0.2 });
      gsap.fromTo(".rf-foot > *",       { y: 20, opacity: 0 },  { y: 0, opacity: 1, duration: 0.9, stagger: 0.08, ease: "power3.out", delay: 0.5 });

      startTimers(900);

      /* ── resize ── */
      const onResize = () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        material.uniforms.uRes.value.set(window.innerWidth, window.innerHeight);
      };
      window.addEventListener("resize", onResize);

      cleanup = () => {
        stopTimers();
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", onResize);
        renderer.dispose();
      };
    };

    init();
    return () => { cleanup?.(); };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Reem+Kufi+Fun:wght@400;500;700&family=Noto+Naskh+Arabic:wght@400;700&family=Cormorant+Garamond:ital,wght@0,300;0,500;1,300&family=DM+Mono:wght@300;400;500&display=swap');

        :root {
          --rf-ink:    #0E2A3A;   /* deep teal-ink */
          --rf-ink-2:  #1a3a4d;
          --rf-paper:  #F5EFE4;   /* warm cream */
          --rf-gold:   #C8924A;   /* aged brass */
          --rf-gold-2: #E8B872;
          --rf-rust:   #A84B2A;
          --rf-mist:   rgba(14, 42, 58, 0.08);
        }

        .rf-hero {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          background: var(--rf-paper);
          opacity: 0;
          direction: rtl;
          color: var(--rf-ink);
          isolation: isolate;
        }

        .rf-canvas { position: absolute; inset: 0; z-index: 0; }

        /* ─── paper/wash overlay ─── */
        .rf-wash {
          position: absolute; inset: 0; z-index: 1;
          background:
  radial-gradient(ellipse at 30% 40%, rgba(238,243,255,0.45) 0%, rgba(238,243,255,0.65) 60%, rgba(238,243,255,0.78) 100%),
  linear-gradient(180deg, rgba(238,243,255,0.30) 0%, rgba(238,243,255,0.55) 100%);
          pointer-events: none;
        }
        .rf-grain {
          position: absolute; inset: 0; z-index: 2; pointer-events: none;
          opacity: 0.35;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.18 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
          mix-blend-mode: multiply;
        }

        /* ─── border frame: editorial mat ─── */
        .rf-frame {
          position: absolute; inset: 28px; z-index: 3; pointer-events: none;
          border: 0.5px solid rgba(14, 42, 58, 0.18);
        }
        .rf-frame::before, .rf-frame::after {
          content: ""; position: absolute; background: var(--rf-gold);
        }
        .rf-frame::before { /* top-right corner accent */
          top: -1px; right: -1px; width: 56px; height: 2px;
        }
        .rf-frame::after {
          bottom: -1px; left: -1px; width: 56px; height: 2px;
        }

        /* ─── TOP NAV ─── */
        .rf-nav-row {
          position: absolute; top: 0; left: 0; right: 0; z-index: 10;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          padding: 44px 72px 0;
          gap: 32px;
        }

        .rf-logo {
          font-family: 'Reem Kufi Fun', serif;
          font-size: 28px; font-weight: 700;
          color: var(--rf-ink);
          letter-spacing: 0.02em;
          display: flex; align-items: baseline; gap: 6px;
        }
        .rf-logo-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--rf-gold);
          display: inline-block;
          box-shadow: 0 0 0 3px rgba(200, 146, 74, 0.18);
        }

        .rf-nav-links {
          display: flex; gap: 44px; list-style: none; margin: 0; padding: 0;
          justify-content: center;
        }
        .rf-nav-links a {
          font-family: 'Reem Kufi Fun', sans-serif;
          font-size: 13px; font-weight: 400;
          color: var(--rf-ink);
          opacity: 0.55;
          text-decoration: none;
          letter-spacing: 0.04em;
          position: relative;
          padding: 6px 0;
          transition: opacity 0.3s;
        }
        .rf-nav-links a::after {
          content: ""; position: absolute; left: 0; right: 0; bottom: 0;
          height: 1px; background: var(--rf-gold);
          transform: scaleX(0); transform-origin: right;
          transition: transform 0.4s ease;
        }
        .rf-nav-links a:hover { opacity: 1; }
        .rf-nav-links a:hover::after { transform: scaleX(1); transform-origin: left; }

        .rf-nav-right {
          display: flex; align-items: center; justify-content: flex-end; gap: 22px;
        }
        .rf-locale {
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.25em;
          color: var(--rf-ink); opacity: 0.45;
          text-transform: uppercase;
        }
        .rf-locale b { color: var(--rf-gold); opacity: 1; font-weight: 500; }

        .rf-login {
          font-family: 'Reem Kufi Fun', sans-serif;
          font-size: 12px; font-weight: 400;
          color: var(--rf-ink);
          background: transparent;
          border: 0.5px solid rgba(14,42,58,0.35);
          padding: 9px 22px;
          cursor: pointer;
          letter-spacing: 0.05em;
          transition: all 0.3s ease;
        }
        .rf-login:hover {
          background: var(--rf-ink); color: var(--rf-paper);
          border-color: var(--rf-ink);
        }

        /* ─── SPINE (vertical category index, magazine-binding feel) ─── */
        .rf-spine {
          position: absolute;
          top: 50%; right: 56px;
          transform: translateY(-50%);
          z-index: 9;
          display: flex; flex-direction: column; gap: 2px;
          padding-right: 22px;
          border-right: 0.5px solid rgba(14,42,58,0.15);
        }
        .rf-spine-item {
          background: none; border: none;
          display: grid;
          grid-template-columns: auto auto auto;
          align-items: baseline;
          gap: 14px;
          padding: 11px 0 11px 8px;
          cursor: pointer;
          text-align: right;
          opacity: 0.45;
          transition: opacity 0.4s ease, transform 0.4s ease;
          position: relative;
        }
        .rf-spine-item::before {
          content: ""; position: absolute;
          right: -23px; top: 50%; transform: translateY(-50%);
          width: 5px; height: 5px;
          background: var(--rf-gold);
          border-radius: 50%;
          opacity: 0;
          transition: opacity 0.4s, transform 0.4s;
        }
        .rf-spine-item.active {
          opacity: 1;
          transform: translateX(-6px);
        }
        .rf-spine-item.active::before {
          opacity: 1;
          box-shadow: 0 0 0 4px rgba(200,146,74,0.18);
        }
        .rf-spine-item:hover { opacity: 0.85; }

        .rf-spine-num {
          font-family: 'DM Mono', monospace;
          font-size: 10px; font-weight: 400;
          color: var(--rf-ink); opacity: 0.4;
          letter-spacing: 0.1em;
        }
        .rf-spine-label {
          font-family: 'Reem Kufi Fun', serif;
          font-size: 16px; font-weight: 500;
          color: var(--rf-ink);
        }
        .rf-spine-en {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 13px;
          color: var(--rf-ink); opacity: 0.5;
          letter-spacing: 0.02em;
        }

        /* ─── CENTER STAGE ─── */
        .rf-stage {
          position: absolute; inset: 0;
          z-index: 5;
          display: grid;
          place-items: center;
          padding: 0 200px;
          pointer-events: none;
        }

        .rf-stage-inner {
          display: grid; gap: 14px; place-items: center;
          text-align: center;
          margin-top: -20px;
        }

        .rf-eyebrow {
          display: flex; align-items: center; gap: 14px;
          margin-bottom: 8px;
        }
        .rf-eyebrow-line {
          width: 42px; height: 0.5px;
          background: var(--rf-gold);
        }
        .rf-eyebrow-text {
          font-family: 'DM Mono', monospace;
          font-size: 10px; font-weight: 400;
          color: var(--rf-gold);
          letter-spacing: 0.32em;
          text-transform: uppercase;
        }

        .rf-en-label {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 22px;
          color: var(--rf-ink); opacity: 0;
          letter-spacing: 0.04em;
          font-weight: 300;
          margin-bottom: -12px;
        }

        .rf-title {
          font-family: 'Reem Kufi Fun', 'Noto Naskh Arabic', serif;
          font-size: clamp(96px, 17vw, 240px);
          font-weight: 700;
          color: var(--rf-ink);
          line-height: 0.88;
          letter-spacing: -0.015em;
          perspective: 1000px;
          margin: 0;
          position: relative;
        }
        .rf-title::before, .rf-title::after {
          content: "";
          position: absolute;
          top: 50%; transform: translateY(-50%);
          width: 80px; height: 0.5px;
          background: var(--rf-gold);
          opacity: 0.5;
        }
        .rf-title::before { right: calc(100% + 36px); }
        .rf-title::after  { left:  calc(100% + 36px); }

        .rf-sub {
          font-family: 'Reem Kufi Fun', serif;
          font-size: 15px;
          font-weight: 400;
          color: var(--rf-ink);
          opacity: 0;
          letter-spacing: 0.18em;
          margin-top: 10px;
        }

        .rf-fr-label {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 13px;
          color: var(--rf-ink); opacity: 0;
          letter-spacing: 0.06em;
          margin-top: 4px;
        }

        .rf-cta-row {
          display: flex; align-items: center; gap: 18px;
          margin-top: 36px;
          pointer-events: all;
        }
        .rf-cta {
          font-family: 'Reem Kufi Fun', sans-serif;
          font-size: 12px; font-weight: 500;
          color: var(--rf-paper);
          background: var(--rf-ink);
          border: none;
          padding: 16px 38px;
          cursor: pointer;
          letter-spacing: 0.18em;
          position: relative;
          overflow: hidden;
          transition: color 0.4s ease;
        }
        .rf-cta span { position: relative; z-index: 2; }
        .rf-cta::before {
          content: ""; position: absolute; inset: 0;
          background: var(--rf-gold);
          transform: translateY(101%);
          transition: transform 0.45s cubic-bezier(.7,0,.3,1);
          z-index: 1;
        }
        .rf-cta:hover { color: var(--rf-ink); }
        .rf-cta:hover::before { transform: translateY(0); }

        .rf-cta-arrow {
          width: 38px; height: 38px;
          border-radius: 50%;
          border: 0.5px solid rgba(14,42,58,0.4);
          background: transparent;
          cursor: pointer;
          display: grid; place-items: center;
          color: var(--rf-ink);
          font-size: 14px;
          transition: all 0.3s;
        }
        .rf-cta-arrow:hover {
          background: var(--rf-ink); color: var(--rf-paper);
          border-color: var(--rf-ink);
          transform: rotate(-45deg);
        }

        /* ─── FLIP COUNTER (left side) ─── */
        .rf-counter {
          position: absolute;
          top: 50%; left: 64px;
          transform: translateY(-50%);
          z-index: 10;
          display: flex; flex-direction: column; align-items: center;
          gap: 16px;
        }
        .rf-counter-num {
          position: relative;
          width: 54px; height: 54px;
          overflow: hidden;
          font-family: 'Cormorant Garamond', serif;
          font-size: 44px; font-weight: 300;
          color: var(--rf-ink);
          line-height: 54px;
          text-align: center;
        }
        .rf-counter-num span {
          position: absolute; inset: 0;
          display: grid; place-items: center;
        }
        #rf-num-bot { opacity: 0; transform: translateY(28px); }
        .rf-counter-divider {
          width: 26px; height: 0.5px;
          background: var(--rf-gold);
          transform: rotate(-30deg);
        }
        .rf-counter-total {
          font-family: 'DM Mono', monospace;
          font-size: 12px; font-weight: 400;
          color: var(--rf-ink); opacity: 0.35;
          letter-spacing: 0.1em;
        }
        .rf-counter-label {
          font-family: 'DM Mono', monospace;
          font-size: 9px; letter-spacing: 0.32em;
          color: var(--rf-ink); opacity: 0.35;
          text-transform: uppercase;
          writing-mode: vertical-rl;
          margin-top: 14px;
        }

        /* ─── FOOTER (dots + marquee) ─── */
        .rf-foot {
          position: absolute;
          bottom: 48px; left: 0; right: 0;
          z-index: 10;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 36px;
          padding: 0 76px;
        }

        .rf-marquee-wrap {
          overflow: hidden;
          mask-image: linear-gradient(90deg, transparent 0%, #000 20%, #000 80%, transparent 100%);
          -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 20%, #000 80%, transparent 100%);
        }
        .rf-marquee {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 13px;
          color: var(--rf-ink); opacity: 0.5;
          letter-spacing: 0.18em;
          white-space: nowrap;
          display: flex; gap: 28px; justify-content: center;
        }
        .rf-marquee b { color: var(--rf-gold); font-weight: 500; font-style: normal; }
        .rf-marquee em { font-style: italic; }

        .rf-dots {
          display: flex; gap: 12px;
          justify-self: center;
        }
        .rf-dot {
          background: none; border: none; cursor: pointer;
          padding: 12px 0; width: 64px;
          opacity: 0.4;
          transition: opacity 0.3s;
        }
        .rf-dot.active { opacity: 1; }
        .rf-dot:hover { opacity: 0.85; }
        .rf-dot-track {
          display: block;
          width: 100%; height: 1px;
          background: rgba(14,42,58,0.18);
          overflow: hidden;
        }
        .rf-dot-fill {
          display: block;
          width: 0%; height: 100%;
          background: var(--rf-gold);
          transition: width 0.1s linear;
        }

        .rf-foot-meta {
          display: flex; align-items: center; justify-content: flex-end; gap: 14px;
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.22em;
          color: var(--rf-ink); opacity: 0.45;
          text-transform: uppercase;
        }
        .rf-foot-meta-line {
          width: 28px; height: 0.5px;
          background: rgba(14,42,58,0.3);
        }

        /* ─── responsive guards ─── */
        @media (max-width: 1100px) {
          .rf-stage { padding: 0 110px; }
          .rf-spine { right: 28px; padding-right: 14px; }
          .rf-spine-en { display: none; }
          .rf-counter { left: 32px; }
        }
        @media (max-width: 720px) {
          .rf-nav-row { padding: 28px 22px 0; grid-template-columns: 1fr 1fr; }
          .rf-nav-links { display: none; }
          .rf-spine { display: none; }
          .rf-counter { display: none; }
          .rf-stage { padding: 0 28px; }
          .rf-title::before, .rf-title::after { display: none; }
          .rf-foot { padding: 0 22px; bottom: 32px; grid-template-columns: 1fr; }
          .rf-foot-meta, .rf-marquee-wrap { display: none; }
          .rf-frame { inset: 14px; }
        }
      `}</style>

      <div ref={containerRef} className="rf-hero" dir="rtl">
        {/* WebGL */}
        <canvas className="rf-canvas" />
        <div className="rf-wash" />
        <div className="rf-grain" />
        <div className="rf-frame" />

        {/* TOP NAV */}
        <header className="rf-nav-row">
          <div className="rf-logo">
            رُفوف<span className="rf-logo-dot" />
          </div>
          <ul className="rf-nav-links">
            {["المتاجر", "التصنيفات", "العروض", "عن رُفوف"].map((item) => (
              <li key={item}><a href="#">{item}</a></li>
            ))}
          </ul>
          <div className="rf-nav-right">
            <span className="rf-locale">AR <b>·</b> EN <b>·</b> FR</span>
            <button className="rf-login">تسجيل الدخول</button>
          </div>
        </header>

        {/* SPINE */}
        <aside className="rf-spine" id="rf-spine" />

        {/* COUNTER */}
        <div className="rf-counter">
          <div className="rf-counter-num">
            <span id="rf-num-top">01</span>
            <span id="rf-num-bot">01</span>
          </div>
          <div className="rf-counter-divider" />
          <div className="rf-counter-total">{String(SLIDES.length).padStart(2, "0")}</div>
          <div className="rf-counter-label">collection</div>
        </div>

        {/* CENTER STAGE */}
        <div className="rf-stage">
          <div className="rf-stage-inner">
            <div className="rf-eyebrow">
              <span className="rf-eyebrow-line" />
              <span className="rf-eyebrow-text">Royal Bazaar · 2026</span>
              <span className="rf-eyebrow-line" />
            </div>

            <span className="rf-en-label" id="rf-en">Couture</span>
            <h1 className="rf-title" id="rf-title" />
            <span className="rf-fr-label" id="rf-fr">Couture</span>
            <p className="rf-sub" id="rf-sub" />

            <div className="rf-cta-row">
              <button className="rf-cta"><span>تسوق المجموعة</span></button>
              <button className="rf-cta-arrow" aria-label="next">→</button>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="rf-foot">
          <div className="rf-foot-meta">
            <span>est. Riyadh</span>
            <span className="rf-foot-meta-line" />
            <span>مملكة ٢٠٢٦</span>
          </div>

          <div className="rf-dots" id="rf-dots" />

          <div className="rf-marquee-wrap">
            <div className="rf-marquee" id="rf-marquee">
              <span><b>·</b> مجموعة الموسم <em>·</em> Curated for the Kingdom <em>·</em> Édition limitée</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}