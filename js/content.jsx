
// Problem, Modules, Sectors, Stats, FounderQuote — Bitácora Territorial

function useReveal(threshold = 0.15) {
  const ref = React.useRef(null);
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function ChapterLabel({ number, title }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 36 }}>
      <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 11, color: 'var(--altiplano)', letterSpacing: '0.18em' }}>§ {number}</span>
      <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
      <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10, color: 'var(--text-soft)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>{title}</span>
    </div>
  );
}

// Geometric monoline icons
function Icon({ name, size = 28, color = 'currentColor' }) {
  const s = { width: size, height: size, display: 'block' };
  const common = { fill: 'none', stroke: color, strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'environmental':
      return (<svg viewBox="0 0 32 32" style={s} {...common}>
        <circle cx="16" cy="16" r="12" />
        <path d="M4 16q6-6 12 0t12 0" />
        <path d="M4 16q6 6 12 0t12 0" opacity=".4" />
        <circle cx="16" cy="16" r="1.6" fill={color} stroke="none" />
      </svg>);
    case 'social':
      return (<svg viewBox="0 0 32 32" style={s} {...common}>
        <circle cx="10" cy="10" r="2.5" />
        <circle cx="22" cy="10" r="2.5" />
        <circle cx="10" cy="22" r="2.5" />
        <circle cx="22" cy="22" r="2.5" />
        <path d="M13 10h6M10 13v6M22 13v6M13 22h6M13 13l6 6M19 13l-6 6" opacity=".35" />
      </svg>);
    case 'mining':
      return (<svg viewBox="0 0 32 32" style={s} {...common}>
        <path d="M6 26l8-14 4 6 8-10" />
        <path d="M6 26h20" />
        <circle cx="26" cy="8" r="1.2" fill={color} stroke="none" />
      </svg>);
    case 'energy':
      return (<svg viewBox="0 0 32 32" style={s} {...common}>
        <path d="M16 4v8h-6l4 16v-8h6L16 4z" />
      </svg>);
    case 'infra':
      return (<svg viewBox="0 0 32 32" style={s} {...common}>
        <path d="M4 26h24M6 26V12l10-6 10 6v14" />
        <path d="M12 26v-8h8v8" />
      </svg>);
    case 'forest':
      return (<svg viewBox="0 0 32 32" style={s} {...common}>
        <path d="M16 4l-8 12h4l-6 8h20l-6-8h4z" />
        <path d="M16 24v4" />
      </svg>);
    case 'public':
      return (<svg viewBox="0 0 32 32" style={s} {...common}>
        <path d="M4 26h24M6 26V14M26 26V14M10 26V14M14 26V14M18 26V14M22 26V14" />
        <path d="M4 14l12-8 12 8" />
      </svg>);
    case 'consulting':
      return (<svg viewBox="0 0 32 32" style={s} {...common}>
        <circle cx="16" cy="12" r="8" />
        <path d="M22 18l4 8H6l4-8" />
        <path d="M12 12h8M16 8v8" opacity=".5" />
      </svg>);
    case 'pulse':
      return (<svg viewBox="0 0 32 32" style={s} {...common}>
        <path d="M2 16h8l2-6 4 12 2-6 2 4 2-2h8" />
      </svg>);
    case 'clock':
      return (<svg viewBox="0 0 32 32" style={s} {...common}>
        <circle cx="16" cy="16" r="12" />
        <path d="M16 8v8l5 3" />
      </svg>);
    case 'layers':
      return (<svg viewBox="0 0 32 32" style={s} {...common}>
        <path d="M16 4l12 7-12 7-12-7 12-7z" />
        <path d="M4 17l12 7 12-7" />
        <path d="M4 22l12 7 12-7" opacity=".4" />
      </svg>);
    case 'target':
      return (<svg viewBox="0 0 32 32" style={s} {...common}>
        <circle cx="16" cy="16" r="12" />
        <circle cx="16" cy="16" r="7" />
        <circle cx="16" cy="16" r="1.6" fill={color} stroke="none" />
        <path d="M16 4v4M16 24v4M4 16h4M24 16h4" opacity=".4" />
      </svg>);
    default: return null;
  }
}

