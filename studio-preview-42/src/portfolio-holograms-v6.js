(function hologramLogoStation(){
 const scene=document.querySelector('#office-scene'),stage=document.querySelector('#office-points');
 if(!scene||!stage||!window.AFRAME)return;
 // Tint original silhouettes in the shader; source artwork stays unchanged.
 if(!AFRAME.shaders['mono-hologram']) AFRAME.registerShader('mono-hologram',{
  schema:{src:{type:'map',is:'uniform'},mode:{type:'number',is:'uniform',default:0}},
  vertexShader:'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
  fragmentShader:`uniform sampler2D src; uniform float mode; varying vec2 vUv;
   void main(){vec4 p=texture2D(src,vUv);float hi=max(p.r,max(p.g,p.b));float lo=min(p.r,min(p.g,p.b));float a;
    if(mode<.5){a=1.0-smoothstep(.68,.96,lo);}
    else if(mode<1.5){a=smoothstep(.12,.28,hi);}
    else{a=vUv.y>.38?smoothstep(.12,.35,hi-lo):1.0-smoothstep(.58,.95,lo);}
    a*=p.a;if(a<.03)discard;gl_FragColor=vec4(.50,.91,1.0,a*.94);
   }`
 });
 let done=false;
 const projects=[
  {id:'peekdex',name:'PEEKDEX',asset:'/logos/peekdex-logo.png',mode:1,height:.42,x:-2.1,link:'https://peekdex.com'},
  {id:'iqbites',name:'IQ-BITES',asset:'/logos/iq-bites-logo.png',mode:0,height:.48,x:0,link:'https://iq-bites.com'},
  {id:'gube',name:'GUBE',asset:'/logos/gube-logo.png',mode:2,height:.83,x:2.1,link:'https://estacionamientogube.com.mx'}
 ];
 const status=()=>window.EDA_V4?.active;
 const add=(tag,parent,attrs={})=>{const e=document.createElement(tag);for(const [k,v] of Object.entries(attrs))e.setAttribute(k,v);parent.appendChild(e);return e};
 const groups=[];
 const T=window.AFRAME.THREE;
 function caption(parent,lines,width,height,y){
   const c=document.createElement('canvas');c.width=768;c.height=Math.round(768*height/width);
   const cx=c.getContext('2d');cx.fillStyle='#071b2bf5';cx.fillRect(0,0,c.width,c.height);
   cx.textAlign='center';cx.textBaseline='middle';
   lines.forEach((line,i)=>{cx.font=(i===0?'600 ':'400 ')+(i===0?38:32)+'px Arial';cx.fillStyle=i===0?'#e8faff':'#bed4dd';cx.fillText(line,384,34+i*44);});
   const tx=new T.CanvasTexture(c);tx.colorSpace=T.SRGBColorSpace;
   const mesh=new T.Mesh(new T.PlaneGeometry(width,height),new T.MeshBasicMaterial({map:tx,transparent:true,depthTest:false,depthWrite:false,toneMapped:false}));
   mesh.position.set(0,y,.045);mesh.renderOrder=51;parent.object3D.add(mesh);
 }

 let selectedProject=0;
 document.addEventListener('eda:project-select',event=>{selectedProject=Math.max(0,Math.min(2,event.detail));});
 document.addEventListener('eda:project-open',()=>{if(status()==='portafolio'){window.EDA_SFX?.play('confirm');window.open(projects[selectedProject].link,'_blank','noopener,noreferrer');}});
 function build(){
  if(done)return;done=true;
  const root=add('a-entity',stage,{id:'eda-3d-logo-station',visible:false});
  projects.forEach((p,i)=>{
   const node=add('a-entity',root,{position:`${p.x} 2.3 -4.65`,rotation:`0 ${i===0?10:i===2?-10:0} 0`});
   add('a-plane',node,{width:'.96',height:String(p.height),position:'0 .06 .034',
    material:`shader:mono-hologram;src:${p.asset};mode:${p.mode};transparent:true;side:double;depthWrite:false;depthTest:false`});
   const descriptions=[['Comunidad de coleccionistas','Contenido y comercio digital'],['Marca de snacks','Identidad y experiencia de compra'],['Estacionamiento en Zapopan','Presencia y servicios digitales']];
   caption(node,[p.name,...descriptions[i]],1.82,.48,-.55);
   add('a-box',node,{width:'.85',height:'.017',depth:'.025',position:'0 -.63 .031',
    material:'color:#78deea;emissive:#5bc9dd;emissiveIntensity:1.2'});
   const target=add('a-plane',node,{class:'interactive-object',width:'1.08',
    height:'1.18',position:'0 0 .075',
    material:'color:#ffffff;transparent:true;opacity:.005;depthWrite:false;side:double'});
   target.setAttribute('data-project-holo',p.id);
   target.addEventListener('mouseenter',()=>{
    node.setAttribute('scale','1.045 1.045 1');
    const help=document.querySelector('#status-help');
    if(help)help.textContent=p.name+' · Abrir su página web';
   });
   target.addEventListener('mouseleave',()=>node.setAttribute('scale','1 1 1'));
   target.addEventListener('click',e=>{
    e.stopPropagation();
    if(status()!=='portafolio')return;
    window.EDA_SFX?.play('confirm');
    window.open(p.link,'_blank','noopener,noreferrer');
   });
   groups.push({node,i,x:p.x});
  });
  const laser=add('a-entity',root,{position:'0 1.15 -4.65'});
  caption(laser,['1–3: elegir proyecto  ·  E: visitar página'],3.5,.22,0);
  let last=0,visible=false;
  function frame(t){
   if(!document.body.contains(scene))return;
   requestAnimationFrame(frame);
   if(t-last<55)return;last=t;
   const active=status();
   const p=document.querySelector('#player-rig')?.object3D?.position;
   const near=p&&Math.hypot(p.x,p.z+3.1)<2.5;
   const should=active==='portafolio' || (!active&&near);
   if(should!==visible){visible=should;root.setAttribute('visible',String(visible));root.querySelectorAll('[data-project-holo]').forEach(el=>el.classList.toggle('interactive-object',visible));}
   if(!visible)return;
   groups.forEach(({node,i})=>{
     node.setAttribute('scale',i===selectedProject?'1.08 1.08 1.08':'1 1 1');
     const y=2.3+Math.sin(t*.00085+i*1.5)*.053;
     node.object3D.position.y=y;
   });
  }
  requestAnimationFrame(frame);
 }
 if(scene.hasLoaded)build();else scene.addEventListener('loaded',build,{once:true});
})();