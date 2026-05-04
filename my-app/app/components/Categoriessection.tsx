"use client";

import { useEffect, useRef } from "react";

declare const gsap: any;

const CATEGORIES = [
  {
    ar: "أزياء",
    en: "Couture",
    sub: "أرقى التصاميم",
    count: "240",
    img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1800&q=92",
  },
  {
    ar: "عطور",
    en: "Perfumery",
    sub: "روائح استثنائية",
    count: "98",
    img: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1800&q=92",
  },
  {
    ar: "مجوهرات",
    en: "Jewelry",
    sub: "تألق لا محدود",
    count: "64",
    img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1800&q=92",
  },
  {
    ar: "ديكور",
    en: "Interiors",
    sub: "فن الإقامة",
    count: "115",
    img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1800&q=92",
  },
  {
    ar: "إلكترونيات",
    en: "Electronics",
    sub: "أحدث التقنيات",
    count: "132",
    img: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1800&q=92",
  },
  {
    ar: "رياضة",
    en: "Athletics",
    sub: "أدوات الأبطال",
    count: "77",
    img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1800&q=92",
  },
];

export default function CategoriesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef   = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX     = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
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

    const init = async () => {
      try {
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js", "gsap");
      } catch { return; }

      const root  = sectionRef.current;
      const track = trackRef.current;
      if (!root || !track) return;

      gsap.fromTo(root.querySelector(".cs-top"), { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "expo.out" });
      gsap.fromTo(Array.from(track.children), { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 1, stagger: 0.08, ease: "expo.out", delay: 0.3 });

      const onMouseDown = (e: MouseEvent) => {
        isDragging.current = true;
        startX.current = e.pageX - track.offsetLeft;
        scrollLeft.current = track.scrollLeft;
        track.style.cursor = "grabbing";
      };
      const onMouseMove = (e: MouseEvent) => {
        if (!isDragging.current) return;
        e.preventDefault();
        const x = e.pageX - track.offsetLeft;
        const walk = (x - startX.current) * 1.4;
        track.scrollLeft = scrollLeft.current - walk;
      };
      const onMouseUp = () => { isDragging.current = false; track.style.cursor = "grab"; };

      track.addEventListener("mousedown", onMouseDown);
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);

      const bar = root.querySelector(".cs-progress-fill") as HTMLElement;
      const onScroll = () => {
        if (!bar) return;
        const pct = track.scrollLeft / (track.scrollWidth - track.clientWidth);
        bar.style.width = `${Math.min(pct * 100, 100)}%`;
      };
      track.addEventListener("scroll", onScroll, { passive: true });

      return () => {
        track.removeEventListener("mousedown", onMouseDown);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
        track.removeEventListener("scroll", onScroll);
      };
    };

    let unsub: (() => void) | undefined;
    init().then(fn => { unsub = fn; });
    return () => { unsub?.(); };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Reem+Kufi+Fun:wght@400;500;700&family=Noto+Naskh+Arabic:wght@400;700&family=Cormorant+Garamond:ital,wght@0,300;0,500;1,300&family=DM+Mono:wght@300;400;500&display=block');

        .cs-section {
          background: #E9EDF5;
          padding: 80px 0 0;
          direction: rtl;
          position: relative;
          overflow: hidden;
        }

        .cs-top {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          padding: 0 72px 48px;
          gap: 24px;
        }

        .cs-label-row {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 10px;
        }
        .cs-label-line { width: 36px; height: 0.5px; background: #FF9D1B; }
        .cs-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.28em;
          color: #FF9D1B; text-transform: uppercase;
        }
        .cs-heading {
          font-family: 'Reem Kufi Fun', 'Noto Naskh Arabic', serif;
          font-size: 52px; font-weight: 700;
          color: color: #003A5C;; line-height: 1; margin: 0;
        }
        .cs-heading-sub {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic; font-size: 17px;
          color: #003A5C;; opacity: 0.35; margin: 0 0 6px;
        }
        .cs-hint {
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.18em;
          color: rgba(0,58,92,0.35); text-transform: uppercase;
          display: flex; align-items: center; gap: 10px;
          align-self: flex-end; padding-bottom: 6px;
        }

        /* TRACK */
        .cs-track {
          display: flex;
          overflow-x: auto; overflow-y: hidden;
          scroll-behavior: smooth;
          scrollbar-width: none;
          cursor: grab;
          -webkit-overflow-scrolling: touch;
          scroll-snap-type: x mandatory;
        }
        .cs-track::-webkit-scrollbar { display: none; }

        /* STRIP */
        .cs-strip {
          position: relative;
          flex: 0 0 28vw;
          height: 70vh; min-height: 480px;
          overflow: hidden;
          scroll-snap-align: start;
          transition: flex 0.65s cubic-bezier(.25,.46,.45,.94);
        }
        .cs-strip:hover { flex: 0 0 40vw; }

        .cs-strip img {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          filter: brightness(0.5) saturate(0.8);
          transition: filter 0.65s ease, transform 0.85s cubic-bezier(.25,.46,.45,.94);
          user-select: none; pointer-events: none;
        }
        .cs-strip:hover img {
          filter: brightness(0.38) saturate(1.1);
          transform: scale(1.06);
        }

        .cs-strip-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,58,92,0.95) 0%, rgba(0,58,92,0.2) 45%, transparent 70%);
        }

        /* vertical gold divider */
        .cs-strip-line {
          position: absolute;
          top: 0; right: 0;
          width: 1px; height: 100%;
          background: rgba(255,157,27,0.18);
          transition: background 0.4s;
        }
        .cs-strip:hover .cs-strip-line { background: rgba(255,157,27,0.65); }

        .cs-strip-num {
          position: absolute;
          top: 28px; left: 28px;
          font-family: 'DM Mono', monospace;
          font-size: 11px; letter-spacing: 0.2em;
          color: rgba(238,243,255,0.3);
        }

        /* vertical label shown when collapsed */
        .cs-strip-vert {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%) rotate(90deg);
          font-family: 'Reem Kufi Fun', 'Noto Naskh Arabic', serif;
          font-size: 20px; font-weight: 700;
          color: rgba(238,243,255,0.2);
          white-space: nowrap; letter-spacing: 0.1em;
          transition: opacity 0.35s; pointer-events: none;
        }
        .cs-strip:hover .cs-strip-vert { opacity: 0; }

        /* bottom body */
        .cs-strip-body {
          position: absolute;
          bottom: 0; right: 0; left: 0;
          padding: 32px 28px;
          transform: translateY(10px);
          transition: transform 0.55s cubic-bezier(.25,.46,.45,.94);
        }
        .cs-strip:hover .cs-strip-body { transform: translateY(0); }

        .cs-strip-en {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic; font-size: 13px;
          color: rgba(238,243,255,0.4);
          margin: 0 0 4px;
          opacity: 0; transform: translateY(8px);
          transition: opacity 0.4s ease 0.05s, transform 0.4s ease 0.05s;
        }
        .cs-strip:hover .cs-strip-en { opacity: 1; transform: translateY(0); }

        .cs-strip-ar {
          font-family: 'Reem Kufi Fun', 'Noto Naskh Arabic', serif;
          font-size: 38px; font-weight: 700;
          color: #EEF3FF; line-height: 1; margin: 0 0 8px;
        }

        .cs-strip-sub {
          font-family: 'Reem Kufi Fun', serif;
          font-size: 12px; letter-spacing: 0.1em;
          color: rgba(238,243,255,0.4); margin: 0 0 18px;
          opacity: 0; transform: translateY(6px);
          transition: opacity 0.4s ease 0.1s, transform 0.4s ease 0.1s;
        }
        .cs-strip:hover .cs-strip-sub { opacity: 1; transform: translateY(0); }

        .cs-strip-footer {
          display: flex; align-items: center; justify-content: space-between;
          border-top: 0.5px solid rgba(238,243,255,0.1);
          padding-top: 14px;
        }

        .cs-strip-count {
          font-family: 'DM Mono', monospace;
          font-size: 11px; letter-spacing: 0.14em;
          color: #FF9D1B;
        }

        .cs-strip-arrow {
          width: 32px; height: 32px;
          border-radius: 50%;
          border: 0.5px solid rgba(238,243,255,0.2);
          display: flex; align-items: center; justify-content: center;
          color: #EEF3FF; font-size: 14px;
          opacity: 0; transform: scale(0.8);
          transition: opacity 0.35s ease 0.15s, transform 0.35s ease 0.15s, background 0.3s, border-color 0.3s;
        }
        .cs-strip:hover .cs-strip-arrow {
          opacity: 1; transform: scale(1);
          background: rgba(255,157,27,0.2);
          border-color: #FF9D1B;
        }

        /* BOTTOM */
        .cs-progress {
          height: 1px;
          background: rgba(238,243,255,0.07);
          margin: 20px 72px 0;
          position: relative; overflow: hidden;
        }
        .cs-progress-fill {
          position: absolute; top: 0; right: 0;
          height: 100%; width: 0%;
          background: #FF9D1B;
          transition: width 0.1s linear;
        }

        .cs-bottom-bar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 72px 40px;
        }

        .cs-total {
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.22em;
          color: rgba(0,58,92,0.35);; text-transform: uppercase;
        }

        .cs-nav-btns { display: flex; gap: 10px; }
        .cs-nav-btn {
          width: 36px; height: 36px; border-radius: 50%;
          border: 0.5px solid rgba(0,58,92,0.2);
          background: none; color: #003A5C; font-size: 15px;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: all 0.3s;
        }
        .cs-nav-btn:hover { background: #FF9D1B; border-color: #FF9D1B; color: #003A5C; }

        @media (max-width: 1100px) {
          .cs-strip { flex: 0 0 45vw; }
          .cs-strip:hover { flex: 0 0 58vw; }
          .cs-top, .cs-bottom-bar { padding-left: 40px; padding-right: 40px; }
          .cs-progress { margin-left: 40px; margin-right: 40px; }
        }
        @media (max-width: 720px) {
          .cs-strip { flex: 0 0 82vw; height: 56vh; }
          .cs-strip:hover { flex: 0 0 88vw; }
          .cs-top { padding: 0 22px 32px; flex-direction: column; align-items: flex-start; }
          .cs-heading { font-size: 38px; }
          .cs-progress { margin: 16px 22px 0; }
          .cs-bottom-bar { padding: 14px 22px 28px; }
        }
      `}</style>

      <section ref={sectionRef} className="cs-section">

        <div className="cs-top">
          <div>
            <div className="cs-label-row">
              <span className="cs-label-line" />
              <span className="cs-label">Browse · تصفح</span>
            </div>
            <p className="cs-heading-sub">Discover the Kingdom's finest</p>
            <h2 className="cs-heading">التصنيفات</h2>
          </div>
          <div className="cs-hint">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            اسحب للتصفح
          </div>
        </div>

        <div ref={trackRef} className="cs-track">
          {CATEGORIES.map((cat, i) => (
            <div key={cat.ar} className="cs-strip">
              <img src={cat.img} alt={cat.ar} draggable={false} />
              <div className="cs-strip-overlay" />
              <div className="cs-strip-line" />
              <span className="cs-strip-num">{String(i + 1).padStart(2, "0")}</span>
              <span className="cs-strip-vert">{cat.ar}</span>
              <div className="cs-strip-body">
                <p className="cs-strip-en">{cat.en}</p>
                <p className="cs-strip-ar">{cat.ar}</p>
                <p className="cs-strip-sub">{cat.sub}</p>
                <div className="cs-strip-footer">
                  <span className="cs-strip-count">{cat.count}+ متجر</span>
                  <div className="cs-strip-arrow">←</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="cs-progress">
          <div className="cs-progress-fill" />
        </div>
        <div className="cs-bottom-bar">
          <span className="cs-total">
            {CATEGORIES.length} تصنيفات · {CATEGORIES.reduce((a, c) => a + parseInt(c.count), 0)}+ متجر
          </span>
          <div className="cs-nav-btns">
            <button className="cs-nav-btn" onClick={() => trackRef.current && (trackRef.current.scrollLeft -= 400)}>→</button>
            <button className="cs-nav-btn" onClick={() => trackRef.current && (trackRef.current.scrollLeft += 400)}>←</button>
          </div>
        </div>

      </section>
    </>
  );
}