(function hologramLogoStation(){
 const scene=document.querySelector('#office-scene'),stage=document.querySelector('#office-points');
 if(!scene||!stage||!window.AFRAME)return;
 let done=false;
 const projects=[
  {id:'peekdex',name:'PEEKDEX',asset:'/logos/peekdex-logo.png',x:-1.65,link:'https://peekdex.com'},
  {id:'iqbites',name:'IQ-BITES',asset:'/logos/iq-bites-logo.png',x:0,link:'https://iq-bites.com'},
  {id:'gube',name:'GUBE',asset:'/logos/gube-logo.png',x:1.65,link:'https://estacionamientogube.com.mx'}
 ];
 const status=()=>window.EDA_V4?.active;
 const add=(tag,parent,attrs={})=>{const e=document.createElement(tag);for(const [k,v] of Object.entries(attrs))e.setAttribute(k,v);parent.appendChild(e);return e};
 const groups=[];
 function build(){
  if(done)return;done=true;
  const root=add('a-entity',stage,{id:'eda-3d-logo-station',visible:false});
  projects.forEach((p,i)=>{
   const node=add('a-entity',root,{position:`${p.x} 2.04 -2.64`,rotation:`0 ${i===0?10:i===2?-10:0} 0`});
   add('a-plane',node,{width:'1.42',height:'1.37',position:'0 0 0',
    material:'color:#0a2939;transparent:true;opacity:0.84;side:double;metalness:0;roughness:0.35'});
   add('a-plane',node,{width:'1.37',height:'1.33',position:'0 0 0.009',
    material:'color:#64d3e7;transparent:true;opacity:0.14;wireframe:false;side:double'});
   add('a-image',node,{src:p.asset,width:'1.27',height:'.79',position:'0 .14 .034',
    material:'shader:flat;transparent:true;side:double;alphaTest:0.015'});
   add('a-text',node,{value:p.name,align:'center',color:'#e8faff',
    position:'0 -.46 .042',width:'3.6','wrap-count':'28',
    material:'color:#e8faff;shader:flat'});
   add('a-box',node,{width:'1.18',height:'.017',depth:'.025',position:'0 -.66 .031',
    material:'color:#78deea;emissive:#5bc9dd;emissiveIntensity:1.2'});
   const target=add('a-plane',node,{class:'interactive-object',width:'1.42',
    height:'1.37',position:'0 0 .075',
    material:'color:#ffffff;transparent:true;opacity:.005;depthWrite:false;side:double'});
   target.setAttribute('data-project-holo',p.id);
   target.addEventListener('mouseenter',()=>{
    node.setAttribute('scale','1.045 1.045 1');
    const help=document.querySelector('#status-help');
    if(help)help.textContent=p.name+' · Abrir su holograma de proyecto';
   });
   target.addEventListener('mouseleave',()=>node.setAttribute('scale','1 1 1'));
   target.addEventListener('click',e=>{
    e.stopPropagation();
    window.EDA_SPATIAL?.show?.('portafolio');
    const card=document.querySelector(`[data-project="${p.id}"]`);
    document.querySelectorAll('.eda-project').forEach(el=>el.classList.toggle('selected',el===card));
    card?.scrollIntoView({behavior:'smooth',block:'nearest',inline:'nearest'});
   });
   groups.push({node,i,x:p.x});
  });
  const laser=add('a-entity',root,{position:'0 .90 -2.64'});
  add('a-text',laser,{value:'PORTAFOLIO / TRES PROYECTOS',
   color:'#a5eef3',align:'center',width:'5.3',
   position:'0 0 0','side':'double'});
  let last=0,visible=false;
  function frame(t){
   if(!document.body.contains(scene))return;
   requestAnimationFrame(frame);
   if(t-last<55)return;last=t;
   const active=status();
   const p=document.querySelector('#player-rig')?.object3D?.position;
   const near=p&&Math.hypot(p.x,p.z+3.1)<2.5;
   const should=active==='portafolio' || (!active&&near);
   if(should!==visible){visible=should;root.setAttribute('visible',String(visible))}
   if(!visible)return;
   groups.forEach(({node,i})=>{
     const y=2.04+Math.sin(t*.00085+i*1.5)*.053;
     node.object3D.position.y=y;
   });
  }
  requestAnimationFrame(frame);
 }
 if(scene.hasLoaded)build();else scene.addEventListener('loaded',build,{once:true});
})();