// -------- Problem: editorial manifesto --------
function Problem() {
  const [ref, visible] = useReveal();
  const phrases = [
    'Lo que no se mide, no existe en el territorio.',
    'El reporte anual ya no es suficiente.',
    'La evidencia llega antes que el conflicto.',
  ];

  return (
    <section id="problem" className="problem-section" ref={ref} style={{ padding: '160px 2.5rem', maxWidth: 1320, margin: '0 auto', position: 'relative', background: 'var(--azul-gris)' }}>
      <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(30px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)' }}>
        <ChapterLabel number="02" title="Principio" />

        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          {phrases.map((phrase, i) => (
            <div key={i}>
              <p className="problem-phrase" style={{
                fontFamily: 'Newsreader, serif', fontWeight: 300,
                fontSize: 'clamp(2rem, 4.5vw, 4rem)',
                lineHeight: 1.05, color: 'var(--hueso)',
                letterSpacing: '-0.025em',
                padding: '40px 0',
              }}>{phrase}</p>
              {i < phrases.length - 1 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0' }}>
                  <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 14, color: 'var(--altiplano)' }}>—</span>
                  <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Marquee */}
        <div style={{ marginTop: 80, borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', padding: '24px 0', overflow: 'hidden', position: 'relative' }}>
          <div className="ticker-track" style={{ fontFamily: 'Geist Mono, monospace', fontSize: 14, color: 'var(--altiplano)', opacity: 0.5, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
            {'SIN DATOS · NO HAY SOSTENIBILIDAD · '.repeat(12)}
          </div>
        </div>
      </div>
    </section>
  );
}

// -------- Modules: 4 cards --------
const MODULES = [
  {
    num: '03.1',
    title: 'Gestión social y',
    titleAccent: 'relacionamiento comunitario',
    desc: 'Reuniones, actividades, compromisos y acuerdos georreferenciados. La memoria viva del vínculo con el territorio.',
    categories: ['INTERACCIONES', 'COMPROMISOS', 'CONFLICTIVIDAD', 'EVIDENCIAS', 'ACTORES', 'TEMÁTICAS'],
    caption: 'Fig. 3.1 — Cada interacción documentada con evidencia y trazabilidad.',
  },
  {
    num: '03.2',
    title: 'Monitoreo',
    titleAccent: 'ambiental',
    desc: 'Sensores y estaciones que entregan lecturas continuas. Tendencias, desviaciones y eventos cruzados con la operación.',
    categories: ['PM2.5 · 23 µg/m³', 'AQI · 47', 'COV · 0.18 ppm', 'VIENTO SO 4.2 m/s', 'pH 7.4 · TURB 1.1 NTU', 'RUIDO 52 dB'],
    caption: 'Fig. 3.2 — Lecturas de referencia. Cada instalación genera sus propios valores.',
  },
  {
    num: '03.3',
    title: 'Monitoreo de',
    titleAccent: 'percepción y redes',
    desc: 'Escucha digital estructurada por territorio, actores, temas y tono. Detecta tendencias antes de que escalen.',
    categories: ['MENCIONES', 'SENTIMIENTO', 'ACTORES INFLUYENTES', 'TENDENCIAS', 'CRISIS POTENCIALES', 'TÓPICOS'],
    caption: 'Fig. 3.3 — Clasificación automática por taxonomía territorial.',
  },
  {
    num: '03.4',
    title: 'Dashboard ejecutivo e',
    titleAccent: 'inteligencia territorial',
    desc: 'Score territorial compuesto. Indicadores ajustables a la estrategia de cada organización. Una sola pantalla, todas las dimensiones.',
    categories: ['SCORE TERRITORIAL', 'ZONAS CRÍTICAS', 'INDICADORES COMPUESTOS', 'ALERTAS', 'RECOMENDACIONES', 'AGENTE DE CONSULTA'],
    caption: 'Fig. 3.4 — Visión consolidada para decisiones estratégicas.',
  },
];

function ModuleCard({ mod }) {
  const [hov, setHov] = React.useState(false);
  return (
    <article
      className="module-card"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? 'var(--azul-gris-3)' : 'var(--azul-gris-2)',
        border: `1px solid ${hov ? 'var(--line-strong)' : 'var(--line)'}`,
        padding: 40,
        transition: 'all 0.3s',
      }}
    >
      <div style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--altiplano)', marginBottom: 18 }}>
        § {mod.num} · MÓDULO
      </div>
      <h3 style={{
        fontFamily: 'Newsreader, serif', fontWeight: 500, fontSize: 28,
        color: 'var(--hueso)', letterSpacing: '-0.02em', marginBottom: 18, lineHeight: 1.2,
      }}>
        {mod.title}{' '}
        <em style={{
          fontFamily: 'Newsreader, serif', fontStyle: 'italic',
          fontVariationSettings: '"opsz" 36', color: 'var(--altiplano)', fontWeight: 400,
        }}>{mod.titleAccent}</em>
      </h3>
      <p style={{ fontFamily: 'Geist, sans-serif', fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.55, marginBottom: 28 }}>
        {mod.desc}
      </p>
      <div style={{ fontFamily: 'Geist Mono, monospace', fontSize: 11, color: 'var(--altiplano)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 18, lineHeight: 2 }}>
        {mod.categories.map((cat, i) => (
          <span key={i}>
            {cat}
            {i < mod.categories.length - 1 && <span style={{ color: 'var(--text-quiet)' }}> · </span>}
          </span>
        ))}
      </div>
      <div style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10, color: 'var(--text-soft)' }}>
        {mod.caption}
      </div>
    </article>
  );
}

function Modules() {
  const [ref, visible] = useReveal();
  return (
    <section id="modules" className="modules-section" ref={ref} style={{ padding: '40px 2.5rem 140px', maxWidth: 1320, margin: '0 auto' }}>
      <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(30px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)' }}>
        <ChapterLabel number="03" title="Módulos" />

        <h2 style={{
          fontFamily: 'Newsreader, serif',
          fontSize: 'clamp(2rem, 3.6vw, 3.2rem)', fontWeight: 400,
          fontVariationSettings: '"opsz" 72',
          letterSpacing: '-0.025em', color: 'var(--hueso)',
          lineHeight: 1.05, marginBottom: 80, maxWidth: 900, textWrap: 'balance',
        }}>
          Cuatro módulos. <em style={{
            fontStyle: 'italic', fontWeight: 400, color: 'var(--altiplano)',
            fontVariationSettings: '"opsz" 36',
          }}>Un mismo lente.</em>
        </h2>

        <div className="modules-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {MODULES.map((mod, i) => <ModuleCard key={i} mod={mod} />)}
        </div>
      </div>
    </section>
  );
}

// -------- Sectors: 3x2 grid --------
const SECTORS = [
  { icon: 'mining',      label: 'Minería',                desc: 'Operaciones extractivas y su entorno comunitario.' },
  { icon: 'energy',      label: 'Energía y renovables',   desc: 'Proyectos de generación y transmisión.' },
  { icon: 'infra',       label: 'Infraestructura',        desc: 'Obras públicas e inversión privada.' },
  { icon: 'forest',      label: 'Forestal',               desc: 'Manejo y plantaciones.' },
  { icon: 'public',      label: 'Sector público',         desc: 'Fiscalización y planificación territorial.' },
  { icon: 'consulting',  label: 'Consultoría e I+D',      desc: 'Asesoría especializada.' },
];

function SectorCard({ sector }) {
  const [hov, setHov] = React.useState(false);
  return (
    <div
      className="sector-card"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: 'var(--azul-gris-2)',
        border: `1px solid ${hov ? 'var(--altiplano)' : 'var(--line)'}`,
        padding: 32,
        transition: 'all 0.3s',
        transform: hov ? 'translate(-2px, -2px)' : 'none',
        boxShadow: hov ? '4px 4px 0 rgba(110,240,255,0.2)' : 'none',
      }}
    >
      <Icon name={sector.icon} size={32} color="var(--altiplano)" />
      <h4 style={{ fontFamily: 'Newsreader, serif', fontWeight: 500, fontSize: 22, color: 'var(--hueso)', marginTop: 16, marginBottom: 8, letterSpacing: '-0.01em' }}>
        {sector.label}
      </h4>
      <p style={{ fontFamily: 'Geist, sans-serif', fontSize: 14, color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
        {sector.desc}
      </p>
    </div>
  );
}

function Sectors() {
  const [ref, visible] = useReveal();
  return (
    <section id="sectors" className="sectors-section" ref={ref} style={{ padding: '0 2.5rem 140px', maxWidth: 1320, margin: '0 auto' }}>
      <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(30px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)' }}>
        <ChapterLabel number="05" title="Sectores" />

        <h2 style={{
          fontFamily: 'Newsreader, serif',
          fontSize: 'clamp(1.9rem, 3.2vw, 2.8rem)', fontWeight: 400,
          fontVariationSettings: '"opsz" 72',
          letterSpacing: '-0.025em', color: 'var(--hueso)', textWrap: 'balance',
          maxWidth: 820, lineHeight: 1.05, marginBottom: 56,
        }}>
          Diseñado para industrias que operan en <em style={{
            fontStyle: 'italic', fontWeight: 400, color: 'var(--altiplano)',
            fontVariationSettings: '"opsz" 36',
          }}>territorios complejos</em>.
        </h2>

        <div className="sectors-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {SECTORS.map((s, i) => <SectorCard key={i} sector={s} />)}
        </div>
      </div>
    </section>
  );
}

// -------- Stats: qualitative differentiators --------
const DIFFERENTIATORS = [
  {
    icon: 'layers',
    title: 'Integración heterogénea',
    desc: 'Cuatro fuentes en un solo hub: terreno, ambiente, digital, documental.',
  },
  {
    icon: 'clock',
    title: 'Trazabilidad completa',
    desc: 'Cada dato con su origen, fecha y contexto. Auditable de extremo a extremo.',
  },
  {
    icon: 'pulse',
    title: 'Indicadores comparables',
    desc: 'Score territorial ajustable. Lo que importa, medible en el tiempo.',
  },
  {
    icon: 'target',
    title: 'Potencial predictivo',
    desc: 'Modelos que anticipan conflictos antes de que sean visibles.',
  },
];

function Stats() {
  const [ref, visible] = useReveal(0.3);
  return (
    <section ref={ref} className="diff-section" style={{ background: 'var(--azul-gris-2)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', padding: '88px 2.5rem', marginBottom: 140, position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto', opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(20px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)' }}>
        <ChapterLabel number="06" title="Diferenciadores" />

        <div className="diff-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 32 }}>
          {DIFFERENTIATORS.map((d, i) => (
            <div key={i} style={{ padding: '0 16px', borderLeft: i === 0 ? 'none' : '1px solid var(--line)', paddingLeft: i === 0 ? 0 : 32 }}>
              <div style={{ marginBottom: 20 }}>
                <Icon name={d.icon} size={32} color="var(--altiplano)" />
              </div>
              <div style={{ fontFamily: 'Newsreader, serif', fontSize: 20, fontWeight: 500, color: 'var(--hueso)', marginBottom: 8, letterSpacing: '-0.01em' }}>{d.title}</div>
              <div style={{ fontFamily: 'Geist, sans-serif', fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.55 }}>{d.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// -------- Founder quote: brand manifesto (no attribution) --------
function FounderQuote() {
  const [ref, visible] = useReveal();
  return (
    <section ref={ref} className="founder-section" style={{ padding: '0 2.5rem 140px', maxWidth: 1100, margin: '0 auto', background: 'var(--azul-gris)' }}>
      <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(30px)', transition: 'all 0.9s cubic-bezier(0.16,1,0.3,1)' }}>
        <ChapterLabel number="08" title="Manifiesto" />

        <p style={{
          fontFamily: 'Newsreader, serif', fontWeight: 300,
          fontSize: 'clamp(1.6rem, 2.8vw, 2.3rem)',
          letterSpacing: '-0.025em', color: 'var(--hueso)',
          lineHeight: 1.3, textWrap: 'balance',
        }}>
          La innovación es llevar las métricas que las empresas ya dominan en producción y costos al{' '}
          <em style={{
            fontFamily: 'Newsreader, serif', fontStyle: 'italic',
            fontVariationSettings: '"opsz" 36', color: 'var(--altiplano)', fontWeight: 400,
          }}>ámbito social y medioambiental</em>, y convertirlas en{' '}
          <em style={{
            fontFamily: 'Newsreader, serif', fontStyle: 'italic',
            fontVariationSettings: '"opsz" 36', color: 'var(--altiplano)', fontWeight: 400,
          }}>indicadores estratégicos</em>.
        </p>
      </div>
    </section>
  );
}

Object.assign(window, { Problem, Modules, Sectors, Stats, FounderQuote, ChapterLabel, useReveal, Icon });
