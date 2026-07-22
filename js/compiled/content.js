function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Problem · Modules · Sectors · Stats · FounderQuote — SIMCII Cordillera Cívica

function useReveal(threshold = 0.15) {
  const ref = React.useRef(null);
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setVisible(true);
        obs.disconnect();
      }
    }, {
      threshold
    });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}
function ChapterLabel({
  number,
  title
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 16,
      marginBottom: 36
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 11,
      color: 'var(--altiplano)',
      letterSpacing: '0.18em'
    }
  }, /*#__PURE__*/React.createElement(window.SectionMark, null), " ", number), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      height: 1,
      background: 'var(--line)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 10,
      color: 'var(--text-soft)',
      letterSpacing: '0.2em',
      textTransform: 'uppercase'
    }
  }, title));
}

// Geometric monoline icons
function Icon({
  name,
  size = 28,
  color = 'currentColor'
}) {
  const s = {
    width: size,
    height: size,
    display: 'block'
  };
  const common = {
    fill: 'none',
    stroke: color,
    strokeWidth: 1.5,
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  };
  switch (name) {
    case 'environmental':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 32 32",
        style: s
      }, common), /*#__PURE__*/React.createElement("circle", {
        cx: "16",
        cy: "16",
        r: "12"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M4 16q6-6 12 0t12 0"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M4 16q6 6 12 0t12 0",
        opacity: ".4"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "16",
        cy: "16",
        r: "1.6",
        fill: color,
        stroke: "none"
      }));
    case 'social':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 32 32",
        style: s
      }, common), /*#__PURE__*/React.createElement("circle", {
        cx: "10",
        cy: "10",
        r: "2.5"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "22",
        cy: "10",
        r: "2.5"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "10",
        cy: "22",
        r: "2.5"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "22",
        cy: "22",
        r: "2.5"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M13 10h6M10 13v6M22 13v6M13 22h6M13 13l6 6M19 13l-6 6",
        opacity: ".35"
      }));
    case 'fish':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 32 32",
        style: s
      }, common), /*#__PURE__*/React.createElement("path", {
        d: "M4 16q8-8 18-4l6-4-2 8 2 8-6-4q-10 4-18-4z"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "10",
        cy: "15",
        r: "1",
        fill: color,
        stroke: "none"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M4 24q6 3 12 0",
        opacity: ".4"
      }));
    case 'building':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 32 32",
        style: s
      }, common), /*#__PURE__*/React.createElement("path", {
        d: "M6 26V8l8-4v22M14 26V12l12 4v10M4 26h24"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M9 10h2M9 14h2M9 18h2M19 18h2M23 20h0M19 22h2",
        opacity: ".5"
      }));
    case 'water':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 32 32",
        style: s
      }, common), /*#__PURE__*/React.createElement("path", {
        d: "M16 4q8 10 8 15a8 8 0 1 1-16 0q0-5 8-15z"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 20a4 4 0 0 0 4 4",
        opacity: ".5"
      }));
    case 'road':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 32 32",
        style: s
      }, common), /*#__PURE__*/React.createElement("path", {
        d: "M10 28L14 4M22 28L18 4M4 28h24"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M16 8v3M16 15v3M16 22v3",
        opacity: ".5"
      }));
    case 'mining':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 32 32",
        style: s
      }, common), /*#__PURE__*/React.createElement("path", {
        d: "M6 26l8-14 4 6 8-10"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M6 26h20"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "26",
        cy: "8",
        r: "1.2",
        fill: color,
        stroke: "none"
      }));
    case 'energy':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 32 32",
        style: s
      }, common), /*#__PURE__*/React.createElement("path", {
        d: "M16 4v8h-6l4 16v-8h6L16 4z"
      }));
    case 'infra':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 32 32",
        style: s
      }, common), /*#__PURE__*/React.createElement("path", {
        d: "M4 26h24M6 26V12l10-6 10 6v14"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 26v-8h8v8"
      }));
    case 'forest':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 32 32",
        style: s
      }, common), /*#__PURE__*/React.createElement("path", {
        d: "M16 4l-8 12h4l-6 8h20l-6-8h4z"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M16 24v4"
      }));
    case 'public':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 32 32",
        style: s
      }, common), /*#__PURE__*/React.createElement("path", {
        d: "M4 26h24M6 26V14M26 26V14M10 26V14M14 26V14M18 26V14M22 26V14"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M4 14l12-8 12 8"
      }));
    case 'consulting':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 32 32",
        style: s
      }, common), /*#__PURE__*/React.createElement("circle", {
        cx: "16",
        cy: "12",
        r: "8"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M22 18l4 8H6l4-8"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 12h8M16 8v8",
        opacity: ".5"
      }));
    case 'pulse':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 32 32",
        style: s
      }, common), /*#__PURE__*/React.createElement("path", {
        d: "M2 16h8l2-6 4 12 2-6 2 4 2-2h8"
      }));
    case 'clock':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 32 32",
        style: s
      }, common), /*#__PURE__*/React.createElement("circle", {
        cx: "16",
        cy: "16",
        r: "12"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M16 8v8l5 3"
      }));
    case 'layers':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 32 32",
        style: s
      }, common), /*#__PURE__*/React.createElement("path", {
        d: "M16 4l12 7-12 7-12-7 12-7z"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M4 17l12 7 12-7"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M4 22l12 7 12-7",
        opacity: ".4"
      }));
    case 'target':
      return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 32 32",
        style: s
      }, common), /*#__PURE__*/React.createElement("circle", {
        cx: "16",
        cy: "16",
        r: "12"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "16",
        cy: "16",
        r: "7"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "16",
        cy: "16",
        r: "1.6",
        fill: color,
        stroke: "none"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M16 4v4M16 24v4M4 16h4M24 16h4",
        opacity: ".4"
      }));
    default:
      return null;
  }
}

