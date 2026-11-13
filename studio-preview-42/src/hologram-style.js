/* Shared projection language: cyan light, open corners and a wireframe emitter.
   Decoration never takes input and never crosses the reading area. */
const T=window.AFRAME?.THREE;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const projections=[];
function paint(ctx,w,h){
  ctx.clearRect(0,0,w,h);
  const g=ctx.createLinearGradient(0,0,w,0);
  g.addColorStop(0,'rgba(3,30,43,.72)');
  g.addColorStop(.12,'rgba(3,23,35,.93)');
  g.addColorStop(.88,'rgba(3,23,35,.93)');
  g.addColorStop(1,'rgba(3,30,43,.72)');
  ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
  // Scan texture stays in the margins; do not put scanlines over letters.
  for(let y=12;y<h;y+=12){ctx.fillStyle='rgba(76,227,244,.14)';ctx.fillRect(8,y,18,1);ctx.fillRect(w-26,y,18,1);}
  ctx.strokeStyle='rgba(87,227,247,.3)';ctx.lineWidth=1;ctx.strokeRect(1,1,w-2,h-2);
}
function decorate(parent,w=2.35,h=2.46){
  if(!T||parent.userData.projectionStyle)return;
  parent.userData.projectionStyle=true;
  const group=new T.Group();group.name='holographic-projector';parent.add(group);
  const mat=new T.LineBasicMaterial({color:'#51e5f4',transparent:true,opacity:.68,depthTest:false,depthWrite:false,toneMapped:false,blending:T.AdditiveBlending});
  const points=[];const x=w/2+.025,y=h/2+.025,l=.16;
  for(const sx of [-1,1])for(const sy of [-1,1]){
    points.push(new T.Vector3(sx*(x-l),sy*y,.012),new T.Vector3(sx*x,sy*y,.012),new T.Vector3(sx*x,sy*y,.012),new T.Vector3(sx*x,sy*(y-l),.012));
  }
  const corners=new T.LineSegments(new T.BufferGeometry().setFromPoints(points),mat);corners.renderOrder=53;group.add(corners);
  const emitter=new T.Group();emitter.position.y=-h/2-.13;group.add(emitter);
  for(const radius of [.18,.34,.54]){
    const p=[];for(let i=0;i<=96;i++){const a=i/96*Math.PI*2;p.push(new T.Vector3(Math.cos(a)*radius,0,Math.sin(a)*radius*.55));}
    const ring=new T.Line(new T.BufferGeometry().setFromPoints(p),mat);ring.renderOrder=53;emitter.add(ring);
  }
  const fan=[];
  for(let i=0;i<=10;i++)fan.push(new T.Vector3(0,-h/2-.12,0),new T.Vector3((i/10-.5)*w*.72,-h/2+.02,0));
  const beam=new T.LineSegments(new T.BufferGeometry().setFromPoints(fan),new T.LineBasicMaterial({color:'#39dfee',transparent:true,opacity:.18,depthTest:false,depthWrite:false,toneMapped:false,blending:T.AdditiveBlending}));beam.renderOrder=49;group.add(beam);
  const dots=[];
  for(let i=0;i<36;i++){const side=i%2?1:-1;dots.push(side*(w/2+.055+(i%3)*.018),-h/2+(i/36)*h,.01);}
  const geom=new T.BufferGeometry();geom.setAttribute('position',new T.Float32BufferAttribute(dots,3));
  const particles=new T.Points(geom,new T.PointsMaterial({color:'#76f1ff',size:.012,transparent:true,opacity:.4,depthTest:false,depthWrite:false,toneMapped:false,blending:T.AdditiveBlending}));particles.renderOrder=53;group.add(particles);
  projections.push({emitter,particles});return group;
}
window.EDA_HOLO_STYLE={paint,decorate};
if(!reduced){
  let last=0;
  function tick(t){requestAnimationFrame(tick);if(t-last<50)return;last=t;
    for(const p of projections){if(!p.emitter.parent?.parent?.visible)continue;p.emitter.rotation.y=t*.00012;p.particles.material.opacity=.34+Math.sin(t*.0012)*.08;}
  }
  requestAnimationFrame(tick);
}
