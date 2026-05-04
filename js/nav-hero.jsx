
// Nav + Hero + Ticker — SIMCII Bitácora Territorial
// Paleta: azul-gris · hueso · altiplano · fósforo · ámbar · óxido

function GlobeMark({ size = 28 }) {
  return (
    <img
      src="assets/logo-simcii-mark.png"
      alt=""
      aria-hidden="true"
      style={{
        width: size, height: size, display: 'block',
        objectFit: 'contain',
        filter: 'invert(1)',
        mixBlendMode: 'screen',
      }}
    />
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
      background: 'rgba(21, 25, 28, 0.85)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--line)',
      transition: 'all 0.45s cubic-bezier(0.16,1,0.3,1)',
    }}>
      <div className="nav-bar" style={{ padding: '0 2.5rem', maxWidth: 1440, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72, gap: 12 }}>

        {/* Logo: globo + wordmark */}
        <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <GlobeMark size={26} />
          <span style={{ fontFamily: 'Newsreader, serif', fontWeight: 600, fontSize: 18, color: 'var(--hueso)', letterSpacing: '-0.025em' }}>SIMCII</span>
        </a>

        {/* Links */}
        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {links.map(l => {
            const isActive = active === l.id;
            return (
              <a key={l.label} href={l.href} style={{
                position: 'relative',
                fontFamily: 'Geist, sans-serif', fontSize: 13, fontWeight: 500,
                color: isActive ? 'var(--altiplano)' : 'var(--text-muted)',
                textDecoration: 'none',
                padding: '8px 14px',
                letterSpacing: '-0.005em',
                transition: 'color 0.25s',
              }}
                onMouseEnter={e => !isActive && (e.target.style.color = 'var(--hueso)')}
                onMouseLeave={e => !isActive && (e.target.style.color = 'var(--text-muted)')}
              >
                {l.label}
                {isActive && <span style={{ position: 'absolute', left: 14, right: 14, bottom: 4, height: 1, background: 'var(--altiplano)' }} />}
              </a>
            );
          })}
        </div>

        {/* CTA */}
        <a className="nav-cta" href="#demo" style={{
          fontFamily: 'Geist, sans-serif', fontWeight: 600, fontSize: 13,
          background: 'var(--altiplano)', color: 'var(--azul-gris)',
          padding: '10px 19px', border: '1px solid var(--altiplano)',
          borderRadius: 2, textDecoration: 'none',
          transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
          letterSpacing: '0.01em', display: 'inline-flex', alignItems: 'center', gap: 8,
          whiteSpace: 'nowrap',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--altiplano)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--altiplano)'; e.currentTarget.style.color = 'var(--azul-gris)'; }}
        ><span className="nav-cta-text">Agendar conversación</span><span className="nav-cta-short" style={{ display: 'none' }}>Demo</span>
          <svg width="11" height="11" viewBox="0 0 10 10" fill="none"><path d="M1 5h8m-3-3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </a>
      </div>
    </nav>
  );
}

// -------- Ticker --------
const TICKER_ITEMS = [
  { label: 'PM2.5', value: '23 µg/m³', delta: '-2 vs 24h', deltaColor: 'var(--fosforo)' },
  { label: 'AQI', value: '47', status: 'BUENO' },
  { label: 'pH 7.4', extra: 'TURB 1.1 NTU' },
  { label: 'COV', value: '0.18 ppm' },
  { label: 'RUIDO', value: '52 dB' },
  { label: 'VIENTO', value: 'SO 4.2 m/s' },
  { label: 'TEMP', value: '18.3 °C' },
  { label: 'H. RELATIVA', value: '64%' },
  { label: 'SO2', value: '0.012 ppm' },
  { label: 'NO2', value: '21 ppb' },
];

