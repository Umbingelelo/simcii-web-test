
// Platform (Mapbox real-capability) + La plataforma en uso (capturas reales)

async function getMapboxToken() {
  const config = typeof window.getSimciiConfig === 'function'
    ? await window.getSimciiConfig()
    : (window.SIMCII_CONFIG || {});
  return config.mapboxToken || '';
}

// Nodos demostrativos: estaciones + puntos comunitarios + alerta (datos mock)
const NODES = [
  { id: 'E1', lng: -68.92, lat: -23.60, kind: 'env',   label: 'Estación ambiental E1' },
  { id: 'E2', lng: -68.42, lat: -23.20, kind: 'env',   label: 'Estación ambiental E2' },
  { id: 'C1', lng: -68.78, lat: -23.78, kind: 'com',   label: 'Punto comunitario C1' },
  { id: 'A1', lng: -68.60, lat: -23.90, kind: 'alert', label: 'Alerta territorial A1' },
];

const MARKER_COLOR = { env: '#5C82A0', com: '#2F5D7C', alert: '#B96B45' };

// Indicadores demostrativos: dominio ambiental + social
const INDICATORS = [
  { code: 'AMB-01', label: 'Material particulado', state: 'dentro de rango',   fill: 62, color: 'var(--azul-claro)' },
  { code: 'AMB-02', label: 'Ruido diurno',         state: 'tendencia al alza', fill: 72, color: 'var(--terracota)' },
  { code: 'SOC-01', label: 'Satisfacción comunitaria', state: 'estable',       fill: 78, color: 'var(--azul-claro)' },
  { code: 'SOC-02', label: 'Reportes ciudadanos',  state: 'bajo umbral',       fill: 28, color: 'var(--azul-claro)' },
  { code: 'SOC-03', label: 'Compromisos activos',  state: 'en ejecución',      fill: 66, color: 'var(--azul-claro)' },
  { code: 'TER-01', label: 'Score territorial',    state: 'bueno',             fill: 86, color: 'var(--azul-claro)' },
];

function getNodeMetrics(n) {
  if (n.kind === 'env') {
    return {
      kindLabel: 'Estación ambiental',
      status: { label: 'Operativo', color: 'var(--azul-claro)' },
      readings: [
        { label: 'MP10',  value: '38 µg/m³', fill: 38 },
        { label: 'SO₂',   value: '12 ppb',   fill: 24 },
        { label: 'Ruido', value: '52 dB',    fill: 60 },
      ],
      lastUpdate: 'hace 1 min',
    };
  }
  if (n.kind === 'com') {
    return {
      kindLabel: 'Punto comunitario',
      status: { label: 'Activo', color: 'var(--azul-claro)' },
      readings: [
        { label: 'Satisfacción', value: '78 %',       fill: 78 },
        { label: 'Reportes',     value: '03 / sem',   fill: 22 },
        { label: 'Compromisos',  value: '12 activos', fill: 66 },
      ],
      lastUpdate: 'hace 4 min',
    };
  }
  return {
    kindLabel: 'Alerta territorial',
    status: { label: 'Atención requerida', color: 'var(--terracota)' },
    readings: [
      { label: 'Severidad',   value: 'Media',    fill: 55 },
      { label: 'Tipo',        value: 'Ambiental', fill: 40 },
      { label: 'Antigüedad',  value: '08 min',   fill: 15 },
    ],
    lastUpdate: 'hace 8 min',
  };
}

