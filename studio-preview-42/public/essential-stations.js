(function essentialStations(){
'use strict';
const names=['membresias','portafolio','discord'];
const plans=[
 ['Inicio',790,'30 minutos',['Microtarea o revisión','Seguimiento por escrito']],
 ['Impulso',1990,'1.5 horas',['Ajustes web o contenido','Diseño o guion breve']],
 ['Presencia',4990,'4 horas',['Contenido y diseño para redes','WordPress, UX o SEO básico','Video breve según horas']],
 ['Evolución',10900,'9 horas',['Mejoras web por fases','Automatizaciones sencillas','Diseño, contenidos y video']],
 ['Integral',19900,'16 horas',['Web, contenido e identidad por fases','Automatización según viabilidad','Discord y voz por cita si se habilitan']]
];
const portfolio=[
 ['PeekDex','peekdex-logo.png','https://peekdex.com','Comunidad y plataforma para coleccionistas'],
 ['IQ-Bites','iq-bites-logo.png','https://iq-bites.com','Identidad, catálogo y comercio digital'],
 ['GUBE','gube-logo.png','https://estacionamientogube.com.mx','Servicio local y herramientas web']
];
const html=`<div id="essential-overlay" class="essential-overlay" hidden><div class="essential-dialog">
<header><small>ESTUDIO DE AUTOR / EXPERIENCIA ESPACIAL</small><strong id="essential-heading">HOLOGRAMA</strong><button type="button" id="essential-close">✕ CERRAR</button></header>
<section id="essential-memberships" hidden><div class="essential-grid">
 <div class="essential-card"><small>01 / ELEGIR PLAN</small><div id="essential-plan-buttons">${plans.map((p,i)=>`<button data-essential-plan="${i}" type="button"><b>0${i+1}</b> ${p[0]} <span>$${p[1].toLocaleString('es-MX')}</span></button>`).join('')}</div></div>
 <div class="essential-card"><small>02 / DETALLES DEL PLAN</small><h2 id="essential-plan-name"></h2><strong id="essential-plan-price"></strong><p id="essential-plan-hours"></p><ul id="essential-plan-features"></ul><p class="essential-disclaimer">Servicio por horas y alcance acordado. No incluye trabajo ilimitado.</p></div>
 <div class="essential-card essential-pay"><small>03 / CONTRATACIÓN</small><h2>SUSCRIBIRME</h2><p id="essential-plan-chosen"></p><button class="essential-main-button" type="button" id="essential-toggle-pay">ELEGIR FORMA DE PAGO ↗</button><div id="essential-methods" hidden><button type="button" data-essential-gateway="mercadopago">Mercado Pago</button><button type="button" data-essential-gateway="apple">Apple Pay</button><button type="button" data-essential-gateway="google">Google Pay</button></div><p class="essential-disclaimer" role="status" id="essential-payment-result">Pago mediante pasarela segura, al conectar la cuenta comercial.</p></div>
</div></section>
<section id="essential-portfolio" hidden><div class="essential-project-grid">${portfolio.map((p,i)=>`<article class="essential-project"><small>0${i+1} / PROYECTO</small><img src="/logos/${p[1]}" alt="Logotipo original de ${p[0]}"/><h2>${p[0]}</h2><p>${p[3]}</p><a href="${p[2]}" target="_blank" rel="noopener noreferrer">ABRIR ↗</a></article>`).join('')}</div></section>
<section id="essential-discord" hidden><div class="essential-card"><h2>DISCORD / COMUNIDAD</h2><p>Estación de chat, voz y vídeo. El servidor aún no está conectado. Los encuentros se realizarán dentro de Discord.</p></div></section>
</div></div>`;
document.body.insertAdjacentHTML('beforeend',html);
const $=s=>document.querySelector(s),root=$('#essential-overlay');
let index=3,current=null;
function choose(i){
 if(i<0||i>=plans.length||!Number.isInteger(i))return;
 index=i;const p=plans[i];
 $('#essential-plan-name').textContent=p[0].toUpperCase();
 $('#essential-plan-price').textContent='$'+p[1].toLocaleString('es-MX')+' MXN';
 $('#essential-plan-hours').textContent=p[2]+' al mes';
 $('#essential-plan-chosen').textContent=p[0]+' · $'+p[1].toLocaleString('es-MX')+' MXN/mes';
 $('#essential-plan-features').replaceChildren(...p[3].map(v=>{const li=document.createElement('li');li.textContent=v;return li}));
 document.querySelectorAll('[data-essential-plan]').forEach((b,j)=>b.classList.toggle('active',j===i));
 $('#essential-methods').hidden=true;
 $('#essential-payment-result').textContent='Pago mediante pasarela segura, al conectar la cuenta comercial.';
}
function show(name){
 if(!names.includes(name))return;
 current=name;root.hidden=false;
 $('#essential-heading').textContent=name==='membresias'?'MEMBRESÍAS':name==='portafolio'?'PORTAFOLIO':'DISCORD';
 for(const k of names)$('#essential-'+k).hidden=k!==name;
 $('#welcome')?.classList.add('dismissed');
 $('#studio-app')?.classList.add('in-tour');
 const cinema=$('#eda-cinema');if(cinema)cinema.hidden=true;
 const old=$('#eda-spatial-ui');if(old)old.hidden=true;
 if(name==='membresias')choose(index);
}
function close(){root.hidden=true;current=null;}
function pay(type){
 const p=plans[index][0],options=window.EDA_SITE_CONFIG?.checkout?.[p]||{},v=type==='mercadopago'?options.mercadopago:options.stripe;
 const status=$('#essential-payment-result');
 if(!v){status.textContent='Esta opción aún no está conectada. No se realizó ningún cargo.';return;}
 try{
  const url=new URL(v),host=url.hostname.toLowerCase();
  if(url.protocol!=='https:')throw new Error();
  const valid=type==='mercadopago'?
   (host==='mercadopago.com.mx'||host.endsWith('.mercadopago.com.mx')||host.endsWith('.mercadopago.com')):
   (host==='checkout.stripe.com'||host==='buy.stripe.com');
  if(!valid)throw new Error();
  window.open(url.href,'_blank','noopener,noreferrer');
 }catch(_){status.textContent='El enlace no corresponde a una pasarela válida. No se realizó ningún cargo.';}
}
choose(3);
$('#essential-close').addEventListener('click',close);
$('#essential-toggle-pay').addEventListener('click',()=>$('#essential-methods').hidden=!$('#essential-methods').hidden);
root.addEventListener('click',e=>{
 const p=e.target.closest('[data-essential-plan]');if(p){choose(Number(p.dataset.essentialPlan));return;}
 const g=e.target.closest('[data-essential-gateway]');if(g)pay(g.dataset.essentialGateway);
});
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'){close();return;}
 if(current==='membresias'&&/^[1-5]$/.test(e.key)&&!/INPUT|TEXTAREA|SELECT/.test(e.target?.tagName||''))choose(Number(e.key)-1);
},true);
document.addEventListener('click',e=>{
 const node=e.target.closest('[data-screen],[data-goto]');if(!node)return;
 const n=node.getAttribute('data-screen')||node.getAttribute('data-goto');
 if(names.includes(n)){e.preventDefault();e.stopImmediatePropagation();show(n);}
 else close();
},true);
const route=new URLSearchParams(location.search).get('estacion');
if(names.includes(route))show(route);
window.EDA_ESSENTIAL={show,close};
})();