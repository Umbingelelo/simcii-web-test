
// Platform (Mapbox dark + bitácora palette) + Case Study (editorial cross-section)

async function getMapboxToken() {
  const config = typeof window.getSimciiConfig === 'function'
    ? await window.getSimciiConfig()
    : (window.SIMCII_CONFIG || {});

  return config.mapboxToken || '';
}

const NODES = [
  { id: 'A1', lng: -68.92, lat: -23.60, kind: 'env',   label: 'Nodo ambiental A1' },
  { id: 'A2', lng: -68.42, lat: -23.20, kind: 'env',   label: 'Nodo ambiental A2' },
  { id: 'C1', lng: -68.78, lat: -23.78, kind: 'com',   label: 'Punto comunitario C1' },
  { id: 'X1', lng: -68.60, lat: -23.90, kind: 'alert', label: 'Evento X1' },
];

const INDICATORS = [
  { code: 'ENV-01', label: 'Material particulado',     state: 'dentro de rango',   fill: 62, color: 'var(--fosforo)' },
  { code: 'ENV-02', label: 'Gases y compuestos',       state: 'dentro de rango',   fill: 44, color: 'var(--fosforo)' },
  { code: 'ENV-03', label: 'Ruido diurno',             state: 'tendencia al alza', fill: 72, color: 'var(--ambar)' },
  { code: 'SOC-01', label: 'Satisfacción comunitaria', state: 'estable',           fill: 78, color: 'var(--fosforo)' },
  { code: 'SOC-02', label: 'Reportes ciudadanos',      state: 'bajo umbral',       fill: 28, color: 'var(--fosforo)' },
  { code: 'SOC-03', label: 'Compromisos activos',      state: 'en ejecución',      fill: 66, color: 'var(--altiplano)' },
];

