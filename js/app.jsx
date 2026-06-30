
// Root App — SIMCII · Cordillera Cívica

function App() {
  const [introDone, setIntroDone] = React.useState(() => {
    try { return sessionStorage.getItem('simcii_intro_seen') === '1'; } catch { return false; }
  });

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
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
