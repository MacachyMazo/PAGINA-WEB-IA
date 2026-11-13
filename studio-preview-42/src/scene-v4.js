
/* Estudio de Autor 4.0: original procedural hard-surface office.
   All geometry is constructed locally with Three.js from the A-Frame bundle. */
const buildStudio = () => {
  const A=window.AFRAME;
  const THREE=A?.THREE;
  const owner=document.querySelector('#office-furniture');
  if(!THREE||!owner?.object3D||owner.object3D.userData.v4Built)return;
  owner.object3D.userData.v4Built=true;
  const root=owner.object3D;
  const color=(c)=>new THREE.Color(c);
  function texture(base='#37434b',highlight='#52606a',kind='wall'){
    const canvas=document.createElement('canvas');canvas.width=512;canvas.height=512;
    const ctx=canvas.getContext('2d');const W=512;
    ctx.fillStyle=base;ctx.fillRect(0,0,W,W);
    let seed=kind==='floor'?33:kind==='wall'?87:118;
    const random=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
    // Directional grain, subtle scratches and metallic brushing.
    for(let i=0;i<2400;i++){
      const a=random()*.065;
      ctx.fillStyle=random()>.5?'rgba(235,247,255,'+a+')':'rgba(0,0,0,'+(a*.6)+')';
      const x=random()*W,y=random()*W;
      ctx.fillRect(x,y,random()*26+.5,random()*.7+.3);
    }
    if(kind==='floor'){
      ctx.fillStyle='#c8c0ad';ctx.fillRect(0,0,W,W);
      for(let row=0;row<8;row++){
        const y=row*64;ctx.fillStyle=row%3===0?'#c4bba8':row%3===1?'#d2c9b8':'#c9c2b2';
        ctx.fillRect(0,y,512,63);
        for(let i=0;i<42;i++){
          ctx.strokeStyle=i%3?'rgba(108,91,67,.08)':'rgba(255,250,231,.16)';
          ctx.beginPath();ctx.moveTo(0,y+random()*62);ctx.lineTo(512,y+random()*62);ctx.stroke();
        }
        ctx.fillStyle='#9f968744';ctx.fillRect((row%3)*170,y,1,64);
      }
    }else if(kind==='wall'){
      ctx.fillStyle='#ddd9ce';ctx.fillRect(0,0,W,W);
      for(let i=0;i<4000;i++){ctx.fillStyle='rgba(90,80,65,.025)';ctx.fillRect(random()*W,random()*W,2,2);}
      ctx.fillStyle='#aaa69c55';ctx.fillRect(0,255,512,1);
    }
    const tex=new THREE.CanvasTexture(canvas);
    tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=4;
    tex.wrapS=tex.wrapT=THREE.RepeatWrapping;
    return tex;
  }
  const metal=(clr='#455660',metalness=.78,roughness=.44)=>
    new THREE.MeshStandardMaterial({color:clr,metalness,roughness});
  const wall=texture('#45525d','#88969d','wall');
  const floor=texture('#45515a','#69727c','floor');
  floor.repeat.set(3,3);
  wall.repeat.set(2.1,1.8);
  const ribs=texture('#5a666b','#9aacb8','ribs');
  ribs.repeat.set(2,2);
  const shellMat=new THREE.MeshStandardMaterial({map:wall,color:'#ffffff',metalness:0,roughness:.92,bumpMap:wall,bumpScale:.003});
  const floorMat=new THREE.MeshStandardMaterial({map:floor,color:'#ffffff',metalness:.02,roughness:.76,bumpMap:floor,bumpScale:.004});
  const trimMat=new THREE.MeshStandardMaterial({map:ribs,color:'#b9b9b3',metalness:.28,roughness:.65,bumpMap:ribs,bumpScale:.005});
  const dark=metal('#18242d',.72,.48),steel=metal('#526875',.82,.36);
  const warm=metal('#e9e5da',.03,.6),matte=metal('#24333f',.33,.78);
  const glow=(hex,power=1.5)=>new THREE.MeshBasicMaterial({color:hex,transparent:false,toneMapped:false});
  const frosted=new THREE.MeshStandardMaterial({color:'#79b1be',metalness:.38,roughness:.19,transparent:true,opacity:.34,side:THREE.DoubleSide,depthWrite:false});
  const objects=[];
  // Procedural light-probe: softboxes and cool skylight reflected by PBR metal.
  // Environment texture generated at runtime; no external files or photographic backdrop.
  const installReflections=()=>{
    const el=document.querySelector('#office-scene');
    const renderer=el?.renderer;
    if(!renderer?.getContext||!THREE.PMREMGenerator)return;
    const c=document.createElement('canvas');c.width=1024;c.height=512;
    const cx=c.getContext('2d');
    const gradient=cx.createLinearGradient(0,0,0,512);
    gradient.addColorStop(0,'#cad6df');gradient.addColorStop(.34,'#829aa7');
    gradient.addColorStop(.55,'#4e616e');gradient.addColorStop(1,'#1b2932');
    cx.fillStyle=gradient;cx.fillRect(0,0,1024,512);
    const panels=[
      [115,76,145,128,'#f2ffff'],[390,90,92,196,'#e8f8ff'],
      [727,78,200,94,'#ffecd4'],[900,165,60,140,'#c3e9fb'],
      [190,275,72,34,'#c1d0d8'],[570,280,250,22,'#f0d4b6']
    ];
    for(const [x,y,w,h,color] of panels){
      cx.save();cx.shadowColor=color;cx.shadowBlur=48;
      cx.fillStyle=color;cx.fillRect(x,y,w,h);cx.restore();
    }
    const t=new THREE.CanvasTexture(c);
    t.mapping=THREE.EquirectangularReflectionMapping;
    t.colorSpace=THREE.SRGBColorSpace;
    const gen=new THREE.PMREMGenerator(renderer);
    try{
      const env=gen.fromEquirectangular(t).texture;
      el.object3D.environment=env;
      renderer.toneMapping=THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure=1.38;
      renderer.outputColorSpace=THREE.SRGBColorSpace;
      t.dispose();gen.dispose();
    }catch(error){
      console.warn('Reflejos ambientales opcionales no disponibles:',error?.message);
      t.dispose();gen.dispose();
    }
  };
  try{installReflections()}catch(e){console.warn('Reflejos omitidos:',e?.message)}

  const box=(x,y,z,w,h,d,mat=steel,rx=0,ry=0,rz=0)=>{
    const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);
    mesh.position.set(x,y,z);mesh.rotation.set(rx,ry,rz);
    mesh.castShadow=w>.24&&h>.1&&d>.1&&(w*h*d)<2;
    mesh.receiveShadow=true;
    root.add(mesh);objects.push(mesh);return mesh;
  };
  const cylinder=(x,y,z,r,h,mat=steel,segments=20)=>{
    const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,segments),mat);
    mesh.position.set(x,y,z);root.add(mesh);objects.push(mesh);return mesh;
  };
  const sphere=(x,y,z,r,mat=steel)=>{
    const mesh=new THREE.Mesh(new THREE.SphereGeometry(r,14,12),mat);
    mesh.position.set(x,y,z);root.add(mesh);objects.push(mesh);return mesh;
  };
  const beam=(a,b,thick,mat=steel)=>{
    const start=new THREE.Vector3(...a),end=new THREE.Vector3(...b);
    const mid=start.clone().add(end).multiplyScalar(.5);
    const mesh=new THREE.Mesh(new THREE.CylinderGeometry(thick,thick,start.distanceTo(end),10),mat);
    mesh.position.copy(mid);mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),end.clone().sub(start).normalize());
    root.add(mesh);objects.push(mesh);return mesh;
  };
  const decal=(x,y,z,w,h,colorValue='#78e7eb',intensity=1)=>{
    const m=new THREE.MeshBasicMaterial({color:colorValue,transparent:true,opacity:intensity,depthWrite:false});
    return box(x,y,z,w,h,.013,m);
  };
  const panelLabels=[
    {text:'C R E A T I V E  /  S T U D I O',x:-4.25,y:2.35,z:-.3,w:2.5},
    {text:'P O R T F O L I O',x:0,y:2.40,z:-5.70,w:2.5},
    {text:'A C C E S S   /   0 5',x:4.22,y:2.75,z:-3.75,w:2.3},
    {text:'B R I E F I N G',x:2.65,y:2.47,z:2.95,w:1.9}
  ];
  const textMesh=(str,x,y,z,w,colorHex='#d6e9f0')=>{
    const can=document.createElement('canvas');can.width=1024;can.height=128;
    const cx=can.getContext('2d');cx.clearRect(0,0,1024,128);
    cx.fillStyle=colorHex;cx.font='bold 56px Arial';cx.textAlign='center';
    cx.fillText(str,512,82);
    const tex=new THREE.CanvasTexture(can);tex.colorSpace=THREE.SRGBColorSpace;
    const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,.28),new THREE.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false,side:THREE.DoubleSide}));
    mesh.position.set(x,y,z);root.add(mesh);return mesh;
  };
  // Fully enclosed room; no photographic background or exterior panorama.
  box(0,-.12,0,12.8,.2,13.2,floorMat);
  for(let x of [-6.28,6.28]){
    box(x,1.72,0,.22,3.54,13.0,shellMat);
    for(let z=-5.7;z<=5.7;z+=1.35){
      box(x+(x<0?.14:-.14),1.75,z,.06,3.45,.05,trimMat);
      decal(x+(x<0?.18:-.18),.16,z,.025,.13,'#4ad0da',.68);
    }
    box(x-(x>0?.23:-.23),3.28,0,.13,.15,13,steel);
  }
  for(let z of [-6.37,6.37]){
    box(0,1.71,z,12.8,3.52,.24,shellMat);
    for(let x=-5.5;x<=5.5;x+=1.35){
      box(x,1.66,z+(z<0?.14:-.14),.065,3.3,.09,trimMat);
    }
  }
  box(0,3.5,0,12.8,.25,13.2,shellMat);
  for(let x=-5.3;x<5.4;x+=2.7){
    box(x,3.35,0,.13,.21,12.8,steel);
    for(let z=-5.1;z<5.3;z+=2){
      decal(x,3.22,z,.025,.025,'#eff5ff',.9);
    }
  }
  // Ceiling light strips with metal housings.
  for(let z of [-4.8,-2.4,0,2.4,4.8]){
    box(0,3.26,z,2.4,.12,.35,dark);
    decal(0,3.187,z,1.9,.025,'#b9e4e7',.95);
    box(-1.21,3.19,z,.1,.1,.4,steel);box(1.21,3.19,z,.1,.1,.4,steel);
  }
  // Door to reception: armored frame and mechanical seams.
  box(0,1.44,6.16,2.45,2.78,.18,dark);
  for(let x of [-.73,.73]){
    box(x,1.45,6.03,.93,2.53,.07,steel);
    box(x,1.45,5.96,.82,2.40,.035,shellMat);
  }
  decal(0,1.5,5.92,.025,2.44,'#73e5ed');
  decal(0,2.9,5.98,2.1,.025,'#5fdfed');
  textMesh('E / A   -   ESTUDIO DE AUTOR',0,3.08,5.88,2.6,'#dff9f6');
  // Baseboards and wall lights.
  for(let x of [-6.08,6.08]){
    box(x,.13,0,.15,.21,12.6,dark);
    for(let z=-5.3;z<=5.4;z+=2.65){
      decal(x>0?x-.08:x+.08,2.30,z,.02,.49,'#58baca',.7);
    }
  }
  // Functional workbench and three detailed screens.
  box(0,.83,-4.32,4.04,.12,1.4,warm);
  for(const x of [-1.75,1.75]){
    box(x,.41,-4.73,.09,.81,.09,steel);
    box(x,.41,-3.87,.09,.81,.09,steel);
  }
  const displays=[
    {x:-1.13,label:'CREATIVE // BRAND',hue:'#3ec4ca'},
    {x:0,label:'PORTFOLIO // 03',hue:'#d2b4ea'},
    {x:1.13,label:'WEB // UX',hue:'#97a8f3'}
  ];
  const displayTexture=(label,accent)=>{
    const c=document.createElement('canvas');c.width=1024;c.height=640;const ctx=c.getContext('2d');
    const g=ctx.createLinearGradient(0,0,1024,640);g.addColorStop(0,'#101a24');g.addColorStop(1,'#091b25');
    ctx.fillStyle=g;ctx.fillRect(0,0,1024,640);
    ctx.fillStyle=accent;ctx.font='bold 39px Arial';ctx.fillText(label,50,79);
    ctx.strokeStyle=accent;ctx.globalAlpha=.55;ctx.lineWidth=3;
    for(let i=0;i<12;i++){ctx.beginPath();ctx.moveTo(58,130+i*36);ctx.lineTo(575+i%4*76,130+i*36);ctx.stroke();}
    ctx.globalAlpha=1;ctx.strokeStyle='#86dcdf';ctx.lineWidth=5;ctx.strokeRect(650,161,262,282);
    for(let i=0;i<9;i++){
      ctx.fillStyle=i%2?'#84c5c744':'#dec7e547';ctx.fillRect(669,179+i*28,200-i%4*23,9);
    }
    ctx.strokeStyle=accent;ctx.lineWidth=9;ctx.beginPath();ctx.arc(772,530,59,0,Math.PI*1.6);ctx.stroke();
    ctx.fillStyle='#c2dbe5';ctx.font='22px monospace';ctx.fillText('STUDIO / LIVE',52,570);
    const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;return tex;
  };
  for(const s of displays){
    box(s.x,1.53,-4.92,1.08,.72,.085,dark);
    const face=new THREE.Mesh(new THREE.PlaneGeometry(.994,.615),new THREE.MeshBasicMaterial({map:displayTexture(s.label,s.hue)}));
    face.position.set(s.x,1.53,-4.864);root.add(face);
    box(s.x,1.10,-4.82,.055,.16,.045,steel);
    box(s.x,1.02,-4.81,.36,.026,.27,steel);
  }
  box(-.28,.918,-3.82,.83,.03,.27,dark);
  for(let i=0;i<14;i++)decal(-.66+i*.055,.94,-3.73,.03,.009,'#ccdfea',.38);
  cylinder(.72,.95,-3.83,.11,.16,matte);
  cylinder(-1.46,.94,-3.85,.12,.16,trimMat);
  box(1.68,.49,-4.94,.34,.82,.53,dark);
  for(let i=0;i<3;i++){
    const mat=new THREE.MeshBasicMaterial({color:'#9d81f5'});
    const tor=new THREE.Mesh(new THREE.TorusGeometry(.096,.015,8,24),mat);
    tor.rotation.y=Math.PI/2;tor.position.set(1.88,.24+i*.2,-4.64);root.add(tor);
  }
  // Ergonomic office chair.
  box(0,.61,-2.93,.79,.14,.76,dark);
  box(0,1.15,-3.25,.76,.99,.12,matte);
  cylinder(0,.33,-2.93,.065,.52,steel);
  for(let i=0;i<5;i++){
    const a=i*Math.PI*2/5;beam([0,.12,-2.93],[Math.cos(a)*.43,.12,-2.93+Math.sin(a)*.43],.028,dark);
  }
  // Left creative laboratory: tool board and product samples.
  box(-4.32,.75,-.05,2.5,.11,1.05,trimMat);
  for(let x of [-5.25,-3.39])for(let z of [-.43,.33])box(x,.37,z,.07,.68,.07,dark);
  box(-4.32,1.54,-.72,2.30,1.27,.075,dark);
  for(let i=0;i<6;i++){
    const x=-5.18+(i%3)*.86,y=1.82-Math.floor(i/3)*.49;
    box(x,y,-.67,.66,.36,.03,i%2?matte:steel);
    decal(x,y+.15,-.645,.53,.012,i%2?'#6be0db':'#b7a0e5',.85);
  }
  textMesh('C R E A T I V E',-4.32,2.38,-.65,2.15,'#c2f2f4');
  for(let i=0;i<5;i++){
    box(-5.15+i*.37,.845,.13,.24,.055,.28,
      i%2?metal('#be9d81',.3,.6):metal('#6b9e98',.3,.65));
  }
  // Right wall subscription gallery in a premium exhibition case.
  box(4.10,1.66,-4.40,2.86,2.65,.21,dark);
  textMesh('M E M B E R S H I P',4.10,2.92,-4.27,2.4,'#c9c7ff');
  for(let i=0;i<5;i++){
    const x=3.02+i*.54;
    box(x,1.78,-4.26,.46,1.63,.035,i===4?metal('#646b88',.55,.42):matte);
    decal(x,2.55,-4.23,.34,.025,i===4?'#d8b7ff':'#6abecf',.95);
    textMesh('0'+(i+1),x,2.20,-4.22,.35,'#fff0de');
    decal(x,1.23,-4.23,.32,.02,'#a9d1d3',.54);
  }
  box(4.1,.69,-2.92,2.12,.09,.85,trimMat);
  for(let x of [3.3,4.89])box(x,.36,-2.91,.07,.67,.06,dark);
  // Meeting area, circular table and leather-backed chairs.
  cylinder(2.45,.70,2.2,.93,.13,warm);
  cylinder(2.45,.36,2.2,.13,.6,steel);
  cylinder(2.45,.11,2.2,.48,.035,dark);
  for(let i=0;i<5;i++){
    const theta=i*2*Math.PI/5;
    const x=2.45+Math.cos(theta)*1.34,z=2.2+Math.sin(theta)*1.34;
    box(x,.53,z,.58,.15,.60,matte);
    box(x,.97,z+Math.sin(theta)*.17,.57,.80,.13,dark,0,-theta+.5,0);
    cylinder(x,.30,z,.06,.50,steel);
  }
  box(2.1,.78,2.11,.39,.022,.56,metal('#ccd8d6',.05,.85));
  box(2.7,.79,2.03,.54,.04,.34,dark);
  cylinder(3.08,.87,2.48,.11,.17,trimMat);
  // Display console at the briefing end of the room.
  box(2.95,1.78,3.78,2.26,1.46,.14,dark);
  box(2.95,1.78,3.68,2.10,1.25,.03,metal('#203f4b',.22,.3));
  textMesh('P R O J E C T   B R I E F',2.95,1.97,3.636,1.93,'#d9f7ff');
  decal(2.95,1.33,3.63,1.6,.025,'#63dfeb',.9);
  // Discord / COMMS workstation: 3D terminal integrated in the architecture.
  box(-4.72,.78,3.05,2.24,.10,.76,trimMat);
  for(const x of [-5.61,-3.83])box(x,.39,3.06,.07,.7,.07,dark);
  box(-4.72,1.64,3.42,1.78,1.18,.13,dark);
  box(-4.72,1.64,3.35,1.61,1.02,.025,metal('#28364f',.35,.3));
  textMesh('D I S C O R D / C O M M S',-4.72,1.83,3.311,1.52,'#d7dcff');
  decal(-4.72,1.43,3.315,1.38,.03,'#939efa',.87);
  for(let i=0;i<6;i++)decal(-5.30+i*.23,1.20,3.315,.15,.015,'#b0aff0',.72);
  box(-4.72,.93,2.77,.93,.032,.34,dark);
  for(let i=0;i<4;i++)box(-5.03+i*.20,.956,2.74,.12,.01,.15,steel);
  cylinder(-5.47,.91,2.83,.085,.17,trimMat);
  textMesh('CONNECT / CREATE / COLLABORATE',-4.72,2.43,3.47,2.00,'#e1e7ff');
  // Art direction: display cabinet, plants with metallic planters, pendant lamps.
  for(let y of [.65,1.27,1.88,2.5])box(-5.45,y,2.07,.38,.055,2.35,steel);
  for(let i=0;i<13;i++){
    box(-5.43,.82+(i%3)*.61,1.12+Math.floor(i/3)*.44,.27,.32,.20,
      i%3?warm:matte);
  }
  const planters=[[-5.28,3.37],[5.15,3.55],[-5.30,-3.48]];
  for(const [x,z] of planters){
    cylinder(x,.23,z,.26,.46,dark);
    const leafMat=new THREE.MeshStandardMaterial({color:'#344c31',roughness:.86,side:THREE.DoubleSide});
    for(let i=0;i<17;i++){
      const angle=i*2.4,tip=.9+(i%5)*.15;
      beam([x,.43,z],[x+Math.cos(angle)*.20,tip,z+Math.sin(angle)*.20],.009,leafMat);
      const shape=new THREE.Shape();shape.moveTo(0,0);
      shape.quadraticCurveTo(.13,.28,0,.65);shape.quadraticCurveTo(-.13,.28,0,0);
      const leaf=new THREE.Mesh(new THREE.ShapeGeometry(shape,10),leafMat);
      leaf.position.set(x+Math.cos(angle)*.2,tip-.1,z+Math.sin(angle)*.2);
      leaf.rotation.set(.4,angle,(i%2?.4:-.4));root.add(leaf);
    }
  }

  // Metallic book-ends, environmental accents, lighting.
  for(const x of [-4.2,0,4.2]){
    box(x,3.13,-6.05,.83,.22,.13,dark);
    decal(x,3.03,-5.96,.70,.02,'#74cbd3',.92);
  }
  // Ambient occlusion: translucent contact shadows ground furniture on the floor.
  const contact=document.createElement('canvas');
  contact.width=128;contact.height=128;
  const cc=contact.getContext('2d');
  const cg=cc.createRadialGradient(64,64,4,64,64,64);
  cg.addColorStop(0,'rgba(2,8,12,.55)');
  cg.addColorStop(.53,'rgba(2,8,12,.30)');
  cg.addColorStop(1,'rgba(2,8,12,0)');
  cc.fillStyle=cg;cc.fillRect(0,0,128,128);
  const shadowTex=new THREE.CanvasTexture(contact);
  const shadowMat=new THREE.MeshBasicMaterial({
    map:shadowTex,transparent:true,depthWrite:false,side:THREE.DoubleSide,
    polygonOffset:true,polygonOffsetFactor:-2
  });
  for(const [x,z,w,d] of [[0,-4.2,4.6,2.2],[-4.32,-.05,3.4,1.8],
    [2.45,2.2,3.5,3.3],[4.1,-3.6,3.8,2.0],[-5.4,3.4,1.3,1.3]]){
    const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,d),shadowMat);
    mesh.rotation.x=-Math.PI/2;mesh.position.set(x,.021,z);
    root.add(mesh);
  }
  // High-frequency micro grooves and perimeter accents for depth.
  for(let z=-5.9;z<=5.9;z+=.8){
    box(-6.06,2.78,z,.035,.18,.25,steel);
    box(6.06,2.78,z,.035,.18,.25,steel);
  }
  // Dedicated diegetic decals, no colored circles / floating signboards.
  panelLabels.forEach(s=>textMesh(s.text,s.x,s.y,s.z,s.w,'#d4f0f1'));
  // No background image, no sky: all directions are enclosed by geometry.
  window.EDA_SCENE_V4={materialCount:9,geometryCount:objects.length,theme:'warm contemporary studio'};
};
window.EDA_SceneV4={build:buildStudio};