function getNodeMetrics(n) {
  if (n.kind === 'env') {
    return {
      kindLabel: 'Sensor ambiental',
      status: { label: 'Operativo', color: 'var(--fosforo)' },
      readings: [
        { label: 'PM10',  value: '38 µg/m³', fill: 38 },
        { label: 'NO₂',   value: '12 ppb',   fill: 24 },
        { label: 'Ruido', value: '52 dB',    fill: 60 },
      ],
      lastUpdate: 'hace 1 min',
    };
  }
  if (n.kind === 'com') {
    return {
      kindLabel: 'Punto comunitario',
      status: { label: 'Activo', color: 'var(--altiplano)' },
      readings: [
        { label: 'Satisfacción', value: '78 %',       fill: 78 },
        { label: 'Reportes',     value: '03 / sem',   fill: 22 },
        { label: 'Compromisos',  value: '12 activos', fill: 66 },
      ],
      lastUpdate: 'hace 4 min',
    };
  }
  return {
    kindLabel: 'Evento detectado',
    status: { label: 'Atención requerida', color: 'var(--oxido)' },
    readings: [
      { label: 'Severidad',    value: 'Media',     fill: 55 },
      { label: 'Correlación',  value: '02 nodos',  fill: 40 },
      { label: 'Edad evento',  value: '08 min',    fill: 15 },
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
        <span style="font-family:'Geist Mono',monospace;font-size:10px;color:var(--text-muted);letter-spacing:0.16em;text-transform:uppercase;">${r.label}</span>
        <span style="font-family:'Newsreader',serif;font-weight:400;font-size:24px;font-variation-settings:'opsz' 36;color:var(--hueso);">${r.value}</span>
      </div>
      <div style="height:2px;background:rgba(242,237,228,0.08);position:relative;">
        <div style="position:absolute;left:0;top:0;bottom:0;width:${r.fill}%;background:${m.status.color};transition:width 0.6s cubic-bezier(0.16,1,0.3,1);"></div>
      </div>
    </div>
  `).join('');
  return `
<div style="background:var(--azul-gris-2);border:1px solid var(--line-strong);width:300px;font-family:'Geist',sans-serif;color:var(--hueso);overflow:hidden;">
  <div style="padding:10px 14px;display:flex;justify-content:space-between;align-items:center;font-family:'Geist Mono',monospace;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:var(--altiplano);border-bottom:1px solid var(--line);">
    <span>${m.kindLabel}</span><span style="opacity:.65;">${n.id}</span>
  </div>
  <div style="padding:16px 18px;">
    <div style="font-family:'Geist Mono',monospace;font-size:9.5px;color:var(--text-soft);letter-spacing:0.16em;margin-bottom:14px;">${latStr} · ${lngStr}</div>
    <div style="display:inline-flex;align-items:center;gap:7px;padding:4px 9px;border:1px solid var(--line);margin-bottom:18px;">
      <span style="width:6px;height:6px;border-radius:50%;background:${m.status.color};animation:blink 1.2s infinite;"></span>
      <span style="font-family:'Geist Mono',monospace;font-size:9.5px;color:${m.status.color};letter-spacing:0.16em;text-transform:uppercase;">${m.status.label}</span>
    </div>
    <div style="display:flex;flex-direction:column;gap:11px;">${readings}</div>
  </div>
  <div style="border-top:1px solid var(--line);padding:10px 14px;display:flex;justify-content:space-between;align-items:center;font-family:'Geist Mono',monospace;font-size:9.5px;letter-spacing:0.14em;">
    <span style="color:var(--text-muted);text-transform:uppercase;">↻ ${m.lastUpdate}</span>
    <a href="#contact" style="color:var(--altiplano);text-decoration:none;font-weight:500;text-transform:uppercase;">Ver detalle →</a>
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
      if (!mgl) {
        setMapError('No se pudo cargar Mapbox');
        return;
      }

      const token = await getMapboxToken();
      if (cancelled) return;
      if (!token) {
        setMapError('Falta MAPBOX_TOKEN');
        return;
      }

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

      map.on('error', () => {
        if (!cancelled) setMapError('No se pudo inicializar el mapa');
      });

      map.on('load', () => {
        if (cancelled) return;
        setReady(true);

      // Recolor layers to bitácora palette
      try {
        if (map.getLayer('background')) map.setPaintProperty('background', 'background-color', '#15191C');
        const layers = map.getStyle().layers || [];
        layers.forEach(l => {
          if (l.id.includes('water')) {
            try { map.setPaintProperty(l.id, 'fill-color', '#0E1115'); } catch {}
          }
          if (l.id.includes('land') && l.type === 'background') {
            try { map.setPaintProperty(l.id, 'background-color', '#15191C'); } catch {}
          }
          if (l.id === 'national-park') {
            try { map.setPaintProperty(l.id, 'fill-color', '#1B2025'); } catch {}
          }
          if (l.id === 'landuse') {
            try { map.setPaintProperty(l.id, 'fill-color', '#1B2025'); } catch {}
          }
          if (l.id.includes('hillshade')) {
            try { map.setPaintProperty(l.id, 'hillshade-shadow-color', '#0E1115'); } catch {}
          }
        });

        // Hide non-essential layers
        ['poi-label', 'transit-label', 'road-label', 'road-number-shield', 'road-exit-shield',
         'airport-label', 'place-label-other', 'natural-line-label', 'water-line-label',
         'road-pedestrian', 'road-minor', 'road-secondary-tertiary'].forEach(layerId => {
          if (map.getLayer(layerId)) {
            try { map.setLayoutProperty(layerId, 'visibility', 'none'); } catch {}
          }
        });

        // Fog
        map.setFog({
          'color': '#15191C',
          'high-color': '#1B2025',
          'horizon-blend': 0.1,
          'space-color': '#0E1115',
          'star-intensity': 0,
          'range': [0.5, 8]
        });

        if (map.getSource('mapbox-dem')) {
          map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.2 });
        }
      } catch (e) { /* ignore */ }

      // Add DOM markers — simplified: core 4px + ring 12px
      markersRef.current = NODES.map((n, i) => {
        const wrap = document.createElement('div');
        wrap.style.cssText = 'position:relative;width:12px;height:12px;pointer-events:auto;cursor:pointer;';

        const ringColor = n.kind === 'alert' ? '#8C2A1C' : n.kind === 'com' ? '#FFB547' : '#6EF0FF';

        // Pulse ring
        const ring = document.createElement('div');
        ring.style.cssText = `position:absolute;inset:0;border-radius:50%;border:1px solid ${ringColor};animation:ringPulse 2s ease-out infinite;`;
        wrap.appendChild(ring);

        // Core dot
        const dot = document.createElement('div');
        dot.style.cssText = 'position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:4px;height:4px;border-radius:50%;background:#F2EDE4;transition:transform .25s;';
        wrap.appendChild(dot);

        wrap.addEventListener('mouseenter', () => {
          setActive(i);
          dot.style.transform = 'translate(-50%,-50%) scale(1.5)';
        });
        wrap.addEventListener('mouseleave', () => {
          dot.style.transform = 'translate(-50%,-50%) scale(1)';
        });

        wrap.addEventListener('click', (e) => {
          e.stopPropagation();
          setActive(i);

          if (popupRef.current) {
            popupRef.current.remove();
            popupRef.current = null;
          }

          const popup = new mgl.Popup({
            offset: [0, -18],
            closeButton: false,
            closeOnClick: true,
            anchor: 'bottom',
            maxWidth: '320px',
          })
            .setLngLat([n.lng, n.lat])
            .setHTML(buildPopupHTML(n))
            .addTo(map);

          popup.on('close', () => {
            if (popupRef.current === popup) popupRef.current = null;
          });
          popupRef.current = popup;

          map.easeTo({ center: [n.lng, n.lat], duration: 800, essential: true });
        });

        const marker = new mgl.Marker({ element: wrap, anchor: 'center' })
          .setLngLat([n.lng, n.lat])
          .addTo(map);
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
      if (i === active) {
        dot.style.boxShadow = '0 0 0 3px #6EF0FF';
      } else {
        dot.style.boxShadow = 'none';
      }
    });
  }, [active]);

  return (
    <section id="platform" className="platform-section" ref={ref} style={{ padding: '0 2.5rem 140px', maxWidth: 1320, margin: '0 auto' }}>
      <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(30px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)' }}>

        <window.ChapterLabel number="04" title="La plataforma" />

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, marginBottom: 48 }}>
          <h2 style={{
            fontFamily: 'Newsreader, serif',
            fontSize: 'clamp(2rem, 3.6vw, 3rem)', fontWeight: 400,
            fontVariationSettings: '"opsz" 72',
            letterSpacing: '-0.025em', color: 'var(--hueso)',
            textWrap: 'balance', lineHeight: 1.05, margin: 0, maxWidth: 720,
          }}>
            Visibilidad y comprensión total del territorio, <em style={{
              fontStyle: 'italic', fontWeight: 400, color: 'var(--altiplano)',
              fontVariationSettings: '"opsz" 36',
            }}>a través de un sistema integrado.</em>
          </h2>
          <div style={{ display: 'flex', gap: 0, border: '1px solid var(--line-strong)' }}>
            {['24 h', '7 d', '30 d'].map((p) => {
              const act = range === p;
              return (
                <button key={p} onClick={() => setRange(p)} style={{
                  fontFamily: 'Geist Mono, monospace', fontSize: 10, letterSpacing: '0.14em',
                  background: act ? 'var(--altiplano)' : 'transparent',
                  border: 'none',
                  color: act ? 'var(--azul-gris)' : 'var(--hueso)',
                  padding: '10px 18px', cursor: 'pointer', transition: 'all 0.2s',
                }}>{p}</button>
              );
            })}
          </div>
        </div>

        <div className="platform-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 0, border: '1px solid var(--line-strong)' }}>

          {/* Map column */}
          <div className="platform-map" style={{ position: 'relative', height: 600, borderRight: '1px solid var(--line-strong)', background: 'var(--azul-gris)' }}>
            <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

            {/* Top-left HUD */}
            <div style={{ position: 'absolute', top: 20, left: 32, display: 'flex', flexDirection: 'column', gap: 6, zIndex: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ position: 'relative', width: 7, height: 7 }}>
                  <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'var(--altiplano)' }} />
                  <span style={{ position: 'absolute', inset: -3, borderRadius: '50%', border: '1px solid var(--altiplano)', animation: 'ringPulse 2s ease-out infinite' }} />
                </span>
                <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10, color: 'var(--altiplano)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 500 }}>Flujo en vivo</span>
              </div>
              <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 9, color: 'var(--text-soft)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>Territorio demostrativo · Red 04 nodos</span>
            </div>

            {/* Loading state */}
            {(!ready || mapError) && (
              <div style={{ position: 'absolute', inset: 0, background: 'var(--azul-gris)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
                <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10, color: mapError ? 'var(--oxido)' : 'var(--text-soft)', letterSpacing: '0.2em' }}>{mapError || 'CARGANDO TERRITORIO'}</span>
              </div>
            )}

            {/* Scan bar */}
            <div style={{ position: 'absolute', bottom: 72, left: 32, right: 32, height: 1, background: 'var(--line)', pointerEvents: 'none', zIndex: 2 }}>
              <div className="scan-sweep" style={{ position: 'absolute', top: -1, width: 80, height: 2, background: 'linear-gradient(90deg, transparent, var(--altiplano), transparent)' }} />
            </div>

            {/* Editorial overlays */}
            <div style={{ position: 'absolute', bottom: 16, left: 16, fontFamily: 'Geist Mono, monospace', fontSize: 10, color: 'var(--text-soft)', letterSpacing: '0.14em', textTransform: 'uppercase', zIndex: 2 }}>
              § 04 · MAPA TERRITORIAL · ZONA NORTE
            </div>
            <div style={{ position: 'absolute', bottom: 16, right: 16, fontFamily: 'Geist Mono, monospace', fontSize: 10, color: 'var(--text-soft)', letterSpacing: '0.14em', textTransform: 'uppercase', zIndex: 2 }}>
              ESCALA 1:50000 · DATUM WGS84
            </div>
          </div>

          {/* Indicator panel */}
          <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--azul-gris-2)' }}>
            <div style={{ padding: '20px 22px', borderBottom: '1px solid var(--line-strong)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10, color: 'var(--altiplano)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Indicadores · {range}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--fosforo)', animation: 'blink 1.2s infinite' }} />
                <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 9, color: 'var(--fosforo)', letterSpacing: '0.14em' }}>EN VIVO</span>
              </span>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {INDICATORS.map((k, i) => {
                const isActive = active === i;
                return (
                  <button
                    key={i}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => setActive(i)}
                    style={{
                      width: '100%', textAlign: 'left', cursor: 'pointer',
                      padding: '18px 22px',
                      background: isActive ? 'var(--azul-gris-3)' : 'transparent',
                      border: 'none',
                      borderBottom: '1px dashed var(--line)',
                      display: 'flex', flexDirection: 'column', gap: 10,
                      transition: 'background 0.2s',
                      fontFamily: 'inherit',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                        <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10, color: 'var(--text-soft)', letterSpacing: '0.12em' }}>{k.code}</span>
                        <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 14, fontWeight: 500, color: 'var(--hueso)', letterSpacing: '-0.01em' }}>{k.label}</span>
                      </div>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: k.color, flexShrink: 0 }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ flex: 1, height: 2, background: 'rgba(242,237,228,0.08)', position: 'relative' }}>
                        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${k.fill}%`, background: k.color, transition: 'width 0.6s cubic-bezier(0.16,1,0.3,1)' }} />
                      </div>
                      <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{k.state}</span>
                    </div>
                  </button>
                );
              })}
            </div>
            <div style={{ padding: '18px 22px', borderTop: '1px solid var(--line-strong)', background: 'var(--azul-gris-3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontFamily: 'Geist Mono, monospace', fontSize: 9.5, color: 'var(--text-soft)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 4 }}>Latencia de red</div>
                <div style={{ fontFamily: 'Newsreader, serif', fontSize: 22, fontWeight: 400, color: 'var(--hueso)', letterSpacing: '-0.02em' }}>&lt; 5 min</div>
              </div>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 9h14m-5-5l5 5-5 5" stroke="var(--altiplano)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          </div>
        </div>

        {/* Caption */}
        <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10, color: 'var(--text-soft)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Fig. 01</span>
          <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
          <span style={{ fontFamily: 'Geist, sans-serif', fontSize: 13, color: 'var(--text-muted)' }}>
            Red SIMCII ilustrada sobre un territorio demostrativo. Nodos y coordenadas no corresponden a una operación real.
          </span>
        </div>
      </div>
    </section>
  );
}

// ---------------- CASE STUDY ----------------
function CaseStudy() {
  const [ref, visible] = window.useReveal(0.15);
  return (
    <section id="casestudy" className="casestudy-section" ref={ref} style={{ padding: '0 2.5rem 140px', maxWidth: 1320, margin: '0 auto' }}>
      <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(30px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)' }}>

        <window.ChapterLabel number="05" title="Cómo se ve en práctica" />

        <div className="casestudy-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: 80, alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10, color: 'var(--altiplano)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 18 }}>§ Caso ilustrativo</div>

            <h2 style={{
              fontFamily: 'Newsreader, serif',
              fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)', fontWeight: 400,
              fontVariationSettings: '"opsz" 72',
              letterSpacing: '-0.025em', color: 'var(--hueso)',
              lineHeight: 1.15, marginBottom: 32, textWrap: 'balance',
            }}>
              Tu operación y su entorno, <em style={{
                fontStyle: 'italic', color: 'var(--altiplano)',
                fontVariationSettings: '"opsz" 36',
              }}>en la misma ecuación.</em>
            </h2>

            <p style={{ fontFamily: 'Geist, sans-serif', fontSize: 16, lineHeight: 1.7, color: 'var(--text-muted)', marginBottom: 22, textWrap: 'pretty' }}>
              Lo que ocurre fuera de tu operación impacta directamente en ella.
            </p>
            <p style={{ fontFamily: 'Geist, sans-serif', fontSize: 16, lineHeight: 1.7, color: 'var(--text-muted)', marginBottom: 36, textWrap: 'pretty' }}>
              SIMCII conecta ambos mundos para que puedas <em style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic', fontVariationSettings: '"opsz" 36', color: 'var(--altiplano)' }}>anticiparte, no reaccionar.</em>
            </p>

            <div style={{ marginTop: 28, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 8, height: 1, background: 'var(--text-soft)' }} />
              <span style={{ fontFamily: 'Geist Mono, monospace', fontSize: 10, color: 'var(--text-soft)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>Caso ilustrativo · no corresponde a operación real</span>
            </div>
          </div>

          <div style={{ position: 'relative', border: '1px solid var(--line-strong)', background: 'var(--azul-gris-2)', aspectRatio: '1.15 / 1', overflow: 'hidden' }}>
            <CrossSectionDiagram />
            <div style={{ position: 'absolute', top: 16, left: 16, fontFamily: 'Geist Mono, monospace', fontSize: 10, color: 'var(--text-soft)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>Fig. 02 · Corte transversal</div>
            <div style={{ position: 'absolute', top: 16, right: 16, fontFamily: 'Geist Mono, monospace', fontSize: 9, color: 'var(--text-soft)', letterSpacing: '0.18em' }}>ESC · DEMO</div>
            <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', fontFamily: 'Geist Mono, monospace', fontSize: 9, color: 'var(--text-soft)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              <span>← Faena</span>
              <span>Territorio</span>
              <span>Comunidad →</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------- CROSS-SECTION DIAGRAM ----------------
function CrossSectionDiagram() {
  const [t, setT] = React.useState(0);
  React.useEffect(() => {
    let raf;
    const loop = () => { setT(performance.now() / 1000); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const sensors = [
    { x: 20, y: 38, id: 'A1' },
    { x: 36, y: 32, id: 'A2' },
    { x: 52, y: 36, id: 'A3' },
    { x: 68, y: 32, id: 'A4' },
    { x: 82, y: 38, id: 'A5' },
  ];
  const communities = [
    { x: 26, y: 80, id: 'C1' },
    { x: 50, y: 84, id: 'C2' },
    { x: 78, y: 76, id: 'C3' },
  ];
  const facility = { x: 50, y: 56 };

  return (
    <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', display: 'block' }} preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#1B2025" />
          <stop offset="1" stopColor="#15191C" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="64" fill="url(#sky)" opacity="0.4" />

      {/* Guide grid dots */}
      {[...Array(10)].map((_, gy) => (
        [...Array(10)].map((_, gx) => (
          <circle key={`g-${gx}-${gy}`} cx={5 + gx * 10} cy={5 + gy * 10} r="0.3" fill="rgba(242,237,228,0.08)" />
        ))
      )).flat()}

      {/* Horizon line */}
      <path d="M0 64 Q20 58 40 62 T70 60 T100 64" stroke="var(--hueso)" strokeWidth="0.35" fill="none" opacity="0.3" />

      {/* Ground fill */}
      <path d="M0 100 L0 64 Q20 58 40 62 T70 60 T100 64 L100 100 Z" fill="rgba(110,240,255,0.03)" />
      {[...Array(12)].map((_, i) => (
        <line key={`h-${i}`} x1={i * 9} y1="66" x2={i * 9 - 4} y2="100" stroke="rgba(242,237,228,0.04)" strokeWidth="0.3" />
      ))}

      {/* Facility */}
      <g transform={`translate(${facility.x}, ${facility.y})`}>
        <line x1="-10" y1="8" x2="10" y2="8" stroke="var(--altiplano)" strokeWidth="0.4" strokeDasharray="1 0.6" opacity="0.5" />
        <rect x="-5" y="-1" width="10" height="9" fill="var(--azul-gris-2)" stroke="var(--hueso)" strokeWidth="0.4" opacity="0.6" />
        <path d="M-5 -1 L0 -4 L5 -1" fill="none" stroke="var(--hueso)" strokeWidth="0.4" opacity="0.6" />
        <line x1="0" y1="-4" x2="0" y2="-12" stroke="var(--hueso)" strokeWidth="0.4" opacity="0.5" />
        {[0,1,2].map(i => {
          const phase = ((t * 0.6 + i * 0.7) % 3) / 3;
          return (
            <circle key={i} cx={Math.sin(phase * 6) * 1.5} cy={-12 - phase * 8} r={0.6 + phase * 0.8} fill="var(--hueso)" opacity={0.15 * (1 - phase)} />
          );
        })}
        <text x="8" y="4" fontFamily="Geist Mono, monospace" fontSize="2.2" fill="var(--text-soft)" letterSpacing="0.3">F1</text>
      </g>

      {/* Sensors */}
      {sensors.map(s => {
        const pulse = (Math.sin(t * 2 + s.x * 0.1) + 1) / 2;
        return (
          <g key={s.id}>
            <line x1={s.x} y1={64} x2={s.x} y2={s.y + 1} stroke="var(--hueso)" strokeWidth="0.22" opacity="0.3" />
            <path d={`M${s.x - 1.2} 64 L${s.x + 1.2} 64 L${s.x} 63 Z`} fill="var(--hueso)" opacity="0.3" />
            <circle cx={s.x} cy={s.y} r={1.2 + pulse * 2.2} fill="none" stroke="var(--altiplano)" strokeWidth="0.15" opacity={1 - pulse} />
            <circle cx={s.x} cy={s.y} r={1.1} fill="var(--altiplano)" />
            <circle cx={s.x} cy={s.y} r={0.4} fill="var(--azul-gris)" />
            <text x={s.x + 2} y={s.y - 0.8} fontFamily="Geist Mono, monospace" fontSize="2" fill="var(--text-muted)" letterSpacing="0.25">{s.id}</text>
          </g>
        );
      })}

      {/* Communities */}
      {communities.map(c => (
        <g key={c.id} transform={`translate(${c.x}, ${c.y})`}>
          <path d="M-2.2 2 L-2.2 -1 L0 -2.8 L2.2 -1 L2.2 2 Z" fill="var(--fosforo)" opacity="0.7" />
          <rect x="-0.7" y="0.3" width="1.4" height="1.7" fill="var(--azul-gris)" />
          <line x1="-4" y1="2.2" x2="4" y2="2.2" stroke="var(--hueso)" strokeWidth="0.25" opacity="0.3" />
          <text x="4" y="1.2" fontFamily="Geist Mono, monospace" fontSize="2" fill="var(--text-muted)" letterSpacing="0.25">{c.id}</text>
        </g>
      ))}

      {/* Correlation arcs */}
      {sensors.map((s, i) => {
        const c = communities[i % communities.length];
        const offset = (t * 5 + i * 3) % 8;
        const midX = (s.x + c.x) / 2;
        const midY = (s.y + c.y) / 2 - 14;
        return (
          <path
            key={i}
            d={`M${s.x} ${s.y} Q${midX} ${midY} ${c.x} ${c.y - 3}`}
            stroke="var(--altiplano)" strokeWidth="0.3" fill="none"
            strokeDasharray="0.8 1.8" strokeDashoffset={-offset} opacity="0.35"
          />
        );
      })}

      {/* Axis ticks */}
      {[20, 40, 60, 80].map(y => (
        <g key={y}>
          <line x1="0" y1={y} x2="1.4" y2={y} stroke="var(--hueso)" strokeWidth="0.2" opacity="0.3" />
          <text x="2" y={y + 0.8} fontFamily="Geist Mono, monospace" fontSize="1.6" fill="var(--text-soft)" letterSpacing="0.2">{String(100 - y).padStart(2, '0')}</text>
        </g>
      ))}
    </svg>
  );
}

Object.assign(window, { PlatformMap, CaseStudy });