function buildPopupHTML(n) {
  const m = getNodeMetrics(n);
  const lngStr = `${Math.abs(n.lng).toFixed(3)}° ${n.lng < 0 ? 'W' : 'E'}`;
  const latStr = `${Math.abs(n.lat).toFixed(3)}° ${n.lat < 0 ? 'S' : 'N'}`;
  const readings = m.readings.map(r => `
    <div>
      <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:5px;">
        <span style="font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--text-muted);letter-spacing:0.16em;text-transform:uppercase;">${r.label}</span>
        <span style="font-family:'Manrope',sans-serif;font-weight:700;font-size:22px;color:var(--paper);">${r.value}</span>
      </div>
      <div style="height:2px;background:rgba(245,242,235,0.08);position:relative;">
        <div style="position:absolute;left:0;top:0;bottom:0;width:${r.fill}%;background:${m.status.color};transition:width 0.6s cubic-bezier(0.16,1,0.3,1);"></div>
      </div>
    </div>
  `).join('');
  return `
<div style="background:var(--surface);border:1px solid var(--line-strong);width:300px;font-family:'Source Sans 3',sans-serif;color:var(--paper);overflow:hidden;">
  <div style="padding:10px 14px;display:flex;justify-content:space-between;align-items:center;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:var(--azul-claro);border-bottom:1px solid var(--line);">
    <span>${m.kindLabel}</span><span style="opacity:.65;">${n.id}</span>
  </div>
  <div style="padding:16px 18px;">
    <div style="font-family:'JetBrains Mono',monospace;font-size:9.5px;color:var(--text-soft);letter-spacing:0.16em;margin-bottom:14px;">${latStr} · ${lngStr}</div>
    <div style="display:inline-flex;align-items:center;gap:7px;padding:4px 9px;border:1px solid var(--line);margin-bottom:18px;">
      <span style="width:6px;height:6px;border-radius:50%;background:${m.status.color};animation:blink 1.2s infinite;"></span>
      <span style="font-family:'JetBrains Mono',monospace;font-size:9.5px;color:${m.status.color};letter-spacing:0.16em;text-transform:uppercase;">${m.status.label}</span>
    </div>
    <div style="display:flex;flex-direction:column;gap:11px;">${readings}</div>
  </div>
  <div style="border-top:1px solid var(--line);padding:10px 14px;display:flex;justify-content:space-between;align-items:center;font-family:'JetBrains Mono',monospace;font-size:9.5px;letter-spacing:0.14em;">
    <span style="color:var(--text-muted);text-transform:uppercase;">↻ ${m.lastUpdate}</span>
    <a href="#demo" style="color:var(--azul-claro);text-decoration:none;font-weight:500;text-transform:uppercase;">Solicitar demo →</a>
  </div>
</div>
  `.trim();
}

