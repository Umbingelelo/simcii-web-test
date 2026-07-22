
// Problem · Modules · Sectors · Stats · FounderQuote — SIMCII Cordillera Cívica

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
      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--altiplano)', letterSpacing: '0.18em' }}><window.SectionMark /> {number}</span>
      <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--text-soft)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>{title}</span>
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
    case 'fish':
      return (<svg viewBox="0 0 32 32" style={s} {...common}>
        <path d="M4 16q8-8 18-4l6-4-2 8 2 8-6-4q-10 4-18-4z" />
        <circle cx="10" cy="15" r="1" fill={color} stroke="none" />
        <path d="M4 24q6 3 12 0" opacity=".4" />
      </svg>);
    case 'building':
      return (<svg viewBox="0 0 32 32" style={s} {...common}>
        <path d="M6 26V8l8-4v22M14 26V12l12 4v10M4 26h24" />
        <path d="M9 10h2M9 14h2M9 18h2M19 18h2M23 20h0M19 22h2" opacity=".5" />
      </svg>);
    case 'water':
      return (<svg viewBox="0 0 32 32" style={s} {...common}>
        <path d="M16 4q8 10 8 15a8 8 0 1 1-16 0q0-5 8-15z" />
        <path d="M12 20a4 4 0 0 0 4 4" opacity=".5" />
      </svg>);
    case 'road':
      return (<svg viewBox="0 0 32 32" style={s} {...common}>
        <path d="M10 28L14 4M22 28L18 4M4 28h24" />
        <path d="M16 8v3M16 15v3M16 22v3" opacity=".5" />
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

  return (
    <section id="problem" className="problem-section" ref={ref} style={{ padding: '160px 2.5rem', maxWidth: 1320, margin: '0 auto', position: 'relative', background: 'var(--azul-gris)' }}>
      <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(30px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)' }}>
        <ChapterLabel number="02" title="Principio" />

        <div style={{ maxWidth: 980, margin: '0 auto', position: 'relative' }}>
          {/* Quote mark decorative */}
          <span aria-hidden="true" style={{
            position: 'absolute', top: -40, left: -12,
            fontFamily: 'Manrope, sans-serif', fontWeight: 500,
            fontSize: 'clamp(5rem, 10vw, 9rem)', lineHeight: 1,
            color: 'var(--altiplano)', opacity: 0.35,
          }}>“</span>

          <blockquote className="problem-phrase" style={{
            fontFamily: 'Manrope, sans-serif', fontWeight: 500,
            fontSize: 'clamp(1.7rem, 3.6vw, 3rem)',
            lineHeight: 1.2, color: 'var(--hueso)',
            letterSpacing: '-0.02em',
            padding: '24px 0 0',
            textWrap: 'balance',
            margin: 0,
          }}>
            Las organizaciones están operando con información fragmentada, reportes tardíos y sin capacidad predictiva. <em style={{
              fontFamily: 'Manrope, sans-serif', 
              color: 'var(--altiplano)', fontWeight: 700,
            }}>SIMCII conecta lo que ocurre en el territorio</em>, y lo transforma en inteligencia territorial.
          </blockquote>
        </div>

      </div>
    </section>
  );
}