// -------- Problem: editorial manifesto --------
function Problem() {
  const [ref, visible] = useReveal();
  return /*#__PURE__*/React.createElement("section", {
    id: "problem",
    className: "problem-section",
    ref: ref,
    style: {
      padding: '160px 2.5rem',
      maxWidth: 1320,
      margin: '0 auto',
      position: 'relative',
      background: 'var(--azul-gris)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : 'translateY(30px)',
      transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)'
    }
  }, /*#__PURE__*/React.createElement(ChapterLabel, {
    number: "02",
    title: "Principio"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 980,
      margin: '0 auto',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      top: -40,
      left: -12,
      fontFamily: 'Manrope, sans-serif',
      fontWeight: 500,
      fontSize: 'clamp(5rem, 10vw, 9rem)',
      lineHeight: 1,
      color: 'var(--altiplano)',
      opacity: 0.35
    }
  }, "\u201C"), /*#__PURE__*/React.createElement("blockquote", {
    className: "problem-phrase",
    style: {
      fontFamily: 'Manrope, sans-serif',
      fontWeight: 500,
      fontSize: 'clamp(1.7rem, 3.6vw, 3rem)',
      lineHeight: 1.2,
      color: 'var(--hueso)',
      letterSpacing: '-0.02em',
      padding: '24px 0 0',
      textWrap: 'balance',
      margin: 0
    }
  }, "Las organizaciones est\xE1n operando con informaci\xF3n fragmentada, reportes tard\xEDos y sin capacidad predictiva. ", /*#__PURE__*/React.createElement("em", {
    style: {
      fontFamily: 'Manrope, sans-serif',
      color: 'var(--altiplano)',
      fontWeight: 700
    }
  }, "SIMCII conecta lo que ocurre en el territorio"), ", y lo transforma en inteligencia territorial."))));
}

