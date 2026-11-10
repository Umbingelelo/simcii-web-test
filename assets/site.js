// SIMCII · home — comportamiento (módulo ES, sin build).
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const enVista = (el, fn, rootMargin = '0px') => {
  const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); fn(); } }, { rootMargin });
  io.observe(el);
};

/* ---- Hero: territorio en columnas (modelo de Blender, three.js) ----
   Cuando el mapa entra en pantalla, el terreno se levanta desde E-03 hacia afuera; después
   suben las barras de las estaciones (su altura es el score) y aparecen los reclamos.
   Con movimiento reducido se dibuja una sola vez, ya armado y con sus rótulos. */
const territorio = document.querySelector('[data-territorio]');
if (territorio) {
  const webgl = (() => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; } })();
  if (webgl) {
    territorio.classList.add('is-3d');
    montarTerritorio(territorio).catch((err) => {
      territorio.classList.remove('is-3d');
      console.warn('Mapa 3D no disponible; queda la imagen fija.', err);
    });
  }
}

async function montarTerritorio(fig) {
  const [THREE, { GLTFLoader }, { MeshoptDecoder }, datos] = await Promise.all([
    import('three'),
    import('three/addons/loaders/GLTFLoader.js'),
    import('three/addons/libs/meshopt_decoder.module.js'),
    fetch('/assets/3d/territorio.json').then((r) => r.json()),
  ]);
  const escena = fig.querySelector('.mapa3d-escena');
  const canvas = fig.querySelector('[data-territorio-canvas]');
  const capa = fig.querySelector('[data-rotulos]');

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(27.6, 1, 0.1, 100); // = lente de 50 mm del render de Blender
  scene.add(new THREE.HemisphereLight(0xECEAE4, 0x1A1D20, 1.7));
  const sol = new THREE.DirectionalLight(0xffffff, 2.6);
  sol.position.set(-4, 8, 5);
  sol.castShadow = true;
  sol.shadow.mapSize.set(2048, 2048);
  Object.assign(sol.shadow.camera, { left: -5, right: 5, top: 5, bottom: -5, near: 1, far: 30 });
  sol.shadow.bias = -0.0004;
  scene.add(sol);

  const gltf = await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync('/assets/3d/territorio.glb');
  scene.add(gltf.scene);
  scene.updateMatrixWorld(true);

  // Cada pieza guarda su matriz final y un retardo; la animación sólo escala la altura.
  const e03 = datos.estaciones.find((st) => st.sobre) || datos.estaciones[0];
  const piezas = [];
  const m = new THREE.Matrix4(), p = new THREE.Vector3(), q = new THREE.Quaternion(), s = new THREE.Vector3(), w = new THREE.Vector3();
  const retardo = (nombre, x, z) => {
    if (/^Estación/.test(nombre)) return 1.0 + Math.random() * 0.25;
    if (nombre === 'Reclamo') return 1.35 + Math.random() * 0.3;
    return (Math.hypot(x - e03.pos[0], z - e03.pos[2]) / 5) * 0.9;
  };
  gltf.scene.traverse((o) => {
    if (!o.isMesh) return;
    o.castShadow = true;
    o.receiveShadow = true;
    const nombre = o.material.name;
    if (o.isInstancedMesh) {
      for (let i = 0; i < o.count; i++) {
        o.getMatrixAt(i, m);
        m.decompose(p, q, s);
        w.copy(p).applyMatrix4(o.matrixWorld);
        piezas.push({ mesh: o, i, p: p.clone(), q: q.clone(), s: s.clone(), d: retardo(nombre, w.x, w.z) });
      }
    } else {
      o.getWorldPosition(w);
      piezas.push({ obj: o, sy: o.scale.y, d: retardo(nombre, w.x, w.z) });
    }
  });
  const sube = (t) => {
    for (const k of piezas) {
      const u = Math.min(1, Math.max(0, (t - k.d) / 0.6));
      const f = Math.max(0.001, 1 - (1 - u) ** 3);
      if (k.mesh) {
        m.compose(k.p, k.q, s.set(k.s.x, k.s.y * f, k.s.z));
        k.mesh.setMatrixAt(k.i, m);
        k.mesh.instanceMatrix.needsUpdate = true;
      } else k.obj.scale.y = k.sy * f;
    }
  };

  // Rótulos: estaciones con su score y la localidad (anclas exportadas desde Blender).
  // E-07 se rotula a la izquierda para no tapar E-03 ni los reclamos.
  const IZQUIERDA = new Set(['E-07']);
  const rotulos = datos.estaciones.map((st) => {
    const el = document.createElement('span');
    el.textContent = `${st.id} · ${st.score}`;
    if (st.sobre) el.className = 'is-sobre';
    capa.append(el);
    return { el, a: new THREE.Vector3(...st.pos), izq: IZQUIERDA.has(st.id) };
  });
  const zona = document.createElement('span');
  zona.className = 'is-zona';
  zona.textContent = 'Localidad Norte';
  capa.append(zona);
  rotulos.push({ el: zona, a: new THREE.Vector3(...datos.localidad), izq: false });

  const mira = new THREE.Vector3(0, 0.2, 0);
  const base = new THREE.Vector3(6.4, 7.4, 9.4).multiplyScalar(1.05); // misma vista que el render de Blender
  const eje = new THREE.Vector3(0, 1, 0), v = new THREE.Vector3();
  let ancho = 1, alto = 1, px = 0, activa = false, t0 = null;

  const encuadre = () => {
    const r = escena.getBoundingClientRect();
    ancho = Math.max(1, r.width); alto = Math.max(1, r.height);
    renderer.setSize(ancho, alto, false);
    camera.aspect = ancho / alto;
    camera.updateProjectionMatrix();
  };
  const pinta = (ahora) => {
    const t = reduce ? 9 : (ahora - (t0 ?? ahora)) / 1000;
    if (t < 2.2) sube(t);
    else if (!fig.classList.contains('is-listo')) { sube(9); fig.classList.add('is-listo'); }
    const giro = reduce ? 0 : Math.sin(t / 5) * 0.08 + px * 0.12;
    camera.position.copy(base).applyAxisAngle(eje, giro).add(mira);
    camera.lookAt(mira);
    camera.updateMatrixWorld();
    renderer.render(scene, camera);
    for (const r of rotulos) {
      v.copy(r.a).project(camera);
      let x = (v.x * 0.5 + 0.5) * ancho;
      if (r.izq) x -= r.el.offsetWidth;
      x = Math.min(Math.max(0, x), ancho - r.el.offsetWidth);
      r.el.style.transform = `translate(${x.toFixed(1)}px, ${((-v.y * 0.5 + 0.5) * alto - r.el.offsetHeight).toFixed(1)}px)`;
    }
  };
  const bucle = (ahora) => { if (!activa) return; pinta(ahora); requestAnimationFrame(bucle); };

  encuadre();
  sube(0);
  fig.classList.add('is-vivo');
  if (reduce) {
    pinta(0);
    new ResizeObserver(() => { encuadre(); pinta(0); }).observe(escena);
    return;
  }
  fig.addEventListener('pointermove', (e) => {
    const r = escena.getBoundingClientRect();
    px = (e.clientX - r.left) / r.width - 0.5;
  });
  new ResizeObserver(encuadre).observe(escena);
  new IntersectionObserver(([e]) => {
    const antes = activa;
    activa = e.isIntersecting;
    if (activa && t0 === null) t0 = performance.now();
    if (activa && !antes) requestAnimationFrame(bucle);
  }, { threshold: 0.35 }).observe(escena);
  pinta(performance.now());
}

