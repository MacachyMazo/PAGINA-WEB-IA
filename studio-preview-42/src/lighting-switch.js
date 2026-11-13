(function installPhysicalLights(){
 "use strict";
 const scene=document.querySelector('#office-scene'),furn=document.querySelector('#office-furniture');
 const camera=document.querySelector('#player-camera'),hud=document.querySelector('#soundless');
 if(!scene||!furn||!camera)return;
 let initialized=false,isOn=true,deskOn=true,animation=0;
 const switches=[];
 function init(){
  if(initialized||!furn.object3D?.userData.v4Built||!window.AFRAME?.THREE)return;
  initialized=true;
  const T=AFRAME.THREE,root=furn.object3D;
  const full=[],lighting=[];
  const getLights=()=>{
   for(const el of scene.querySelectorAll('[light]')){
    const obj=el.getObject3D?.('light')||el.components?.light?.light;
    const attr=el.getAttribute('light');
    if(obj&&typeof obj.intensity==='number' && attr?.type){
     full.push({obj,initial:obj.intensity,type:attr.type});
    }
   }
  };
  getLights();
  const mat=(c,metal=0.5,rough=0.4)=>new T.MeshStandardMaterial({color:c,metalness:metal,roughness:rough});
  const metal=mat('#2d3944',.86,.28),shell=mat('#697987',.83,.27);
  const plate=(x,y,z,w,h,d,m)=>{
   const mesh=new T.Mesh(new T.BoxGeometry(w,h,d),m);
   mesh.position.set(x,y,z);root.add(mesh);return mesh;
  };
  // Flush wall switch in the left entrance wall. The room's inner surface
  // is x=-6.17; backing is partially inset, with <10 cm of visible hardware.
  // No floating signs or detached console in the room.
  const wallX=-6.13,wallZ=4.42;
  const graphite=mat('#202c34',.78,.56);
  const brushed=mat('#69777c',.86,.32);
  plate(wallX,1.46,wallZ,.09,.30,.19,graphite);
  plate(-6.075,1.46,wallZ,.018,.267,.166,brushed);
  const switchLever=plate(-6.04,1.45,wallZ,.058,.092,.037,graphite);
  // A tiny flush label, etched on the switch itself.
  const labelCanvas=document.createElement('canvas');
  labelCanvas.width=256;labelCanvas.height=128;
  const labelCtx=labelCanvas.getContext('2d');
  labelCtx.clearRect(0,0,256,128);
  labelCtx.textAlign='center';labelCtx.fillStyle='#c2d1d5';
  labelCtx.font='bold 49px Arial';labelCtx.fillText('LUZ',128,83);
  const labelTexture=new T.CanvasTexture(labelCanvas);
  labelTexture.colorSpace=T.SRGBColorSpace;
  const label=new T.Mesh(new T.PlaneGeometry(.126,.063),
    new T.MeshBasicMaterial({map:labelTexture,transparent:true,depthWrite:false}));
  label.rotation.y=Math.PI/2;
  label.position.set(-6.059,1.364,wallZ);
  root.add(label);
  const indicatorMaterial=new T.MeshBasicMaterial({color:'#70c3ab'});
  const indicator=new T.Mesh(new T.SphereGeometry(.011,12,10),indicatorMaterial);
  indicator.position.set(-6.053,1.558,wallZ);
  root.add(indicator);
  // Emergency luminaire is also physically mounted to the same wall.
  const emergency=new T.PointLight('#d77c58',0,5,2);
  emergency.position.set(-5.97,2.63,wallZ);root.add(emergency);
  const glow=new T.Mesh(new T.BoxGeometry(.032,.045,.20),
    new T.MeshBasicMaterial({color:'#252327'}));
  glow.position.set(-6.074,2.63,wallZ);root.add(glow);
  const deskLight=new T.PointLight('#ffdeb7',1.6,3.5,2);
  deskLight.position.set(1.21,1.55,-3.73);root.add(deskLight);
  const bulb=new T.Mesh(new T.SphereGeometry(.095,14,11),new T.MeshBasicMaterial({color:'#ffe4b4'}));
  bulb.position.set(1.21,1.46,-3.73);root.add(bulb);
  plate(1.20,.95,-3.72,.20,.15,.23,metal);
  plate(1.20,1.20,-3.73,.035,.42,.035,shell);
  const deskButton=plate(1.32,.955,-3.70,.075,.025,.075,mat('#ad9fa0',.25,.35));
  function addTarget(x,y,z,w,h,type,label){
   const e=document.createElement('a-box');
   e.classList.add('interactive-object');
   e.setAttribute('position',`${x} ${y} ${z}`);
   e.setAttribute('width',String(w));e.setAttribute('height',String(h));e.setAttribute('depth','.14');
   e.setAttribute('material','color:#f9fdff;opacity:0.001;transparent:true;depthWrite:false');
   e.setAttribute('aria-label',label);
   e.addEventListener('click',(event)=>{event.stopPropagation();type==='main'?toggleMain():toggleDesk()});
   furn.appendChild(e);
   switches.push({pos:new T.Vector3(x,y,z),type});
  }
  addTarget(-6.003,1.46,4.42,.14,.29,'main','Apagador empotrado en la pared');
  addTarget(1.32,1.01,-3.70,.18,.14,'desk','Lámpara de escritorio');
  function status(message){
   const el=document.querySelector('#status-help');
   if(el)el.textContent=message;
  }
  function apply(on,immediate=false){
   cancelAnimationFrame(animation);
   const old=full.map(x=>x.obj.intensity);
   const emergencyBefore=emergency.intensity;
   const exposureBefore=scene.renderer?.toneMappingExposure??1.35;
   const start=performance.now(),duration=immediate?0:650;
   function tick(time){
    const progress=duration?Math.min(1,(time-start)/duration):1;
    const f=progress*progress*(3-2*progress);
    full.forEach((x,i)=>{
     const low=x.type==='ambient'?.085:0.012;
     x.obj.intensity=old[i]+((on?x.initial:low)-old[i])*f;
    });
    emergency.intensity=emergencyBefore+((on?0:1.12)-emergencyBefore)*f;
    if(scene.renderer)scene.renderer.toneMappingExposure=exposureBefore+((on?1.35:.88)-exposureBefore)*f;
    if(progress<1)animation=requestAnimationFrame(tick);
   }
   if(!duration)tick(start);else animation=requestAnimationFrame(tick);
   indicatorMaterial.color.set(on?'#70c3ab':'#c27f72');
   glow.material.color.set(on?'#252327':'#b86053');
   switchLever.rotation.z=on?-.25:.25;
   if(hud){
    hud.innerHTML=on?'☼ <span>Luces</span>':'◑ <span>Luces</span>';
    hud.title=on?'Apagar luces (L)':'Encender luces (L)';
    hud.setAttribute('aria-pressed',String(on));
    hud.setAttribute('aria-label',on?'Apagar luces de la oficina':'Encender luces de la oficina');
   }
  }
  function toggleMain(){
   window.EDA_SFX?.play('light');
   isOn=!isOn;
   apply(isOn);
   status(isOn?'Luces de la oficina encendidas.':'Luces apagadas: iluminación de emergencia activa. Pulsa L para encenderlas.');
   window.EDA_LIGHTS.state=isOn;
  }
  function toggleDesk(){
   window.EDA_SFX?.play('light');
   deskOn=!deskOn;
   deskLight.intensity=deskOn?1.6:0;
   bulb.material.color.set(deskOn?'#ffe4b4':'#3a3c3e');
   deskButton.material.color.set(deskOn?'#a0e2f0':'#bcb1b1');
   status(deskOn?'Lámpara de escritorio encendida.':'Lámpara de escritorio apagada.');
  }
  window.EDA_LIGHTS={state:true,toggle:toggleMain,toggleDesk};
  function targetFromView(){
   const cam=camera.getObject3D('camera')||camera.object3D;
   if(!cam)return null;
   const position=new T.Vector3(),quaternion=new T.Quaternion();
   cam.getWorldPosition(position);cam.getWorldQuaternion(quaternion);
   const direction=new T.Vector3(0,0,-1).applyQuaternion(quaternion);
   let target=null,best=.93;
   for(const s of switches){
    const to=s.pos.clone().sub(position),dist=to.length();
    const dot=direction.dot(to.divideScalar(dist));
    if(dist<3.6&&dot>best){target=s.type;best=dot}
   }
   return target;
  }
  // Capture E only when actually looking at a switch; other E interactions remain intact.
  document.addEventListener('keydown',e=>{
   if(e.repeat||e.ctrlKey||e.altKey||e.metaKey||/INPUT|TEXTAREA|SELECT/.test(e.target?.tagName||''))return;
   const k=e.key.toLowerCase();
   if(k==='l'){e.preventDefault();e.stopImmediatePropagation();toggleMain()}
   else if(k==='e'){
    const target=targetFromView();
    if(target){e.preventDefault();e.stopImmediatePropagation();target==='main'?toggleMain():toggleDesk()}
   }
  },true);
  apply(true,true);
 }
 function wait(){if(initialized)return;if(furn.object3D?.userData.v4Built)init();else requestAnimationFrame(wait)}
 if(scene.hasLoaded)wait();else scene.addEventListener('loaded',wait,{once:true});
})();