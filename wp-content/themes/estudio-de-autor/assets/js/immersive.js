/* Immersive edition: presentation-only interaction, respecting motion preferences. */
(() => {
  'use strict';
  const shell = document.querySelector('.immersive-edition');
  const hero = document.querySelector('.immersive-hero');
  const stage = document.getElementById('vr-stage');
  const perspective = document.getElementById('vr-perspective');
  const motionButton = document.getElementById('motion-toggle');
  const journey = document.getElementById('recorrido');
  const reading = document.getElementById('reading-progress-bar');
  const floatingCTA = document.getElementById('floating-conversion');
  if (!shell || !stage || !perspective || !journey) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let manuallyPaused = false;
  try { manuallyPaused = window.localStorage.getItem('studio_motion_paused') === 'yes'; } catch (_) {}
  let pointerX = 0;
  let pointerY = 0;
  let dragStart = null;
  let currentScene = -1;
  let frameRequested = false;
  let dirty = true;
  let sceneOverride = null;
  const steps = Array.from(journey.querySelectorAll('[data-scene]'));
  const dots = Array.from(journey.querySelectorAll('[data-scene-target]'));
  const sceneSymbol = document.getElementById('journey-symbol');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  function isMotionDisabled() { return manuallyPaused || prefersReducedMotion.matches; }
  function updateMotionUi() {
    const paused = isMotionDisabled();
    shell.classList.toggle('motion-paused', paused);
    motionButton.setAttribute('aria-pressed', String(paused));
    motionButton.setAttribute('aria-label', paused ? 'Activar animaciones' : 'Detener animaciones');
    motionButton.innerHTML = prefersReducedMotion.matches ? 'MOVIMIENTO REDUCIDO <span aria-hidden="true">◉</span>' : (paused ? 'ACTIVAR MOVIMIENTO <span aria-hidden="true">◉</span>' : 'PAUSAR MOVIMIENTO <span aria-hidden="true">◌</span>');
    motionButton.disabled = prefersReducedMotion.matches;
    motionButton.setAttribute('aria-label', prefersReducedMotion.matches ? 'Movimiento reducido por preferencia del sistema' : (paused ? 'Activar animaciones' : 'Detener animaciones'));
    if (paused) { perspective.style.setProperty('--vr-x', '-3deg'); perspective.style.setProperty('--vr-y', '6deg'); }
    dirty = true;
    requestPaint();
  }
  motionButton.addEventListener('click', () => {
    manuallyPaused = !manuallyPaused;
    try { window.localStorage.setItem('studio_motion_paused', manuallyPaused ? 'yes' : 'no'); } catch (_) {}
    updateMotionUi();
  });
  if (prefersReducedMotion.addEventListener) prefersReducedMotion.addEventListener('change', updateMotionUi);
  updateMotionUi();

  function setPerspectiveFromPointer(clientX, clientY) {
    if (isMotionDisabled() || !finePointer.matches) return;
    const rect = stage.getBoundingClientRect();
    pointerX = Math.max(-1, Math.min(1, (clientX - rect.left - rect.width / 2) / (rect.width / 2)));
    pointerY = Math.max(-1, Math.min(1, (clientY - rect.top - rect.height / 2) / (rect.height / 2)));
    dirty = true;
    requestPaint();
  }
  stage.addEventListener('pointermove', (event) => {
    if (dragStart && event.buttons) {
      pointerX = Math.max(-1, Math.min(1, dragStart.x0 + (event.clientX - dragStart.x) / 150));
      pointerY = Math.max(-1, Math.min(1, dragStart.y0 + (event.clientY - dragStart.y) / 150));
      dirty = true; requestPaint();
    } else { setPerspectiveFromPointer(event.clientX, event.clientY); }
  }, { passive: true });
  stage.addEventListener('pointerleave', () => { pointerX = 0; pointerY = 0; dirty = true; requestPaint(); });
  // The stage remains scrollable on touch, and pointer motion is purely decorative.
  stage.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'mouse' || event.target.closest('a,button')) return;
    dragStart = { x: event.clientX, y: event.clientY, x0: pointerX, y0: pointerY };
    if (stage.setPointerCapture) stage.setPointerCapture(event.pointerId);
  });
  stage.addEventListener('pointerup', () => { dragStart = null; });
  stage.addEventListener('pointercancel', () => { dragStart = null; });
  stage.addEventListener('keydown', (event) => {
    if (event.target !== stage || isMotionDisabled()) return;
    const steps = { ArrowLeft:[-.15,0], ArrowRight:[.15,0], ArrowUp:[0,-.15], ArrowDown:[0,.15] };
    const step = steps[event.key];
    if (!step) return;
    event.preventDefault();
    pointerX = Math.max(-1, Math.min(1, pointerX + step[0]));
    pointerY = Math.max(-1, Math.min(1, pointerY + step[1]));
    dirty = true; requestPaint();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && dragStart) { dragStart = null; pointerX = 0; pointerY = 0; dirty = true; requestPaint(); }
  });

  function showScene(index) {
    const i = Math.max(0, Math.min(2, index));
    if (currentScene === i) return;
    currentScene = i;
    journey.dataset.activeScene = String(i);
    journey.style.setProperty('--scene', String(i));
    sceneSymbol.textContent = String(i + 1).padStart(2, '0');
    steps.forEach((step, n) => { const active = i === n; step.classList.toggle('is-active', active); step.setAttribute('aria-hidden', String(!active)); });
    dots.forEach((dot, n) => { const active = i === n; dot.classList.toggle('is-active', active); if (active) dot.setAttribute('aria-current', 'step'); else dot.removeAttribute('aria-current'); });
  }
  dots.forEach(dot => dot.addEventListener('click', () => {
    const index = Number(dot.dataset.sceneTarget || 0);
    if (window.matchMedia('(max-width: 640px)').matches) { showScene(index); return; }
    const rect = journey.getBoundingClientRect();
    const top = window.scrollY + rect.top;
    const scrollSpan = Math.max(1, journey.offsetHeight - window.innerHeight);
    window.scrollTo({ top: top + scrollSpan * (index / 2), behavior: isMotionDisabled() ? 'auto' : 'smooth' });
    sceneOverride = index;
    showScene(index);
  }));
  showScene(0);
  const onScroll = () => { dirty = true; requestPaint(); };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  document.addEventListener('visibilitychange', () => { dirty = true; requestPaint(); });
  function requestPaint() {
    if (frameRequested || document.hidden) return;
    frameRequested = true;
    window.requestAnimationFrame(frame);
  }
  function frame() {
    frameRequested = false;
    if (dirty) {
      const scrollHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(100, Math.max(0, window.scrollY / scrollHeight * 100));
      if (reading) reading.style.width = progress.toFixed(2) + '%';
      const r = journey.getBoundingClientRect();
      if (window.matchMedia('(max-width: 640px)').matches) {
        if (currentScene === -1) showScene(0);
      } else {
        const fraction = Math.max(0, Math.min(1, -r.top / Math.max(1, journey.offsetHeight - window.innerHeight)));
        if (sceneOverride !== null && Math.abs(fraction - sceneOverride / 2) < .06) sceneOverride = null;
        showScene(sceneOverride === null ? Math.min(2, Math.floor(fraction * 2.999)) : sceneOverride);
      }
      if (floatingCTA) floatingCTA.classList.toggle('is-shown', window.scrollY > window.innerHeight * 0.68 && window.scrollY < document.documentElement.scrollHeight - window.innerHeight * 1.12);
      if (!isMotionDisabled() && finePointer.matches) {
        perspective.style.setProperty('--vr-x', `${(-4 - pointerY * 10).toFixed(1)}deg`);
        perspective.style.setProperty('--vr-y', `${(7 + pointerX * 13).toFixed(1)}deg`);
      }
      const heroFraction = Math.max(0, Math.min(1, -hero.getBoundingClientRect().top / Math.max(1,hero.offsetHeight)));
      perspective.style.setProperty('--vr-zoom', (!isMotionDisabled() && window.innerWidth > 640 ? Math.round(heroFraction*110) : 0) + 'px');
      dirty = false;
    }
    // CSS handles continuous visual motion. JS paints only on pointer, scroll, resize or preferences.
  }
  requestPaint();
})();