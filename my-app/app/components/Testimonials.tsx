"use client";

import { useEffect, useRef } from "react";

declare const gsap: any;

const TESTIMONIALS = [
  {
    name: "نورة المطيري",
    nameEn: "Noura Al Mutairi",
    city: "الرياض",
    avatar: "N",
    rating: 5,
    category: "أزياء",
    quote: "تجربة تسوق لا تُضاهى — وجدت تصاميم لم أجدها في أي مكان آخر",
  },
  {
    name: "سارة العتيبي",
    nameEn: "Sara Al Otaibi",
    city: "جدة",
    avatar: "S",
    rating: 5,
    category: "عطور",
    quote: "اكتشفت عطوراً سعودية أصيلة لم أكن أعلم بوجودها من قبل",
  },
  {
    name: "منى الشهري",
    nameEn: "Mona Al Shahri",
    city: "الدمام",
    avatar: "M",
    rating: 5,
    category: "مجوهرات",
    quote: "الجودة والأصالة في كل تفصيلة — أفضل قرار تسوق اتخذته",
  },
  {
    name: "ريم الدوسري",
    nameEn: "Reem Al Dosari",
    city: "الرياض",
    avatar: "R",
    rating: 5,
    category: "ديكور",
    quote: "حوّلت شقتي إلى تحفة فنية بفضل متاجر الديكور في رفوف",
  },
  {
    name: "لمى القحطاني",
    nameEn: "Lama Al Qahtani",
    city: "جدة",
    avatar: "L",
    rating: 5,
    category: "أزياء",
    quote: "أخيراً منصة تفهم ذوق المرأة السعودية — تنوع هائل وجودة استثنائية",
  },
  {
    name: "هند الزهراني",
    nameEn: "Hind Al Zahrani",
    city: "مكة",
    avatar: "H",
    rating: 5,
    category: "رياضة",
    quote: "جودة المعدات فاقت توقعاتي بكثير وخدمة العملاء كانت مثالية",
  },
];