/* ---- Fondo del cierre: fragmento del video de producto, sólo en pantalla ---- */
const fondo = document.querySelector('[data-fondo]');
if (fondo && !reduce) {
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { fondo.preload = 'auto'; fondo.play().catch(() => {}); } else fondo.pause();
  }).observe(fondo.closest('section'));
}

/* ---- Muestra funcional: datos que se mueven como en producción ---- */
(() => {
  const play = document.getElementById('play');
  if (!play) return;
  const clock = document.getElementById('play-clock');
  const line = document.getElementById('play-line');
  const scores = [...play.querySelectorAll('[data-ps]')];
  const params = [...play.querySelectorAll('[data-pp]')];
  const hist = [];
  let g = 69.1;
  const hora = () => { const d = new Date(); return [d.getHours(), d.getMinutes(), d.getSeconds()].map((n) => String(n).padStart(2, '0')).join(':'); };
  const dibuja = () => {
    const min = Math.min(...hist) - 1, max = Math.max(...hist) + 1;
    line.setAttribute('points', hist.map((x, i) => `${(i / Math.max(hist.length - 1, 1)) * 300},${72 - ((x - min) / (max - min)) * 66}`).join(' '));
  };
  for (let i = 0; i < 40; i++) { g += (Math.random() - 0.5) * 0.6; hist.push(+g.toFixed(1)); }
  dibuja();
  clock.textContent = hora();

  const log = document.getElementById('play-log');
  const MSGS = [
    'MP10 dentro de umbral · Estación Costa',
    'Compromiso RCA-114 actualizado con evidencia',
    'Reporte diario generado y despachado',
    'Alerta de ruido nocturno cerrada · RUI-001',
    'Nueva encuesta territorial recibida · Sector Norte',
    'Estación UCN sincronizada · 240 mediciones',
    'Denuncia ciudadana asignada · en seguimiento',
    'Score de comunidad recalculado · 53.8',
  ];
  let mi = 0;
  const evento = () => {
    const d = new Date();
    const ev = document.createElement('div');
    ev.className = 'ev new';
    ev.innerHTML = `<span class="tm">${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}</span><span></span>`;
    ev.lastChild.textContent = MSGS[mi++ % MSGS.length];
    log.insertBefore(ev, log.children[1] || null);
    setTimeout(() => ev.classList.remove('new'), 900);
    while (log.children.length > 5) log.removeChild(log.lastChild);
  };
  evento(); evento(); evento();
  if (reduce) return;

  let visible = false;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(play);
  setInterval(() => { clock.textContent = hora(); }, 1000);
  setInterval(() => { if (visible) evento(); }, 4200);
  setInterval(() => {
    if (!visible) return;
    params.forEach((row) => {
      if (Math.random() < 0.55) return;
      const b = parseFloat(row.dataset.pp);
      row.querySelector('.v').textContent = Math.max(0, b + (Math.random() - 0.5) * b * 0.12).toFixed(1);
      row.classList.add('flash');
      setTimeout(() => row.classList.remove('flash'), 500);
    });
    scores.forEach((el) => {
      const nv = Math.min(96, Math.max(35, parseFloat(el.dataset.ps) + (Math.random() - 0.5) * 1.4));
      el.firstChild.textContent = nv.toFixed(1);
      el.parentElement.querySelector('.bar i').style.width = `${nv.toFixed(0)}%`;
    });
    g = Math.min(80, Math.max(58, g + (Math.random() - 0.5) * 0.9));
    hist.push(+g.toFixed(1));
    if (hist.length > 40) hist.shift();
    dibuja();
  }, 2400);
})();

