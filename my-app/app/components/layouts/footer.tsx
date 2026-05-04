"use client";

const LINKS = {
  shop: [
    { ar: "المتاجر", href: "#" },
    { ar: "التصنيفات", href: "#" },
    { ar: "العروض", href: "#" },
    { ar: "الجديد", href: "#" },
    { ar: "الأكثر مبيعاً", href: "#" },
  ],
  help: [
    { ar: "تتبع طلبي", href: "#" },
    { ar: "سياسة الإرجاع", href: "#" },
    { ar: "طرق الدفع", href: "#" },
    { ar: "الشحن والتوصيل", href: "#" },
    { ar: "تواصل معنا", href: "#" },
  ],
  about: [
    { ar: "عن رفوف", href: "#" },
    { ar: "انضم كمتجر", href: "#" },
    { ar: "المدونة", href: "#" },
    { ar: "الوظائف", href: "#" },
    { ar: "الشركاء", href: "#" },
  ],
};

const SOCIALS = [
  {
    name: "X",
    href: "#",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "#",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="2" width="20" height="20" rx="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    name: "WhatsApp",
    href: "#",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.11 1.523 5.835L.057 23.492a.5.5 0 0 0 .614.6l5.786-1.516A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.89 0-3.663-.525-5.176-1.437l-.362-.216-3.756.984.999-3.648-.236-.375A9.953 9.953 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "#",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Reem+Kufi+Fun:wght@400;500;700&family=DM+Sans:wght@300;400;500&family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@300;400&display=block');

        .ft-footer {
          background: #003A5C;
          direction: rtl;
          position: relative;
          overflow: hidden;
        }

        /* grain */
        .ft-footer::before {
          content: "";
          position: absolute; inset: 0;
          opacity: 0.08;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.18 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
          pointer-events: none; z-index: 0;
        }

        .ft-inner { position: relative; z-index: 1; }

        /* ── TOP STRIP ── */
        .ft-top {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr 1fr;
          gap: 48px;
          padding: 80px 72px 64px;
          border-bottom: 0.5px solid rgba(238,243,255,0.08);
        }

        /* BRAND COL */
        .ft-brand { }

        .ft-logo {
          font-family: 'Reem Kufi Fun', serif;
          font-size: 28px; font-weight: 700;
          color: #EEF3FF;
          display: flex; align-items: baseline; gap: 6px;
          margin-bottom: 16px;
          text-decoration: none;
        }
        .ft-logo-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #FF9D1B;
          box-shadow: 0 0 0 3px rgba(255,157,27,0.18);
          display: inline-block;
        }

        .ft-tagline {
          font-family: 'DM Serif Display', serif;
          font-style: italic;
          font-size: 15px;
          color: rgba(238,243,255,0.4);
          line-height: 1.6;
          margin: 0 0 28px;
          max-width: 240px;
        }

        /* newsletter */
        .ft-newsletter-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.22em;
          color: rgba(238,243,255,0.35);
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .ft-newsletter-form {
          display: flex;
          border: 0.5px solid rgba(238,243,255,0.15);
          overflow: hidden;
        }

        .ft-newsletter-input {
          flex: 1;
          background: rgba(238,243,255,0.06);
          border: none; outline: none;
          padding: 12px 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 300;
          color: #EEF3FF;
          direction: rtl;
          min-width: 0;
        }
        .ft-newsletter-input::placeholder { color: rgba(238,243,255,0.25); }

        .ft-newsletter-btn {
          background: #FF9D1B;
          border: none; cursor: pointer;
          padding: 12px 18px;
          color: #003A5C;
          font-size: 14px;
          display: flex; align-items: center;
          transition: background 0.3s;
          flex-shrink: 0;
        }
        .ft-newsletter-btn:hover { background: #D77900; }

        /* socials */
        .ft-socials {
          display: flex; gap: 10px;
          margin-top: 24px;
        }
        .ft-social {
          width: 36px; height: 36px;
          border-radius: 50%;
          border: 0.5px solid rgba(238,243,255,0.15);
          display: flex; align-items: center; justify-content: center;
          color: rgba(238,243,255,0.5);
          text-decoration: none;
          transition: all 0.3s;
        }
        .ft-social:hover {
          background: #FF9D1B;
          border-color: #FF9D1B;
          color: #003A5C;
        }

        /* NAV COLS */
        .ft-col-title {
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.28em;
          color: #FF9D1B; text-transform: uppercase;
          margin: 0 0 20px;
        }

        .ft-col-links {
          list-style: none; margin: 0; padding: 0;
          display: flex; flex-direction: column; gap: 12px;
        }

        .ft-col-links a {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 300;
          color: rgba(238,243,255,0.55);
          text-decoration: none;
          transition: color 0.3s, padding-right 0.3s;
          display: block;
        }
        .ft-col-links a:hover {
          color: #EEF3FF;
          padding-right: 6px;
        }

        /* ── CONTACT STRIP ── */
        .ft-contact {
          display: flex;
          align-items: center;
          gap: 36px;
          padding: 28px 72px;
          border-bottom: 0.5px solid rgba(238,243,255,0.06);
          flex-wrap: wrap;
        }

        .ft-contact-item {
          display: flex; align-items: center; gap: 10px;
          font-family: 'DM Mono', monospace;
          font-size: 11px; letter-spacing: 0.12em;
          color: rgba(238,243,255,0.4);
          text-decoration: none;
          transition: color 0.3s;
        }
        .ft-contact-item:hover { color: #FF9D1B; }
        .ft-contact-item svg { opacity: 0.5; flex-shrink: 0; }
        .ft-contact-item:hover svg { opacity: 1; }

        .ft-contact-divider {
          width: 0.5px; height: 16px;
          background: rgba(238,243,255,0.1);
        }

        /* ── BOTTOM BAR ── */
        .ft-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 72px;
          gap: 24px;
          flex-wrap: wrap;
        }

        .ft-copy {
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.16em;
          color: rgba(238,243,255,0.2);
        }
        .ft-copy em { font-style: normal; color: #FF9D1B; opacity: 0.7; }

        .ft-legal {
          display: flex; gap: 24px;
          list-style: none; margin: 0; padding: 0;
        }
        .ft-legal a {
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.14em;
          color: rgba(238,243,255,0.2);
          text-decoration: none;
          transition: color 0.3s;
        }
        .ft-legal a:hover { color: rgba(238,243,255,0.5); }

        .ft-made {
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.14em;
          color: rgba(238,243,255,0.15);
        }

        @media (max-width: 1100px) {
          .ft-top {
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            padding: 60px 40px 48px;
          }
          .ft-contact, .ft-bottom { padding-left: 40px; padding-right: 40px; }
        }
        @media (max-width: 720px) {
          .ft-top {
            grid-template-columns: 1fr;
            padding: 48px 22px 36px;
          }
          .ft-contact { padding: 20px 22px; gap: 16px; }
          .ft-contact-divider { display: none; }
          .ft-bottom {
            padding: 20px 22px;
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          .ft-legal { flex-wrap: wrap; gap: 16px; }
          .ft-made { display: none; }
        }
      `}</style>

      <footer className="ft-footer">
        <div className="ft-inner">

          {/* TOP GRID */}
          <div className="ft-top">

            {/* BRAND */}
            <div className="ft-brand">
              <a href="#" className="ft-logo">
                رُفوف <span className="ft-logo-dot" />
              </a>
              <p className="ft-tagline">
                السوق الفاخر للعلامات التجارية السعودية الأصيلة
              </p>

              <p className="ft-newsletter-label">اشترك في نشرتنا</p>
              <div className="ft-newsletter-form">
                <input
                  className="ft-newsletter-input"
                  type="email"
                  placeholder="بريدك الإلكتروني"
                />
                <button className="ft-newsletter-btn" aria-label="subscribe">
                  ←
                </button>
              </div>

              <div className="ft-socials">
                {SOCIALS.map(s => (
                  <a key={s.name} href={s.href} className="ft-social" aria-label={s.name}>
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* SHOP */}
            <div>
              <p className="ft-col-title">تسوق</p>
              <ul className="ft-col-links">
                {LINKS.shop.map(l => (
                  <li key={l.ar}><a href={l.href}>{l.ar}</a></li>
                ))}
              </ul>
            </div>

            {/* HELP */}
            <div>
              <p className="ft-col-title">المساعدة</p>
              <ul className="ft-col-links">
                {LINKS.help.map(l => (
                  <li key={l.ar}><a href={l.href}>{l.ar}</a></li>
                ))}
              </ul>
            </div>

            {/* ABOUT */}
            <div>
              <p className="ft-col-title">رفوف</p>
              <ul className="ft-col-links">
                {LINKS.about.map(l => (
                  <li key={l.ar}><a href={l.href}>{l.ar}</a></li>
                ))}
              </ul>
            </div>

          </div>

          {/* CONTACT STRIP */}
          <div className="ft-contact">
            <a href="mailto:hello@rofof.sa" className="ft-contact-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="m2 7 10 7 10-7"/>
              </svg>
              hello@rofof.sa
            </a>
            <div className="ft-contact-divider" />
            <a href="tel:+966500000000" className="ft-contact-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              +966 50 000 0000
            </a>
            <div className="ft-contact-divider" />
            <a href="#" className="ft-contact-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.11 1.523 5.835L.057 23.492a.5.5 0 0 0 .614.6l5.786-1.516A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.89 0-3.663-.525-5.176-1.437l-.362-.216-3.756.984.999-3.648-.236-.375A9.953 9.953 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
              واتساب
            </a>
            <div className="ft-contact-divider" />
            <span className="ft-contact-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
              خدمة العملاء ٩ص — ١١م
            </span>
          </div>

          {/* BOTTOM BAR */}
          <div className="ft-bottom">
            <p className="ft-copy">
              © ٢٠٢٦ رفوف. جميع الحقوق محفوظة — <em>Rofof Bazaar</em>
            </p>
            <ul className="ft-legal">
              <li><a href="#">سياسة الخصوصية</a></li>
              <li><a href="#">الشروط والأحكام</a></li>
              <li><a href="#">سياسة ملفات تعريف الارتباط</a></li>
            </ul>
            
          </div>

        </div>
      </footer>
    </>
  );
}