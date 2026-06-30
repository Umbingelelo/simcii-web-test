
// Nav + Hero + Ticker — SIMCII · Cordillera Cívica
// Paleta: bg · paper · azul cívico · terracota (señal) · gris ciudad

// Logo lockup oficial (isotipo + wordmark + tagline), versión para fondo oscuro.
// Úsalo donde hay espacio (footer). En el navbar va el isotipo + wordmark.
function Logo({ height = 26, style }) {
  return (
    <img
      src="assets/logo-simcii-oscuro.svg"
      alt="SIMCII — Inteligencia Territorial"
      style={{ height, width: 'auto', display: 'block', ...style }}
    />
  );
}

// Isotipo: cordillera de 3 planos (frontal terracota macizo · medio azul · fondo gris)
function Isotipo({ height = 24, style }) {
  return (
    <svg viewBox="0 0 64 34" style={{ height, width: 'auto', display: 'block', ...style }} aria-hidden="true">
      <path d="M2 22 L15 10 L24 17 L34 6 L44 16 L54 9 L62 15" fill="none" stroke="var(--gris-ciudad)" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" opacity="0.65" />
      <path d="M2 27 L17 15 L27 22 L37 12 L47 21 L62 13" fill="none" stroke="var(--azul-claro)" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M2 32 L19 21 L30 28 L41 19 L51 27 L62 21 L62 32 Z" fill="var(--terracota)" />
    </svg>
  );
}

// Marca para navbar: isotipo + wordmark (horizontal, legible)
function LogoMark({ style }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, ...style }}>
      <Isotipo height={26} />
      <span style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em', color: 'var(--paper)', lineHeight: 1 }}>SIMCII</span>
    </span>
  );
}

// -------- Nav --------
function Nav() {
  const [scrolled, setScrolled] = React.useState(false);
  const [active, setActive] = React.useState('');

  React.useEffect(() => {
    const handler = () => {
      setScrolled(window.scrollY > 40);
      const sections = ['platform', 'modules', 'sectors', 'casestudy'];
      for (const s of sections) {
        const el = document.getElementById(s);
        if (el) {
          const r = el.getBoundingClientRect();
          if (r.top < 200 && r.bottom > 200) { setActive(s); return; }
        }
      }
      setActive('');
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const links = [
    { label: 'Plataforma', href: '#platform', id: 'platform' },
    { label: 'Módulos', href: '#modules', id: 'modules' },
    { label: 'Sectores', href: '#sectors', id: 'sectors' },
    { label: 'Casos', href: '#casestudy', id: 'casestudy' },
  ];

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? 'rgba(23, 24, 27, 0.88)' : 'rgba(23, 24, 27, 0.55)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--line)',
      transition: 'background 0.45s cubic-bezier(0.16,1,0.3,1)',
    }}>
      <div className="nav-bar" style={{ padding: '0 2.5rem', maxWidth: 1440, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72, gap: 12 }}>

        <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} aria-label="SIMCII — inicio" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <LogoMark />
        </a>

        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {links.map(l => {
            const isActive = active === l.id;
            return (
              <a key={l.label} href={l.href} style={{
                position: 'relative',
                fontFamily: 'Source Sans 3, sans-serif', fontSize: 14, fontWeight: 600,
                color: isActive ? 'var(--azul-claro)' : 'var(--text-muted)',
                textDecoration: 'none',
                padding: '8px 14px',
                letterSpacing: '-0.005em',
                transition: 'color 0.25s',
              }}
                onMouseEnter={e => !isActive && (e.target.style.color = 'var(--paper)')}
                onMouseLeave={e => !isActive && (e.target.style.color = 'var(--text-muted)')}
              >
                {l.label}
                {isActive && <span style={{ position: 'absolute', left: 14, right: 14, bottom: 4, height: 1, background: 'var(--azul-claro)' }} />}
              </a>
            );
          })}
        </div>

        <a className="nav-cta" href="#demo" style={{
          fontFamily: 'Source Sans 3, sans-serif', fontWeight: 700, fontSize: 14,
          background: 'var(--azul-civico)', color: 'var(--paper)',
          padding: '10px 19px', border: '1px solid var(--azul-civico)',
          borderRadius: 2, textDecoration: 'none',
          transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
          letterSpacing: '0.01em', display: 'inline-flex', alignItems: 'center', gap: 8,
          whiteSpace: 'nowrap',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--azul-claro)'; e.currentTarget.style.borderColor = 'var(--azul-claro)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--azul-civico)'; e.currentTarget.style.color = 'var(--paper)'; e.currentTarget.style.borderColor = 'var(--azul-civico)'; }}
        ><span className="nav-cta-text">Solicitar demo</span><span className="nav-cta-short" style={{ display: 'none' }}>Demo</span>
          <svg width="11" height="11" viewBox="0 0 10 10" fill="none"><path d="M1 5h8m-3-3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </a>
      </div>
    </nav>
  );
}

