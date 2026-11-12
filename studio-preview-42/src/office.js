
/* Estudio de Autor 3.1: first-person WebGL office, optional WebXR. */
(()=>{
'use strict';
const selectOne = (selector) => document.querySelector(selector);
const selectAll = (selector) => Array.from(document.querySelectorAll(selector));
const app=selectOne('#studio-app'),scene=selectOne('#office-scene'),rig=selectOne('#player-rig'),cam=selectOne('#player-camera'),intro=selectOne('#welcome');
if(!app)return;
const panel=selectOne('#detail-panel'),scrim=selectOne('#panel-scrim'),notice=selectOne('#scene-wait'),vrButton=selectOne('#vr-button');
const locations={
 servicios:{label:'LABORATORIO CREATIVO',x:-4.3,z:-.64,stand:[-2.8,0,1.55],color:'#6de7e9',summary:'Diseño, web, video, SEO e IA con alcances definidos.'},
 portafolio:{label:'PORTAFOLIO',x:0,z:-4.85,stand:[.35,0,-1.25],color:'#b5c0ff',summary:'PeekDex, IQ-Bites y GUBE: proyectos propios.'},
 membresias:{label:'MEMBRESÍAS',x:4.10,z:-4.26,stand:[2.30,0,-1.12],color:'#cbbaff',summary:'Cinco suscripciones con horas y precios mensuales.'},
 diagnostico:{label:'DIAGNÓSTICO',x:2.95,z:3.67,stand:[.3,0,4.42],color:'#9ef0d3',summary:'Revisamos tu idea antes de contratar.'}
};
const plans={
 Inicio:{n:'01',price:790,hours:.5,tag:'Una mejora pequeña, con atención personal.',features:['30 minutos de trabajo mensual','Una revisión o microtarea acordada','Seguimiento escrito','Discord comunitario cuando esté habilitado'],limit:'No incluye crear una página completa.'},
 Impulso:{n:'02',price:1990,hours:1.5,tag:'Una mejora concreta cada vez.',features:['1.5 horas de trabajo mensual','Ajustes de web o contenido','Guion breve o creatividad sencilla, si cabe en las horas','Discord comunitario cuando esté habilitado'],limit:'Las tareas se estiman antes de empezar.'},
 Presencia:{n:'03',price:4990,hours:4,tag:'Tu marca, cuidada mes a mes.',features:['4 horas de trabajo mensual','Contenido y diseño para redes','WordPress, UX y SEO según prioridad','Edición breve de video dentro de las horas'],limit:'No incluye publicidad ni piezas ilimitadas.'},
 'Evolución':{n:'04',price:10900,hours:9,tag:'Desarrolla tu negocio en etapas.',features:['9 horas de trabajo mensual','Sitios y mejoras web por etapas','Automatizaciones sencillas bajo evaluación','Diseño, guiones y video según prioridades','Discord comunitario al habilitarse'],limit:'Los proyectos complejos pueden necesitar varias mensualidades.'},
 Integral:{n:'05',price:19900,hours:16,tag:'Acompañamiento creativo más completo.',features:['16 horas de trabajo mensual','Acceso a categorías elegibles dentro de las horas','Web, contenido, identidad y automatización por fases','Prototipos de apps o Web3 sujetos a viabilidad','Discord y salas de voz por cita cuando se habiliten'],limit:'No incluye trabajo ilimitado, soporte 24/7 ni auditorías especializadas.'}
};
let currentPlan='Evolución',active=null,oldFocus=null,started=false,vr=false,ready=false,last=0,frameN=0;
const keys=new Set();
const typing=el=>el&&(['INPUT','TEXTAREA','SELECT'].includes(el.tagName)||el.isContentEditable);
const message=s=>selectOne('#status-help').textContent=s;
function dismiss(){started=true;intro.classList.add('dismissed');app.classList.add('in-tour');updateStationHint();}

const visited=new Set();
const map=selectOne('#studio-map'),mapToggle=selectOne('#studio-map-toggle');
const mapClose=selectOne('#studio-map-close');
const locOrder=['servicios','portafolio','membresias','diagnostico'];
const stationText = {
  servicios: {object:'Pantalla de diseño',action:'ver servicios'},
  portafolio: {object:'Monitor principal',action:'ver proyectos'},
  membresias: {object:'Panel de membresías',action:'comparar cinco planes'},
  diagnostico: {object:'Mesa de reuniones',action:'solicitar diagnóstico'}
};
let mouseTarget=null;
let lastHint='';
function showObjectHint(station) {
  mouseTarget=station;
  updateStationHint();
}
function updateStationHint(){const hint=selectOne('#interaction-hint');if(hint)hint.hidden=true;}
function hideMap(){
 map.hidden=true;
 mapToggle.setAttribute('aria-expanded','false');
}
function toggleMap(force){
 const show=typeof force==='boolean'?force:map.hidden;
 map.hidden=!show;
 mapToggle.setAttribute('aria-expanded',String(show));
 if(show)mapClose.focus({preventScroll:true});
}
mapToggle.addEventListener('click',()=>toggleMap());
mapClose.addEventListener('click',hideMap);
function updateMapPosition() {
 if(!rig?.object3D)return;
 const px=Math.max(0,Math.min(100,(rig.object3D.position.x+5.65)/11.3*100));
 const pz=Math.max(0,Math.min(100,(rig.object3D.position.z+5.15)/10.65*100));
 const avatar=selectOne('#studio-map-avatar');
 avatar.style.left=px+'%';
 avatar.style.top=(100-pz)+'%';
}
function markDiscovered(key) {
 if(!locOrder.includes(key))return;
 visited.add(key);
 const count=String(visited.size).padStart(2,'0');
 selectOne('#discovery-count').textContent=count+' / 04';
 selectOne('#studio-progress-fill').style.width=(visited.size*25)+'%';
 selectOne('#studio-progress-caption').textContent=visited.size===4?
   'Recorrido completo. Cuéntanos qué quieres construir.':
   'Descubiertos '+visited.size+' de 4 espacios.';
 for(const k of locOrder){
   selectAll('[data-goto="'+k+'"]').forEach(el=>el.classList.toggle('visited',visited.has(k)));
 }
}

function closeMenu(){selectOne('#direct-nav').classList.remove('is-open');selectOne('#nav-menu-btn').setAttribute('aria-expanded','false');}
selectOne('#nav-menu-btn').addEventListener('click',()=>{let o=!selectOne('#direct-nav').classList.contains('is-open');selectOne('#direct-nav').classList.toggle('is-open',o);selectOne('#nav-menu-btn').setAttribute('aria-expanded',String(o));});
function open(name){
  if(!['servicios','portafolio','membresias','diagnostico','privacidad'].includes(name))return;
  dismiss();closeMenu();hideMap();markDiscovered(name);
  if(name==='servicios'||name==='portafolio'||name==='membresias'){
    close();
    window.EDA_V4?.focus(name,true);
    message('Mira hacia la zona: la información aparecerá en un holograma.');
    return;
  }
  if(vr){window.EDA_V4?.focus(name,true);message('Para enviar una solicitud, utiliza el formulario fuera de VR.');return;}
  if(!active)oldFocus=document.activeElement;
  active=name;updateStationHint();
  selectAll('.panel-screen').forEach(p=>p.classList.toggle('active',p.dataset.screenContent===name));
  selectOne('#panel-location').textContent=name.toUpperCase();
  panel.removeAttribute('inert');panel.classList.add('open');panel.setAttribute('aria-hidden','false');
  scrim.classList.add('open');app.classList.add('panel-open');
  document.exitPointerLock?.();panel.querySelector('.panel-scroll').scrollTop=0;
  selectOne('#panel-close').focus({preventScroll:true});
}
function close(){active=null;panel.classList.remove('open');panel.setAttribute('aria-hidden','true');panel.setAttribute('inert','');scrim.classList.remove('open');app.classList.remove('panel-open');if(oldFocus&&document.contains(oldFocus))oldFocus.focus({preventScroll:true});updateStationHint();}
selectOne('#panel-close').addEventListener('click',close);scrim.addEventListener('click',close);
document.addEventListener('click',e=>{let target=e.target.closest('[data-screen]');if(target){e.preventDefault();open(target.dataset.screen);return;}let go=e.target.closest('[data-goto]');if(go){e.preventDefault();visit(go.dataset.goto,true);}});
selectOne('#enter-office').addEventListener('click',()=>{dismiss();message('Mira hacia el monitor, las membresías, la zona creativa o la mesa para activar un holograma.');});
selectOne('#brand-home').addEventListener('click',e=>{e.preventDefault();close();restart();intro.classList.remove('dismissed');started=false;app.classList.remove('in-tour');});
selectOne('#reset-view').addEventListener('click',()=>{close();restart();message('Volviste a la recepción virtual.');});
let lightingMode=0;
selectOne('#soundless').addEventListener('click',()=>{
  lightingMode=(lightingMode+1)%2;
  const ambient=scene.querySelector('[light*="type:ambient"]');
  if(ambient)ambient.setAttribute('light','intensity',lightingMode?1.1:.56);
  scene.setAttribute('background','color',lightingMode?'#29323a':'#12191e');
  selectOne('#soundless').innerHTML=lightingMode?'☀ <span>Estudio día</span>':'◐ <span>Estudio noche</span>';
  message(lightingMode?'Iluminación de día activada.':'Iluminación nocturna activada.');
});
function showPlan(name){const p=plans[name];if(!p)return;currentPlan=name;selectAll('[data-plan]').forEach(el=>{let yes=el.dataset.plan===name;el.classList.toggle('selected',yes);el.setAttribute('aria-selected',String(yes));});
 selectOne('#selected-number').textContent='NIVEL / '+p.n;selectOne('#selected-hours').textContent=p.hours===.5?'30 MIN / MES':p.hours+' HORAS / MES';selectOne('#selected-name').textContent=name;selectOne('#selected-tagline').textContent=p.tag;selectOne('#selected-price').textContent='MXN '+p.price.toLocaleString('es-MX');selectOne('#selected-benefits').replaceChildren(...p.features.map(t=>{const li=document.createElement('li');li.textContent=t;return li}));selectOne('#selected-limit').textContent=p.limit;selectOne('#form-plan').value=name;}
selectAll('[data-plan]').forEach(el=>el.addEventListener('click',()=>showPlan(el.dataset.plan)));
selectOne('#plan-apply').addEventListener('click',()=>{selectOne('#form-plan').value=currentPlan;open('diagnostico');});selectOne('#form-plan').addEventListener('change',e=>showPlan(e.target.value));showPlan(currentPlan);
function formNote(t,isError=false){let f=selectOne('#form-result');f.textContent=t;f.classList.add('visible');f.classList.toggle('error',isError);}
selectOne('#studio-form').addEventListener('submit',async e=>{e.preventDefault();const form=e.currentTarget;if(!form.reportValidity()){formNote('Completa los campos obligatorios.',true);return;}if(String(form.elements.description.value).trim().length<15){formNote('Escribe al menos 15 caracteres.',true);return;}
 if(!window.EstudioConfig?.ajaxUrl||!window.EstudioConfig?.nonce){formNote('Esta es una demostración: los datos no se guardan ni se envían. El registro estará activo al instalar y configurar WordPress.');return;}
 const btn=selectOne('#submit-form'),old=btn.innerHTML;btn.disabled=true;btn.textContent='Enviando…';const data=new FormData(form);data.append('action','eda_submit_lead');data.append('nonce',window.EstudioConfig.nonce);
 try{const res=await fetch(window.EstudioConfig.ajaxUrl,{method:'POST',body:data,credentials:'same-origin'}),r=await res.json();if(!res.ok||!r.success)throw new Error(r.data?.message||'No fue posible guardar la solicitud.');formNote('Solicitud recibida: '+r.data.folio+'. Revisaremos tu caso antes de ofrecer un cobro.');form.reset();selectOne('#form-plan').value=currentPlan;}
 catch(err){formNote(err.message||'Error de conexión.',true)}finally{btn.disabled=false;btn.innerHTML=old;}
});
function nearby(){if(!rig?.object3D)return null;let chosen=null,min=9e9;for(const [k,s] of Object.entries(locations)){const d=Math.hypot(rig.object3D.position.x-s.x,rig.object3D.position.z-s.z);if(d<min){min=d;chosen=k}}return min<=3.1?chosen:null;}
function teleport(key){let l=locations[key];if(!l||!rig?.object3D)return;rig.object3D.position.set(...l.stand)}
function visit(key,openImmediately=false){if(!locations[key])return;dismiss();hideMap();if(window.EDA_V4?.focus)window.EDA_V4.focus(key,true);else teleport(key);updateMapPosition();if(openImmediately&&key==='diagnostico')open(key);else message('Mira hacia la estación para activar el holograma.');}
function restart(){if(rig?.object3D)rig.object3D.position.set(0,0,4.5);hideMap();updateMapPosition();let look=cam?.components?.['look-controls'];if(look?.yawObject)look.yawObject.rotation.y=0;if(look?.pitchObject)look.pitchObject.rotation.x=0;}
document.addEventListener('keydown',e=>{if(e.key==='Escape'){close();closeMenu();hideMap();return;}if(typing(e.target)||e.altKey||e.ctrlKey||e.metaKey)return;let key=e.key.toLowerCase();if(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright','shift'].includes(key)){keys.add(key);dismiss();if(key.startsWith('arrow'))e.preventDefault();}if(key==='e'&&!active&&!window.EDA_V4?.active){const s=nearby();if(s)open(s);}});
document.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));window.addEventListener('blur',()=>keys.clear());document.addEventListener('visibilitychange',()=>{if(document.hidden)keys.clear()});
selectAll('[data-move]').forEach(el=>{const k={forward:'w',back:'s',left:'a',right:'d'}[el.dataset.move];el.addEventListener('pointerdown',e=>{e.preventDefault();dismiss();keys.add(k);try{el.setPointerCapture(e.pointerId)}catch(_){}});for(const type of ['pointerup','pointercancel','lostpointercapture'])el.addEventListener(type,e=>{e.preventDefault();keys.delete(k)});});
selectOne('#interact-button').addEventListener('click',()=>{const s=window.EDA_V4?.active||nearby()||'servicios';if(s==='diagnostico')open('diagnostico');else window.EDA_V4?.focus(s,true);});
// All three-dimensional objects are A-Frame (Three.js/WebGL) entities, not photographic hotspots.
const add=(tag,parent,a={})=>{const e=document.createElement(tag);for(const [k,v] of Object.entries(a))e.setAttribute(k,String(v));parent.appendChild(e);return e;};
const cube=(p,x,y,z,w,h,d,c,extra='roughness:.66;metalness:.1')=>add('a-box',p,{position:`${x} ${y} ${z}`,width:w,height:h,depth:d,material:`color:${c};${extra}`});
const plant=(p,x,z,scale=1)=>{add('a-cylinder',p,{position:`${x} ${scale*.20} ${z}`,radius:scale*.19,height:scale*.40,color:'#31363a'});for(let i=0;i<7;i++){let a=i*Math.PI*2/7;add('a-sphere',p,{position:`${x+Math.cos(a)*.14*scale} ${(.65+(i%3)*.1)*scale} ${z+Math.sin(a)*.14*scale}`,radius:scale*.21,scale:'.8 1.9 .8',color:i%2?'#58834e':'#33583a'})}};
/* A full, spatially coherent virtual studio. Geometry is lightweight and built
   locally so the first-person experience does not wait for a model CDN. */
function furnish(){if(!window.EDA_SceneV4?.build)throw new Error('Interior 3D no disponible');window.EDA_SceneV4.build();}
function points(){/* No hay círculos ni superficies flotantes: hologramas por dirección de la mirada. */}
function vrInfo(name){let l=locations[name];if(!l||!window.AFRAME)return;let pane=selectOne('#vr-information');selectOne('#vr-info-title').setAttribute('value',l.label);selectOne('#vr-info-copy').setAttribute('value',l.summary);const V=AFRAME.THREE.Vector3,head=cam.object3D.getWorldPosition(new V()),direction=cam.object3D.getWorldDirection(new V());pane.object3D.position.copy(head).addScaledVector(direction,2.2);pane.object3D.lookAt(head);pane.setAttribute('visible','true');}

function movementAxes() {
  const THREE=AFRAME.THREE;
  const cameraObject=cam.getObject3D('camera') || cam.object3D;
  const worldQ=new THREE.Quaternion();
  cameraObject.getWorldQuaternion(worldQ);
  const forward=new THREE.Vector3(0,0,-1).applyQuaternion(worldQ);
  forward.y=0;
  if(forward.lengthSq()<.001)forward.set(0,0,-1);
  forward.normalize();
  const right=new THREE.Vector3().crossVectors(forward,new THREE.Vector3(0,1,0)).normalize();
  return {forward,right};
}

function initScene(){
 if (ready || !window.AFRAME || !scene?.object3D) return;
 ready = true;
 notice.classList.add('hidden');
 app.classList.remove('three-error');
 app.classList.add('three-ready');
 try { furnish(); points(); } catch (error) {
   ready = false;
   showFallback('El render 3D no pudo iniciar. Usa los accesos directos.');
   console.error('[Estudio] Render inicial fallido', error);
   return;
 }
 if(navigator.xr?.isSessionSupported&&window.isSecureContext){navigator.xr.isSessionSupported('immersive-vr').then(s=>{vrButton.disabled=!s;vrButton.innerHTML=s?'◎ <span>Entrar en VR</span>':'◎ <span>Se necesita visor VR</span>';}).catch(()=>{vrButton.disabled=true;vrButton.textContent='VR no disponible'});}
 else{vrButton.disabled=true;vrButton.innerHTML='◎ <span>VR requiere visor y HTTPS</span>';}
 scene.addEventListener('enter-vr',()=>{vr=true;hideMap();close();vrButton.innerHTML='◎ <span>Salir de VR</span>';selectOne('#gaze-cursor').setAttribute('visible','true');selectOne('#gaze-cursor').setAttribute('raycaster','enabled:true');message('En VR apunta a una estación y usa el gatillo, o mira el marcador.');});
 scene.addEventListener('exit-vr',()=>{vr=false;vrButton.innerHTML='◎ <span>Entrar en VR</span>';selectOne('#gaze-cursor').setAttribute('visible','false');selectOne('#gaze-cursor').setAttribute('raycaster','enabled:false');selectOne('#vr-information').setAttribute('visible','false');});

 function tick(t) {
   const dt=Math.min(.05, last?(t-last)/1000:.016);
   last=t;
   if (!document.hidden && !vr && !active && cam?.object3D && rig?.object3D) {
     const forwardInput=Number(keys.has('w')||keys.has('arrowup'))-
       Number(keys.has('s')||keys.has('arrowdown'));
     const sideInput=Number(keys.has('d'))-Number(keys.has('a'));
     if(forwardInput||sideInput) {
       const axes=movementAxes();
       const delta=axes.forward.multiplyScalar(forwardInput)
         .add(axes.right.multiplyScalar(sideInput));
       if(delta.lengthSq()>.00001) {
         const speed=keys.has('shift')?4.45:2.85;
         delta.normalize().multiplyScalar(speed*dt);
         const p=rig.object3D.position;
         const nextX=Math.max(-5.65,Math.min(5.65,p.x+delta.x));
         const nextZ=Math.max(-5.15,Math.min(5.5,p.z+delta.z));
         // Avoid walking through the central desk and through meeting props.
         const desk=nextX>-1.94&&nextX<1.94&&nextZ>-4.55&&nextZ<-2.83;
         const meeting=nextX>1.55&&nextX<3.55&&nextZ>1.42&&nextZ<3.08;
         if(!desk&&!meeting) {
           p.x=nextX; p.z=nextZ;
           if(frameN%3===0)updateMapPosition();
         }
       }
     }
     frameN++;
     if(frameN%10===0) updateStationHint();
   }
   requestAnimationFrame(tick);
 }
 requestAnimationFrame(tick);

}
vrButton.addEventListener('click',()=>{if(!ready)return;try{if(scene.is('vr-mode'))scene.exitVR();else scene.enterVR();}catch(_){message('No se pudo iniciar VR; comprueba HTTPS, navegador y visor compatible.');}});

function showFallback(reason) {
 if (ready) return;
 notice.textContent = reason;
 notice.classList.add('error');
 notice.classList.remove('loading');
 app.classList.add('three-error');
 vrButton.disabled = true;
 vrButton.innerHTML = '◎ <span>VR no disponible</span>';
 message('Puedes utilizar Servicios, Proyectos, Membresías y Diagnóstico desde el menú.');
}
if (!window.AFRAME || !scene) {
 showFallback('Este navegador no ha podido abrir el motor 3D. Utiliza el menú.');
} else {
 if (scene.hasLoaded) initScene();
 else scene.addEventListener('loaded', initScene, {once:true});
 scene.addEventListener('renderstart', () => {
   if (!ready) initScene();
 }, {once:true});
 scene.addEventListener('error', event => console.error('[Estudio] Error en la escena 3D', event));
 setTimeout(() => {
   if (!ready && scene.renderer && scene.object3D) initScene();
 }, 4000);
 setTimeout(() => {
   if (!ready) showFallback('No pudimos activar el recorrido 3D en este navegador. El menú sigue disponible.');
 }, 10500);
}

})();