// ---------------- PLATFORM MAP ----------------
function PlatformMap() {
  const [ref, visible] = window.useReveal(0.1);
  const mapRef = React.useRef(null);
  const mapInstance = React.useRef(null);
  const markersRef = React.useRef([]);
  const popupRef = React.useRef(null);
  const [active, setActive] = React.useState(0);
  const [range, setRange] = React.useState('24 h');
  const [ready, setReady] = React.useState(false);
  const [mapError, setMapError] = React.useState('');

  React.useEffect(() => {
    let cancelled = false;

    async function initializeMap() {
      if (!mapRef.current || mapInstance.current) return;
      const mgl = window.mapboxgl;
      if (!mgl) { setMapError('No se pudo cargar Mapbox'); return; }

      const token = await getMapboxToken();
      if (cancelled) return;
      if (!token) { setMapError('Mapa demostrativo · token no disponible'); return; }

      mgl.accessToken = token;

      const map = new mgl.Map({
        container: mapRef.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [-68.66, -23.78],
        zoom: 7.4,
        pitch: 35,
        bearing: -12,
        interactive: true,
        attributionControl: false,
      });
      mapInstance.current = map;

      map.on('error', () => { if (!cancelled) setMapError('No se pudo inicializar el mapa'); });

      map.on('load', () => {
        if (cancelled) return;
        setReady(true);

        try {
          if (map.getLayer('background')) map.setPaintProperty('background', 'background-color', '#17181B');
          const layers = map.getStyle().layers || [];
          layers.forEach(l => {
            if (l.id.includes('water')) { try { map.setPaintProperty(l.id, 'fill-color', '#121316'); } catch {} }
            if (l.id.includes('land') && l.type === 'background') { try { map.setPaintProperty(l.id, 'background-color', '#17181B'); } catch {} }
            if (l.id === 'national-park') { try { map.setPaintProperty(l.id, 'fill-color', '#1F2024'); } catch {} }
            if (l.id === 'landuse') { try { map.setPaintProperty(l.id, 'fill-color', '#1F2024'); } catch {} }
          });
          ['poi-label', 'transit-label', 'road-label', 'road-number-shield', 'road-exit-shield',
           'airport-label', 'place-label-other', 'natural-line-label', 'water-line-label',
           'road-pedestrian', 'road-minor', 'road-secondary-tertiary'].forEach(layerId => {
            if (map.getLayer(layerId)) { try { map.setLayoutProperty(layerId, 'visibility', 'none'); } catch {} }
          });
          map.setFog({ 'color': '#17181B', 'high-color': '#1F2024', 'horizon-blend': 0.1, 'space-color': '#121316', 'star-intensity': 0, 'range': [0.5, 8] });
          if (map.getSource('mapbox-dem')) map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.2 });
        } catch (e) { /* ignore */ }

        markersRef.current = NODES.map((n, i) => {
          const wrap = document.createElement('div');
          wrap.style.cssText = 'position:relative;width:12px;height:12px;pointer-events:auto;cursor:pointer;';
          const ringColor = MARKER_COLOR[n.kind] || MARKER_COLOR.env;

          const ring = document.createElement('div');
          ring.style.cssText = `position:absolute;inset:0;border-radius:50%;border:1px solid ${ringColor};animation:ringPulse 2s ease-out infinite;`;
          wrap.appendChild(ring);

          const dot = document.createElement('div');
          dot.style.cssText = `position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:5px;height:5px;border-radius:50%;background:${ringColor};transition:transform .25s;`;
          wrap.appendChild(dot);

          wrap.addEventListener('mouseenter', () => { setActive(i); dot.style.transform = 'translate(-50%,-50%) scale(1.5)'; });
          wrap.addEventListener('mouseleave', () => { dot.style.transform = 'translate(-50%,-50%) scale(1)'; });
          wrap.addEventListener('click', (e) => {
            e.stopPropagation();
            setActive(i);
            if (popupRef.current) { popupRef.current.remove(); popupRef.current = null; }
            const popup = new mgl.Popup({ offset: [0, -18], closeButton: false, closeOnClick: true, anchor: 'bottom', maxWidth: '320px' })
              .setLngLat([n.lng, n.lat]).setHTML(buildPopupHTML(n)).addTo(map);
            popup.on('close', () => { if (popupRef.current === popup) popupRef.current = null; });
            popupRef.current = popup;
            map.easeTo({ center: [n.lng, n.lat], duration: 800, essential: true });
          });

          const marker = new mgl.Marker({ element: wrap, anchor: 'center' }).setLngLat([n.lng, n.lat]).addTo(map);
          marker._nodeIndex = i;
          return marker;
        });
      });
    }

    initializeMap();

    return () => {
      cancelled = true;
      if (popupRef.current) { popupRef.current.remove(); popupRef.current = null; }
      markersRef.current.forEach(m => m.remove());
      if (mapInstance.current) { mapInstance.current.remove(); mapInstance.current = null; }
    };
  }, []);

  React.useEffect(() => {
    markersRef.current.forEach((m, i) => {
      const el = m.getElement();
      const dot = el.querySelector('div:last-child');
      if (!dot) return;
      dot.style.boxShadow = i === active ? '0 0 0 3px rgba(92,130,160,0.5)' : 'none';
    });
  }, [active]);

  return (
    <section id="platform" className="platform-section" ref={ref} style={{ padding: '0 2.5rem 140px', maxWidth: 1320, margin: '0 auto' }}>
      <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(30px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)' }}>

        <window.ChapterLabel number="04" title="La plataforma" />

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, marginBottom: 48 }}>
          <h2 style={{
            fontFamily: 'Manrope, sans-serif',
            fontSize: 'clamp(2rem, 3.6vw, 3rem)', fontWeight: 800,
            letterSpacing: '-0.03em', color: 'var(--paper)',
            textWrap: 'balance', lineHeight: 1.0, margin: 0, maxWidth: 760,
          }}>
            El territorio completo, <span style={{ color: 'var(--azul-claro)' }}>en un sistema integrado.</span>
          </h2>
          <div role="tablist" aria-label="Rango temporal" style={{ display: 'flex', gap: 0, border: '1px solid var(--line-strong)' }}>
            {['24 h', '7 d', '30 d'].map((p) => {
              const act = range === p;
              return (
                <button key={p} role="tab" aria-selected={act} onClick={() => setRange(p)} style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.14em',
                  background: act ? 'var(--azul-civico)' : 'transparent',
                  border: 'none',
                  color: act ? 'var(--paper)' : 'var(--text-muted)',
                  padding: '10px 18px', cursor: 'pointer', transition: 'all 0.2s',
                }}>{p}</button>
              );
            })}
          </div>
        </div>

        <div className="platform-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 0, border: '1px solid var(--line-strong)' }}>

          <div className="platform-map" style={{ position: 'relative', height: 600, borderRight: '1px solid var(--line-strong)', background: 'var(--bg)' }}>
            <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

            <div style={{ position: 'absolute', top: 20, left: 32, display: 'flex', flexDirection: 'column', gap: 6, zIndex: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ position: 'relative', width: 7, height: 7 }}>
                  <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'var(--azul-claro)' }} />
                  <span style={{ position: 'absolute', inset: -3, borderRadius: '50%', border: '1px solid var(--azul-claro)', animation: 'ringPulse 2s ease-out infinite' }} />
                </span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--azul-claro)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 500 }}>Datos en vivo</span>
              </div>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'var(--text-soft)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>Territorio demostrativo · datos mock</span>
            </div>

            {(!ready || mapError) && (
              <div style={{ position: 'absolute', inset: 0, background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, padding: 24, textAlign: 'center' }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: mapError ? 'var(--terracota)' : 'var(--text-soft)', letterSpacing: '0.2em' }}>{mapError || 'CARGANDO TERRITORIO'}</span>
              </div>
            )}

            <div style={{ position: 'absolute', bottom: 16, left: 16, fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--text-soft)', letterSpacing: '0.14em', textTransform: 'uppercase', zIndex: 2 }}>
              <window.SectionMark /> 04 · Estaciones, comunidad y alertas
            </div>
          </div>

          {/* Indicator panel */}
          <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--surface)' }}>
            <div style={{ padding: '20px 22px', borderBottom: '1px solid var(--line-strong)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--azul-claro)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Indicadores · {range}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--azul-claro)', animation: 'blink 1.2s infinite' }} />
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'var(--azul-claro)', letterSpacing: '0.14em' }}>EN VIVO</span>
              </span>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {INDICATORS.map((k, i) => {
                const isActive = active === i;
                return (
                  <button key={i} onMouseEnter={() => setActive(i)} onClick={() => setActive(i)} style={{
                    width: '100%', textAlign: 'left', cursor: 'pointer',
                    padding: '18px 22px',
                    background: isActive ? 'var(--surface-2)' : 'transparent',
                    border: 'none', borderBottom: '1px dashed var(--line)',
                    display: 'flex', flexDirection: 'column', gap: 10,
                    transition: 'background 0.2s', fontFamily: 'inherit',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--text-soft)', letterSpacing: '0.12em' }}>{k.code}</span>
                        <span style={{ fontFamily: 'Source Sans 3, sans-serif', fontSize: 14, fontWeight: 600, color: 'var(--paper)', letterSpacing: '-0.01em' }}>{k.label}</span>
                      </div>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: k.color, flexShrink: 0 }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ flex: 1, height: 2, background: 'rgba(245,242,235,0.08)', position: 'relative' }}>
                        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${k.fill}%`, background: k.color, transition: 'width 0.6s cubic-bezier(0.16,1,0.3,1)' }} />
                      </div>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{k.state}</span>
                    </div>
                  </button>
                );
              })}
            </div>
            <div style={{ padding: '18px 22px', borderTop: '1px solid var(--line-strong)', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, color: 'var(--text-soft)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 4 }}>Dominios integrados</div>
                <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: 18, fontWeight: 700, color: 'var(--paper)', letterSpacing: '-0.02em' }}>Ambiental · Social</div>
              </div>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 9h14m-5-5l5 5-5 5" stroke="var(--azul-claro)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--text-soft)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Fig. 01</span>
          <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
          <span style={{ fontFamily: 'Source Sans 3, sans-serif', fontSize: 13, color: 'var(--text-muted)' }}>
            Estaciones, puntos comunitarios y alertas sobre un territorio demostrativo. Datos mock; no corresponden a una operación real.
          </span>
        </div>
      </div>
    </section>
  );
}

// ---------------- LA PLATAFORMA EN USO (capturas reales) ----------------
function BrowserFrame({ src, alt, label }) {
  return (
    <figure style={{ margin: 0, border: '1px solid var(--line-strong)', background: 'var(--surface)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderBottom: '1px solid var(--line)', background: 'var(--surface-2)' }}>
        <span style={{ display: 'flex', gap: 6 }}>
          {['var(--terracota)', 'var(--gris-ciudad)', 'var(--azul-claro)'].map((c, i) => (
            <span key={i} style={{ width: 9, height: 9, borderRadius: '50%', background: c, opacity: 0.7 }} />
          ))}
        </span>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--text-soft)', letterSpacing: '0.1em', marginLeft: 8 }}>simcii-poc.accionet.net</span>
      </div>
      <img src={src} alt={alt} loading="lazy" style={{ width: '100%', display: 'block' }} />
      {label && <figcaption style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--text-soft)', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '10px 14px', borderTop: '1px solid var(--line)' }}>{label}</figcaption>}
    </figure>
  );
}

function CountUp({ to, decimals = 1, duration = 1200 }) {
  const [val, setVal] = React.useState(0);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setVal(to); return; }
    let raf, start;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      const tick = (t) => {
        if (!start) start = t;
        const p = Math.min((t - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setVal(to * eased);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => { obs.disconnect(); cancelAnimationFrame(raf); };
  }, [to, duration]);
  return <span ref={ref} style={{ fontVariantNumeric: 'tabular-nums' }}>{val.toFixed(decimals)}</span>;
}

const DEMO_SCORES = [
  { label: 'General', value: 71.2 },
  { label: 'Territorial', value: 85.7 },
  { label: 'Contexto', value: 73.9 },
  { label: 'Comunidad', value: 53.9 },
];

function CaseStudy() {
  const [ref, visible] = window.useReveal(0.12);
  return (
    <section id="casestudy" className="casestudy-section" ref={ref} style={{ padding: '0 2.5rem 140px', maxWidth: 1320, margin: '0 auto' }}>
      <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(30px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)' }}>

        <window.ChapterLabel number="07" title="La plataforma en uso" />

        <h2 style={{
          fontFamily: 'Manrope, sans-serif', fontSize: 'clamp(1.9rem, 3.2vw, 2.8rem)', fontWeight: 800,
          letterSpacing: '-0.03em', color: 'var(--paper)', lineHeight: 1.02, marginBottom: 18, maxWidth: 820, textWrap: 'balance',
        }}>
          Un score por territorio, <span style={{ color: 'var(--azul-claro)' }}>no una hoja de cálculo.</span>
        </h2>
        <p style={{ fontFamily: 'Source Sans 3, sans-serif', fontSize: 16, lineHeight: 1.6, color: 'var(--text-muted)', maxWidth: 640, marginBottom: 48, textWrap: 'pretty' }}>
          SIMCII compone indicadores ambientales y sociales en puntajes comparables (0–100) y los muestra sobre el mapa, los actores y los compromisos. Lo que sigue son capturas reales del POC con datos demostrativos.
        </p>

        {/* Scores reales del demo */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--line)', border: '1px solid var(--line-strong)', marginBottom: 48 }} className="scores-grid">
          {DEMO_SCORES.map((s, i) => (
            <div key={i} style={{ background: 'var(--surface)', padding: '28px 24px' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--text-soft)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 12 }}>{s.label}</div>
              <div style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.03em', color: i === 1 ? 'var(--azul-claro)' : 'var(--paper)', lineHeight: 1 }}>
                <CountUp to={s.value} />
                <span style={{ fontSize: '0.4em', color: 'var(--text-soft)', fontWeight: 500 }}> /100</span>
              </div>
            </div>
          ))}
        </div>

        <div className="casestudy-grid" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24, alignItems: 'start' }}>
          <BrowserFrame src="assets/capturas/01-home.png" alt="Resumen general de SIMCII: scores territoriales, parámetros en tiempo real y mapa de zonas de riesgo." label="Fig. 02 · Resumen general · scores y mapa" />
          <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: 24 }}>
            <BrowserFrame src="assets/capturas/04-comunidad.png" alt="Módulo de comunidad: actores territoriales y relacionamiento." label="Fig. 03 · Comunidad y actores" />
            <BrowserFrame src="assets/capturas/05-gestion.png" alt="Gestión territorial: compromisos y seguimiento." label="Fig. 04 · Gestión y compromisos" />
          </div>
        </div>

        <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 8, height: 1, background: 'var(--text-soft)' }} />
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--text-soft)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>Capturas del POC · datos demostrativos</span>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { PlatformMap, CaseStudy, BrowserFrame, CountUp });