/* ---- Mapa en vivo: Mapbox con el token de /api/config, cargado al acercarse ---- */
const mapa = document.querySelector('[data-mapa]');
if (mapa) enVista(mapa, () => initMap().catch(() => { document.getElementById('mapa-fallback').hidden = false; }), '400px 0px');

const STATIONS = [
  { name: 'Estación Costa AIR-001', dom: 'Aire', lng: -70.3975, lat: -23.6415, score: 82 },
  { name: 'Ruido Norte RUI-001', dom: 'Ruido', lng: -70.392, lat: -23.628, score: 71 },
  { name: 'Ruido Sur RUI-002', dom: 'Ruido', lng: -70.399, lat: -23.666, score: 74 },
  { name: 'Estación UCN MET-001', dom: 'Meteorología', lng: -70.4095, lat: -23.681, score: 88 },
  { name: 'Las Salinas Norte', dom: 'Aire · BTEX', lng: -71.5462, lat: -32.9985, score: 76 },
  { name: 'Las Salinas Sur', dom: 'Aire · MP', lng: -71.5498, lat: -33.0043, score: 79 },
  { name: 'Olores V-01', dom: 'Olores', lng: -71.5525, lat: -33.0092, score: 64 },
  { name: 'Meteo Viña MET-V', dom: 'Meteorología', lng: -71.5405, lat: -33.0128, score: 84 },
];
const colorFor = (s) => (s >= 75 ? '#5DBB84' : s >= 65 ? '#E39A4A' : '#F07A6A');

function cargar(tag, attrs) {
  return new Promise((ok, mal) => {
    const el = Object.assign(document.createElement(tag), attrs);
    el.onload = ok; el.onerror = mal;
    document.head.appendChild(el);
  });
}

