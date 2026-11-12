(function studioCinema() {
 "use strict";
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 let played=false;try{played=sessionStorage.getItem('eda-intro-played')==='1'}catch(_){}
 const section=document.createElement('section');
 section.id='eda-cinema';
 section.setAttribute('role','dialog');
 section.setAttribute('aria-modal','true');
 section.setAttribute('aria-label','Cinemática de introducción de Estudio de Autor');
 section.innerHTML=`
 <div class="cin-grid"></div><div class="cin-orbit"></div><div class="cin-sweep"></div><div class="cin-shimmer"></div>
 <div class="cin-noise"></div><div class="cin-vignette"></div><div class="cin-frame"></div>
 <div class="cin-top"><span class="cin-label">ESTUDIO DE AUTOR / FILM 01</span>
   <button id="cin-skip" class="cin-skip" type="button">OMITIR INTRO ✕</button></div>
 <div class="cin-shot" data-shot="0"><span class="cin-counter">01 / EL ORIGEN</span>
   <h2 class="cin-line">TODO EMPIEZA<br>CON <em class="accent">UNA IDEA.</em></h2>
   <p class="cin-blurb">Cada proyecto empieza con una posibilidad.</p></div>
 <div class="cin-shot" data-shot="1"><span class="cin-counter">02 / LA ENERGÍA</span>
   <h2 class="cin-line">PIENSA.<br><em class="warm">CREA.</em><br>TRANSFORMA.</h2>
   <p class="cin-blurb">Convertimos la imaginación en algo tangible.</p></div>
 <div class="cin-shot" data-shot="2"><span class="cin-counter">03 / LA ACCIÓN</span>
   <h2 class="cin-line">EL FUTURO<br>SE <em class="accent">CONSTRUYE.</em></h2>
   <p class="cin-blurb">Diseño, tecnología, estrategia y una perspectiva diferente.</p></div>
 <div class="cin-shot" data-shot="3"><span class="cin-counter">04 / BIENVENIDO</span>
   <h2 class="cin-wordmark">ESTUDIO<br><em>DE AUTOR.</em></h2>
   <p class="cin-tagline">IDEAS QUE MERECEN UN ESPACIO PROPIO</p>
   <button type="button" id="cin-enter" class="cin-enter">ENTRAR AL ESTUDIO ↗</button></div>
 <div class="cin-bottom"><span class="cin-clock" id="cin-clock">00:00 / 00:13</span>
   <div class="cin-progress"><span id="cin-progress"></span></div>
   <button type="button" class="cin-sound" id="cin-sound" aria-pressed="false">◌ SONIDO APAGADO</button></div>`;
 const replay=document.createElement('button');
 replay.id='eda-replay-cinema';replay.type='button';replay.textContent='↺ Ver presentación';
 replay.style.cssText='position:fixed;right:17px;bottom:100px;z-index:80;border:1px solid #d7e8e78c;border-radius:99px;background:#10232de6;color:white;padding:10px 15px;font:800 11px Arial;cursor:pointer;display:none';
 document.body.append(section,replay);
 const q=s=>section.querySelector(s),shots=[...section.querySelectorAll('.cin-shot')];
 const steps=[0,2520,5460,8860],total=13600;
 let raf=0,start=0,current=-1,done=false,mute=true,audio=null;
 let three=null,renderer=null,scene=null,camera=null,group=null,shards=[],width=0,height=0;
 const playTone=(freq=250)=>{
   if(mute)return;
   try{audio=audio||new (window.AudioContext||window.webkitAudioContext)();
    const oscillator=audio.createOscillator(),volume=audio.createGain(),now=audio.currentTime;
    oscillator.type='sine';oscillator.frequency.setValueAtTime(freq,now);
    oscillator.frequency.exponentialRampToValueAtTime(freq*.5,now+.24);
    volume.gain.setValueAtTime(.025,now);volume.gain.exponentialRampToValueAtTime(.0001,now+.24);
    oscillator.connect(volume).connect(audio.destination);oscillator.start();oscillator.stop(now+.25)}catch(_){}
 };
 function resize(){
   if(!renderer)return;
   width=innerWidth;height=innerHeight;
   renderer.setSize(width,height,false);renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.6));
   camera.aspect=width/height;camera.updateProjectionMatrix();
 }
 function initThree(){
   three=window.AFRAME?.THREE;if(!three||renderer)return;
   try{
     renderer=new three.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});
     renderer.outputColorSpace=three.SRGBColorSpace;
     renderer.toneMapping=three.ACESFilmicToneMapping;
     renderer.toneMappingExposure=1.75;
     renderer.domElement.style.cssText='position:absolute;inset:0;width:100%;height:100%;z-index:0;pointer-events:none';
     section.insertBefore(renderer.domElement,section.firstChild);
     scene=new three.Scene();camera=new three.PerspectiveCamera(40,1,.1,100);
     group=new three.Group();
     const chrome=new three.MeshPhysicalMaterial({color:0xbcdce8,metalness:.91,roughness:.14,clearcoat:.7,clearcoatRoughness:.1});
     const dark=new three.MeshPhysicalMaterial({color:0x233843,metalness:.82,roughness:.23});
     const halo=new three.MeshBasicMaterial({color:0x8ed9e2});
     function bar(x,y,z,w,h,d,angle=0){
       const mesh=new three.Mesh(new three.BoxGeometry(w,h,d),chrome);
       mesh.position.set(x,y,z);mesh.rotation.z=angle;group.add(mesh);
     }
     bar(-1,0,0,.22,2.2,.25);for(const y of [-1,0,1])bar(-.52,y,0,1.13,.18,.26);
     bar(.48,0,0,.24,2.4,.27,-.37);bar(1.34,0,0,.24,2.4,.27,.37);
     bar(.9,-.25,0,.91,.2,.28);
     const ring=new three.Mesh(new three.TorusGeometry(2.15,.018,8,120),dark);ring.rotation.y=.54;group.add(ring);
     const ring2=new three.Mesh(new three.TorusGeometry(2.45,.01,8,120),halo);ring2.rotation.x=.67;group.add(ring2);
     scene.add(group);
     const shape=new three.TetrahedronGeometry(.043,0);
     for(let i=0;i<65;i++){
       const mesh=new three.Mesh(shape,i%5?chrome:halo);
       mesh.userData={a:i*2.4,rad:.6+(i%16)*.21};
       scene.add(mesh);shards.push(mesh);
     }
     scene.add(new three.AmbientLight(0xc1dbeb,1.7));
     const key=new three.PointLight(0xe8f5fb,115);key.position.set(-3,3,4);scene.add(key);
     const rim=new three.PointLight(0x91b7ff,110);rim.position.set(3,3,-2);scene.add(rim);
     const warm=new three.PointLight(0xffc08f,85);warm.position.set(-2,-3,3);scene.add(warm);
     window.addEventListener('resize',resize,{passive:true});resize();
   }catch(e){console.warn('Apertura cinematográfica con respaldo visual',e);disposeThree()}
 }
 function render3D(ms){
   if(!renderer||!scene)return;
   const t=ms/1000;
   camera.position.set(0,.3,10-ms/total*2);
   camera.lookAt(0,0,0);
   group.position.x=width<720?1:2.5;
   group.position.y=width<720?1.35:0;
   group.scale.setScalar(width<720?.58:1);
   group.rotation.y=t*.24;group.rotation.x=Math.sin(t*.32)*.11;
   shards.forEach((m,i)=>{
      const x=m.userData;
      m.position.set(Math.cos(x.a+t*.5)*x.rad+group.position.x,
        Math.sin(x.a+t*.31)*x.rad*.6+group.position.y,Math.cos(x.a*1.8+t*.19)*1.1);
      m.rotation.set(t*.2+i,t*.5+i,0);
   });
   renderer.render(scene,camera);
 }
 function disposeThree(){
   window.removeEventListener('resize',resize);
   try{scene?.traverse(o=>{o.geometry?.dispose();if(o.material && !o.material.isShared)o.material.dispose()});renderer?.dispose();renderer?.domElement.remove()}catch(_){}
   renderer=null;scene=null;camera=null;group=null;shards=[];
 }
 function shot(i){
   if(i===current)return;current=i;shots.forEach((el,j)=>el.classList.toggle('active',j===i));
   section.classList.toggle('is-finale',i===3);playTone(185+i*80);
 }
 function loop(t){
   if(done)return;
   if(!start)start=t;
   const n=Math.min(total,t-start),second=String(Math.floor(n/1000)).padStart(2,'0');
   let index=0;while(index<3&&n>=steps[index+1])index++;
   shot(index);q('#cin-clock').textContent='00:'+second+' / 00:13';
   q('#cin-progress').style.width=(n/total*100)+'%';
   render3D(n);
   if(n>=total){finish();return}
   raf=requestAnimationFrame(loop);
 }
 function finish(){
   if(done)return;done=true;cancelAnimationFrame(raf);
   try{sessionStorage.setItem('eda-intro-played','1')}catch(_){}
   section.classList.add('cin-leaving');
   setTimeout(()=>{
     section.hidden=true;section.classList.remove('cin-leaving');replay.style.display='block';
     disposeThree();
   },reduce?10:880);
 }
 function begin(force=false){
   if((played||reduce)&&!force){section.hidden=true;replay.style.display='block';return}
   done=false;start=0;current=-1;section.hidden=false;section.classList.remove('cin-leaving');
   replay.style.display='none';initThree();raf=requestAnimationFrame(loop);
 }
 q('#cin-skip').addEventListener('click',finish);
 q('#cin-enter').addEventListener('click',finish);
 q('#cin-sound').addEventListener('click',async()=>{
    mute=!mute;if(!mute){try{audio=audio||new (window.AudioContext||window.webkitAudioContext)();await audio.resume();playTone(240)}catch(_){mute=true}}
    q('#cin-sound').setAttribute('aria-pressed',String(!mute));
    q('#cin-sound').textContent=mute?'◌ SONIDO APAGADO':'◉ SONIDO ACTIVO';
 });
 replay.addEventListener('click',()=>begin(true));
 window.EDA_CINEMA={replay:()=>begin(true),skip:finish};
 begin();
})();