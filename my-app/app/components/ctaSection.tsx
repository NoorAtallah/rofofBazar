"use client";

import { useEffect, useRef } from "react";

declare const gsap: any;

export default function ShopCTA() {
  const sectionRef = useRef<HTMLElement>(null);

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
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js", "ScrollTrigger");
      } catch { return; }

      const root = sectionRef.current;
      if (!root) return;
      gsap.registerPlugin((window as any).ScrollTrigger);

      gsap.fromTo(root.querySelectorAll(".cta-animate"),
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1.1, stagger: 0.12, ease: "expo.out",
          scrollTrigger: { trigger: root, start: "top 80%" },
        }
      );

      gsap.to(root.querySelector(".cta-bg-word"), {
        y: -60,
        scrollTrigger: {
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    };

    init();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@300;400&family=Reem+Kufi+Fun:wght@700&display=block');

        .cta-section {
          background: #E9EDF5;
          direction: rtl;
          position: relative;
          overflow: hidden;
          padding: 140px 72px 140px;
          text-align: center;
        }

        .cta-section::before {
          content: "";
          position: absolute; inset: 0;
          opacity: 0.2;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.18 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
          pointer-events: none; z-index: 0;
        }

        .cta-bg-word {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          font-family: 'Reem Kufi Fun', serif;
          font-size: clamp(160px, 28vw, 380px);
          font-weight: 700;
          color: rgba(0,58,92,0.04);
          white-space: nowrap;
          pointer-events: none;
          user-select: none;
          z-index: 0;
          letter-spacing: -0.02em;
        }

        .cta-inner {
          position: relative; z-index: 1;
          max-width: 760px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .cta-eyebrow {
          display: flex; align-items: center; gap: 14px;
          margin-bottom: 28px;
        }
        .cta-eyebrow-line { width: 40px; height: 0.5px; background: #FF9D1B; }
        .cta-eyebrow-text {
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.32em;
          color: #FF9D1B; text-transform: uppercase;
        }

        .cta-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(48px, 7vw, 88px);
          font-weight: 400;
          color: #003A5C;
          line-height: 1.05;
          margin: 0 0 12px;
          letter-spacing: -0.02em;
          display: block;
        }

        .cta-title-ar {
          font-family: 'Reem Kufi Fun', serif;
          font-size: clamp(52px, 8vw, 96px);
          font-weight: 700;
          color: #FF9D1B;
          line-height: 1;
          margin: 0 0 32px;
          letter-spacing: -0.01em;
          display: block;
        }

        .cta-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 17px; font-weight: 300;
          color: rgba(0,58,92,0.5);
          line-height: 1.7;
          margin: 0 0 52px;
          max-width: 520px;
        }

        .cta-btns {
          display: flex; align-items: center;
          gap: 16px; flex-wrap: wrap;
          justify-content: center;
        }

        .cta-btn-primary {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 500;
          color: #fff;
          background: #003A5C;
          border: none;
          padding: 18px 48px;
          cursor: pointer;
          letter-spacing: 0.04em;
          position: relative; overflow: hidden;
          transition: color 0.4s;
          text-decoration: none;
          display: inline-block;
        }
        .cta-btn-primary span { position: relative; z-index: 2; }
        .cta-btn-primary::before {
          content: ""; position: absolute; inset: 0;
          background: #FF9D1B;
          transform: translateY(101%);
          transition: transform 0.45s cubic-bezier(.7,0,.3,1);
          z-index: 1;
        }
        .cta-btn-primary:hover { color: #003A5C; }
        .cta-btn-primary:hover::before { transform: translateY(0); }

        .cta-btn-secondary {
          font-family: 'DM Mono', monospace;
          font-size: 11px; letter-spacing: 0.18em;
          color: rgba(0,58,92,0.6);
          background: none;
          border: 0.5px solid rgba(0,58,92,0.2);
          padding: 18px 36px;
          cursor: pointer;
          text-transform: uppercase;
          text-decoration: none;
          display: inline-block;
          transition: all 0.35s;
        }
        .cta-btn-secondary:hover {
          border-color: rgba(0,58,92,0.5);
          color: #003A5C;
        }

        .cta-stats {
          display: flex; align-items: center;
          gap: 40px;
          margin-top: 72px;
          padding-top: 40px;
          border-top: 0.5px solid rgba(0,58,92,0.1);
        }

        .cta-stat { text-align: center; }
        .cta-stat-num {
          font-family: 'DM Serif Display', serif;
          font-size: 36px; font-weight: 400;
          color: #003A5C; line-height: 1;
          letter-spacing: -0.02em;
        }
        .cta-stat-num em { font-style: normal; color: #FF9D1B; }
        .cta-stat-label {
          font-family: 'DM Mono', monospace;
          font-size: 9px; letter-spacing: 0.22em;
          color: rgba(0,58,92,0.35);
          text-transform: uppercase;
          margin-top: 6px;
        }
        .cta-stat-divider {
          width: 0.5px; height: 36px;
          background: rgba(0,58,92,0.1);
        }

        .cta-corner {
          position: absolute;
          width: 48px; height: 48px;
          pointer-events: none; z-index: 1;
        }
        .cta-corner::before, .cta-corner::after {
          content: ""; position: absolute;
          background: #FF9D1B; opacity: 0.4;
        }
        .cta-corner::before { width: 100%; height: 0.5px; top: 0; left: 0; }
        .cta-corner::after  { width: 0.5px; height: 100%; top: 0; left: 0; }
        .cta-corner.tr { top: 32px; left: 32px; transform: rotate(180deg); }
        .cta-corner.bl { bottom: 32px; right: 32px; }

        @media (max-width: 720px) {
          .cta-section { padding: 100px 22px; }
          .cta-stats { gap: 20px; flex-wrap: wrap; justify-content: center; }
          .cta-stat-divider { display: none; }
          .cta-btns { flex-direction: column; width: 100%; }
          .cta-btn-primary, .cta-btn-secondary { width: 100%; text-align: center; }
        }
      `}</style>

      <section ref={sectionRef} className="cta-section">
        <div className="cta-corner tr" />
        <div className="cta-corner bl" />
        <span className="cta-bg-word">رفوف</span>

        <div className="cta-inner">
          <div className="cta-eyebrow cta-animate">
            <span className="cta-eyebrow-line" />
            <span className="cta-eyebrow-text">Royal Bazaar · 2026</span>
            <span className="cta-eyebrow-line" />
          </div>

          <h2 className="cta-animate">
            <span className="cta-title">Discover the Kingdom's</span>
            <span className="cta-title-ar">أفضل المتاجر</span>
          </h2>

          <p className="cta-sub cta-animate">
            أكثر من ٥٩٤ متجر سعودي أصيل في مكان واحد — تسوق بثقة، واستلم أينما كنت في المملكة
          </p>

          <div className="cta-btns cta-animate">
            <a href="#" className="cta-btn-primary">
              <span>ابدأ التسوق الآن</span>
            </a>
            <a href="#" className="cta-btn-secondary">تصفح التصنيفات ←</a>
          </div>

          <div className="cta-stats cta-animate">
            <div className="cta-stat">
              <div className="cta-stat-num">٥٩٤<em>+</em></div>
              <div className="cta-stat-label">متجر نشط</div>
            </div>
            <div className="cta-stat-divider" />
            <div className="cta-stat">
              <div className="cta-stat-num">١٢<em>+</em></div>
              <div className="cta-stat-label">مدينة</div>
            </div>
            <div className="cta-stat-divider" />
            <div className="cta-stat">
              <div className="cta-stat-num">4.9<em>★</em></div>
              <div className="cta-stat-label">تقييم</div>
            </div>
            <div className="cta-stat-divider" />
            <div className="cta-stat">
              <div className="cta-stat-num">١٤<em>+</em></div>
              <div className="cta-stat-label">يوم ضمان إرجاع</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}