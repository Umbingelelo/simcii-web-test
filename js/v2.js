/* SIMCII · EXPEDIENTE — v2 desde cero
   Cordillera generativa (canvas) · Lenis · GSAP ScrollTrigger · índice · formulario */

(function () {
  'use strict';
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============ CORDILLERA GENERATIVA (canvas 2D) ============
     Tres planos — gris contorno, azul cívico, terracota — generados con
     ruido determinista (suma de senos), con drift lento y parallax de scroll. */
  const ridge = (() => {
    const canvas = document.getElementById('ridge');
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, dpr = 1, t = 0, scrollY = 0, raf = null;

    const LAYERS = [
      { color: '#3a3c41', alpha: 0.55, base: 0.52, amp: 0.16, freq: 1.15, seed: 11, speed: 0.008, par: 0.05, fill: false },
      { color: '#234A63', alpha: 0.9,  base: 0.62, amp: 0.20, freq: 0.85, seed: 47, speed: 0.012, par: 0.12, fill: true },
      { color: '#B96B45', alpha: 1,    base: 0.76, amp: 0.17, freq: 0.6,  seed: 83, speed: 0.016, par: 0.22, fill: true },
    ];

    function noise(x, seed) {
      return (
        Math.sin(x * 1.7 + seed) * 0.5 +
        Math.sin(x * 3.3 + seed * 2.1) * 0.28 +
        Math.sin(x * 6.1 + seed * 0.7) * 0.14 +
        Math.sin(x * 12.7 + seed * 1.3) * 0.08
      );
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const steps = Math.max(90, Math.floor(w / 12));
      LAYERS.forEach((L) => {
        const yBase = h * L.base + scrollY * L.par;
        ctx.beginPath();
        ctx.moveTo(-4, h + 4);
        for (let i = 0; i <= steps; i++) {
          const x = (i / steps) * (w + 8) - 4;
          const n = noise((i / steps) * L.freq * 6 + t * L.speed, L.seed);
          const y = yBase + n * h * L.amp;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w + 4, h + 4);
        ctx.closePath();
        ctx.globalAlpha = L.alpha;
        if (L.fill) { ctx.fillStyle = L.color; ctx.fill(); }
        else { ctx.strokeStyle = L.color; ctx.lineWidth = 1.4; ctx.stroke(); }
      });
      ctx.globalAlpha = 1;
    }

    function loop() { t += 1; draw(); raf = requestAnimationFrame(loop); }

    resize();
    window.addEventListener('resize', () => { resize(); draw(); });
    if (reduce) { draw(); }
    else {
      loop();
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) { cancelAnimationFrame(raf); raf = null; }
        else if (!raf) loop();
      });
    }
    return { setScroll(y) { scrollY = y; } };
  })();

  /* ============ PRELOADER (calibración) ============ */
  const loader = document.getElementById('loader');
  const seen = (() => { try { return sessionStorage.getItem('simcii_v2_seen') === '1'; } catch (e) { return false; } })();
  function dismissLoader() {
    if (!loader) return;
    loader.classList.add('done');
    try { sessionStorage.setItem('simcii_v2_seen', '1'); } catch (e) {}
    setTimeout(() => loader.remove(), 900);
  }
  if (!loader || reduce || seen) { if (loader) loader.remove(); }
  else {
    const num = document.getElementById('loader-num');
    const state = { v: 0 };
    const target = 4500;
    const start = performance.now();
    (function tick(now) {
      const p = Math.min((now - start) / 850, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      state.v = target * eased;
      if (num) num.textContent = String(Math.round(state.v)).padStart(4, '0');
      if (p < 1) requestAnimationFrame(tick);
      else dismissLoader();
    })(start);
    setTimeout(dismissLoader, 2200); // red de seguridad
  }

  /* ============ LENIS (scroll suave) ============ */
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new window.Lenis({ duration: 1.05, smoothWheel: true });
    function rafLenis(time) { lenis.raf(time); requestAnimationFrame(rafLenis); }
    requestAnimationFrame(rafLenis);
    document.documentElement.classList.add('lenis', 'lenis-smooth');
    lenis.on('scroll', (e) => { if (ridge) ridge.setScroll(e.scroll * 1); });
  } else {
    window.addEventListener('scroll', () => { if (ridge) ridge.setScroll(window.scrollY); }, { passive: true });
  }

  // anclas → scroll suave
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      const target = id.length > 1 && document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: -64 });
      else target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ============ FORMULARIO (endpoint real /api/contact) ============ */
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
      const prev = button.innerHTML;
      button.textContent = 'Enviando…';
      errorEl.hidden = true;
      try {
        const r = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = await r.json().catch(() => ({}));
        if (!r.ok || !data.ok) throw new Error(data.error || 'No se pudo enviar. Intenta nuevamente.');
        const ok = document.createElement('div');
        ok.className = 'form-success';
        ok.setAttribute('role', 'status');
        ok.innerHTML = '<div class="tag"><span class="pip" style="background:var(--claro)"></span>Recibido</div><div class="msg">Gracias. Te contactaremos pronto.</div>';
        form.replaceWith(ok);
      } catch (err) {
        errorText.textContent = (err && err.message && err.message !== 'Failed to fetch') ? err.message : 'Sin conexión. Intenta nuevamente.';
        errorEl.hidden = false;
        button.disabled = false;
        button.innerHTML = prev;
      }
    });
  });

  if (reduce) return; // desde aquí, todo es coreografía

  /* ============ GSAP ============ */
  if (!window.gsap || !window.ScrollTrigger) return;
  const gsap = window.gsap;
  gsap.registerPlugin(window.ScrollTrigger);
  const ST = window.ScrollTrigger;
  if (lenis) lenis.on('scroll', ST.update);

  // -- entrada del hero (máscaras escalonadas) --
  const heroBits = ['.portada-eyebrow', '.portada-body .h-display', '.portada-body .lede', '.portada-actions'];
  gsap.set(heroBits, { y: 46, opacity: 0 });
  gsap.to(heroBits, {
    y: 0, opacity: 1, duration: 1.1, stagger: 0.11,
    ease: 'power4.out', delay: seen ? 0.15 : 1.0,
  });
  gsap.from('.portada-coords', { opacity: 0, duration: 1.2, delay: seen ? 0.6 : 1.5 });

  // -- salida del hero con scroll --
  gsap.to('.portada-body', {
    yPercent: -14, opacity: 0.25, ease: 'none',
    scrollTrigger: { trigger: '.portada', start: 'top top', end: 'bottom 40%', scrub: 0.6 },
  });

  // -- titulares de capítulo: máscara + barrido --
  document.querySelectorAll('.chapter .h-chapter').forEach((h) => {
    gsap.fromTo(h, { clipPath: 'inset(0 0 100% 0)', y: 30 }, {
      clipPath: 'inset(0 0 -10% 0)', y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: h, start: 'top 84%', once: true },
    });
  });

  // -- manifesto: revelado por palabras --
  const manifesto = document.querySelector('.manifesto');
  if (manifesto) {
    const nodes = [];
    (function split(el) {
      [...el.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((word) => {
            if (!word.trim()) { frag.appendChild(document.createTextNode(word)); return; }
            const s = document.createElement('span');
            s.style.display = 'inline-block';
            s.textContent = word;
            frag.appendChild(s);
            nodes.push(s);
          });
          el.replaceChild(frag, n);
        } else if (n.nodeType === 1) split(n);
      });
    })(manifesto);
    gsap.fromTo(nodes, { opacity: 0.14, y: 8 }, {
      opacity: 1, y: 0, stagger: 0.02, ease: 'none',
      scrollTrigger: { trigger: manifesto, start: 'top 78%', end: 'bottom 45%', scrub: 0.4 },
    });
  }

  // -- MÉTODO: pin + scrub horizontal (el momento orquestado) --
  const stage = document.getElementById('metodo-stage');
  const track = document.getElementById('metodo-track');
  if (stage && track && window.innerWidth >= 720) {
    const dist = () => track.scrollWidth - window.innerWidth + 80;
    gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: {
        trigger: stage, start: 'top 16%', end: () => '+=' + (dist() * 0.9),
        pin: true, scrub: 0.5, invalidateOnRefresh: true, anticipatePin: 1,
      },
    });
    const line = document.getElementById('metodo-line');
    if (line) {
      const len = line.getTotalLength();
      gsap.fromTo(line, { strokeDasharray: len, strokeDashoffset: len }, {
        strokeDashoffset: 0, ease: 'none',
        scrollTrigger: { trigger: stage, start: 'top 16%', end: () => '+=' + (dist() * 0.9), scrub: 0.5 },
      });
    }
    gsap.utils.toArray('.mnode').forEach((c, i) => {
      gsap.fromTo(c, { scale: 0, transformOrigin: 'center' }, {
        scale: 1, ease: 'back.out(2.5)', duration: 0.4,
        scrollTrigger: { trigger: stage, start: () => 'top+=' + (dist() * 0.9 * (i / 4)) + ' 16%', once: true },
      });
    });
  }

  // -- entradas: módulos, filas de sectores, capas, fases --
  [
    ['.modulos', '.modulo', 0.08],
    ['.sectores-list', '.sector-row', 0.05],
    ['.capas', '.capa', 0.07],
    ['.fases', '.fase', 0.1],
  ].forEach(([wrapSel, itemSel, stagger]) => {
    const wrap = document.querySelector(wrapSel);
    if (!wrap) return;
    gsap.fromTo(wrap.querySelectorAll(itemSel), { opacity: 0, y: 34 }, {
      opacity: 1, y: 0, stagger, duration: 0.6, ease: 'power3.out',
      scrollTrigger: { trigger: wrap, start: 'top 84%', once: true },
    });
  });

  // -- bezels (pantallas): revelado con profundidad --
  gsap.utils.toArray('.bezel').forEach((b) => {
    gsap.fromTo(b, { opacity: 0, y: 56, scale: 0.985 }, {
      opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: b, start: 'top 86%', once: true },
    });
  });

  // -- contadores de score (datos reales de la demo) --
  document.querySelectorAll('.score .val').forEach((el) => {
    const target = parseFloat(el.dataset.count);
    const small = el.querySelector('small');
    const state = { v: 0 };
    ST.create({
      trigger: el, start: 'top 88%', once: true,
      onEnter() {
        gsap.to(state, {
          v: target, duration: 1.4, ease: 'power3.out',
          onUpdate() { el.firstChild.textContent = state.v.toFixed(1); },
        });
      },
    });
    void small;
  });

  // -- índice del expediente: activo + progreso --
  const idxLinks = document.querySelectorAll('.indice a');
  idxLinks.forEach((a) => {
    const target = document.getElementById(a.dataset.chapter);
    if (!target) return;
    ST.create({
      trigger: target, start: 'top 55%', end: 'bottom 55%',
      onToggle(self) {
        if (!self.isActive) return;
        idxLinks.forEach((x) => x.classList.remove('active'));
        a.classList.add('active');
      },
    });
  });
  const progress = document.getElementById('indice-progress');
  if (progress) {
    ST.create({
      start: 0, end: () => document.documentElement.scrollHeight - window.innerHeight,
      onUpdate(self) { progress.style.height = (self.progress * 100) + '%'; },
    });
  }

  // -- coordenadas vivas del hero (drift documental) --
  const coords = document.getElementById('coords-live');
  if (coords) {
    ST.create({
      start: 0, end: 'max',
      onUpdate(self) {
        const lat = 33.02 + self.progress * 0.9;
        const lon = 71.37 + self.progress * 0.6;
        coords.textContent = lat.toFixed(2).replace('.', '°') + '′S · ' + lon.toFixed(2).replace('.', '°') + '′W';
      },
    });
  }

  // -- CTA magnético --
  document.querySelectorAll('[data-magnetic]').forEach((btn) => {
    const xTo = gsap.quickTo(btn, 'x', { duration: 0.35, ease: 'power3.out' });
    const yTo = gsap.quickTo(btn, 'y', { duration: 0.35, ease: 'power3.out' });
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * 0.16);
      yTo((e.clientY - (r.top + r.height / 2)) * 0.26);
    });
    btn.addEventListener('mouseleave', () => { xTo(0); yTo(0); });
  });

  // -- la cinta acelera con la velocidad del scroll --
  const cinta = document.getElementById('cinta-track');
  if (cinta) {
    cinta.innerHTML += cinta.innerHTML; // duplicar para loop continuo
    const speed = { f: 1 };
    ST.create({
      start: 0, end: 'max',
      onUpdate(self) {
        const v = Math.min(Math.abs(self.getVelocity()) / 900, 2.5);
        gsap.to(speed, { f: 1 + v, duration: 0.4, overwrite: true });
      },
    });
    gsap.ticker.add(() => { cinta.style.animationDuration = (46 / speed.f) + 's'; });
  }

  window.addEventListener('load', () => ST.refresh());
})();
