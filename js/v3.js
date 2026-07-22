/* SIMCII · SEÑAL — v3 · Lenis + GSAP + tour de producto + contadores + formulario */
(function () {
  'use strict';
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Lenis ---- */
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new window.Lenis({ duration: 1.0, smoothWheel: true });
    (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0);
    document.documentElement.classList.add('lenis', 'lenis-smooth');
  }
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const t = a.getAttribute('href').length > 1 && document.querySelector(a.getAttribute('href'));
      if (!t) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(t, { offset: -70 });
      else t.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ---- Tour del producto: pasos → screenshot ---- */
  const steps = [...document.querySelectorAll('.step')];
  const shots = [...document.querySelectorAll('#tour-shot img')];
  const caption = document.getElementById('tour-caption');
  const captions = [
    'Resumen general · scores y mapa en vivo',
    'Evolución de puntajes por territorio',
    'Comunidad · actores y alertas tempranas',
  ];
  function activate(step) {
    steps.forEach((s) => s.classList.remove('active'));
    step.classList.add('active');
    const i = parseInt(step.dataset.shot, 10) || 0;
    shots.forEach((img, k) => img.classList.toggle('on', k === i));
    if (caption) caption.textContent = captions[i] || '';
  }
  steps.forEach((s) => {
    s.addEventListener('click', () => activate(s));
    s.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(s); } });
    s.setAttribute('tabindex', '0');
    s.setAttribute('role', 'button');
  });
  // auto-avance suave del tour mientras la sección está a la vista
  if (!reduce && steps.length) {
    let idx = 0, timer = null;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !timer) {
        timer = setInterval(() => { idx = (idx + 1) % steps.length; activate(steps[idx]); }, 4200);
      } else if (!e.isIntersecting && timer) { clearInterval(timer); timer = null; }
    }, { threshold: 0.35 });
    io.observe(document.getElementById('tour-steps'));
    // interacción manual detiene el auto-avance
    steps.forEach((s) => s.addEventListener('click', () => { if (timer) { clearInterval(timer); timer = null; } }));
  }

  /* ---- Formulario (endpoint real) ---- */
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

  if (reduce || !window.gsap || !window.ScrollTrigger) return;
  const gsap = window.gsap;
  gsap.registerPlugin(window.ScrollTrigger);
  if (lenis) lenis.on('scroll', window.ScrollTrigger.update);

  /* ---- entrada del hero ---- */
  gsap.from(['.hero-eyebrow', '.hero h1', '.hero-sub', '.hero-cta'], {
    y: 34, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out', delay: 0.15,
  });
  gsap.from('.hero-collage', { y: 70, opacity: 0, duration: 1.1, ease: 'power3.out', delay: 0.5 });
  gsap.from('.block', {
    scale: 0, transformOrigin: 'center', stagger: 0.12, duration: 0.7, ease: 'back.out(2)', delay: 0.8,
  });

  /* ---- reveals por sección ---- */
  document.querySelectorAll('.sec-head').forEach((h) => {
    gsap.from(h.children, {
      y: 30, opacity: 0, stagger: 0.09, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: h, start: 'top 82%', once: true },
    });
  });
  [['.bento', '.cell'], ['.carrusel', '.ind'], ['.conf-grid', '.conf-card'], ['.faq-list', 'details'], ['.strip .wrap', '.strip-item']].forEach(([w, i]) => {
    const wrap = document.querySelector(w);
    if (!wrap) return;
    gsap.from(wrap.querySelectorAll(i), {
      y: 36, opacity: 0, stagger: 0.07, duration: 0.6, ease: 'power3.out',
      scrollTrigger: { trigger: wrap, start: 'top 84%', once: true },
    });
  });

  /* ---- parallax sutil del collage ---- */
  gsap.to('.hero-collage .shot', {
    y: -28, ease: 'none',
    scrollTrigger: { trigger: '.hero-collage', start: 'top bottom', end: 'bottom top', scrub: 0.8 },
  });
  gsap.to('.block-terra', {
    y: 34, ease: 'none',
    scrollTrigger: { trigger: '.hero-collage', start: 'top bottom', end: 'bottom top', scrub: 1 },
  });

  /* ---- contadores ---- */
  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = parseFloat(el.dataset.count);
    const state = { v: 0 };
    window.ScrollTrigger.create({
      trigger: el, start: 'top 88%', once: true,
      onEnter() {
        gsap.to(state, {
          v: target, duration: 1.4, ease: 'power3.out',
          onUpdate() { el.firstChild.textContent = state.v.toFixed(1); },
        });
      },
    });
  });

  window.addEventListener('load', () => window.ScrollTrigger.refresh());
})();
