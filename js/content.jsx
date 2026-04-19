
// Problem, Modules, Sectors, Stats, FounderQuote — editorial light "tierra que se mide"

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

// Chapter label — numbered editorial marker
function ChapterLabel({ number, title }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 36 }}>
      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--cobre)', letterSpacing: '0.18em' }}>§ {number}</span>
      <span style={{ flex: 1, height: 1, background: 'var(--line-claro)' }} />
      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--text-soft)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>{title}</span>
    </div>
  );
}

// Geometric monoline icons — on light paper, stroke is carbón
function Icon({ name, size = 28, color = 'currentColor' }) {
  const s = { width: size, height: size, display: 'block' };
  const common = { fill: 'none', stroke: color, strokeWidth: 1.2, strokeLinecap: 'round', strokeLinejoin: 'round' };
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
      </svg>);
    case 'target':
      return (<svg viewBox="0 0 32 32" style={s} {...common}>
        <circle cx="16" cy="16" r="12" />
        <circle cx="16" cy="16" r="7" />
        <circle cx="16" cy="16" r="1.6" fill={color} stroke="none" />
      </svg>);
    default: return null;
  }
}

// -------- Problem: editorial spread, full-width, asymmetric --------
function Problem() {
  const [ref, visible] = useReveal();
  return (
    <section id="problem" ref={ref} style={{ padding: '140px 2.5rem 120px', maxWidth: 1320, margin: '0 auto', position: 'relative' }}>
      <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(30px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)' }}>
        <ChapterLabel number="I" title="El problema" />

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 100, alignItems: 'start' }}>
          <div>
            {/* Giant outlined quote mark */}
            <div style={{ fontFamily: 'Space Grotesk', fontWeight: 300, fontSize: 140, lineHeight: 0.6, color: 'transparent', WebkitTextStroke: '1px var(--cobre)', marginBottom: 8, marginLeft: -8 }}>«</div>

            <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(2rem, 3.8vw, 3.4rem)', fontWeight: 500, letterSpacing: '-0.03em', color: 'var(--carbon)', lineHeight: 1.08, marginBottom: 40, textWrap: 'balance' }}>
              Operar sobre un territorio <em style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--cobre)' }}>que no se mide</em> es decidir a ciegas.
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginTop: 48 }}>
              <p style={{ fontFamily: 'Inter', fontSize: 15, lineHeight: 1.7, color: 'var(--text-muted)', margin: 0, textWrap: 'pretty' }}>
                El aire, el agua, el ruido, la percepción de los vecinos — todo genera datos. Lo que falta rara vez es información. Lo que falta es tenerla a tiempo, en un mismo lugar, en un lenguaje comparable.
              </p>
              <p style={{ fontFamily: 'Inter', fontSize: 15, lineHeight: 1.7, color: 'var(--text-muted)', margin: 0, textWrap: 'pretty' }}>
                Para cuando un reporte anual detecta un conflicto, el conflicto ya pasó por tres asambleas, dos prensas y una madrugada de bloqueos.
              </p>
            </div>
          </div>

          {/* Marginalia card — founder quote treatment */}
          <aside style={{ borderLeft: '1px solid var(--line-claro)', paddingLeft: 36, paddingTop: 8 }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--text-soft)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 20 }}>Nota del fundador</div>
            <blockquote style={{ fontFamily: 'Space Grotesk', fontSize: 18, fontWeight: 400, lineHeight: 1.5, color: 'var(--carbon)', margin: 0, letterSpacing: '-0.01em', textWrap: 'pretty' }}>
              Hoy, gran parte de los datos clave para la toma de decisiones se encuentran dispersos, llegan con retraso o no son comparables, dificultando la anticipación de conflictos y la gestión eficiente de los territorios.
            </blockquote>
            <div style={{ marginTop: 28, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--cobre)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 13, color: 'var(--hueso)' }}>JF</span>
              </div>
              <div>
                <div style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: 'var(--carbon)' }}>Juan Fontaine Correa</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--text-soft)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Fundador · CEO</div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