export default function Testimonials() {
  const sectionRef  = useRef<HTMLElement>(null);
  const trackRef    = useRef<HTMLDivElement>(null);
  const isDragging  = useRef(false);
  const startX      = useRef(0);
  const scrollLeft  = useRef(0);

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

      const root  = sectionRef.current;
      const track = trackRef.current;
      if (!root || !track) return;

      gsap.registerPlugin((window as any).ScrollTrigger);

      gsap.fromTo(root.querySelector(".tm-top"),
        { y: 32, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "expo.out",
          scrollTrigger: { trigger: root, start: "top 82%" } }
      );
      gsap.fromTo(track.querySelectorAll(".tm-card"),
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.9, stagger: 0.08, ease: "expo.out",
          scrollTrigger: { trigger: track, start: "top 88%" } }
      );

      // drag
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
        track.scrollLeft = scrollLeft.current - (x - startX.current) * 1.3;
      };
      const onMouseUp = () => { isDragging.current = false; track.style.cursor = "grab"; };

      track.addEventListener("mousedown", onMouseDown);
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);

      // progress
      const bar = root.querySelector(".tm-progress-fill") as HTMLElement;
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
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@300;400&display=block');

        .tm-section {
          background: #E9EDF5;
          direction: rtl;
          padding: 100px 0 80px;
          position: relative;
          overflow: hidden;
        }

        /* TOP BAR */
        .tm-top {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          padding: 0 72px 52px;
          gap: 24px;
        }

        .tm-eyebrow { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
        .tm-eyebrow-line { width: 36px; height: 0.5px; background: #FF9D1B; }
        .tm-eyebrow-text {
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.28em;
          color: #FF9D1B; text-transform: uppercase;
        }
        .tm-title {
          font-family: 'DM Serif Display', serif;
          font-size: 52px; font-weight: 400;
          color: #003A5C; line-height: 1;
          margin: 0; letter-spacing: -0.02em;
        }
        .tm-title-sub {
          font-family: 'DM Serif Display', serif;
          font-style: italic; font-size: 17px;
          color: #003A5C; opacity: 0.4; margin: 8px 0 0;
        }

        .tm-overall { text-align: left; }
        .tm-overall-num {
          font-family: 'DM Serif Display', serif;
          font-size: 52px; font-weight: 400;
          color: #003A5C; line-height: 1;
          letter-spacing: -0.02em;
        }
        .tm-overall-num em { font-style: normal; color: #FF9D1B; }
        .tm-overall-stars { display: flex; gap: 3px; margin: 6px 0 4px; }
        .tm-overall-star { color: #FF9D1B; font-size: 14px; }
        .tm-overall-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.2em;
          color: rgba(0,58,92,0.35); text-transform: uppercase;
        }

        /* TRACK */
        .tm-track {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          overflow-y: hidden;
          scrollbar-width: none;
          cursor: grab;
          -webkit-overflow-scrolling: touch;
          scroll-snap-type: x mandatory;
          padding: 12px 72px 12px;
        }
        .tm-track::-webkit-scrollbar { display: none; }

        /* CARD */
        .tm-card {
          flex: 0 0 360px;
          background: #fff;
          border: 0.5px solid rgba(0,58,92,0.08);
          padding: 36px 32px 28px;
          position: relative;
          scroll-snap-align: start;
          transition: transform 0.4s cubic-bezier(.25,.46,.45,.94),
                      box-shadow 0.4s ease,
                      border-color 0.3s;
        }

        .tm-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 48px rgba(0,58,92,0.07);
          border-color: rgba(255,157,27,0.3);
        }

        .tm-card::before {
          content: "";
          position: absolute; top: 0; left: 0; right: 0;
          height: 2px; background: #FF9D1B;
          transform: scaleX(0); transform-origin: right;
          transition: transform 0.45s cubic-bezier(.7,0,.3,1);
        }
        .tm-card:hover::before {
          transform: scaleX(1); transform-origin: left;
        }

        .tm-card-mark {
          font-family: 'DM Serif Display', serif;
          font-size: 80px; font-weight: 400;
          color: #FF9D1B; opacity: 0.15;
          line-height: 0.6;
          margin-bottom: 20px;
          display: block;
          user-select: none;
        }

        .tm-card-stars {
          display: flex; gap: 3px; margin-bottom: 18px;
        }
        .tm-card-star { color: #FF9D1B; font-size: 13px; }

        .tm-card-quote {
          font-family: 'DM Sans', sans-serif;
          font-size: 16px; font-weight: 300;
          color: #003A5C; opacity: 0.8;
          line-height: 1.75; margin: 0 0 32px;
        }

        .tm-card-divider {
          width: 100%; height: 0.5px;
          background: rgba(0,58,92,0.07);
          margin-bottom: 22px;
        }

        .tm-card-person {
          display: flex; align-items: center;
          justify-content: space-between;
        }

        .tm-card-left { display: flex; align-items: center; gap: 12px; }

        .tm-card-avatar {
          width: 40px; height: 40px; border-radius: 50%;
          background: #003A5C;
          display: flex; align-items: center; justify-content: center;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 500;
          color: #EEF3FF; flex-shrink: 0;
        }

        .tm-card-name {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 500;
          color: #003A5C; margin: 0 0 3px;
        }
        .tm-card-city {
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.12em;
          color: rgba(0,58,92,0.35);
        }

        .tm-card-cat {
          font-family: 'DM Mono', monospace;
          font-size: 9px; letter-spacing: 0.16em;
          color: #D77900;
          background: rgba(255,157,27,0.08);
          padding: 4px 10px;
          text-transform: uppercase;
          border-radius: 2px;
          white-space: nowrap;
        }

        /* BOTTOM */
        .tm-bottom {
          display: flex; align-items: center;
          justify-content: space-between;
          padding: 20px 72px 0;
          margin-top: 20px;
        }

        .tm-progress {
          flex: 1;
          height: 1px;
          background: rgba(0,58,92,0.08);
          position: relative; overflow: hidden;
          max-width: 300px;
        }
        .tm-progress-fill {
          position: absolute; top: 0; right: 0;
          height: 100%; width: 0%;
          background: #FF9D1B;
          transition: width 0.1s linear;
        }

        .tm-nav-btns { display: flex; gap: 10px; }
        .tm-nav-btn {
          width: 36px; height: 36px; border-radius: 50%;
          border: 0.5px solid rgba(0,58,92,0.2);
          background: none; color: #003A5C;
          font-size: 15px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.3s;
        }
        .tm-nav-btn:hover { background: #003A5C; color: #EEF3FF; border-color: #003A5C; }

        @media (max-width: 1100px) {
          .tm-top { padding: 0 40px 48px; }
          .tm-track { padding: 12px 40px; }
          .tm-bottom { padding: 20px 40px 0; }
        }
        @media (max-width: 720px) {
          .tm-top { padding: 0 22px 36px; flex-direction: column; align-items: flex-start; }
          .tm-title { font-size: 38px; }
          .tm-track { padding: 12px 22px; }
          .tm-card { flex: 0 0 300px; }
          .tm-bottom { padding: 16px 22px 0; }
        }
      `}</style>

      <section ref={sectionRef} className="tm-section">

        {/* TOP */}
        <div className="tm-top">
          <div>
            <div className="tm-eyebrow">
              <span className="tm-eyebrow-line" />
              <span className="tm-eyebrow-text">Reviews · آراء</span>
            </div>
            <h2 className="tm-title">آراء المتسوقين</h2>
            <p className="tm-title-sub">What our shoppers say</p>
          </div>
          <div className="tm-overall">
            <div className="tm-overall-num">4.9<em>★</em></div>
            <div className="tm-overall-stars">
              {[1,2,3,4,5].map(i => <span key={i} className="tm-overall-star">★</span>)}
            </div>
            <div className="tm-overall-label">600+ تقييم</div>
          </div>
        </div>

        {/* SCROLLING TRACK */}
        <div ref={trackRef} className="tm-track">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="tm-card">
              <span className="tm-card-mark">"</span>
              <div className="tm-card-stars">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} className="tm-card-star">★</span>
                ))}
              </div>
              <p className="tm-card-quote">{t.quote}</p>
              <div className="tm-card-divider" />
              <div className="tm-card-person">
                <div className="tm-card-left">
                  <div className="tm-card-avatar">{t.avatar}</div>
                  <div>
                    <p className="tm-card-name">{t.name}</p>
                    <p className="tm-card-city">{t.city}</p>
                  </div>
                </div>
                <span className="tm-card-cat">{t.category}</span>
              </div>
            </div>
          ))}
        </div>

        {/* BOTTOM NAV */}
        <div className="tm-bottom">
          <div className="tm-progress">
            <div className="tm-progress-fill" />
          </div>
          <div className="tm-nav-btns">
            <button className="tm-nav-btn" onClick={() => trackRef.current && (trackRef.current.scrollLeft -= 380)}>→</button>
            <button className="tm-nav-btn" onClick={() => trackRef.current && (trackRef.current.scrollLeft += 380)}>←</button>
          </div>
        </div>

      </section>
    </>
  );
}