function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div style={{ background: 'var(--azul-gris-2)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', overflow: 'hidden', padding: '12px 0', position: 'relative' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 60, background: 'linear-gradient(90deg, var(--azul-gris-2) 0%, transparent 100%)', zIndex: 2, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 60, background: 'linear-gradient(-90deg, var(--azul-gris-2) 0%, transparent 100%)', zIndex: 2, pointerEvents: 'none' }} />
      <div className="ticker-track">
        {items.map((item, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginRight: 36, whiteSpace: 'nowrap', fontFamily: 'Geist Mono, monospace', fontSize: 12, letterSpacing: '0.04em' }}>
            <span style={{ color: 'var(--altiplano)' }}>{item.label}</span>
            {item.value && <><span style={{ color: 'var(--text-quiet)' }}>·</span><span style={{ color: 'var(--hueso)' }}>{item.value}</span></>}
            {item.extra && <><span style={{ color: 'var(--text-quiet)' }}>·</span><span style={{ color: 'var(--text-muted)' }}>{item.extra}</span></>}
            {item.delta && <><span style={{ color: 'var(--text-quiet)' }}>·</span><span style={{ color: item.deltaColor }}>{item.delta}</span></>}
            {item.status && <><span style={{ color: 'var(--text-quiet)' }}>·</span><span style={{ color: 'var(--fosforo)' }}>{item.status}</span></>}
          </span>
        ))}
      </div>
    </div>
  );
}

// -------- Text animation --------
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

