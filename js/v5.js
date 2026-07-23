/* SIMCII v5 — cordillera de partículas (Three.js) + Mapbox (token vía /api/config) + GSAP/Lenis */
(function () {
  'use strict';
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Cordillera de partículas (firma visual) ---- */
  function initTerrain() {
    if (!window.THREE) return;
    const holder = document.getElementById('terrain');
    if (!holder) return;
    const THREE = window.THREE;
    const W = holder.clientWidth, H = holder.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
    camera.position.set(0, 2.4, 7.5);
    camera.lookAt(0, 0.4, 0);
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setSize(W, H);
    holder.appendChild(renderer.domElement);

    const COLS = 150, ROWS = 60, SX = 13, SZ = 6;
    const count = COLS * ROWS;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const cInk = new THREE.Color('#2A2C33');
    const cAzul = new THREE.Color('#2F5D7C');
    const cTerra = new THREE.Color('#B45F38');
    function ridge(x, z) {
      return (
        Math.sin(x * 1.15) * 0.55 + Math.sin(x * 2.4 + 1.7) * 0.32 +
        Math.sin(x * 5.1 + 4.2) * 0.14 + Math.sin(z * 2.2) * 0.28 +
        Math.max(0, 1.15 - Math.abs(z) * 0.85) * (Math.sin(x * 0.7 + 2.4) * 0.9 + 0.7)
      );
    }
    let i3 = 0;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const x = (c / (COLS - 1) - 0.5) * SX;
        const z = (r / (ROWS - 1) - 0.5) * SZ;
        const y = ridge(x, z);
        pos[i3] = x; pos[i3 + 1] = y; pos[i3 + 2] = z;
        const t = Math.min(Math.max((y + 0.4) / 2.4, 0), 1);
        const base = t > 0.72 ? cTerra : (t > 0.38 ? cAzul : cInk);
        col[i3] = base.r; col[i3 + 1] = base.g; col[i3 + 2] = base.b;
        i3 += 3;
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const mat = new THREE.PointsMaterial({ size: 0.035, vertexColors: true, transparent: true, opacity: 0.85 });
    const points = new THREE.Points(geo, mat);
    points.rotation.x = 0.12;
    scene.add(points);

    let t = 0, raf = null, scrollY = 0;
    function frame() {
      t += 0.0035;
      const p = geo.attributes.position.array;
      let k = 0;
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const x = p[k], z = p[k + 2];
          p[k + 1] = ridge(x, z) + Math.sin(x * 1.6 + t * 2.4) * 0.05 + Math.sin(z * 3 + t * 1.7) * 0.04;
          k += 3;
        }
      }
      geo.attributes.position.needsUpdate = true;
      points.rotation.y = Math.sin(t * 0.4) * 0.05;
      points.position.y = -scrollY * 0.0012;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    }
    if (reduce) { renderer.render(scene, camera); }
    else {
      frame();
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) { cancelAnimationFrame(raf); raf = null; }
        else if (!raf) frame();
      });
      window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });
    }
    window.addEventListener('resize', () => {
      const w = holder.clientWidth, h = holder.clientHeight;
      camera.aspect = w / h; camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      if (reduce) renderer.render(scene, camera);
    });
  }

  /* ---- Mapbox con token propio (/api/config, como el resto del sitio) ---- */
  const STATIONS = [
    { name: 'Estación Costa AIR-001', dom: 'Aire', lng: -70.3975, lat: -23.6415, score: 82 },
    { name: 'Ruido Norte RUI-001', dom: 'Ruido', lng: -70.392, lat: -23.628, score: 71 },
    { name: 'Ruido Sur RUI-002', dom: 'Ruido', lng: -70.399, lat: -23.666, score: 74 },
    { name: 'Estación UCN MET-001', dom: 'Meteorología', lng: -70.4095, lat: -23.681, score: 88 },
    { name: 'Las Salinas Norte', dom: 'Aire · BTEX', lng: -71.552, lat: -33.0055, score: 76 },
    { name: 'Las Salinas Sur', dom: 'Aire · MP', lng: -71.556, lat: -33.016, score: 79 },
    { name: 'Olores V-01', dom: 'Olores', lng: -71.548, lat: -33.011, score: 64 },
    { name: 'Meteo Viña MET-V', dom: 'Meteorología', lng: -71.543, lat: -33.024, score: 84 },
  ];
  const colorFor = (s) => (s >= 75 ? '#3E8E5F' : s >= 65 ? '#C98F2E' : '#B45F38');

  async function initMap() {
    const el = document.getElementById('mapbox');
    const fallback = document.getElementById('mapa-fallback');
    if (!el || !window.mapboxgl) { if (fallback) fallback.hidden = false; return; }
    let token = null;
    try {
      const r = await fetch('/api/config');
      const cfg = await r.json();
      token = cfg.mapboxToken || cfg.MAPBOX_TOKEN || cfg.token || null;
    } catch (e) { token = null; }
    if (!token) token = new URLSearchParams(location.search).get('mbtoken');
    // Token público (pk.*) de la operación como último fallback — /api/config manda en producción.
    if (!token) token = '';
    if (!token) { if (fallback) fallback.hidden = false; return; }
    try {
      mapboxgl.accessToken = token;
      const map = new mapboxgl.Map({
        container: el,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [-70.4005, -23.652],
        zoom: 12.1, pitch: 52, bearing: -14,
        attributionControl: true,
      });
      let mapLoaded = false;
      map.scrollZoom.disable();
      map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');
      map.on('load', () => {
        mapLoaded = true;
        if (fallback) fallback.hidden = true;
        // relieve 3D + atmósfera
        try {
          map.addSource('dem', { type: 'raster-dem', url: 'mapbox://mapbox.mapbox-terrain-dem-v1', tileSize: 512, maxzoom: 14 });
          map.setTerrain({ source: 'dem', exaggeration: 1.55 });
          map.setFog({ color: '#101114', 'high-color': '#16324a', 'horizon-blend': 0.12, 'star-intensity': 0.12 });
        } catch (err) {}
        // halos de cobertura por score
        map.addSource('stns', { type: 'geojson', data: { type: 'FeatureCollection', features: STATIONS.map((s) => ({ type: 'Feature', geometry: { type: 'Point', coordinates: [s.lng, s.lat] }, properties: { c: colorFor(s.score) } })) } });
        map.addLayer({ id: 'stn-glow', type: 'circle', source: 'stns', paint: { 'circle-radius': 38, 'circle-color': ['get', 'c'], 'circle-opacity': 0.14, 'circle-blur': 0.9 } });
        map.addLayer({ id: 'stn-ring', type: 'circle', source: 'stns', paint: { 'circle-radius': 19, 'circle-color': 'rgba(0,0,0,0)', 'circle-stroke-width': 1.2, 'circle-stroke-color': ['get', 'c'], 'circle-stroke-opacity': 0.5 } });
        STATIONS.forEach((s) => {
          const node = document.createElement('div');
          node.className = 'stn';
          node.style.setProperty('--stn-c', colorFor(s.score));
          node.innerHTML = '<i></i>';
          node.setAttribute('aria-label', s.name + ': score ' + s.score + ' de 100');
          const popup = new mapboxgl.Popup({ closeButton: false, offset: 14 })
            .setLngLat([s.lng, s.lat])
            .setHTML('<div class="pop-name">' + s.name + '</div><div class="pop-dom">' + s.dom + '</div><div class="pop-score" style="color:' + colorFor(s.score) + '">' + s.score + '<small> /100</small></div>');
          new mapboxgl.Marker({ element: node }).setLngLat([s.lng, s.lat]).addTo(map);
          node.addEventListener('mouseenter', () => popup.addTo(map));
          node.addEventListener('mouseleave', () => popup.remove());
          node.addEventListener('click', () => popup.addTo(map));
        });
        // recorrido automático entre las dos redes (se detiene al interactuar)
        if (!reduce) {
          const stops = [
            { center: [-71.5495, -33.014], zoom: 13.1, pitch: 55, bearing: 20 },
            { center: [-70.4005, -23.652], zoom: 12.1, pitch: 52, bearing: -14 },
          ];
          let si = 0, touring = true;
          const tour = setInterval(() => { if (!touring) return; map.flyTo({ ...stops[si], duration: 5200, essential: false }); si = (si + 1) % stops.length; }, 9000);
          ['mousedown', 'wheel', 'touchstart'].forEach((ev) => el.addEventListener(ev, () => { touring = false; clearInterval(tour); }, { once: true, passive: true }));
        }
      });
      map.on('error', () => { if (!mapLoaded && fallback) fallback.hidden = false; });
      new ResizeObserver(() => map.resize()).observe(el.parentElement);
    } catch (e) { if (fallback) fallback.hidden = false; }
  }

  /* ---- Formulario ---- */
  document.querySelectorAll('form[data-demo-form]').forEach((form) => {
    const input = form.querySelector('input[type="email"]');
    const button = form.querySelector('button[type="submit"]');
    const errorEl = form.querySelector('[data-form-error]');
    const errorText = form.querySelector('[data-error-text]');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = (input.value || '').trim();
      if (!email || button.disabled) return;
      button.disabled = true;
      const prev = button.textContent;
      button.textContent = 'Enviando…';
      errorEl.hidden = true;
      try {
        const r = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
        const data = await r.json().catch(() => ({}));
        if (!r.ok || !data.ok) throw new Error(data.error || 'No se pudo enviar. Intenta nuevamente.');
        const ok = document.createElement('div');
        ok.className = 'fok';
        ok.setAttribute('role', 'status');
        ok.innerHTML = '<div class="tag">Recibido</div><div class="msg">Gracias. Te contactaremos pronto.</div>';
        form.replaceWith(ok);
      } catch (err) {
        errorText.textContent = (err && err.message && err.message !== 'Failed to fetch') ? err.message : 'Sin conexión. Intenta nuevamente.';
        errorEl.hidden = false;
        button.disabled = false;
        button.textContent = prev;
      }
    });
  });

  /* ---- arranque ---- */
  function start() {
    initTerrain();
    if (document.readyState === 'complete') initMap();
    else window.addEventListener('load', initMap);
    if (reduce || !window.gsap || !window.ScrollTrigger) return;
    const gsap = window.gsap;
    gsap.registerPlugin(window.ScrollTrigger);
    const ST = window.ScrollTrigger;
    if (window.Lenis) {
      const lenis = new window.Lenis({ duration: 1.0, smoothWheel: true });
      lenis.on('scroll', ST.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
      document.documentElement.classList.add('lenis', 'lenis-smooth');
      document.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.addEventListener('click', (e) => {
          const t = a.getAttribute('href').length > 1 && document.querySelector(a.getAttribute('href'));
          if (!t) return;
          e.preventDefault();
          lenis.scrollTo(t, { offset: -66 });
        });
      });
    }
    gsap.from(['.voice', '.hero h1', '.hero-sub', '.hero-actions', '.hero-datos'], { y: 26, opacity: 0, duration: 0.8, stagger: 0.08, ease: 'expo.out', delay: 0.1 });
    document.querySelectorAll('.sec-head').forEach((h) => {
      gsap.from(h.children, { y: 24, opacity: 0, stagger: 0.08, duration: 0.65, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 84%', once: true } });
    });
    [['.tres', '.paso'], ['.mods', '.mod'], ['.inds', '.indu'], ['.conf', '.row'], ['.faq', 'details']].forEach(([w, i]) => {
      const wrap = document.querySelector(w);
      if (!wrap) return;
      gsap.from(wrap.querySelectorAll(i), { y: 28, opacity: 0, stagger: 0.05, duration: 0.55, ease: 'expo.out', scrollTrigger: { trigger: wrap, start: 'top 85%', once: true } });
    });
    gsap.from('.play', { y: 44, opacity: 0, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: '.play', start: 'top 84%', once: true } });
    gsap.from('.mapa-shell', { y: 44, opacity: 0, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: '.mapa-shell', start: 'top 84%', once: true } });
    window.addEventListener('load', () => ST.refresh());
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();

