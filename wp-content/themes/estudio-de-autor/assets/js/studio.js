/* Estudio de Autor | Frontend interactions, no external tracking */
(function () {
  'use strict';
  const plans = {
    'Inicio': { number:'01', price:790, hours:0.5, title:'Un segundo par de ojos.', description:'Para una revisión muy puntual o una consulta concreta.', features:['30 minutos de trabajo cada mes','Una microtarea o revisión breve','Canal comunitario de Discord cuando se active','Solicitud y seguimiento por escrito'], limit:'No incluye crear una página completa ni múltiples diseños.' },
    'Impulso': { number:'02', price:1990, hours:1.5, title:'Pequeñas mejoras. Buenas decisiones.', description:'Para encargos que caben en una hora y media.', features:['1.5 horas de trabajo al mes','Ajustes puntuales de web o contenido','Guion breve o diseño sencillo según alcance','Discord comunitario cuando se habilite'], limit:'Cada pieza o ajuste consume tiempo; las tareas se estiman primero.' },
    'Presencia': { number:'03', price:4990, hours:4, title:'Una marca más cuidada.', description:'Para mejorar continuamente la imagen y comunicación de tu negocio.', features:['4 horas mensuales de trabajo','Diseño para redes, textos y creatividades','WordPress, UX y SEO básico según prioridades','Edición breve de video dentro de las horas'], limit:'No cubre campañas pagadas ni producción audiovisual ilimitada.' },
    'Evolución': { number:'04', price:10900, hours:9, title:'Las ideas toman forma.', description:'Ideal para proyectos digitales que avanzan por etapas.', features:['9 horas de trabajo por mes','Desarrollo web por fases','Automatizaciones sencillas evaluadas','Diseño, guion o video según prioridad','Discord comunitario cuando se habilite'], limit:'Los proyectos complejos pueden requerir varias mensualidades.' },
    'Integral': { number:'05', price:19900, hours:16, title:'Un estudio a tu lado.', description:'Tu agenda digital prioritaria, con una mirada más amplia.', features:['16 horas mensuales de trabajo','Acceso a todas las categorías elegibles del estudio','Web, diseño, contenido y automatización por fases','Conceptos de apps o Web3 sujetos a viabilidad','Sesiones de voz por Discord bajo cita, cuando esté activo'], limit:'«Todo» significa acceso al catálogo dentro de 16 horas, no servicios ilimitados ni disponibilidad 24/7.' }
  };
  const money = amount => '$' + amount.toLocaleString('es-MX');
  const $ = selector => document.querySelector(selector);
  const $$ = selector => Array.from(document.querySelectorAll(selector));
  const nameField = $('#form-plan');
  let selectedPlan = 'Evolución';
  function showPlan(name, shouldScroll) {
    const plan = plans[name];
    if (!plan) return;
    selectedPlan = name;
    $$('.plan-tab').forEach(btn => {
      const active = btn.dataset.plan === name;
      btn.classList.toggle('is-current', active);
      btn.setAttribute('aria-selected', String(active));
      btn.tabIndex = active ? 0 : -1;
    });
    $('#plan-index').textContent = plan.number;
    $('#plan-title').textContent = plan.title;
    $('#plan-description').textContent = plan.description;
    $('#plan-cost').textContent = money(plan.price);
    $('#plan-hours').textContent = (plan.hours === .5 ? '30 minutos' : plan.hours + ' horas') + ' de trabajo por mes';
    $('#plan-limit').textContent = plan.limit;
    const features = $('#plan-features');
    features.replaceChildren();
    plan.features.forEach(feature => { const li = document.createElement('li'); li.textContent = feature; features.appendChild(li); });
    nameField.value = name;
    if (shouldScroll) $('#membresias').scrollIntoView({ behavior:'smooth' });
  }
  $$('.plan-tab').forEach(btn => btn.addEventListener('click', () => showPlan(btn.dataset.plan, false)));
  const planTabs = $$('.plan-tab');
  planTabs.forEach((btn, i) => btn.addEventListener('keydown', ev => {
    if (!['ArrowUp','ArrowDown','Home','End'].includes(ev.key)) return;
    ev.preventDefault();
    const index = ev.key === 'Home' ? 0 : ev.key === 'End' ? planTabs.length - 1 : (i + (ev.key === 'ArrowDown' ? 1 : -1) + planTabs.length) % planTabs.length;
    planTabs[index].focus(); showPlan(planTabs[index].dataset.plan, false);
  }));
  $('#apply-plan').addEventListener('click', () => {
    nameField.value = selectedPlan;
    $('#contacto').scrollIntoView({ behavior:'smooth' });
    setTimeout(() => { const input = $('#studio-form input[name="name"]'); if (input) input.focus({ preventScroll:true }); }, 450);
  });
  nameField.addEventListener('change', ev => showPlan(ev.target.value, false));
  const slider = $('#hours-slider');
  function advise() {
    const value = Number(slider.value);
    let name = 'Integral';
    for (const [key, plan] of Object.entries(plans)) { if (value <= plan.hours) { name = key; break; } }
    $('#advisor-hours').textContent = (value === .5 ? '30 min' : value + ' h');
    $('#advisor-plan').textContent = name;
    $('#advisor-price').textContent = plans[name].hours + ' h · ' + money(plans[name].price) + ' mensuales';
    $('#advisor-action').dataset.plan = name;
  }
  slider.addEventListener('input', advise); advise();
  $('#advisor-action').addEventListener('click', () => showPlan($('#advisor-action').dataset.plan, true));
  const navToggle = $('#nav-toggle');
  const menu = $('#nav-links');
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navToggle.setAttribute('aria-label', expanded ? 'Abrir menú' : 'Cerrar menú');
    menu.classList.toggle('is-open', !expanded);
  });
  $$('#nav-links a').forEach(link => link.addEventListener('click', () => {
    menu.classList.remove('is-open'); navToggle.setAttribute('aria-expanded', 'false'); navToggle.setAttribute('aria-label','Abrir menú');
  }));
  const form = $('#studio-form');
  const result = $('#form-result');
  const submitButton = $('#form-submit');
  function feedback(message, isError) {
    result.textContent = message;
    result.classList.toggle('show', !!message);
    result.classList.toggle('error', !!isError);
  }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity()) { feedback('Completa correctamente los campos obligatorios.', true); return; }
    const description = form.elements.namedItem('description').value.trim();
    if (description.length < 15) { feedback('Cuéntanos un poco más. Necesitamos al menos 15 caracteres.', true); return; }
    if (!window.EstudioConfig || !window.EstudioConfig.ajaxUrl) { feedback('La conexión con WordPress todavía no está configurada. No se ha enviado ningún dato.', true); return; }
    const data = new FormData(form);
    data.append('action', 'eda_submit_lead'); data.append('nonce', window.EstudioConfig.nonce);
    submitButton.disabled = true; submitButton.textContent = 'Enviando...'; feedback('', false);
    try {
      const response = await fetch(window.EstudioConfig.ajaxUrl, { method:'POST', body:data, credentials:'same-origin' });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error((json.data && json.data.message) || 'No se pudo registrar la solicitud.');
      feedback('¡Solicitud registrada! Tu folio es ' + json.data.folio + '. Revisaremos disponibilidad y alcance antes de proponer un pago.', false);
      form.reset(); nameField.value = selectedPlan;
    } catch (err) {
      feedback(err.message || 'No se pudo guardar. Intenta nuevamente.', true);
    } finally {
      submitButton.disabled = false; submitButton.innerHTML = 'Enviar mi proyecto <span>↗</span>';
    }
  });
})();