// CTA + Footer — SIMCII · Cordillera Cívica

function CTASection() {
  const [ref, visible] = window.useReveal();
  const [email, setEmail] = React.useState('');
  const [sent, setSent] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState('');
  const handleSubmit = async e => {
    e.preventDefault();
    if (!email || submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email
        })
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
  return /*#__PURE__*/React.createElement("section", {
    id: "demo",
    className: "cta-section",
    ref: ref,
    style: {
      padding: '80px 2.5rem 140px',
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "cta-card",
    style: {
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : 'translateY(30px)',
      transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)',
      background: 'var(--ink)',
      border: '1px solid var(--line-strong)',
      position: 'relative',
      overflow: 'hidden',
      padding: '96px 80px'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: 120,
      display: 'block'
    },
    viewBox: "0 0 1200 120",
    preserveAspectRatio: "none",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M0 90 L150 55 L300 78 L450 42 L600 80 L750 48 L900 82 L1050 58 L1200 84 L1200 120 L0 120 Z",
    fill: "var(--gris-ciudad)",
    opacity: "0.16"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0 108 L150 80 L320 100 L470 70 L640 102 L800 74 L960 104 L1120 84 L1200 100 L1200 120 L0 120 Z",
    fill: "var(--azul-deep)",
    opacity: "0.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0 120 L200 100 L380 116 L560 96 L720 118 L900 100 L1080 118 L1200 108 L1200 120 Z",
    fill: "var(--terracota)",
    opacity: "0.85"
  })), /*#__PURE__*/React.createElement("span", {
    className: "corner-mark",
    style: {
      position: 'absolute',
      top: 24,
      left: 24,
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 10,
      color: 'var(--azul-claro)',
      letterSpacing: '0.2em'
    }
  }, /*#__PURE__*/React.createElement(window.SectionMark, null), " 12 \xB7 CONTACTO"), /*#__PURE__*/React.createElement("span", {
    className: "corner-mark",
    style: {
      position: 'absolute',
      top: 24,
      right: 24,
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 10,
      color: 'var(--text-soft)',
      letterSpacing: '0.2em'
    }
  }, "SIMCII \xB7 2026"), /*#__PURE__*/React.createElement("div", {
    className: "cta-grid",
    style: {
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 80,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'Manrope, sans-serif',
      fontWeight: 800,
      fontSize: 'clamp(2rem, 3.8vw, 3.2rem)',
      letterSpacing: '-0.03em',
      color: 'var(--paper)',
      lineHeight: 1.0,
      marginBottom: 28,
      textWrap: 'balance'
    }
  }, "Conoce el territorio ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--azul-claro)'
    }
  }, "antes"), " de decidir."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'Source Sans 3, sans-serif',
      fontWeight: 400,
      fontSize: 'clamp(1.05rem, 1.6vw, 1.25rem)',
      color: 'var(--text-muted)',
      lineHeight: 1.55,
      marginBottom: 0,
      textWrap: 'pretty',
      maxWidth: '42ch'
    }
  }, "Agenda una demo de SIMCII y mira c\xF3mo monitorear lo ambiental, lo social y lo territorial con evidencia, en una sola plataforma.")), /*#__PURE__*/React.createElement("div", null, !sent ? /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "cta-email",
    style: {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 10,
      color: 'var(--text-soft)',
      letterSpacing: '0.14em',
      textTransform: 'uppercase'
    }
  }, "Correo corporativo"), /*#__PURE__*/React.createElement("input", {
    id: "cta-email",
    type: "email",
    placeholder: "tu@empresa.cl",
    value: email,
    onChange: e => setEmail(e.target.value),
    required: true,
    autoComplete: "email",
    style: {
      fontFamily: 'Source Sans 3, sans-serif',
      fontSize: 16,
      background: 'transparent',
      border: 'none',
      borderBottom: '1px solid var(--line-strong)',
      padding: '12px 0',
      color: 'var(--paper)',
      outline: 'none'
    },
    onFocus: e => e.target.style.borderBottomColor = 'var(--azul-claro)',
    onBlur: e => e.target.style.borderBottomColor = 'var(--line-strong)'
  }), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    disabled: submitting,
    style: {
      marginTop: 16,
      fontFamily: 'Source Sans 3, sans-serif',
      fontWeight: 700,
      fontSize: 14,
      background: submitting ? 'transparent' : 'var(--azul-civico)',
      color: submitting ? 'var(--azul-claro)' : 'var(--paper)',
      padding: '15px 27px',
      border: '1px solid var(--azul-civico)',
      borderRadius: 2,
      cursor: submitting ? 'wait' : 'pointer',
      letterSpacing: '0.01em',
      transition: 'all 0.25s',
      alignSelf: 'flex-start',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      opacity: submitting ? 0.7 : 1
    },
    onMouseEnter: e => {
      if (submitting) return;
      e.currentTarget.style.background = 'transparent';
      e.currentTarget.style.color = 'var(--azul-claro)';
    },
    onMouseLeave: e => {
      if (submitting) return;
      e.currentTarget.style.background = 'var(--azul-civico)';
      e.currentTarget.style.color = 'var(--paper)';
    }
  }, submitting ? 'Enviando…' : 'Solicitar demo', !submitting && /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 10 10",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 5h8m-3-3l3 3-3 3",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), error && /*#__PURE__*/React.createElement("div", {
    role: "alert",
    style: {
      marginTop: 12,
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: 'var(--terracota-deep)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 10,
      color: 'var(--terracota)',
      letterSpacing: '0.1em',
      textTransform: 'uppercase'
    }
  }, error)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20,
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: 'var(--azul-claro)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 10,
      color: 'var(--text-soft)',
      letterSpacing: '0.1em',
      textTransform: 'uppercase'
    }
  }, "Respondemos en 24 h h\xE1biles"))) : /*#__PURE__*/React.createElement("div", {
    role: "status",
    style: {
      border: '1px solid var(--azul-claro)',
      padding: '32px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: 'var(--azul-claro)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 10,
      color: 'var(--azul-claro)',
      letterSpacing: '0.14em',
      textTransform: 'uppercase'
    }
  }, "Recibido")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'Manrope, sans-serif',
      fontSize: 18,
      fontWeight: 600,
      color: 'var(--paper)'
    }
  }, "Gracias. Te contactaremos pronto."))))));
}
function Footer() {
  return /*#__PURE__*/React.createElement("footer", {
    className: "footer-root",
    style: {
      borderTop: '1px solid var(--line)',
      padding: '72px 2.5rem 40px',
      background: 'var(--surface)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "footer-masthead",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      paddingBottom: 32,
      borderBottom: '1px solid var(--line-strong)',
      marginBottom: 48,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(window.Logo, {
    height: 40
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 11,
      color: 'var(--text-soft)',
      letterSpacing: '0.18em',
      textTransform: 'uppercase'
    }
  }, "Inteligencia territorial \xB7 por Accionet"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 11,
      color: 'var(--text-soft)',
      letterSpacing: '0.18em'
    }
  }, "2026")), /*#__PURE__*/React.createElement("div", {
    className: "footer-grid",
    style: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 1fr 1fr',
      gap: 64,
      marginBottom: 56,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'Source Sans 3, sans-serif',
      fontSize: 16,
      color: 'var(--text-muted)',
      lineHeight: 1.6,
      maxWidth: 560,
      textWrap: 'pretty',
      margin: 0
    }
  }, "Plataforma de monitoreo ambiental, social y territorial. Integra datos de estaciones, contexto y comunidad para gestionar compromisos, anticipar alertas y sostener la licencia social para operar \u2014 con evidencia."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 28,
      display: 'flex',
      gap: 10
    }
  }, ['LI', 'TW', 'YT'].map((s, i) => /*#__PURE__*/React.createElement("a", {
    key: i,
    href: "#",
    "aria-label": s,
    style: {
      width: 36,
      height: 36,
      border: '1px solid var(--line)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textDecoration: 'none',
      transition: 'all 0.2s'
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = 'var(--azul-civico)';
      e.currentTarget.style.borderColor = 'var(--azul-civico)';
      e.currentTarget.querySelector('span').style.color = 'var(--paper)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = 'transparent';
      e.currentTarget.style.borderColor = 'var(--line)';
      e.currentTarget.querySelector('span').style.color = 'var(--paper)';
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 10,
      fontWeight: 500,
      color: 'var(--paper)',
      letterSpacing: '0.08em'
    }
  }, s))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 10,
      fontWeight: 500,
      color: 'var(--azul-claro)',
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      marginBottom: 18,
      paddingBottom: 8,
      borderBottom: '1px solid var(--line)'
    }
  }, "Soluciones"), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, [{
    label: 'Monitoreo ambiental',
    href: '/soluciones/monitoreo-ambiental'
  }, {
    label: 'Relacionamiento comunitario',
    href: '/soluciones/relacionamiento-comunitario'
  }, {
    label: 'Cumplimiento RCA',
    href: '/soluciones/cumplimiento-rca'
  }, {
    label: 'Gestión territorial',
    href: '/soluciones/gestion-territorial'
  }].map(l => /*#__PURE__*/React.createElement("li", {
    key: l.href
  }, /*#__PURE__*/React.createElement("a", {
    href: l.href,
    style: {
      fontFamily: 'Source Sans 3, sans-serif',
      fontSize: 14,
      color: 'var(--text-muted)',
      textDecoration: 'none',
      transition: 'color 0.2s'
    },
    onMouseEnter: e => e.target.style.color = 'var(--paper)',
    onMouseLeave: e => e.target.style.color = 'var(--text-muted)'
  }, l.label))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 10,
      fontWeight: 500,
      color: 'var(--azul-claro)',
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      marginBottom: 18,
      paddingBottom: 8,
      borderBottom: '1px solid var(--line)'
    }
  }, "Industrias"), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, [{
    label: 'Minería',
    href: '/industrias/mineria'
  }, {
    label: 'Energía y renovables',
    href: '/industrias/energia'
  }, {
    label: 'Salmonicultura',
    href: '/industrias/salmonicultura'
  }, {
    label: 'Forestal',
    href: '/industrias/forestal'
  }, {
    label: 'Proyectos inmobiliarios',
    href: '/industrias/inmobiliario'
  }, {
    label: 'Sanitarias',
    href: '/industrias/sanitarias'
  }, {
    label: 'Carreteras y concesiones',
    href: '/industrias/carreteras'
  }, {
    label: 'Sector público',
    href: '/industrias/sector-publico'
  }].map(l => /*#__PURE__*/React.createElement("li", {
    key: l.href
  }, /*#__PURE__*/React.createElement("a", {
    href: l.href,
    style: {
      fontFamily: 'Source Sans 3, sans-serif',
      fontSize: 14,
      color: 'var(--text-muted)',
      textDecoration: 'none',
      transition: 'color 0.2s'
    },
    onMouseEnter: e => e.target.style.color = 'var(--paper)',
    onMouseLeave: e => e.target.style.color = 'var(--text-muted)'
  }, l.label))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 10,
      fontWeight: 500,
      color: 'var(--azul-claro)',
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      marginBottom: 18,
      paddingBottom: 8,
      borderBottom: '1px solid var(--line)'
    }
  }, "Contacto"), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#demo",
    style: {
      fontFamily: 'Source Sans 3, sans-serif',
      fontSize: 14,
      color: 'var(--text-muted)',
      textDecoration: 'none',
      transition: 'color 0.2s'
    },
    onMouseEnter: e => e.target.style.color = 'var(--paper)',
    onMouseLeave: e => e.target.style.color = 'var(--text-muted)'
  }, "Solicitar una demo \u2192")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "mailto:contacto@accionet.net",
    style: {
      fontFamily: 'Source Sans 3, sans-serif',
      fontSize: 14,
      color: 'var(--text-muted)',
      textDecoration: 'none',
      transition: 'color 0.2s'
    },
    onMouseEnter: e => e.target.style.color = 'var(--paper)',
    onMouseLeave: e => e.target.style.color = 'var(--text-muted)'
  }, "contacto@accionet.net")), /*#__PURE__*/React.createElement("li", {
    style: {
      fontFamily: 'Source Sans 3, sans-serif',
      fontSize: 14,
      color: 'var(--text-muted)'
    }
  }, "Santiago \xB7 Chile")))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px dashed var(--line)',
      paddingTop: 24,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 10,
      color: 'var(--text-soft)',
      letterSpacing: '0.14em',
      textTransform: 'uppercase'
    }
  }, "\xA9 2026 Accionet SpA \xB7 Santiago, Chile \xB7 Todos los derechos reservados"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 24
    }
  }, ['Privacidad', 'Términos', 'Seguridad'].map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    style: {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 10,
      color: 'var(--text-soft)',
      textDecoration: 'none',
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      transition: 'color 0.2s'
    },
    onMouseEnter: e => e.target.style.color = 'var(--paper)',
    onMouseLeave: e => e.target.style.color = 'var(--text-soft)'
  }, l))))));
}
Object.assign(window, {
  CTASection,
  Footer
});