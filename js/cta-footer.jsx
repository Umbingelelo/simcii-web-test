
// CTA + Footer — SIMCII · Cordillera Cívica

function CTASection() {
  const [ref, visible] = window.useReveal();
  const [email, setEmail] = React.useState('');
  const [sent, setSent] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok || !data.ok) {
        setError(data.error || 'No se pudo enviar. Intenta nuevamente.');
        setSubmitting(false);
        return;
      }
      setSent(true);
    } catch (err) {
      setError('Sin conexión. Intenta nuevamente.');
      setSubmitting(false);
    }
  };

  return (
    <section id="demo" className="cta-section" ref={ref} style={{ padding: '80px 2.5rem 140px', maxWidth: 1320, margin: '0 auto' }}>
      <div className="cta-card" style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(30px)',
        transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)',
        background: 'var(--ink)',
        border: '1px solid var(--line-strong)',
        position: 'relative', overflow: 'hidden',
        padding: '96px 80px',
      }}>
        {/* Cordillera de 3 planos como pie del bloque (marca de contexto) */}
        <svg style={{ position: 'absolute', left: 0, right: 0, bottom: 0, width: '100%', height: 120, display: 'block' }} viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 90 L150 55 L300 78 L450 42 L600 80 L750 48 L900 82 L1050 58 L1200 84 L1200 120 L0 120 Z" fill="var(--gris-ciudad)" opacity="0.16" />
          <path d="M0 108 L150 80 L320 100 L470 70 L640 102 L800 74 L960 104 L1120 84 L1200 100 L1200 120 L0 120 Z" fill="var(--azul-deep)" opacity="0.5" />
          <path d="M0 120 L200 100 L380 116 L560 96 L720 118 L900 100 L1080 118 L1200 108 L1200 120 Z" fill="var(--terracota)" opacity="0.85" />
        </svg>

        <span className="corner-mark" style={{ position: 'absolute', top: 24, left: 24, fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--azul-claro)', letterSpacing: '0.2em' }}><window.SectionMark /> 09 · CONTACTO</span>
        <span className="corner-mark" style={{ position: 'absolute', top: 24, right: 24, fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--text-soft)', letterSpacing: '0.2em' }}>SIMCII · 2026</span>

        <div className="cta-grid" style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <h2 style={{
              fontFamily: 'Manrope, sans-serif', fontWeight: 800,
              fontSize: 'clamp(2rem, 3.8vw, 3.2rem)',
              letterSpacing: '-0.03em', color: 'var(--paper)',
              lineHeight: 1.0, marginBottom: 28, textWrap: 'balance',
            }}>
              Conoce el territorio <span style={{ color: 'var(--azul-claro)' }}>antes</span> de decidir.
            </h2>

            <p style={{
              fontFamily: 'Source Sans 3, sans-serif', fontWeight: 400,
              fontSize: 'clamp(1.05rem, 1.6vw, 1.25rem)',
              color: 'var(--text-muted)', lineHeight: 1.55, marginBottom: 0, textWrap: 'pretty', maxWidth: '42ch',
            }}>
              Agenda una demo de SIMCII y mira cómo monitorear lo ambiental, lo social y lo territorial con evidencia, en una sola plataforma.
            </p>
          </div>

          <div>
            {!sent ? (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <label htmlFor="cta-email" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--text-soft)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Correo corporativo</label>
                <input
                  id="cta-email"
                  type="email"
                  placeholder="tu@empresa.cl"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  style={{
                    fontFamily: 'Source Sans 3, sans-serif', fontSize: 16,
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid var(--line-strong)',
                    padding: '12px 0', color: 'var(--paper)',
                    outline: 'none',
                  }}
                  onFocus={e => e.target.style.borderBottomColor = 'var(--azul-claro)'}
                  onBlur={e => e.target.style.borderBottomColor = 'var(--line-strong)'}
                />
                <button type="submit" disabled={submitting} style={{
                  marginTop: 16,
                  fontFamily: 'Source Sans 3, sans-serif', fontWeight: 700, fontSize: 14,
                  background: submitting ? 'transparent' : 'var(--azul-civico)',
                  color: submitting ? 'var(--azul-claro)' : 'var(--paper)',
                  padding: '15px 27px', border: '1px solid var(--azul-civico)',
                  borderRadius: 2, cursor: submitting ? 'wait' : 'pointer', letterSpacing: '0.01em',
                  transition: 'all 0.25s',
                  alignSelf: 'flex-start',
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  opacity: submitting ? 0.7 : 1,
                }}
                onMouseEnter={e => { if (submitting) return; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--azul-claro)'; }}
                onMouseLeave={e => { if (submitting) return; e.currentTarget.style.background = 'var(--azul-civico)'; e.currentTarget.style.color = 'var(--paper)'; }}
                >
                  {submitting ? 'Enviando…' : 'Solicitar demo'}
                  {!submitting && <svg width="12" height="12" viewBox="0 0 10 10" fill="none"><path d="M1 5h8m-3-3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                </button>

                {error && (
                  <div role="alert" style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--terracota-deep)' }} />
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--terracota)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{error}</span>
                  </div>
                )}

                <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--azul-claro)' }} />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--text-soft)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Respondemos en 24 h hábiles</span>
                </div>
              </form>
            ) : (
              <div role="status" style={{ border: '1px solid var(--azul-claro)', padding: '32px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--azul-claro)' }} />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--azul-claro)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Recibido</span>
                </div>
                <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 18, fontWeight: 600, color: 'var(--paper)' }}>Gracias. Te contactaremos pronto.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer-root" style={{ borderTop: '1px solid var(--line)', padding: '72px 2.5rem 40px', background: 'var(--surface)' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>

        {/* Masthead */}
        <div className="footer-masthead" style={{ display: 'flex', alignItems: 'center', gap: 16, paddingBottom: 32, borderBottom: '1px solid var(--line-strong)', marginBottom: 48, flexWrap: 'wrap' }}>
          <window.Logo height={40} />
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--text-soft)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>Inteligencia territorial · por Accionet</span>
          <span style={{ flex: 1 }} />
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--text-soft)', letterSpacing: '0.18em' }}>2026</span>
        </div>

        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 64, marginBottom: 56, alignItems: 'start' }}>
          <div>
            <p style={{ fontFamily: 'Source Sans 3, sans-serif', fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: 560, textWrap: 'pretty', margin: 0 }}>
              Plataforma de monitoreo ambiental, social y territorial. Integra datos de estaciones, contexto y comunidad para gestionar compromisos, anticipar alertas y sostener la licencia social para operar — con evidencia.
            </p>
            <div style={{ marginTop: 28, display: 'flex', gap: 10 }}>
              {['LI', 'TW', 'YT'].map((s, i) => (
                <a key={i} href="#" aria-label={s} style={{ width: 36, height: 36, border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--azul-civico)'; e.currentTarget.style.borderColor = 'var(--azul-civico)'; e.currentTarget.querySelector('span').style.color = 'var(--paper)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.querySelector('span').style.color = 'var(--paper)'; }}
                >
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 500, color: 'var(--paper)', letterSpacing: '0.08em' }}>{s}</span>
                </a>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 500, color: 'var(--azul-claro)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 18, paddingBottom: 8, borderBottom: '1px solid var(--line)' }}>Soluciones</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Monitoreo ambiental', href: '/soluciones/monitoreo-ambiental' },
                { label: 'Relacionamiento comunitario', href: '/soluciones/relacionamiento-comunitario' },
                { label: 'Cumplimiento RCA', href: '/soluciones/cumplimiento-rca' },
                { label: 'Gestión territorial', href: '/soluciones/gestion-territorial' },
              ].map(l => (
                <li key={l.href}>
                  <a href={l.href} style={{ fontFamily: 'Source Sans 3, sans-serif', fontSize: 14, color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = 'var(--paper)'}
                    onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                  >{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 500, color: 'var(--azul-claro)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 18, paddingBottom: 8, borderBottom: '1px solid var(--line)' }}>Industrias</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Minería', href: '/industrias/mineria' },
                { label: 'Energía y renovables', href: '/industrias/energia' },
                { label: 'Salmonicultura', href: '/industrias/salmonicultura' },
                { label: 'Forestal', href: '/industrias/forestal' },
                { label: 'Proyectos inmobiliarios', href: '/industrias/inmobiliario' },
                { label: 'Sanitarias', href: '/industrias/sanitarias' },
                { label: 'Carreteras y concesiones', href: '/industrias/carreteras' },
                { label: 'Sector público', href: '/industrias/sector-publico' },
              ].map(l => (
                <li key={l.href}>
                  <a href={l.href} style={{ fontFamily: 'Source Sans 3, sans-serif', fontSize: 14, color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = 'var(--paper)'}
                    onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                  >{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 500, color: 'var(--azul-claro)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 18, paddingBottom: 8, borderBottom: '1px solid var(--line)' }}>Contacto</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <li>
                <a href="#demo" style={{ fontFamily: 'Source Sans 3, sans-serif', fontSize: 14, color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = 'var(--paper)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                >Solicitar una demo →</a>
              </li>
              <li>
                <a href="mailto:contacto@accionet.net" style={{ fontFamily: 'Source Sans 3, sans-serif', fontSize: 14, color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = 'var(--paper)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                >contacto@accionet.net</a>
              </li>
              <li style={{ fontFamily: 'Source Sans 3, sans-serif', fontSize: 14, color: 'var(--text-muted)' }}>Santiago · Chile</li>
            </ul>
          </div>
        </div>

        <div style={{ borderTop: '1px dashed var(--line)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--text-soft)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>© 2026 Accionet SpA · Santiago, Chile · Todos los derechos reservados</span>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Privacidad', 'Términos', 'Seguridad'].map(l => (
              <a key={l} href="#" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--text-soft)', textDecoration: 'none', letterSpacing: '0.14em', textTransform: 'uppercase', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'var(--paper)'}
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
