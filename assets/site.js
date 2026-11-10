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

  // ---- Puntos del mapa (estaciones y lugares) con su ficha ----
  const ficha = fig.querySelector('[data-ficha]');
  const chips = fig.querySelector('[data-chips]');
  const campos = Object.fromEntries([...ficha.querySelectorAll('[data-f]')].map((el) => [el.dataset.f, el]));
  const CORTO = (tipo) => (tipo.startsWith('Calidad') ? 'Aire' : tipo.startsWith('Agua') ? 'Agua' : tipo);
  const CLASE = { r214: 'is-reclamo', c14: 'is-compromiso' };
  const IZQUIERDA = new Set(['E-07', 'c14', 'localidad']); // rótulos a la izquierda de su ancla para no tapar a los vecinos
  const puntos = [
    ...datos.estaciones.map((st) => ({ ...st, nombre: `Estación ${st.id}`, rotulo: st.id, sub: CORTO(st.tipo), clase: st.sobre ? 'is-sobre' : '' })),
    ...datos.elementos.map((el) => ({ ...el, rotulo: el.nombre, sub: '', clase: CLASE[el.id] || 'is-zona' })),
  ];
  const boton = (padre, clase, texto, sub) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = clase;
    b.textContent = texto;
    if (sub) { const em = document.createElement('em'); em.textContent = sub; b.append(em); }
    b.setAttribute('aria-pressed', 'false');
    padre.append(b);
    return b;
  };
  for (const pt of puntos) {
    pt.a = new THREE.Vector3(...pt.pos);
    pt.izq = IZQUIERDA.has(pt.id);
    pt.btn = boton(capa, `rot ${pt.clase}`, pt.rotulo, pt.sub);
    pt.chip = boton(chips, '', pt.rotulo, '');
  }

  // Pulso de transmisión en la base de cada estación
  const anillo = new THREE.RingGeometry(0.09, 0.115, 40).rotateX(-Math.PI / 2);
  const pulsos = datos.estaciones.map((st, i) => {
    const mesh = new THREE.Mesh(anillo, new THREE.MeshBasicMaterial({ color: st.sobre ? 0x8FA6E0 : 0xECEAE4, transparent: true, opacity: 0, depthWrite: false }));
    mesh.position.set(...st.base);
    mesh.userData = { fase: i * 0.37, id: st.id };
    scene.add(mesh);
    return mesh;
  });

  // Polvo: sale del rajo y viaja con el viento del este hacia la localidad
  const N = 240;
  const desde = new THREE.Vector3(...datos.polvo.desde);
  const rumbo = new THREE.Vector3(...datos.polvo.hacia).sub(desde);
  const largo = rumbo.length();
  rumbo.normalize();
  const lado = new THREE.Vector3(-rumbo.z, 0, rumbo.x);
  const origen = new Float32Array(N * 3), vida = new Float32Array(N), xyz = new Float32Array(N * 3), rgb = new Float32Array(N * 3);
  const nace = (i, azar) => {
    const ang = Math.random() * Math.PI * 2, r = Math.random() * datos.polvo.radio * 0.7;
    origen[i * 3] = desde.x + Math.cos(ang) * r;
    origen[i * 3 + 1] = desde.y + Math.random() * 0.15;
    origen[i * 3 + 2] = desde.z + Math.sin(ang) * r;
    vida[i] = azar ? Math.random() : 0;
  };
  for (let i = 0; i < N; i++) nace(i, true);
  const polvoGeo = new THREE.BufferGeometry();
  polvoGeo.setAttribute('position', new THREE.BufferAttribute(xyz, 3));
  polvoGeo.setAttribute('color', new THREE.BufferAttribute(rgb, 3));
  const polvo = new THREE.Points(polvoGeo, new THREE.PointsMaterial({ size: 0.05, vertexColors: true, transparent: true, opacity: 0.9, depthWrite: false }));
  polvo.visible = false;
  scene.add(polvo);
  const claro = new THREE.Color(0xC9C7C1), fondo = new THREE.Color(0x1A1D20), c = new THREE.Color();
  const muevePolvo = (dt, t) => {
    for (let i = 0; i < N; i++) {
      vida[i] += dt * 0.12;
      if (vida[i] > 1) nace(i, false);
      const d = vida[i] * largo, ola = Math.sin(t * 1.3 + i) * 0.12 * vida[i];
      xyz[i * 3] = origen[i * 3] + rumbo.x * d + lado.x * ola;
      xyz[i * 3 + 1] = origen[i * 3 + 1] + vida[i] * 0.35;
      xyz[i * 3 + 2] = origen[i * 3 + 2] + rumbo.z * d + lado.z * ola;
      c.copy(fondo).lerp(claro, Math.min(1, vida[i] * 6, (1 - vida[i]) * 3) * 0.9);
      rgb[i * 3] = c.r; rgb[i * 3 + 1] = c.g; rgb[i * 3 + 2] = c.b;
    }
    polvoGeo.attributes.position.needsUpdate = true;
    polvoGeo.attributes.color.needsUpdate = true;
  };

  // Selección: ficha, rótulo activo y lectura que se mueve como en producción
  let sel = null, manual = false;
  const elegir = (pt, porUsuario) => {
    sel = pt;
    if (porUsuario) { manual = true; ficha.setAttribute('aria-live', 'polite'); }
    for (const q of puntos) {
      q.btn.setAttribute('aria-pressed', String(q === pt));
      q.chip.setAttribute('aria-pressed', String(q === pt));
    }
    ficha.hidden = false;
    ficha.className = `ficha ${pt.clase}`;
    campos.tipo.textContent = pt.tipo;
    campos.nombre.textContent = pt.nombre;
    campos.lectura.textContent = pt.lectura;
    campos.detalle.textContent = pt.detalle;
    campos.score.hidden = pt.score == null;
    if (pt.score != null) {
      campos.score.querySelector('b').textContent = `${pt.score}/100`;
      campos.score.querySelector('u').style.width = `${pt.score}%`;
    }
    if (reduce) pinta(0);
  };
  for (const pt of puntos) {
    pt.btn.addEventListener('click', () => elegir(pt, true));
    pt.chip.addEventListener('click', () => elegir(pt, true));
  }
  const enVivo = () => {
    if (!sel || sel.score == null) return;
    const m = sel.lectura.match(/\d+(?:,\d+)?/);
    if (!m) return;
    const dec = m[0].includes(',') ? 1 : 0;
    const n = parseFloat(m[0].replace(',', '.')) * (1 + (Math.random() - 0.5) * 0.03);
    campos.lectura.textContent = sel.lectura.replace(m[0], n.toFixed(dec).replace('.', ','));
  };

  const mira = new THREE.Vector3(0, 0.2, 0);
  const base = new THREE.Vector3(6.4, 7.4, 9.4).multiplyScalar(1.05); // misma vista que el render de Blender
  const eje = new THREE.Vector3(0, 1, 0), v = new THREE.Vector3();
  let ancho = 1, alto = 1, px = 0, activa = false, t0 = null, antes = 0;

  const encuadre = () => {
    const r = escena.getBoundingClientRect();
    ancho = Math.max(1, r.width); alto = Math.max(1, r.height);
    renderer.setSize(ancho, alto, false);
    camera.aspect = ancho / alto;
    camera.updateProjectionMatrix();
  };
  function pinta(ahora) {
    const t = reduce ? 9 : (ahora - (t0 ?? ahora)) / 1000;
    const dt = Math.min(0.05, Math.max(0, t - antes));
    antes = t;
    if (t < 2.2) sube(t);
    else if (!fig.classList.contains('is-listo')) {
      sube(9);
      fig.classList.add('is-listo');
      polvo.visible = !reduce;
      if (!sel) elegir(puntos.find((q) => q.sobre) || puntos[0], false);
    }
    if (polvo.visible) muevePolvo(dt, t);
    for (const p of pulsos) {
      const elegido = sel && sel.id === p.userData.id;
      const k = reduce ? 0.35 : (t * 0.45 + p.userData.fase) % 1;
      p.scale.setScalar(1 + k * (elegido ? 7 : 4.5));
      p.material.opacity = t < 2.2 ? 0 : (1 - k) * (elegido ? 0.9 : 0.45);
    }
    const giro = reduce ? 0 : Math.sin(t / 5) * 0.08 + px * 0.12;
    camera.position.copy(base).applyAxisAngle(eje, giro).add(mira);
    camera.lookAt(mira);
    camera.updateMatrixWorld();
    renderer.render(scene, camera);
    for (const pt of puntos) {
      const el = pt.btn;
      v.copy(pt.a).project(camera);
      let x = (v.x * 0.5 + 0.5) * ancho;
      if (pt.izq) x -= el.offsetWidth;
      x = Math.min(Math.max(0, x), ancho - el.offsetWidth);
      el.style.transform = `translate(${x.toFixed(1)}px, ${((-v.y * 0.5 + 0.5) * alto - el.offsetHeight).toFixed(1)}px)`;
    }
  }
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
  // Recorrido automático por los puntos hasta que la persona elige uno
  const RECORRIDO = ['E-03', 'r214', 'localidad', 'faena', 'c14', 'E-07', 'E-01', 'E-05', 'E-09'];
  let paso = 0;
  setInterval(() => {
    if (!activa || manual || !fig.classList.contains('is-listo')) return;
    paso = (paso + 1) % RECORRIDO.length;
    elegir(puntos.find((q) => q.id === RECORRIDO[paso]), false);
  }, 5000);
  setInterval(() => { if (activa) enVivo(); }, 2500);
  new ResizeObserver(encuadre).observe(escena);
  new IntersectionObserver(([e]) => {
    const estaba = activa;
    activa = e.isIntersecting;
    if (activa && t0 === null) t0 = performance.now();
    if (activa && !estaba) requestAnimationFrame(bucle);
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

/* Red de ejemplo: dos zonas, estaciones con lectura base y reclamos cercanos */
const ZONAS = {
  antofagasta: {
    nombre: 'Antofagasta', sub: 'Puerto y borde costero',
    vista: { center: [-70.3975, -23.6450], zoom: 13.6, pitch: 58, bearing: -18 },
    viento: 'Viento OSO 4,2 m/s', hacia: 'ENE',
    pluma: { desde: [-70.4038, -23.6488], rumbo: 60, km: 1.8 },
    area: { nombre: 'Zona portuaria', poly: [[-70.4085, -23.6455], [-70.4012, -23.6440], [-70.3995, -23.6520], [-70.4060, -23.6540]], etiqueta: [-70.4060, -23.6530] },
  },
  salinas: {
    nombre: 'Viña del Mar', sub: 'Predio Las Salinas',
    vista: { center: [-71.5468, -33.0050], zoom: 14.2, pitch: 60, bearing: 24 },
    viento: 'Viento SO 3,1 m/s', hacia: 'NE',
    pluma: { desde: [-71.5506, -33.0078], rumbo: 40, km: 1.1 },
    area: { nombre: 'Predio Las Salinas', poly: [[-71.5545, -33.0015], [-71.5470, -33.0002], [-71.5458, -33.0090], [-71.5530, -33.0110]], etiqueta: [-71.5542, -33.0028] },
  },
};
const ESTACIONES = [
  { id: 'AIR-001', nombre: 'Estación Costa', zona: 'antofagasta', tipo: 'Aire', var: 'MP10', unidad: 'µg/m³', v: 41, dec: 0, score: 82, ref: 'Norma diaria 130 µg/m³', lng: -70.3965, lat: -23.6335 },
  { id: 'AIR-002', nombre: 'Puerto', zona: 'antofagasta', tipo: 'Aire', var: 'MP10', unidad: 'µg/m³', v: 104, dec: 0, score: 62, ref: 'Norma diaria 130 µg/m³', lng: -70.4022, lat: -23.6478 },
  { id: 'RUI-001', nombre: 'Ruido Norte', zona: 'antofagasta', tipo: 'Ruido', var: 'Nivel', unidad: 'dB(A)', v: 61, dec: 0, score: 71, ref: 'Límite diurno de la zona 70 dB(A)', lng: -70.392, lat: -23.628 },
  { id: 'RUI-002', nombre: 'Ruido Sur', zona: 'antofagasta', tipo: 'Ruido', var: 'Nivel', unidad: 'dB(A)', v: 58, dec: 0, score: 74, ref: 'Límite diurno de la zona 70 dB(A)', lng: -70.399, lat: -23.666 },
  { id: 'MET-001', nombre: 'Meteo UCN', zona: 'antofagasta', tipo: 'Meteorología', var: 'Viento SO', unidad: 'm/s', v: 4.2, dec: 1, score: 88, ref: 'Dirección y velocidad cada 1 min', lng: -70.4095, lat: -23.681 },
  { id: 'AIR-101', nombre: 'Las Salinas Norte', zona: 'salinas', tipo: 'Aire', var: 'BTEX', unidad: 'µg/m³', v: 3.1, dec: 1, score: 76, ref: 'Benceno, tolueno, etilbenceno y xilenos', lng: -71.5462, lat: -32.9985 },
  { id: 'AIR-102', nombre: 'Las Salinas Sur', zona: 'salinas', tipo: 'Aire', var: 'MP2,5', unidad: 'µg/m³', v: 18, dec: 0, score: 79, ref: 'Norma diaria 50 µg/m³', lng: -71.5498, lat: -33.0043 },
  { id: 'OLR-101', nombre: 'Olores V-01', zona: 'salinas', tipo: 'Olores', var: 'Olor', unidad: 'ouE/m³', v: 2.4, dec: 1, score: 61, ref: 'Unidades de olor europeas', lng: -71.5525, lat: -33.0092 },
  { id: 'MET-101', nombre: 'Meteo Viña', zona: 'salinas', tipo: 'Meteorología', var: 'Viento SO', unidad: 'm/s', v: 3.1, dec: 1, score: 84, ref: 'Dirección y velocidad cada 1 min', lng: -71.5405, lat: -33.0128 },
];
const RECLAMOS = [
  { id: '#209', zona: 'antofagasta', motivo: 'Polvo en las ventanas', hace: 25, cerca: 'AIR-002', lng: -70.3935, lat: -23.6436 },
  { id: '#214', zona: 'salinas', motivo: 'Olor a combustible', hace: 12, cerca: 'OLR-101', lng: -71.5468, lat: -33.0040 },
];
const estado = (s) => (s >= 75 ? ['ok', 'Bien'] : s >= 65 ? ['warn', 'Atención'] : ['err', 'Alerta']);

function cargar(tag, attrs) {
  return new Promise((ok, mal) => {
    const el = Object.assign(document.createElement(tag), attrs);
    el.onload = ok; el.onerror = mal;
    document.head.appendChild(el);
  });
}

// Cono de la pluma: origen y arco a «km» en dirección «rumbo» (0 = norte)
function cono([lng, lat], rumbo, km, abre = 17) {
  const pts = [[lng, lat]];
  for (let a = -abre; a <= abre; a += abre / 6) {
    const b = ((rumbo + a) * Math.PI) / 180;
    pts.push([lng + (Math.sin(b) * km) / (111.32 * Math.cos((lat * Math.PI) / 180)), lat + (Math.cos(b) * km) / 110.57]);
  }
  pts.push([lng, lat]);
  return { type: 'Polygon', coordinates: [pts] };
}

// Paleta Basalto sobre dark-v11
function basalto(map) {
  for (const l of map.getStyle().layers) {
    const id = l.id;
    const p = (k, v) => { try { map.setPaintProperty(id, k, v); } catch { /* capa sin esa propiedad */ } };
    if (l.type === 'background') p('background-color', '#1A1D20');
    else if (l.type === 'fill') p('fill-color', /water/.test(id) ? '#111316' : /building/.test(id) ? '#24282C' : '#1D2023');
    else if (l.type === 'line') {
      if (/water|river|stream/.test(id)) p('line-color', '#15181B');
      else if (/motorway|trunk|primary/.test(id)) p('line-color', '#454B51');
      else if (/road|street|bridge|tunnel|path/.test(id)) p('line-color', '#32373C');
      else if (/admin|boundary/.test(id)) p('line-color', '#41474D');
    } else if (l.type === 'symbol') {
      if (/poi|transit|airport/.test(id)) { map.setLayoutProperty(id, 'visibility', 'none'); continue; }
      p('text-color', /settlement|place/.test(id) ? '#B9BBB5' : '#7E817C');
      p('text-halo-color', '#1A1D20');
    }
  }
}

async function initMap() {
  const shell = document.querySelector('[data-mapa]');
  const el = document.getElementById('mapbox');
  const fallback = document.getElementById('mapa-fallback');
  let token = null;
  try { const cfg = await (await fetch('/api/config')).json(); token = cfg.mapboxToken || cfg.MAPBOX_TOKEN || cfg.token || null; } catch { token = null; }
  if (!token) token = new URLSearchParams(location.search).get('mbtoken');
  if (!token) { fallback.hidden = false; return; }
  await Promise.all([
    cargar('link', { rel: 'stylesheet', href: 'https://api.mapbox.com/mapbox-gl-js/v3.10.0/mapbox-gl.css' }),
    cargar('script', { src: 'https://api.mapbox.com/mapbox-gl-js/v3.10.0/mapbox-gl.js' }),
  ]);
  const { mapboxgl } = window;
  mapboxgl.accessToken = token;
  const angosto = matchMedia('(max-width: 900px)');
  const relleno = () => (angosto.matches ? { left: 0, top: 0, right: 0, bottom: 0 } : { left: 360, top: 0, right: 0, bottom: 0 });
  let zona = 'salinas';
  const map = new mapboxgl.Map({
    container: el, style: 'mapbox://styles/mapbox/dark-v11', ...ZONAS[zona].vista, padding: relleno(),
    cooperativeGestures: true, attributionControl: false,
    locale: {
      'ScrollZoomBlocker.CtrlMessage': 'Usa Ctrl + rueda para acercar el mapa',
      'ScrollZoomBlocker.CmdMessage': 'Usa ⌘ + rueda para acercar el mapa',
      'TouchPanBlocker.Message': 'Usa dos dedos para mover el mapa',
      'NavigationControl.ZoomIn': 'Acercar', 'NavigationControl.ZoomOut': 'Alejar', 'NavigationControl.ResetBearing': 'Volver al norte',
    },
  });
  map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-right');
  map.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-right');

  // Panel: zonas, lista de estaciones y ficha
  const panel = document.createElement('aside');
  panel.className = 'red';
  panel.setAttribute('aria-label', 'Estaciones de la red');
  panel.innerHTML = `
    <div class="red-zonas">${Object.entries(ZONAS).map(([k, z]) => `<button type="button" data-zona="${k}"><b>${z.nombre}</b><span>${z.sub}</span></button>`).join('')}</div>
    <p class="red-viento"></p>
    <ul class="red-lista"></ul>
    <div class="red-ficha" aria-live="polite"></div>`;
  shell.append(panel);
  const lista = panel.querySelector('.red-lista');
  const ficha = panel.querySelector('.red-ficha');
  const viento = panel.querySelector('.red-viento');

  const hist = new Map(ESTACIONES.map((s) => [s.id, Array.from({ length: 30 }, (_, i) => Math.sin(i / 3 + s.v) * 0.5)]));
  const lee = (s) => {
    const e = hist.get(s.id).at(-1);
    const v = s.v * (1 + e * 0.06);
    return { v: v.toLocaleString('es-CL', { minimumFractionDigits: s.dec, maximumFractionDigits: s.dec }), score: Math.round(s.score - e * 3) };
  };
  const hora = () => new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  // Marcadores HTML: punto cuadrado + etiqueta con la lectura
  const marcas = new Map();
  for (const s of ESTACIONES) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'mb-est';
    b.innerHTML = '<i></i><span><b></b> <em></em></span>';
    b.querySelector('b').textContent = s.id;
    b.addEventListener('click', () => elige(s.id, true));
    marcas.set(s.id, b);
    new mapboxgl.Marker({ element: b, anchor: 'left', offset: [-6, 0] }).setLngLat([s.lng, s.lat]).addTo(map);
  }
  for (const r of RECLAMOS) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'mb-rec';
    b.setAttribute('aria-label', `Reclamo ${r.id}: ${r.motivo}`);
    b.innerHTML = `<i></i><span>Reclamo ${r.id}</span>`;
    b.addEventListener('click', () => eligeReclamo(r));
    new mapboxgl.Marker({ element: b, anchor: 'left', offset: [-7, 0] }).setLngLat([r.lng, r.lat]).addTo(map);
  }
  for (const z of Object.values(ZONAS)) {
    const t = document.createElement('span');
    t.className = 'mb-area';
    t.textContent = z.area.nombre;
    new mapboxgl.Marker({ element: t }).setLngLat(z.area.etiqueta).addTo(map);
  }

  let elegida = null;
  let listaZona = null;
  const pintaLista = () => {
    if (listaZona !== zona) {
      listaZona = zona;
      lista.replaceChildren(...ESTACIONES.filter((s) => s.zona === zona).map((s) => {
        const li = document.createElement('li');
        li.innerHTML = '<button type="button"><i></i><span><b></b><small></small></span><em></em></button>';
        li.dataset.id = s.id;
        li.querySelector('b').textContent = `${s.id} · ${s.nombre}`;
        li.querySelector('button').addEventListener('click', () => elige(s.id, true));
        return li;
      }));
    }
    for (const li of lista.children) {
      const s = ESTACIONES.find((x) => x.id === li.dataset.id);
      const { v, score } = lee(s);
      const [cls, palabra] = estado(score);
      li.querySelector('button').classList.toggle('is-on', s.id === elegida);
      li.querySelector('i').className = `st-${cls}`;
      li.querySelector('small').textContent = `${s.tipo} · ${palabra}`;
      li.querySelector('em').textContent = `${v} ${s.unidad}`;
    }
  };
  const pintaMarcas = () => {
    for (const s of ESTACIONES) {
      const { v, score } = lee(s);
      const b = marcas.get(s.id);
      b.dataset.st = estado(score)[0];
      b.classList.toggle('is-on', s.id === elegida);
      b.querySelector('em').textContent = `${s.var} ${v} ${s.unidad}`;
      b.setAttribute('aria-label', `${s.id} ${s.nombre}: ${s.var} ${v} ${s.unidad}, score ${score}`);
    }
  };
  const linea = (s) => {
    const h = hist.get(s.id);
    return h.map((e, i) => `${(i / (h.length - 1)) * 260},${24 - e * 20}`).join(' ');
  };
  const pintaFicha = () => {
    const s = ESTACIONES.find((x) => x.id === elegida);
    if (!s) return;
    const { v, score } = lee(s);
    const [cls, palabra] = estado(score);
    const rec = RECLAMOS.find((r) => r.cerca === s.id);
    ficha.innerHTML = `
      <p class="rf-cab"><span></span><span class="st-txt-${cls}"></span></p>
      <p class="rf-lectura"><b></b> <span></span></p>
      <svg viewBox="0 0 260 48" preserveAspectRatio="none" aria-hidden="true"><polyline fill="none" stroke="#8FA6E0" stroke-width="1.6" points="${linea(s)}" /></svg>
      <p class="rf-ref"></p>
      ${rec ? '<p class="rf-rec"></p>' : ''}
      <p class="rf-hora"></p>`;
    const q = (c) => ficha.querySelector(c);
    q('.rf-cab span').textContent = `${s.id} · ${s.nombre}`;
    q(`.st-txt-${cls}`).textContent = `${palabra} · score ${score}`;
    q('.rf-lectura b').textContent = v;
    q('.rf-lectura span').textContent = `${s.unidad} · ${s.var}`;
    q('.rf-ref').textContent = s.ref;
    if (rec) q('.rf-rec').textContent = `Reclamo ${rec.id} a ${rec.hace} min de aquí: «${rec.motivo}». Cae dentro de la pluma estimada.`;
    q('.rf-hora').textContent = `Última lectura ${hora()}`;
  };
  const elige = (id, mover) => {
    elegida = id;
    const s = ESTACIONES.find((x) => x.id === id);
    if (s.zona !== zona) ponZona(s.zona, false);
    pintaLista(); pintaMarcas(); pintaFicha();
    if (mover) { quieto(); map.flyTo({ center: [s.lng, s.lat], zoom: Math.max(map.getZoom(), 14.4), padding: relleno(), duration: reduce ? 0 : 1600, essential: true }); }
  };
  const eligeReclamo = (r) => {
    elige(r.cerca, false);
    quieto();
    map.flyTo({ center: [r.lng, r.lat], zoom: 14.6, padding: relleno(), duration: reduce ? 0 : 1600, essential: true });
  };
  const ponZona = (k, mover = true) => {
    zona = k;
    panel.querySelectorAll('[data-zona]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.zona === k)));
    viento.textContent = `${ZONAS[k].viento} · pluma estimada hacia el ${ZONAS[k].hacia}`;
    if (mover) {
      // al cambiar de zona, se abre la estación con peor score
      elige(ESTACIONES.filter((s) => s.zona === k).sort((a, b) => a.score - b.score)[0].id, false);
      map.flyTo({ ...ZONAS[k].vista, padding: relleno(), duration: reduce ? 0 : 2400, essential: true });
    }
  };
  panel.querySelectorAll('[data-zona]').forEach((b) => b.addEventListener('click', () => { quieto(); ponZona(b.dataset.zona); }));

  // Giro lento de cámara hasta que la persona toque el mapa
  let girar = !reduce;
  const quieto = () => { girar = false; map.stop(); };
  const gira = () => { if (girar && visible) map.easeTo({ bearing: map.getBearing() + 10, duration: 9000, easing: (x) => x }); };
  map.on('moveend', (e) => { if (!e.originalEvent) gira(); });
  ['dragstart', 'zoomstart', 'rotatestart', 'pitchstart'].forEach((ev) => map.on(ev, (e) => { if (e.originalEvent) quieto(); }));

  let visible = true;
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) gira(); }).observe(shell);
  let cargado = false;
  map.on('load', () => {
    cargado = true;
    fallback.hidden = true;
    basalto(map);
    try {
      map.addSource('dem', { type: 'raster-dem', url: 'mapbox://mapbox.mapbox-terrain-dem-v1', tileSize: 512, maxzoom: 14 });
      map.setTerrain({ source: 'dem', exaggeration: 1.4 });
      map.setFog({ color: '#1A1D20', 'high-color': '#212529', 'horizon-blend': 0.1, 'space-color': '#1A1D20', 'star-intensity': 0 });
    } catch { /* sin relieve */ }
    const etiquetas = map.getStyle().layers.find((l) => l.type === 'symbol')?.id;
    map.addLayer({
      id: 'edificios', type: 'fill-extrusion', source: 'composite', 'source-layer': 'building', minzoom: 13.5, filter: ['==', 'extrude', 'true'],
      paint: { 'fill-extrusion-color': '#2A2F34', 'fill-extrusion-height': ['get', 'height'], 'fill-extrusion-base': ['get', 'min_height'], 'fill-extrusion-opacity': 0.9 },
    }, etiquetas);
    const fc = (features) => ({ type: 'FeatureCollection', features });
    map.addSource('areas', { type: 'geojson', data: fc(Object.values(ZONAS).map((z) => ({ type: 'Feature', geometry: { type: 'Polygon', coordinates: [[...z.area.poly, z.area.poly[0]]] } }))) });
    map.addLayer({ id: 'areas-f', type: 'fill', source: 'areas', paint: { 'fill-color': '#ECEAE4', 'fill-opacity': 0.04 } }, etiquetas);
    map.addLayer({ id: 'areas-l', type: 'line', source: 'areas', paint: { 'line-color': '#ECEAE4', 'line-opacity': 0.5, 'line-width': 1.2, 'line-dasharray': [3, 2] } }, etiquetas);
    // pluma: tres conos superpuestos, más denso cerca del origen
    const plumas = [];
    for (const z of Object.values(ZONAS)) for (const f of [1, 0.66, 0.36]) plumas.push({ type: 'Feature', geometry: cono(z.pluma.desde, z.pluma.rumbo, z.pluma.km * f, 17 * (0.6 + f * 0.4)) });
    map.addSource('pluma', { type: 'geojson', data: fc(plumas) });
    map.addLayer({ id: 'pluma-f', type: 'fill', source: 'pluma', paint: { 'fill-color': '#8FA6E0', 'fill-opacity': 0.12 } }, etiquetas);
    map.addSource('radios', { type: 'geojson', data: fc(ESTACIONES.map((s) => ({ type: 'Feature', geometry: { type: 'Point', coordinates: [s.lng, s.lat] } }))) });
    map.addLayer({ id: 'radios', type: 'circle', source: 'radios', paint: { 'circle-radius': ['interpolate', ['exponential', 2], ['zoom'], 12, 10, 16, 160], 'circle-color': '#ECEAE4', 'circle-opacity': 0.025, 'circle-stroke-width': 1, 'circle-stroke-color': '#ECEAE4', 'circle-stroke-opacity': 0.12, 'circle-pitch-alignment': 'map' } }, etiquetas);
    ponZona(zona, false);
    elige('OLR-101', false);
    gira();
  });
  map.on('error', () => { if (!cargado) fallback.hidden = false; });
  angosto.addEventListener('change', () => map.setPadding(relleno()));
  new ResizeObserver(() => map.resize()).observe(el);

  // Lecturas en vivo (datos de ejemplo): caminata aleatoria acotada
  setInterval(() => {
    if (!visible || !cargado) return;
    for (const s of ESTACIONES) {
      const h = hist.get(s.id);
      h.push(Math.max(-1, Math.min(1, h.at(-1) + (Math.random() - 0.5) * 0.5)));
      h.shift();
    }
    pintaMarcas(); pintaLista(); pintaFicha();
  }, 3000);
}

