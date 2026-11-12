/* Estudio de Autor v3: exploración isométrica con Canvas 2D, sin dependencias externas.
   Usa un mundo lógico y proyección espacial. No es realidad virtual ni física WebGL. */
(() => {
  'use strict';
  const root = document.getElementById('studio-app');
  const main = document.querySelector('.world-main');
  const canvas = document.getElementById('world-canvas');
  if (!root || !main || !canvas) return;
  const ctx = canvas.getContext('2d', { alpha:true });
  if (!ctx) return;
  const $ = selector => document.querySelector(selector);
  const $$ = selector => Array.from(document.querySelectorAll(selector));
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const stations = [
    { key:'servicios', name:'ESTUDIO', x:9, y:9, z:4.3, tone:'#8e8deb', accent:'#6065d9', number:'01' },
    { key:'portafolio', name:'ARCHIVO', x:21, y:10, z:4.3, tone:'#76bfb0', accent:'#438b8b', number:'02' },
    { key:'membresias', name:'MEMBRESÍAS', x:19, y:20, z:5.2, tone:'#f5be70', accent:'#db9055', number:'03' },
    { key:'diagnostico', name:'CONTACTO', x:7, y:19, z:4.4, tone:'#ff9276', accent:'#dc694b', number:'04' }
  ];
  const plans = {
    Inicio:{index:'01',hours:'30 MIN',price:790,tag:'Para un ajuste o una revisión muy puntual.',items:['30 minutos de trabajo mensual','Una microtarea o revisión breve','Seguimiento por escrito','Discord comunitario cuando se habilite'],limit:'No incluye crear una página completa.'},
    Impulso:{index:'02',hours:'1.5 HORAS',price:1990,tag:'Una mejora concreta cada vez.',items:['1.5 horas de trabajo mensual','Ajustes de web o contenido','Guion breve o diseño sencillo, según alcance','Discord comunitario cuando se habilite'],limit:'Las tareas se estiman antes de ejecutarse.'},
    Presencia:{index:'03',hours:'4 HORAS',price:4990,tag:'Una marca más cuidada, mes con mes.',items:['4 horas de trabajo mensual','Diseño para redes y contenidos','WordPress, UX y SEO según prioridad','Edición breve de video dentro de las horas'],limit:'No incluye producción ilimitada ni publicidad.'},
    Evolución:{index:'04',hours:'9 HORAS',price:10900,tag:'Construir por etapas, con dirección clara.',items:['9 horas de trabajo mensual','Desarrollo web por fases','Automatizaciones sencillas, previa evaluación','Contenido, diseño o video según la prioridad','Discord comunitario cuando se habilite'],limit:'Los proyectos complejos pueden requerir varias mensualidades.'},
    Integral:{index:'05',hours:'16 HORAS',price:19900,tag:'Un estudio creativo a tu lado.',items:['16 horas de trabajo mensual','Acceso a todas las categorías elegibles dentro del tiempo contratado','Web, identidad, video y automatización por fases','Prototipos de apps o Web3 sujetos a viabilidad','Salas de voz por Discord, con cita y al habilitarse'],limit:'Incluye amplitud de servicios, no horas ilimitadas ni soporte permanente.'}
  };
  let selectedPlan = 'Evolución';
  let screen = null;
  let lastFocus = null;
  let activeIntro = true;
  let enabledMotion = !prefersReduced.matches;
  const keys = new Set();
  const avatar = { x:13, y:13, heading:0, target:null, bob:0 };
  const cam = { x:13, y:13, offsetX:0, offsetY:0, zoom:1 };
  let width=0, height=0, dpr=1, ux=28, uy=15, last=0, introStartedAt=performance.now();
  let drag=null, cameraFreeUntil=0, currentNear=null, animId=0, lastFrame=0;
  const pins = new Map($$('.world-pin').map(el=>[el.dataset.station,el]));
  const drawer = $('#world-drawer');
  const scrim = $('#drawer-scrim');
  const locationLabel = $('#location-label');
  const status = $('#scene-status');
  const progressMarker = $('#progress-marker');
  const sceneNames = { servicios:'ESTUDIO / SERVICIOS', portafolio:'ARCHIVO DE PROYECTOS', membresias:'TORRE DE MEMBRESÍAS', diagnostico:'PUERTA DE ENTRADA' };
  let visited=new Set();
  function clamp(value,min,max){return Math.max(min,Math.min(max,value));}
  function lerp(a,b,t){return a+(b-a)*t;}
  function money(n){return '$'+n.toLocaleString('es-MX');}

  function resize(){
    const bounds=main.getBoundingClientRect(); width=bounds.width;height=bounds.height;
    dpr=Math.min(2,window.devicePixelRatio||1);
    canvas.width=Math.max(1,Math.round(width*dpr));canvas.height=Math.max(1,Math.round(height*dpr));
    canvas.style.width=width+'px';canvas.style.height=height+'px';
    ux=clamp(Math.min(width/34,height/22)*cam.zoom,15,43);uy=ux*.51;
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  function project(x,y,z=0){
    const drawerShift=screen?Math.min(95,width*.10):0;
    const originX=width*(width<681?.53:.62)-drawerShift+cam.offsetX;
    const originY=height*(width<681?.57:.53)+cam.offsetY;
    return {x:originX+((x-cam.x)-(y-cam.y))*ux,y:originY+((x-cam.x)+(y-cam.y))*uy-z*ux*.84};
  }
  function poly(points,fill,stroke,widthLine=1){ctx.beginPath();ctx.moveTo(points[0].x,points[0].y);for(let i=1;i<points.length;i++)ctx.lineTo(points[i].x,points[i].y);ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.lineWidth=widthLine;ctx.strokeStyle=stroke;ctx.stroke();}}
  function line(a,b,color,w=1,dash=[]){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.setLineDash(dash);ctx.strokeStyle=color;ctx.lineWidth=w;ctx.stroke();ctx.setLineDash([]);}
  function diamond(x,y,r,color,outline){poly([project(x-r,y,0),project(x,y-r,0),project(x+r,y,0),project(x,y+r,0)],color,outline);}
  function rectPlate(x,y,rx,ry,z,fill,outline){poly([project(x-rx,y-ry,z),project(x+rx,y-ry,z),project(x+rx,y+ry,z),project(x-rx,y+ry,z)],fill,outline);}
  function block(x,y,w,d,h,front,right,top,edge){
    const a=project(x-w/2,y-d/2,h), b=project(x+w/2,y-d/2,h), c=project(x+w/2,y+d/2,h), e=project(x-w/2,y+d/2,h);
    const bb=project(x+w/2,y-d/2,0),cc=project(x+w/2,y+d/2,0),ee=project(x-w/2,y+d/2,0);
    poly([b,c,cc,bb],right,edge||'#ffffff75',.6);poly([e,c,cc,ee],front,edge||'#ffffff65',.6);poly([a,b,c,e],top,edge||'#ffffffae',.75);
  }
  function shadow(x,y,rx,ry,alpha=.13){const p=project(x,y,0);ctx.beginPath();ctx.ellipse(p.x,p.y,rx*ux,ry*uy,0,0,Math.PI*2);ctx.fillStyle=`rgba(54,55,64,${alpha})`;ctx.fill();}
  function ring(x,y,r,color,lineWidth=1.2){ctx.beginPath();for(let i=0;i<=64;i++){const a=i/64*Math.PI*2;const p=project(x+Math.cos(a)*r,y+Math.sin(a)*r,.045);if(i===0)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y);}ctx.strokeStyle=color;ctx.lineWidth=lineWidth;ctx.stroke();}
  function titleLabel(x,y,z,text,color='#3b4250',size=11){const p=project(x,y,z);ctx.fillStyle=color;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`800 ${size}px 'Space Grotesk',Arial,sans-serif`;ctx.fillText(text,p.x,p.y);}
  function scenery(){
    // A floating, softly shadowed island: an explorable map rather than a background illustration.
    const bounds=[project(-1,-1,-.45),project(28,-1,-.45),project(28,28,-.45),project(-1,28,-.45)];
    poly(bounds,'#cacbd0',null);
    const base=[project(-1,-1,0),project(28,-1,0),project(28,28,0),project(-1,28,0)];
    poly([base[1],base[2],bounds[2],bounds[1]],'#c6c7cb');poly([base[2],base[3],bounds[3],bounds[2]],'#b7b9bb');
    for(let sum=0;sum<54;sum++)for(let x=0;x<27;x++){
      const y=sum-x;if(y<0||y>26)continue;
      const centerX=x+.5,centerY=y+.5;
      const nearPath=Math.abs(centerX-13)<1.2||Math.abs(centerY-13)<1.2;
      const patch=((x*3+y*7)%17<3);
      const fill=nearPath?'#f7f5ef':patch?'#eaeee8':((x+y)%2?'#e8e9e2':'#eeeee7');
      poly([project(x,y),project(x+1,y),project(x+1,y+1),project(x,y+1)],fill,'#c8ccc842',.45);
    }
    // Wayfinding: four roads from the center and thin dotted crossings.
    for(const st of stations){
      line(project(13,13,.1),project(st.x,st.y,.1),'#a7a9ba',2,[6,6]);
      ring(st.x,st.y,3.3,'#ffffffd0',1.6);
      ring(st.x,st.y,3.75,'#777b9336',1);
    }
    // Street furniture, art objects and stylized trees.
    for(let i=0;i<26;i++){
      let x=2+((i*17)%23),y=2+((i*11+6)%23);
      if(stations.some(s=>Math.hypot(s.x-x,s.y-y)<3.4)||Math.hypot(13-x,13-y)<2.5)continue;
      shadow(x,y,.52,.52,.09);
      block(x,y,.32,.32,.43,'#659e96','#76b5ab','#9dd1c0');
      const p=project(x,y,.71);ctx.fillStyle=i%2?'#b8c8a6':'#a3c7b9';ctx.beginPath();ctx.arc(p.x,p.y,ux*.29,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#ffffff88';ctx.lineWidth=1;ctx.stroke();
    }
    // Hub with central glyph, a recognizable navigation marker.
    shadow(13,13,3,2,.1);rectPlate(13,13,2.5,2.5,.05,'#dcdbe2','#ffffff');
    ring(13,13,1.7,'#928fe3a5',2);ring(13,13,1.05,'#ffffff',1);
    titleLabel(13,13,0.15,'E · A','#8587a3',Math.round(clamp(ux*.55,10,20)));
    for(let k=0;k<4;k++){const a=k*Math.PI/2;const x=13+Math.cos(a)*2.2,y=13+Math.sin(a)*2.2;block(x,y,.34,.34,.26,'#8c8de5','#6b70bf','#d3d2f9');}
  }
  function stationBuilding(s,time){
    const {x,y,key}=s;
    shadow(x,y,3.8,2.9,.16);
    rectPlate(x,y,2.9,2.9,.03,'#f8f8f5','#fafafa');
    ring(x,y,2.8,s.accent+'87',2);
    if(key==='servicios'){
      block(x-.7,y+.5,2.7,2.1,2.3,'#6663bc','#7d7acf','#c6c5f9');
      block(x+.8,y-.55,2.1,1.45,3.3,'#5358a5','#6868c8','#bab7f6');
      block(x-.6,y-.5,1.05,1.05,.5,'#7e8fd6','#8993d8','#ffffff');
      // Interface plaque on the front face.
      const c=project(x-.65,y+1.75,1.25);ctx.fillStyle='#e9ecff';ctx.fillRect(c.x-25,c.y-15,50,25);
      ctx.fillStyle='#5756b9';ctx.fillRect(c.x-18,c.y-9,18,4);ctx.fillRect(c.x-18,c.y-1,34,3);ctx.fillStyle='#ff8a65';ctx.fillRect(c.x+7,c.y-9,9,4);
      titleLabel(x+.8,y-.55,3.6,'✳','#5351b5',Math.round(clamp(ux*.83,16,33)));
    } else if(key==='portafolio'){
      block(x,y,3.65,2.7,1.5,'#5d978d','#77b7ab','#cde7dd');
      for(let i=-1;i<=1;i++){
        const xx=x+i*.9,yy=y-.6;
        block(xx,yy,.56,.64,2.15+(i+1)*.22,'#4f8f8a','#5fa29d',i===0?'#f7dfb9':'#f2f5ed');
        const p=project(xx,yy,2.7+(i+1)*.22);ctx.fillStyle=i===0?'#f1a36f':'#ffffff';ctx.beginPath();ctx.arc(p.x,p.y,ux*.17,0,Math.PI*2);ctx.fill();
      }
      titleLabel(x,y,1.85,'WORK / 03','#eafff7',Math.round(clamp(ux*.31,9,14)));
    } else if(key==='membresias'){
      block(x,y,4,2.4,.54,'#bd8b5e','#d6a56f','#fbe6bf');
      for(let i=0;i<5;i++){
        const xx=x+(i-2)*.72, yy=y-.65;
        const ht=.85+i*.58;
        block(xx,yy,.52,.72,ht,'#bd8b69','#dca77b',i===4?'#eec482':'#fff5dd');
        titleLabel(xx,yy,ht+.16,String(i+1),'#5d5261',Math.round(clamp(ux*.29,8,12)));
      }
      titleLabel(x,y+1.05,.8,'PLANES','#7e5c4c',Math.round(clamp(ux*.32,8,13)));
    } else {
      block(x,y,3,2.7,1.2,'#e07d64','#ec9474','#ffe2be');
      block(x-.4,y-.3,1.7,1.6,3,'#da6a57','#ee8b6f','#ffcab3');
      block(x+.6,y+.25,.82,.82,2.1,'#c95a50','#dc7e63','#fff2db');
      const p=project(x-.4,y-.3,3.25);ctx.fillStyle='#fffdf5';ctx.beginPath();ctx.arc(p.x,p.y,ux*.27,0,Math.PI*2);ctx.fill();
      titleLabel(x-.4,y-.3,3.25,'↗','#d66f59',Math.round(clamp(ux*.44,11,17)));
    }
    // Dynamic glimmer only on active / approached station.
    if(currentNear===key && enabledMotion){
      const p=project(x,y,s.z+.2),radius=4+Math.sin(time/220)*2;
      ctx.strokeStyle=s.accent;ctx.lineWidth=2;ctx.beginPath();ctx.arc(p.x,p.y,radius,0,Math.PI*2);ctx.stroke();
    }
  }
  function drawAvatar(time){
    const {x,y}=avatar;
    shadow(x,y,.65,.51,.22);
    const float=enabledMotion?.14*Math.sin(time/260):0;
    block(x,y,.86,1.1,.4+float,'#373f4b','#56616c','#fefefe','#fefefe');
    block(x,y-.17,.49,.52,.71+float,'#ec7158','#fe9f68','#ffc9a5');
    const nose=project(x+.22,y-.33,1.07+float);ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(nose.x,nose.y,ux*.13,0,Math.PI*2);ctx.fill();
    const one=project(x-.51,y-.41,.15),two=project(x+.43,y+.42,.15);
    for(const p of [one,two]){ctx.fillStyle='#29303a';ctx.beginPath();ctx.arc(p.x,p.y,ux*.23,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(p.x,p.y,ux*.09,0,Math.PI*2);ctx.fill();}
    const bubble=project(x,y,1.42+float);ctx.beginPath();ctx.ellipse(bubble.x,bubble.y,ux*.19,ux*.10,0,0,Math.PI*2);ctx.fillStyle='#8488f9';ctx.fill();
  }
  function draw(time){
    if(width<1||height<1)return;
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);
    ctx.save();ctx.shadowColor='#2b354535';ctx.shadowBlur=37;ctx.shadowOffsetY=31;
    const plate=[project(-1,-1,-.48),project(28,-1,-.48),project(28,28,-.48),project(-1,28,-.48)];poly(plate,'#c8c9cc');ctx.restore();
    scenery();
    // Draw all elevated objects in depth order.
    const objects=[...stations.map(s=>({kind:'station',p:s.x+s.y,station:s})),{kind:'avatar',p:avatar.x+avatar.y}].sort((a,b)=>a.p-b.p);
    for(const o of objects){if(o.kind==='station')stationBuilding(o.station,time);else drawAvatar(time);}
    stations.forEach(s=>{
      const el=pins.get(s.key);if(!el)return;
      const p=project(s.x,s.y,s.z+.45);
      const r=el.getBoundingClientRect();
      const visible=p.x>65&&p.x<width-65&&p.y>85&&p.y<height-65;
      el.style.left=p.x+'px';el.style.top=p.y+'px';
      el.classList.toggle('is-visible',visible);
      el.classList.toggle('is-near',currentNear===s.key);
      if(activeIntro && s.key==='diagnostico')el.style.opacity='0';else el.style.opacity='';
    });
  }
  function nearestStation(){let best=null,d=Infinity;for(const s of stations){const dist=Math.hypot(avatar.x-s.x,avatar.y-s.y);if(dist<d){best=s;d=dist;}}return d<3.35?best:null;}
  function update(dt,time){
    const before={x:avatar.x,y:avatar.y};
    const keysDown= keys.has('ArrowUp')||keys.has('w')||keys.has('ArrowDown')||keys.has('s')||keys.has('ArrowLeft')||keys.has('a')||keys.has('ArrowRight')||keys.has('d');
    if(keysDown){avatar.target=null;if(activeIntro)setIntro(false);}
    let vx=0,vy=0;
    const up=keys.has('ArrowUp')||keys.has('w'),down=keys.has('ArrowDown')||keys.has('s'),left=keys.has('ArrowLeft')||keys.has('a'),right=keys.has('ArrowRight')||keys.has('d');
    if(up){vx-=1;vy-=1}if(down){vx+=1;vy+=1}if(left){vx-=1;vy+=1}if(right){vx+=1;vy-=1}
    const norm=Math.hypot(vx,vy)||1;
    const speed=keys.has('Shift')?7.6:4.5;
    if(vx||vy){avatar.x+=vx/norm*speed*dt;avatar.y+=vy/norm*speed*dt;}
    else if(avatar.target){const dx=avatar.target.x-avatar.x,dy=avatar.target.y-avatar.y,dist=Math.hypot(dx,dy);if(dist>.1){const step=Math.min(dist,5.4*dt);avatar.x+=dx/dist*step;avatar.y+=dy/dist*step;}else avatar.target=null;}
    avatar.x=clamp(avatar.x,1.2,26.5);avatar.y=clamp(avatar.y,1.2,26.5);
    if(avatar.x!==before.x||avatar.y!==before.y){avatar.heading=Math.atan2(avatar.y-before.y,avatar.x-before.x);cameraFreeUntil=Math.min(cameraFreeUntil,time+30);}
    if(time>cameraFreeUntil){const k=1-Math.pow(.005,dt);cam.x=lerp(cam.x,avatar.x,k);cam.y=lerp(cam.y,avatar.y,k);cam.offsetX=lerp(cam.offsetX,0,k*.6);cam.offsetY=lerp(cam.offsetY,0,k*.6);}
    const near=nearestStation();currentNear=near?.key||null;
    if(near){locationLabel.textContent=sceneNames[near.key]+' · PULSA E';}else locationLabel.textContent='PLAZA CENTRAL';
    progressMarker.style.left=Math.round(visited.size/4*85)+'px';
    $('#visited-count').textContent=String(visited.size).padStart(2,'0')+'/04';
  }
  function frame(time){
    if (time-lastFrame<32) {animId=requestAnimationFrame(frame);return;}
    lastFrame=time;const dt=last?Math.min(.065,(time-last)/1000):.016;last=time;
    update(dt,time);draw(time);animId=requestAnimationFrame(frame);}
  resize();window.addEventListener('resize',resize);
  if(prefersReduced.addEventListener)prefersReduced.addEventListener('change',ev=>{if(ev.matches){enabledMotion=false;$('#motion-toggle').setAttribute('aria-pressed','true');}});
  animId=requestAnimationFrame(frame);

  function setIntro(show){activeIntro=show;$('#hero-intro').classList.toggle('is-minimized',!show);if(!show){main.classList.add('is-exploring');$('#movement-guide').classList.add('is-started');}else{main.classList.remove('is-exploring');}}
  function startExplore(){setIntro(false);canvas.focus({preventScroll:true});}
  $('#explore-button').addEventListener('click',startExplore);
  $('#home-link').addEventListener('click',e=>{e.preventDefault();closeDrawer();avatar.x=13;avatar.y=13;avatar.target=null;cam.x=13;cam.y=13;cam.offsetX=0;cam.offsetY=0;setIntro(true);});
  $('#reset-camera').addEventListener('click',()=>{avatar.x=13;avatar.y=13;avatar.target=null;cam.x=13;cam.y=13;cam.offsetX=0;cam.offsetY=0;cam.zoom=1;resize();setIntro(true);closeDrawer();});
  const motionToggle=$('#motion-toggle');motionToggle.addEventListener('click',()=>{enabledMotion=!enabledMotion;motionToggle.setAttribute('aria-pressed',String(!enabledMotion));motionToggle.innerHTML=enabledMotion?'◌ <span>REDUCIR MOVIMIENTO</span>':'◉ <span>ACTIVAR MOVIMIENTO</span>';});

  function showScreen(name){
    if(!['servicios','portafolio','membresias','diagnostico','privacidad'].includes(name))return;
    setIntro(false);const firstOpen=!screen;screen=name;
    visited.add(name==='privacidad'?'diagnostico':name);
    $('#drawer-step').textContent='ESTACIÓN / '+(stations.find(s=>s.key===name)?.number||'INFO');
    $$('.screen').forEach(el=>el.classList.toggle('is-current',el.dataset.screenContent===name));
    drawer.removeAttribute('inert');drawer.classList.add('is-open');drawer.setAttribute('aria-hidden','false');scrim.classList.add('is-visible');root.classList.add('drawer-open');
    drawer.querySelector('.drawer-content').scrollTop=0;
    if(firstOpen)lastFocus=document.activeElement;
    $('#close-drawer').focus({preventScroll:true});
  }
  function closeDrawer(){if(!screen)return;screen=null;drawer.classList.remove('is-open');drawer.setAttribute('aria-hidden','true');scrim.classList.remove('is-visible');root.classList.remove('drawer-open');if(lastFocus instanceof HTMLElement && document.contains(lastFocus))lastFocus.focus({preventScroll:true});drawer.setAttribute('inert','');}
  $('#close-drawer').addEventListener('click',closeDrawer);scrim.addEventListener('click',closeDrawer);
  $$('[data-screen]').forEach(el=>el.addEventListener('click',()=>{showScreen(el.dataset.screen);hideMenu();}));
  $$('.world-pin').forEach(el=>el.addEventListener('click',()=>{const s=stations.find(x=>x.key===el.dataset.station);if(s){avatar.target={x:s.x+.9,y:s.y+1.4};showScreen(s.key);}}));
  function hideMenu(){$('#menu-mundo').classList.remove('is-open');$('#menu-toggle').setAttribute('aria-expanded','false');}
  $('#menu-toggle').addEventListener('click',()=>{const e=$('#menu-toggle').getAttribute('aria-expanded')==='true';$('#menu-toggle').setAttribute('aria-expanded',String(!e));$('#menu-mundo').classList.toggle('is-open',!e);});

  function showPlan(name){const plan=plans[name];if(!plan)return;selectedPlan=name;
    $$('.plan-choice').forEach(el=>{const current=el.dataset.plan===name;el.classList.toggle('current',current);el.setAttribute('aria-selected',String(current));});
    $('#plan-numeral').textContent='NIVEL '+plan.index;$('#plan-time').textContent=plan.hours+'/MES';$('#plan-name').textContent=name;$('#plan-tagline').textContent=plan.tag;$('#plan-price').textContent=money(plan.price);$('#plan-caveat').textContent=plan.limit;
    const ul=$('#plan-items');ul.replaceChildren();for(const text of plan.items){const li=document.createElement('li');li.textContent=text;ul.appendChild(li);}
    $('#form-plan').value=name;
  }
  $$('.plan-choice').forEach(el=>el.addEventListener('click',()=>showPlan(el.dataset.plan)));
  $('#choose-plan').addEventListener('click',()=>{$('#form-plan').value=selectedPlan;showScreen('diagnostico');});
  $('#form-plan').addEventListener('change',event=>showPlan(event.target.value));showPlan('Evolución');

  const form=$('#studio-form'),feedback=$('#form-feedback'),submit=$('#form-submit');
  function feedbackMsg(text,error){feedback.textContent=text;feedback.classList.toggle('is-shown',!!text);feedback.classList.toggle('is-error',!!error);}
  form.addEventListener('submit',async event=>{
    event.preventDefault();if(!form.reportValidity()){feedbackMsg('Completa los campos obligatorios para enviar tu proyecto.',true);return;}
    const description=String(form.elements.namedItem('description').value).trim();if(description.length<15){feedbackMsg('Cuéntanos al menos 15 caracteres sobre tu necesidad.',true);return;}
    if(!window.EstudioConfig || !window.EstudioConfig.ajaxUrl){feedbackMsg('Esta es una demostración: la solicitud no se enviará hasta instalar el tema en WordPress.',true);return;}
    const data=new FormData(form);data.append('action','eda_submit_lead');data.append('nonce',window.EstudioConfig.nonce);
    submit.disabled=true;submit.textContent='Enviando solicitud…';feedbackMsg('',false);
    try{const response=await fetch(window.EstudioConfig.ajaxUrl,{method:'POST',body:data,credentials:'same-origin'});const result=await response.json();if(!response.ok||!result.success)throw new Error(result.data?.message||'No se pudo registrar.');
      feedbackMsg('Solicitud recibida. Tu folio es '+result.data.folio+'. Revisaremos la viabilidad y nuestra agenda antes de ofrecer un cobro.',false);form.reset();$('#form-plan').value=selectedPlan;
    }catch(err){feedbackMsg(err.message||'No se pudo enviar el formulario.',true);}finally{submit.disabled=false;submit.innerHTML='Enviar solicitud <span>↗</span>';}
  });

  document.addEventListener('keydown',e=>{
    const typing=e.target instanceof HTMLElement && (['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)||e.target.isContentEditable);
    if(e.key==='Escape'){hideMenu();closeDrawer();return;}
    if(typing || screen)return;
    if(['w','a','s','d','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Shift'].includes(e.key)){keys.add(e.key);if(e.key.startsWith('Arrow'))e.preventDefault();}
    if(e.key.toLowerCase()==='e'&&currentNear){showScreen(currentNear);e.preventDefault();}
  });
  document.addEventListener('keyup',e=>keys.delete(e.key));window.addEventListener('blur',()=>keys.clear());
  $$('#touch-controller [data-drive]').forEach(el=>{
    const key={up:'ArrowUp',down:'ArrowDown',left:'ArrowLeft',right:'ArrowRight'}[el.dataset.drive];
    const press=e=>{e.preventDefault();keys.add(key);el.classList.add('is-down');setIntro(false);if(el.setPointerCapture)el.setPointerCapture(e.pointerId);};
    const release=()=>{keys.delete(key);el.classList.remove('is-down');};
    el.addEventListener('pointerdown',press);el.addEventListener('pointerup',release);el.addEventListener('pointercancel',release);el.addEventListener('lostpointercapture',release);
  });
  canvas.addEventListener('pointerdown',e=>{if(screen)return;drag={x:e.clientX,y:e.clientY,initialX:cam.offsetX,initialY:cam.offsetY,downX:e.clientX,downY:e.clientY};canvas.classList.add('is-grabbing');if(canvas.setPointerCapture)canvas.setPointerCapture(e.pointerId);});
  canvas.addEventListener('pointermove',e=>{if(!drag)return;cam.offsetX=clamp(drag.initialX+(e.clientX-drag.x),-width*.6,width*.6);cam.offsetY=clamp(drag.initialY+(e.clientY-drag.y),-height*.55,height*.55);cameraFreeUntil=performance.now()+3400;});
  canvas.addEventListener('pointerup',e=>{
    if(!drag)return;const dx=e.clientX-drag.downX,dy=e.clientY-drag.downY;drag=null;canvas.classList.remove('is-grabbing');
    if(Math.hypot(dx,dy)<8){const origin=project(cam.x,cam.y);const a=(e.clientX-main.getBoundingClientRect().left-origin.x)/ux;const b=(e.clientY-main.getBoundingClientRect().top-origin.y)/uy;const x=clamp(cam.x+(a+b)/2,1.2,26.5),y=clamp(cam.y+(b-a)/2,1.2,26.5);avatar.target={x,y};setIntro(false);}
  });
  canvas.addEventListener('pointercancel',()=>{drag=null;canvas.classList.remove('is-grabbing');});
  canvas.addEventListener('wheel',e=>{if(screen)return;e.preventDefault();cam.zoom=clamp(cam.zoom+(e.deltaY<0?.09:-.09),.65,1.35);resize();},{passive:false});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)keys.clear();});
})();