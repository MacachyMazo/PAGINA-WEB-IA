/* Interactive, world-anchored holograms; no modal or sidebar. */
(function spatialStations() {
  'use strict';
  const names = ['servicios', 'portafolio', 'membresias', 'discord', 'diagnostico'];
  const plans = [
    { name: 'Inicio', price: 790, hours: '30 minutos', items: ['Una revisión o microtarea acordada', 'Seguimiento por escrito'], limit: 'No incluye crear una página completa.' },
    { name: 'Impulso', price: 1990, hours: '1.5 horas', items: ['Ajustes web o contenido', 'Diseño o guion breve dentro de las horas', 'Seguimiento por escrito'], limit: 'Cada tarea se estima antes de iniciar.' },
    { name: 'Presencia', price: 4990, hours: '4 horas', items: ['Contenido y diseño para redes', 'WordPress, UX o SEO básico', 'Edición breve de video según horas'], limit: 'No incluye publicidad ni piezas ilimitadas.' },
    { name: 'Evolución', price: 10900, hours: '9 horas', items: ['Mejoras web por etapas', 'Automatizaciones sencillas evaluadas', 'Diseño, guiones, contenido y video'], limit: 'Los proyectos complejos se realizan por fases.' },
    { name: 'Integral', price: 19900, hours: '16 horas', items: ['Web, contenido e identidad por fases', 'Automatizaciones y prototipos viables', 'Discord y voz por cita al habilitarse'], limit: 'No incluye trabajo ilimitado ni soporte 24/7.' }
  ];
  let selected = 3, initialized = false, expanded = false;
  let controls, details, checkout, methods, status, redrawDetails;
  const style = document.createElement('style');
  style.textContent = `#essential-overlay,#eda-spatial-ui,.panel-scrim,.detail-panel{display:none!important}
    #discord-world-widget{position:absolute;width:350px;height:500px;transform-origin:50% 50%;z-index:24;border:1px solid #9ceeff90;border-radius:12px;box-shadow:0 0 24px #70e9ff40;opacity:0;visibility:hidden;pointer-events:none;transition:opacity .28s;overflow:hidden;background:#071b29}
    #discord-world-widget.is-visible{opacity:.97;visibility:visible;pointer-events:auto}
    #discord-world-widget iframe{width:100%;height:100%;border:0}
    #discord-world-widget p{padding:28px;color:#e8fcff;font:16px/1.6 Arial}
    #discord-world-widget button{position:absolute;right:8px;top:8px;color:white;background:#123549;border:1px solid #8deaff;border-radius:4px;cursor:pointer}`;
  document.head.appendChild(style);
  function show(name) {
    if (!names.includes(name)) return;
    window.EDA_CINEMA?.skip?.();
    document.querySelector('#welcome')?.classList.add('dismissed');
    document.querySelector('#studio-app')?.classList.add('in-tour');
    if (name !== 'membresias') expanded = false;
    window.EDA_V4?.focus(name, true);
  }
  function close() { expanded = false; window.EDA_V4?.clearFocus(); }
  function selectPlan(i) {
    if (!Number.isInteger(i) || i < 0 || i >= plans.length) return;
    selected = i;
    window.EDA_V4?.setPlan(i);
    redrawDetails?.();
    methods?.setAttribute('visible', false);
    if (status) status.setAttribute('value', 'Selecciona un medio de pago.');
  }
  function expand() {
    if (window.EDA_V4?.active !== 'membresias') return;
    selected = window.EDA_V4.planIndex ?? selected;
    expanded = true;
    redrawDetails?.();
  }
  window.EDA_ESSENTIAL = { show, close, expand };
  window.EDA_SPATIAL = { show, choosePlan: selectPlan };
  document.addEventListener('click', event => {
    const target = event.target.closest('[data-screen],[data-goto]');
    if (!target) return;
    const name = target.getAttribute('data-screen') || target.getAttribute('data-goto');
    if (names.includes(name)) { event.preventDefault(); event.stopImmediatePropagation(); show(name); }
  }, true);
  document.addEventListener('keydown', event => {
    if (/INPUT|TEXTAREA|SELECT/.test(event.target?.tagName || '') || event.ctrlKey || event.altKey || event.metaKey) return;
    if (event.key === 'Escape') close();
    if (window.EDA_V4?.active !== 'membresias') return;
    if (/^[1-5]$/.test(event.key)) selectPlan(Number(event.key) - 1);
    if (event.key.toLowerCase() === 'e' && !event.repeat) { event.preventDefault(); expand(); }
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
    const THREE = window.AFRAME.THREE;
    const cameraEl = document.querySelector('#player-camera');
    const cameraPosition = new THREE.Vector3();
    const roots = [];
    function group(id, position) {
      const root = add('a-entity', scene, { id, position, visible: false });
      roots.push(root); return root;
    }
    function text(parent, value, y, width = 2.6) {
      return add('a-text', parent, { value, position: `0 ${y} .04`, align: 'center', width, color: '#ecfcff', 'wrap-count': 32 });
    }
    function button(parent, label, x, y, width, action) {
      const plane = add('a-plane', parent, { position: `${x} ${y} .03`, width, height: .28, class: 'interactive-object', material: 'shader:flat;color:#123f51;transparent:true;opacity:.94;side:double' });
      add('a-text', parent, { value: label, position: `${x} ${y} .05`, align: 'center', width: width * 2.6, color: '#c9faff', 'wrap-count': 24 });
      plane.addEventListener('click', event => { event.stopPropagation(); action(); });
    }
    controls = group('world-membership-controls', '4.55 .43 -1.5');
    for (let i = 0; i < 5; i++) button(controls, String(i + 1), (i - 2) * .37, .18, .31, () => selectPlan(i));
    button(controls, 'E / VER BENEFICIOS', 0, -.16, 1.9, expand);
    details = group('world-plan-details', '4.35 1.88 1.12');
    checkout = group('world-plan-checkout', '4.35 1.88 -4.12');
    const canvas = document.createElement('canvas'); canvas.width = 900; canvas.height = 1100;
    const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 2.32), new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide, depthWrite: false, toneMapped: false }));
    details.object3D.add(mesh);
    redrawDetails = () => {
      const p = plans[selected], ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, 900, 1100); ctx.fillStyle = 'rgba(4,19,30,.93)'; ctx.fillRect(0, 0, 900, 1100);
      ctx.fillStyle = '#8de9ff'; ctx.fillRect(46, 42, 160, 5);
      function line(value, y, size = 36, color = '#edfaff') { ctx.font = `600 ${size}px Arial`; ctx.fillStyle = color; ctx.fillText(value, 48, y); }
      function wrap(value, y, size = 34) {
        ctx.font = `500 ${size}px Arial`; ctx.fillStyle = '#e3f2fa'; let row = '';
        for (const word of value.split(' ')) { if (ctx.measureText(row + word).width > 800) { ctx.fillText(row, 48, y); y += 46; row = ''; } row += word + ' '; }
        ctx.fillText(row, 48, y); return y + 46;
      }
      line('LO QUE INCLUYE', 110, 30, '#8de9ff'); line(p.name.toUpperCase(), 190, 60);
      line('$' + p.price.toLocaleString('es-MX') + ' MXN / mes', 265, 44);
      line(p.hours + ' de trabajo mensual', 327, 34, '#9deaff');
      let y = 430; for (const item of p.items) { y = wrap('• ' + item, y) + 40; }
      wrap(p.limit, 875, 29); wrap('Impuestos según corresponda. Alcance acordado.', 1000, 25);
      texture.needsUpdate = true;
      planLabel.setAttribute('value', p.name + ' / $' + p.price.toLocaleString('es-MX') + ' MXN al mes');
    };
    add('a-plane', checkout, { width: 1.95, height: 2.25, material: 'shader:flat;color:#071d2b;transparent:true;opacity:.94;side:double' });
    text(checkout, 'SUSCRIBIRME', .85, 3.7);
    const planLabel = text(checkout, '', .52, 2.9);
    button(checkout, 'ELEGIR FORMA DE PAGO', 0, .16, 1.75, () => methods.setAttribute('visible', !methods.getAttribute('visible')));
    methods = add('a-entity', checkout, { visible: false });
    status = text(checkout, 'Selecciona un medio de pago.', -.94, 2.3);
    ['Mercado Pago', 'Apple Pay', 'Google Pay'].forEach((label, i) => button(methods, label, 0, -.2 - i * .26, 1.7, () => {
      const config = window.EDA_SITE_CONFIG?.checkout?.[plans[selected].name] || {};
      const value = i === 0 ? config.mercadopago : config.stripe;
      if (!value) { status.setAttribute('value', label + ': pendiente de conectar. Sin cargos.'); return; }
      try {
        const url = new URL(value);
        const valid = i === 0 ? /(^|\.)mercadopago\.com(\.mx)?$/.test(url.hostname) : ['buy.stripe.com', 'checkout.stripe.com'].includes(url.hostname);
        if (url.protocol !== 'https:' || !valid) throw new Error('Invalid checkout');
        window.open(url.href, '_blank', 'noopener,noreferrer');
      } catch (_) { status.setAttribute('value', 'Enlace de pago no valido. Sin cargos.'); }
    }));
    redrawDetails();
    // Discord prohibits reading its cross-origin iframe into a WebGL texture.
    // Project the official iframe from a fixed world anchor instead of a modal.
    const widget = document.createElement('div'); widget.id = 'discord-world-widget'; widget.inert = true;
    document.querySelector('#scene-container').appendChild(widget);
    const serverId = String(window.EDA_SITE_CONFIG?.discord?.serverId || '');
    if (/^\d{16,22}$/.test(serverId)) {
      const iframe = document.createElement('iframe'); iframe.title = 'Widget oficial de Discord';
      iframe.src = 'https://discord.com/widget?id=' + encodeURIComponent(serverId) + '&theme=dark';
      iframe.setAttribute('sandbox', 'allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts');
      iframe.referrerPolicy = 'no-referrer'; widget.appendChild(iframe);
    } else {
      const note = document.createElement('p'); note.textContent = 'DISCORD / Widget oficial\nFalta vincular el ID de tu servidor y activar su widget. No hay un servidor conectado.'; widget.appendChild(note);
    }
    const dismiss = document.createElement('button'); dismiss.textContent = '×'; dismiss.setAttribute('aria-label', 'Ocultar holograma de Discord'); dismiss.onclick = close; widget.appendChild(dismiss);
    window.EDA_DISCORD_WIDGET_READY = true;
    const anchor = new THREE.Vector3(-4.5, 1.9, 4.4), projected = new THREE.Vector3(), view = new THREE.Vector3();
    let prior = '';
    function tick() {
      if (!scene.isConnected) return;
      const active = window.EDA_V4?.active || '';
      if (prior === 'membresias' && active !== prior) expanded = false;
      prior = active;
      controls.setAttribute('visible', active === 'membresias');
      details.setAttribute('visible', active === 'membresias' && expanded);
      checkout.setAttribute('visible', active === 'membresias' && expanded);
      const camera = cameraEl.getObject3D('camera');
      if (camera) {
        camera.getWorldPosition(cameraPosition);
        roots.forEach(root => root.object3D.lookAt(cameraPosition));
        const bounds = document.querySelector('#scene-container').getBoundingClientRect();
        projected.copy(anchor).project(camera); view.copy(anchor).applyMatrix4(camera.matrixWorldInverse);
        const visible = active === 'discord' && !scene.is('vr-mode') && view.z < 0 && projected.z > -1 && projected.z < 1 && Math.abs(projected.x) < 1.15 && Math.abs(projected.y) < 1.15;
        widget.classList.toggle('is-visible', visible); widget.inert = !visible; widget.setAttribute('aria-hidden', String(!visible));
        if (visible) {
          const scale = Math.min((bounds.width - 24) / 350, (bounds.height - 70) / 500, bounds.height * camera.projectionMatrix.elements[5] * 2.65 / (2 * -view.z * 500));
          widget.style.left = ((projected.x + 1) * .5 * bounds.width) + 'px';
          widget.style.top = ((1 - projected.y) * .5 * bounds.height) + 'px';
          widget.style.transform = `translate(-50%,-50%) scale(${Math.max(.2, scale)})`;
        }
      }
      requestAnimationFrame(tick);
    }
    tick();
    const route = new URLSearchParams(location.search).get('estacion'); if (names.includes(route)) show(route);
  }
  document.querySelector('#office-scene')?.addEventListener('loaded', init, { once: true });
  window.addEventListener('load', init, { once: true }); init();
})();
