
/* Estudio de Autor: holographic information in world space.
   Holograms react to the direction of the visitor's actual 3D camera;
   there are no sidebar panels for viewing services, work or memberships. */
const THREE=window.AFRAME?.THREE;
const app=document.querySelector('#studio-app');
const cameraEl=document.querySelector('#player-camera');
const rig=document.querySelector('#player-rig');
const scene=document.querySelector('#office-scene');
const content=document.querySelector('#detail-panel');
const destinations={
 servicios:{target:[-4.65,1.9,-1.5],anchor:[-4.65,1.9,-1.5],color:'#6de7e9',label:'ZONA CREATIVA'},
 portafolio:{target:[0,2.3,-5.0],anchor:[0,2.3,-5.0],color:'#b5c0ff',label:'PORTAFOLIO'},
 membresias:{target:[4.65,1.9,-1.5],anchor:[4.65,1.9,-1.5],color:'#cbbaff',label:'MEMBRESÍAS'},
 diagnostico:{target:[3.5,1.9,4.4],anchor:[3.5,1.9,4.4],color:'#9ef0d3',label:'DIAGNÓSTICO'},
 discord:{target:[-4.65,1.9,4.4],anchor:[-4.65,1.9,4.4],color:'#a3a8ff',label:'DISCORD / COMUNIDAD'}
};
const activePlans=[
  {name:'Inicio',price:'$790',time:'30 MIN',detail:'Microtarea y seguimiento escrito'},
  {name:'Impulso',price:'$1,990',time:'1.5 H',detail:'Ajustes web o pieza creativa breve'},
  {name:'Presencia',price:'$4,990',time:'4 H',detail:'Diseño, contenido, UX o SEO'},
  {name:'Evolución',price:'$10,900',time:'9 H',detail:'Mejoras web y automatizaciones por fases'},
  {name:'Integral',price:'$19,900',time:'16 H',detail:'Web, contenido y producto por fases'}
];
let initDone=false,focused=null,lastFacing=null,lookSince=0,releaseAt=0,holdUntil=0,currentPlan=3,lastRender='',prevFrame=0,pinned=null;
const canvases={},materials={},entities={};
let pendingFocus=null;
const worldCamera=()=>cameraEl?.getObject3D('camera')||cameraEl?.object3D;
const ctxText=(ctx,str,x,y,color='#f6f9fd',font='26px Arial')=>{
 ctx.font=font;ctx.fillStyle=color;ctx.fillText(str,x,y);
};
const wrap=(ctx,value,x,y,maxW,lh=38,maxLines=6)=>{
 let line='',lines=0;
 for(const word of value.split(/\s+/)){
   const next=line?line+' '+word:word;
   if(ctx.measureText(next).width>maxW && line){
      ctx.fillText(line,x,y);y+=lh;lines++;line=word;
      if(lines>=maxLines)return y;
   }else line=next;
 }
 if(line)ctx.fillText(line,x,y);
 return y+lh;
};
// One typography scale and one reading distance for every information surface.
window.EDA_HOLO = {
  scale(position, camera, height=2.46, width=2.35) {
    // In a headset use metres, never the mirrored desktop viewport.
    if(scene.is('vr-mode')) return 1;
    const bounds=document.querySelector('#scene-container').getBoundingClientRect();
    const v=position.clone().applyMatrix4(camera.matrixWorldInverse);
    const depth=Math.max(.5,-v.z);
    const pixels=Math.min(Math.max(120,bounds.height-150), bounds.height*.76, (bounds.width-32)*height/width, 900);
    return Math.max(.25,Math.min(4,pixels*2*depth/(bounds.height*camera.projectionMatrix.elements[5]*height)));
  }
};
function draw(id) {
 const can=canvases[id],cx=can.getContext('2d'),W=1024,H=1072;
 cx.clearRect(0,0,W,H);
 window.EDA_HOLO_STYLE.paint(cx,W,H);
 cx.fillStyle='#8de7eb';cx.fillRect(56,44,72,4);
 ctxText(cx,'ESTUDIO DE AUTOR',56,96,'#9cbcc8','600 24px Arial');
 const headings={servicios:'Ideas que toman forma',portafolio:'Proyectos del estudio',membresias:'Elige tu membresía',discord:'Conversemos',diagnostico:'Tu próximo proyecto'};
 ctxText(cx,headings[id],56,177,'#f1fbff','600 54px Arial');
 const subtitles={servicios:'Diseño, tecnología y contenido a tu medida.',portafolio:'Tres marcas. Tres maneras de crear.',membresias:'Tiempo dedicado a tus ideas. Precios en MXN / mes.',discord:'Un espacio para conectar y trabajar juntos.',diagnostico:'Primero entendemos tu idea. Después, el plan.'};
 ctxText(cx,subtitles[id],56,231,'#bed3dc','30px Arial');
 cx.fillStyle='#8de7eb40';cx.fillRect(56,263,912,1);
 let y=324;
 const item=(name,desc,index)=>{
   ctxText(cx,String(index).padStart(2,'0'),56,y,'#7cbdc7','26px Arial');
   ctxText(cx,name,116,y,'#eef9fc','600 34px Arial');
   cx.font='32px Arial';cx.fillStyle='#c1d6df';
   wrap(cx,desc,116,y+48,850,43,2);
   y+=154;
 };
 if(id==='servicios'){
   item('Web y producto','Páginas, tiendas, UX/UI y prototipos para dar el siguiente paso.',1);
   item('Diseño y contenido','Identidad, redes sociales, imágenes y presentaciones.',2);
   item('Video y comunicación','Guiones, edición y contenido breve con intención comercial.',3);
   item('Crecimiento y tecnología','SEO, embudos y automatizaciones evaluadas por etapas.',4);
 }else if(id==='membresias'){
   for(let i=0;i<activePlans.length;i++){
     const p=activePlans[i],on=i===currentPlan,top=294+i*110;
     cx.fillStyle=on?'#73dce820':'#ffffff06';cx.fillRect(56,top,912,96);
     if(on){cx.fillStyle='#91e9ed';cx.fillRect(56,top,3,96);}
     ctxText(cx,'0'+(i+1),78,top+41,'#8cc8d1','26px Arial');
     ctxText(cx,p.name,144,top+41,'#f1fbff','600 34px Arial');
     ctxText(cx,p.time+' de trabajo',144,top+76,'#bdd2da','26px Arial');
     cx.textAlign='right';ctxText(cx,p.price,940,top+49,'#cef5ef','600 34px Arial');cx.textAlign='left';
   }
 }else if(id==='diagnostico'){
   item('Cuéntanos tu idea','Qué necesitas resolver y dónde quieres llegar.',1);
   item('Revisamos el alcance','Evaluamos prioridades, viabilidad y disponibilidad.',2);
   item('Recibe una propuesta','Acordamos el plan y las horas antes de pagar.',3);
   ctxText(cx,'Sin cobros automáticos al enviar tu consulta.',116,841,'#a8c7d2','28px Arial');
 }else if(id==='discord'){
   item('Canal de texto','Conversación y seguimiento dentro de Discord.',1);
   item('Voz por cita','Reuniones según el alcance de tu membresía.',2);
 }else{
   item('PeekDex','Comunidad digital para coleccionistas.',1);
   item('IQ-Bites','Identidad y comercio para una marca de snacks.',2);
   item('GUBE','Presencia digital para un servicio local.',3);
 }
 materials[id].map.needsUpdate=true;
}
function createHologram(id) {
 const c=document.createElement('canvas');c.width=1024;c.height=1072;canvases[id]=c;
 const tx=new THREE.CanvasTexture(c);
 tx.colorSpace=THREE.SRGBColorSpace;tx.anisotropy=4;
 const mat=new THREE.MeshBasicMaterial({map:tx,transparent:true,opacity:0,side:THREE.DoubleSide,depthWrite:false,depthTest:false,toneMapped:false});
 const obj=new THREE.Mesh(new THREE.PlaneGeometry(2.35,2.46),mat);
 obj.position.set(...destinations[id].anchor);obj.scale.set(.87,.87,1);
 window.EDA_HOLO_STYLE.decorate(obj);
 obj.visible=false;obj.renderOrder=50;scene.object3D.add(obj);
 const lineMat=new THREE.LineBasicMaterial({color:new THREE.Color(destinations[id].color),transparent:true,opacity:.0,depthWrite:false});
 const outline=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(2.71,2.83)),lineMat);
 obj.add(outline);
 materials[id]=mat;entities[id]={mesh:obj,outline};
 draw(id);
}
function setPlan(i){
 if(!Number.isInteger(i)||i<0||i>=activePlans.length)return;
 currentPlan=i;
 document.querySelectorAll('[data-plan]').forEach((node,j)=>node.classList.toggle('selected',j===i));
 const planSelect=document.querySelector('#form-plan');
 if(planSelect)planSelect.value=activePlans[i].name;
 if(materials.membresias)draw('membresias');
}
function chooseFocus(id,hold=false){
 if(!destinations[id])return;
 if(!initDone){pendingFocus={id,hold};return;}
 focused=id;lastFacing=id;lookSince=performance.now()-400;
 pinned=hold?id:null;
 holdUntil=hold?performance.now()+650:0;
 releaseAt=0;
 const rigPos=rig?.object3D?.position;
 // Direct links bring the visitor close enough to read, rather than opening a sidebar.
 const stands={
  servicios:[-1.25,0,-.6],portafolio:[0,0,-1.25],
  membresias:[.1,0,-1.5],diagnostico:[.2,0,4.4],discord:[-1.25,0,4.4]
 };
 if(rigPos)rigPos.set(...stands[id]);
 const look=destinations[id].target;
 const object=worldCamera();
 if(object && scene.is('vr-mode')){
   // Rotate the rig, not the tracked head; retain the visitor's physical pose.
   rig.object3D.updateMatrixWorld(true);
   const head=object.getWorldPosition(new THREE.Vector3());
   const forward=new THREE.Vector3(0,0,-1).applyQuaternion(object.getWorldQuaternion(new THREE.Quaternion()));
   const desired=-Math.atan2(look[0]-head.x,-(look[2]-head.z));
   const current=-Math.atan2(forward.x,-forward.z);
   rig.object3D.rotation.y+=desired-current;
   rig.object3D.updateMatrixWorld(true);
 }
 if(object && !scene.is('vr-mode')){
   const start=new THREE.Vector3(rigPos.x,rigPos.y+1.64,rigPos.z);
   const dx=look[0]-start.x,dy=look[1]-start.y,dz=look[2]-start.z;
   const yaw=-Math.atan2(dx,-dz);
   const pitch=Math.atan2(dy,Math.hypot(dx,dz));
   const lc=cameraEl.components?.['look-controls'];
   if(lc?.yawObject)lc.yawObject.rotation.y=yaw;
   else cameraEl.object3D.rotation.y=yaw;
   if(lc?.pitchObject)lc.pitchObject.rotation.x=pitch;
 }
}
const distanceToTarget=(name,camPos,dir)=>{
 const tar=new THREE.Vector3(...destinations[name].target);
 const relative=tar.sub(camPos),len=relative.length();
 if(len>15||len<.3)return -1;
 relative.normalize();
 return dir.dot(relative);
};
function gazeTick(now){
 requestAnimationFrame(gazeTick);
 if(!initDone||now-prevFrame<60)return;prevFrame=now;
 if(window.EDA_TOUCH?.active){
   for(const entry of Object.values(entities))entry.mesh.visible=false;
   return;
 }
 const camObj=worldCamera();
 if(!camObj)return;
 const pos=new THREE.Vector3();const q=new THREE.Quaternion();
 camObj.getWorldPosition(pos);camObj.getWorldQuaternion(q);
 const dir=new THREE.Vector3(0,0,-1).applyQuaternion(q).normalize();
 let candidate=null,best=.89;
 for(const name of Object.keys(destinations)){
   const dot=distanceToTarget(name,pos,dir);
   if(dot>best){best=dot;candidate=name}
 }
 if(candidate!==lastFacing){lastFacing=candidate;lookSince=now}
 const uiHovered=!!document.querySelector('#eda-spatial-ui')?.matches(':hover');
 if(pinned&&now>holdUntil&&(distanceToTarget(pinned,pos,dir)<.7||(candidate&&candidate!==pinned&&now-lookSince>210)))pinned=null;
 if(candidate&&now>releaseAt&&now-lookSince>210&&!uiHovered&&!pinned)focused=candidate;
 if(pinned){focused=pinned;}
 else if(!candidate&&!uiHovered&&now-lookSince>820){focused=null;}
 const blocked=document.querySelector('#detail-panel')?.classList.contains('open');
 for(const [id,x] of Object.entries(entities)){
   const target=focused===id&&!blocked&&id!=='portafolio'&&!(id==='discord'&&window.EDA_DISCORD_WIDGET_READY&&!scene.is('vr-mode'))&&!(id==='diagnostico'&&window.EDA_BRIEF_OPEN&&!scene.is('vr-mode'))&&!(id==='membresias'&&window.EDA_MEMBERSHIP_EXPANDED)?1:0;
   const mat=materials[id],mesh=x.mesh;
   const prev=mat.opacity;
   mat.opacity+=(target*1-mat.opacity)*.18;
   x.outline.material.opacity=0;
   mesh.visible=mat.opacity>.014;
   const scale=window.EDA_HOLO.scale(mesh.position,camObj);
   mesh.scale.set(scale,scale,1);
   if(mesh.visible)mesh.lookAt(pos);
 }
 const hints=document.querySelector('#status-help');
 if(hints&&focused&&!blocked){
   hints.textContent=focused==='membresias'?'Membresías: elige 1–5 y pulsa E para ver beneficios y suscripción.':
     focused==='diagnostico'?'Diagnóstico: pulsa E para escribir tu proyecto en el holograma.':
     'Estás consultando '+destinations[focused].label.toLowerCase()+' mediante un holograma.';
 }
}
function init(){
 if(initDone||!scene?.object3D||!cameraEl?.object3D)return;
 initDone=true;
 for(const id of Object.keys(destinations))createHologram(id);
 if(pendingFocus){const next=pendingFocus;pendingFocus=null;chooseFocus(next.id,next.hold);}
 document.addEventListener('keydown',e=>{
   if(e.altKey||e.ctrlKey||e.metaKey||/^(INPUT|TEXTAREA|SELECT)$/.test(e.target?.tagName||''))return;
   const i=Number(e.key)-1;
   if(focused==='membresias'&&e.key>='1'&&e.key<='5')setPlan(i);
   if(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'].includes(e.key.toLowerCase()))pinned=null;
 });
 requestAnimationFrame(gazeTick);
}
function clearFocus(){pinned=null;focused=null;lastFacing=null;holdUntil=0;releaseAt=performance.now()+1200;}
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&!/^(INPUT|TEXTAREA|SELECT)$/.test(e.target?.tagName||''))clearFocus();
});
window.EDA_V4={
 focus:chooseFocus,
 get planIndex(){return currentPlan},
 clearFocus,
 setPlan,
 get active(){return focused},
 openBrief(){
   window.EDA_ESSENTIAL?.interact?.('diagnostico');
 }
};
if(scene?.hasLoaded)init();
else scene?.addEventListener('loaded',init,{once:true});