// -------- Ticker — parámetros monitoreados (ilustrativos) --------
const TICKER_ITEMS = [
  { label: 'MP2.5', value: '23 µg/m³' },
  { label: 'MP10', value: '38 µg/m³' },
  { label: 'SO₂', value: '12 ppb' },
  { label: 'RUIDO DIURNO', value: '52 dB' },
  { label: 'SCORE TERRITORIAL', value: '85.7', status: 'BUENO' },
  { label: 'COMPROMISOS', value: '12 activos' },
  { label: 'ALERTAS', value: '03' },
  { label: 'ESTACIONES', value: 'OK' },
  { label: 'SATISFACCIÓN', value: '78%' },
  { label: 'COMUNAS', value: '12' },
];

function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div style={{ background: 'var(--surface)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', overflow: 'hidden', padding: '12px 0', position: 'relative' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 60, background: 'linear-gradient(90deg, var(--surface) 0%, transparent 100%)', zIndex: 2, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 60, background: 'linear-gradient(-90deg, var(--surface) 0%, transparent 100%)', zIndex: 2, pointerEvents: 'none' }} />
      <div className="ticker-track">
        {items.map((item, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginRight: 36, whiteSpace: 'nowrap', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, letterSpacing: '0.04em' }}>
            <span style={{ color: 'var(--azul-claro)' }}>{item.label}</span>
            {item.value && <><span style={{ color: 'var(--text-quiet)' }}>·</span><span style={{ color: 'var(--paper)', fontVariantNumeric: 'tabular-nums' }}>{item.value}</span></>}
            {item.status && <><span style={{ color: 'var(--text-quiet)' }}>·</span><span style={{ color: 'var(--azul-claro)' }}>{item.status}</span></>}
          </span>
        ))}
      </div>
    </div>
  );
}

// -------- Hero --------
function Hero({ introDone }) {
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => { const t = setTimeout(() => setLoaded(true), 60); return () => clearTimeout(t); }, []);

  return (
    <section id="top" className="hero-section" style={{
      position: 'relative', minHeight: '100vh', overflow: 'hidden',
      paddingTop: 72,
      background: 'var(--bg)',
    }}>
      {/* Cabecera editorial */}
      <div className="bitacora-bar" style={{
        borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)',
        padding: '10px 2.5rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-soft)' }}>
            SIMCII · INTELIGENCIA TERRITORIAL · § 01
          </span>
        </div>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--azul-claro)', letterSpacing: '0.16em', display: 'inline-flex', alignItems: 'center', gap: 7 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--azul-claro)', animation: 'blink 1.6s infinite' }} /> POR ACCIONET · 2026
        </span>
      </div>

      {/* Grid 60/40 */}
      <div className="hero-grid" style={{
        maxWidth: 1440, margin: '0 auto',
        padding: '80px 2.5rem 48px',
        display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 56,
        alignItems: 'center', minHeight: 'calc(100vh - 160px)',
      }}>
        {/* LEFT */}
        <div>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--azul-claro)',
            letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 28,
            opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(10px)',
            transition: 'all 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s',
          }}>§ 01 · Plataforma de monitoreo territorial</div>

          <h1 className="hero-headline" style={{
            fontFamily: 'Manrope, sans-serif', fontWeight: 800,
            fontSize: 'clamp(2.6rem, 6.4vw, 5.6rem)',
            lineHeight: 0.98,
            letterSpacing: '-0.035em',
            color: 'var(--paper)', marginBottom: 32, textWrap: 'balance',
            opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(24px)',
            transition: 'all 1.1s cubic-bezier(0.16,1,0.3,1) 0.35s',
          }}>
            Monitoreo <span style={{ color: 'var(--azul-claro)' }}>ambiental, social y territorial</span> en una sola plataforma.
          </h1>

          <p className="hero-subtitle" style={{
            fontFamily: 'Source Sans 3, sans-serif', fontWeight: 400,
            fontSize: 'clamp(1.1rem, 1.7vw, 1.4rem)', lineHeight: 1.5,
            color: 'var(--text-muted)', maxWidth: '52ch', marginBottom: 40,
            opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(20px)',
            transition: 'all 1s cubic-bezier(0.16,1,0.3,1) 0.6s',
            textWrap: 'pretty',
          }}>
            Integra datos ambientales, sociales y de contexto en una sola vista.
            Mide, lee y anticipa el territorio con evidencia — no con intuición.
          </p>

          <div className="hero-meta" style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap',
            opacity: loaded ? 1 : 0, transition: 'opacity 1s 0.9s' }}>
            <a href="#demo" onClick={(e) => { e.preventDefault(); document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' }); }} className="hero-cta" style={{
              fontFamily: 'Source Sans 3, sans-serif', fontSize: 14, fontWeight: 700,
              letterSpacing: '0.01em',
              background: 'var(--azul-civico)', color: 'var(--paper)',
              padding: '14px 24px', border: '1px solid var(--azul-civico)', borderRadius: 2,
              textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 9,
              transition: 'all 0.25s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--azul-claro)'; e.currentTarget.style.borderColor = 'var(--azul-claro)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--azul-civico)'; e.currentTarget.style.color = 'var(--paper)'; e.currentTarget.style.borderColor = 'var(--azul-civico)'; }}
            >Solicitar demo
              <svg width="12" height="12" viewBox="0 0 10 10" fill="none"><path d="M1 5h8m-3-3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </a>
            <a href="#platform" onClick={(e) => { e.preventDefault(); document.getElementById('platform')?.scrollIntoView({ behavior: 'smooth' }); }} style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
              textTransform: 'uppercase', letterSpacing: '0.12em',
              color: 'var(--paper)', textDecoration: 'none',
              paddingBottom: 6, borderBottom: '1px solid var(--azul-claro)',
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}>
              Ver la plataforma
              <span style={{ display: 'inline-block' }}>→</span>
            </a>
          </div>
        </div>

        {/* RIGHT — Cordillera 3D (elemento de marca) */}
        <aside className="hero-chile" style={{
          position: 'relative',
          opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateX(20px)',
          transition: 'all 1s cubic-bezier(0.16,1,0.3,1) 1s',
        }}>
          <div style={{ position: 'relative', height: 540 }}>
            <window.Cordillera3D height={540} />
            <div style={{ position: 'absolute', bottom: 8, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'var(--text-soft)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>
              <span style={{ color: 'var(--terracota)' }}>● operación</span>
              <span style={{ color: 'var(--azul-claro)' }}>● contexto</span>
              <span style={{ color: 'var(--gris-ciudad)' }}>● memoria</span>
            </div>
          </div>
        </aside>
      </div>

      {/* Marginalia */}
      <div className="hero-marginalia" style={{
        position: 'absolute', bottom: 32, left: 40,
        fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
        color: 'var(--text-soft)', letterSpacing: '0.14em', textTransform: 'uppercase',
      }}>§ 01 · 2026</div>
      <div className="hero-marginalia" style={{
        position: 'absolute', bottom: 32, right: 40,
        fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
        color: 'var(--text-soft)', letterSpacing: '0.14em', textTransform: 'uppercase',
        animation: 'bounceArrow 2s ease-in-out infinite',
      }}>SCROLL ↓</div>
    </section>
  );
}