// -------- Modules: 4 cards --------
const MODULES = [{
  num: '04.1',
  title: 'Gestión social y',
  titleAccent: 'relacionamiento comunitario',
  desc: 'Registro estructurado de interacciones, compromisos y actividades en terreno.',
  categories: ['INTERACCIONES', 'COMPROMISOS', 'ACTIVIDADES EN TERRENO', 'EVIDENCIAS', 'ACTORES', 'TEMÁTICAS'],
  caption: 'Fig. 4.1 — Cada interacción documentada con evidencia y trazabilidad.',
  href: '/soluciones/relacionamiento-comunitario',
  linkLabel: 'Ver solución →'
}, {
  num: '04.2',
  title: 'Monitoreo',
  titleAccent: 'ambiental',
  desc: 'Integración de variables críticas en tiempo real para el seguimiento continuo del entorno.',
  categories: ['MP2.5 · 23 µg/m³', 'MP10 · 38 µg/m³', 'SO₂ · 12 ppb', 'RUIDO · 52 dB', 'SCORE 0–100', 'ESTACIONES IoT'],
  caption: 'Fig. 4.2 — Lecturas de referencia. Cada instalación genera sus propios valores.',
  href: '/soluciones/monitoreo-ambiental',
  linkLabel: 'Ver solución →'
}, {
  num: '04.3',
  title: 'Contexto',
  titleAccent: 'territorial',
  desc: 'Análisis de información pública, estudios privados, escucha digital y señales del entorno que permiten entender dinámicas sociales, económicas y regulatorias.',
  categories: ['INFORMACIÓN PÚBLICA', 'ESTUDIOS PRIVADOS', 'ESCUCHA DIGITAL', 'DINÁMICAS SOCIALES', 'DINÁMICAS ECONÓMICAS', 'SEÑALES REGULATORIAS'],
  caption: 'Fig. 4.3 — Lectura cruzada del entorno operacional.',
  href: '/soluciones/gestion-territorial',
  linkLabel: 'Ver solución →'
}, {
  num: '04.4',
  title: 'Dashboard ejecutivo e',
  titleAccent: 'inteligencia territorial',
  desc: 'Score territorial compuesto. Indicadores ajustables a la estrategia de cada organización. Una sola pantalla, todas las dimensiones.',
  categories: ['SCORE TERRITORIAL', 'ZONAS CRÍTICAS', 'INDICADORES COMPUESTOS', 'ALERTAS', 'REPORTES', 'EXPORTACIÓN'],
  caption: 'Fig. 4.4 — Visión consolidada para decisiones estratégicas.',
  href: 'https://exponor.simcii.ai',
  linkLabel: 'Verlo en vivo ↗',
  external: true
}];
function ModuleCard({
  mod
}) {
  const [hov, setHov] = React.useState(false);
  return /*#__PURE__*/React.createElement("article", {
    className: "module-card",
    onMouseEnter: () => setHov(true),
    onMouseLeave: () => setHov(false),
    style: {
      background: hov ? 'var(--azul-gris-3)' : 'var(--azul-gris-2)',
      border: `1px solid ${hov ? 'var(--line-strong)' : 'var(--line)'}`,
      padding: 40,
      transition: 'all 0.3s'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 10,
      textTransform: 'uppercase',
      letterSpacing: '0.18em',
      color: 'var(--altiplano)',
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement(window.SectionMark, null), " ", mod.num, " \xB7 M\xD3DULO"), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'Manrope, sans-serif',
      fontWeight: 700,
      fontSize: 28,
      color: 'var(--hueso)',
      letterSpacing: '-0.02em',
      marginBottom: 18,
      lineHeight: 1.2
    }
  }, mod.title, ' ', /*#__PURE__*/React.createElement("em", {
    style: {
      fontFamily: 'Manrope, sans-serif',
      color: 'var(--altiplano)',
      fontWeight: 700
    }
  }, mod.titleAccent)), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'Source Sans 3, sans-serif',
      fontSize: 15,
      color: 'var(--text-muted)',
      lineHeight: 1.55,
      marginBottom: 28
    }
  }, mod.desc), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 11,
      color: 'var(--altiplano)',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      marginBottom: 18,
      lineHeight: 2
    }
  }, mod.categories.map((cat, i) => /*#__PURE__*/React.createElement("span", {
    key: i
  }, cat, i < mod.categories.length - 1 && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-quiet)'
    }
  }, " \xB7 ")))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 10,
      color: 'var(--text-soft)'
    }
  }, mod.caption), mod.href && /*#__PURE__*/React.createElement("a", {
    href: mod.href,
    target: mod.external ? '_blank' : undefined,
    rel: mod.external ? 'noopener' : undefined,
    style: {
      display: 'inline-block',
      marginTop: 22,
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: '0.12em',
      color: hov ? 'var(--paper)' : 'var(--altiplano)',
      textDecoration: 'none',
      paddingBottom: 4,
      borderBottom: '1px solid var(--azul-claro)',
      transition: 'color 0.25s'
    }
  }, mod.linkLabel));
}
function Modules() {
  const [ref, visible] = useReveal();
  return /*#__PURE__*/React.createElement("section", {
    id: "modules",
    className: "modules-section",
    ref: ref,
    style: {
      padding: '40px 2.5rem 140px',
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : 'translateY(30px)',
      transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)'
    }
  }, /*#__PURE__*/React.createElement(ChapterLabel, {
    number: "04",
    title: "M\xF3dulos"
  }), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'Manrope, sans-serif',
      fontSize: 'clamp(2rem, 3.6vw, 3.2rem)',
      fontWeight: 800,
      letterSpacing: '-0.025em',
      color: 'var(--hueso)',
      lineHeight: 1.05,
      marginBottom: 80,
      maxWidth: 900,
      textWrap: 'balance'
    }
  }, "Una plataforma. ", /*#__PURE__*/React.createElement("em", {
    style: {
      fontWeight: 400,
      color: 'var(--altiplano)'
    }
  }, "Cuatro capacidades.")), /*#__PURE__*/React.createElement("div", {
    className: "modules-grid",
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 24
    }
  }, MODULES.map((mod, i) => /*#__PURE__*/React.createElement(ModuleCard, {
    key: i,
    mod: mod
  })))));
}

