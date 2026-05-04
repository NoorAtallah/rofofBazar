"use client";

import { useEffect, useRef, useState } from "react";

declare const gsap: any;

const STORES = [
  {
    name: "دار لمسة",
    nameEn: "Dar Lamsa",
    category: "أزياء",
    categoryEn: "Couture",
    city: "الرياض",
    rating: "4.9",
    reviews: "312",
    since: "2021",
    tag: "الأكثر مبيعاً",
    desc: "تصاميم عصرية تجمع بين الأصالة والحداثة في كل قطعة",
    descEn: "Contemporary designs blending heritage with modernity",
    img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1800&q=92",
  },
  {
    name: "عبير الخليج",
    nameEn: "Abeer Al Khaleej",
    category: "عطور",
    categoryEn: "Perfumery",
    city: "جدة",
    rating: "4.8",
    reviews: "198",
    since: "2020",
    tag: "مميز",
    desc: "روائح شرقية أصيلة مستوحاة من عمق الجزيرة العربية",
    descEn: "Authentic oriental fragrances inspired by the Arabian peninsula",
    img: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1800&q=92",
  },
  {
    name: "لمعة الذهب",
    nameEn: "Lam'at Al Dhahab",
    category: "مجوهرات",
    categoryEn: "Jewelry",
    city: "الرياض",
    rating: "5.0",
    reviews: "421",
    since: "2019",
    tag: "الأعلى تقييماً",
    desc: "مجوهرات استثنائية تحكي قصة الفن والجمال الخالد",
    descEn: "Exceptional jewelry that tells the story of timeless art",
    img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1800&q=92",
  },
  {
    name: "روز ديكور",
    nameEn: "Rose Décor",
    category: "ديكور",
    categoryEn: "Interiors",
    city: "الدمام",
    rating: "4.7",
    reviews: "145",
    since: "2022",
    tag: "جديد",
    desc: "تحويل المساحات إلى تحف فنية تعكس ذوقك الرفيع",
    descEn: "Transforming spaces into art that reflects refined taste",
    img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1800&q=92",
  },
  {
    name: "تك ستور",
    nameEn: "Tech Store",
    category: "إلكترونيات",
    categoryEn: "Electronics",
    city: "جدة",
    rating: "4.6",
    reviews: "267",
    since: "2021",
    tag: "مميز",
    desc: "أحدث التقنيات العالمية بين يديك في قلب المملكة",
    descEn: "Latest global technology in the heart of the Kingdom",
    img: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1800&q=92",
  },
  {
    name: "قمة الرياضة",
    nameEn: "Qimmat Al Riyada",
    category: "رياضة",
    categoryEn: "Athletics",
    city: "الرياض",
    rating: "4.8",
    reviews: "183",
    since: "2022",
    tag: "جديد",
    desc: "معدات وملابس رياضية للبطل الذي بداخلك",
    descEn: "Sports gear and apparel for the champion within",
    img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1800&q=92",
  },
];

