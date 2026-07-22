/* SIMCII · TERRITORIO VIVO — v4
   MapLibre (Carto Dark Matter, sin token) + ApexCharts (draw-on) + GSAP/SplitText + Lenis.
   Integraciones según investigación: lazy-init de mapa, sync Lenis↔ScrollTrigger, reduced-motion. */

(function () {
  'use strict';
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============ ESTACIONES (datos de ejemplo, geografía real) ============ */
  const STATIONS = [
    { name: 'Estación Costa AIR-001', dom: 'Aire', lng: -70.3975, lat: -23.6415, score: 82, trend: [74, 76, 75, 78, 80, 79, 82] },
    { name: 'Ruido Norte RUI-001', dom: 'Ruido', lng: -70.3920, lat: -23.6280, score: 71, trend: [69, 70, 72, 68, 70, 72, 71] },
    { name: 'Ruido Sur RUI-002', dom: 'Ruido', lng: -70.3990, lat: -23.6660, score: 74, trend: [70, 72, 71, 73, 75, 74, 74] },
    { name: 'Estación UCN MET-001', dom: 'Meteorología', lng: -70.4095, lat: -23.6810, score: 88, trend: [85, 86, 88, 87, 88, 89, 88] },
    { name: 'Las Salinas Norte', dom: 'Aire · BTEX', lng: -71.5520, lat: -33.0055, score: 76, trend: [72, 73, 75, 74, 76, 77, 76] },
    { name: 'Las Salinas Sur', dom: 'Aire · MP', lng: -71.5560, lat: -33.0160, score: 79, trend: [75, 76, 78, 77, 79, 80, 79] },
    { name: 'Olores V-01', dom: 'Olores', lng: -71.5480, lat: -33.0110, score: 64, trend: [68, 66, 65, 63, 62, 63, 64] },
    { name: 'Meteo Viña MET-V', dom: 'Meteorología', lng: -71.5430, lat: -33.0240, score: 84, trend: [82, 83, 84, 83, 85, 84, 84] },
  ];
  const colorFor = (s) => (s >= 75 ? '#6FBF8B' : s >= 65 ? '#E0B15C' : '#B96B45');
  const sparkline = (trend) => {
    const w = 96, h = 26, min = Math.min(...trend) - 2, max = Math.max(...trend) + 2;
    const pts = trend.map((v, i) => `${(i / (trend.length - 1)) * w},${h - ((v - min) / (max - min)) * h}`).join(' ');
    return `<svg class="pop-spark" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true"><polyline points="${pts}" fill="none" stroke="#6B90AC" stroke-width="1.6" stroke-linecap="round"/></svg>`;
  };

  /* ============ MAPA (lazy: init tras load, sin robar LCP) ============ */
  function initMap() {
    if (!window.maplibregl) return;
    const el = document.getElementById('map');
    if (!el) return;
    const map = new maplibregl.Map({
      container: el,
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json',
      center: [-71.2, -28.4],
      zoom: 3.7,
      attributionControl: { compact: true },
      cooperativeGestures: false,
    });
    map.scrollZoom.disable();
    map.touchZoomRotate.disableRotation();
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

    map.on('load', () => {
      document.getElementById('map-skeleton')?.classList.add('off');
      STATIONS.forEach((s) => {
        const node = document.createElement('div');
        node.className = 'stn';
        node.style.setProperty('--stn-c', colorFor(s.score));
        node.innerHTML = '<i></i>';
        node.setAttribute('aria-label', `${s.name}: score ${s.score} de 100`);
        const popup = new maplibregl.Popup({ closeButton: false, offset: 14 }).setHTML(
          `<div class="pop-name">${s.name}</div>` +
          `<div class="pop-dom">${s.dom}</div>` +
          `<div class="pop-row"><span class="pop-score" style="color:${colorFor(s.score)}">${s.score}<small> /100</small></span>${sparkline(s.trend)}</div>`
        );
        popup.setLngLat([s.lng, s.lat]);
        new maplibregl.Marker({ element: node }).setLngLat([s.lng, s.lat]).addTo(map);
        node.addEventListener('mouseenter', () => popup.addTo(map));
        node.addEventListener('mouseleave', () => popup.remove());
        node.addEventListener('click', () => popup.addTo(map));
      });
      // encuadre suave a las dos regiones
      if (!reduce) {
        setTimeout(() => {
          map.fitBounds([[-72.6, -34.0], [-69.6, -22.8]], { padding: 46, duration: 2200 });
        }, 700);
      } else {
        map.fitBounds([[-72.6, -34.0], [-69.6, -22.8]], { padding: 46, duration: 0 });
      }
    });
    map.on('error', () => document.getElementById('map-skeleton')?.classList.add('off'));
    new ResizeObserver(() => map.resize()).observe(el.parentElement);
  }

  /* ============ CHART (draw-on al entrar en viewport) ============ */
  function seriesFrom(base, seed, drift) {
    const out = [];
    let v = base - drift * 14;
    for (let i = 0; i < 30; i++) {
      v += Math.sin(i * 0.55 + seed) * 1.15 + drift * 0.95 + Math.sin(i * 1.7 + seed * 2) * 0.5;
      out.push(Math.round(Math.min(96, Math.max(35, v)) * 10) / 10);
    }
    out[29] = base;
    return out;
  }
  function initChart() {
    if (!window.ApexCharts) return;
    const el = document.getElementById('chart');
    if (!el) return;
    const days = Array.from({ length: 30 }, (_, i) => `Día ${i + 1}`);
    const chart = new ApexCharts(el, {
      chart: {
        type: 'area', height: 330, background: 'transparent',
        toolbar: { show: false }, zoom: { enabled: false },
        fontFamily: 'Montserrat, sans-serif',
        animations: reduce ? { enabled: false } : { enabled: true, speed: 1600, easing: 'easeinout', animateGradually: { enabled: true, delay: 220 } },
      },
      series: [
        { name: 'Territorial', data: seriesFrom(79.8, 1.3, 0.32) },
        { name: 'Contexto', data: seriesFrom(73.7, 4.1, 0.22) },
        { name: 'Comunidad', data: seriesFrom(53.8, 7.7, 0.12) },
      ],
      colors: ['#6FBF8B', '#6B90AC', '#B96B45'],
      stroke: { curve: 'smooth', width: 2.6, lineCap: 'round' },
      fill: { type: 'gradient', gradient: { shadeIntensity: 0.9, opacityFrom: 0.16, opacityTo: 0, stops: [0, 92] } },
      grid: { show: false, padding: { left: 6, right: 6 } },
      dataLabels: { enabled: false },
      legend: { show: false },
      xaxis: { categories: days, labels: { show: false }, axisBorder: { show: false }, axisTicks: { show: false }, tooltip: { enabled: false } },
      yaxis: { min: 30, max: 100, labels: { show: false } },
      tooltip: {
        theme: 'dark', shared: true, intersect: false,
        y: { formatter: (v) => v.toFixed(1) + ' /100' },
      },
      markers: { size: 0, hover: { size: 5 } },
    });
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      chart.render();
    }, { threshold: 0.35 });
    io.observe(el);
  }

  /* ============ FORMULARIO ============ */
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

  /* ============ ARRANQUE ============ */
  function start() {
    initChart();
    // el mapa espera al load para no competir con el LCP (investigación: proteger primer render)
    if (document.readyState === 'complete') initMap();
    else window.addEventListener('load', initMap);

    if (reduce || !window.gsap || !window.ScrollTrigger) return;
    const gsap = window.gsap;
    gsap.registerPlugin(window.ScrollTrigger);
    if (window.SplitText) gsap.registerPlugin(window.SplitText);
    const ST = window.ScrollTrigger;

    /* Lenis + sync exacto (gotchas del informe) */
    let lenis = null;
    if (window.Lenis) {
      lenis = new window.Lenis({ duration: 1.0, smoothWheel: true });
      lenis.on('scroll', ST.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
      document.documentElement.classList.add('lenis', 'lenis-smooth');
      document.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.addEventListener('click', (e) => {
          const t = a.getAttribute('href').length > 1 && document.querySelector(a.getAttribute('href'));
          if (!t) return;
          e.preventDefault();
          lenis.scrollTo(t, { offset: -70 });
        });
      });
    }

    /* choreography de carga: titular por palabras (SplitText) + stagger 60ms.
       Se espera a fonts.ready para que el split no calcule saltos de línea con la fuente fallback. */
    const title = document.getElementById('hero-title');
    if (window.SplitText && title) {
      title.style.visibility = 'hidden';
      (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => {
        title.style.visibility = '';
        const split = new window.SplitText(title, { type: 'words', wordsClass: 'w' });
        gsap.set(split.words, { yPercent: 110, opacity: 0 });
        gsap.to(split.words, { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.06, ease: 'expo.out', delay: 0.1 });
        title.style.overflow = 'hidden';
      });
    }
    gsap.from(['.hero-live', '.hero-sub', '.hero-actions'], {
      y: 26, opacity: 0, duration: 0.8, stagger: 0.07, ease: 'expo.out', delay: 0.4,
    });
    gsap.from('.hero-map', { y: 44, opacity: 0, duration: 1.0, ease: 'expo.out', delay: 0.55 });

    /* reveals con jerarquía (no el mismo fade en todo) */
    document.querySelectorAll('.sec-head').forEach((h) => {
      gsap.from(h.children, {
        y: 26, opacity: 0, stagger: 0.08, duration: 0.7, ease: 'expo.out',
        scrollTrigger: { trigger: h, start: 'top 82%', once: true },
      });
    });
    [['.bento', '.cell', 0.06, 34], ['.carrusel', '.ind', 0.05, 30], ['.conf', '.conf-col', 0.12, 40], ['.faq', 'details', 0.06, 20]].forEach(([w, i, st, dy]) => {
      const wrap = document.querySelector(w);
      if (!wrap) return;
      gsap.from(wrap.querySelectorAll(i), {
        y: dy, opacity: 0, stagger: st, duration: 0.6, ease: 'expo.out',
        scrollTrigger: { trigger: wrap, start: 'top 84%', once: true },
      });
    });

    /* pasos del método: la línea superior se enciende en secuencia */
    ST.create({
      trigger: '.pasos', start: 'top 78%', once: true,
      onEnter() {
        document.querySelectorAll('.paso').forEach((p, i) => setTimeout(() => p.classList.add('lit'), i * 180));
      },
    });
    gsap.from('.paso', {
      y: 30, opacity: 0, stagger: 0.09, duration: 0.6, ease: 'expo.out',
      scrollTrigger: { trigger: '.pasos', start: 'top 82%', once: true },
    });

    /* quote serif: revelado */
    gsap.from('.quote blockquote, .quote figcaption', {
      y: 30, opacity: 0, stagger: 0.12, duration: 0.9, ease: 'expo.out',
      scrollTrigger: { trigger: '.quote', start: 'top 78%', once: true },
    });

    /* contadores del strip */
    document.querySelectorAll('[data-count]').forEach((el) => {
      const target = parseFloat(el.dataset.count);
      const dec = parseInt(el.dataset.decimals || '0', 10);
      const state = { v: 0 };
      ST.create({
        trigger: el, start: 'top 92%', once: true,
        onEnter() {
          gsap.to(state, { v: target, duration: 1.3, ease: 'expo.out', onUpdate() { el.textContent = state.v.toFixed(dec); } });
        },
      });
    });

    /* parallax sutil del mapa (0.94x) */
    gsap.to('.hero-map', {
      y: -26, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.8 },
    });

    /* CTA magnético */
    document.querySelectorAll('[data-magnetic]').forEach((btn) => {
      const xTo = gsap.quickTo(btn, 'x', { duration: 0.35, ease: 'expo.out' });
      const yTo = gsap.quickTo(btn, 'y', { duration: 0.35, ease: 'expo.out' });
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * 0.15);
        yTo((e.clientY - (r.top + r.height / 2)) * 0.25);
      });
      btn.addEventListener('mouseleave', () => { xTo(0); yTo(0); });
    });

    window.addEventListener('load', () => ST.refresh());
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
