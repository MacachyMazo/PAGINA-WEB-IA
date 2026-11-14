/* Actual world-space VR navigation. HTML forms stay in the browser. */
(function deviceExperience(){
 const scene=document.querySelector('#office-scene');
 const cameraEl=document.querySelector('#player-camera');
 if(!scene)return;
 let menu,entries=[],immersive=false,savedRotation=0;
 const controllers=new Set();
 const camera=()=>cameraEl.getObject3D('camera');
 function visible(value){
  if(!menu)return;
  menu.setAttribute('visible',value);
  entries.forEach(el=>el.classList.toggle('interactive-object',value));
 }
 function place(){
  if(!immersive||!camera()||!menu)return;
  const T=AFRAME.THREE,head=camera().getWorldPosition(new T.Vector3());
  const forward=new T.Vector3(0,0,-1).applyQuaternion(camera().getWorldQuaternion(new T.Quaternion()));
  forward.y=0;forward.normalize();
  menu.object3D.position.copy(head).addScaledVector(forward,1.7);
  menu.object3D.position.y=Math.max(1,head.y)-.12;
  menu.object3D.lookAt(head);visible(true);
 }
 async function browser(station){
  if(scene.is('vr-mode')){
   try{await scene.exitVR();}catch(error){console.warn('No se pudo salir del visor',error);return;}
  }
  if(station){window.EDA_ESSENTIAL?.show(station);if(station==='diagnostico')window.EDA_ESSENTIAL?.interact(station);}
 }
 window.EDA_DEVICE={browser,menu:place};
 function gaze(){
  const enabled=immersive&&controllers.size===0;
  const el=document.querySelector('#gaze-cursor');
  el.setAttribute('visible',enabled);el.setAttribute('raycaster','enabled',enabled);
 }
 function build(){
  if(menu)return;
  const T=AFRAME.THREE;
  menu=document.createElement('a-entity');menu.id='vr-station-navigation';scene.appendChild(menu);
  function button(label,y,action){
   const parent=menu;
   const el=document.createElement('a-plane');
   el.setAttribute('width',1.2);el.setAttribute('height',.145);el.setAttribute('position',`0 ${y} 0`);
   el.setAttribute('material','shader:flat;transparent:true;opacity:0;depthWrite:false');menu.appendChild(el);
   const can=document.createElement('canvas');can.width=1024;can.height=124;
   const ctx=can.getContext('2d');ctx.fillStyle='#062736';ctx.fillRect(0,0,1024,124);
   ctx.strokeStyle='#71e8ee';ctx.lineWidth=3;ctx.strokeRect(2,2,1020,120);
   ctx.font='500 36px Arial';ctx.fillStyle='#e8fdff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(label,512,62);
   const mesh=new T.Mesh(new T.PlaneGeometry(1.2,.145),new T.MeshBasicMaterial({map:new T.CanvasTexture(can),transparent:true,depthTest:false,depthWrite:false,toneMapped:false}));
   mesh.renderOrder=80;el.setObject3D('label',mesh);
   el.addEventListener('click',event=>{event.stopPropagation();if(!immersive||!parent.object3D.visible)return;action();});entries.push(el);
  }
  const stations=[['Servicios','servicios'],['Portafolio','portafolio'],['Membresías','membresias'],['Discord · volver al navegador','discord'],['Tu proyecto · volver al navegador','diagnostico']];
  stations.forEach(([label,id],i)=>button(label,.55-i*.18,()=>{
   visible(false);
   if(id==='discord'||id==='diagnostico'){browser(id);return;}
   window.EDA_ESSENTIAL?.show(id);
  }));
  button('Continuar · cerrar menú',-.35,()=>visible(false));
  button('Salir de VR',-.53,()=>browser());visible(false);
  // A small look-down control remains available without physical controllers.
  const shortcut=document.createElement('a-entity');cameraEl.appendChild(shortcut);
  const old=menu;menu=shortcut;button('Estaciones',0,place);menu=old;
  shortcut.object3D.position.set(0,-.8,-1.7);shortcut.setAttribute('visible',false);
  const shortcutButton=entries.pop();
  for(const id of ['vr-left','vr-right']){
   const el=document.getElementById(id);
   el.addEventListener('controllerconnected',()=>{controllers.add(id);gaze();});
   el.addEventListener('controllerdisconnected',()=>{controllers.delete(id);gaze();});
   el.addEventListener('gripdown',place);
  }
  scene.addEventListener('enter-vr',()=>{
   immersive=true;document.body.classList.add('eda-immersive');window.EDA_CINEMA?.skip?.();
   savedRotation=document.querySelector('#player-rig').object3D.rotation.y;
   cameraEl.setAttribute('raycaster','enabled',false);gaze();
   shortcut.setAttribute('visible',true);shortcutButton.classList.add('interactive-object');place();
  });
  scene.addEventListener('exit-vr',()=>{
   immersive=false;document.body.classList.remove('eda-immersive');visible(false);
   shortcut.setAttribute('visible',false);shortcutButton.classList.remove('interactive-object');
   document.querySelector('#player-rig').object3D.rotation.y=savedRotation;
   cameraEl.setAttribute('raycaster','enabled',true);gaze();
  });
 }
 if(scene.hasLoaded)build();else scene.addEventListener('loaded',build,{once:true});
 // Resize with orientation/browser chrome changes, without touching XR projection.
 let resizeFrame=0;
 const resize=()=>{cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(()=>{if(!scene.is('vr-mode'))scene.resize?.();});};
 new ResizeObserver(resize).observe(document.querySelector('#scene-container'));
 window.visualViewport?.addEventListener('resize',resize);
})();
