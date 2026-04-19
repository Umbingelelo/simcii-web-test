
// Platform (Mapbox light + tierra palette) + Case Study (editorial cross-section)

async function getMapboxToken() {
  const config = typeof window.getSimciiConfig === 'function'
    ? await window.getSimciiConfig()
    : (window.SIMCII_CONFIG || {});

  return config.mapboxToken || '';
}

// Abstract sensor network — coordinates placed over an uninhabited stretch of the
// Atacama high plateau so there's real terrain texture, but no town/faena names shown.
const NODES = [
  { id: 'A1', lng: -68.92, lat: -23.60, kind: 'env',   label: 'Nodo ambiental A1' },
  { id: 'A2', lng: -68.42, lat: -23.20, kind: 'env',   label: 'Nodo ambiental A2' },
  { id: 'A3', lng: -69.24, lat: -23.95, kind: 'env',   label: 'Nodo ambiental A3' },
  { id: 'A4', lng: -68.10, lat: -23.80, kind: 'env',   label: 'Nodo ambiental A4' },
  { id: 'A5', lng: -68.70, lat: -24.20, kind: 'env',   label: 'Nodo ambiental A5' },
  { id: 'C1', lng: -68.78, lat: -23.78, kind: 'com',   label: 'Comunidad C1' },
  { id: 'C2', lng: -68.52, lat: -23.48, kind: 'com',   label: 'Comunidad C2' },
  { id: 'C3', lng: -69.00, lat: -24.10, kind: 'com',   label: 'Comunidad C3' },
  { id: 'X1', lng: -68.60, lat: -23.90, kind: 'alert', label: 'Evento X1' },
];

const INDICATORS = [
  { code: 'ENV-01', label: 'Material particulado',   state: 'dentro de rango',   fill: 62, color: 'var(--liquen)' },
  { code: 'ENV-02', label: 'Gases y compuestos',     state: 'dentro de rango',   fill: 44, color: 'var(--liquen)' },
  { code: 'ENV-03', label: 'Ruido diurno',           state: 'tendencia al alza', fill: 72, color: 'var(--azafran)' },
  { code: 'SOC-01', label: 'Satisfacción comunitaria', state: 'estable',         fill: 78, color: 'var(--liquen)' },
  { code: 'SOC-02', label: 'Reportes ciudadanos',    state: 'bajo umbral',       fill: 28, color: 'var(--liquen)' },
  { code: 'SOC-03', label: 'Compromisos activos',    state: 'en ejecución',      fill: 66, color: 'var(--cordillera)' },
];

