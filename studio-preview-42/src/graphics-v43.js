(function upgradeScene() {
 "use strict";
 const A=window.AFRAME,THREE=A?.THREE;
 const scene=document.querySelector('#office-scene'),base=document.querySelector('#office-furniture');
 if(!A||!THREE||!scene||!base)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const mobile=/Android|iPhone|iPad|Mobile/i.test(navigator.userAgent);
 let initialized=false;
 function init(){
  const root=base.object3D;
  if(!root?.userData.v4Built||initialized)return;
  initialized=true;
  const maxPixelRatio=mobile?1.3:Math.min(devicePixelRatio||1,1.9);
  try{
    scene.renderer?.setPixelRatio(maxPixelRatio);
    scene.renderer.shadowMap.enabled=true;
    scene.renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    scene.renderer.toneMapping=THREE.ACESFilmicToneMapping;
    scene.renderer.toneMappingExposure=1.35;
  }catch(_){}
  const rough=(c,m=.65,r=.42)=>{
   return new THREE.MeshStandardMaterial({color:c,metalness:m,roughness:r});
  };
  const titanium=rough('#687987',.89,.24),
    graphite=rough('#202d38',.75,.4),
    satin=rough('#d3dfde',.73,.29),
    leather=rough('#343e43',.18,.81),
    walnut=rough('#825f49',.22,.69),
    gold=rough('#ac9176',.69,.38),
    bright=new THREE.MeshBasicMaterial({color:'#7feef7',toneMapped:false}),
    amber=new THREE.MeshBasicMaterial({color:'#fed49d',toneMapped:false});
  function add(x,y,z,w,h,d,mat=titanium,ry=0){
    const v=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);v.position.set(x,y,z);v.rotation.y=ry;
    v.receiveShadow=true;v.castShadow=!mobile && w*h*d>.03&&w*h*d<1.5;
    root.add(v);return v;
  }
  function tube(points,r,mat,segments=40){
    const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));
    const mesh=new THREE.Mesh(new THREE.TubeGeometry(curve,segments,r,7,false),mat);
    root.add(mesh);mesh.castShadow=false;return mesh;
  }
  function cyl(x,y,z,r,h,mat=graphite,segments=24){
    const v=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,segments),mat);
    v.position.set(x,y,z);root.add(v);return v;
  }
  function flatTex(baseColor,lines,roughness=.55){
    const canvas=document.createElement('canvas');canvas.width=512;canvas.height=512;
    const g=canvas.getContext('2d');g.fillStyle=baseColor;g.fillRect(0,0,512,512);
    let seed=14;const rand=()=>{seed=(seed*1103515245+12345)%2147483647;return seed/2147483647};
    for(let i=0;i<lines;i++){
      let x=rand()*512,y=rand()*512,a=.008+rand()*.04;
      g.fillStyle=rand()>.5?`rgba(240,250,255,${a})`:`rgba(0,5,10,${a})`;
      g.fillRect(x,y,rand()*42+1,rand()*1.4+.5);
    }
    const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
    texture.anisotropy=4;
    return new THREE.MeshStandardMaterial({map:texture,roughness,metalness:.54});
  }
  const textile=flatTex('#27323c',6200,.94);
  const brushing=flatTex('#87959b',5100,.26);
  // Quiet architectural detail: avoid industrial wall armor and dense vent grids.
  // Desk details: physical keys with slight rounded profiles and secondary macro pad.
  const keyMat=rough('#161d26',.22,.45);
  for(let row=0;row<4;row++){
    for(let col=0;col<15;col++){
      const x=-.64+col*.079+row*.005;
      const z=-3.76+row*.055;
      add(x,.958,z,.063,.021,.040,keyMat);
    }
  }
  for(let i=0;i<5;i++)add(.74+i*.072,.957,-3.82,.055,.021,.040,graphite);
  // Ergonomic mouse sculpted from curved metal / graphite surfaces.
  const mouse=new THREE.Mesh(new THREE.SphereGeometry(.112,20,15),graphite);
  mouse.scale.set(1,.28,1.42);mouse.position.set(.85,.96,-3.73);root.add(mouse);
  const mouseWheel=add(.85,.993,-3.75,.016,.009,.026,bright);
  // Cable harness behind displays: real curved tubes and ferrules.
  for(let x of [-1.15,0,1.15]){
    tube([[x,1.2,-4.93],[x,1.08,-5.07],[x+.1,.91,-4.96],[x+.10,.85,-4.5]],.012,graphite);
    cyl(x,.99,-4.92,.035,.035,gold);
  }
  // Desk accessories: illuminated mug warmer, mechanical pencil, notebook and tablet.
  cyl(-1.48,.92,-3.84,.13,.018,graphite);
  cyl(-1.48,1.01,-3.84,.095,.15,satin);
  const cupHandle=new THREE.Mesh(new THREE.TorusGeometry(.061,.014,8,21,Math.PI*1.6),satin);
  cupHandle.rotation.y=Math.PI/2;cupHandle.position.set(-1.36,1.035,-3.84);root.add(cupHandle);
  add(1.15,.94,-3.85,.45,.025,.31,leather,-.12);
  add(1.15,.954,-3.84,.40,.008,.275,brushing,-.12);
  tube([[1.34,.965,-3.70],[1.42,.97,-3.86],[1.38,.965,-3.97]],.01,gold);
  // Desk microphone, broadcast-ready setup.
  cyl(-1.76,.95,-3.87,.11,.025,graphite);
  tube([[-1.76,.96,-3.87],[-1.76,1.20,-3.87],[-1.62,1.38,-3.94]],.019,brushing,20);
  const mic=new THREE.Mesh(new THREE.CapsuleGeometry(.052,.18,6,12),graphite);
  mic.rotation.z=-.22;mic.position.set(-1.61,1.42,-3.96);root.add(mic);
  // A pair of premium fabric chairs and an articulated arm.
  add(-.42,1.1,-3.1,.74,1.01,.12,textile);
  for(let i=0;i<9;i++)add(-.73+i*.078,1.09,-3.025,.015,.82,.008,graphite);
  add(-.42,.60,-2.89,.83,.14,.68,leather);
  tube([[-.73,.66,-2.86],[-.86,.81,-2.98],[-.85,.91,-3.07]],.026,titanium);
  tube([[-.11,.66,-2.86],[.02,.81,-2.98],[.01,.91,-3.07]],.026,titanium);
  // Meeting desk: textured slate inset, sample kit and branded swatch palette.
  add(2.46,.777,2.18,1.22,.014,.55,brushing,-.05);
  const swatches=['#b4cdd7','#c3aca0','#a2a8cd','#3b857d'];
  for(let i=0;i<4;i++)add(2.05+i*.20,.79,2.13,.14,.008,.14,rough(swatches[i],.22,.67));
  // Industrial ceiling suspension + lens domes for believable cinematic lighting.
  for(let x of [-3,0,3])for(let z of [-2.2,1.9]){
    cyl(x,3.15,z,.24,.045,graphite);
    const glass=new THREE.MeshPhysicalMaterial({color:'#e8f5fa',metalness:.12,roughness:.22,transparent:true,opacity:.69,transmission:.4});
    const lens=new THREE.Mesh(new THREE.SphereGeometry(.18,18,14,0,Math.PI*2,0,Math.PI/2),glass);
    lens.rotation.x=Math.PI;lens.position.set(x,3.08,z);root.add(lens);
  }
  // Actual moving content on workstation: animated textured central monitor,
  // with user project names rather than random fake dashboard data.
  let animatedScreen=null;
  const board=document.createElement('canvas');board.width=1024;board.height=576;
  const context=board.getContext('2d');
  const texture=new THREE.CanvasTexture(board);texture.colorSpace=THREE.SRGBColorSpace;
  animatedScreen=new THREE.Mesh(new THREE.PlaneGeometry(.97,.58),
    new THREE.MeshBasicMaterial({map:texture,depthWrite:false,toneMapped:false}));
  animatedScreen.position.set(0,1.53,-4.852);
  root.add(animatedScreen);
  const projects=['PEEKDEX','IQ-BITES','GUBE'];
  let lastTime=0;
  function animateFrame(t){
    if(!document.body.contains(scene))return;
    if(!reduced && (t-lastTime>90 || !lastTime)){
      lastTime=t;
      const phase=t*.00011,idx=Math.floor(t/4600)%3,name=projects[idx];
      const g=context.createLinearGradient(0,0,1024,576);
      g.addColorStop(0,'#092737');g.addColorStop(1,'#071621');
      context.fillStyle=g;context.fillRect(0,0,1024,576);
      context.fillStyle='#85e0e8';context.fillRect(35,32,210,6);
      context.fillStyle='#e7f9fa';context.font='700 55px Arial';context.fillText(name,40,126);
      context.font='25px monospace';context.fillStyle='#b4d8de';context.fillText('ESTUDIO DE AUTOR / PORTAFOLIO',40,181);
      for(let i=0;i<20;i++){
       let v=.2+.8*Math.abs(Math.sin(phase+i*.33));
       context.fillStyle=i%3?'#5eabba':'#d3af8f';
       context.fillRect(40+i*45,490-v*230,26,v*230);
      }
      context.strokeStyle='#75d9e2';context.lineWidth=3;
      context.strokeRect(28,22,968,528);
      context.fillStyle='#d1e3e6';context.font='25px monospace';context.fillText('PROYECTO '+(idx+1)+' / 03',770,70);
      texture.needsUpdate=true;
    }
    requestAnimationFrame(animateFrame);
  }
  requestAnimationFrame(animateFrame);
  // Ambient volumetric fake: restrained edge light beams, no aggressive neon.
  const glowMaterial=new THREE.MeshBasicMaterial({color:'#93d5f0',transparent:true,opacity:.065,depthWrite:false,side:THREE.DoubleSide});
  for(let x of []){
    const beam=new THREE.Mesh(new THREE.PlaneGeometry(.5,4.1),glowMaterial);
    beam.position.set(x,1.6,1.2);beam.rotation.y=x>0?Math.PI/2:-Math.PI/2;root.add(beam);
  }
  const perf=document.createElement('span');
  perf.id='eda-graphics-tier';perf.textContent=mobile?'PERFORMANCE':'CINEMATIC';
  perf.style.cssText='display:none';
  document.body.appendChild(perf);
  window.EDA_VISUAL_QUALITY={tier:mobile?'performance':'cinematic',proceduralMaterials:true,movingPortfolioDisplay:true,detailProps:true};
 }
 function wait(){
  if(initialized)return;
  if(base.object3D?.userData.v4Built)init();
  else requestAnimationFrame(wait);
 }
 if(scene.hasLoaded)wait();
 else scene.addEventListener('loaded',wait,{once:true});
})();