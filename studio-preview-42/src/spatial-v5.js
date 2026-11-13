(function buildSpatialModule(){
 'use strict';
 const scene=document.querySelector('#office-scene'),box=document.querySelector('#scene-container');
 if(!scene||!box)return;
 const settings=window.EDA_SITE_CONFIG||{checkout:{},discord:{}};
 const plans=[
  {name:'Inicio',price:790,hours:'30 minutos',tag:'Microtareas acordadas',features:['30 minutos de trabajo mensual','Una revisión o microtarea','Seguimiento por escrito','Comunidad Discord si se habilita'],limit:'No incluye una página web completa.'},
  {name:'Impulso',price:1990,hours:'1.5 horas',tag:'Mejoras puntuales',features:['1.5 horas mensuales','Ajustes web o contenido','Guion breve o creatividad sencilla','Seguimiento por escrito'],limit:'Las tareas se estiman antes de iniciar.'},
  {name:'Presencia',price:4990,hours:'4 horas',tag:'Marca en movimiento',features:['4 horas mensuales','Diseño para redes','WordPress, UX o SEO básico','Edición breve de video según horas'],limit:'No incluye piezas ni campañas ilimitadas.'},
  {name:'Evolución',price:10900,hours:'9 horas',tag:'Avanza por etapas',features:['9 horas mensuales','Mejoras web por etapas','Automatizaciones sencillas evaluadas','Diseño, guion y contenido según prioridades'],limit:'Proyectos complejos pueden requerir varias mensualidades.'},
  {name:'Integral',price:19900,hours:'16 horas',tag:'Estudio creativo completo',features:['16 horas mensuales','Web, contenido e identidad por fases','Automatizaciones y prototipos según viabilidad','Discord y voz por cita cuando esté habilitado'],limit:'Sin trabajo ilimitado ni asistencia 24/7.'}
 ];
 const projects=[
  {id:'peekdex',name:'PeekDex',url:'https://peekdex.com',tag:'PLATAFORMA / COLECCIONISMO',desc:'Comunidad, contenidos y comercio para coleccionistas.'},
  {id:'iqbites',name:'IQ-Bites',url:'https://iq-bites.com',tag:'MARCA / COMERCIO',desc:'Identidad de snacks y experiencia comercial.'},
  {id:'gube',name:'GUBE',url:'https://estacionamientogube.com.mx',tag:'SERVICIO LOCAL',desc:'Presencia digital y herramientas para clientes.'}
 ];
 const panel=document.createElement('div');panel.id='eda-spatial-ui';panel.hidden=true;box.appendChild(panel);
 const payList=plans.map((p,i)=>`<button type="button" data-plan="${i}" class="${i===3?'active':''}" aria-pressed="${i===3}"><b>0${i+1}</b><strong>${p.name}</strong><span>$${p.price.toLocaleString('es-MX')}</span></button>`).join('');
 const cards=projects.map((p,i)=>`<article class="eda-project" data-project="${p.id}"><div class="eda-project-index">0${i+1} / CASO</div><div class="eda-project-logo" id="eda-logo-${p.id}"><img src="/logos/${p.id==='iqbites'?'iq-bites-logo.png':p.id==='peekdex'?'peekdex-logo.png':'gube-logo.png'}" alt="Logotipo original de ${p.name}" loading="eager" decoding="async" /></div><h3>${p.name}</h3><small>${p.tag}</small><p>${p.desc}</p><a href="${p.url}" target="_blank" rel="noopener noreferrer">ABRIR ↗</a></article>`).join('');
 panel.innerHTML=`
  <button class="eda-holo-dismiss" type="button" aria-label="Cerrar los hologramas" id="eda-holo-close">× <span>Cerrar</span></button>
  <section id="eda-memberships" class="eda-spatial-section" hidden>
   <header class="eda-holo-heading"><small>03 / MEMBRESÍAS</small><strong>ELIGE TU NIVEL</strong><span>HOLOGRAMAS INTERACTIVOS</span></header>
   <div class="eda-members-layout">
    <div class="eda-holo-plate eda-holo-selector"><small>01 / PLANES</small><div id="eda-plans">${payList}</div></div>
    <div class="eda-holo-plate eda-holo-benefits"><small>02 / LO QUE INCLUYE</small><h3 id="eda-selected-name"></h3><p id="eda-selected-tag"></p><div class="eda-plan-cost"><strong id="eda-selected-price"></strong><span id="eda-selected-hours"></span></div><ul id="eda-plan-includes"></ul><p class="eda-holo-note" id="eda-selected-limit"></p></div>
    <div class="eda-holo-plate eda-holo-pay"><small>03 / ACCESO SEGURO</small><h3>SUSCRIBIRME</h3><p id="eda-checkout-plan"></p>
      <button type="button" id="eda-start-pay" class="eda-primary">ELEGIR FORMA DE PAGO ↗</button>
      <div id="eda-pay-options" hidden>
        <button type="button" data-gateway="mercadopago"><b>Mercado Pago</b><small>Cargo recurrente</small></button>
        <button type="button" data-gateway="apple"><b>Apple Pay</b><small>Stripe, si está disponible</small></button>
        <button type="button" data-gateway="google"><b>Google Pay</b><small>Stripe, si está disponible</small></button>
      </div>
      <p role="status" class="eda-holo-note" id="eda-pay-result">El pago se realiza fuera del estudio, mediante un checkout seguro.</p>
    </div>
   </div>
  </section>
  <section id="eda-portfolio" class="eda-spatial-section" hidden>
    <header class="eda-holo-heading"><small>02 / PORTAFOLIO</small><strong>PROYECTOS PROPIOS</strong><span>ABRIR EN OTRA PESTAÑA</span></header>
    <div class="eda-project-grid">${cards}</div>
  </section>
  <section id="eda-discord" class="eda-spatial-section" hidden>
    <header class="eda-holo-heading"><small>05 / COMUNICACIÓN</small><strong>ESTACIÓN DISCORD</strong><span>CHAT · VOZ · VÍDEO</span></header>
    <div class="eda-discord-grid">
      <div class="eda-holo-plate"><small>SERVIDOR / EN DIRECTO</small><h3>ÚNETE A LA CONVERSACIÓN</h3><div id="eda-widget-slot" class="eda-widget-slot"><p>Widget pendiente de vincular al servidor oficial de Estudio de Autor.</p></div></div>
      <div class="eda-holo-plate eda-discord-controls"><small>ACCESOS AL SERVIDOR</small>
      <a id="eda-invite" aria-disabled="true">UNIRME AL SERVIDOR ↗</a>
      <a id="eda-text" aria-disabled="true">ESCRIBIR EN DISCORD ↗</a>
      <a id="eda-voice" aria-disabled="true">ENTRAR A SALA DE VOZ ↗</a>
      <a id="eda-video" aria-disabled="true">VIDEOLLAMADA ↗</a>
      <p class="eda-holo-note" id="eda-discord-note">La conversación se realiza en Discord. El widget muestra información del servidor, no reproduce videollamadas.</p>
      </div>
    </div>
  </section>`;
 let selected=3,active='',lastCheck=0,forcedPanel=null;
 const el=s=>panel.querySelector(s);
 function choosePlan(i){
  if(!Number.isInteger(i)||i<0||i>=plans.length)return;
  selected=i;const p=plans[i];
  panel.querySelectorAll('[data-plan]').forEach((b,j)=>{b.classList.toggle('active',j===i);b.setAttribute('aria-pressed',String(i===j))});
  el('#eda-selected-name').textContent=p.name.toUpperCase();
  el('#eda-selected-tag').textContent=p.tag;
  el('#eda-selected-price').textContent='$'+p.price.toLocaleString('es-MX')+' MXN';
  el('#eda-selected-hours').textContent=p.hours+' / mes';
  el('#eda-plan-includes').replaceChildren(...p.features.map(x=>{const li=document.createElement('li');li.textContent=x;return li}));
  el('#eda-selected-limit').textContent=p.limit;
  el('#eda-checkout-plan').textContent=p.name+' · $'+p.price.toLocaleString('es-MX')+' MXN / mes';
  el('#eda-pay-options').hidden=true;
  el('#eda-pay-result').textContent='El pago se realiza fuera del estudio, mediante un checkout seguro.';
  window.EDA_V4?.setPlan?.(i);
 }
 function pay(gateway){
  const p=plans[selected];
  const urls=settings.checkout?.[p.name]||{};
  const candidate=gateway==='mercadopago'?urls.mercadopago:urls.stripe;
  if(!candidate){el('#eda-pay-result').textContent=`${gateway==='mercadopago'?'Mercado Pago':gateway==='apple'?'Apple Pay':'Google Pay'} aún no está conectado. No se ha realizado ningún cargo.`;return}
  let u;try{u=new URL(candidate);if(u.protocol!=='https:')throw Error('https required')}catch(_){el('#eda-pay-result').textContent='Enlace de cobro no válido.';return}
  const host=u.hostname.toLowerCase();
  const good=gateway==='mercadopago'?(host.endsWith('.mercadopago.com.mx')||host==='mercadopago.com.mx'||host.endsWith('.mercadopago.com')):(host==='buy.stripe.com'||host==='checkout.stripe.com');
  if(!good){el('#eda-pay-result').textContent='El enlace no es de la pasarela esperada.';return}
  window.open(u.href,'_blank','noopener,noreferrer');
  el('#eda-pay-result').textContent='Revisa el importe y autoriza el pago en la pasarela segura.';
 }
 panel.addEventListener('click',e=>{
  const b=e.target.closest('[data-plan]');if(b){choosePlan(Number(b.dataset.plan));return}
  const g=e.target.closest('[data-gateway]');if(g){pay(g.dataset.gateway);return}
  const d=e.target.closest('[aria-disabled="true"]');if(d){e.preventDefault();el('#eda-discord-note').textContent='Este canal aún no se ha conectado al servidor.'}
 });
 el('#eda-start-pay').addEventListener('click',()=>{
   el('#eda-pay-options').hidden=!el('#eda-pay-options').hidden;
   el('#eda-pay-result').textContent='Selecciona una pasarela segura. Las billeteras digitales dependen del navegador y de la cuenta configurada.';
 });
 el('#eda-holo-close').addEventListener('click',()=>{
   forcedPanel=null;
   window.EDA_V4?.clearFocus?.();
   panel.hidden=true;
   active='';
 });
 function addChannel(selector,url){
  const a=el(selector);a.removeAttribute('href');
  if(typeof url==='string'&&url.startsWith('https://')){a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.removeAttribute('aria-disabled')}
  else a.setAttribute('aria-disabled','true');
 }
 function connectDiscord(){
  const d=settings.discord||{};
  if(/^\d{16,22}$/.test(String(d.serverId||''))){
   const iframe=document.createElement('iframe');
   iframe.title='Widget oficial del servidor Discord';iframe.loading='lazy';
   iframe.src='https://discord.com/widget?id='+encodeURIComponent(d.serverId)+'&theme=dark';
   iframe.sandbox='allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox';
   iframe.referrerPolicy='no-referrer';
   el('#eda-widget-slot').replaceChildren(iframe);
  }
  addChannel('#eda-invite',d.inviteUrl);
  addChannel('#eda-text',d.textChannelUrl);
  addChannel('#eda-voice',d.voiceChannelUrl);
  addChannel('#eda-video',d.videoChannelUrl||d.voiceChannelUrl);
 }
 function addLogos(){
  const known={peekdex:'/logos/peekdex-logo.png',iqbites:'/logos/iq-bites-logo.png',gube:'/logos/gube-logo.png'};
  projects.forEach(p=>{
   const node=el('#eda-logo-'+p.id);
   if(!node)return;
   const img=new Image();img.alt='Logotipo original de '+p.name;
   img.loading='eager';img.decoding='async';
   img.onload=()=>{node.replaceChildren(img);node.classList.add('logo-loaded');};
   img.onerror=()=>{node.classList.add('logo-missing');node.textContent=p.name;};
   img.src=known[p.id];
  });
 }
 function frame(t){
  requestAnimationFrame(frame);if(t-lastCheck<85)return;lastCheck=t;
  const cinema=document.querySelector('#eda-cinema');
  const blocked=cinema&&!cinema.hidden&&!cinema.classList.contains('cin-leaving');
  const next=forcedPanel || (blocked?'':(window.EDA_V4?.active||''));
  if(next!==active){
   active=next;
   for(const [name,id] of [['membresias','eda-memberships'],['portafolio','eda-portfolio'],['discord','eda-discord']])el('#'+id).hidden=active!==name;
   panel.hidden=!['membresias','portafolio','discord'].includes(active);
  }
 }
 document.addEventListener('keydown',e=>{
  if(/^(INPUT|TEXTAREA|SELECT)$/.test(e.target?.tagName||''))return;
  if(window.EDA_V4?.active==='membresias'&&/^[1-5]$/.test(e.key))choosePlan(Number(e.key)-1);
 });
 choosePlan(3);connectDiscord();addLogos();requestAnimationFrame(frame);
 // Explicit navigation always overrides fragile gaze targeting.
 document.addEventListener('click',event=>{
    const btn=event.target.closest('[data-screen],[data-goto]');
    if(!btn)return;
    const name=btn.getAttribute('data-screen')||btn.getAttribute('data-goto');
    if(!['membresias','portafolio','discord'].includes(name))return;
    setTimeout(()=>window.EDA_SPATIAL?.show(name),30);
 });
 // Direct links must display the content even before the renderer is ready.
 const direct=new URLSearchParams(location.search).get('estacion');
 if(['membresias','portafolio','discord'].includes(direct)){
    const enter=()=>{
       window.EDA_CINEMA?.skip?.();
       document.querySelector('#welcome')?.classList.add('dismissed');
       window.EDA_SPATIAL?.show(direct);
    };
    setTimeout(enter,100);
    document.addEventListener('DOMContentLoaded',enter,{once:true});
 }

 window.EDA_SPATIAL={
   choosePlan,refreshLogos:addLogos,refreshDiscord:connectDiscord,
   show(name){
      if(!['membresias','portafolio','discord'].includes(name))return;
      forcedPanel=name;
      document.querySelector('#welcome')?.classList.add('dismissed');
      document.querySelector('#studio-app')?.classList.add('in-tour');
      window.EDA_V4?.focus?.(name,true);
      for(const [key,id] of [['membresias','eda-memberships'],['portafolio','eda-portfolio'],['discord','eda-discord']]){
        el('#'+id).hidden=key!==name;
      }
      active=name;
      panel.hidden=false;
      panel.setAttribute('data-active-station',name);
      panel.querySelector('#eda-holo-close')?.removeAttribute('hidden');
      if(name==='portafolio')addLogos();
   }
 };
})();