/* ---- playground en vivo: datos que se mueven como en producción ---- */
(function () {
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const play = document.getElementById('play');
  if (!play) return;
  const clock = document.getElementById('play-clock');
  const line = document.getElementById('play-line');
  const scores = [...play.querySelectorAll('[data-ps]')];
  const params = [...play.querySelectorAll('[data-pp]')];
  const hist = [];
  let g = 69.1;
  function fmtClock() {
    const d = new Date();
    return [d.getHours(), d.getMinutes(), d.getSeconds()].map((n) => String(n).padStart(2, '0')).join(':');
  }
  function drawLine() {
    if (!line) return;
    const min = Math.min(...hist) - 1, max = Math.max(...hist) + 1;
    line.setAttribute('points', hist.map((v, i) => `${(i / (Math.max(hist.length - 1, 1))) * 300},${72 - ((v - min) / (max - min)) * 66}`).join(' '));
  }
  for (let i = 0; i < 40; i++) { g += (Math.random() - 0.5) * 0.6; hist.push(+g.toFixed(1)); }
  drawLine();
  if (clock) clock.textContent = fmtClock();
  if (reduce) return;
  setInterval(() => { if (clock) clock.textContent = fmtClock(); }, 1000);
  setInterval(() => {
    // parámetros: deriva pequeña + flash
    params.forEach((row) => {
      if (Math.random() < 0.55) return;
      const v = row.querySelector('.v');
      const base = parseFloat(row.dataset.pp);
      const nv = Math.max(0, base + (Math.random() - 0.5) * base * 0.12);
      v.textContent = nv.toFixed(1);
      row.classList.add('flash');
      setTimeout(() => row.classList.remove('flash'), 500);
    });
    // scores: deriva lenta + barra
    scores.forEach((el) => {
      const base = parseFloat(el.dataset.ps);
      const nv = Math.min(96, Math.max(35, base + (Math.random() - 0.5) * 1.4));
      el.firstChild.textContent = nv.toFixed(1);
      const bar = el.parentElement.querySelector('.bar i');
      if (bar) bar.style.width = nv.toFixed(0) + '%';
    });
    // serie del score general
    g = Math.min(80, Math.max(58, g + (Math.random() - 0.5) * 0.9));
    hist.push(+g.toFixed(1));
    if (hist.length > 40) hist.shift();
    drawLine();
  }, 2400);
})();

/* ---- bitácora en vivo del playground ---- */
(function () {
  const log = document.getElementById('play-log');
  if (!log) return;
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
  function stamp() { const d = new Date(); return String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0'); }
  let mi = 0;
  function push() {
    const ev = document.createElement('div');
    ev.className = 'ev new';
    ev.innerHTML = '<span class="tm">' + stamp() + '</span><span>' + MSGS[mi % MSGS.length] + '</span>';
    mi++;
    log.insertBefore(ev, log.children[1] || null);
    setTimeout(() => ev.classList.remove('new'), 900);
    while (log.children.length > 5) log.removeChild(log.lastChild);
  }
  push(); push(); push();
  if (!reduce) setInterval(push, 4200);
})();
