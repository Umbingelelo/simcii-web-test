// fx — coreografía de scroll GSAP · "la página se sube como una montaña"
// Corre fuera de React, sobre el DOM ya hidratado. Respeta prefers-reduced-motion.

(function () {
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Capítulos: selector → etiqueta del altímetro
  const CHAPTERS = [['#top', '01 · Plataforma'], ['#problem', '02 · Principio'], ['#method', '03 · Método'], ['#modules', '04 · Módulos'], ['#platform', '05 · La plataforma'], ['#casestudy', '06 · En operación'], ['#sectors', '07 · Sectores'], ['.diff-section', '08 · Diferenciadores'], ['#security', '09 · Seguridad'], ['#implementation', '10 · Implementación'], ['.founder-section', '11 · Promesa'], ['#demo', '12 · Contacto']];
  const CUMBRE = 4500; // m.s.n.m. al llegar al contacto

  function buildAltimeter() {
    const el = document.createElement('div');
    el.className = 'altimeter';
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = '<div class="alt-scale"><span class="alt-needle"></span></div>' + '<div class="alt-read"><span class="alt-value">0000</span><span class="alt-unit">m.s.n.m.</span></div>' + '<div class="alt-chapter">01 · Plataforma</div>';
    document.body.appendChild(el);
    return el;
  }
  function init() {
    if (!window.gsap || !window.ScrollTrigger) return;
    const gsap = window.gsap;
    gsap.registerPlugin(window.ScrollTrigger);
    const ST = window.ScrollTrigger;

    // ---- 1. Altímetro (indicador de progreso narrativo) ----
    if (window.innerWidth >= 1280) {
      const alt = buildAltimeter();
      const valueEl = alt.querySelector('.alt-value');
      const chapterEl = alt.querySelector('.alt-chapter');
      const needle = alt.querySelector('.alt-needle');
      const state = {
        v: 0
      };
      ST.create({
        start: 0,
        end: () => document.documentElement.scrollHeight - window.innerHeight,
        onUpdate(self) {
          gsap.to(state, {
            v: self.progress * CUMBRE,
            duration: 0.35,
            ease: 'power2.out',
            overwrite: true,
            onUpdate() {
              valueEl.textContent = String(Math.round(state.v)).padStart(4, '0');
            }
          });
          needle.style.top = 100 - self.progress * 100 + '%';
        }
      });
      CHAPTERS.forEach(([sel, label]) => {
        const target = document.querySelector(sel);
        if (!target) return;
        ST.create({
          trigger: target,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle(self) {
            if (!self.isActive) return;
            chapterEl.textContent = label;
            gsap.fromTo(chapterEl, {
              opacity: 0,
              y: 6
            }, {
              opacity: 1,
              y: 0,
              duration: 0.4,
              ease: 'power2.out'
            });
          }
        });
      });
    }

    // ---- 2. Hero cinemático: salida con parallax al hacer scroll ----
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
      gsap.to('.hero-headline, .hero-subtitle, .hero-meta', {
        yPercent: -18,
        opacity: 0.15,
        ease: 'none',
        scrollTrigger: {
          trigger: heroSection,
          start: 'top top',
          end: 'bottom 35%',
          scrub: 0.6
        }
      });
      const chile = document.querySelector('.hero-chile');
      if (chile) {
        gsap.to(chile, {
          y: 90,
          scale: 1.06,
          ease: 'none',
          scrollTrigger: {
            trigger: heroSection,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.8
          }
        });
      }
    }

    // ---- 3. Titulares: revelado con barrido de clip ----
    document.querySelectorAll('main section h2').forEach(h => {
      if (h.closest('.page-cta')) return;
      gsap.fromTo(h, {
        clipPath: 'inset(0 0 100% 0)',
        y: 34
      }, {
        clipPath: 'inset(0 0 -8% 0)',
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: h,
          start: 'top 84%',
          once: true
        }
      });
    });

    // ---- 4. Método: el perfil se dibuja al subir; etapas se encienden en secuencia ----
    const profile = document.querySelector('.method-profile');
    if (profile) {
      profile.querySelectorAll('polyline').forEach(line => {
        const len = line.getTotalLength();
        gsap.fromTo(line, {
          strokeDasharray: len,
          strokeDashoffset: len
        }, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: '#method',
            start: 'top 70%',
            end: 'center 45%',
            scrub: 0.5
          }
        });
      });
      gsap.fromTo(profile.querySelectorAll('circle'), {
        scale: 0,
        transformOrigin: 'center'
      }, {
        scale: 1,
        stagger: 0.18,
        duration: 0.4,
        ease: 'back.out(2.5)',
        scrollTrigger: {
          trigger: '#method',
          start: 'top 55%',
          once: true
        }
      });
    }
    const methodCells = document.querySelectorAll('.method-grid > div');
    if (methodCells.length) {
      gsap.fromTo(methodCells, {
        opacity: 0,
        y: 36
      }, {
        opacity: 1,
        y: 0,
        stagger: 0.14,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.method-grid',
          start: 'top 80%',
          once: true
        }
      });
    }

    // ---- 5. Parallax en cordilleras divisorias y eje de implementación ----
    window.gsap.utils.toArray('.cordillera-divider').forEach(svg => {
      gsap.fromTo(svg, {
        y: 26
      }, {
        y: -26,
        ease: 'none',
        scrollTrigger: {
          trigger: svg,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });
    });
    const axis = document.querySelector('.impl-axis');
    if (axis) {
      const line = axis.querySelector('line');
      const w = 1188;
      gsap.fromTo(line, {
        attr: {
          x2: 0
        }
      }, {
        attr: {
          x2: w
        },
        ease: 'none',
        scrollTrigger: {
          trigger: '#implementation',
          start: 'top 70%',
          end: 'center 50%',
          scrub: 0.5
        }
      });
      gsap.fromTo(axis.querySelectorAll('circle'), {
        scale: 0,
        transformOrigin: 'center'
      }, {
        scale: 1,
        stagger: 0.2,
        duration: 0.35,
        ease: 'back.out(2.5)',
        scrollTrigger: {
          trigger: '#implementation',
          start: 'top 55%',
          once: true
        }
      });
    }

    // ---- 6. Cards: entrada escalonada (módulos, sectores, fases) ----
    [['.modules-grid', '.module-card'], ['.sectors-grid', '.sector-card'], ['.impl-grid', ':scope > div']].forEach(([wrapSel, itemSel]) => {
      const wrap = document.querySelector(wrapSel);
      if (!wrap) return;
      const items = wrap.querySelectorAll(itemSel);
      if (!items.length) return;
      gsap.fromTo(items, {
        opacity: 0,
        y: 44
      }, {
        opacity: 1,
        y: 0,
        stagger: 0.08,
        duration: 0.65,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: wrap,
          start: 'top 82%',
          once: true
        }
      });
    });

    // ---- 7. CTA magnético en botones primarios ----
    document.querySelectorAll('.hero-cta, .nav-cta').forEach(btn => {
      const xTo = gsap.quickTo(btn, 'x', {
        duration: 0.35,
        ease: 'power3.out'
      });
      const yTo = gsap.quickTo(btn, 'y', {
        duration: 0.35,
        ease: 'power3.out'
      });
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * 0.18);
        yTo((e.clientY - (r.top + r.height / 2)) * 0.28);
      });
      btn.addEventListener('mouseleave', () => {
        xTo(0);
        yTo(0);
      });
    });

    // ---- 8. Ticker: la cinta acelera con la velocidad del scroll ----
    const track = document.querySelector('.ticker-track');
    if (track) {
      const speed = {
        factor: 1
      };
      ST.create({
        start: 0,
        end: 'max',
        onUpdate(self) {
          const v = Math.min(Math.abs(self.getVelocity()) / 900, 3);
          gsap.to(speed, {
            factor: 1 + v,
            duration: 0.4,
            overwrite: true
          });
        }
      });
      gsap.ticker.add(() => {
        track.style.animationDuration = 50 / speed.factor + 's';
      });
    }
    ST.refresh();
  }
  if (reduce) return; // sin coreografía: la página funciona completa en estático

  if (document.readyState === 'complete') setTimeout(init, 900);else window.addEventListener('load', () => setTimeout(init, 900));
})();