// ---------------- PLATFORM MAP ----------------
function PlatformMap() {
  const [ref, visible] = window.useReveal(0.1);
  const mapRef = React.useRef(null);
  const mapInstance = React.useRef(null);
  const markersRef = React.useRef([]);
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
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-68.66, -23.78],
        zoom: 7.4,
        pitch: 32,
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

      // Desaturate + warm-tint the base map for paper/editorial feel
      try {
        const layers = map.getStyle().layers || [];
        layers.forEach(l => {
          if (l.type === 'background') {
            map.setPaintProperty(l.id, 'background-color', '#EDE5D6');
          }
          if (l.id.includes('water')) {
            map.setPaintProperty(l.id, 'fill-color', '#D7CAB4');
          }
          if (l.id.includes('land')) {
            try { map.setPaintProperty(l.id, 'background-color', '#F4EFE6'); } catch {}
          }
          if (l.type === 'symbol') {
            try { map.setLayoutProperty(l.id, 'visibility', 'none'); } catch {}
          }
          if (l.id.includes('hillshade')) {
            try { map.setPaintProperty(l.id, 'hillshade-shadow-color', '#C2440E'); } catch {}
            try { map.setPaintProperty(l.id, 'hillshade-highlight-color', '#F4EFE6'); } catch {}
          }
        });
      } catch (e) { /* ignore */ }

      // Connection lines between adjacent environmental sensors
      const envs = NODES.filter(n => n.kind === 'env');
      const lineFeatures = [];
      for (let i = 0; i < envs.length - 1; i++) {
        lineFeatures.push({
          type: 'Feature',
          geometry: { type: 'LineString', coordinates: [[envs[i].lng, envs[i].lat], [envs[i+1].lng, envs[i+1].lat]] }
        });
      }
      map.addSource('sim-lines', { type: 'geojson', data: { type: 'FeatureCollection', features: lineFeatures } });
      map.addLayer({
        id: 'sim-lines',
        type: 'line',
        source: 'sim-lines',
        paint: {
          'line-color': '#C2440E',
          'line-width': 1.1,
          'line-opacity': 0.35,
          'line-dasharray': [2, 3],
        },
      });

      // Coverage halos around environmental nodes
      map.addSource('sim-halos', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: envs.map(n => ({ type: 'Feature', geometry: { type: 'Point', coordinates: [n.lng, n.lat] } })) }
      });
      map.addLayer({
        id: 'sim-halos',
        type: 'circle',
        source: 'sim-halos',
        paint: {
          'circle-radius': 36,
          'circle-color': '#C2440E',
          'circle-opacity': 0.06,
          'circle-stroke-color': '#C2440E',
          'circle-stroke-width': 0.6,
          'circle-stroke-opacity': 0.25,
        }
      });

      // Add DOM markers
      markersRef.current = NODES.map((n, i) => {
        const wrap = document.createElement('div');
        wrap.style.cssText = 'position:relative;width:18px;height:18px;pointer-events:auto;cursor:pointer;';

        const dotColor = n.kind === 'alert' ? '#8B2E1A' : n.kind === 'com' ? '#5C7548' : '#C2440E';

        // Pulse ring (only alerts + active ones)
        if (n.kind === 'alert') {
          const ring = document.createElement('div');
          ring.style.cssText = `position:absolute;inset:0;border-radius:50%;border:1.5px solid ${dotColor};animation:ringPulse 2s ease-out infinite;`;
          wrap.appendChild(ring);
        }

        // Crosshair backdrop
        const cross = document.createElement('div');
        cross.style.cssText = `
          position:absolute;inset:-8px;pointer-events:none;
          background:
            linear-gradient(to right, ${dotColor}00 calc(50% - 0.5px), ${dotColor}55 calc(50% - 0.5px), ${dotColor}55 calc(50% + 0.5px), ${dotColor}00 calc(50% + 0.5px)),
            linear-gradient(to bottom, ${dotColor}00 calc(50% - 0.5px), ${dotColor}55 calc(50% - 0.5px), ${dotColor}55 calc(50% + 0.5px), ${dotColor}00 calc(50% + 0.5px));
          opacity:0;transition:opacity .25s;
        `;
        wrap.appendChild(cross);

        // Dot
        const dot = document.createElement('div');
        const size = n.kind === 'alert' ? 12 : 10;
        dot.style.cssText = `
          position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
          width:${size}px;height:${size}px;border-radius:50%;
          background:${dotColor};
          box-shadow: 0 0 0 2px #F4EFE6, 0 0 0 3px ${dotColor}40;
          transition: transform .25s;
        `;
        wrap.appendChild(dot);

        // Label chip
        const tag = document.createElement('div');
        tag.style.cssText = `
          position:absolute;top:-20px;left:50%;transform:translateX(-50%);
          font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: 0.1em;
          color: #1A1815; background: #F4EFE6; padding: 2px 5px; border: 1px solid rgba(26,24,21,0.2);
          white-space:nowrap; pointer-events:none; opacity:.9;
        `;
        tag.textContent = n.id;
        wrap.appendChild(tag);

        wrap.addEventListener('mouseenter', () => {
          setActive(i);
          cross.style.opacity = '1';
          dot.style.transform = 'translate(-50%,-50%) scale(1.2)';
        });
        wrap.addEventListener('mouseleave', () => {
          cross.style.opacity = '0';
          dot.style.transform = 'translate(-50%,-50%) scale(1)';
        });

        const marker = new mgl.Marker({ element: wrap, anchor: 'center' })
          .setLngLat([n.lng, n.lat])
          .addTo(map);
        marker._nodeIndex = i;
        return marker;
      });

      // Slow camera drift
      let bearing = -12;
      const tick = () => {
        bearing += 0.02;
        if (mapInstance.current) mapInstance.current.setBearing(bearing);
      };
      mapInstance.current._driftInterval = setInterval(tick, 60);
    });
    }

    initializeMap();

    return () => {
      cancelled = true;
      if (mapInstance.current?._driftInterval) clearInterval(mapInstance.current._driftInterval);
      markersRef.current.forEach(m => m.remove());
      if (mapInstance.current) { mapInstance.current.remove(); mapInstance.current = null; }
    };
  }, []);

  // Highlight active marker (scale up)
  React.useEffect(() => {
    markersRef.current.forEach((m, i) => {
      const el = m.getElement();
      const dot = el.lastChild.previousSibling; // the dot
      if (!dot) return;
      if (i === active) {
        dot.style.boxShadow = `0 0 0 2px #F4EFE6, 0 0 0 5px #C2440E`;
      } else {
        // Preserve original shadow based on node
        const n = NODES[i];
        const color = n.kind === 'alert' ? '#8B2E1A' : n.kind === 'com' ? '#5C7548' : '#C2440E';
        dot.style.boxShadow = `0 0 0 2px #F4EFE6, 0 0 0 3px ${color}40`;
      }
    });
  }, [active]);

  return (
    <section id="platform" ref={ref} style={{ padding: '0 2.5rem 140px', maxWidth: 1320, margin: '0 auto' }}>
      <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(30px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)' }}>

        <window.ChapterLabel number="IV" title="La plataforma" />

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(2rem, 3.6vw, 3rem)', fontWeight: 500, letterSpacing: '-0.03em', color: 'var(--carbon)', textWrap: 'balance', lineHeight: 1.1, margin: 0, maxWidth: 720 }}>
            Visibilidad total del territorio, <em style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--cobre)' }}>en un solo lente.</em>
          </h2>
          <div style={{ display: 'flex', gap: 0, border: '1px solid var(--carbon)' }}>
            {['24 h', '7 d', '30 d'].map((p) => {
              const act = range === p;
              return (
                <button key={p} onClick={() => setRange(p)} style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.14em',
                  background: act ? 'var(--carbon)' : 'transparent',
                  border: 'none',
                  color: act ? 'var(--hueso)' : 'var(--carbon)',
                  padding: '10px 18px', cursor: 'pointer', transition: 'all 0.2s',
                }}>{p}</button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 0, border: '1px solid var(--carbon)' }}>

          {/* Map column */}
          <div style={{ position: 'relative', height: 600, borderRight: '1px solid var(--carbon)', background: 'var(--hueso-2)' }}>
            <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

            {/* Paper-grain overlay */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")", opacity: 0.08, mixBlendMode: 'multiply' }} />

            {/* Corner marks (+) */}
            {[['top',14,'left',14],['top',14,'right',14],['bottom',14,'left',14],['bottom',14,'right',14]].map(([v,vv,h,hv],idx)=>(
              <div key={idx} style={{ position: 'absolute', [v]: vv, [h]: hv, width: 10, height: 10, pointerEvents: 'none', zIndex: 2 }}>
                <svg width="10" height="10" viewBox="0 0 10 10"><path d="M5 0v10M0 5h10" stroke="var(--cobre)" strokeWidth="1" opacity="0.7" /></svg>
              </div>
            ))}

            {/* Top-left HUD */}
            <div style={{ position: 'absolute', top: 20, left: 32, display: 'flex', flexDirection: 'column', gap: 6, zIndex: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ position: 'relative', width: 7, height: 7 }}>
                  <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'var(--cobre)' }} />
                  <span style={{ position: 'absolute', inset: -3, borderRadius: '50%', border: '1px solid var(--cobre)', animation: 'ringPulse 2s ease-out infinite' }} />
                </span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--cobre)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 500 }}>Flujo en vivo</span>
              </div>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'var(--text-soft)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>Territorio demostrativo · Red 09 nodos</span>
            </div>

            {/* Top-right coords */}
            <div style={{ position: 'absolute', top: 20, right: 32, textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'var(--text-soft)', letterSpacing: '0.14em', lineHeight: 1.8, zIndex: 2 }}>
              <div>LAT · — · —</div>
              <div>LNG · — · —</div>
              <div>Z · 07.4</div>
            </div>

            {/* Loading state */}
            {(!ready || mapError) && (
              <div style={{ position: 'absolute', inset: 0, background: 'var(--hueso-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: mapError ? 'var(--cobre)' : 'var(--text-soft)', letterSpacing: '0.2em' }}>{mapError || 'CARGANDO TERRITORIO'}</span>
              </div>
            )}

            {/* Scan bar */}
            <div style={{ position: 'absolute', bottom: 72, left: 32, right: 32, height: 1, background: 'rgba(26,24,21,0.1)', pointerEvents: 'none', zIndex: 2 }}>
              <div className="scan-sweep" style={{ position: 'absolute', top: -1, width: 80, height: 2, background: 'linear-gradient(90deg, transparent, var(--cobre), transparent)' }} />
            </div>

            {/* Legend + demo tag */}
            <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--hueso)', border: '1px solid var(--line-claro)', zIndex: 2 }}>
              <div style={{ display: 'flex', gap: 22 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--cobre)' }} />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--carbon)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Ambiental</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--liquen)' }} />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--carbon)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Comunidad</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--magma)' }} />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--carbon)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Alerta</span>
                </div>
              </div>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'var(--text-soft)', letterSpacing: '0.14em' }}>DEMO · TERRITORIO FICTICIO</span>
            </div>
          </div>

          {/* Indicator panel */}
          <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--hueso)' }}>
            <div style={{ padding: '20px 22px', borderBottom: '1px solid var(--carbon)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--cobre)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Indicadores · {range}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--liquen)', animation: 'blink 1.2s infinite' }} />
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'var(--liquen)', letterSpacing: '0.14em' }}>EN VIVO</span>
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
                      background: isActive ? 'var(--hueso-2)' : 'transparent',
                      border: 'none',
                      borderBottom: '1px dashed var(--line-claro)',
                      display: 'flex', flexDirection: 'column', gap: 10,
                      transition: 'background 0.2s',
                      fontFamily: 'inherit',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--text-soft)', letterSpacing: '0.12em' }}>{k.code}</span>
                        <span style={{ fontFamily: 'Space Grotesk', fontSize: 14, fontWeight: 500, color: 'var(--carbon)', letterSpacing: '-0.01em' }}>{k.label}</span>
                      </div>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: k.color, flexShrink: 0 }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ flex: 1, height: 2, background: 'rgba(26,24,21,0.08)', position: 'relative' }}>
                        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${k.fill}%`, background: k.color, transition: 'width 0.6s cubic-bezier(0.16,1,0.3,1)' }} />
                      </div>
                      <span style={{ fontFamily: 'Space Grotesk', fontSize: 11, fontStyle: 'italic', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{k.state}</span>
                    </div>
                  </button>
                );
              })}
            </div>
            <div style={{ padding: '18px 22px', borderTop: '1px solid var(--carbon)', background: 'var(--hueso-2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, color: 'var(--text-soft)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 4 }}>Latencia de red</div>
                <div style={{ fontFamily: 'Space Grotesk', fontSize: 22, fontWeight: 500, color: 'var(--carbon)', letterSpacing: '-0.02em' }}>&lt; 5 min</div>
              </div>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 9h14m-5-5l5 5-5 5" stroke="var(--cobre)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          </div>
        </div>

        {/* Caption */}
        <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--text-soft)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Fig. 01</span>
          <span style={{ flex: 1, height: 1, background: 'var(--line-claro)' }} />
          <span style={{ fontFamily: 'Space Grotesk', fontSize: 13, fontStyle: 'italic', color: 'var(--text-muted)' }}>
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
    <section id="casestudy" ref={ref} style={{ padding: '0 2.5rem 140px', maxWidth: 1320, margin: '0 auto' }}>
      <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(30px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)' }}>

        <window.ChapterLabel number="V" title="Cómo se ve en práctica" />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: 80, alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--cobre)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 18 }}>§ Caso ilustrativo</div>

            <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)', fontWeight: 500, letterSpacing: '-0.025em', color: 'var(--carbon)', lineHeight: 1.15, marginBottom: 32, textWrap: 'balance' }}>
              Una faena y su entorno humano, <em style={{ fontStyle: 'italic', color: 'var(--cobre)' }}>observados al mismo tiempo.</em>
            </h2>

            <p style={{ fontFamily: 'Inter', fontSize: 15, lineHeight: 1.75, color: 'var(--text-muted)', marginBottom: 22, textWrap: 'pretty' }}>
              Sensores en el perímetro operacional registran aire, agua y ruido. En paralelo, las comunidades vecinas emiten señales propias: satisfacción, reportes, uso de compromisos.
            </p>
            <p style={{ fontFamily: 'Inter', fontSize: 15, lineHeight: 1.75, color: 'var(--text-muted)', marginBottom: 36, textWrap: 'pretty' }}>
              Cuando una variable ambiental se correlaciona con un cambio en la percepción, SIMCII lo señala <em style={{ fontStyle: 'italic' }}>antes</em> del siguiente reporte mensual. Ese corrimiento —de meses a minutos— es la propuesta.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, border: '1px solid var(--carbon)' }}>
              {[
                { k: 'Red', v: '09 nodos' },
                { k: 'Cobertura', v: '24 / 7' },
                { k: 'Latencia', v: '< 5 min' },
              ].map((f, i) => (
                <div key={i} style={{ padding: '22px 22px', borderRight: i < 2 ? '1px solid var(--carbon)' : 'none' }}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'var(--cobre)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 14 }}>0{i + 1} · {f.k}</div>
                  <div style={{ fontFamily: 'Space Grotesk', fontSize: 26, fontWeight: 500, color: 'var(--carbon)', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>{f.v}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 28, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 8, height: 1, background: 'var(--text-soft)' }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--text-soft)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>Caso ilustrativo · no corresponde a operación real</span>
            </div>
          </div>

          <div style={{ position: 'relative', border: '1px solid var(--carbon)', background: 'var(--hueso-2)', aspectRatio: '1.15 / 1', overflow: 'hidden' }}>
            <CrossSectionDiagram />
            <div style={{ position: 'absolute', top: 16, left: 16, fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--text-soft)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>Fig. 02 · Corte transversal</div>
            <div style={{ position: 'absolute', top: 16, right: 16, fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'var(--text-soft)', letterSpacing: '0.18em' }}>ESC · DEMO</div>
            <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'var(--text-soft)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
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
      {/* Background gradient — sky/earth */}
      <defs>
        <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#EDE5D6" />
          <stop offset="1" stopColor="#D8CEB8" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="64" fill="url(#sky)" opacity="0.4" />

      {/* Guide grid dots */}
      {[...Array(10)].map((_, gy) => (
        [...Array(10)].map((_, gx) => (
          <circle key={`g-${gx}-${gy}`} cx={5 + gx * 10} cy={5 + gy * 10} r="0.3" fill="rgba(26,24,21,0.12)" />
        ))
      )).flat()}

      {/* Horizon line */}
      <path d="M0 64 Q20 58 40 62 T70 60 T100 64" stroke="var(--carbon)" strokeWidth="0.35" fill="none" />

      {/* Ground fill */}
      <path d="M0 100 L0 64 Q20 58 40 62 T70 60 T100 64 L100 100 Z" fill="rgba(194,68,14,0.05)" />
      {/* Ground texture hatching */}
      {[...Array(12)].map((_, i) => (
        <line key={`h-${i}`} x1={i * 9} y1="66" x2={i * 9 - 4} y2="100" stroke="rgba(26,24,21,0.06)" strokeWidth="0.3" />
      ))}

      {/* Facility — stylized industrial glyph */}
      <g transform={`translate(${facility.x}, ${facility.y})`}>
        {/* Fence line */}
        <line x1="-10" y1="8" x2="10" y2="8" stroke="var(--cobre)" strokeWidth="0.4" strokeDasharray="1 0.6" />
        {/* Main block */}
        <rect x="-5" y="-1" width="10" height="9" fill="var(--hueso)" stroke="var(--carbon)" strokeWidth="0.4" />
        {/* Roof notch */}
        <path d="M-5 -1 L0 -4 L5 -1" fill="none" stroke="var(--carbon)" strokeWidth="0.4" />
        {/* Stack */}
        <line x1="0" y1="-4" x2="0" y2="-12" stroke="var(--carbon)" strokeWidth="0.4" />
        {/* Smoke puffs */}
        {[0,1,2].map(i => {
          const phase = ((t * 0.6 + i * 0.7) % 3) / 3;
          return (
            <circle key={i} cx={Math.sin(phase * 6) * 1.5} cy={-12 - phase * 8} r={0.6 + phase * 0.8} fill="var(--carbon)" opacity={0.25 * (1 - phase)} />
          );
        })}
        <text x="8" y="4" fontFamily="JetBrains Mono, monospace" fontSize="2.2" fill="var(--carbon)" letterSpacing="0.3">F1</text>
      </g>

      {/* Sensors — pole + animated dot + ring */}
      {sensors.map(s => {
        const pulse = (Math.sin(t * 2 + s.x * 0.1) + 1) / 2;
        return (
          <g key={s.id}>
            {/* Pole */}
            <line x1={s.x} y1={64} x2={s.x} y2={s.y + 1} stroke="var(--carbon)" strokeWidth="0.22" />
            {/* Base triangle */}
            <path d={`M${s.x - 1.2} 64 L${s.x + 1.2} 64 L${s.x} 63 Z`} fill="var(--carbon)" />
            {/* Ring */}
            <circle cx={s.x} cy={s.y} r={1.2 + pulse * 2.2} fill="none" stroke="var(--cobre)" strokeWidth="0.15" opacity={1 - pulse} />
            {/* Sensor dot */}
            <circle cx={s.x} cy={s.y} r={1.1} fill="var(--cobre)" />
            <circle cx={s.x} cy={s.y} r={0.4} fill="var(--hueso)" />
            {/* Label */}
            <text x={s.x + 2} y={s.y - 0.8} fontFamily="JetBrains Mono, monospace" fontSize="2" fill="var(--text-muted)" letterSpacing="0.25">{s.id}</text>
          </g>
        );
      })}

      {/* Communities — house glyphs */}
      {communities.map(c => (
        <g key={c.id} transform={`translate(${c.x}, ${c.y})`}>
          {/* House */}
          <path d="M-2.2 2 L-2.2 -1 L0 -2.8 L2.2 -1 L2.2 2 Z" fill="var(--liquen)" />
          <rect x="-0.7" y="0.3" width="1.4" height="1.7" fill="var(--hueso)" />
          {/* Base */}
          <line x1="-4" y1="2.2" x2="4" y2="2.2" stroke="var(--carbon)" strokeWidth="0.25" />
          <text x="4" y="1.2" fontFamily="JetBrains Mono, monospace" fontSize="2" fill="var(--text-muted)" letterSpacing="0.25">{c.id}</text>
        </g>
      ))}

      {/* Correlation arcs — animated dashes from sensor to nearest community */}
      {sensors.map((s, i) => {
        const c = communities[i % communities.length];
        const offset = (t * 5 + i * 3) % 8;
        const midX = (s.x + c.x) / 2;
        const midY = (s.y + c.y) / 2 - 14;
        return (
          <path
            key={i}
            d={`M${s.x} ${s.y} Q${midX} ${midY} ${c.x} ${c.y - 3}`}
            stroke="var(--cobre)" strokeWidth="0.3" fill="none"
            strokeDasharray="0.8 1.8" strokeDashoffset={-offset} opacity="0.45"
          />
        );
      })}

      {/* Axis tick — left edge vertical */}
      {[20, 40, 60, 80].map(y => (
        <g key={y}>
          <line x1="0" y1={y} x2="1.4" y2={y} stroke="var(--carbon)" strokeWidth="0.2" />
          <text x="2" y={y + 0.8} fontFamily="JetBrains Mono, monospace" fontSize="1.6" fill="var(--text-soft)" letterSpacing="0.2">{String(100 - y).padStart(2, '0')}</text>
        </g>
      ))}
    </svg>
  );
}

Object.assign(window, { PlatformMap, CaseStudy });
