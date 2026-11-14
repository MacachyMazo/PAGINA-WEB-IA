const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const {parseHTML}=require('linkedom');
const base=require('node:path').resolve(__dirname,'..')+'/';
const source=fs.readFileSync(base+'src/touch-guide.js','utf8');
{
 const {document,window:dom}=parseHTML('<html><body><div id="studio-app"><div id="scene-container"><div id="welcome"></div><a-scene id="office-scene"></a-scene><a-entity id="player-camera"></a-entity><div id="discord-world-widget"></div><div id="brief-world-hologram"><form id="studio-form"><input name="email" value="original@example.com"></form></div></div></div></body></html>');
 const scene=document.querySelector('#office-scene'),cam=document.querySelector('#player-camera');let vr=false,paused=0,played=0;
 scene.is=()=>vr;scene.hasLoaded=true;scene.pause=()=>paused++;scene.play=()=>played++;
 cam.components={'look-controls':{yawObject:{rotation:{y:0}}}};const calls=[];cam.setAttribute=(...args)=>calls.push(args);
 const media={matches:true,addEventListener:(n,f)=>media.change=f};let timer;
 const plans=[{name:'Inicio',price:790,hours:'30 minutos',items:['Revisión acordada'],limit:'Alcance limitado'},{name:'Integral',price:19900,hours:'16 horas',items:['Web y contenido'],limit:'Sin trabajo ilimitado'}];
 const window={EDA_ESSENTIAL:{plans,selectPlan(){},close(){}},EDA_CINEMA:{skip(){}},EDA_V4:{clearFocus(){}},EDA_SITE_CONFIG:{checkout:{Inicio:{stripe:''},Integral:{stripe:'https://buy.stripe.com/example'}}}};
 const context={document,window,matchMedia:()=>media,URL,URLSearchParams,location:{search:''},MutationObserver:class{observe(){}},setInterval:f=>{timer=f;return 1;},clearInterval(){},console};
 vm.runInNewContext(source,context);timer();
 const root=document.querySelector('#touch-guide');assert(!root.hidden);assert.equal(root.querySelectorAll('nav button').length,5);assert.equal(paused,1);
 // Simulate the 3D surfaces initializing after the guide has mounted the form.
 const originalForm=document.querySelector('#studio-form'),oldBrief=document.querySelector('#brief-world-hologram');
 document.querySelector('#scene-container').appendChild(originalForm);oldBrief.remove();
 window.EDA_TOUCH.show('diagnostico');window.EDA_TOUCH.show('servicios');assert(originalForm.hidden);
 const lateBrief=document.createElement('div');lateBrief.id='brief-world-hologram';lateBrief.appendChild(originalForm);document.querySelector('#scene-container').appendChild(lateBrief);
 window.EDA_TOUCH.show('diagnostico');assert(!originalForm.hidden);
 window.EDA_TOUCH.show('membresias');assert(root.textContent.includes('$916.40'));assert(root.querySelector('.touch-primary').disabled);assert.equal(document.querySelectorAll('#studio-form').length,1);
 root.querySelector('[data-plan="1"]').dispatchEvent(new dom.Event('click',{bubbles:true}));assert(root.textContent.includes('$23,084.00'));assert.equal(root.querySelector('.touch-primary').href,'https://buy.stripe.com/example');
 window.EDA_TOUCH.show('diagnostico');assert(root.querySelector('#brief-world-hologram').classList.contains('is-visible'));assert.equal(root.querySelector('input').value,'original@example.com');
 root.querySelector('#touch-explore').onclick();assert(!window.EDA_TOUCH.active);assert(root.hidden);assert.equal(played,1);assert(!document.querySelector('#touch-look').hidden);
 document.querySelector('[data-turn="1"]').onclick();assert.equal(cam.components['look-controls'].yawObject.rotation.y,Math.PI/4);
 document.querySelector('#touch-return').onclick();assert(window.EDA_TOUCH.active);assert(!root.hidden);
 media.matches=false;media.change();assert(root.hidden);assert.equal(document.querySelector('#brief-world-hologram').parentElement.id,'scene-container');
 media.matches=true;media.change();vr=true;scene.dispatchEvent(new dom.Event('enter-vr'));assert(!window.EDA_TOUCH.active);assert(root.hidden);
 console.log('PASS guided navigation, prices, form reuse, optional 3D, return and VR exclusion');
}