// -------- Modules: two-column editorial spread --------
function ModuleBlock({ iconName, badge, title, lede, items, accent, number }) {
  return (
    <article style={{ position: 'relative' }}>
      <div style={{ fontFamily: 'Space Grotesk', fontWeight: 300, fontSize: 120, lineHeight: 0.7, color: 'transparent', WebkitTextStroke: `1px ${accent}`, marginBottom: 16, letterSpacing: '-0.04em' }}>{number}</div>

      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
        <span style={{ width: 22, height: 22, border: `1px solid ${accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent }}>
          <Icon name={iconName} size={12} color={accent} />
        </span>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: accent, letterSpacing: '0.16em', textTransform: 'uppercase' }}>{badge}</span>
      </div>

      <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 26, fontWeight: 600, color: 'var(--carbon)', letterSpacing: '-0.02em', marginBottom: 18, lineHeight: 1.2, textWrap: 'balance' }}>{title}</h3>
      <p style={{ fontFamily: 'Inter', fontSize: 14, lineHeight: 1.65, color: 'var(--text-muted)', marginBottom: 28, textWrap: 'pretty' }}>{lede}</p>

      <ul style={{ listStyle: 'none', padding: 0, margin: 0, borderTop: '1px solid var(--line-claro)' }}>
        {items.map((item, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: '14px 0', borderBottom: '1px dashed var(--line-claro)', fontFamily: 'Inter', fontSize: 13.5, color: 'var(--carbon)', lineHeight: 1.55 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--text-soft)', flexShrink: 0, marginTop: 2, minWidth: 22 }}>0{i + 1}</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function Modules() {
  const [ref, visible] = useReveal();
  return (
    <section id="modules" ref={ref} style={{ padding: '40px 2.5rem 140px', maxWidth: 1320, margin: '0 auto' }}>
      <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(30px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)' }}>
        <ChapterLabel number="II" title="Cómo funciona" />

        <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(2rem, 3.6vw, 3.2rem)', fontWeight: 500, letterSpacing: '-0.03em', color: 'var(--carbon)', lineHeight: 1.1, marginBottom: 80, maxWidth: 900, textWrap: 'balance' }}>
            Dos módulos. <em style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--cobre)' }}>Un mismo lente.</em>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, position: 'relative' }}>
          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'var(--line-claro)', transform: 'translateX(-40px)' }} />

          <ModuleBlock
            number="01"
            iconName="environmental"
            badge="Módulo ambiental"
            title="Monitoreo continuo del entorno natural"
            lede="Sensores distribuidos en el territorio registran aire, agua y ruido con georreferencia. La plataforma cruza variables para anticipar eventos críticos."
            accent="var(--liquen)"
            items={[
              'PM2.5 / PM10, gases y compuestos volátiles',
              'Calidad de aire y agua, ruido, olores',
              'Datos meteorológicos integrados en continuo',
              'Cruce de variables para anticipar eventos',
              'Alertas por umbrales normativos y operacionales',
            ]}
          />
          <ModuleBlock
            number="02"
            iconName="social"
            badge="Módulo social"
            title="Inteligencia comunitaria y territorial"
            lede="La percepción, los compromisos y la salud del vínculo con el entorno humano se miden con la misma continuidad que el aire."
            accent="var(--cobre)"
            items={[
              'Percepción y satisfacción comunitaria',
              'Necesidades en salud, educación y empleo local',
              'Seguimiento de conflictos socioambientales',
              'Gestión y trazabilidad de compromisos',
              'Paneles para ejecutivos, autoridades y terreno',
            ]}
          />
        </div>

        {/* Unifying note — editorial footer bar */}
        <div style={{ marginTop: 80, padding: '24px 0', borderTop: '1px solid var(--cobre)', borderBottom: '1px dashed var(--line-claro)', display: 'flex', alignItems: 'center', gap: 24 }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--cobre)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>∞ Integración</span>
          <p style={{ fontFamily: 'Space Grotesk', fontSize: 16, color: 'var(--carbon)', margin: 0, lineHeight: 1.4, textWrap: 'pretty' }}>
            Ambos módulos se integran en <em style={{ fontStyle: 'italic', color: 'var(--cobre)' }}>paneles visuales unificados</em> para la toma de decisiones estratégicas y operacionales.
          </p>
        </div>
      </div>
    </section>
  );
}

// -------- Sectors: horizontal editorial index --------
const SECTORS = [
  { icon: 'mining', label: 'Minería', desc: 'Monitoreo de faenas y comunidades aledañas' },
  { icon: 'energy', label: 'Energía y renovables', desc: 'Gestión territorial de proyectos de largo plazo' },
  { icon: 'infra', label: 'Infraestructura', desc: 'Seguimiento socioambiental en obra y operación' },
  { icon: 'forest', label: 'Forestal', desc: 'Impacto en ecosistemas y comunidades' },
  { icon: 'public', label: 'Sector público', desc: 'Gestión territorial para municipios y servicios' },
];

function SectorRow({ sector, index }) {
  const [hov, setHov] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'grid', gridTemplateColumns: '60px 40px 1fr 2fr 40px',
        alignItems: 'center', gap: 24,
        padding: '28px 8px',
        borderBottom: '1px solid var(--line-claro)',
        cursor: 'default',
        background: hov ? 'var(--hueso-2)' : 'transparent',
        transition: 'background 0.3s',
      }}>
      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--text-soft)', letterSpacing: '0.12em' }}>/ 0{index + 1}</span>
      <span style={{ color: hov ? 'var(--cobre)' : 'var(--carbon)', transition: 'color 0.3s' }}>
        <Icon name={sector.icon} size={28} />
      </span>
      <h4 style={{ fontFamily: 'Space Grotesk', fontSize: 20, fontWeight: 600, color: 'var(--carbon)', letterSpacing: '-0.015em', margin: 0 }}>{sector.label}</h4>
      <p style={{ fontFamily: 'Inter', fontSize: 14, color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>{sector.desc}</p>
      <span style={{ color: hov ? 'var(--cobre)' : 'var(--text-soft)', transition: 'all 0.3s', transform: hov ? 'translateX(4px)' : 'none', display: 'inline-block' }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 9h14m-5-5l5 5-5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </span>
    </div>
  );
}

function Sectors() {
  const [ref, visible] = useReveal();
  return (
    <section id="sectors" ref={ref} style={{ padding: '0 2.5rem 140px', maxWidth: 1320, margin: '0 auto' }}>
      <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(30px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)' }}>
        <ChapterLabel number="III" title="Sectores" />

        <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(1.9rem, 3.2vw, 2.8rem)', fontWeight: 500, letterSpacing: '-0.03em', color: 'var(--carbon)', textWrap: 'balance', maxWidth: 820, lineHeight: 1.1, marginBottom: 56 }}>
          Diseñado para industrias que operan en <em style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--cobre)' }}>territorios complejos</em>.
        </h2>

        <div style={{ borderTop: '1px solid var(--carbon)' }}>
          {SECTORS.map((s, i) => <SectorRow key={i} sector={s} index={i} />)}
        </div>
      </div>
    </section>
  );
}

// -------- Stats: editorial figures strip --------
const STATS = [
  { value: '02', label: 'Módulos integrados', sublabel: 'Ambiental + social' },
  { value: '24/7', label: 'Monitoreo continuo', sublabel: 'Sin interrupciones' },
  { value: '< 5\'', label: 'Latencia de datos', sublabel: 'Máximo en plataforma' },
  { value: 'ESG', label: 'Reportería continua', sublabel: 'No anual' },
];

function Stats() {
  const [ref, visible] = useReveal(0.3);
  return (
    <section ref={ref} style={{ background: 'var(--hueso-2)', borderTop: '1px solid var(--line-claro)', borderBottom: '1px solid var(--line-claro)', padding: '88px 2.5rem', marginBottom: 140, position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto', opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(20px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 40 }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--cobre)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>En cifras</span>
          <span style={{ flex: 1, height: 1, background: 'var(--line-claro)' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 48 }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ borderLeft: i === 0 ? 'none' : '1px solid var(--line-claro)', paddingLeft: i === 0 ? 0 : 32 }}>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(2.8rem, 4.8vw, 4.2rem)', fontWeight: 500, letterSpacing: '-0.04em', color: 'var(--carbon)', lineHeight: 1, fontVariantNumeric: 'tabular-nums', marginBottom: 16 }}>
                {s.value}
              </div>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: 15, fontWeight: 600, color: 'var(--carbon)', marginBottom: 4, letterSpacing: '-0.01em' }}>{s.label}</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--text-soft)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{s.sublabel}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// -------- Founder quote: pull quote editorial --------
function FounderQuote() {
  const [ref, visible] = useReveal();
  return (
    <section ref={ref} style={{ padding: '0 2.5rem 140px', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(30px)', transition: 'all 0.9s cubic-bezier(0.16,1,0.3,1)', display: 'grid', gridTemplateColumns: '120px 1fr', gap: 48, alignItems: 'start' }}>
        <div style={{ fontFamily: 'Space Grotesk', fontWeight: 300, fontSize: 180, lineHeight: 0.65, color: 'transparent', WebkitTextStroke: '1px var(--cobre)', textAlign: 'center' }}>«</div>
        <div>
          <p style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(1.6rem, 2.8vw, 2.3rem)', fontWeight: 400, letterSpacing: '-0.025em', color: 'var(--carbon)', lineHeight: 1.3, marginBottom: 40, textWrap: 'balance' }}>
            La innovación es llevar las métricas que las empresas ya dominan en producción y costos al <em style={{ fontStyle: 'italic', color: 'var(--cobre)' }}>ámbito social y medioambiental</em>, y convertirlas en indicadores estratégicos.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--cobre)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 15, color: 'var(--hueso)' }}>JF</span>
            </div>
            <div>
              <div style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 600, color: 'var(--carbon)' }}>Juan Fontaine Correa</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--text-soft)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Fundador · CEO · Accionet</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Problem, Modules, Sectors, Stats, FounderQuote, ChapterLabel, useReveal, Icon });
