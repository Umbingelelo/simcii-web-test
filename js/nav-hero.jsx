
// Nav + Hero + Ticker — SIMCII "Tierra que se mide"
// Paleta: hueso · carbón · cobre · azafrán · liquen · cordillera

// -------- Logo mark: oficial SIMCII asset tintado sobre hueso --------
function LogoMark({ height = 40, dark = false }) {
  return (
    <img
      src="uploads/4.png"
      alt="SIMCII"
      style={{
        height, width: 'auto',
        // negro -> cobre con filtros
        filter: dark
          ? 'brightness(0) saturate(100%)'
          : 'brightness(0) saturate(100%) invert(26%) sepia(95%) saturate(2300%) hue-rotate(6deg) brightness(92%) contrast(95%)',
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
      background: scrolled ? 'rgba(244, 239, 230, 0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(16px) saturate(110%)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(16px) saturate(110%)' : 'none',
      borderBottom: scrolled ? '1px solid var(--line-claro)' : '1px solid transparent',
      transition: 'all 0.45s cubic-bezier(0.16,1,0.3,1)',
    }}>
      <div style={{ padding: '0 2.5rem', maxWidth: 1440, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>

        {/* Logo block */}
        <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none' }}>
          <LogoMark height={38} />
          <div style={{ borderLeft: '1px solid var(--line-claro)', paddingLeft: 14, display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 18, color: 'var(--carbon)', letterSpacing: '-0.02em', lineHeight: 1 }}>SIMCII</span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, color: 'var(--text-soft)', letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: 3 }}>Gestión Territorial</span>
          </div>
        </a>

        {/* Links */}
        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {links.map(l => {
            const isActive = active === l.id;
            return (
              <a key={l.label} href={l.href} style={{
                position: 'relative',
                fontFamily: 'Space Grotesk, sans-serif', fontSize: 13.5, fontWeight: 500,
                color: isActive ? 'var(--cobre)' : 'var(--text-muted)',
                textDecoration: 'none',
                padding: '8px 14px',
                letterSpacing: '-0.005em',
                transition: 'color 0.25s',
              }}
                onMouseEnter={e => !isActive && (e.target.style.color = 'var(--carbon)')}
                onMouseLeave={e => !isActive && (e.target.style.color = 'var(--text-muted)')}
              >
                {l.label}
                {isActive && <span style={{ position: 'absolute', left: 14, right: 14, bottom: 4, height: 1, background: 'var(--cobre)' }} />}
              </a>
            );
          })}
        </div>

        {/* Estado + CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="nav-status">
            <span style={{ position: 'relative', display: 'inline-block', width: 7, height: 7 }}>
              <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'var(--liquen)' }} />
              <span style={{ position: 'absolute', inset: -3, borderRadius: '50%', border: '1px solid var(--liquen)', animation: 'ringPulse 2s ease-out infinite' }} />
            </span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Red operativa</span>
          </div>

          <a href="#demo" style={{
            position: 'relative',
            fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 13,
            background: 'var(--cobre)', color: 'var(--hueso)',
            padding: '11px 20px', borderRadius: 2, textDecoration: 'none',
            transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
            letterSpacing: '0.01em', display: 'inline-flex', alignItems: 'center', gap: 8,
            boxShadow: '3px 3px 0 rgba(26,24,21,0.12)',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--cobre-2)'; e.currentTarget.style.transform = 'translate(-1px,-1px)'; e.currentTarget.style.boxShadow = '4px 4px 0 rgba(26,24,21,0.18)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--cobre)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '3px 3px 0 rgba(26,24,21,0.12)'; }}
          >Agendar conversación
            <svg width="11" height="11" viewBox="0 0 10 10" fill="none"><path d="M1 5h8m-3-3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </a>
        </div>
      </div>
    </nav>
  );
}

// -------- Ticker — etiquetas de indicadores (sin valores) --------
const TICKER_LABELS = [
  { label: 'Calidad del aire', color: 'var(--cordillera)' },
  { label: 'Material particulado', color: 'var(--cordillera)' },
  { label: 'Gases', color: 'var(--cordillera)' },
  { label: 'Calidad del agua', color: 'var(--cordillera)' },
  { label: 'Ruido ambiental', color: 'var(--cordillera)' },
  { label: 'Olores', color: 'var(--cordillera)' },
  { label: 'Satisfacción comunitaria', color: 'var(--liquen)' },
  { label: 'Percepción de impacto', color: 'var(--liquen)' },
  { label: 'Reportes ciudadanos', color: 'var(--azafran)' },
  { label: 'Asambleas activas', color: 'var(--azafran)' },
  { label: 'Compromisos', color: 'var(--liquen)' },
  { label: 'Empleo local', color: 'var(--liquen)' },
  { label: 'Cobertura de prensa', color: 'var(--cordillera)' },
  { label: 'Clima laboral', color: 'var(--liquen)' },
];

function Ticker() {
  const items = [...TICKER_LABELS, ...TICKER_LABELS];
  return (
    <div style={{ background: 'var(--hueso-2)', borderTop: '1px solid var(--line-claro)', borderBottom: '1px solid var(--line-claro)', overflow: 'hidden', padding: '12px 0', position: 'relative' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 60, background: 'linear-gradient(90deg, var(--hueso-2) 0%, transparent 100%)', zIndex: 2, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 60, background: 'linear-gradient(-90deg, var(--hueso-2) 0%, transparent 100%)', zIndex: 2, pointerEvents: 'none' }} />
      <div className="ticker-track">
        {items.map((item, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginRight: 44, whiteSpace: 'nowrap' }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10.5, color: 'var(--carbon)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{item.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// -------- Animaciones de texto --------
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

// Silueta de Chile abstracta como matriz de puntos sobre papel
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

    // Nodos abstractos — sin nombrar ciudades
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

          // Base: carbón tenue
          let alpha = 0.18;
          let rgb = '26, 24, 21'; // carbón

          // Proximidad a nodos → cobre
          nodes.forEach(n => {
            const d = Math.abs(ny - n.y);
            if (d < 0.04) {
              const local = 1 - d / 0.04;
              alpha = Math.max(alpha, 0.25 + local * 0.55);
              rgb = '194, 68, 14'; // cobre
            }
          });
          // Ola de escaneo
          const wave = (Math.sin(ny * 14 - t / 900) + 1) / 2;
          alpha += wave * 0.05;

          ctx.fillStyle = `rgba(${rgb}, ${alpha})`;
          ctx.beginPath();
          ctx.arc(x, y, dotSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Marcadores de nodo
      nodes.forEach(n => {
        const y = n.y * H;
        const cx = W / 2;
        const pulse = (Math.sin(t / 600) + 1) / 2;
        const baseR = n.kind === 'primary' ? 5 : 3;
        ctx.fillStyle = n.active ? '#C2440E' : 'rgba(26,24,21,0.35)';
        ctx.beginPath();
        ctx.arc(cx, y, baseR, 0, Math.PI * 2);
        ctx.fill();
        if (n.active) {
          ctx.strokeStyle = `rgba(194, 68, 14, ${(1 - pulse) * 0.5})`;
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

// Métrica abstracta — etiqueta + barra + estado, SIN números
function MetricRow({ label, state, color, fill }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px dashed var(--line-claro)', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, flexShrink: 0 }} />
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10.5, color: 'var(--carbon)', letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        {/* Mini bar abstracta */}
        <div style={{ width: 48, height: 3, background: 'rgba(26,24,21,0.08)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${fill}%`, background: color, transition: 'width 1.2s cubic-bezier(0.16,1,0.3,1)' }} />
        </div>
        <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, color: 'var(--text-muted)', fontStyle: 'italic' }}>{state}</span>
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
  const HH = String(now.getHours()).padStart(2,'0');
  const MM = String(now.getMinutes()).padStart(2,'0');

  return (
    <section id="top" style={{
      position: 'relative', minHeight: '100vh', overflow: 'hidden',
      paddingTop: 72,
      background: 'var(--hueso)',
    }}>
      {/* Líneas verticales sutiles tipo papel de manifiesto */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(90deg, var(--line-claro) 1px, transparent 1px)',
        backgroundSize: '88px 100%',
        opacity: 0.35,
      }} />

      {/* Masthead tipo periódico */}
      <div style={{ borderTop: '1px solid var(--line-claro)', borderBottom: '1px solid var(--line-claro)', padding: '10px 2.5rem', display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.18em', textTransform: 'uppercase', background: 'var(--hueso)' }}>
        <span>Boletín · Vol. II</span>
        <span style={{ color: 'var(--carbon)', letterSpacing: '0.32em', fontWeight: 600 }}>— Tierra que se mide —</span>
        <span style={{ display: 'flex', justifyContent: 'flex-end', gap: 18 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--liquen)', animation: 'blink 1.6s infinite' }} />En observación
          </span>
          <span style={{ color: 'var(--cobre)' }}>{HH}:{MM}</span>
        </span>
      </div>

      {/* Broadsheet layout */}
      <div style={{ position: 'relative', maxWidth: 1440, margin: '0 auto', padding: '72px 2.5rem 48px', display: 'grid', gridTemplateColumns: '260px 1fr 260px', gap: 56, alignItems: 'start' }}>

        {/* IZQUIERDA — Bitácora */}
        <aside style={{ opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateX(-20px)', transition: 'all 1s cubic-bezier(0.16,1,0.3,1) 0.8s' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--cobre)', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 20, height: 1, background: 'var(--cobre)' }} />
            Bitácora
          </div>

          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 14, color: 'var(--carbon)', lineHeight: 1.55, marginBottom: 28, textWrap: 'pretty', fontStyle: 'italic', fontWeight: 500, paddingLeft: 12, borderLeft: '2px solid var(--azafran)' }}>
            Lo que no se mide, se asume.
            <br />Lo que se asume, se pelea.
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, color: 'var(--text-soft)', marginTop: 10, fontStyle: 'normal', letterSpacing: '0.14em', textTransform: 'uppercase' }}>— Cuaderno de campo</div>
          </div>

          <MetricRow label="Aire"     state="estable"   color="var(--cordillera)" fill={fills[0]} />
          <MetricRow label="Agua"     state="dentro"    color="var(--cordillera)" fill={fills[1]} />
          <MetricRow label="Ruido"    state="por medir" color="var(--bruma)"      fill={fills[2]} />
          <MetricRow label="Clima social" state="cálido" color="var(--liquen)"    fill={fills[3]} />
          <MetricRow label="Compromisos" state="al día" color="var(--liquen)"    fill={fills[4]} />

          <div style={{ marginTop: 20, fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'var(--text-soft)', letterSpacing: '0.18em', textTransform: 'uppercase', lineHeight: 1.9 }}>
            Indicadores referenciales<br />
            <span style={{ color: 'var(--cobre)' }}>— visualización ilustrativa</span>
          </div>
        </aside>

        {/* CENTRO — manifiesto */}
        <div style={{ position: 'relative' }}>
          {/* Número de edición outline */}
          <div aria-hidden style={{ position: 'absolute', top: -40, right: -60, pointerEvents: 'none', opacity: loaded ? 0.9 : 0, transform: loaded ? 'none' : 'translateY(20px)', transition: 'all 1.2s cubic-bezier(0.16,1,0.3,1) 0.6s' }}>
            <div style={{
              fontFamily: 'Space Grotesk, sans-serif', fontWeight: 300,
              fontSize: 'clamp(100px, 15vw, 210px)',
              color: 'transparent',
              WebkitTextStroke: '1.5px rgba(194, 68, 14, 0.28)',
              letterSpacing: '-0.08em', lineHeight: 0.8,
              fontVariantNumeric: 'tabular-nums',
            }}>
              Nº
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.25em', textTransform: 'uppercase', textAlign: 'right', marginTop: -24 }}>Edición viva</div>
          </div>

          {/* Kicker */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 40, opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(10px)', transition: 'all 0.9s cubic-bezier(0.16,1,0.3,1)' }}>
            <span style={{ width: 28, height: 1, background: 'var(--cobre)' }} />
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--cobre)', letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 500 }}>Portada · Manifiesto</span>
          </div>

          {/* Headline monumental */}
          <h1 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(3rem, 7.2vw, 6.4rem)',
            fontWeight: 700, lineHeight: 0.96, letterSpacing: '-0.055em',
            color: 'var(--carbon)', marginBottom: 36, textWrap: 'balance',
            position: 'relative', zIndex: 2,
          }}>
            <SplitText text="Los territorios" delay={150} />
            <br />
            <span style={{ color: 'var(--text-soft)' }}>
              <SplitText text="no se leen," delay={300} />
            </span>
            <br />
            <span>
              <SplitText text="se " delay={500} />
              <span style={{ fontStyle: 'italic', fontWeight: 500, color: 'var(--cobre)', position: 'relative', display: 'inline-block' }}>
                <SplitText text="escuchan." delay={650} />
                {/* subrayado dibujado */}
                <svg style={{ position: 'absolute', left: 0, right: 0, bottom: -8, width: '100%', height: 12, pointerEvents: 'none' }} viewBox="0 0 200 12" preserveAspectRatio="none">
                  <path d="M2 8 Q 50 2, 100 7 T 198 6" stroke="var(--azafran)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </span>
          </h1>

          {/* Párrafo editorial con drop-cap */}
          <p style={{
            fontFamily: 'Inter, sans-serif', fontSize: 17, lineHeight: 1.72,
            color: 'var(--carbon)', marginBottom: 40, maxWidth: 620,
            textWrap: 'pretty',
            opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(12px)',
            transition: 'all 1s cubic-bezier(0.16,1,0.3,1) 1s',
          }}>
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 62, fontWeight: 700, color: 'var(--cobre)', float: 'left', lineHeight: 0.85, paddingRight: 12, paddingTop: 6, letterSpacing: '-0.04em' }}>S</span>
            IMCII convierte el ruido de un territorio en evidencia útil. Cruza{' '}
            <span
              onMouseEnter={() => setStrikeMode('amb')} onMouseLeave={() => setStrikeMode(null)}
              style={{ position: 'relative', color: 'var(--cordillera)', cursor: 'help', fontWeight: 500, borderBottom: '1px dotted var(--cordillera)' }}
            >
              lo que se mide
              {strikeMode === 'amb' && <span style={{ position: 'absolute', top: '-180%', left: 0, fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--hueso)', background: 'var(--cordillera)', padding: '5px 10px', borderRadius: 2, whiteSpace: 'nowrap', letterSpacing: '0.08em', textTransform: 'uppercase' }}>aire · agua · suelo · ruido · olores</span>}
            </span>
            {' '}con{' '}
            <span
              onMouseEnter={() => setStrikeMode('soc')} onMouseLeave={() => setStrikeMode(null)}
              style={{ position: 'relative', color: 'var(--liquen)', cursor: 'help', fontWeight: 500, borderBottom: '1px dotted var(--liquen)' }}
            >
              lo que se escucha
              {strikeMode === 'soc' && <span style={{ position: 'absolute', top: '-180%', left: 0, fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--hueso)', background: 'var(--liquen)', padding: '5px 10px', borderRadius: 2, whiteSpace: 'nowrap', letterSpacing: '0.08em', textTransform: 'uppercase' }}>comunidad · asambleas · prensa · percepción</span>}
            </span>
            {' '}— para que quienes deciden dejen de hacerlo{' '}
            <span style={{ textDecoration: 'line-through', color: 'var(--text-soft)' }}>a ciegas</span>{' '}
            <span style={{ color: 'var(--carbon)', fontWeight: 600, background: 'linear-gradient(180deg, transparent 60%, var(--azafran) 60%, var(--azafran) 92%, transparent 92%)', padding: '0 2px' }}>con el territorio, no sobre él</span>.
          </p>

          {/* CTAs editoriales */}
          <div style={{ display: 'flex', gap: 28, alignItems: 'center', opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(12px)', transition: 'all 1s cubic-bezier(0.16,1,0.3,1) 1.2s' }}>
            <a href="#demo" onClick={(e) => { e.preventDefault(); document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' }); }} style={{
              fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 14,
              background: 'var(--cobre)', color: 'var(--hueso)',
              padding: '16px 28px', borderRadius: 2, textDecoration: 'none',
              transition: 'all 0.25s', letterSpacing: '0.01em',
              display: 'inline-flex', alignItems: 'center', gap: 10,
              boxShadow: '4px 4px 0 var(--carbon)',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = '6px 6px 0 var(--carbon)'; e.currentTarget.style.background = 'var(--cobre-2)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '4px 4px 0 var(--carbon)'; e.currentTarget.style.background = 'var(--cobre)'; }}
            >
              Agendar una conversación
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h12m-5-5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </a>
            <a href="#problem" onClick={(e) => { e.preventDefault(); document.getElementById('problem')?.scrollIntoView({ behavior: 'smooth' }); }} style={{
              fontFamily: 'Space Grotesk, sans-serif', fontSize: 14, fontWeight: 500, fontStyle: 'italic',
              color: 'var(--carbon)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10,
              borderBottom: '1px solid var(--carbon)', paddingBottom: 4, transition: 'all 0.3s',
            }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--cobre)'; e.currentTarget.style.borderBottomColor = 'var(--cobre)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--carbon)'; e.currentTarget.style.borderBottomColor = 'var(--carbon)'; }}
            >
              o seguir leyendo ↓
            </a>
          </div>
        </div>

        {/* DERECHA — Chile en puntos */}
        <aside style={{ opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateX(20px)', transition: 'all 1s cubic-bezier(0.16,1,0.3,1) 1s', position: 'relative' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 18, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10 }}>
            Territorio
            <span style={{ width: 20, height: 1, background: 'var(--text-muted)' }} />
          </div>

          <div style={{ position: 'relative', height: 540, display: 'flex', justifyContent: 'center' }}>
            {/* Anotaciones abstractas — zonas, no ciudades */}
            {[
              { top: '14%', right: true,  label: 'Zona norte',  stat: 'en observación' },
              { top: '30%', right: false, label: 'Zona desierto', stat: 'por desplegar' },
              { top: '55%', right: true,  label: 'Zona central', stat: 'en escucha activa' },
              { top: '80%', right: false, label: 'Zona sur',     stat: 'próximamente' },
            ].map((a, i) => (
              <div key={i} style={{ position: 'absolute', top: a.top, [a.right ? 'right' : 'left']: 0, transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', alignItems: a.right ? 'flex-end' : 'flex-start', gap: 4, opacity: loaded ? 1 : 0, transition: `opacity 0.8s ease ${1.2 + i * 0.15}s` }}>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, fontWeight: 600, color: 'var(--carbon)', letterSpacing: '-0.01em' }}>{a.label}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexDirection: a.right ? 'row' : 'row-reverse' }}>
                  <span style={{ width: 16, height: 1, background: 'var(--cobre)', opacity: 0.6 }} />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', fontStyle: 'italic' }}>{a.stat}</span>
                </div>
              </div>
            ))}

            <div style={{ width: 130, height: '100%', position: 'relative' }}>
              <ChileDotStrip />
              <div className="chile-scan" style={{ position: 'absolute', left: -16, right: -16, height: 18, background: 'linear-gradient(180deg, transparent, rgba(194, 68, 14, 0.25), transparent)', pointerEvents: 'none' }} />
            </div>
          </div>

          <div style={{ marginTop: 14, fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'var(--text-soft)', letterSpacing: '0.18em', textAlign: 'center', lineHeight: 1.9, textTransform: 'uppercase' }}>
            Norte ↑<br />· · ·<br />Sur ↓
          </div>
        </aside>
      </div>

      {/* Navegación por capítulos */}
      <div style={{ position: 'relative', maxWidth: 1440, margin: '0 auto', padding: '32px 2.5rem 48px', borderTop: '1px solid var(--line-claro)', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, opacity: loaded ? 1 : 0, transition: 'opacity 1s ease 1.6s' }}>
        {[
          { n: '01', label: 'El problema', href: '#problem' },
          { n: '02', label: 'La plataforma', href: '#platform' },
          { n: '03', label: 'Cómo funciona', href: '#modules' },
          { n: '04', label: 'Territorio', href: '#casestudy' },
        ].map((c, i) => (
          <a key={i} href={c.href} onClick={(e) => { e.preventDefault(); document.querySelector(c.href)?.scrollIntoView({ behavior: 'smooth' }); }} style={{
            display: 'flex', flexDirection: 'column', gap: 8, textDecoration: 'none', color: 'inherit',
            padding: '14px 0', borderTop: '2px solid transparent', transition: 'all 0.3s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderTopColor = 'var(--cobre)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderTopColor = 'transparent'; }}
          >
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--cobre)', letterSpacing: '0.22em' }}>— {c.n}</span>
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 17, fontWeight: 500, color: 'var(--carbon)', letterSpacing: '-0.02em' }}>{c.label} <span style={{ opacity: 0.4, fontSize: 14 }}>→</span></span>
          </a>
        ))}
      </div>
    </section>
  );
}

// -------- IntroLoader sobre hueso --------
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
      background: 'var(--hueso)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 24,
      transform: phase === 2 ? 'translateY(-100%)' : 'translateY(0)',
      transition: 'transform 0.9s cubic-bezier(0.76,0,0.24,1)',
      overflow: 'hidden',
    }}>
      <div style={{ position: 'relative', opacity: phase >= 1 ? 1 : 0, transform: phase >= 1 ? 'scale(1)' : 'scale(0.95)', transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1)' }}>
        <LogoMark height={120} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, opacity: phase >= 1 ? 1 : 0, transition: 'opacity 0.6s 0.2s' }}>
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--carbon)' }}>SIMCII</div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10.5, color: 'var(--text-muted)', letterSpacing: '0.22em', textTransform: 'uppercase' }}>Tierra que se mide</div>
        <div style={{ width: 220, height: 1, background: 'var(--line-claro)', position: 'relative', overflow: 'hidden', marginTop: 8 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'var(--cobre)', transformOrigin: 'left center', transform: 'scaleX(0)', animation: 'loaderFill 1.3s cubic-bezier(0.65,0,0.35,1) 0.2s forwards' }} />
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Nav, Hero, Ticker, SplitText, IntroLoader });