// -------- Chile dot strip canvas --------
function ChileDotStrip() {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const DPR = window.devicePixelRatio || 1;
    const resize = () => {
      canvas.width = canvas.offsetWidth * DPR;
      canvas.height = canvas.offsetHeight * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const widthAt = (t) => {
      if (t < 0.04) return 0.18;
      if (t < 0.25) return 0.24 + Math.sin(t * 10) * 0.06;
      if (t < 0.45) return 0.22 + Math.sin(t * 8) * 0.05;
      if (t < 0.62) return 0.26 + Math.sin(t * 6) * 0.05;
      if (t < 0.80) return 0.34 + Math.sin(t * 5) * 0.08;
      if (t < 0.95) return 0.44 + Math.sin(t * 14) * 0.16;
      return 0.26;
    };

    const nodes = [
      { y: 0.14, active: true, kind: 'primary' },
      { y: 0.28, active: true, kind: 'dot' },
      { y: 0.42, active: true, kind: 'dot' },
      { y: 0.55, active: true, kind: 'primary' },
      { y: 0.70, active: false, kind: 'dot' },
      { y: 0.85, active: false, kind: 'dot' },
    ];

    let raf;
    const draw = (t) => {
      const W = canvas.offsetWidth, H = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);

      const rows = Math.floor(H / 7);
      const dotSize = 2.0;
      for (let r = 0; r < rows; r++) {
        const ny = r / rows;
        const widthFraction = widthAt(ny);
        const cols = Math.max(1, Math.floor((W * widthFraction) / 7));
        const cx = W / 2;
        for (let c = 0; c < cols; c++) {
          const nx = cols === 1 ? 0 : (c / (cols - 1)) - 0.5;
          const x = cx + nx * W * widthFraction * 0.92;
          const y = r * 7 + 3;

          let alpha = 0.12;
          let rgb = '242, 237, 228';

          nodes.forEach(n => {
            const d = Math.abs(ny - n.y);
            if (d < 0.04) {
              const local = 1 - d / 0.04;
              alpha = Math.max(alpha, 0.20 + local * 0.50);
              rgb = '110, 240, 255';
            }
          });
          const wave = (Math.sin(ny * 14 - t / 900) + 1) / 2;
          alpha += wave * 0.04;

          ctx.fillStyle = `rgba(${rgb}, ${alpha})`;
          ctx.beginPath();
          ctx.arc(x, y, dotSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      nodes.forEach(n => {
        const y = n.y * H;
        const cx = W / 2;
        const pulse = (Math.sin(t / 600) + 1) / 2;
        const baseR = n.kind === 'primary' ? 5 : 3;
        ctx.fillStyle = n.active ? '#6EF0FF' : 'rgba(242,237,228,0.35)';
        ctx.beginPath();
        ctx.arc(cx, y, baseR, 0, Math.PI * 2);
        ctx.fill();
        if (n.active) {
          ctx.strokeStyle = `rgba(110, 240, 255, ${(1 - pulse) * 0.5})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(cx, y, baseR + pulse * 12, 0, Math.PI * 2);
          ctx.stroke();
        }
      });
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} style={{ width: '100%', height: '100%', display: 'block' }} />;
}

// Metric row — kept for compatibility, no longer rendered in hero
function MetricRow({ label, state, color, fill }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px dashed var(--line)', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, flexShrink: 0 }} />
        <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10.5, color: 'var(--hueso)', letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <div style={{ width: 48, height: 3, background: 'rgba(242,237,228,0.08)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${fill}%`, background: color, transition: 'width 1.2s cubic-bezier(0.16,1,0.3,1)' }} />
        </div>
        <span style={{ fontFamily: 'Newsreader, serif', fontSize: 10, color: 'var(--text-muted)' }}>{state}</span>
      </div>
    </div>
  );
}

// -------- Hero --------
function Hero({ introDone }) {
  const [loaded, setLoaded] = React.useState(false);
  const [now, setNow] = React.useState(new Date());
  const [strikeMode, setStrikeMode] = React.useState(null);
  const [fills, setFills] = React.useState([62, 78, 34, 88, 54]);

  React.useEffect(() => { const t = setTimeout(() => setLoaded(true), 60); return () => clearTimeout(t); }, []);
  React.useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(i);
  }, []);
  React.useEffect(() => {
    const i = setInterval(() => {
      setFills(prev => prev.map(v => Math.max(18, Math.min(95, v + (Math.random() - 0.5) * 6))));
    }, 2800);
    return () => clearInterval(i);
  }, []);

  const SIMCII_LETTERS = ['S', 'I', 'M', 'C', 'I', 'I'];

  return (
    <section id="top" className="hero-section" style={{
      position: 'relative', minHeight: '100vh', overflow: 'hidden',
      paddingTop: 72,
      background: 'var(--azul-gris)',
    }}>
      {/* Bitácora header bar */}
      <div className="bitacora-bar" style={{
        borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)',
        padding: '10px 2.5rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <GlobeMark size={20} />
          <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-soft)' }}>
            BITÁCORA TERRITORIAL · § 01 · OBSERVATORIO ACCIONET
          </span>
        </div>
        <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 11, color: 'var(--altiplano)', letterSpacing: '0.16em' }}>
          ● LIVE · 2026
        </span>
      </div>

      {/* Body grid 60% / 40% */}
      <div className="hero-grid" style={{
        maxWidth: 1440, margin: '0 auto',
        padding: '80px 2.5rem 48px',
        display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 56,
        alignItems: 'center', minHeight: 'calc(100vh - 160px)',
      }}>
        {/* LEFT — SIMCII wordmark */}
        <div>
          {/* SIMCII letters with staggered reveal */}
          <div className="hero-letters" style={{ marginBottom: 48, lineHeight: 0.85 }}>
            {SIMCII_LETTERS.map((letter, i) => (
              <span key={i} style={{
                display: 'inline-block',
                fontFamily: 'Newsreader, serif',
                fontWeight: 400,
                fontSize: 'clamp(7rem, 16vw, 16rem)',
                fontVariationSettings: loaded ? '"opsz" 72' : '"opsz" 9',
                lineHeight: 0.85,
                letterSpacing: '-0.045em',
                color: 'var(--hueso)',
                transform: loaded ? 'translateY(0)' : 'translateY(110%)',
                opacity: loaded ? 1 : 0,
                transition: `transform 1.4s cubic-bezier(0.76, 0, 0.24, 1) ${i * 0.08}s, opacity 1s ${i * 0.08}s, font-variation-settings 1.4s cubic-bezier(0.76, 0, 0.24, 1) ${i * 0.08}s`,
                cursor: 'default',
              }}
                onMouseEnter={e => { e.target.style.fontVariationSettings = '"opsz" 144, "wght" 600'; }}
                onMouseLeave={e => { e.target.style.fontVariationSettings = '"opsz" 72, "wght" 400'; }}
              >{letter}</span>
            ))}
          </div>

          {/* Subtitle */}
          <p className="hero-subtitle" style={{
            fontFamily: 'Newsreader, serif', fontWeight: 300,
            fontSize: 'clamp(1.4rem, 2.4vw, 2.4rem)', lineHeight: 1.2,
            color: 'var(--hueso)', maxWidth: '38ch', marginBottom: 32,
            opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(20px)',
            transition: 'all 1s cubic-bezier(0.16,1,0.3,1) 0.8s',
          }}>
            Sin datos, la sostenibilidad es relato. <em style={{
              fontFamily: 'Newsreader, serif', fontStyle: 'italic',
              fontVariationSettings: '"opsz" 36', color: 'var(--altiplano)', fontWeight: 400,
            }}>Con datos, es territorio.</em>
          </p>

          {/* Description */}
          <p style={{
            fontFamily: 'Geist, sans-serif', fontSize: 16,
            color: 'var(--text-muted)', maxWidth: '56ch', lineHeight: 1.55, marginBottom: 40,
            opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(20px)',
            transition: 'all 1s cubic-bezier(0.16,1,0.3,1) 1s',
          }}>
            Plataforma de inteligencia territorial. Integra observación social, ambiental y reputacional en una sola lectura. Para quienes operan donde el territorio importa.
          </p>

          {/* CTA link */}
          <a className="hero-cta" href="#platform" onClick={(e) => { e.preventDefault(); document.getElementById('platform')?.scrollIntoView({ behavior: 'smooth' }); }} style={{
            fontFamily: 'Geist Mono, monospace', fontSize: 12,
            textTransform: 'uppercase', letterSpacing: '0.12em',
            color: 'var(--hueso)', textDecoration: 'none',
            paddingBottom: 6, borderBottom: '1px solid var(--altiplano)',
            display: 'inline-flex', alignItems: 'center', gap: 8,
            opacity: loaded ? 1 : 0, transition: 'opacity 1s 1.2s',
          }}
            onMouseEnter={e => { if (e.currentTarget.lastChild) e.currentTarget.lastChild.style.transform = 'translateX(4px)'; }}
            onMouseLeave={e => { if (e.currentTarget.lastChild) e.currentTarget.lastChild.style.transform = 'translateX(0)'; }}
          >
            OBSERVAR LA PLATAFORMA
            <span style={{ display: 'inline-block', transition: 'transform 0.3s' }}>→</span>
          </a>
        </div>

        {/* RIGHT — Chile canvas + territorial labels */}
        <aside className="hero-chile" style={{
          position: 'relative',
          opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateX(20px)',
          transition: 'all 1s cubic-bezier(0.16,1,0.3,1) 1s',
        }}>
          <div style={{ position: 'relative', height: 540, display: 'flex', justifyContent: 'center' }}>
            {/* 4 territorial labels */}
            {[
              { top: '14%', right: true,  label: 'Zona norte',    stat: 'EN OBSERVACIÓN' },
              { top: '30%', right: false, label: 'Zona desierto', stat: 'POR DESPLEGAR' },
              { top: '55%', right: true,  label: 'Zona central',  stat: 'EN ESCUCHA ACTIVA' },
              { top: '80%', right: false, label: 'Zona sur',      stat: 'PRÓXIMAMENTE' },
            ].map((a, i) => (
              <div key={i} style={{
                position: 'absolute', top: a.top,
                [a.right ? 'right' : 'left']: 0,
                transform: 'translateY(-50%)',
                display: 'flex', flexDirection: 'column',
                alignItems: a.right ? 'flex-end' : 'flex-start',
                gap: 4,
                opacity: loaded ? 1 : 0,
                transition: `opacity 0.8s ease ${1.2 + i * 0.15}s`,
              }}>
                <div style={{
                  fontFamily: 'Newsreader, serif', fontWeight: 500, fontSize: 13,
                  color: 'var(--hueso)', letterSpacing: '-0.015em',
                }}>{a.label}</div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  flexDirection: a.right ? 'row' : 'row-reverse',
                }}>
                  <span style={{ width: 16, height: 1, background: 'var(--altiplano)', opacity: 0.6 }} />
                  <span style={{
                    fontFamily: 'Geist Mono, monospace', fontSize: 9,
                    color: 'var(--text-muted)', letterSpacing: '0.16em', textTransform: 'uppercase',
                  }}>{a.stat}</span>
                </div>
              </div>
            ))}

            <div style={{ width: 130, height: '100%', position: 'relative' }}>
              <ChileDotStrip />
              <div className="chile-scan" style={{
                position: 'absolute', left: -16, right: -16, height: 18,
                background: 'linear-gradient(180deg, transparent, rgba(110, 240, 255, 0.25), transparent)',
                pointerEvents: 'none',
              }} />
            </div>
          </div>
        </aside>
      </div>

      {/* Marginalia corners */}
      <div className="hero-marginalia" style={{
        position: 'absolute', bottom: 32, left: 40,
        fontFamily: 'Geist Mono, monospace', fontSize: 10,
        color: 'var(--text-quiet)', letterSpacing: '0.14em', textTransform: 'uppercase',
      }}>FOLIO 01 · MMXXVI</div>
      <div className="hero-marginalia" style={{
        position: 'absolute', bottom: 32, right: 40,
        fontFamily: 'Geist Mono, monospace', fontSize: 10,
        color: 'var(--text-quiet)', letterSpacing: '0.14em', textTransform: 'uppercase',
        animation: 'bounceArrow 2s ease-in-out infinite',
      }}>SCROLL ↓</div>
    </section>
  );
}

