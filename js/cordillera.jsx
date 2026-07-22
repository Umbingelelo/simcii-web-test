
// Cordillera3D — elemento 3D de marca: 3 planos en profundidad.
// Plano frontal terracota (macizo) · medio azul · fondo gris.
// three.js (global THREE). Fallback SVG si no hay WebGL o reduced-motion.

const CORD_COLORS = {
  frontal: 0xB96B45, // terracota — señal / plano frontal
  medio:   0x2F5D7C, // azul cívico
  fondo:   0x8A8C8E, // gris ciudad
};

// Perfil de cresta jagged determinista (7 vértices, estilo isotipo)
function ridgeProfile(width, segments, peaks, baseY, amp, phase) {
  const pts = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const x = -width / 2 + t * width;
    // suma de senos + picos discretos para una silueta de montaña
    const jag =
      Math.sin(t * peaks * Math.PI + phase) * amp +
      Math.sin(t * peaks * 2.3 * Math.PI + phase * 1.7) * amp * 0.35 +
      Math.sin(t * peaks * 5.1 * Math.PI + phase * 0.5) * amp * 0.14;
    pts.push([x, baseY + Math.abs(jag)]);
  }
  return pts;
}

function buildRidgeMesh(THREE, { width, color, baseY, amp, peaks, depth, opacity }) {
  const top = ridgeProfile(width, 80, peaks, baseY, amp, peaks);
  const shape = new THREE.Shape();
  shape.moveTo(-width / 2, -14);
  top.forEach(([x, y], i) => (i === 0 ? shape.lineTo(x, y) : shape.lineTo(x, y)));
  shape.lineTo(width / 2, -14);
  shape.lineTo(-width / 2, -14);
  const geo = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false });
  geo.computeVertexNormals();
  const mat = new THREE.MeshStandardMaterial({
    color, flatShading: true, roughness: 0.92, metalness: 0.0,
    transparent: opacity < 1, opacity,
  });
  return new THREE.Mesh(geo, mat);
}

function SvgCordilleraFallback({ style }) {
  // Silueta estática de 3 planos (sin WebGL / reduced-motion)
  return (
    <svg viewBox="0 0 460 200" preserveAspectRatio="xMidYMax meet" style={{ width: '100%', height: '100%', display: 'block', ...style }} aria-hidden="true">
      <path d="M0 150 L70 95 L120 130 L180 70 L240 120 L300 60 L360 110 L420 80 L460 120 L460 200 L0 200 Z" fill="var(--gris-ciudad)" opacity="0.32" />
      <path d="M0 170 L80 120 L140 150 L210 100 L270 140 L340 95 L400 135 L460 110 L460 200 L0 200 Z" fill="var(--azul-deep)" opacity="0.9" />
      <path d="M0 200 L90 150 L160 178 L230 140 L300 175 L370 145 L440 180 L460 165 L460 200 Z" fill="var(--terracota)" />
    </svg>
  );
}

function Cordillera3D({ height = 540, style }) {
  const mountRef = React.useRef(null);
  const [fallback, setFallback] = React.useState(false);

  React.useEffect(() => {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const THREE = window.THREE;
    const el = mountRef.current;
    if (!THREE || !el) { setFallback(true); return; }

    // Detecta WebGL
    let supported = true;
    try {
      const c = document.createElement('canvas');
      supported = !!(c.getContext('webgl') || c.getContext('experimental-webgl'));
    } catch { supported = false; }
    if (!supported) { setFallback(true); return; }

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch { setFallback(true); return; }

    const W0 = el.clientWidth || 480;
    const H0 = el.clientHeight || height;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(W0, H0);
    el.appendChild(renderer.domElement);
    renderer.domElement.style.display = 'block';

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, W0 / H0, 0.1, 200);
    camera.position.set(0, 6, 46);
    camera.lookAt(0, 4, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.62));
    const key = new THREE.DirectionalLight(0xfff4e8, 0.95);
    key.position.set(-14, 22, 18);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x5C82A0, 0.35);
    rim.position.set(18, 8, -10);
    scene.add(rim);

    const group = new THREE.Group();
    // Fondo (gris, más alto y atrás), medio (azul), frontal (terracota, macizo y adelante)
    const fondo = buildRidgeMesh(THREE, { width: 64, color: CORD_COLORS.fondo, baseY: 6, amp: 9, peaks: 4, depth: 2, opacity: 0.5 });
    fondo.position.set(2, 0, -16);
    const medio = buildRidgeMesh(THREE, { width: 62, color: CORD_COLORS.medio, baseY: 3, amp: 7.5, peaks: 5, depth: 3, opacity: 1 });
    medio.position.set(-2, 0, -7);
    const frontal = buildRidgeMesh(THREE, { width: 60, color: CORD_COLORS.frontal, baseY: 0, amp: 6, peaks: 6, depth: 4, opacity: 1 });
    frontal.position.set(0, 0, 2);
    group.add(fondo, medio, frontal);
    group.position.y = -4;
    group.rotation.x = -0.04;
    scene.add(group);

    let raf, t = 0;
    let targetRY = 0, targetRX = -0.04, curRY = 0, curRX = -0.04;
    let scrollY = window.scrollY || 0;

    const onPointer = (e) => {
      const r = el.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width - 0.5);
      const ny = ((e.clientY - r.top) / r.height - 0.5);
      targetRY = nx * 0.14;
      targetRX = -0.04 - ny * 0.06;
    };
    const onScroll = () => { scrollY = window.scrollY || 0; };
    if (!reduce) {
      window.addEventListener('pointermove', onPointer, { passive: true });
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    const render = () => {
      t += 0.0045;
      if (!reduce) {
        curRY += (targetRY + Math.sin(t) * 0.03 - curRY) * 0.05;
        curRX += (targetRX - curRX) * 0.05;
        group.rotation.y = curRY;
        group.rotation.x = curRX;
        camera.position.y = 6 - (scrollY * 0.004);
      }
      renderer.render(scene, camera);
      raf = requestAnimationFrame(render);
    };
    render();

    const ro = new ResizeObserver(() => {
      const w = el.clientWidth, h = el.clientHeight || height;
      if (!w || !h) return;
      camera.aspect = w / h; camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    ro.observe(el);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('scroll', onScroll);
      scene.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, [height]);

  if (fallback) {
    return <div style={{ width: '100%', height, display: 'flex', alignItems: 'flex-end', ...style }}><SvgCordilleraFallback /></div>;
  }
  return <div ref={mountRef} style={{ width: '100%', height, ...style }} aria-hidden="true" />;
}

// Marcador de sección — mini cordillera (reemplaza al § tipográfico)
function SectionMark() {
  return (
    <svg width="18" height="9" viewBox="0 0 24 12" aria-hidden="true" style={{ display: 'inline-block', verticalAlign: 'baseline', marginRight: 4 }}>
      <polyline points="1,11 7,3 11,8 16,2 23,9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

Object.assign(window, { Cordillera3D, SvgCordilleraFallback, SectionMark });