// -------- Sectors: 3x2 grid --------
const SECTORS = [{
  icon: 'mining',
  label: 'Minería',
  desc: 'Operaciones extractivas y su entorno comunitario.',
  href: '/industrias/mineria'
}, {
  icon: 'energy',
  label: 'Energía y renovables',
  desc: 'Proyectos de generación y transmisión.',
  href: '/industrias/energia'
}, {
  icon: 'fish',
  label: 'Salmonicultura',
  desc: 'Centros de cultivo y su convivencia costera.',
  href: '/industrias/salmonicultura'
}, {
  icon: 'forest',
  label: 'Forestal',
  desc: 'Patrimonio, faenas y comunidades rurales.',
  href: '/industrias/forestal'
}, {
  icon: 'building',
  label: 'Proyectos inmobiliarios',
  desc: 'Obras, vecinos y compromisos de mitigación.',
  href: '/industrias/inmobiliario'
}, {
  icon: 'water',
  label: 'Sanitarias',
  desc: 'Plantas y redes en territorios urbanos.',
  href: '/industrias/sanitarias'
}, {
  icon: 'road',
  label: 'Carreteras y concesiones',
  desc: 'Trazados largos, leídos tramo a tramo.',
  href: '/industrias/carreteras'
}, {
  icon: 'public',
  label: 'Sector público',
  desc: 'Fiscalización y planificación territorial.',
  href: '/industrias/sector-publico'
}];
function SectorCard({
  sector
}) {
  const [hov, setHov] = React.useState(false);
  return /*#__PURE__*/React.createElement("a", {
    href: sector.href,
    className: "sector-card",
    onMouseEnter: () => setHov(true),
    onMouseLeave: () => setHov(false),
    style: {
      display: 'block',
      textDecoration: 'none',
      background: 'var(--azul-gris-2)',
      border: `1px solid ${hov ? 'var(--altiplano)' : 'var(--line)'}`,
      padding: 32,
      transition: 'all 0.3s',
      transform: hov ? 'translate(-2px, -2px)' : 'none',
      boxShadow: hov ? '4px 4px 0 rgba(92,130,160,0.2)' : 'none'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: sector.icon,
    size: 32,
    color: "var(--altiplano)"
  }), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'Manrope, sans-serif',
      fontWeight: 700,
      fontSize: 22,
      color: 'var(--hueso)',
      marginTop: 16,
      marginBottom: 8,
      letterSpacing: '-0.01em'
    }
  }, sector.label), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'Source Sans 3, sans-serif',
      fontSize: 14,
      color: 'var(--text-muted)',
      margin: '0 0 16px',
      lineHeight: 1.5
    }
  }, sector.desc), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 10,
      textTransform: 'uppercase',
      letterSpacing: '0.12em',
      color: hov ? 'var(--paper)' : 'var(--altiplano)',
      transition: 'color 0.25s'
    }
  }, "Casos de uso \u2192"));
}
function Sectors() {
  const [ref, visible] = useReveal();
  return /*#__PURE__*/React.createElement("section", {
    id: "sectors",
    className: "sectors-section",
    ref: ref,
    style: {
      padding: '0 2.5rem 140px',
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : 'translateY(30px)',
      transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)'
    }
  }, /*#__PURE__*/React.createElement(ChapterLabel, {
    number: "07",
    title: "Sectores"
  }), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'Manrope, sans-serif',
      fontSize: 'clamp(1.9rem, 3.2vw, 2.8rem)',
      fontWeight: 800,
      letterSpacing: '-0.025em',
      color: 'var(--hueso)',
      textWrap: 'balance',
      maxWidth: 820,
      lineHeight: 1.05,
      marginBottom: 56
    }
  }, "Dise\xF1ado para organizaciones con ", /*#__PURE__*/React.createElement("em", {
    style: {
      fontWeight: 400,
      color: 'var(--altiplano)'
    }
  }, "responsabilidad territorial"), "."), /*#__PURE__*/React.createElement("div", {
    className: "sectors-grid",
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 24
    }
  }, SECTORS.map((s, i) => /*#__PURE__*/React.createElement(SectorCard, {
    key: i,
    sector: s
  })))));
}