async function initMap() {
  const el = document.getElementById('mapbox');
  const fallback = document.getElementById('mapa-fallback');
  let token = null;
  try { const cfg = await (await fetch('/api/config')).json(); token = cfg.mapboxToken || cfg.MAPBOX_TOKEN || cfg.token || null; } catch { token = null; }
  if (!token) token = new URLSearchParams(location.search).get('mbtoken');
  if (!token) { fallback.hidden = false; return; }
  await Promise.all([
    cargar('link', { rel: 'stylesheet', href: 'https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css' }),
    cargar('script', { src: 'https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.js' }),
  ]);
  const { mapboxgl } = window;
  mapboxgl.accessToken = token;
  const map = new mapboxgl.Map({ container: el, style: 'mapbox://styles/mapbox/dark-v11', center: [-70.4005, -23.652], zoom: 12.1, pitch: 52, bearing: -14 });
  let cargado = false;
  map.scrollZoom.disable();
  map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');
  map.on('load', () => {
    cargado = true;
    fallback.hidden = true;
    try {
      map.addSource('dem', { type: 'raster-dem', url: 'mapbox://mapbox.mapbox-terrain-dem-v1', tileSize: 512, maxzoom: 14 });
      map.setTerrain({ source: 'dem', exaggeration: 1.55 });
      map.setFog({ color: '#1A1D20', 'high-color': '#212529', 'horizon-blend': 0.12, 'star-intensity': 0 });
    } catch { /* sin relieve */ }
    map.addSource('stns', { type: 'geojson', data: { type: 'FeatureCollection', features: STATIONS.map((s) => ({ type: 'Feature', geometry: { type: 'Point', coordinates: [s.lng, s.lat] }, properties: { c: colorFor(s.score), name: s.name, dom: s.dom, score: s.score } })) } });
    map.addLayer({ id: 'stn-ring', type: 'circle', source: 'stns', paint: { 'circle-radius': 16, 'circle-color': 'rgba(0,0,0,0)', 'circle-stroke-width': 1.2, 'circle-stroke-color': ['get', 'c'], 'circle-stroke-opacity': 0.55 } });
    map.addLayer({ id: 'stn-core', type: 'circle', source: 'stns', paint: { 'circle-radius': 6, 'circle-color': ['get', 'c'], 'circle-stroke-width': 1.6, 'circle-stroke-color': '#ECEAE4' } });
    const pop = new mapboxgl.Popup({ closeButton: false, offset: 14 });
    const muestra = (f) => {
      const p = f.properties;
      const div = document.createElement('div');
      div.innerHTML = '<div class="pop-name"></div><div class="pop-dom"></div><div class="pop-score"><span></span><small> /100</small></div>';
      div.querySelector('.pop-name').textContent = p.name;
      div.querySelector('.pop-dom').textContent = p.dom;
      div.querySelector('.pop-score span').textContent = p.score;
      div.querySelector('.pop-score').style.color = p.c;
      pop.setLngLat(f.geometry.coordinates).setDOMContent(div).addTo(map);
    };
    map.on('mouseenter', 'stn-core', (e) => { map.getCanvas().style.cursor = 'pointer'; muestra(e.features[0]); });
    map.on('mouseleave', 'stn-core', () => { map.getCanvas().style.cursor = ''; pop.remove(); });
    map.on('click', 'stn-core', (e) => muestra(e.features[0]));
    if (!reduce) {
      const stops = [
        { center: [-71.5495, -33.014], zoom: 13.1, pitch: 55, bearing: 20 },
        { center: [-70.4005, -23.652], zoom: 12.1, pitch: 52, bearing: -14 },
      ];
      let si = 0;
      const tour = setInterval(() => { map.flyTo({ ...stops[si], duration: 5200, essential: false }); si = (si + 1) % stops.length; }, 9000);
      ['mousedown', 'wheel', 'touchstart'].forEach((ev) => el.addEventListener(ev, () => clearInterval(tour), { once: true, passive: true }));
    }
  });
  map.on('error', () => { if (!cargado) fallback.hidden = false; });
  new ResizeObserver(() => map.resize()).observe(el.parentElement);
}

/* ---- Formulario de demo → /api/contact (mismos mensajes que producción) ---- */
document.querySelectorAll('form[data-demo-form]').forEach((form) => {
  const input = form.querySelector('input[type="email"]');
  const button = form.querySelector('button[type="submit"]');
  const error = form.querySelector('[data-form-error]');
  error.id = 'form-error';
  input.setAttribute('aria-describedby', 'form-error');
  input.addEventListener('input', () => { error.hidden = true; input.removeAttribute('aria-invalid'); });
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const email = input.value.trim();
    if (!email || button.disabled) return;
    const prev = button.textContent;
    button.disabled = true;
    button.textContent = 'Enviando…';
    error.hidden = true;
    try {
      const r = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
      const data = await r.json().catch(() => ({}));
      if (!r.ok || !data.ok) throw new Error(data.error || 'No se pudo enviar. Intenta nuevamente.');
      const ok = document.createElement('div');
      ok.className = 'form-ok';
      ok.setAttribute('role', 'status');
      ok.innerHTML = '<b>Recibido</b><p>Gracias. Te contactaremos pronto.</p>';
      form.replaceChildren(ok);
    } catch (err) {
      error.textContent = err.message && err.message !== 'Failed to fetch' ? err.message : 'Sin conexión. Intenta nuevamente.';
      error.hidden = false;
      input.setAttribute('aria-invalid', 'true');
      button.disabled = false;
      button.textContent = prev;
    }
  });
});