// -------- IntroLoader --------
function IntroLoader({ onDone }) {
  const [phase, setPhase] = React.useState(0);
  React.useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 1550);
    const t3 = setTimeout(() => onDone(), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      background: 'var(--azul-gris)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 24,
      transform: phase === 2 ? 'translateY(-100%)' : 'translateY(0)',
      transition: 'transform 0.9s cubic-bezier(0.76,0,0.24,1)',
      overflow: 'hidden',
    }}>
      {/* Crosshair SVG */}
      <div style={{ opacity: phase >= 1 ? 1 : 0, transform: phase >= 1 ? 'scale(1)' : 'scale(0.95)', transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1)' }}>
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ animation: 'pulse 2s ease-in-out infinite' }}>
          <circle cx="24" cy="24" r="16" stroke="var(--altiplano)" strokeWidth="0.5" opacity="0.3" />
          <circle cx="24" cy="24" r="2" fill="var(--altiplano)" />
          <line x1="24" y1="4" x2="24" y2="16" stroke="var(--altiplano)" strokeWidth="0.5" opacity="0.5" />
          <line x1="24" y1="32" x2="24" y2="44" stroke="var(--altiplano)" strokeWidth="0.5" opacity="0.5" />
          <line x1="4" y1="24" x2="16" y2="24" stroke="var(--altiplano)" strokeWidth="0.5" opacity="0.5" />
          <line x1="32" y1="24" x2="44" y2="24" stroke="var(--altiplano)" strokeWidth="0.5" opacity="0.5" />
        </svg>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, opacity: phase >= 1 ? 1 : 0, transition: 'opacity 0.6s 0.2s' }}>
        <div style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10.5, color: 'var(--text-muted)', letterSpacing: '0.22em', textTransform: 'uppercase' }}>
          CALIBRANDO ESTACIÓN · ●●●○○ · LISTO
        </div>
        <div style={{ width: 220, height: 1, background: 'var(--azul-gris-3)', position: 'relative', overflow: 'hidden', marginTop: 8 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'var(--altiplano)', transformOrigin: 'left center', transform: 'scaleX(0)', animation: 'loaderFill 1.3s cubic-bezier(0.65,0,0.35,1) 0.2s forwards' }} />
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Nav, Hero, Ticker, SplitText, IntroLoader, GlobeMark });