// -------- Stats: qualitative differentiators --------
const DIFFERENTIATORS = [{
  icon: 'layers',
  title: 'Integración heterogénea',
  desc: 'Cuatro fuentes en un solo hub: terreno, ambiente, digital, documental.'
}, {
  icon: 'clock',
  title: 'Trazabilidad completa',
  desc: 'Cada dato con su origen, fecha y contexto. Auditable de extremo a extremo.'
}, {
  icon: 'pulse',
  title: 'Indicadores comparables',
  desc: 'Score territorial ajustable. Lo que importa, medible en el tiempo.'
}, {
  icon: 'target',
  title: 'Alertas tempranas',
  desc: 'Señales del entorno que avisan a tiempo, para anticipar en vez de reaccionar.'
}];
function Stats() {
  const [ref, visible] = useReveal(0.3);
  return /*#__PURE__*/React.createElement("section", {
    ref: ref,
    className: "diff-section",
    style: {
      background: 'var(--azul-gris-2)',
      borderTop: '1px solid var(--line)',
      borderBottom: '1px solid var(--line)',
      padding: '88px 2.5rem',
      marginBottom: 140,
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto',
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : 'translateY(20px)',
      transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)'
    }
  }, /*#__PURE__*/React.createElement(ChapterLabel, {
    number: "08",
    title: "Diferenciadores"
  }), /*#__PURE__*/React.createElement("div", {
    className: "diff-grid",
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 32
    }
  }, DIFFERENTIATORS.map((d, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      padding: '0 16px',
      borderLeft: i === 0 ? 'none' : '1px solid var(--line)',
      paddingLeft: i === 0 ? 0 : 32
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: d.icon,
    size: 32,
    color: "var(--altiplano)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'Manrope, sans-serif',
      fontSize: 20,
      fontWeight: 700,
      color: 'var(--hueso)',
      marginBottom: 8,
      letterSpacing: '-0.01em'
    }
  }, d.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'Source Sans 3, sans-serif',
      fontSize: 14,
      color: 'var(--text-muted)',
      lineHeight: 1.55
    }
  }, d.desc))))));
}

// -------- Founder quote: brand manifesto (no attribution) --------
function FounderQuote() {
  const [ref, visible] = useReveal();
  return /*#__PURE__*/React.createElement("section", {
    ref: ref,
    className: "founder-section",
    style: {
      padding: '0 2.5rem 140px',
      maxWidth: 1100,
      margin: '0 auto',
      background: 'var(--azul-gris)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : 'translateY(30px)',
      transition: 'all 0.9s cubic-bezier(0.16,1,0.3,1)'
    }
  }, /*#__PURE__*/React.createElement(ChapterLabel, {
    number: "11",
    title: "Promesa"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--line-strong)',
      background: 'var(--surface)',
      padding: 'clamp(32px, 5vw, 56px)',
      display: 'grid',
      gridTemplateColumns: 'auto 1fr',
      gap: 'clamp(20px, 4vw, 48px)',
      alignItems: 'start'
    },
    className: "promise-plate"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "56",
    height: "40",
    viewBox: "0 0 56 40",
    "aria-hidden": "true",
    style: {
      flex: 'none',
      marginTop: 6
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2 36L18 12l8 10L38 6l16 26",
    fill: "none",
    stroke: "var(--terracota)",
    strokeWidth: "2.5",
    strokeLinejoin: "round",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M2 39h52",
    stroke: "var(--line-strong)",
    strokeWidth: "1"
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'Manrope, sans-serif',
      fontWeight: 500,
      fontSize: 'clamp(1.4rem, 2.4vw, 2rem)',
      letterSpacing: '-0.025em',
      color: 'var(--hueso)',
      lineHeight: 1.3,
      textWrap: 'balance',
      margin: 0
    }
  }, "SIMCII transforma datos territoriales en", ' ', /*#__PURE__*/React.createElement("em", {
    style: {
      fontFamily: 'Manrope, sans-serif',
      color: 'var(--altiplano)',
      fontWeight: 700
    }
  }, "decisiones estrat\xE9gicas"), ". Anticipa conflictos, mejora el relacionamiento y fortalece tu operaci\xF3n con", ' ', /*#__PURE__*/React.createElement("em", {
    style: {
      fontFamily: 'Manrope, sans-serif',
      color: 'var(--altiplano)',
      fontWeight: 700
    }
  }, "evidencia"), "."))));
}

