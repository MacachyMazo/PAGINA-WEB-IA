/* World-space station controls. No modal, sidebar or screen-covering layer. */
(function spatialStations() {
  'use strict';
  const names = ['servicios', 'portafolio', 'membresias', 'discord', 'diagnostico'];
  const plans = ['Inicio', 'Impulso', 'Presencia', 'Evolución', 'Integral'];
  let selected = 3;
  let controls;
  let initialized = false;
  const style = document.createElement('style');
  style.textContent = '#essential-overlay,#eda-spatial-ui,.panel-scrim,.detail-panel{display:none!important}';
  document.head.appendChild(style);

  function show(name) {
    if (!names.includes(name)) return;
    window.EDA_CINEMA?.skip?.();
    document.querySelector('#welcome')?.classList.add('dismissed');
    document.querySelector('#studio-app')?.classList.add('in-tour');
    window.EDA_V4?.focus(name, true);
  }
  function close() { window.EDA_V4?.clearFocus(); }
  window.EDA_ESSENTIAL = { show, close };
  window.EDA_SPATIAL = { show, choosePlan: selectPlan };
  function selectPlan(i) {
    if (!Number.isInteger(i) || i < 0 || i > 4) return;
    selected = i;
    window.EDA_V4?.setPlan(i);
    if (controls) controls.querySelector('[data-holo-status]').setAttribute('value', plans[i] + ' / Suscripcion mensual');
  }
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-screen],[data-goto]');
    if (!button) return;
    const name = button.getAttribute('data-screen') || button.getAttribute('data-goto');
    if (names.includes(name)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      show(name);
    }
  }, true);
  document.addEventListener('keydown', event => {
    if (/INPUT|TEXTAREA|SELECT/.test(event.target?.tagName || '')) return;
    if (event.key === 'Escape') close();
    if (window.EDA_V4?.active === 'membresias' && /^[1-5]$/.test(event.key)) selectPlan(Number(event.key) - 1);
  });
  function add(tag, parent, attrs) {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
    parent.appendChild(node);
    return node;
  }
  function init() {
    const scene = document.querySelector('#office-scene');
    if (initialized || !scene?.hasLoaded || !window.EDA_V4) return;
    initialized = true;
    controls = add('a-entity', scene, { id: 'world-membership-controls', position: '4.65 .9 -1.5', rotation: '0 -75 0', visible: false });
    const status = add('a-text', controls, { 'data-holo-status': '', value: 'Evolucion / Suscripcion mensual', width: 2.7, align: 'center', color: '#c5f7ff', position: '0 -.49 .04', 'wrap-count': 35 });
    const methods = add('a-entity', controls, { visible: false, position: '0 -.65 0' });
    function button(parent, label, x, y, width, action) {
      const surface = add('a-plane', parent, { width, height: .25, position: `${x} ${y} .02`, class: 'interactive-object', material: 'shader:flat;color:#74d9e9;transparent:true;opacity:.16;side:double' });
      add('a-text', parent, { value: label, position: `${x} ${y} .04`, align: 'center', width: width * 3.3, color: '#defbff' });
      surface.addEventListener('click', event => { event.stopPropagation(); action(); });
    }
    for (let i = 0; i < 5; i++) button(controls, String(i + 1), (i - 2) * .38, 0, .30, () => { selectPlan(i); methods.setAttribute('visible', false); });
    button(controls, 'SUSCRIBIRME', 0, -.31, 1.7, () => methods.setAttribute('visible', !methods.getAttribute('visible')));
    ['Mercado Pago', 'Apple Pay', 'Google Pay'].forEach((label, i) => {
      button(methods, label, (i - 1) * .82, 0, .77, () => {
        const config = window.EDA_SITE_CONFIG?.checkout?.[plans[selected]] || {};
        const value = i === 0 ? config.mercadopago : config.stripe;
        if (!value) { status.setAttribute('value', label + ': aun no conectado. Sin cargos.'); return; }
        try {
          const url = new URL(value);
          const valid = i === 0 ? /(^|\.)mercadopago\.com(\.mx)?$/.test(url.hostname) : ['buy.stripe.com', 'checkout.stripe.com'].includes(url.hostname);
          if (url.protocol !== 'https:' || !valid) throw new Error('Invalid checkout');
          window.open(url.href, '_blank', 'noopener,noreferrer');
        } catch (_) { status.setAttribute('value', 'Enlace de pago no valido. Sin cargos.'); }
      });
    });
    function tick() {
      if (!scene.isConnected) return;
      controls.setAttribute('visible', window.EDA_V4?.active === 'membresias');
      requestAnimationFrame(tick);
    }
    tick();
    const route = new URLSearchParams(location.search).get('estacion');
    if (names.includes(route)) show(route);
  }
  document.querySelector('#office-scene')?.addEventListener('loaded', init, { once: true });
  window.addEventListener('load', init, { once: true });
  init();
})();
