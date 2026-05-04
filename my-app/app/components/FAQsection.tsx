"use client";

import { useEffect, useRef, useState } from "react";

declare const gsap: any;

const FAQS = [
  {
    q: "كيف أتسوق من رفوف؟",
    a: "تصفح التصنيفات أو ابحث عن المنتج الذي تريده، أضفه إلى السلة وأكمل الطلب بخطوات بسيطة. نوصل إليك أينما كنت في المملكة.",
  },
  {
    q: "هل الشحن متاح لجميع مناطق المملكة؟",
    a: "نعم، نشحن إلى جميع مناطق ومدن المملكة العربية السعودية. تتراوح مدة التوصيل بين 2-5 أيام عمل حسب موقعك.",
  },
  {
    q: "ما هي طرق الدفع المتاحة؟",
    a: "نقبل الدفع بالبطاقات الائتمانية (Visa، Mastercard)، مدى، Apple Pay، وتحويل بنكي. جميع المعاملات مؤمّنة بالكامل.",
  },
  {
    q: "هل يمكنني إرجاع المنتج إذا لم يعجبني؟",
    a: "بالتأكيد. سياسة الإرجاع لدينا تتيح لك إرجاع المنتج خلال 14 يوماً من الاستلام بشرط أن يكون بحالته الأصلية.",
  },
  {
    q: "كيف أتتبع طلبي بعد الشراء؟",
    a: "ستصلك رسالة نصية وبريد إلكتروني برقم التتبع فور شحن طلبك. يمكنك أيضاً متابعة حالة الطلب من حسابك مباشرةً.",
  },
  {
    q: "هل المنتجات أصلية ومضمونة الجودة؟",
    a: "نعم، جميع المتاجر على رفوف مُعتمدة ومراجعة بعناية. نضمن أصالة جميع المنتجات وجودتها أو نسترد لك المبلغ كاملاً.",
  },
  {
    q: "هل يمكنني الشراء بدون إنشاء حساب؟",
    a: "يمكنك التصفح بدون حساب، لكن لإتمام الشراء وتتبع الطلبات نحتاج منك إنشاء حساب — العملية سريعة ولا تأخذ دقيقة.",
  },
  {
    q: "كيف أتواصل مع خدمة العملاء؟",
    a: "فريق خدمة العملاء متاح 7 أيام في الأسبوع من 9 صباحاً حتى 11 مساءً عبر الواتساب أو البريد الإلكتروني أو الدردشة المباشرة.",
  },
];

