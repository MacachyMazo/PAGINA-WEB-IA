
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
  servicios: {target:[-4.3,1.52,-.64],anchor:[-3.62,1.88,-.10],color:'#6de7e9',label:'ZONA CREATIVA'},
  portafolio:{target:[0,1.56,-4.85],anchor:[1.14,1.91,-3.19],color:'#b5c0ff',label:'PORTAFOLIO'},
  membresias:{target:[4.10,1.8,-4.26],anchor:[2.85,1.90,-2.86],color:'#cbbaff',label:'MEMBRESÍAS'},
  diagnostico:{target:[2.95,1.77,3.67],anchor:[1.77,1.88,3.10],color:'#9ef0d3',label:'DIAGNÓSTICO'}
};
const activePlans=[
  {name:'Inicio',price:'$790',time:'30 MIN',detail:'Microtarea y seguimiento escrito'},
  {name:'Impulso',price:'$1,990',time:'1.5 H',detail:'Ajustes web o pieza creativa breve'},
  {name:'Presencia',price:'$4,990',time:'4 H',detail:'Diseño, contenido, UX o SEO'},
  {name:'Evolución',price:'$10,900',time:'9 H',detail:'Mejoras web y automatizaciones por fases'},
  {name:'Integral',price:'$19,900',time:'16 H',detail:'Web, contenido y producto por fases'}
];
let initDone=false,focused=null,lastFacing=null,lookSince=0,releaseAt=0,holdUntil=0,currentPlan=3,lastRender='',prevFrame=0;
const canvases={},materials={},entities={};
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
function draw(id) {
 const can=canvases[id],cx=can.getContext('2d'),W=1024,H=1072;
 cx.clearRect(0,0,W,H);
 const g=cx.createLinearGradient(0,0,1024,1072);
 g.addColorStop(0,'rgba(8,28,43,.97)');g.addColorStop(.65,'rgba(5,19,32,.96)');g.addColorStop(1,'rgba(11,31,42,.95)');
 cx.fillStyle=g;cx.fillRect(0,0,W,H);
 cx.strokeStyle='rgba(123,235,245,.35)';cx.lineWidth=4;cx.strokeRect(16,16,W-32,H-32);
 for(let y=70;y<1060;y+=34){cx.fillStyle='rgba(124,214,238,.023)';cx.fillRect(22,y,980,1)}
 cx.fillStyle=destinations[id].color;cx.fillRect(52,66,67,6);
 ctxText(cx,'ESTUDIO DE AUTOR     /     EXPERIENCIA ESPACIAL',52,115,'#b4d6e1','bold 22px Arial');
 ctxText(cx,destinations[id].label,52,190,'#f9fafd','bold 67px Arial');
 cx.fillStyle='rgba(170,221,237,.22)';cx.fillRect(52,216,920,2);
 let y=270;
 const small=(s,yOff=0)=>ctxText(cx,s,55,y+yOff,'#bdd1d9','25px Arial');
 const title=(s,yOff=0)=>ctxText(cx,s,55,y+yOff,'#9de7ef','bold 31px Arial');
 const item=(name,desc)=>{
   ctxText(cx,name,55,y,'#f4f7fa','bold 31px Arial');y+=39;
   cx.font='24px Arial';cx.fillStyle='#b7cbd3';y=wrap(cx,desc,55,y,897,33,3)+29;
 };
 if(id==='servicios'){
   title('UN ESTUDIO. MUCHAS FORMAS DE CREAR.'); y+=65;
   item('WEB & PRODUCTO','WordPress, landing pages, tiendas sencillas, UX/UI y prototipos de aplicaciones web.');
   item('DISEÑO & CONTENIDO','Identidad visual, creatividades para redes, imágenes y presentaciones con Canva e IA.');
   item('VIDEO & COMUNICACIÓN','Guiones, edición con Filmora, contenidos cortos y narrativa comercial.');
   item('CRECIMIENTO & TECNOLOGÍA','SEO, embudos, automatizaciones viables e ideas Web3 evaluadas por etapas.');
 } else if(id==='portafolio'){
   title('TRES PROYECTOS REALES DEL ESTUDIO.');y+=69;
   item('PEEKDEX / COMUNIDAD DIGITAL','Plataforma conceptual para coleccionistas de cartas, contenidos y comercio digital por etapas.');
   item('IQ-BITES / MARCA Y COMERCIO','Identidad, catálogo, comunicación y experiencia de compra de una marca de snacks.');
   item('GUBE / SERVICIO LOCAL','Presencia web y herramientas para clientes de un estacionamiento; autofacturación en desarrollo.');
   ctxText(cx,'PROYECTOS PROPIOS  /  FUNCIONES EN EVOLUCIÓN',55,960,'#83bfcc','bold 22px Arial');
 } else if(id==='membresias'){
   title('CINCO NIVELES. HORAS CLARAS.');y+=50;
   for(let i=0;i<activePlans.length;i++){
     const plan=activePlans[i],active=i===currentPlan;
     cx.fillStyle=active?'rgba(117,219,230,.2)':'rgba(255,255,255,.045)';
     cx.fillRect(49,y-27,928,102);
     if(active){cx.fillStyle='#79e6f1';cx.fillRect(49,y-27,7,102)}
     ctxText(cx,'0'+(i+1)+'  '+plan.name,74,y+18,active?'#f9ffff':'#cedee4','bold 32px Arial');
     ctxText(cx,plan.price,744,y+18,active?'#b5f9ff':'#f3e1c9','bold 33px Arial');
     ctxText(cx,plan.time+' / MES',74,y+52,'#9fc0cb','22px Arial');
     y+=120;
   }
   ctxText(cx,'SELECCIÓN: '+activePlans[currentPlan].name.toUpperCase(),55,934,'#a6f0f3','bold 27px Arial');
   ctxText(cx,'TECLAS 1–5: COMPARAR   •   E: DIAGNÓSTICO',55,994,'#dbe8ed','23px Arial');
 } else if(id==='diagnostico'){
   title('CUÉNTANOS QUÉ QUIERES CONSTRUIR.');y+=77;
   item('01 / TU IDEA','Cuéntanos el problema que necesitas resolver, sin tecnicismos.');
   item('02 / DIAGNÓSTICO','Revisamos el alcance y si el proyecto cabe en la agenda.');
   item('03 / PROPUESTA','Recibes una recomendación de plan y horas antes de pagar.');
   ctxText(cx,'PULSA E PARA ABRIR EL FORMULARIO',55,840,'#a3f2e0','bold 30px Arial');
   ctxText(cx,'SIN COBROS AUTOMÁTICOS EN LA DEMO',55,936,'#b6d0d4','23px Arial');
 }
 // Deliberately no fake ROI claims or unlimited-service promises.
 ctxText(cx,'ASISTENCIA PERSONAL  /  SERVICIOS POR SUSCRIPCIÓN',55,1038,'#74a9b7','20px Arial');
 const tex=materials[id].map;
 tex.needsUpdate=true;
}
function createHologram(id) {
 const c=document.createElement('canvas');c.width=1024;c.height=1072;canvases[id]=c;
 const tx=new THREE.CanvasTexture(c);
 tx.colorSpace=THREE.SRGBColorSpace;tx.anisotropy=4;
 const mat=new THREE.MeshBasicMaterial({map:tx,transparent:true,opacity:0,side:THREE.DoubleSide,depthWrite:false,depthTest:false,toneMapped:false});
 const obj=new THREE.Mesh(new THREE.PlaneGeometry(2.65,2.77),mat);
 obj.position.set(...destinations[id].anchor);obj.scale.set(.87,.87,1);
 obj.visible=false;scene.object3D.add(obj);
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
 draw('membresias');
}
function chooseFocus(id,hold=false){
 if(!destinations[id])return;
 focused=id;lastFacing=id;lookSince=performance.now()-400;
 if(hold)holdUntil=performance.now()+4800;
 const rigPos=rig?.object3D?.position;
 // Direct links bring the visitor close enough to read, rather than opening a sidebar.
 const stands={
  servicios:[-2.8,0,1.55],portafolio:[.35,0,-1.25],
  membresias:[2.30,0,-1.12],diagnostico:[.3,0,4.42]
 };
 if(rigPos)rigPos.set(...stands[id]);
 const look=destinations[id].target;
 const object=worldCamera();
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
 if(candidate&&now-lookSince>160)focused=candidate;
 if(!candidate && now>holdUntil && now-lookSince>330)focused=null;
 const blocked=document.querySelector('#detail-panel')?.classList.contains('open');
 for(const [id,x] of Object.entries(entities)){
   const target=focused===id&&!blocked?1:0;
   const mat=materials[id],mesh=x.mesh;
   const prev=mat.opacity;
   mat.opacity+=(target*.93-mat.opacity)*.18;
   x.outline.material.opacity=mat.opacity*.9;
   mesh.visible=mat.opacity>.014;
   const scale=.88+(mat.opacity/.93)*.12;
   mesh.scale.set(scale,scale,1);
   if(mesh.visible)mesh.lookAt(pos);
 }
 const hints=document.querySelector('#status-help');
 if(hints&&focused&&!blocked){
   hints.textContent=focused==='membresias'?'Mira las membresías. Pulsa 1–5 para comparar; E para diagnóstico.':
     focused==='diagnostico'?'Mesa de reuniones: pulsa E para solicitar diagnóstico.':
     'Estás consultando '+destinations[focused].label.toLowerCase()+' mediante un holograma.';
 }
}
function init(){
 if(initDone||!scene?.object3D||!cameraEl?.object3D)return;
 initDone=true;
 for(const id of Object.keys(destinations))createHologram(id);
 document.addEventListener('keydown',e=>{
   if(e.altKey||e.ctrlKey||e.metaKey||/^(INPUT|TEXTAREA|SELECT)$/.test(e.target?.tagName||''))return;
   const i=Number(e.key)-1;
   if(focused==='membresias'&&e.key>='1'&&e.key<='5')setPlan(i);
   if(e.key.toLowerCase()==='e'&&focused==='diagnostico'){
     window.EDA_V4.openBrief?.();
   }
 });
 requestAnimationFrame(gazeTick);
}
window.EDA_V4={
 focus:chooseFocus,
 setPlan,
 get active(){return focused},
 openBrief(){
   const trigger=document.querySelector('button[data-screen="diagnostico"]');
   if(trigger)trigger.click();
 }
};
if(scene?.hasLoaded)init();
else scene?.addEventListener('loaded',init,{once:true});
