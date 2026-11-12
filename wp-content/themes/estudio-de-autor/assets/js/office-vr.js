/* Estudio de Autor 3.1: first-person WebGL office, optional WebXR. */
(()=>{
'use strict';
const $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));
const app=$('#studio-app'),scene=$('#office-scene'),rig=$('#player-rig'),cam=$('#player-camera'),intro=$('#welcome');
if(!app)return;
const panel=$('#detail-panel'),scrim=$('#panel-scrim'),notice=$('#scene-wait'),vrButton=$('#vr-button');
const locations={
 servicios:{label:'ZONA CREATIVA',x:-3.7,z:-1.5,stand:[-2.4,0,.0],color:'#c7afea',summary:'Web, WordPress, UX/UI, identidad, video, SEO, automatización e ideas Web3. Alcance y horas definidos.'},
 portafolio:{label:'PORTAFOLIO',x:0,z:-4.9,stand:[0,0,-1.4],color:'#b2c7fb',summary:'PeekDex: comunidad de coleccionismo. IQ-Bites: identidad y comercio. GUBE: servicio local y experiencia web.'},
 membresias:{label:'MEMBRESÍAS',x:4,z:-2.1,stand:[2,0,-.1],color:'#e3c5a4',summary:'Cinco niveles de trabajo remoto. De 790 a 19,900 pesos por mes, con tiempo mensual limitado.'},
 diagnostico:{label:'DIAGNÓSTICO',x:3,z:1.6,stand:[1.4,0,2.5],color:'#9cddd1',summary:'Cuéntanos tu proyecto. Primero revisamos alcance y agenda; después definimos la suscripción y el cobro.'}
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
const message=s=>$('#status-help').textContent=s;
function dismiss(){started=true;intro.classList.add('dismissed');app.classList.add('in-tour');}
function closeMenu(){$('#direct-nav').classList.remove('is-open');$('#nav-menu-btn').setAttribute('aria-expanded','false');}
$('#nav-menu-btn').addEventListener('click',()=>{let o=!$('#direct-nav').classList.contains('is-open');$('#direct-nav').classList.toggle('is-open',o);$('#nav-menu-btn').setAttribute('aria-expanded',String(o));});
function open(name){
 if(!['servicios','portafolio','membresias','diagnostico','privacidad'].includes(name))return;
 dismiss();closeMenu();
 if(vr){vrInfo(name);return;}
 if(!active)oldFocus=document.activeElement;
 active=name;$$('.panel-screen').forEach(p=>p.classList.toggle('active',p.dataset.screenContent===name));
 $('#panel-location').textContent=name.toUpperCase();panel.removeAttribute('inert');panel.classList.add('open');panel.setAttribute('aria-hidden','false');scrim.classList.add('open');app.classList.add('panel-open');
 document.exitPointerLock?.();panel.querySelector('.panel-scroll').scrollTop=0;$('#panel-close').focus({preventScroll:true});
}
function close(){if(!active)return;active=null;panel.classList.remove('open');panel.setAttribute('aria-hidden','true');panel.setAttribute('inert','');scrim.classList.remove('open');app.classList.remove('panel-open');if(oldFocus&&document.contains(oldFocus))oldFocus.focus({preventScroll:true});}
$('#panel-close').addEventListener('click',close);scrim.addEventListener('click',close);
document.addEventListener('click',e=>{let target=e.target.closest('[data-screen]');if(target){e.preventDefault();open(target.dataset.screen);return;}let go=e.target.closest('[data-goto]');if(go){e.preventDefault();visit(go.dataset.goto,true);}});
$('#enter-office').addEventListener('click',()=>{dismiss();message('Camina con WASD, arrastra para mirar y pulsa E cerca de una estación.');});
$('#brand-home').addEventListener('click',e=>{e.preventDefault();close();restart();intro.classList.remove('dismissed');started=false;app.classList.remove('in-tour');});
$('#reset-view').addEventListener('click',()=>{close();restart();message('Volviste a la recepción virtual.');});
$('#soundless').addEventListener('click',()=>message('Esta experiencia no reproduce audio.'));
function showPlan(name){const p=plans[name];if(!p)return;currentPlan=name;$$('[data-plan]').forEach(el=>{let yes=el.dataset.plan===name;el.classList.toggle('selected',yes);el.setAttribute('aria-selected',String(yes));});
 $('#selected-number').textContent='NIVEL / '+p.n;$('#selected-hours').textContent=p.hours===.5?'30 MIN / MES':p.hours+' HORAS / MES';$('#selected-name').textContent=name;$('#selected-tagline').textContent=p.tag;$('#selected-price').textContent='$'+p.price.toLocaleString('es-MX');$('#selected-benefits').replaceChildren(...p.features.map(t=>{const li=document.createElement('li');li.textContent=t;return li}));$('#selected-limit').textContent=p.limit;$('#form-plan').value=name;}
$$('[data-plan]').forEach(el=>el.addEventListener('click',()=>showPlan(el.dataset.plan)));
$('#plan-apply').addEventListener('click',()=>{$('#form-plan').value=currentPlan;open('diagnostico');});$('#form-plan').addEventListener('change',e=>showPlan(e.target.value));showPlan(currentPlan);
function formNote(t,isError=false){let f=$('#form-result');f.textContent=t;f.classList.add('visible');f.classList.toggle('error',isError);}
$('#studio-form').addEventListener('submit',async e=>{e.preventDefault();const form=e.currentTarget;if(!form.reportValidity()){formNote('Completa los campos obligatorios.',true);return;}if(String(form.elements.description.value).trim().length<15){formNote('Escribe al menos 15 caracteres.',true);return;}
 if(!window.EstudioConfig?.ajaxUrl||!window.EstudioConfig?.nonce){formNote('Esta es una demostración: los datos no se guardan ni se envían. El registro estará activo al instalar y configurar WordPress.');return;}
 const btn=$('#submit-form'),old=btn.innerHTML;btn.disabled=true;btn.textContent='Enviando…';const data=new FormData(form);data.append('action','eda_submit_lead');data.append('nonce',window.EstudioConfig.nonce);
 try{const res=await fetch(window.EstudioConfig.ajaxUrl,{method:'POST',body:data,credentials:'same-origin'}),r=await res.json();if(!res.ok||!r.success)throw new Error(r.data?.message||'No fue posible guardar la solicitud.');formNote('Solicitud recibida: '+r.data.folio+'. Revisaremos tu caso antes de ofrecer un cobro.');form.reset();$('#form-plan').value=currentPlan;}
 catch(err){formNote(err.message||'Error de conexión.',true)}finally{btn.disabled=false;btn.innerHTML=old;}
});
function nearby(){if(!rig?.object3D)return null;let chosen=null,min=9e9;for(const [k,s] of Object.entries(locations)){const d=Math.hypot(rig.object3D.position.x-s.x,rig.object3D.position.z-s.z);if(d<min){min=d;chosen=k}}return min<=3.1?chosen:null;}
function teleport(key){let l=locations[key];if(!l||!rig?.object3D)return;rig.object3D.position.set(...l.stand)}
function visit(key,openImmediately=false){if(!locations[key])return;dismiss();teleport(key);if(openImmediately)open(key);else message('Llegaste a '+locations[key].label+'. Pulsa E para explorar.');}
function restart(){if(rig?.object3D)rig.object3D.position.set(0,0,4.5);let look=cam?.components?.['look-controls'];if(look?.yawObject)look.yawObject.rotation.y=0;if(look?.pitchObject)look.pitchObject.rotation.x=0;}
document.addEventListener('keydown',e=>{if(e.key==='Escape'){close();closeMenu();return;}if(typing(e.target)||e.altKey||e.ctrlKey||e.metaKey)return;let key=e.key.toLowerCase();if(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright','shift'].includes(key)){keys.add(key);dismiss();if(key.startsWith('arrow'))e.preventDefault();}if(key==='e'&&!active){let s=nearby();if(s)open(s);else message('Acércate a una estación para interactuar.');}});
document.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));window.addEventListener('blur',()=>keys.clear());document.addEventListener('visibilitychange',()=>{if(document.hidden)keys.clear()});
$$('[data-move]').forEach(el=>{const k={forward:'w',back:'s',left:'a',right:'d'}[el.dataset.move];el.addEventListener('pointerdown',e=>{e.preventDefault();dismiss();keys.add(k);try{el.setPointerCapture(e.pointerId)}catch(_){}});for(const type of ['pointerup','pointercancel','lostpointercapture'])el.addEventListener(type,e=>{e.preventDefault();keys.delete(k)});});
$('#interact-button').addEventListener('click',()=>open(nearby()||'servicios'));
// All three-dimensional objects are A-Frame (Three.js/WebGL) entities, not photographic hotspots.
const add=(tag,parent,a={})=>{const e=document.createElement(tag);for(const [k,v] of Object.entries(a))e.setAttribute(k,String(v));parent.appendChild(e);return e;};
const cube=(p,x,y,z,w,h,d,c,extra='roughness:.66;metalness:.1')=>add('a-box',p,{position:`${x} ${y} ${z}`,width:w,height:h,depth:d,material:`color:${c};${extra}`});
const plant=(p,x,z,scale=1)=>{add('a-cylinder',p,{position:`${x} ${scale*.20} ${z}`,radius:scale*.19,height:scale*.40,color:'#31363a'});for(let i=0;i<7;i++){let a=i*Math.PI*2/7;add('a-sphere',p,{position:`${x+Math.cos(a)*.14*scale} ${(.65+(i%3)*.1)*scale} ${z+Math.sin(a)*.14*scale}`,radius:scale*.21,scale:'.8 1.9 .8',color:i%2?'#58834e':'#33583a'})}};
function furnish(){const p=$('#office-furniture');if(p.children.length)return;
 // Executive desk, three monitors, keyboard, chair and tower.
 cube(p,0,.79,-3.6,3.9,.13,1.48,'#9d7652');for(const x of [-1.55,1.55])for(const z of [-4.1,-3.1])cube(p,x,.39,z,.10,.77,.10,'#161b22','roughness:.38;metalness:.8');
 for(let i=0;i<3;i++){let x=(i-1)*1.12;cube(p,x,1.57,-4.14,1.04,.68,.07,'#141c27','roughness:.2;metalness:.75');cube(p,x,1.59,-4.08,.94,.55,.018,i===1?'#293766':'#203452','roughness:.3;emissive:#2d3c6f;emissiveIntensity:.32');cube(p,x,1.14,-4.03,.06,.22,.05,'#293139');cube(p,x,1.04,-4.02,.34,.035,.27,'#303840');}
 cube(p,0,.89,-3.12,.73,.035,.25,'#343439');cube(p,.70,.9,-3.10,.18,.018,.26,'#c7c8cc');cube(p,1.5,.46,-4.13,.36,.80,.52,'#151d29');for(let i=0;i<3;i++)add('a-torus',p,{position:`1.694 ${.21+i*.20} -3.87`,radius:.087,'radius-tubular':.014,rotation:'0 90 0',color:'#a8a0ef',material:'emissive:#8b72fd;emissiveIntensity:.5'});
 cube(p,-.35,.6,-2.1,.72,.14,.65,'#252b30');cube(p,-.35,1.18,-2.36,.71,.89,.14,'#292c32');cube(p,-.35,.28,-2.12,.08,.55,.10,'#272d33');
 // Lounge and meeting furniture visible through the 360 panorama.
 cube(p,-4.25,.44,-3.6,2.5,.66,.9,'#303137');cube(p,-4.25,.90,-4.02,2.5,.70,.22,'#373942');cube(p,-5.40,.75,-3.61,.22,.71,.95,'#34363c');cube(p,-3.1,.75,-3.61,.22,.71,.95,'#34363c');
 add('a-cylinder',p,{position:'-4.18 .34 -2.24',radius:.7,height:.06,color:'#7a5d46'});for(let x of [-4.5,-3.86])cube(p,x,.16,-2.24,.09,.30,.09,'#282e37');
 add('a-cylinder',p,{position:'2.45 .68 2.00',radius:.74,height:.10,color:'#926b4c'});add('a-cylinder',p,{position:'2.45 .34 2.00',radius:.09,height:.64,color:'#28313a'});cube(p,1.23,.55,2.20,.49,.15,.53,'#313740');cube(p,3.52,.55,2.15,.49,.15,.53,'#313740');
 for(const y of [.55,1.33,2.12])cube(p,4.9,y,-3.85,.23,.09,3.45,'#282a32');for(const z of [-5.35,-2.5])cube(p,4.9,1.32,z,.1,2.6,.10,'#1e252c');for(let i=0;i<13;i++){let z=-5.15+(i%7)*.37,y=.77+Math.floor(i/7)*.77;cube(p,4.89,y,z,.20,.37,.09,['#d1bb98','#b0a4c9','#c4d4bf'][i%3])}
 plant(p,-5.25,-1.0,1.2);plant(p,5.1,.6,1);plant(p,-1.5,-4.7,.6);cube(p,0,3.44,-4.55,5.1,.055,.07,'#f8deb6','emissive:#efbb81;emissiveIntensity:.6');
}
function points(){const p=$('#office-points');if(p.children.length)return;
 for(const [key,s] of Object.entries(locations)){
 let yaw=key==='servicios'?90:key==='membresias'?-90:key==='diagnostico'?20:0;
 let holder=add('a-entity',p,{position:`${s.x} 1.62 ${s.z}`,rotation:`0 ${yaw} 0`});
 add('a-plane',holder,{width:1.96,height:.93,color:'#152131',material:'opacity:.94;transparent:true;side:double',class:'interactive-object','data-station':key});
 add('a-plane',holder,{position:'0 .42 .018',width:1.82,height:.038,color:s.color,material:`emissive:${s.color};emissiveIntensity:.65`});
 add('a-text',holder,{value:s.label,width:3.3,align:'center',color:'#ffffff',position:'0 .10 .026'});
 add('a-text',holder,{value:'PULSA PARA EXPLORAR',width:2.0,align:'center',color:'#b6c7d3',position:'0 -.22 .026'});
 add('a-ring',p,{position:`${s.stand[0]} .06 ${s.stand[2]}`,rotation:'-90 0 0',radiusInner:.31,radiusOuter:.40,color:s.color,material:'transparent:true;opacity:.82;side:double',class:'interactive-object','data-teleport':key,animation:'property:material.opacity;from:.4;to:.98;dur:1600;dir:alternate;loop:true'});
 }
 // The monitor itself is a real selectable surface.
 add('a-plane',p,{position:'0 1.59 -4.064',width:.94,height:.55,material:'transparent:true;opacity:0',class:'interactive-object','data-station':'portafolio'});
 $$('.interactive-object').forEach(obj=>{obj.addEventListener('click',e=>{e.stopPropagation();if(obj.dataset.station)open(obj.dataset.station);else if(obj.dataset.teleport)visit(obj.dataset.teleport,false);});obj.addEventListener('mouseenter',()=>{if(obj.dataset.station)message('Haz clic: '+locations[obj.dataset.station].label);});});
}
function vrInfo(name){let l=locations[name];if(!l||!window.AFRAME)return;let pane=$('#vr-information');$('#vr-info-title').setAttribute('value',l.label);$('#vr-info-copy').setAttribute('value',l.summary);const V=AFRAME.THREE.Vector3,head=cam.object3D.getWorldPosition(new V()),direction=cam.object3D.getWorldDirection(new V());pane.object3D.position.copy(head).addScaledVector(direction,2.2);pane.object3D.lookAt(head);pane.setAttribute('visible','true');}
function initScene(){if(ready)return;ready=true;notice.classList.add('hidden');app.classList.add('three-ready');furnish();points();
 if(navigator.xr?.isSessionSupported&&window.isSecureContext){navigator.xr.isSessionSupported('immersive-vr').then(s=>{vrButton.disabled=!s;vrButton.innerHTML=s?'◎ <span>Entrar en VR</span>':'◎ <span>Se necesita visor VR</span>';}).catch(()=>{vrButton.disabled=true;vrButton.textContent='VR no disponible'});}
 else{vrButton.disabled=true;vrButton.innerHTML='◎ <span>VR requiere visor y HTTPS</span>';}
 scene.addEventListener('enter-vr',()=>{vr=true;close();vrButton.innerHTML='◎ <span>Salir de VR</span>';$('#gaze-cursor').setAttribute('visible','true');$('#gaze-cursor').setAttribute('raycaster','enabled:true');message('En VR apunta a una estación y usa el gatillo, o mira el marcador.');});
 scene.addEventListener('exit-vr',()=>{vr=false;vrButton.innerHTML='◎ <span>Entrar en VR</span>';$('#gaze-cursor').setAttribute('visible','false');$('#gaze-cursor').setAttribute('raycaster','enabled:false');$('#vr-information').setAttribute('visible','false');});
 function tick(t){let dt=Math.min(.06,last?(t-last)/1000:.016);last=t;if(!document.hidden&&!vr&&!active&&cam?.object3D&&rig?.object3D){let f=(keys.has('w')||keys.has('arrowup')?1:0)-(keys.has('s')||keys.has('arrowdown')?1:0),s=(keys.has('d')?1:0)-(keys.has('a')?1:0);if(f||s){let V=AFRAME.THREE.Vector3,dir=cam.object3D.getWorldDirection(new V());dir.y=0;dir.normalize();let right=new V().crossVectors(dir,new V(0,1,0)).normalize();let vel=dir.multiplyScalar(f).add(right.multiplyScalar(s)).normalize().multiplyScalar(dt*(keys.has('shift')?3.8:2.4));let p=rig.object3D.position,x=Math.max(-5,Math.min(5,p.x+vel.x)),z=Math.max(-2.0,Math.min(5.6,p.z+vel.z));if(!(x>-1.8&&x<1.8&&z<-2.1&&z>-4.6)){p.x=x;p.z=z;}}frameN++;if(frameN%14===0){let s=nearby();if(s)message('Estás cerca de '+locations[s].label+'. Pulsa E.');}}requestAnimationFrame(tick)}requestAnimationFrame(tick);
}
vrButton.addEventListener('click',()=>{if(!ready)return;try{if(scene.is('vr-mode'))scene.exitVR();else scene.enterVR();}catch(_){message('No se pudo iniciar VR; comprueba HTTPS, navegador y visor compatible.');}});
if(!window.AFRAME||!scene){notice.textContent='No se cargó el motor 3D. Utiliza el menú para explorar servicios y planes.';notice.classList.add('error');vrButton.disabled=true;vrButton.innerHTML='◎ <span>VR no disponible</span>';}
else{if(scene.hasLoaded)initScene();else scene.addEventListener('loaded',initScene,{once:true});setTimeout(()=>{if(!ready){notice.textContent='La oficina 3D requiere conexión. Puedes consultar los planes desde el menú.';notice.classList.add('error');}},19000);}
})();