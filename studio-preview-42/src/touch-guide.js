/* Mobile-first reading and navigation, independent of WebGL and camera aim. */
(function touchGuide(){
 const app=document.querySelector('#studio-app'),scene=document.querySelector('#office-scene'),container=document.querySelector('#scene-container');
 const media=matchMedia('(max-width:1100px), (pointer:coarse)');
 const labels={servicios:'Servicios',portafolio:'Proyectos',membresias:'Planes',discord:'Discord',diagnostico:'Contacto'};
 let station='servicios',selected=0,exploring=false,active=false,pausedByGuide=false;
 const root=document.createElement('section');root.id='touch-guide';root.hidden=true;root.setAttribute('aria-label','Estudio de Autor');
 root.innerHTML='<header><div><small>ESTUDIO DE AUTOR</small><p>Tu idea, su siguiente paso.</p></div><button type="button" id="touch-explore">Ver oficina 3D</button></header><nav aria-label="Secciones del estudio"></nav><article tabindex="-1"></article><div id="touch-world-host"></div>';
 container.appendChild(root);
 const nav=root.querySelector('nav'),article=root.querySelector('article'),host=root.querySelector('#touch-world-host');
 const lookbar=document.createElement('div');lookbar.id='touch-look';lookbar.hidden=true;
 lookbar.innerHTML='<button type="button" data-turn="1" aria-label="Mirar a la izquierda">↶ Izquierda</button><button type="button" id="touch-return">Volver a secciones</button><button type="button" data-turn="-1" aria-label="Mirar a la derecha">Derecha ↷</button>';
 container.appendChild(lookbar);
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const money=n=>'$'+n.toLocaleString('es-MX',{minimumFractionDigits:2,maximumFractionDigits:2});
 const plans=()=>window.EDA_ESSENTIAL?.plans||[];
 function mount(){
  if(!active)return;
  // Reuse the original form and official widget; preserve their event handlers.
  const widget=document.querySelector('#discord-world-widget'),brief=document.querySelector('#brief-world-hologram');
  for(const node of [widget,brief]){
   if(!node)continue;
   if(node.parentElement!==host)host.appendChild(node);
   const shown=station===(node===widget?'discord':'diagnostico');
   node.classList.toggle('is-visible',shown);node.inert=!shown;node.setAttribute('aria-hidden',String(!shown));
  }
  if(station==='diagnostico'&&!brief){
   const form=document.querySelector('#studio-form');
   if(form&&form.parentElement!==host)host.appendChild(form);
  }
  const form=document.querySelector('#studio-form');
  if(form)form.hidden=form.parentElement===host&&station!=='diagnostico';
 }
 function render(){
  nav.querySelectorAll('button').forEach(b=>{b.setAttribute('aria-current',String(b.dataset.station===station));});
  if(station==='servicios')article.innerHTML='<h1>Ideas que toman forma</h1><p>Diseño, tecnología y contenido con atención personal.</p><div class="touch-services"><section><h2>Web y producto</h2><p>Páginas, tiendas, UX/UI y prototipos.</p></section><section><h2>Diseño y contenido</h2><p>Identidad, redes, imágenes y presentaciones.</p></section><section><h2>Video y comunicación</h2><p>Guiones y edición con intención comercial.</p></section><section><h2>Crecimiento y tecnología</h2><p>SEO, embudos y automatizaciones por etapas.</p></section></div><button class="touch-primary" data-next="membresias">Ver membresías</button>';
  if(station==='portafolio')article.innerHTML='<h1>Proyectos del estudio</h1><p>Toca un proyecto para conocerlo.</p><div class="touch-projects">'+[
   ['PEEKDEX','Comunidad digital para coleccionistas.','peekdex-logo.png','https://peekdex.com'],
   ['IQ-BITES','Identidad y comercio de una marca de snacks.','iq-bites-logo.png','https://iq-bites.com'],
   ['GUBE','Presencia digital para un servicio local.','gube-logo.png','https://estacionamientogube.com.mx']
  ].map(([name,copy,logo,url])=>`<a href="${url}" target="_blank" rel="noopener noreferrer"><img src="/logos/${logo}" alt="${name}" loading="lazy"><div><h2>${name} ↗</h2><p>${copy}</p></div></a>`).join('')+'</div>';
  if(station==='membresias'){
   const list=plans(),p=list[selected];
   if(!p){article.innerHTML='<h1>Membresías</h1><p>Cargando los planes…</p>';return;}
   const link=window.EDA_SITE_CONFIG?.checkout?.[p.name]?.stripe;
   let url='';try{const u=new URL(link);if(u.protocol==='https:'&&['buy.stripe.com','checkout.stripe.com'].includes(u.hostname))url=u.href;}catch{}
   article.innerHTML='<h1>Elige tu membresía</h1><p>Precios en MXN. Renovación mensual.</p><div class="touch-plans" role="group" aria-label="Seleccionar membresía">'+list.map((v,i)=>`<button type="button" data-plan="${i}" aria-pressed="${i===selected}">${esc(v.name)}</button>`).join('')+`</div><section class="touch-plan-detail"><h2>${esc(p.name)}</h2><p class="touch-price">${money(p.price)} <span>+ IVA / mes</span></p><p>${esc(p.hours)} de trabajo al mes</p><ul>${p.items.map(v=>'<li>'+esc(v)+'</li>').join('')}</ul><p>${esc(p.limit)}</p><p class="touch-total">Total con IVA del 16%: <strong>${money(p.price*1.16)} MXN / mes</strong></p>${url?`<a class="touch-primary" href="${esc(url)}">Suscribirme · pago seguro</a><p class="touch-note">Tarjeta. Apple Pay o Google Pay cuando estén disponibles en tu dispositivo.</p>`:'<button class="touch-primary" disabled>Cobro pendiente de habilitar</button><p class="touch-note">Aún no hay un enlace de cobro disponible para este plan.</p>'}</section>`;
  }
  if(station==='discord')article.innerHTML='<h1>Conversemos en Discord</h1><p>Consulta la comunidad o entra al servidor.</p><a class="touch-primary" href="https://discord.com/invite/EQrbUX8V" target="_blank" rel="noopener noreferrer">Abrir Discord ↗</a>';
  if(station==='diagnostico')article.innerHTML='<h1>Cuéntanos tu proyecto</h1><p>Acordemos el alcance antes de comenzar. Enviar tu consulta no genera cargos.</p>';
  mount();
 }
 function show(name,focus=false){
  if(!labels[name])return;
  station=name;exploring=false;update();render();root.scrollTop=0;
  document.querySelector('.global-nav')?.classList.remove('is-open');
  if(focus)article.focus({preventScroll:true});
 }
 for(const [id,label] of Object.entries(labels)){
  const b=document.createElement('button');b.type='button';b.dataset.station=id;b.textContent=label;b.onclick=()=>show(id,true);nav.appendChild(b);
 }
 root.addEventListener('click',e=>{
  const plan=e.target.closest('[data-plan]');if(plan){selected=Number(plan.dataset.plan);window.EDA_ESSENTIAL?.selectPlan(selected);render();root.querySelector(`[data-plan="${selected}"]`)?.focus({preventScroll:true});}
  const next=e.target.closest('[data-next]');if(next)show(next.dataset.next,true);
 });
 root.querySelector('#touch-explore').onclick=()=>{
  exploring=true;window.EDA_CINEMA?.skip?.();window.EDA_ESSENTIAL?.close();update();
  document.querySelector('#welcome')?.classList.add('dismissed');app.classList.add('in-tour');
 };
 lookbar.querySelector('#touch-return').onclick=()=>show(station,true);
 lookbar.querySelectorAll('[data-turn]').forEach(b=>b.onclick=()=>{
  const look=document.querySelector('#player-camera')?.components?.['look-controls'];
  if(look?.yawObject)look.yawObject.rotation.y+=Number(b.dataset.turn)*Math.PI/4;
  window.EDA_V4?.clearFocus();
 });
 function update(){
  const touch=media.matches&&!scene.is?.('vr-mode');
  active=touch&&!exploring;root.hidden=!active;lookbar.hidden=!touch||!exploring;
  document.body.classList.toggle('touch-guided',active);document.body.classList.toggle('touch-exploring',touch&&exploring);
  if(scene.hasLoaded){
   if(active&&!pausedByGuide){scene.pause();pausedByGuide=true;}
   else if(!active&&pausedByGuide){scene.play();pausedByGuide=false;}
  }
  const cam=document.querySelector('#player-camera');
  cam?.setAttribute('look-controls','touchEnabled',!active);cam?.setAttribute('look-controls','pointerLockEnabled',!touch);
  if(!active){for(const node of Array.from(host.children)){if(node.id==='studio-form')continue;container.appendChild(node);}}
  else {window.EDA_CINEMA?.skip?.();mount();}
 }
 window.EDA_TOUCH={get enabled(){return media.matches&&!scene.is?.('vr-mode')},get active(){return active},get station(){return station},show};
 document.addEventListener('click',e=>{
  if(!media.matches||scene.is?.('vr-mode'))return;
  const target=e.target.closest('[data-screen],[data-goto]');
  const id=target?.dataset.screen||target?.dataset.goto;
  if(labels[id]){e.preventDefault();e.stopImmediatePropagation();show(id,true);}
 },true);
 media.addEventListener('change',update);scene.addEventListener('loaded',update);scene.addEventListener('enter-vr',update);scene.addEventListener('exit-vr',update);
 // The guide works even when the 3D renderer cannot start.
 const observer=new MutationObserver(()=>{if(active)mount();});observer.observe(container,{childList:true});
 let attempts=0;const timer=setInterval(()=>{if(plans().length){clearInterval(timer);render();}else if(++attempts>100)clearInterval(timer);},100);
 const route=new URLSearchParams(location.search).get('estacion');if(labels[route])station=route;
 update();render();
})();
