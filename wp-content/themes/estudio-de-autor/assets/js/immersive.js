/* Estudio de Autor / The little lab: a tactile interface without a 3D engine. */
(() => {
  'use strict';
  const lab = document.querySelector('#lab-stage');
  const model = document.querySelector('#lab-object');
  const motionToggle = document.querySelector('#motion-toggle');
  const progress = document.querySelector('#reading-progress-bar');
  const floating = document.querySelector('#floating-conversion');
  const description = document.querySelector('#lab-description');
  const choices = Array.from(document.querySelectorAll('.lab-choice'));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let manuallyPaused = false;
  let pointerX = 0;
  let pointerY = 0;
  let painting = false;
  let dragging = false;

  try { manuallyPaused = window.localStorage.getItem('eda_minimal_motion') === 'yes'; } catch (_) {}
  const descriptions = {
    web: '01 / Diseñamos experiencias fáciles de usar.',
    marca: '02 / Creamos contenido con identidad propia.',
    sistemas: '03 / Simplificamos procesos que consumen tiempo.'
  };

  function motionOff() {
    return manuallyPaused || reducedMotion.matches;
  }
  function updateMotionToggle() {
    if (!motionToggle) return;
    const off = motionOff();
    motionToggle.disabled = reducedMotion.matches;
    motionToggle.setAttribute('aria-pressed', String(off));
    motionToggle.setAttribute('aria-label', off ? 'Activar movimiento' : 'Reducir movimiento');
    motionToggle.innerHTML = reducedMotion.matches
      ? 'Movimiento reducido <span aria-hidden="true">◉</span>'
      : (off ? 'Activar movimiento <span aria-hidden="true">◉</span>' : 'Reducir movimiento <span aria-hidden="true">◌</span>');
    paintModel();
  }
  function paintModel() {
    if (!model) return;
    if (motionOff()) {
      model.style.setProperty('--lab-x', '-11deg');
      model.style.setProperty('--lab-y', '17deg');
    } else {
      model.style.setProperty('--lab-x', `${(-14 - pointerY * 11).toFixed(1)}deg`);
      model.style.setProperty('--lab-y', `${(22 + pointerX * 16).toFixed(1)}deg`);
    }
  }
  function queuePaint() {
    if (painting) return;
    painting = true;
    window.requestAnimationFrame(() => {
      painting = false;
      paintModel();
    });
  }
  if (motionToggle) {
    motionToggle.addEventListener('click', () => {
      manuallyPaused = !manuallyPaused;
      try { window.localStorage.setItem('eda_minimal_motion', manuallyPaused ? 'yes' : 'no'); } catch (_) {}
      updateMotionToggle();
    });
    reducedMotion.addEventListener?.('change', updateMotionToggle);
    updateMotionToggle();
  }
  if (lab) {
    const calculate = (clientX, clientY) => {
      if (motionOff()) return;
      const rect = lab.getBoundingClientRect();
      pointerX = Math.max(-1, Math.min(1, (clientX - rect.left - rect.width / 2) / (rect.width / 2)));
      pointerY = Math.max(-1, Math.min(1, (clientY - rect.top - rect.height / 2) / (rect.height / 2)));
      queuePaint();
    };
    lab.addEventListener('pointermove', (event) => {
      if (event.pointerType === 'mouse' || dragging) calculate(event.clientX, event.clientY);
    }, { passive: true });
    lab.addEventListener('pointerleave', () => {
      if (!dragging) { pointerX = 0; pointerY = 0; queuePaint(); }
    });
    lab.addEventListener('pointerdown', (event) => {
      if (event.target.closest('button,a')) return;
      if (event.pointerType === 'touch') return; // Keep native mobile scrolling usable.
      dragging = true;
    });
    window.addEventListener('pointerup', () => { dragging = false; });
    lab.addEventListener('keydown', (event) => {
      if (event.target !== lab || motionOff()) return;
      const steps = {
        ArrowLeft: [-0.2, 0], ArrowRight: [0.2, 0],
        ArrowUp: [0, -0.2], ArrowDown: [0, 0.2]
      };
      if (!steps[event.key]) return;
      event.preventDefault();
      pointerX = Math.max(-1, Math.min(1, pointerX + steps[event.key][0]));
      pointerY = Math.max(-1, Math.min(1, pointerY + steps[event.key][1]));
      queuePaint();
    });
  }

  choices.forEach((button) => {
    button.addEventListener('click', () => {
      const state = button.dataset.lab || 'web';
      if (lab) lab.dataset.state = state;
      if (description) description.textContent = descriptions[state] || descriptions.web;
      choices.forEach((choice) => {
        const active = choice === button;
        choice.classList.toggle('is-active', active);
        choice.setAttribute('aria-pressed', String(active));
      });
    });
  });

  const revealNodes = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const observer = new IntersectionObserver((entries, self) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          self.unobserve(entry.target);
        }
      });
    }, { threshold: 0.09, rootMargin: '0px 0px -35px 0px' });
    revealNodes.forEach((node) => observer.observe(node));
  } else {
    revealNodes.forEach((node) => node.classList.add('is-visible'));
  }

  let queuedScroll = false;
  function onScroll() {
    if (queuedScroll) return;
    queuedScroll = true;
    window.requestAnimationFrame(() => {
      queuedScroll = false;
      const height = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      if (progress) progress.style.width = `${Math.max(0, Math.min(100, 100 * window.scrollY / height)).toFixed(1)}%`;
      if (floating) {
        const pricing = document.getElementById('membresias');
        const contact = document.getElementById('contacto');
        const inView = (el) => {
          if (!el) return false;
          const box = el.getBoundingClientRect();
          return box.top < window.innerHeight * .8 && box.bottom > window.innerHeight * .15;
        };
        const relevantSection = window.innerWidth < 680 && (inView(pricing) || inView(contact));
        floating.classList.toggle('is-shown', !relevantSection && window.scrollY > window.innerHeight * .85 && window.scrollY < height - window.innerHeight * .5);
      }
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();
})();