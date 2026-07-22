// Root App — SIMCII · Cordillera Cívica

function App() {
  const [introDone, setIntroDone] = React.useState(() => {
    try {
      return sessionStorage.getItem('simcii_intro_seen') === '1';
    } catch {
      return false;
    }
  });
  React.useEffect(() => {
    if (introDone) document.body.style.overflow = '';else document.body.style.overflow = 'hidden';
  }, [introDone]);
  return /*#__PURE__*/React.createElement("div", null, !introDone && /*#__PURE__*/React.createElement(IntroLoader, {
    onDone: () => {
      setIntroDone(true);
      try {
        sessionStorage.setItem('simcii_intro_seen', '1');
      } catch {}
    }
  }), /*#__PURE__*/React.createElement(Nav, null), /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement(Hero, {
    introDone: introDone
  }), /*#__PURE__*/React.createElement(Ticker, null), /*#__PURE__*/React.createElement(Problem, null), /*#__PURE__*/React.createElement(Method, null), /*#__PURE__*/React.createElement(Modules, null), /*#__PURE__*/React.createElement(PlatformMap, null), /*#__PURE__*/React.createElement(CaseStudy, null), /*#__PURE__*/React.createElement(Sectors, null), /*#__PURE__*/React.createElement(Stats, null), /*#__PURE__*/React.createElement(Security, null), /*#__PURE__*/React.createElement(Implementation, null), /*#__PURE__*/React.createElement(FounderQuote, null), /*#__PURE__*/React.createElement(CTASection, null)), /*#__PURE__*/React.createElement(Footer, null));
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(/*#__PURE__*/React.createElement(App, null));