// -------- Modules: 4 cards --------
const MODULES = [
  {
    num: '04.1',
    title: 'Gestión social y',
    titleAccent: 'relacionamiento comunitario',
    desc: 'Registro estructurado de interacciones, compromisos y actividades en terreno.',
    categories: ['INTERACCIONES', 'COMPROMISOS', 'ACTIVIDADES EN TERRENO', 'EVIDENCIAS', 'ACTORES', 'TEMÁTICAS'],
    caption: 'Fig. 4.1 — Cada interacción documentada con evidencia y trazabilidad.',
    href: '/soluciones/relacionamiento-comunitario',
    linkLabel: 'Ver solución →',
  },
  {
    num: '04.2',
    title: 'Monitoreo',
    titleAccent: 'ambiental',
    desc: 'Integración de variables críticas en tiempo real para el seguimiento continuo del entorno.',
    categories: ['MP2.5 · 23 µg/m³', 'MP10 · 38 µg/m³', 'SO₂ · 12 ppb', 'RUIDO · 52 dB', 'SCORE 0–100', 'ESTACIONES IoT'],
    caption: 'Fig. 4.2 — Lecturas de referencia. Cada instalación genera sus propios valores.',
    href: '/soluciones/monitoreo-ambiental',
    linkLabel: 'Ver solución →',
  },
  {
    num: '04.3',
    title: 'Contexto',
    titleAccent: 'territorial',
    desc: 'Análisis de información pública, estudios privados, escucha digital y señales del entorno que permiten entender dinámicas sociales, económicas y regulatorias.',
    categories: ['INFORMACIÓN PÚBLICA', 'ESTUDIOS PRIVADOS', 'ESCUCHA DIGITAL', 'DINÁMICAS SOCIALES', 'DINÁMICAS ECONÓMICAS', 'SEÑALES REGULATORIAS'],
    caption: 'Fig. 4.3 — Lectura cruzada del entorno operacional.',
    href: '/soluciones/gestion-territorial',
    linkLabel: 'Ver solución →',
  },
  {
    num: '04.4',
    title: 'Dashboard ejecutivo e',
    titleAccent: 'inteligencia territorial',
    desc: 'Score territorial compuesto. Indicadores ajustables a la estrategia de cada organización. Una sola pantalla, todas las dimensiones.',
    categories: ['SCORE TERRITORIAL', 'ZONAS CRÍTICAS', 'INDICADORES COMPUESTOS', 'ALERTAS', 'REPORTES', 'EXPORTACIÓN'],
    caption: 'Fig. 4.4 — Visión consolidada para decisiones estratégicas.',
    href: 'https://exponor.simcii.ai',
    linkLabel: 'Verlo en vivo ↗',
    external: true,
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
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--altiplano)', marginBottom: 18 }}>
        <window.SectionMark /> {mod.num} · MÓDULO
      </div>
      <h3 style={{
        fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: 28,
        color: 'var(--hueso)', letterSpacing: '-0.02em', marginBottom: 18, lineHeight: 1.2,
      }}>
        {mod.title}{' '}
        <em style={{
          fontFamily: 'Manrope, sans-serif', 
          color: 'var(--altiplano)', fontWeight: 700,
        }}>{mod.titleAccent}</em>
      </h3>
      <p style={{ fontFamily: 'Source Sans 3, sans-serif', fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.55, marginBottom: 28 }}>
        {mod.desc}
      </p>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--altiplano)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 18, lineHeight: 2 }}>
        {mod.categories.map((cat, i) => (
          <span key={i}>
            {cat}
            {i < mod.categories.length - 1 && <span style={{ color: 'var(--text-quiet)' }}> · </span>}
          </span>
        ))}
      </div>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--text-soft)' }}>
        {mod.caption}
      </div>
      {mod.href && (
        <a href={mod.href} target={mod.external ? '_blank' : undefined} rel={mod.external ? 'noopener' : undefined} style={{
          display: 'inline-block', marginTop: 22,
          fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
          textTransform: 'uppercase', letterSpacing: '0.12em',
          color: hov ? 'var(--paper)' : 'var(--altiplano)', textDecoration: 'none',
          paddingBottom: 4, borderBottom: '1px solid var(--azul-claro)',
          transition: 'color 0.25s',
        }}>{mod.linkLabel}</a>
      )}
    </article>
  );
}

