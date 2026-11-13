(function setupMonitors(){
 "use strict";
 const scene=document.querySelector('#office-scene'),furn=document.querySelector('#office-furniture');
 if(!scene||!furn)return;
 let ready=false;
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const videoURL=window.EDA_SITE_CONFIG?.monitors?.videoUrl||'';
 function init(){
  if(ready||!furn.object3D?.userData.v4Built||!window.AFRAME?.THREE)return;
  ready=true;
  const T=window.AFRAME.THREE,root=furn.object3D,W=900,H=525;
  const canvases=[];
  function create(x){
   const can=document.createElement('canvas');can.width=W;can.height=H;
   const tx=new T.CanvasTexture(can);tx.colorSpace=T.SRGBColorSpace;tx.anisotropy=2;
   const face=new T.Mesh(new T.PlaneGeometry(.99,.61),new T.MeshBasicMaterial({map:tx,toneMapped:false,depthWrite:false}));
   face.position.set(x,1.53,-4.80);face.renderOrder=6;root.add(face);
   const o={can,ctx:can.getContext('2d'),tx,face};canvases.push(o);return o;
  }
  const film=create(-1.13),code=create(0),edit=create(1.13);
  const frame=(c,name)=>{
   const cx=c.ctx,g=cx.createLinearGradient(0,0,W,H);
   g.addColorStop(0,'#0a1b2c');g.addColorStop(1,'#102a39');
   cx.fillStyle=g;cx.fillRect(0,0,W,H);
   cx.fillStyle='#08121d';cx.fillRect(0,0,W,44);
   cx.fillStyle='#b5e4e8';cx.font='bold 20px monospace';cx.fillText('EA / STUDIO',20,29);
   cx.fillStyle='#f7e3d0';cx.fillText(name,535,29);
   cx.strokeStyle='#72cbd077';cx.strokeRect(12,54,W-24,H-66);
   return cx;
  };
  let video=null,vt=null,hasFilm=false;
  if(typeof videoURL==='string' && /^https:\/\//i.test(videoURL)){
   video=document.createElement('video');video.src=videoURL;video.loop=true;video.muted=true;
   video.playsInline=true;video.autoplay=true;video.preload='metadata';video.crossOrigin='anonymous';
   video.setAttribute('aria-hidden','true');video.style.display='none';
   document.body.appendChild(video);
   video.addEventListener('playing',()=>{
    if(hasFilm)return;
    vt=new T.VideoTexture(video);vt.colorSpace=T.SRGBColorSpace;
    film.face.material.map=vt;film.face.material.needsUpdate=true;hasFilm=true;
   });
   video.addEventListener('error',()=>{console.warn('[Monitores] No se pudo cargar el vídeo configurado. Se mantiene la pantalla de espera.');});
   video.play().catch(()=>{});
   document.addEventListener('visibilitychange',()=>{
    if(!video)return;
    if(document.hidden)video.pause();else video.play().catch(()=>{});
   });
  }
  let last=0;
  const lines=[
   "import { Studio } from './creative';",
   "import { Scene } from './environment';",
   "",
   "const project = new Studio({",
   "  quality: 'cinematic',",
   "  interactions: ['gaze', 'vr', 'touch'],",
   "  portfolio: ['PeekDex','IQ-Bites','GUBE']",
   "});",
   "",
   "project.on('explore', (station) => {",
   "  const detail = Scene.find(station);",
   "  return project.hologram(detail);",
   "});",
   "",
   "export default project;"
  ];
  function drawFilm(t){
   if(hasFilm)return;
   const cx=frame(film,'VIDEO / LOOP');
   cx.fillStyle='#0b1622';cx.fillRect(22,65,856,412);
   const x=450+Math.sin(t*.00062)*115,y=260+Math.cos(t*.0005)*31;
   const glow=cx.createRadialGradient(x,y,10,x,y,330);
   glow.addColorStop(0,'#406b85');glow.addColorStop(1,'#101924');
   cx.fillStyle=glow;cx.fillRect(22,65,856,412);
   cx.fillStyle='#e6edf0';cx.font='bold 37px Arial';cx.textAlign='center';
   cx.fillText('REEL / ESTUDIO DE AUTOR',450,258);
   cx.font='19px Arial';cx.fillStyle='#d3dae1';
   cx.fillText('Esperando archivo original del video',450,306);
   cx.strokeStyle='#a8f1f5';cx.lineWidth=4;cx.beginPath();
   cx.arc(450,380,22,t*.0008,t*.0008+Math.PI*1.35);cx.stroke();
   cx.textAlign='left';film.tx.needsUpdate=true;
  }
  function drawCode(t){
   const cx=frame(code,'CODE / LOOP');cx.fillStyle='#071523';cx.fillRect(20,60,860,442);
   cx.fillStyle='#355066';cx.fillRect(20,60,160,442);
   cx.fillStyle='#dce9f2';cx.font='18px monospace';
   ['EXPLORER','src/',' app.ts',' scene.ts',' holograms.ts',' assets/',' public/','README.md'].forEach((ln,i)=>cx.fillText(ln,35,100+i*39));
   const n=reduce?550:Math.floor((t%13500)/13500*550);let remaining=n;
   lines.forEach((ln,i)=>{
    const y=92+i*25;
    cx.fillStyle='#648093';cx.font='16px monospace';cx.fillText(String(i+1).padStart(2,'0'),195,y);
    const shown=ln.slice(0,Math.max(0,remaining));remaining-=ln.length;
    cx.fillStyle=ln.includes('import')?'#bdaded':ln.includes("'")?'#a9d2b9':'#c7dce5';
    cx.font='19px monospace';cx.fillText(shown,245,y);
   });
   cx.fillStyle='#9ee6f1';cx.fillRect(220,478,644,2);
   cx.fillStyle='#a1d6cf';cx.font='16px monospace';cx.fillText('●  COMPILACIÓN LOCAL / LOOP',230,496);
   code.tx.needsUpdate=true;
  }
  function drawEdit(t){
   const cx=frame(edit,'EDIT / LOOP');cx.fillStyle='#0d1826';cx.fillRect(20,60,860,435);
   const phase=reduce?.32:(t%15000)/15000;
   const g=cx.createLinearGradient(0,60,W,335);g.addColorStop(0,'#152f48');g.addColorStop(.5,'#255c6d');g.addColorStop(1,'#18263d');
   cx.fillStyle=g;cx.fillRect(50,70,800,235);
   cx.fillStyle='#bdebf1';cx.font='bold 35px Arial';cx.fillText('CREATIVE MOTION',120,176);
   cx.font='20px monospace';cx.fillText('COLOR · STORY · EDIT',125,220);
   for(let i=0;i<18;i++){
    cx.fillStyle=i%2?'#88d3e035':'#e8af9d45';
    const x=80+i*42,y=85+Math.sin((t/1800)+i)*20;
    cx.fillRect(x,y,7+(i%4)*6,146-(i%3)*22);
   }
   cx.fillStyle='#0b121e';cx.fillRect(24,330,852,170);
   for(let lane=0;lane<3;lane++){
    const y=352+lane*44;
    cx.fillStyle=lane===0?'#2f7c8e':lane===1?'#785b91':'#ab795b';
    for(let i=0;i<7;i++)cx.fillRect(115+i*108+(lane%2)*13,y,94,29);
    cx.fillStyle='#c5e4e9';cx.font='14px monospace';cx.fillText(['VIDEO','AUDIO','COLOR'][lane],35,y+18);
   }
   const px=115+phase*748;cx.fillStyle='#ffe2ac';cx.fillRect(px,329,3,171);
   cx.fillStyle='#c8e1e5';cx.font='16px monospace';cx.fillText('▶  '+String(Math.floor(phase*15)).padStart(2,'0')+':00 / 15:00',660,319);
   edit.tx.needsUpdate=true;
  }
  function tick(t){
   if(!document.body.contains(scene))return;
   requestAnimationFrame(tick);
   if(document.hidden||t-last<115)return;last=t;
   drawFilm(t);drawCode(t);drawEdit(t);
  }
  requestAnimationFrame(tick);
  window.EDA_MONITORS={
   loop:true, videoConfigured:!!video,
   label:['Video (archivo pendiente)','Programación animada','Edición animada'],
   resumeVideo:()=>video?.play().catch(()=>{})
  };
 }
 function readyCheck(){if(ready)return;if(furn.object3D?.userData.v4Built)init();else requestAnimationFrame(readyCheck)}
 if(scene.hasLoaded)readyCheck();else scene.addEventListener('loaded',readyCheck,{once:true});
})();