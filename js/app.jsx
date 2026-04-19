
// Root App + Tweaks panel

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accentColor": "cobre",
  "showIntro": true
}/*EDITMODE-END*/;

function TweaksPanel({ visible }) {
  const [accent, setAccent] = React.useState(TWEAK_DEFAULTS.accentColor);

  React.useEffect(() => {
    const map = {
      cobre:     { main: '#C2440E', hover: '#D95A22' },
      azafran:   { main: '#C88A1E', hover: '#E8B14A' },
      liquen:    { main: '#5C7548', hover: '#7A8F5E' },
      cordillera:{ main: '#3B5E6B', hover: '#547584' },
    };
    const c = map[accent] || map.cobre;
    document.documentElement.style.setProperty('--cobre', c.main);
    document.documentElement.style.setProperty('--cobre-2', c.hover);
    document.documentElement.style.setProperty('--accent', c.main);
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { accentColor: accent } }, '*');
  }, [accent]);

  if (!visible) return null;

  const accents = [
    { key: 'cobre',      label: 'Cobre',      color: '#C2440E' },
    { key: 'azafran',    label: 'Azafrán',    color: '#E8B14A' },
    { key: 'liquen',     label: 'Liquen',     color: '#5C7548' },
    { key: 'cordillera', label: 'Cordillera', color: '#3B5E6B' },
  ];

  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      background: 'var(--hueso)', border: '1px solid var(--carbon)',
      padding: '20px 22px', width: 240, boxShadow: '6px 6px 0 rgba(26,24,21,0.12)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, paddingBottom: 10, borderBottom: '1px solid var(--line-claro)' }}>
        <span style={{ fontFamily: 'Space Grotesk', fontSize: 13, fontWeight: 600, color: 'var(--carbon)', letterSpacing: '-0.01em' }}>Tweaks</span>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'var(--text-soft)', letterSpacing: '0.18em' }}>V · 01</span>
      </div>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, color: 'var(--text-muted)', marginBottom: 12, letterSpacing: '0.16em', textTransform: 'uppercase' }}>Color de firma</div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        {accents.map(a => (
          <button key={a.key} onClick={() => setAccent(a.key)} title={a.label} style={{
            width: 30, height: 30, background: a.color,
            border: accent === a.key ? '2px solid var(--carbon)' : '1px solid var(--line-claro)',
            cursor: 'pointer', transition: 'all 0.2s',
            transform: accent === a.key ? 'translate(-1px,-1px)' : 'none',
            boxShadow: accent === a.key ? '2px 2px 0 rgba(26,24,21,0.2)' : 'none',
          }} />
        ))}
      </div>
      <div style={{ fontFamily: 'Space Grotesk', fontSize: 12, fontStyle: 'italic', color: 'var(--text-muted)' }}>
        {accents.find(a => a.key === accent)?.label}
      </div>
    </div>
  );
}

function App() {
  const [tweaksVisible, setTweaksVisible] = React.useState(false);
  const [introDone, setIntroDone] = React.useState(() => {
    try { return sessionStorage.getItem('simcii_intro_seen') === '1'; } catch { return false; }
  });

  React.useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === '__activate_edit_mode') setTweaksVisible(true);
      if (e.data?.type === '__deactivate_edit_mode') setTweaksVisible(false);
    };
    window.addEventListener('message', handler);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  React.useEffect(() => {
    if (introDone) document.body.style.overflow = '';
    else document.body.style.overflow = 'hidden';
  }, [introDone]);

  return (
    <div>
      {!introDone && <IntroLoader onDone={() => { setIntroDone(true); try { sessionStorage.setItem('simcii_intro_seen', '1'); } catch {} }} />}
      <Nav />
      <main>
        <Hero introDone={introDone} />
        <Ticker />
        <Problem />
        <Modules />
        <PlatformMap />
        <Sectors />
        <Stats />
        <CaseStudy />
        <FounderQuote />
        <CTASection />
      </main>
      <Footer />
      <TweaksPanel visible={tweaksVisible} />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