export default function FeaturedStores() {
  const sectionRef   = useRef<HTMLElement>(null);
  const ticker1Ref   = useRef<HTMLDivElement>(null);
  const ticker2Ref   = useRef<HTMLDivElement>(null);
  const panelRef     = useRef<HTMLDivElement>(null);
  const [active, setActive]     = useState<number | null>(null);
  const [visible, setVisible]   = useState(false);
  const gsapCtx      = useRef<any>(null);
  const tickerAnim   = useRef<any>(null);

  /* ── ticker auto-scroll ── */
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
      const t1   = ticker1Ref.current;
      const t2   = ticker2Ref.current;
      if (!root || !t1 || !t2) return;

      gsap.registerPlugin((window as any).ScrollTrigger);

      // section entrance
      gsap.fromTo(root.querySelector(".fs-header"),
        { y: 36, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "expo.out",
          scrollTrigger: { trigger: root, start: "top 82%" } }
      );

      // ticker row 1: RTL scroll
      const runTicker = () => {
        const w1 = t1.scrollWidth / 2;
        const w2 = t2.scrollWidth / 2;

        tickerAnim.current = gsap.timeline({ repeat: -1 });
        tickerAnim.current
          .to(t1, { x: `-=${w1}`, duration: w1 / 60, ease: "none" })
          .set(t1, { x: 0 });

        gsap.timeline({ repeat: -1 })
          .to(t2, { x: `+=${w2}`, duration: w2 / 55, ease: "none" })
          .set(t2, { x: `-${w2}px` });
      };

      runTicker();
      setVisible(true);
    };

    init();
    return () => { gsapCtx.current?.revert(); };
  }, []);

  /* ── expand panel ── */
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel || !(window as any).gsap) return;
    const g = (window as any).gsap;

    if (active !== null) {
      g.fromTo(panel,
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.75, ease: "expo.out" }
      );
      g.fromTo(panel.querySelectorAll(".fs-panel-item"),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: "expo.out", delay: 0.1 }
      );
    } else {
      g.to(panel, { height: 0, opacity: 0, duration: 0.45, ease: "expo.in" });
    }
  }, [active]);

  const store = active !== null ? STORES[active] : null;

  const TickerItem = ({ s, idx }: { s: typeof STORES[0]; idx: number }) => (
    <button
      className={`fs-ticker-item ${active === idx ? "is-active" : ""}`}
      onClick={() => setActive(active === idx ? null : idx)}
    >
      <span className="fs-ticker-num">{String(idx + 1).padStart(2, "0")}</span>
      <span className="fs-ticker-ar">{s.name}</span>
      <span className="fs-ticker-en">{s.nameEn}</span>
      <span className="fs-ticker-cat">{s.categoryEn}</span>
      <span className="fs-ticker-dot" />
    </button>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Reem+Kufi+Fun:wght@400;500;700&family=Noto+Naskh+Arabic:wght@400;700&family=Cormorant+Garamond:ital,wght@0,300;0,500;1,300&family=DM+Mono:wght@300;400;500&display=block');

        .fs-section {
          background: #E9EDF5;
          direction: rtl;
          position: relative;
          overflow: hidden;
          padding-bottom: 80px;
        }

        /* ── HEADER ── */
        .fs-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          padding: 100px 72px 56px;
          gap: 24px;
        }

        .fs-eyebrow { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
        .fs-eyebrow-line { width: 36px; height: 0.5px; background: #FF9D1B; }
        .fs-eyebrow-text {
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.28em;
          color: #FF9D1B; text-transform: uppercase;
        }
        .fs-title {
          font-family: 'Reem Kufi Fun', 'Noto Naskh Arabic', serif;
          font-size: 52px; font-weight: 700;
          color: #003A5C; line-height: 1; margin: 0;
        }
        .fs-title-sub {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic; font-size: 17px;
          color: #003A5C; opacity: 0.4; margin: 6px 0 0;
        }
        .fs-hint {
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.18em;
          color: rgba(0,58,92,0.35); text-transform: uppercase;
          align-self: flex-end; padding-bottom: 6px;
        }

        /* ── TICKER ROWS ── */
        .fs-ticker-section {
          position: relative;
          overflow: hidden;
          border-top: 0.5px solid rgba(0,58,92,0.1);
          border-bottom: 0.5px solid rgba(0,58,92,0.1);
        }

        /* edge fade */
        .fs-ticker-section::before,
        .fs-ticker-section::after {
          content: "";
          position: absolute; top: 0; bottom: 0;
          width: 120px; z-index: 3; pointer-events: none;
        }
        .fs-ticker-section::before {
          right: 0;
          background: linear-gradient(to left, #E9EDF5, transparent);
        }
        .fs-ticker-section::after {
          left: 0;
          background: linear-gradient(to right, #E9EDF5, transparent);
        }

        .fs-ticker-row {
          display: flex;
          white-space: nowrap;
          padding: 0;
          will-change: transform;
        }

        .fs-ticker-row-2 {
          border-top: 0.5px solid rgba(0,58,92,0.06);
        }

        .fs-ticker-item {
          display: inline-flex;
          align-items: center;
          gap: 18px;
          padding: 22px 36px;
          background: none;
          border: none;
          cursor: pointer;
          border-left: 0.5px solid rgba(0,58,92,0.08);
          transition: background 0.3s ease;
          position: relative;
          flex-shrink: 0;
        }

        .fs-ticker-item:hover,
        .fs-ticker-item.is-active {
          background: rgba(0,58,92,0.04);
        }

        .fs-ticker-item.is-active .fs-ticker-ar {
          color: #FF9D1B;
        }

        .fs-ticker-num {
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.2em;
          color: rgba(0,58,92,0.25);
        }
        .fs-ticker-ar {
          font-family: 'Reem Kufi Fun', 'Noto Naskh Arabic', serif;
          font-size: 22px; font-weight: 700;
          color: #003A5C;
          transition: color 0.3s;
        }
        .fs-ticker-en {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic; font-size: 15px;
          color: rgba(0,58,92,0.4);
        }
        .fs-ticker-cat {
          font-family: 'DM Mono', monospace;
          font-size: 9px; letter-spacing: 0.2em;
          color: rgba(0,58,92,0.3);
          text-transform: uppercase;
          border: 0.5px solid rgba(0,58,92,0.15);
          padding: 3px 8px; border-radius: 2px;
        }
        .fs-ticker-dot {
          width: 4px; height: 4px; border-radius: 50%;
          background: #FF9D1B; opacity: 0.4;
          flex-shrink: 0;
        }

        /* ── EXPAND PANEL ── */
        .fs-panel {
          overflow: hidden;
          height: 0; opacity: 0;
        }

        .fs-panel-inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          border-bottom: 0.5px solid rgba(0,58,92,0.1);
        }

        /* image side */
        .fs-panel-img {
          position: relative;
          height: 480px;
          overflow: hidden;
        }
        .fs-panel-img img {
          width: 100%; height: 100%;
          object-fit: cover;
          filter: brightness(0.75);
          transition: transform 0.8s cubic-bezier(.25,.46,.45,.94);
        }
        .fs-panel-img:hover img { transform: scale(1.04); }

        .fs-panel-img-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,58,92,0.8) 0%, transparent 60%);
        }

        .fs-panel-img-label {
          position: absolute;
          bottom: 28px; right: 28px;
          font-family: 'Reem Kufi Fun', 'Noto Naskh Arabic', serif;
          font-size: 64px; font-weight: 700;
          color: rgba(238,243,255,0.15);
          line-height: 1;
          pointer-events: none;
        }

        .fs-panel-tag {
          position: absolute;
          top: 24px; right: 24px;
          font-family: 'DM Mono', monospace;
          font-size: 9px; letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #FF9D1B;
          background: rgba(0,58,92,0.55);
          padding: 6px 12px; border-radius: 2px;
          backdrop-filter: blur(4px);
        }

        /* info side */
        .fs-panel-info {
          background: #003A5C;
          padding: 52px 56px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .fs-panel-item { }

        .fs-panel-cat {
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.28em;
          color: #FF9D1B; text-transform: uppercase;
          margin: 0 0 14px;
        }

        .fs-panel-name {
          font-family: 'Reem Kufi Fun', 'Noto Naskh Arabic', serif;
          font-size: 56px; font-weight: 700;
          color: #EEF3FF; line-height: 0.95;
          margin: 0 0 6px;
        }

        .fs-panel-name-en {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic; font-size: 20px;
          color: rgba(238,243,255,0.4);
          margin: 0 0 24px;
        }

        .fs-panel-desc {
          font-family: 'Reem Kufi Fun', serif;
          font-size: 15px; line-height: 1.7;
          color: rgba(238,243,255,0.6);
          margin: 0 0 8px;
        }

        .fs-panel-desc-en {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic; font-size: 14px;
          color: rgba(238,243,255,0.3);
          margin: 0;
        }

        .fs-panel-divider {
          width: 100%; height: 0.5px;
          background: rgba(238,243,255,0.1);
          margin: 28px 0;
        }

        .fs-panel-stats {
          display: flex; gap: 36px;
        }

        .fs-panel-stat-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 32px; font-weight: 300;
          color: #EEF3FF; line-height: 1;
        }
        .fs-panel-stat-num em { font-style: normal; color: #FF9D1B; }
        .fs-panel-stat-label {
          font-family: 'DM Mono', monospace;
          font-size: 9px; letter-spacing: 0.18em;
          color: rgba(238,243,255,0.3);
          text-transform: uppercase; margin-top: 4px;
        }

        .fs-panel-cta {
          display: inline-flex; align-items: center; gap: 12px;
          font-family: 'Reem Kufi Fun', sans-serif;
          font-size: 12px; font-weight: 500;
          color: #003A5C;
          background: #FF9D1B;
          border: none;
          padding: 16px 32px;
          cursor: pointer;
          letter-spacing: 0.12em;
          align-self: flex-start;
          transition: background 0.3s, color 0.3s;
          margin-top: 28px;
        }
        .fs-panel-cta:hover { background: #D77900; }

        /* close btn */
        .fs-panel-close {
          position: absolute;
          top: 20px; left: 20px;
          width: 32px; height: 32px;
          border-radius: 50%;
          border: 0.5px solid rgba(238,243,255,0.2);
          background: none;
          color: rgba(238,243,255,0.5);
          font-size: 16px;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.3s;
        }
        .fs-panel-close:hover {
          background: rgba(238,243,255,0.1);
          color: #EEF3FF;
        }

        @media (max-width: 900px) {
          .fs-panel-inner { grid-template-columns: 1fr; }
          .fs-panel-img { height: 300px; }
          .fs-panel-info { padding: 36px 32px; }
          .fs-panel-name { font-size: 40px; }
        }
        @media (max-width: 720px) {
          .fs-header { padding: 60px 22px 40px; flex-direction: column; align-items: flex-start; }
          .fs-title { font-size: 38px; }
          .fs-ticker-item { padding: 18px 22px; gap: 12px; }
          .fs-ticker-ar { font-size: 18px; }
        }
      `}</style>

      <section ref={sectionRef} className="fs-section">

        {/* HEADER */}
        <div className="fs-header">
          <div>
            <div className="fs-eyebrow">
              <span className="fs-eyebrow-line" />
              <span className="fs-eyebrow-text">Featured · مميز</span>
            </div>
            <p className="fs-title-sub">Top stores this season</p>
            <h2 className="fs-title">المتاجر المميزة</h2>
          </div>
          <span className="fs-hint">اضغط على متجر لعرضه</span>
        </div>

        {/* TICKER ROWS */}
        <div className="fs-ticker-section">
          {/* row 1 — scrolls RTL */}
          <div ref={ticker1Ref} className="fs-ticker-row">
            {[...STORES, ...STORES].map((s, i) => (
              <TickerItem key={`r1-${i}`} s={s} idx={i % STORES.length} />
            ))}
          </div>

          {/* row 2 — scrolls LTR */}
          <div ref={ticker2Ref} className="fs-ticker-row fs-ticker-row-2" style={{ transform: `translateX(-${STORES.length * 200}px)` }}>
            {[...STORES, ...STORES].map((s, i) => (
              <TickerItem key={`r2-${i}`} s={s} idx={i % STORES.length} />
            ))}
          </div>
        </div>

        {/* EXPAND PANEL */}
        <div ref={panelRef} className="fs-panel">
          {store && (
            <div className="fs-panel-inner">
              <div className="fs-panel-img">
                <img src={store.img} alt={store.name} />
                <div className="fs-panel-img-overlay" />
                <span className="fs-panel-img-label">{store.name}</span>
                <span className="fs-panel-tag">{store.tag}</span>
              </div>

              <div className="fs-panel-info" style={{ position: "relative" }}>
                <button
                  className="fs-panel-close"
                  onClick={() => setActive(null)}
                  aria-label="close"
                >✕</button>

                <div>
                  <p className="fs-panel-item fs-panel-cat">{store.categoryEn} · {store.city}</p>
                  <h3 className="fs-panel-item fs-panel-name">{store.name}</h3>
                  <p className="fs-panel-item fs-panel-name-en">{store.nameEn}</p>
                  <p className="fs-panel-item fs-panel-desc">{store.desc}</p>
                  <p className="fs-panel-item fs-panel-desc-en">{store.descEn}</p>
                </div>

                <div>
                  <div className="fs-panel-divider" />
                  <div className="fs-panel-stats">
                    <div className="fs-panel-item">
                      <div className="fs-panel-stat-num">{store.rating}<em>★</em></div>
                      <div className="fs-panel-stat-label">تقييم</div>
                    </div>
                    <div className="fs-panel-item">
                      <div className="fs-panel-stat-num">{store.reviews}<em>+</em></div>
                      <div className="fs-panel-stat-label">تقييم</div>
                    </div>
                    <div className="fs-panel-item">
                      <div className="fs-panel-stat-num">{store.since}</div>
                      <div className="fs-panel-stat-label">تأسس</div>
                    </div>
                  </div>
                  <button className="fs-panel-cta">
                    زيارة المتجر ←
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

      </section>
    </>
  );
}