export default function FAQ() {
  const sectionRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(0);

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

      gsap.fromTo(root.querySelectorAll(".fq-header > *"),
        { y: 32, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "expo.out",
          scrollTrigger: { trigger: root, start: "top 82%" } }
      );
      gsap.fromTo(root.querySelectorAll(".fq-item"),
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.06, ease: "expo.out",
          scrollTrigger: { trigger: root.querySelector(".fq-list"), start: "top 88%" } }
      );
    };

    init();
  }, []);

  const toggle = (i: number) => setOpen(open === i ? null : i);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@300;400&family=Reem+Kufi+Fun:wght@400;500;700&display=block');

        .fq-section {
          background: #E9EDF5;
          direction: rtl;
          padding: 100px 72px 100px;
          position: relative;
        }

        /* ── LAYOUT: 2 cols — header left, list right ── */
        .fq-inner {
          display: grid;
          grid-template-columns: 1fr 1.6fr;
          gap: 80px;
          align-items: start;
        }

        /* ── LEFT: HEADER ── */
        .fq-header { position: sticky; top: 100px; }

        .fq-eyebrow { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
        .fq-eyebrow-line { width: 36px; height: 0.5px; background: #FF9D1B; }
        .fq-eyebrow-text {
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.28em;
          color: #FF9D1B; text-transform: uppercase;
        }

        .fq-title {
          font-family: 'DM Serif Display', serif;
          font-size: 52px; font-weight: 400;
          color: #003A5C; line-height: 1.05;
          margin: 0 0 16px;
          letter-spacing: -0.02em;
        }

        .fq-title-sub {
          font-family: 'DM Serif Display', serif;
          font-style: italic; font-size: 17px;
          color: #003A5C; opacity: 0.4;
          margin: 0 0 40px;
        }

        .fq-contact {
          border-top: 0.5px solid rgba(0,58,92,0.12);
          padding-top: 28px;
        }

        .fq-contact-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 300;
          color: rgba(0,58,92,0.5);
          margin: 0 0 14px; line-height: 1.6;
        }

        .fq-contact-btn {
          font-family: 'DM Mono', monospace;
          font-size: 11px; letter-spacing: 0.18em;
          color: #003A5C; text-transform: uppercase;
          background: none;
          border: 0.5px solid rgba(0,58,92,0.3);
          padding: 14px 24px;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex; align-items: center; gap: 10px;
          transition: all 0.35s;
        }
        .fq-contact-btn:hover {
          background: #003A5C;
          color: #E9EDF5;
          border-color: #003A5C;
        }

        /* ── RIGHT: LIST ── */
        .fq-list {
          display: flex; flex-direction: column;
        }

        .fq-item {
          border-top: 0.5px solid rgba(0,58,92,0.1);
        }
        .fq-item:last-child { border-bottom: 0.5px solid rgba(0,58,92,0.1); }

        .fq-question {
          width: 100%;
          display: flex; align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 26px 0;
          background: none; border: none;
          cursor: pointer; text-align: right;
          transition: color 0.3s;
        }

        .fq-question-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 17px; font-weight: 400;
          color: #003A5C; line-height: 1.4;
          transition: color 0.3s;
        }

        .fq-item.is-open .fq-question-text {
          color: #FF9D1B;
        }

        .fq-icon {
          width: 32px; height: 32px;
          border-radius: 50%;
          border: 0.5px solid rgba(0,58,92,0.2);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: all 0.35s ease;
          color: #003A5C;
          font-size: 18px; font-weight: 300;
          line-height: 1;
        }

        .fq-item.is-open .fq-icon {
          background: #FF9D1B;
          border-color: #FF9D1B;
          color: #fff;
          transform: rotate(45deg);
        }

        .fq-answer-wrap {
          overflow: hidden;
          max-height: 0;
          transition: max-height 0.45s cubic-bezier(.25,.46,.45,.94),
                      opacity 0.35s ease;
          opacity: 0;
        }

        .fq-item.is-open .fq-answer-wrap {
          max-height: 300px;
          opacity: 1;
        }

        .fq-answer {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 300;
          color: rgba(0,58,92,0.65);
          line-height: 1.8;
          padding: 0 0 26px;
          margin: 0;
        }

        @media (max-width: 1000px) {
          .fq-inner { grid-template-columns: 1fr; gap: 48px; }
          .fq-header { position: static; }
          .fq-section { padding: 80px 40px; }
        }
        @media (max-width: 720px) {
          .fq-section { padding: 60px 22px; }
          .fq-title { font-size: 38px; }
          .fq-question-text { font-size: 15px; }
        }
      `}</style>

      <section ref={sectionRef} className="fq-section">
        <div className="fq-inner">

          {/* LEFT */}
          <div className="fq-header">
            <div className="fq-eyebrow">
              <span className="fq-eyebrow-line" />
              <span className="fq-eyebrow-text">FAQ · أسئلة</span>
            </div>
            <h2 className="fq-title">الأسئلة الشائعة</h2>
            <p className="fq-title-sub">كل ما تحتاج معرفته</p>
            <div className="fq-contact">
              <p className="fq-contact-label">لم تجد إجابة لسؤالك؟ فريقنا جاهز لمساعدتك في أي وقت</p>
              <a className="fq-contact-btn" href="#">تواصل معنا ←</a>
            </div>
          </div>

          {/* RIGHT */}
          <div className="fq-list">
            {FAQS.map((faq, i) => (
              <div key={i} className={`fq-item ${open === i ? "is-open" : ""}`}>
                <button className="fq-question" onClick={() => toggle(i)}>
                  <span className="fq-question-text">{faq.q}</span>
                  <span className="fq-icon">+</span>
                </button>
                <div className="fq-answer-wrap">
                  <p className="fq-answer">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}