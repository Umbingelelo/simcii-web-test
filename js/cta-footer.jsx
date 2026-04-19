
// CTA + Footer — editorial light "tierra que se mide"

function CTASection() {
  const [ref, visible] = window.useReveal();
  const [email, setEmail] = React.useState('');
  const [sent, setSent] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) setSent(true);
  };

  return (
    <section id="demo" ref={ref} style={{ padding: '80px 2.5rem 140px', maxWidth: 1320, margin: '0 auto' }}>
      <div style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(30px)',
        transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)',
        background: 'var(--obsidiana)',
        position: 'relative', overflow: 'hidden',
        padding: '96px 80px',
      }}>
        {/* Topographic line pattern */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.08 }} preserveAspectRatio="none" viewBox="0 0 1200 400">
          {[...Array(20)].map((_, i) => (
            <path key={i}
              d={`M0 ${200 + Math.sin(i * 0.6) * 80} Q${300 + i * 10} ${180 + Math.cos(i * 0.8) * 60}, ${600} ${200 + Math.sin(i * 0.4) * 90} T1200 ${200 + Math.cos(i * 0.5) * 70}`}
              fill="none" stroke="var(--cobre)" strokeWidth="0.5"
            />
          ))}
        </svg>

        {/* Corner marks */}
        <span style={{ position: 'absolute', top: 24, left: 24, fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'rgba(244,235,217,0.4)', letterSpacing: '0.2em' }}>◍ SIMCII</span>
        <span style={{ position: 'absolute', top: 24, right: 24, fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'rgba(244,235,217,0.4)', letterSpacing: '0.2em' }}>VOL · 01</span>

        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--cobre)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 24 }}>§ Epílogo · Agendar</div>

            <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(2rem, 3.8vw, 3.2rem)', fontWeight: 500, letterSpacing: '-0.03em', color: 'var(--hueso)', lineHeight: 1.1, marginBottom: 28, textWrap: 'balance' }}>
              Conoce lo que ocurre en tu territorio <em style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--cobre-2)' }}>antes de que sea tarde.</em>
            </h2>

            <p style={{ fontFamily: 'Inter', fontSize: 15, color: 'rgba(244,235,217,0.65)', lineHeight: 1.7, marginBottom: 0, textWrap: 'pretty' }}>
              Solicita una conversación y te mostramos cómo SIMCII puede transformar la gestión socioambiental de tu organización — sin comprometerte a nada.
            </p>
          </div>

          <div>
            {!sent ? (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <label style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'rgba(244,235,217,0.5)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Correo corporativo</label>
                <input
                  type="email"
                  placeholder="tu@empresa.cl"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={{
                    fontFamily: 'Inter', fontSize: 16,
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid rgba(244,235,217,0.3)',
                    padding: '12px 0', color: 'var(--hueso)',
                    outline: 'none',
                  }}
                  onFocus={e => e.target.style.borderBottomColor = 'var(--cobre-2)'}
                  onBlur={e => e.target.style.borderBottomColor = 'rgba(244,235,217,0.3)'}
                />
                <button type="submit" style={{
                  marginTop: 16,
                  fontFamily: 'Inter', fontWeight: 600, fontSize: 14,
                  background: 'var(--cobre)', color: 'var(--hueso)',
                  padding: '16px 28px', borderRadius: 2, border: 'none',
                  cursor: 'pointer', letterSpacing: '0.01em',
                  transition: 'all 0.25s',
                  alignSelf: 'flex-start',
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  boxShadow: '3px 3px 0 rgba(244,235,215,0.12)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--cobre-2)'; e.currentTarget.style.transform = 'translate(-1px,-1px)'; e.currentTarget.style.boxShadow = '4px 4px 0 rgba(244,235,215,0.18)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--cobre)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '3px 3px 0 rgba(244,235,215,0.12)'; }}
                >
                  Agendar conversación
                  <svg width="12" height="12" viewBox="0 0 10 10" fill="none"><path d="M1 5h8m-3-3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>

                <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--liquen)' }} />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'rgba(244,235,217,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Respondemos en 24 h hábiles</span>
                </div>
              </form>
            ) : (
              <div style={{ border: '1px solid var(--liquen)', padding: '32px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--liquen)' }} />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--liquen)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Recibido</span>
                </div>
                <span style={{ fontFamily: 'Space Grotesk', fontSize: 18, color: 'var(--hueso)' }}>Gracias. Te contactaremos pronto.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const links = {
    'Plataforma': ['Módulo ambiental', 'Módulo social', 'Paneles & KPIs', 'Alertas en continuo'],
    'Sectores': ['Minería', 'Energía y renovables', 'Infraestructura', 'Forestal', 'Sector público'],
    'Empresa': ['Acerca de Accionet', 'Casos de uso', 'Prensa', 'Contacto'],
  };
  return (
    <footer style={{ borderTop: '1px solid var(--line-claro)', padding: '72px 2.5rem 40px', background: 'var(--hueso-2)' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>

        {/* Masthead bar */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, paddingBottom: 32, borderBottom: '1px solid var(--carbon)', marginBottom: 48 }}>
          <span style={{ fontFamily: 'Space Grotesk', fontSize: 32, fontWeight: 600, color: 'var(--carbon)', letterSpacing: '-0.025em' }}>SIMCII</span>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--text-soft)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>Gestión territorial · por Accionet</span>
          <span style={{ flex: 1 }} />
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--text-soft)', letterSpacing: '0.18em' }}>MMXXV</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 64, marginBottom: 56 }}>
          <div>
            <p style={{ fontFamily: 'Space Grotesk', fontSize: 16, color: 'var(--carbon)', lineHeight: 1.5, maxWidth: 320, textWrap: 'pretty', margin: 0 }}>
              Plataforma chilena de inteligencia territorial. Una práctica de Accionet para industrias que operan donde el territorio importa.
            </p>
            <div style={{ marginTop: 28, display: 'flex', gap: 10 }}>
              {['LI', 'TW', 'YT'].map((s, i) => (
                <a key={i} href="#" style={{ width: 34, height: 34, border: '1px solid var(--line-claro)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--cobre)'; e.currentTarget.querySelector('span').style.color = 'var(--hueso)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.querySelector('span').style.color = 'var(--carbon)'; }}
                >
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 500, color: 'var(--carbon)', letterSpacing: '0.08em' }}>{s}</span>
                </a>
              ))}
            </div>
          </div>
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 500, color: 'var(--cobre)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 22, paddingBottom: 8, borderBottom: '1px solid var(--line-claro)' }}>{group}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {items.map(item => (
                  <li key={item}>
                    <a href="#" style={{ fontFamily: 'Inter', fontSize: 14, color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={e => e.target.style.color = 'var(--cobre)'}
                      onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                    >{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px dashed var(--line-claro)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--text-soft)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>© 2025 Accionet SpA · Santiago, Chile · Todos los derechos reservados</span>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Privacidad', 'Términos', 'Seguridad'].map(l => (
              <a key={l} href="#" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--text-soft)', textDecoration: 'none', letterSpacing: '0.14em', textTransform: 'uppercase', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'var(--cobre)'}
                onMouseLeave={e => e.target.style.color = 'var(--text-soft)'}
              >{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { CTASection, Footer });
