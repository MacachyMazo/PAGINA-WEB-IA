(function realismStudioV6(){
 const A=window.AFRAME,THREE=A?.THREE;
 const scene=document.querySelector('#office-scene'),room=document.querySelector('#office-furniture');
 if(!scene||!THREE||!room)return;
 let initialized=false;
 function ready(){
  if(initialized||!room.object3D?.userData?.v4Built)return;
  initialized=true;
  const root=room.object3D;
  const mobile=matchMedia('(max-width:720px)').matches;
  function makeTexture(kind){
   const c=document.createElement('canvas'),w=512,h=512;c.width=w;c.height=h;
   const x=c.getContext('2d');let seed=kind==='wood'?13:kind==='leather'?29:59;
   const rnd=()=>{seed=(seed*48271)%2147483647;return seed/2147483647};
   x.fillStyle=kind==='wood'?'#8c684d':kind==='leather'?'#3d464a':'#8b9b9f';x.fillRect(0,0,w,h);
   if(kind==='wood'){
    for(let i=0;i<700;i++){
      const y=rnd()*512,a=.025+rnd()*.24,b=.4+rnd()*1.6;
      x.strokeStyle=`rgba(${rnd()>.48?'20,13,8':'255,229,186'},${a})`;
      x.lineWidth=b;x.beginPath();x.moveTo(0,y);x.bezierCurveTo(120,y+Math.sin(i)*3,320,y-3+rnd()*6,512,y+Math.cos(i)*3);x.stroke();
    }
    x.fillStyle='#e2c08a0c';x.fillRect(0,0,512,512);
   } else if(kind==='leather'){
    for(let i=0;i<17000;i++){
     const v=30+Math.round(rnd()*100);x.fillStyle=`rgba(${v+15},${v+26},${v+30},${.05+rnd()*.09})`;
     x.beginPath();x.ellipse(rnd()*512,rnd()*512,1+rnd()*2,.65+rnd(),rnd()*Math.PI,0,Math.PI*2);x.fill();
    }
   } else {
    for(let i=0;i<7200;i++){
      const py=rnd()*512,px=rnd()*512;
      x.fillStyle=rnd()>.5?`rgba(241,249,251,${rnd()*.045})`:`rgba(10,18,21,${rnd()*.085})`;
      x.fillRect(px,py,1+rnd()*38,.2+rnd()*.95);
    }
   }
   const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;t.wrapS=t.wrapT=THREE.RepeatWrapping;return t;
  }
  const wood=makeTexture('wood'),leather=makeTexture('leather'),brushed=makeTexture('steel');
  const metallic=(c=.72,r=.32,map)=>new THREE.MeshPhysicalMaterial({color:'#e9eff0',map,metalness:c,roughness:r,clearcoat:0.14,clearcoatRoughness:.35});
  const walnut=new THREE.MeshPhysicalMaterial({metalness:.02,roughness:.62,clearcoat:.16,clearcoatRoughness:.4,color:'#eeeae0'});
  const upholstery=new THREE.MeshStandardMaterial({map:leather,metalness:.08,roughness:.91,color:'#b1b5b8',bumpMap:leather,bumpScale:.009});
  const chrome=metallic(.94,.19,brushed);
  const titanium=metallic(.84,.38,brushed);
  const rubber=new THREE.MeshStandardMaterial({color:'#182229',roughness:.89,metalness:.04});
  const glass=new THREE.MeshPhysicalMaterial({color:'#cad8e0',metalness:.14,roughness:.06,transmission:.49,transparent:true,opacity:.78,clearcoat:1,clearcoatRoughness:.04,depthWrite:false});
  const emit=(color,intensity=1.2)=>new THREE.MeshBasicMaterial({color,toneMapped:false,transparent:true,opacity:intensity>1?1:intensity});
  const add=(geom,mat,x,y,z,rotY=0)=>{
   const m=new THREE.Mesh(geom,mat);m.position.set(x,y,z);m.rotation.y=rotY;
   m.receiveShadow=true;m.castShadow=!mobile;root.add(m);return m;
  };
  const roundbox=(w,h,d,r,mat,x,y,z)=>{
   const sh=new THREE.Shape();
   const a=-w/2,b=-h/2;
   sh.moveTo(a+r,b);sh.lineTo(a+w-r,b);sh.quadraticCurveTo(a+w,b,a+w,b+r);
   sh.lineTo(a+w,b+h-r);sh.quadraticCurveTo(a+w,b+h,a+w-r,b+h);
   sh.lineTo(a+r,b+h);sh.quadraticCurveTo(a,b+h,a,b+h-r);
   sh.lineTo(a,b+r);sh.quadraticCurveTo(a,b,a+r,b);
   const geometry=new THREE.ExtrudeGeometry(sh,{depth:d-2*r,bevelEnabled:true,bevelSize:r*.60,bevelThickness:r,bevelSegments:3,steps:1,curveSegments:6});
   geometry.translate(0,0,-d/2+r);
   return add(geometry,mat,x,y,z);
  };
  // Rounded, solid walnut tabletop overlays the previous razor-sharp box.
  roundbox(4.03,.105,1.40,.048,walnut,0,.845,-4.32);
  // Multi-layer under-desk structure.
  add(new THREE.BoxGeometry(3.86,.047,1.22),titanium,0,.746,-4.32);
  for(const x of [-1.73,1.73]){
    for(const z of [-4.80,-3.86]){
      add(new THREE.CylinderGeometry(.038,.038,.78,18),chrome,x,.40,z);
      add(new THREE.CylinderGeometry(.065,.065,.018,16),rubber,x,.03,z);
    }
  }
  // Rounded console casings and glass reflections on each workstation display.
  for(const x of [-1.13,0,1.13]){
    roundbox(1.075,.722,.096,.032,rubber,x,1.53,-4.93);
    add(new THREE.PlaneGeometry(.985,.599),glass,x,1.53,-4.847);
    add(new THREE.CylinderGeometry(.032,.032,.17,16),titanium,x,1.1,-4.82);
    add(new THREE.CylinderGeometry(.16,.16,.014,24),chrome,x,1.015,-4.81);
    add(new THREE.BoxGeometry(.42,.022,.30),titanium,x,1.006,-4.81);
    add(new THREE.BoxGeometry(.27,.01,.008),emit('#64dbe3'),x,1.17,-4.88);
  }
  // Keyboard with softened edges and an opaque wrist rest.
  roundbox(1.24,.045,.39,.018,rubber,-.25,.957,-3.82);
  roundbox(1.12,.035,.18,.018,upholstery,-.25,.959,-3.56);
  // Camera and sound capture accessory, black metal and glass.
  for(const x of [-1.13,0,1.13]){
    const webcam=add(new THREE.CapsuleGeometry(.055,.10,5,10),rubber,x,1.95,-4.90);
    webcam.rotation.z=Math.PI/2;
    add(new THREE.SphereGeometry(.018,12,9),glass,x,1.957,-4.826);
  }
  // Film-grade articulating work lamp: lamp arms and warm diffuser ring.
  const tube=(pts,r,mat)=>add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(p=>new THREE.Vector3(...p))),25,r,8,false),mat,0,0,0);
  tube([[1.56,.96,-3.86],[1.65,1.20,-3.86],[1.45,1.52,-3.92]],.02,chrome);
  const shade=add(new THREE.ConeGeometry(.20,.19,24,1,true),titanium,1.45,1.55,-3.92);
  shade.rotation.z=Math.PI;
  add(new THREE.SphereGeometry(.13,16,12),emit('#ffe9be'),1.45,1.46,-3.92);
  // Three small framed brand palettes, more believable than floating primitives.
  for(let i=0;i<4;i++){
    const z=-5.63,x=-3.5+i*.33;
    roundbox(.23,.31,.026,.012,titanium,x,2.14,z+.14);
    add(new THREE.PlaneGeometry(.19,.27),new THREE.MeshStandardMaterial({
      color:['#c4a493','#93bdc8','#d0a9c9','#a1bdaa'][i],roughness:.7
    }),x,2.14,z+.174);
  }
  // Stacked documents + clips on creative table.
  for(let i=0;i<8;i++){
    const m=add(new THREE.BoxGeometry(.70,.007,.44),new THREE.MeshStandardMaterial({color:i%2?'#ece6da':'#e1d9cb',roughness:.93}),
     -4.41,.843+i*.007,-.075);
    m.rotation.y=.04*(i-4);
  }
  add(new THREE.BoxGeometry(.11,.013,.06),chrome,-4.73,.913,-.21);

  const ivory=new THREE.MeshStandardMaterial({color:'#dedbd2',roughness:.78,metalness:.02});
  const fabric=new THREE.MeshStandardMaterial({color:'#878e81',roughness:1,metalness:0});
  const rug=add(new THREE.BoxGeometry(5.3,.018,3.25),fabric,0,.008,-3.9);
  for(const x of [-1.64,1.64]){
    roundbox(.62,.69,1.10,.024,ivory,x,.39,-4.32);
    for(const y of [.23,.45,.65])add(new THREE.BoxGeometry(.48,.009,.012),rubber,x,y,-3.758);
  }
  // Warm white lampshade on a dark stem, matching the supplied interior reference.
  add(new THREE.CylinderGeometry(.12,.12,.025,24),rubber,-1.72,.92,-4.54);
  add(new THREE.CylinderGeometry(.012,.012,.48,12),titanium,-1.72,1.17,-4.54);
  add(new THREE.BoxGeometry(.29,.28,.25),new THREE.MeshStandardMaterial({
    color:'#f4eddf',roughness:.95,emissive:'#e7c999',emissiveIntensity:.22
  }),-1.72,1.49,-4.54);

  // Optional 2D performance warning is not injected into the 3D scene.
  window.EDA_REALISM_V6={ready:true,textures:['walnut','leather','brushed titanium'],detailLevel:mobile?'mobile':'desktop'};
 }
 const wait=()=>{if(initialized)return;if(room.object3D?.userData?.v4Built)ready();else requestAnimationFrame(wait)};
 if(scene.hasLoaded)wait();else scene.addEventListener('loaded',wait,{once:true});
})();