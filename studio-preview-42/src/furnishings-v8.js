/* Material-rich, proportioned furniture; replaces the earlier overlapping chairs. */
(function furnish(){
 const T=window.AFRAME?.THREE,room=document.querySelector('#office-furniture'),scene=document.querySelector('#office-scene');
 if(!T||!room)return;let built=false;
 function init(){
  if(built)return;if(!window.EDA_REALISM_V6?.ready){requestAnimationFrame(init);return;}built=true;
  const root=new T.Group();root.name='crafted-office-furniture';room.object3D.add(root);
  const mobile=matchMedia('(max-width:720px)').matches;
  let seed=47;const rnd=()=>((seed=seed*16807%2147483647)-1)/2147483646;
  function texture(kind){
   const c=document.createElement('canvas');c.width=c.height=512;const x=c.getContext('2d');
   x.fillStyle=kind==='oak'?'#b19a76':kind==='fabric'?'#545a58':kind==='ceramic'?'#c4bfb3':'#38593a';x.fillRect(0,0,512,512);
   for(let i=0;i<4500;i++){
    x.fillStyle=rnd()>.5?'rgba(255,244,219,.09)':'rgba(20,17,13,.10)';
    const a=rnd()*512,b=rnd()*512;
    x.fillRect(a,b,kind==='oak'?40+rnd()*200:1.2,kind==='oak'?.4:1.2);
   }
   if(kind==='fabric')for(let i=0;i<512;i+=3){x.fillStyle='#d9ded312';x.fillRect(i,0,1,512);x.fillStyle='#0c171422';x.fillRect(0,i,512,1);}
   if(kind==='leaf'){
    x.strokeStyle='#a9bd6955';x.lineWidth=3;x.beginPath();x.moveTo(256,0);x.lineTo(256,512);x.stroke();
    for(let y=20;y<512;y+=35){x.lineWidth=1;x.beginPath();x.moveTo(256,y);x.lineTo(25,y-65);x.moveTo(256,y);x.lineTo(487,y-65);x.stroke();}
   }
   const tx=new T.CanvasTexture(c);tx.colorSpace=T.SRGBColorSpace;tx.wrapS=tx.wrapT=T.RepeatWrapping;tx.anisotropy=Math.min(8,scene.renderer?.capabilities.getMaxAnisotropy()||4);return tx;
  }
  const cloth=texture('fabric'),wood=texture('oak'),clay=texture('ceramic'),leaf=texture('leaf');
  const fabric=new T.MeshStandardMaterial({map:cloth,color:'#a5a9a4',roughness:.95,bumpMap:cloth,bumpScale:.003});
  const oak=new T.MeshStandardMaterial({map:wood,color:'#eadcc6',roughness:.58,metalness:.02,bumpMap:wood,bumpScale:.002});
  const ceramic=new T.MeshStandardMaterial({map:clay,color:'#e4dfd4',roughness:.85,bumpMap:clay,bumpScale:.004});
  const metal=new T.MeshStandardMaterial({color:'#838b8e',metalness:.85,roughness:.32});
  const black=new T.MeshStandardMaterial({color:'#202525',roughness:.68});
  const soil=new T.MeshStandardMaterial({color:'#34291c',roughness:1});
  const leaves=new T.MeshStandardMaterial({map:leaf,color:'#b7caa1',roughness:.8,side:T.DoubleSide});
  function mesh(g,m,parent,x=0,y=0,z=0){const o=new T.Mesh(g,m);o.position.set(x,y,z);o.castShadow=!mobile;o.receiveShadow=true;parent.add(o);return o;}
  function rounded(w,h,d,r,m,parent,x,y,z){
   r=Math.min(r,w/3,h/3,d/3);const s=new T.Shape(),a=-w/2,b=-h/2;
   s.moveTo(a+r,b);s.lineTo(a+w-r,b);s.quadraticCurveTo(a+w,b,a+w,b+r);s.lineTo(a+w,b+h-r);s.quadraticCurveTo(a+w,b+h,a+w-r,b+h);s.lineTo(a+r,b+h);s.quadraticCurveTo(a,b+h,a,b+h-r);s.lineTo(a,b+r);s.quadraticCurveTo(a,b,a+r,b);
   const g=new T.ExtrudeGeometry(s,{depth:d-2*r,bevelEnabled:true,bevelSize:r*.6,bevelThickness:r,bevelSegments:3,steps:1,curveSegments:5});g.translate(0,0,-d/2+r);return mesh(g,m,parent,x,y,z);
  }
  function rod(a,b,r,m,parent){const p=new T.Vector3(...a),q=new T.Vector3(...b),o=mesh(new T.CylinderGeometry(r,r,p.distanceTo(q),10),m,parent);o.position.copy(p).add(q).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),q.sub(p).normalize());return o;}
  function chair(x,z,yaw,executive=false){
   const g=new T.Group();g.position.set(x,0,z);g.rotation.y=yaw;root.add(g);
   rounded(.63,.12,.62,.045,fabric,g,0,.52,0);
   const back=rounded(.61,executive?.77:.57,.11,.035,fabric,g,0,executive?.99:.88,.27);back.rotation.x=-.1;
   // Upholstery seams and lumbar ribs follow the backrest, not a second chair.
   const seam=new T.MeshStandardMaterial({color:'#747d77',roughness:1});
   for(let i=0;i<(executive?7:5);i++)rod([-.255,.68+i*.085,.335],[.255,.68+i*.085,.335],.003,seam,g);
   for(const side of [-1,1]){
    rod([side*.28,.44,.12],[side*.35,.74,.13],.018,metal,g);
    rounded(.085,.055,.36,.016,black,g,side*.35,.75,-.015);
   }
   rod([0,.12,0],[0,.47,0],.033,metal,g);
   for(let i=0;i<5;i++){
    const a=i*Math.PI*2/5,px=Math.cos(a)*.32,pz=Math.sin(a)*.32;
    rod([0,.17,0],[px,.10,pz],.018,metal,g);
    for(const dx of [-.022,.022]){const wheel=mesh(new T.CylinderGeometry(.043,.043,.027,16),black,g,px+dx,.052,pz);wheel.rotation.z=Math.PI/2;}
   }
   if(executive)rounded(.34,.16,.09,.025,fabric,g,0,1.45,.32);
  }
  chair(0,-2.9,0,true);
  for(let i=0;i<5;i++){const a=i*Math.PI*2/5,x=2.45+Math.cos(a)*1.34,z=2.2+Math.sin(a)*1.34;chair(x,z,Math.atan2(x-2.45,z-2.2));}
  function plant(x,z,height){
   const g=new T.Group();g.position.set(x,0,z);root.add(g);
   const profile=[new T.Vector2(.20,0),new T.Vector2(.24,.04),new T.Vector2(.28,.48),new T.Vector2(.28,.50),new T.Vector2(.25,.50),new T.Vector2(.24,.46)];
   mesh(new T.LatheGeometry(profile,32),ceramic,g);mesh(new T.CylinderGeometry(.245,.245,.018,24),soil,g,0,.46,0);
   for(let j=0;j<12;j++){
    const a=j*2.399,y=.65+rnd()*height,tx=Math.cos(a)*(.15+rnd()*.22),tz=Math.sin(a)*(.15+rnd()*.22);
    rod([0,.45,0],[tx,y,tz],.006,black,g);
    // Curved leaf surface with tapered silhouette and a central folded vein.
    const positions=[],uv=[],indices=[],len=.32+rnd()*.27;
    for(let row=0;row<=10;row++)for(let col=0;col<3;col++){
      const t=row/10,side=col-1,w=Math.sin(t*Math.PI)*.11;
      positions.push(side*w,t*len,Math.sin(t*Math.PI)*.045-Math.abs(side)*.024);
      uv.push(col/2,t);
      if(row<10&&col<2){const k=row*3+col;indices.push(k,k+3,k+1,k+1,k+3,k+4);}
    }
    const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(positions,3));geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geo.setIndex(indices);geo.computeVertexNormals();
    const o=mesh(geo,leaves,g,tx,y-.06,tz);o.rotation.set(.5+rnd()*.5,a,(rnd()-.5)*.7);
   }
  }
  plant(-5.28,3.37,.9);plant(5.15,3.55,1.1);plant(-5.30,-3.48,.8);
  // Rounded oak surfaces and practical desktop decoration.
  rounded(2.5,.09,1.05,.025,oak,root,-4.32,.81,-.05);
  const tabletop=mesh(new T.CylinderGeometry(.94,.94,.07,64),oak,root,2.45,.79,2.2);
  const paper=new T.MeshStandardMaterial({color:'#eae6da',roughness:.95});
  for(let i=0;i<3;i++){const b=rounded(.35,.045,.25,.008,new T.MeshStandardMaterial({color:['#586d58','#c5ac83','#3d5359'][i],roughness:.8}),root,1.3,.94+i*.048,-4.35);b.rotation.y=-.12;mesh(new T.BoxGeometry(.32,.025,.23),paper,b,0,0,.006);}
  const vase=mesh(new T.LatheGeometry([new T.Vector2(.07,0),new T.Vector2(.10,.05),new T.Vector2(.09,.18),new T.Vector2(.035,.28),new T.Vector2(.035,.32)],24),ceramic,root,-4.95,.87,.12);
  for(let i=0;i<4;i++)rod([-4.95,1.16,.12],[-4.95+(i-1.5)*.055,1.45+(i%2)*.1,.16],.003,oak,root);
  window.EDA_FURNITURE={ready:true,chairs:6,plants:3};
 }
 init();
})();