function Modules() {
  const [ref, visible] = useReveal();
  return (
    <section id="modules" className="modules-section" ref={ref} style={{ padding: '40px 2.5rem 140px', maxWidth: 1320, margin: '0 auto' }}>
      <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(30px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)' }}>
        <ChapterLabel number="04" title="Módulos" />

        <h2 style={{
          fontFamily: 'Manrope, sans-serif',
          fontSize: 'clamp(2rem, 3.6vw, 3.2rem)', fontWeight: 800,
         
          letterSpacing: '-0.025em', color: 'var(--hueso)',
          lineHeight: 1.05, marginBottom: 80, maxWidth: 900, textWrap: 'balance',
        }}>
          Una plataforma. <em style={{
            fontWeight: 400, color: 'var(--altiplano)',
           
          }}>Cuatro capacidades.</em>
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
  { icon: 'mining',   label: 'Minería',                 desc: 'Operaciones extractivas y su entorno comunitario.',            href: '/industrias/mineria' },
  { icon: 'energy',   label: 'Energía y renovables',    desc: 'Proyectos de generación y transmisión.',                       href: '/industrias/energia' },
  { icon: 'fish',     label: 'Salmonicultura',          desc: 'Centros de cultivo y su convivencia costera.',                 href: '/industrias/salmonicultura' },
  { icon: 'forest',   label: 'Forestal',                desc: 'Patrimonio, faenas y comunidades rurales.',                    href: '/industrias/forestal' },
  { icon: 'building', label: 'Proyectos inmobiliarios', desc: 'Obras, vecinos y compromisos de mitigación.',                  href: '/industrias/inmobiliario' },
  { icon: 'water',    label: 'Sanitarias',              desc: 'Plantas y redes en territorios urbanos.',                      href: '/industrias/sanitarias' },
  { icon: 'road',     label: 'Carreteras y concesiones', desc: 'Trazados largos, leídos tramo a tramo.',                      href: '/industrias/carreteras' },
  { icon: 'public',   label: 'Sector público',          desc: 'Fiscalización y planificación territorial.',                   href: '/industrias/sector-publico' },
];

function SectorCard({ sector }) {
  const [hov, setHov] = React.useState(false);
  return (
    <a
      href={sector.href}
      className="sector-card"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'block', textDecoration: 'none',
        background: 'var(--azul-gris-2)',
        border: `1px solid ${hov ? 'var(--altiplano)' : 'var(--line)'}`,
        padding: 32,
        transition: 'all 0.3s',
        transform: hov ? 'translate(-2px, -2px)' : 'none',
        boxShadow: hov ? '4px 4px 0 rgba(92,130,160,0.2)' : 'none',
      }}
    >
      <Icon name={sector.icon} size={32} color="var(--altiplano)" />
      <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: 22, color: 'var(--hueso)', marginTop: 16, marginBottom: 8, letterSpacing: '-0.01em' }}>
        {sector.label}
      </h3>
      <p style={{ fontFamily: 'Source Sans 3, sans-serif', fontSize: 14, color: 'var(--text-muted)', margin: '0 0 16px', lineHeight: 1.5 }}>
        {sector.desc}
      </p>
      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: hov ? 'var(--paper)' : 'var(--altiplano)', transition: 'color 0.25s' }}>
        Casos de uso →
      </span>
    </a>
  );
}

function Sectors() {
  const [ref, visible] = useReveal();
  return (
    <section id="sectors" className="sectors-section" ref={ref} style={{ padding: '0 2.5rem 140px', maxWidth: 1320, margin: '0 auto' }}>
      <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(30px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)' }}>
        <ChapterLabel number="07" title="Sectores" />

        <h2 style={{
          fontFamily: 'Manrope, sans-serif',
          fontSize: 'clamp(1.9rem, 3.2vw, 2.8rem)', fontWeight: 800,
         
          letterSpacing: '-0.025em', color: 'var(--hueso)', textWrap: 'balance',
          maxWidth: 820, lineHeight: 1.05, marginBottom: 56,
        }}>
          Diseñado para organizaciones con <em style={{
            fontWeight: 400, color: 'var(--altiplano)',
           
          }}>responsabilidad territorial</em>.
        </h2>

        <div className="sectors-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
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
    title: 'Alertas tempranas',
    desc: 'Señales del entorno que avisan a tiempo, para anticipar en vez de reaccionar.',
  },
];