/* ---- Demo guiada: cinco pasos cortos y, al lado, la demo que se va armando ---- */
const guia = document.querySelector('form[data-guia]');
if (guia) {
  const NOMBRES = {
    industria: { mineria: 'Minería', energia: 'Energía y renovables', salmonicultura: 'Salmonicultura', forestal: 'Forestal', inmobiliario: 'Inmobiliario', sanitarias: 'Sanitarias', carreteras: 'Carreteras', municipio: 'Municipio', publico: 'Sector público', otra: 'Otra operación' },
    sitios: { 1: 'Un sitio', '2-5': 'De 2 a 5 sitios', '6+': 'Más de 5 sitios' },
    estaciones: { 0: 'sin estaciones todavía', '1-5': '1 a 5 estaciones', '6-20': '6 a 20 estaciones', '20+': 'más de 20 estaciones' },
    dolor: { planillas: 'juntar los datos sin planillas', reclamos: 'cruzar los reclamos con las mediciones', rca: 'seguir los compromisos RCA y su evidencia', reportes: 'preparar los reportes para la comunidad o la autoridad' },
  };
  const PISTAS = {
    aire: ['Aire', 'MP10, MP2,5 y gases', 82], ruido: ['Ruido', 'de día y de noche', 64], agua: ['Agua', 'calidad y caudal', 71],
    meteo: ['Meteorología', 'viento y lluvia', 88], comunidad: ['Comunidad', 'reclamos y actores', 54], rca: ['Compromisos RCA', 'plazos y evidencia', 69],
  };
  const FOCO = { reclamos: 'comunidad', rca: 'rca' };

  const pasos = [...guia.querySelectorAll('[data-paso]')];
  const cuenta = guia.querySelector('[data-guia-cuenta]');
  const barra = guia.querySelector('[data-guia-barra]');
  const atras = guia.querySelector('[data-atras]');
  const siguiente = guia.querySelector('[data-siguiente]');
  const enviar = guia.querySelector('[data-enviar]');
  const error = guia.querySelector('[data-form-error]');
  const email = guia.querySelector('input[type="email"]');
  const lectura = document.querySelector('[data-lectura]');
  const L = lectura ? Object.fromEntries([...lectura.querySelectorAll('[data-l]')].map((el) => [el.dataset.l, el])) : null;
  error.id = 'guia-error';
  let actual = 0;

  const valor = (nombre) => guia.querySelector(`input[name="${nombre}"]:checked`)?.value || '';
  const marcadas = () => [...guia.querySelectorAll('input[name="lecturas"]:checked')].map((i) => i.value);

  const pinta = () => {
    if (!L) return;
    const ind = valor('industria');
    L.industria.textContent = ind ? NOMBRES.industria[ind] : 'Elige tu tipo de operación para empezar.';
    const foco = FOCO[valor('dolor')];
    const lista = marcadas();
    const yaEstan = new Set([...L.pistas.children].map((li) => li.dataset.k));
    [...L.pistas.children].forEach((li) => { if (!lista.includes(li.dataset.k)) li.remove(); });
    for (const k of lista) {
      if (yaEstan.has(k)) continue;
      const [nombre, detalle, ancho] = PISTAS[k];
      const li = document.createElement('li');
      li.dataset.k = k;
      li.innerHTML = '<p><b></b><br /><span></span></p><i></i>';
      li.querySelector('b').textContent = nombre;
      li.querySelector('span').textContent = detalle;
      li.querySelector('i').style.setProperty('--w', `${ancho}%`);
      L.pistas.append(li);
    }
    [...L.pistas.children].forEach((li) => li.classList.toggle('is-foco', li.dataset.k === foco));
    const sitios = valor('sitios'), est = valor('estaciones');
    L.escala.textContent = [sitios && NOMBRES.sitios[sitios], est && NOMBRES.estaciones[est]].filter(Boolean).join(', ');
    const dolor = valor('dolor');
    L.dolor.textContent = dolor ? `Empezamos por ${NOMBRES.dolor[dolor]}.` : '';
  };

  const falla = (msg, campo) => {
    error.textContent = msg;
    error.hidden = false;
    if (campo) { campo.setAttribute('aria-invalid', 'true'); campo.setAttribute('aria-describedby', 'guia-error'); campo.focus(); }
  };
  const ir = (n, enfocar = true) => {
    actual = n;
    pasos.forEach((p, i) => { p.hidden = i !== n; });
    cuenta.textContent = `Paso ${n + 1} de ${pasos.length}`;
    barra.style.width = `${((n + 1) / pasos.length) * 100}%`;
    atras.hidden = n === 0;
    siguiente.hidden = n === pasos.length - 1;
    enviar.hidden = n !== pasos.length - 1;
    error.hidden = true;
    if (!enfocar) return;
    const legend = pasos[n].querySelector('legend');
    legend.tabIndex = -1;
    legend.focus({ preventScroll: true });
  };
  const avanza = () => {
    if (actual === 0 && !valor('industria')) { falla('Elige una opción para seguir. Si ninguna calza, marca «Otra».'); return; }
    ir(actual + 1);
  };

  siguiente.addEventListener('click', avanza);
  atras.addEventListener('click', () => ir(actual - 1));
  guia.addEventListener('change', (ev) => {
    error.hidden = true;
    pinta();
    // la primera pregunta tiene una sola respuesta: avanza sola
    if (ev.target.name === 'industria') setTimeout(() => { if (actual === 0) ir(1); }, 280);
  });
  guia.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' && ev.target.tagName !== 'TEXTAREA' && actual < pasos.length - 1) { ev.preventDefault(); avanza(); }
  });
  email.addEventListener('input', () => { error.hidden = true; email.removeAttribute('aria-invalid'); });

  guia.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const correo = email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) { falla('Escribe un correo con el formato nombre@empresa.cl.', email); return; }
    if (enviar.disabled) return;
    const campo = (n) => guia.elements[n].value.trim();
    const datos = {
      email: correo, nombre: campo('nombre'), empresa: campo('empresa'), telefono: campo('telefono'), mensaje: campo('mensaje'),
      industria: valor('industria'), lecturas: marcadas(), sitios: valor('sitios'), estaciones: valor('estaciones'), dolor: valor('dolor'),
    };
    enviar.disabled = true;
    enviar.textContent = 'Enviando…';
    try {
      const r = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(datos) });
      const res = await r.json().catch(() => ({}));
      if (!r.ok || !res.ok) throw new Error(res.error || 'No se pudo enviar. Intenta nuevamente.');
      const ok = document.createElement('div');
      ok.className = 'form-ok';
      ok.setAttribute('role', 'status');
      ok.innerHTML = '<b>Recibido</b><p></p>';
      ok.querySelector('p').textContent = `Gracias${datos.nombre ? `, ${datos.nombre.split(' ')[0]}` : ''}. Te escribiremos a ${correo} para coordinar la demo.`;
      guia.replaceChildren(ok);
    } catch (err) {
      enviar.disabled = false;
      enviar.textContent = 'Solicitar una demo';
      falla(err.message && err.message !== 'Failed to fetch' ? err.message : 'Sin conexión. Intenta nuevamente.');
    }
  });
  ir(0, false);
  pinta();
}