// -------- Method: De la señal a la decisión (4 pasos sobre perfil ascendente) --------
const METHOD_STEPS = [{
  key: 'Medir',
  desc: 'Sistemas automatizados capturan datos de estaciones, terreno y fuentes públicas, y los dejan en un solo lugar.'
}, {
  key: 'Leer',
  desc: 'La plataforma cruza los datos y los convierte en scores comparables de 0 a 100 por territorio.'
}, {
  key: 'Gestionar',
  desc: 'Stakeholders, compromisos, reclamos y registros de terreno en un solo flujo, con trazabilidad.'
}, {
  key: 'Anticipar',
  desc: 'Alertas tempranas y señales de tendencia para decidir antes de que el problema escale.'
}];
function Method() {
  const [ref, visible] = useReveal();
  return /*#__PURE__*/React.createElement("section", {
    id: "method",
    className: "method-section",
    ref: ref,
    style: {
      padding: '0 2.5rem 140px',
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : 'translateY(30px)',
      transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)'
    }
  }, /*#__PURE__*/React.createElement(ChapterLabel, {
    number: "03",
    title: "M\xE9todo"
  }), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'Manrope, sans-serif',
      fontSize: 'clamp(1.9rem, 3.2vw, 2.8rem)',
      fontWeight: 800,
      letterSpacing: '-0.025em',
      color: 'var(--hueso)',
      textWrap: 'balance',
      maxWidth: 820,
      lineHeight: 1.05,
      marginBottom: 16
    }
  }, "De la se\xF1al ", /*#__PURE__*/React.createElement("em", {
    style: {
      fontWeight: 400,
      color: 'var(--altiplano)'
    }
  }, "a la decisi\xF3n"), "."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'Source Sans 3, sans-serif',
      fontSize: 16,
      lineHeight: 1.6,
      color: 'var(--text-muted)',
      maxWidth: 640,
      marginBottom: 56,
      textWrap: 'pretty'
    }
  }, "Toda la data, en una sola lectura. El territorio se sube por etapas \u2014 cada una deja evidencia para la siguiente."), /*#__PURE__*/React.createElement("svg", {
    className: "method-profile",
    viewBox: "0 0 1200 90",
    preserveAspectRatio: "none",
    "aria-hidden": "true",
    style: {
      display: 'block',
      width: '100%',
      height: 72,
      marginBottom: -8
    }
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "0,86 150,74 300,66 450,52 600,44 750,32 900,24 1050,12 1200,6",
    fill: "none",
    stroke: "var(--azul-deep)",
    strokeWidth: "1.5"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "0,88 150,80 310,74 460,62 610,54 760,44 910,36 1060,26 1200,20",
    fill: "none",
    stroke: "var(--gris-ciudad)",
    strokeWidth: "1",
    opacity: "0.35"
  }), [150, 450, 750, 1050].map((x, i) => /*#__PURE__*/React.createElement("circle", {
    key: i,
    cx: x,
    cy: [74, 52, 32, 12][i],
    r: "4",
    fill: "var(--terracota)"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "method-grid",
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 1,
      background: 'var(--line)',
      border: '1px solid var(--line-strong)'
    }
  }, METHOD_STEPS.map((st, i) => /*#__PURE__*/React.createElement("div", {
    key: st.key,
    style: {
      background: 'var(--surface)',
      padding: '28px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 10,
      color: 'var(--altiplano)',
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement(window.SectionMark, null), " Etapa ", i + 1), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'Manrope, sans-serif',
      fontWeight: 800,
      fontSize: 24,
      color: 'var(--hueso)',
      letterSpacing: '-0.02em',
      marginBottom: 10
    }
  }, st.key), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'Source Sans 3, sans-serif',
      fontSize: 14,
      color: 'var(--text-muted)',
      lineHeight: 1.55,
      margin: 0
    }
  }, st.desc))))));
}

