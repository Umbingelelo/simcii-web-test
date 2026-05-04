
// CTA + Footer — Bitácora Territorial

function CTASection() {
  const [ref, visible] = window.useReveal();
  const [email, setEmail] = React.useState('');
  const [sent, setSent] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) setSent(true);
  };

  return (
    <section id="demo" className="cta-section" ref={ref} style={{ padding: '80px 2.5rem 140px', maxWidth: 1320, margin: '0 auto' }}>
      <div className="cta-card" style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(30px)',
        transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)',
        background: 'var(--tinta)',
        position: 'relative', overflow: 'hidden',
        padding: '96px 80px',
      }}>
        {/* Topographic line pattern */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.08 }} preserveAspectRatio="none" viewBox="0 0 1200 400">
          {[...Array(20)].map((_, i) => (
            <path key={i}
              d={`M0 ${200 + Math.sin(i * 0.6) * 80} Q${300 + i * 10} ${180 + Math.cos(i * 0.8) * 60}, ${600} ${200 + Math.sin(i * 0.4) * 90} T1200 ${200 + Math.cos(i * 0.5) * 70}`}
              fill="none" stroke="var(--altiplano)" strokeWidth="0.5"
            />
          ))}
        </svg>

        {/* Corner marks */}
        <span className="corner-mark" style={{ position: 'absolute', top: 24, left: 24, fontFamily: 'Geist Mono, monospace', fontSize: 10, color: 'rgba(110,240,255,0.4)', letterSpacing: '0.2em' }}>◍ SIMCII</span>
        <span className="corner-mark" style={{ position: 'absolute', top: 24, right: 24, fontFamily: 'Geist Mono, monospace', fontSize: 10, color: 'var(--text-soft)', letterSpacing: '0.2em' }}>VOL · 01</span>

        <div className="cta-grid" style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10, color: 'var(--altiplano)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 24 }}>§ 07 · EPÍLOGO</div>

            <h2 style={{
              fontFamily: 'Newsreader, serif', fontWeight: 400,
              fontSize: 'clamp(2rem, 3.8vw, 3.2rem)',
              fontVariationSettings: '"opsz" 72',
              letterSpacing: '-0.025em', color: 'var(--hueso)',
              lineHeight: 1.05, marginBottom: 28, textWrap: 'balance',
            }}>
              Observar antes que reportar.
            </h2>

            <p style={{
              fontFamily: 'Newsreader, serif', fontStyle: 'italic',
              fontVariationSettings: '"opsz" 36',
              fontSize: 'clamp(1.1rem, 1.8vw, 1.5rem)',
              color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: 0, textWrap: 'pretty',
            }}>
              Empieza a leer tu territorio en tiempo real.
            </p>
          </div>

          <div>
            {!sent ? (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <label style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10, color: 'var(--text-soft)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Correo corporativo</label>
                <input
                  type="email"
                  placeholder="tu@empresa.cl"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={{
                    fontFamily: 'Geist, sans-serif', fontSize: 16,
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid var(--line-strong)',
                    padding: '12px 0', color: 'var(--hueso)',
                    outline: 'none',
                  }}
                  onFocus={e => e.target.style.borderBottomColor = 'var(--altiplano)'}
                  onBlur={e => e.target.style.borderBottomColor = 'var(--line-strong)'}
                />
                <button type="submit" style={{
                  marginTop: 16,
                  fontFamily: 'Geist, sans-serif', fontWeight: 600, fontSize: 14,
                  background: 'var(--altiplano)', color: 'var(--azul-gris)',
                  padding: '15px 27px', border: '1px solid var(--altiplano)',
                  borderRadius: 2, cursor: 'pointer', letterSpacing: '0.01em',
                  transition: 'all 0.25s',
                  alignSelf: 'flex-start',
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--altiplano)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--altiplano)'; e.currentTarget.style.color = 'var(--azul-gris)'; }}
                >
                  Agendar conversación
                  <svg width="12" height="12" viewBox="0 0 10 10" fill="none"><path d="M1 5h8m-3-3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>

                <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--fosforo)' }} />
                  <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10, color: 'var(--text-soft)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Respondemos en 24 h hábiles</span>
                </div>
              </form>
            ) : (
              <div style={{ border: '1px solid var(--fosforo)', padding: '32px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--fosforo)' }} />
                  <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10, color: 'var(--fosforo)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Recibido</span>
                </div>
                <span style={{ fontFamily: 'Newsreader, serif', fontSize: 18, color: 'var(--hueso)' }}>Gracias. Te contactaremos pronto.</span>
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
    <footer className="footer-root" style={{ borderTop: '1px solid var(--line)', padding: '72px 2.5rem 40px', background: 'var(--azul-gris-2)' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>

        {/* Masthead bar */}
        <div className="footer-masthead" style={{ display: 'flex', alignItems: 'center', gap: 16, paddingBottom: 32, borderBottom: '1px solid var(--line-strong)', marginBottom: 48, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <window.GlobeMark size={36} />
            <span style={{ fontFamily: 'Newsreader, serif', fontSize: 32, fontWeight: 600, color: 'var(--hueso)', letterSpacing: '-0.025em' }}>SIMCII</span>
          </div>
          <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 11, color: 'var(--text-soft)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>Gestión territorial · por Accionet</span>
          <span style={{ flex: 1 }} />
          <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 11, color: 'var(--text-soft)', letterSpacing: '0.18em' }}>MMXXVI</span>
        </div>

        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 64, marginBottom: 56 }}>
          <div>
            <p style={{ fontFamily: 'Geist, sans-serif', fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.5, maxWidth: 320, textWrap: 'pretty', margin: 0 }}>
              Plataforma chilena de inteligencia territorial. Una práctica de Accionet para industrias y administraciones que operan donde el territorio importa.
            </p>
            <div style={{ marginTop: 28, display: 'flex', gap: 10 }}>
              {['LI', 'TW', 'YT'].map((s, i) => (
                <a key={i} href="#" style={{ width: 34, height: 34, border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--altiplano)'; e.currentTarget.querySelector('span').style.color = 'var(--azul-gris)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.querySelector('span').style.color = 'var(--hueso)'; }}
                >
                  <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10, fontWeight: 500, color: 'var(--hueso)', letterSpacing: '0.08em' }}>{s}</span>
                </a>
              ))}
            </div>
          </div>
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <div style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10, fontWeight: 500, color: 'var(--altiplano)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 22, paddingBottom: 8, borderBottom: '1px solid var(--line)' }}>{group}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {items.map(item => (
                  <li key={item}>
                    <a href="#" style={{ fontFamily: 'Geist, sans-serif', fontSize: 14, color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={e => e.target.style.color = 'var(--hueso)'}
                      onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                    >{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px dashed var(--line)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10, color: 'var(--text-soft)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>© 2026 Accionet SpA · Santiago, Chile · Todos los derechos reservados</span>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Privacidad', 'Términos', 'Seguridad'].map(l => (
              <a key={l} href="#" style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10, color: 'var(--text-soft)', textDecoration: 'none', letterSpacing: '0.14em', textTransform: 'uppercase', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'var(--hueso)'}
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