// -------- Text animation (utilidad, opcional) --------
function SplitText({ text, delay = 0, style }) {
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <span style={{ display: 'inline-block', ...style }}>
      {text.split(' ').map((word, wi) => (
        <span key={wi} style={{ display: 'inline-block', marginRight: '0.25em', overflow: 'hidden', verticalAlign: 'top' }}>
          <span style={{
            display: 'inline-block',
            transform: visible ? 'translateY(0)' : 'translateY(110%)',
            opacity: visible ? 1 : 0,
            transition: `transform 0.9s cubic-bezier(0.16,1,0.3,1) ${wi * 0.05}s, opacity 0.8s ${wi * 0.05}s`,
          }}>{word}</span>
        </span>
      ))}
    </span>
  );
}

// -------- IntroLoader — cordillera que se dibuja --------
function IntroLoader({ onDone }) {
  const [phase, setPhase] = React.useState(0);
  React.useEffect(() => {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { const t = setTimeout(() => onDone(), 250); return () => clearTimeout(t); }
    const t1 = setTimeout(() => setPhase(1), 250);
    const t2 = setTimeout(() => setPhase(2), 1500);
    const t3 = setTimeout(() => onDone(), 2150);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 22,
      transform: phase === 2 ? 'translateY(-100%)' : 'translateY(0)',
      transition: 'transform 0.9s cubic-bezier(0.76,0,0.24,1)',
      overflow: 'hidden',
    }}>
      <div style={{ width: 200, opacity: phase >= 1 ? 1 : 0, transition: 'opacity 0.6s' }}>
        <svg viewBox="0 0 460 130" style={{ width: '100%', display: 'block' }} aria-hidden="true">
          <path d="M0 110 L70 70 L120 95 L180 55 L240 92 L300 50 L360 88 L420 64 L460 92"
            fill="none" stroke="var(--gris-ciudad)" strokeWidth="2" opacity="0.4"
            strokeDasharray="600" strokeDashoffset={phase >= 1 ? 0 : 600} style={{ transition: 'stroke-dashoffset 1.2s ease 0.1s' }} />
          <path d="M0 130 L90 90 L160 112 L230 80 L300 110 L370 86 L440 114 L460 100 L460 130 Z"
            fill="var(--terracota)" opacity={phase >= 1 ? 1 : 0} style={{ transition: 'opacity 0.8s ease 0.4s' }} />
        </svg>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, opacity: phase >= 1 ? 1 : 0, transition: 'opacity 0.6s 0.2s' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10.5, color: 'var(--text-muted)', letterSpacing: '0.22em', textTransform: 'uppercase' }}>
          SIMCII · INTELIGENCIA TERRITORIAL
        </div>
        <div style={{ width: 200, height: 1, background: 'var(--surface-2)', position: 'relative', overflow: 'hidden', marginTop: 6 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'var(--azul-claro)', transformOrigin: 'left center', transform: 'scaleX(0)', animation: 'loaderFill 1.3s cubic-bezier(0.65,0,0.35,1) 0.2s forwards' }} />
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Nav, Hero, Ticker, SplitText, IntroLoader, Logo });