// -------- Security: defensa en profundidad + Ley 21.719 --------
const SECURITY_LAYERS = [{
  num: '01',
  title: 'Cifrado en el borde',
  desc: 'TLS 1.3 y HTTPS forzado en todo el tráfico.'
}, {
  num: '02',
  title: 'Red aislada',
  desc: 'Base de datos sin exposición pública; administración solo por VPN.'
}, {
  num: '03',
  title: 'Autenticación y permisos',
  desc: 'Sesiones JWT, contraseñas cifradas y control por rol y por fila.'
}, {
  num: '04',
  title: 'Aislamiento por cliente',
  desc: 'Los datos de cada organización viven segregados; el acceso es siempre vía API.'
}, {
  num: '05',
  title: 'Trazabilidad y respaldo',
  desc: 'Cifrado en tránsito y en reposo, retención definida y accesos auditables.'
}];
function Security() {
  const [ref, visible] = useReveal();
  return /*#__PURE__*/React.createElement("section", {
    id: "security",
    className: "security-section",
    ref: ref,
    style: {
      padding: '0 2.5rem 140px',
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : 'translateY(30px)',
      transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)'
    }
  }, /*#__PURE__*/React.createElement(ChapterLabel, {
    number: "09",
    title: "Seguridad"
  }), /*#__PURE__*/React.createElement("div", {
    className: "security-grid",
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1.2fr',
      gap: 64,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'Manrope, sans-serif',
      fontSize: 'clamp(1.9rem, 3.2vw, 2.8rem)',
      fontWeight: 800,
      letterSpacing: '-0.025em',
      color: 'var(--hueso)',
      textWrap: 'balance',
      lineHeight: 1.05,
      marginBottom: 20
    }
  }, "Datos protegidos, plataforma ", /*#__PURE__*/React.createElement("em", {
    style: {
      fontWeight: 400,
      color: 'var(--altiplano)'
    }
  }, "confiable"), "."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'Source Sans 3, sans-serif',
      fontSize: 16,
      lineHeight: 1.6,
      color: 'var(--text-muted)',
      textWrap: 'pretty',
      marginBottom: 24
    }
  }, "La informaci\xF3n territorial y comunitaria es sensible por definici\xF3n. La seguridad es un principio de dise\xF1o de SIMCII: cada capa de la plataforma aplica cifrado, aislamiento de datos y control de accesos."), /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--line-strong)',
      background: 'var(--surface)',
      padding: '20px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 10,
      color: 'var(--terracota)',
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      marginBottom: 10
    }
  }, "Ley N\xB0 21.719 \xB7 Protecci\xF3n de datos"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'Source Sans 3, sans-serif',
      fontSize: 14,
      color: 'var(--text-muted)',
      lineHeight: 1.55,
      margin: 0
    }
  }, "Dise\xF1ada para operar en cumplimiento de la nueva Ley de Protecci\xF3n de Datos Personales de Chile: resguardo de datos sensibles, trazabilidad de accesos y protocolos de notificaci\xF3n."))), /*#__PURE__*/React.createElement("div", null, SECURITY_LAYERS.map(l => /*#__PURE__*/React.createElement("div", {
    key: l.num,
    style: {
      display: 'flex',
      gap: 20,
      alignItems: 'baseline',
      borderTop: '1px solid var(--line)',
      padding: '18px 0'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 11,
      color: 'var(--altiplano)',
      letterSpacing: '0.1em',
      flex: 'none'
    }
  }, l.num), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'Manrope, sans-serif',
      fontWeight: 700,
      fontSize: 17,
      color: 'var(--hueso)',
      marginBottom: 4
    }
  }, l.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'Source Sans 3, sans-serif',
      fontSize: 14,
      color: 'var(--text-muted)',
      lineHeight: 1.5
    }
  }, l.desc))))))));
}