function Stats() {
  const [ref, visible] = useReveal(0.3);
  return (
    <section ref={ref} className="diff-section" style={{ background: 'var(--azul-gris-2)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', padding: '88px 2.5rem', marginBottom: 140, position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto', opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(20px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)' }}>
        <ChapterLabel number="08" title="Diferenciadores" />

        <div className="diff-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 32 }}>
          {DIFFERENTIATORS.map((d, i) => (
            <div key={i} style={{ padding: '0 16px', borderLeft: i === 0 ? 'none' : '1px solid var(--line)', paddingLeft: i === 0 ? 0 : 32 }}>
              <div style={{ marginBottom: 20 }}>
                <Icon name={d.icon} size={32} color="var(--altiplano)" />
              </div>
              <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: 20, fontWeight: 700, color: 'var(--hueso)', marginBottom: 8, letterSpacing: '-0.01em' }}>{d.title}</div>
              <div style={{ fontFamily: 'Source Sans 3, sans-serif', fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.55 }}>{d.desc}</div>
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
        <ChapterLabel number="11" title="Promesa" />

        <div style={{ border: '1px solid var(--line-strong)', background: 'var(--surface)', padding: 'clamp(32px, 5vw, 56px)', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 'clamp(20px, 4vw, 48px)', alignItems: 'start' }} className="promise-plate">
          <svg width="56" height="40" viewBox="0 0 56 40" aria-hidden="true" style={{ flex: 'none', marginTop: 6 }}>
            <path d="M2 36L18 12l8 10L38 6l16 26" fill="none" stroke="var(--terracota)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
            <path d="M2 39h52" stroke="var(--line-strong)" strokeWidth="1" />
          </svg>
          <p style={{
            fontFamily: 'Manrope, sans-serif', fontWeight: 500,
            fontSize: 'clamp(1.4rem, 2.4vw, 2rem)',
            letterSpacing: '-0.025em', color: 'var(--hueso)',
            lineHeight: 1.3, textWrap: 'balance', margin: 0,
          }}>
            SIMCII transforma datos territoriales en{' '}
            <em style={{
              fontFamily: 'Manrope, sans-serif',
              color: 'var(--altiplano)', fontWeight: 700,
            }}>decisiones estratégicas</em>. Anticipa conflictos, mejora el relacionamiento y fortalece tu operación con{' '}
            <em style={{
              fontFamily: 'Manrope, sans-serif',
              color: 'var(--altiplano)', fontWeight: 700,
            }}>evidencia</em>.
          </p>
        </div>
      </div>
    </section>
  );
}

// -------- Method: De la señal a la decisión (4 pasos sobre perfil ascendente) --------
const METHOD_STEPS = [
  { key: 'Medir', desc: 'Sistemas automatizados capturan datos de estaciones, terreno y fuentes públicas, y los dejan en un solo lugar.' },
  { key: 'Leer', desc: 'La plataforma cruza los datos y los convierte en scores comparables de 0 a 100 por territorio.' },
  { key: 'Gestionar', desc: 'Stakeholders, compromisos, reclamos y registros de terreno en un solo flujo, con trazabilidad.' },
  { key: 'Anticipar', desc: 'Alertas tempranas y señales de tendencia para decidir antes de que el problema escale.' },
];

function Method() {
  const [ref, visible] = useReveal();
  return (
    <section id="method" className="method-section" ref={ref} style={{ padding: '0 2.5rem 140px', maxWidth: 1320, margin: '0 auto' }}>
      <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(30px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)' }}>
        <ChapterLabel number="03" title="Método" />

        <h2 style={{
          fontFamily: 'Manrope, sans-serif', fontSize: 'clamp(1.9rem, 3.2vw, 2.8rem)', fontWeight: 800,
          letterSpacing: '-0.025em', color: 'var(--hueso)', textWrap: 'balance',
          maxWidth: 820, lineHeight: 1.05, marginBottom: 16,
        }}>
          De la señal <em style={{ fontWeight: 400, color: 'var(--altiplano)' }}>a la decisión</em>.
        </h2>
        <p style={{ fontFamily: 'Source Sans 3, sans-serif', fontSize: 16, lineHeight: 1.6, color: 'var(--text-muted)', maxWidth: 640, marginBottom: 56, textWrap: 'pretty' }}>
          Toda la data, en una sola lectura. El territorio se sube por etapas — cada una deja evidencia para la siguiente.
        </p>

        {/* Perfil ascendente: el proceso se lee como subir terreno */}
        <svg className="method-profile" viewBox="0 0 1200 90" preserveAspectRatio="none" aria-hidden="true" style={{ display: 'block', width: '100%', height: 72, marginBottom: -8 }}>
          <polyline points="0,86 150,74 300,66 450,52 600,44 750,32 900,24 1050,12 1200,6" fill="none" stroke="var(--azul-deep)" strokeWidth="1.5" />
          <polyline points="0,88 150,80 310,74 460,62 610,54 760,44 910,36 1060,26 1200,20" fill="none" stroke="var(--gris-ciudad)" strokeWidth="1" opacity="0.35" />
          {[150, 450, 750, 1050].map((x, i) => (
            <circle key={i} cx={x} cy={[74, 52, 32, 12][i]} r="4" fill="var(--terracota)" />
          ))}
        </svg>

        <div className="method-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--line)', border: '1px solid var(--line-strong)' }}>
          {METHOD_STEPS.map((st, i) => (
            <div key={st.key} style={{ background: 'var(--surface)', padding: '28px 24px' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--altiplano)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 14 }}>
                <window.SectionMark /> Etapa {i + 1}
              </div>
              <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 24, color: 'var(--hueso)', letterSpacing: '-0.02em', marginBottom: 10 }}>{st.key}</h3>
              <p style={{ fontFamily: 'Source Sans 3, sans-serif', fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.55, margin: 0 }}>{st.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// -------- Security: defensa en profundidad + Ley 21.719 --------
const SECURITY_LAYERS = [
  { num: '01', title: 'Cifrado en el borde', desc: 'TLS 1.3 y HTTPS forzado en todo el tráfico.' },
  { num: '02', title: 'Red aislada', desc: 'Base de datos sin exposición pública; administración solo por VPN.' },
  { num: '03', title: 'Autenticación y permisos', desc: 'Sesiones JWT, contraseñas cifradas y control por rol y por fila.' },
  { num: '04', title: 'Aislamiento por cliente', desc: 'Los datos de cada organización viven segregados; el acceso es siempre vía API.' },
  { num: '05', title: 'Trazabilidad y respaldo', desc: 'Cifrado en tránsito y en reposo, retención definida y accesos auditables.' },
];

function Security() {
  const [ref, visible] = useReveal();
  return (
    <section id="security" className="security-section" ref={ref} style={{ padding: '0 2.5rem 140px', maxWidth: 1320, margin: '0 auto' }}>
      <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(30px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)' }}>
        <ChapterLabel number="09" title="Seguridad" />

        <div className="security-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 64, alignItems: 'start' }}>
          <div>
            <h2 style={{
              fontFamily: 'Manrope, sans-serif', fontSize: 'clamp(1.9rem, 3.2vw, 2.8rem)', fontWeight: 800,
              letterSpacing: '-0.025em', color: 'var(--hueso)', textWrap: 'balance', lineHeight: 1.05, marginBottom: 20,
            }}>
              Datos protegidos, plataforma <em style={{ fontWeight: 400, color: 'var(--altiplano)' }}>confiable</em>.
            </h2>
            <p style={{ fontFamily: 'Source Sans 3, sans-serif', fontSize: 16, lineHeight: 1.6, color: 'var(--text-muted)', textWrap: 'pretty', marginBottom: 24 }}>
              La información territorial y comunitaria es sensible por definición. La seguridad es un principio de diseño de SIMCII: cada capa de la plataforma aplica cifrado, aislamiento de datos y control de accesos.
            </p>
            <div style={{ border: '1px solid var(--line-strong)', background: 'var(--surface)', padding: '20px 24px' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--terracota)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 10 }}>Ley N° 21.719 · Protección de datos</div>
              <p style={{ fontFamily: 'Source Sans 3, sans-serif', fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.55, margin: 0 }}>
                Diseñada para operar en cumplimiento de la nueva Ley de Protección de Datos Personales de Chile: resguardo de datos sensibles, trazabilidad de accesos y protocolos de notificación.
              </p>
            </div>
          </div>

          <div>
            {SECURITY_LAYERS.map((l) => (
              <div key={l.num} style={{ display: 'flex', gap: 20, alignItems: 'baseline', borderTop: '1px solid var(--line)', padding: '18px 0' }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--altiplano)', letterSpacing: '0.1em', flex: 'none' }}>{l.num}</span>
                <div>
                  <div style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: 17, color: 'var(--hueso)', marginBottom: 4 }}>{l.title}</div>
                  <div style={{ fontFamily: 'Source Sans 3, sans-serif', fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.5 }}>{l.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// -------- Implementation: fases y acompañamiento --------
const IMPL_PHASES = [
  { phase: 'Fase 1', when: 'Semanas 1–2', title: 'Levantamiento y definición', desc: 'Mesas de trabajo con tu equipo: qué fuentes de datos se integran y qué indicadores importan a tu operación.' },
  { phase: 'Fase 2', when: 'Semanas 3–5', title: 'Integración y configuración', desc: 'Conexión de estaciones y fuentes, parametrización de scores, umbrales y alertas para tu territorio.' },
  { phase: 'Fase 3', when: 'Desde semana 6', title: 'Producción y acompañamiento', desc: 'Salida a producción con un jefe de proyecto dedicado como contraparte directa, en soporte permanente.' },
];

function Implementation() {
  const [ref, visible] = useReveal();
  return (
    <section id="implementation" className="impl-section" ref={ref} style={{ padding: '0 2.5rem 140px', maxWidth: 1320, margin: '0 auto' }}>
      <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(30px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)' }}>
        <ChapterLabel number="10" title="Implementación" />

        <h2 style={{
          fontFamily: 'Manrope, sans-serif', fontSize: 'clamp(1.9rem, 3.2vw, 2.8rem)', fontWeight: 800,
          letterSpacing: '-0.025em', color: 'var(--hueso)', textWrap: 'balance',
          maxWidth: 820, lineHeight: 1.05, marginBottom: 16,
        }}>
          Operativa en semanas, <em style={{ fontWeight: 400, color: 'var(--altiplano)' }}>no en trimestres</em>.
        </h2>
        <p style={{ fontFamily: 'Source Sans 3, sans-serif', fontSize: 16, lineHeight: 1.6, color: 'var(--text-muted)', maxWidth: 640, marginBottom: 48, textWrap: 'pretty' }}>
          Cada organización tiene un ecosistema de datos distinto. La implementación se co-construye — los plazos exactos se ajustan en el kick-off.
        </p>

        {/* Eje de tiempo: línea con hitos y flecha — la implementación es una secuencia real */}
        <svg className="impl-axis" viewBox="0 0 1200 24" preserveAspectRatio="none" aria-hidden="true" style={{ display: 'block', width: '100%', height: 24, marginBottom: 28 }}>
          <line x1="0" y1="12" x2="1188" y2="12" stroke="var(--line-strong)" strokeWidth="1.5" />
          <path d="M1188 6l10 6-10 6" fill="none" stroke="var(--line-strong)" strokeWidth="1.5" />
          {[8, 408, 808].map((x, i) => (
            <circle key={i} cx={x} cy="12" r="5" fill="var(--terracota)" />
          ))}
        </svg>

        <div className="impl-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 48 }}>
          {IMPL_PHASES.map((p) => (
            <div key={p.phase}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'baseline', marginBottom: 12 }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--altiplano)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>{p.phase}</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--text-soft)', letterSpacing: '0.12em' }}>{p.when}</span>
              </div>
              <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: 20, color: 'var(--hueso)', letterSpacing: '-0.01em', marginBottom: 10 }}>{p.title}</h3>
              <p style={{ fontFamily: 'Source Sans 3, sans-serif', fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.55, margin: 0 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Problem, Method, Modules, Sectors, Stats, Security, Implementation, FounderQuote, ChapterLabel, useReveal, Icon });