// -------- Implementation: fases y acompañamiento --------
const IMPL_PHASES = [{
  phase: 'Fase 1',
  when: 'Semanas 1–2',
  title: 'Levantamiento y definición',
  desc: 'Mesas de trabajo con tu equipo: qué fuentes de datos se integran y qué indicadores importan a tu operación.'
}, {
  phase: 'Fase 2',
  when: 'Semanas 3–5',
  title: 'Integración y configuración',
  desc: 'Conexión de estaciones y fuentes, parametrización de scores, umbrales y alertas para tu territorio.'
}, {
  phase: 'Fase 3',
  when: 'Desde semana 6',
  title: 'Producción y acompañamiento',
  desc: 'Salida a producción con un jefe de proyecto dedicado como contraparte directa, en soporte permanente.'
}];
function Implementation() {
  const [ref, visible] = useReveal();
  return /*#__PURE__*/React.createElement("section", {
    id: "implementation",
    className: "impl-section",
    ref: ref,
    style: {
      padding: '0 2.5rem 140px',
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : 'translateY(30px)',
      transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)'
    }
  }, /*#__PURE__*/React.createElement(ChapterLabel, {
    number: "10",
    title: "Implementaci\xF3n"
  }), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'Manrope, sans-serif',
      fontSize: 'clamp(1.9rem, 3.2vw, 2.8rem)',
      fontWeight: 800,
      letterSpacing: '-0.025em',
      color: 'var(--hueso)',
      textWrap: 'balance',
      maxWidth: 820,
      lineHeight: 1.05,
      marginBottom: 16
    }
  }, "Operativa en semanas, ", /*#__PURE__*/React.createElement("em", {
    style: {
      fontWeight: 400,
      color: 'var(--altiplano)'
    }
  }, "no en trimestres"), "."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'Source Sans 3, sans-serif',
      fontSize: 16,
      lineHeight: 1.6,
      color: 'var(--text-muted)',
      maxWidth: 640,
      marginBottom: 48,
      textWrap: 'pretty'
    }
  }, "Cada organizaci\xF3n tiene un ecosistema de datos distinto. La implementaci\xF3n se co-construye \u2014 los plazos exactos se ajustan en el kick-off."), /*#__PURE__*/React.createElement("svg", {
    className: "impl-axis",
    viewBox: "0 0 1200 24",
    preserveAspectRatio: "none",
    "aria-hidden": "true",
    style: {
      display: 'block',
      width: '100%',
      height: 24,
      marginBottom: 28
    }
  }, /*#__PURE__*/React.createElement("line", {
    x1: "0",
    y1: "12",
    x2: "1188",
    y2: "12",
    stroke: "var(--line-strong)",
    strokeWidth: "1.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M1188 6l10 6-10 6",
    fill: "none",
    stroke: "var(--line-strong)",
    strokeWidth: "1.5"
  }), [8, 408, 808].map((x, i) => /*#__PURE__*/React.createElement("circle", {
    key: i,
    cx: x,
    cy: "12",
    r: "5",
    fill: "var(--terracota)"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "impl-grid",
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 48
    }
  }, IMPL_PHASES.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.phase
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      alignItems: 'baseline',
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 10,
      color: 'var(--altiplano)',
      letterSpacing: '0.18em',
      textTransform: 'uppercase'
    }
  }, p.phase), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 10,
      color: 'var(--text-soft)',
      letterSpacing: '0.12em'
    }
  }, p.when)), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'Manrope, sans-serif',
      fontWeight: 700,
      fontSize: 20,
      color: 'var(--hueso)',
      letterSpacing: '-0.01em',
      marginBottom: 10
    }
  }, p.title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'Source Sans 3, sans-serif',
      fontSize: 14,
      color: 'var(--text-muted)',
      lineHeight: 1.55,
      margin: 0
    }
  }, p.desc))))));
}
Object.assign(window, {
  Problem,
  Method,
  Modules,
  Sectors,
  Stats,
  Security,
  Implementation,
  FounderQuote,
  ChapterLabel,
  useReveal,
  Icon
});