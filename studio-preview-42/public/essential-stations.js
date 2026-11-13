/* Interactive, world-anchored holograms; no modal or sidebar. */
(function spatialStations() {
  'use strict';
  const names = ['servicios', 'portafolio', 'membresias', 'discord', 'diagnostico'];
  const plans = [
    { name: 'Inicio', price: 790, hours: '30 minutos', items: ['Una revisión o microtarea acordada', 'Seguimiento por escrito'], limit: 'No incluye crear una página completa.' },
    { name: 'Impulso', price: 1990, hours: '1.5 horas', items: ['Ajustes web o contenido', 'Diseño o guion breve dentro de las horas', 'Seguimiento por escrito'], limit: 'Cada tarea se estima antes de iniciar.' },
    { name: 'Presencia', price: 4990, hours: '4 horas', items: ['Contenido y diseño para redes', 'WordPress, UX o SEO básico', 'Edición breve de video según horas'], limit: 'No incluye publicidad ni piezas ilimitadas.' },
    { name: 'Evolución', price: 10900, hours: '9 horas', items: ['Mejoras web por etapas', 'Automatizaciones sencillas evaluadas', 'Diseño, guiones, contenido y video'], limit: 'Los proyectos complejos se realizan por fases.' },
    { name: 'Integral', price: 19900, hours: '16 horas', items: ['Web, contenido e identidad por fases', 'Automatizaciones y prototipos viables', 'Discord y voz por cita al habilitarse'], limit: 'No incluye trabajo ilimitado ni soporte 24/7.' }
  ];
  let selected = 3, initialized = false, expanded = false, briefOpen = false, pendingStation = null;
  let controls, details, methods, status, redrawDetails, brief, legal;
  const style = document.createElement('style');
  style.textContent = `#essential-overlay,#eda-spatial-ui,.panel-scrim,.detail-panel{display:none!important}
    #discord-world-widget{position:absolute;width:350px;height:500px;transform-origin:50% 50%;z-index:24;border:1px solid #9ceeff90;border-radius:12px;box-shadow:0 0 24px #70e9ff40;opacity:0;visibility:hidden;pointer-events:none;transition:opacity .28s;overflow:hidden;background:#071b29}
    #discord-world-widget.is-visible{opacity:.97;visibility:visible;pointer-events:auto}
    #discord-world-widget iframe{width:100%;height:100%;border:0}
    #discord-world-widget p{padding:28px;color:#e8fcff;font:16px/1.6 Arial}
    #discord-world-widget button{position:absolute;right:8px;top:8px;color:white;background:#123549;border:1px solid #8deaff;border-radius:4px;cursor:pointer}`;
  style.textContent+=`
    .world-html-hologram{position:absolute;width:440px;height:560px;box-sizing:border-box;padding:24px;overflow:auto;z-index:24;color:#e5fbff;background:#071d2bef;border:1px solid #91e8ff8c;border-radius:10px;box-shadow:0 0 24px #70e9ff30;opacity:0;visibility:hidden;pointer-events:none;transform-origin:center;transition:opacity .25s}
    .world-html-hologram.is-visible{opacity:1;visibility:visible;pointer-events:auto}
    .world-html-hologram h2{font:600 24px Arial}.world-html-hologram .studio-form{gap:12px}
    .world-html-hologram .studio-form label,.world-html-hologram .studio-form .consent,.world-html-hologram .form-note{color:#d9f5ff}
    .world-html-hologram .studio-form input:not([type=checkbox]),.world-html-hologram .studio-form select,.world-html-hologram .studio-form textarea{background:#0d2c3d;color:#fff;border-color:#66bdd35c}
    .world-html-hologram>button{margin-top:12px;padding:10px;color:#c5f8ff;background:#123f51;border:1px solid #80dfff;cursor:pointer}
    .world-html-hologram details{font-size:12px;line-height:1.6;margin-top:12px}.world-html-hologram summary{cursor:pointer}
  `;
  style.textContent+=`
    .world-html-hologram{font:16px/1.5 Arial,sans-serif;border-radius:4px;border-color:#91e8ff50;box-shadow:0 0 32px #70e9ff18;padding:28px;background:linear-gradient(145deg,#091f2bfa,#05121cf5);scrollbar-width:thin;scrollbar-color:#74bdc7 #0b2130}
    .world-html-hologram h2{font:600 26px/1.2 Arial;margin:0 0 24px}
    .world-html-hologram .studio-form label{font:500 14px/1.5 Arial}
    .world-html-hologram .studio-form input:not([type=checkbox]),.world-html-hologram .studio-form select,.world-html-hologram .studio-form textarea{font:16px/1.5 Arial;min-height:42px}
    .world-html-hologram .studio-form .consent,.world-html-hologram .form-note{font:13px/1.6 Arial}
    #discord-world-widget{border-radius:4px;box-shadow:0 0 32px #70e9ff18}
    #discord-world-widget p{font:16px/1.7 Arial;white-space:pre-line}
    `;
  document.head.appendChild(style);
  function show(name) {
    if (!names.includes(name)) return;
    if(!initialized){pendingStation=name;return;}
    window.EDA_CINEMA?.skip?.();
    document.querySelector('#welcome')?.classList.add('dismissed');
    document.querySelector('#studio-app')?.classList.add('in-tour');
    if (name !== 'membresias') expanded = false;
    if (name !== 'diagnostico') briefOpen = false;
    window.EDA_V4?.focus(name, true);
  }
  function close() { expanded = false; briefOpen = false; window.EDA_V4?.clearFocus(); window.EDA_SFX?.play('close'); }
  function selectPlan(i) {
    if (!Number.isInteger(i) || i < 0 || i >= plans.length) return;
    selected = i;
    window.EDA_SFX?.play('select');
    window.EDA_V4?.setPlan(i);
    redrawDetails?.();
    methods?.setAttribute('visible', false);
    if (status) status.setValue( 'Selecciona un medio de pago.');
  }
  function expand() {
    if (window.EDA_V4?.active !== 'membresias') return;
    selected = window.EDA_V4.planIndex ?? selected;
    expanded = true;
    redrawDetails?.();
  }
  function interact(name = window.EDA_V4?.active) {
    if(name === 'membresias') expand();
    else if(name === 'servicios') show('membresias');
    else if(name === 'portafolio') document.dispatchEvent(new CustomEvent('eda:project-open'));
    else if(name === 'diagnostico') { briefOpen = !briefOpen; window.EDA_SFX?.play('open'); }
    else if(name === 'discord') { const link=window.EDA_SITE_CONFIG?.discord?.inviteUrl;
      if(typeof link==='string' && /^https:\/\/(discord\.gg\/|discord\.com\/invite\/)/.test(link)) window.open(link,'_blank','noopener,noreferrer');
    }
  }
  window.EDA_ESSENTIAL = { show, close, expand, interact };
  window.EDA_SPATIAL = { show, choosePlan: selectPlan };
  document.addEventListener('click', event => {
    if(event.target.closest('#interact-button')){event.preventDefault();event.stopImmediatePropagation();interact();return;}
    const target = event.target.closest('[data-screen],[data-goto]');
    if (!target) return;
    const name = target.getAttribute('data-screen') || target.getAttribute('data-goto');
    if(name==='privacidad'){event.preventDefault();event.stopImmediatePropagation();show('diagnostico');briefOpen=true;if(legal)legal.open=true;return;}
    if (names.includes(name)) { event.preventDefault(); event.stopImmediatePropagation(); show(name); }
  }, true);
  document.addEventListener('keydown', event => {
    if (/INPUT|TEXTAREA|SELECT/.test(event.target?.tagName || '') || event.ctrlKey || event.altKey || event.metaKey) return;
    if (event.key === 'Escape') close();
    const name = window.EDA_V4?.active;
    if(name==='membresias' && /^[1-5]$/.test(event.key)) selectPlan(Number(event.key)-1);
    if(name==='portafolio' && /^[1-3]$/.test(event.key)) {
      document.dispatchEvent(new CustomEvent('eda:project-select',{detail:Number(event.key)-1}));
      window.EDA_SFX?.play('select');
    }
    if(event.key.toLowerCase()==='e' && !event.repeat) { event.preventDefault(); interact(name); }
  });
  function add(tag, parent, attrs) {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
    parent.appendChild(node);
    return node;
  }
  function init() {
    const scene = document.querySelector('#office-scene');
    if (initialized || !scene?.hasLoaded || !window.EDA_V4) return;
    initialized = true;
    const THREE = window.AFRAME.THREE;
    const cameraEl = document.querySelector('#player-camera');
    const cameraPosition = new THREE.Vector3();
    const roots = [];
    function group(id, position) {
      const root = add('a-entity', scene, { id, position, visible: false });
      roots.push(root); return root;
    }
    // Canvas labels share the same physical font size as the information texture.
    // A-Frame's default text width previously made action labels several times larger.
    function labelSurface(parent,value,x,y,width,height=.22,size=30) {
      const node=add('a-plane',parent,{position: `${x} ${y} .04`,width,height,
        material:'shader:flat;transparent:true;opacity:0;depthWrite:false'});
      const canvas=document.createElement('canvas');
      canvas.width=Math.round(width*436);canvas.height=Math.round(height*436);
      const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
      const mesh=new THREE.Mesh(new THREE.PlaneGeometry(width,height),new THREE.MeshBasicMaterial({
        map:texture,transparent:true,depthTest:false,depthWrite:false,toneMapped:false,side:THREE.DoubleSide
      }));
      mesh.renderOrder=52;node.object3D.add(mesh);
      node.setValue=(value,button=false)=>{
        const ctx=canvas.getContext('2d');ctx.clearRect(0,0,canvas.width,canvas.height);
        if(button){ctx.fillStyle='#123d4b';ctx.fillRect(0,0,canvas.width,canvas.height);
          ctx.strokeStyle='#8fe5e955';ctx.lineWidth=2;ctx.strokeRect(1,1,canvas.width-2,canvas.height-2);}
        let fontSize=size;ctx.font=`500 ${fontSize}px Arial`;
        while(ctx.measureText(value).width>canvas.width-24&&fontSize>20){ctx.font=`500 ${--fontSize}px Arial`;}
        ctx.fillStyle=button?'#e6fbfc':'#afcbd6';ctx.textAlign='center';ctx.textBaseline='middle';
        ctx.fillText(value,canvas.width/2,canvas.height/2);texture.needsUpdate=true;
      };
      node.setValue(value);
      return node;
    }
    function text(parent,value,y,width=2.08){return labelSurface(parent,value,0,y,width,.19,25);}
    function button(parent,label,x,y,width,action) {
      const plane=labelSurface(parent,label,x,y,width,parent===methods ? .14 : .20,30);
      plane.classList.add('holo-action');plane.setValue(label,true);
      plane.addEventListener('click',event=>{
        event.stopPropagation();
        for(let node=plane;node&&node!==scene;node=node.parentElement){if([false,'false'].includes(node.getAttribute('visible')))return;}
        window.EDA_SFX?.play('click');action();
      });
      return plane;
    }
    controls = group('world-membership-controls', '4.65 1.9 -1.5');
    for (let i = 0; i < 5; i++) button(controls, String(i + 1), (i - 2) * .37, -.85, .31, () => selectPlan(i));
    button(controls, 'Ver beneficios  ·  E', 0, -1.10, 2.08, expand);
    details = group('world-plan-details', '4.65 1.9 -1.5');
    const canvas = document.createElement('canvas'); canvas.width = 1024; canvas.height = 1072;
    const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 2.46), new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide, depthTest:false, depthWrite: false, toneMapped: false }));
    mesh.renderOrder=50;details.object3D.add(mesh);
    redrawDetails = () => {
      const p=plans[selected],ctx=canvas.getContext('2d');
      ctx.clearRect(0,0,1024,1072);
      const gradient=ctx.createLinearGradient(0,0,1024,1072);gradient.addColorStop(0,'#091f2bfa');gradient.addColorStop(1,'#05121cf5');
      ctx.fillStyle=gradient;ctx.fillRect(0,0,1024,1072);
      function line(value,y,size=32,color='#edfaff'){ctx.font=`500 ${size}px Arial`;ctx.fillStyle=color;ctx.fillText(value,56,y);}
      function wrap(value,y,size=30){
        ctx.font=`400 ${size}px Arial`;ctx.fillStyle='#c1d6df';let row='';
        for(const word of value.split(' ')){
          const next=row?row+' '+word:word;
          if(ctx.measureText(next).width>912&&row){ctx.fillText(row,56,y);y+=40;row=word;}else row=next;
        }
        ctx.fillText(row,56,y);return y+40;
      }
      ctx.fillStyle='#8de7eb';ctx.fillRect(56,44,72,4);
      line('MEMBRESÍA / '+String(selected+1).padStart(2,'0'),96,24,'#9cbcc8');
      line(p.name,177,54);line('$'+p.price.toLocaleString('es-MX')+' MXN / mes',237,38,'#cef5ef');
      line(p.hours+' de trabajo al mes',288,30,'#bed3dc');
      ctx.fillStyle='#8de7eb40';ctx.fillRect(56,316,912,1);
      let y=371;for(const item of p.items){y=wrap('•  '+item,y,32)+16;}
      y=wrap(p.limit,Math.max(568,y+8),28);
      line('Impuestos según corresponda. Alcance acordado.',Math.max(648,y+4),25,'#9cbcc8');
      texture.needsUpdate=true;
    };
    for(let i=0;i<5;i++)button(details,String(i+1),.2+i*.18,.99,.16,()=>selectPlan(i));
    button(details, 'Suscribirme · elegir pago', 0, -.44, 2.08, () => {
      visible(methods, !methods.getAttribute('visible'));
      window.EDA_SFX?.play('open');
    });
    methods = add('a-entity', details, { visible: false });
    status = text(details, 'Elige una opción para continuar.', -.64, 2.08);
    ['Mercado Pago', 'Apple Pay', 'Google Pay'].forEach((label, i) => button(methods, label, 0, -.81 - i * .17, 2.08, () => {
      const config = window.EDA_SITE_CONFIG?.checkout?.[plans[selected].name] || {};
      const value = i === 0 ? config.mercadopago : config.stripe;
      if (!value) { window.EDA_SFX?.play('notice');status.setValue( label + ': pendiente de conectar. Sin cargos.'); return; }
      try {
        const url = new URL(value);
        const valid = i === 0 ? /(^|\.)mercadopago\.com(\.mx)?$/.test(url.hostname) : ['buy.stripe.com', 'checkout.stripe.com'].includes(url.hostname);
        if (url.protocol !== 'https:' || !valid) throw new Error('Invalid checkout');
        window.open(url.href, '_blank', 'noopener,noreferrer');
      } catch (_) { status.setValue( 'Enlace de pago no valido. Sin cargos.'); }
    }));
    redrawDetails();
    const serviceControls=group('world-services-controls','-4.65 1.9 -1.5');
    button(serviceControls,'Explorar membresías  ·  E',0,-1.08,2.08,()=>interact('servicios'));
    const briefControls=group('world-brief-controls','3.5 1.9 4.4');
    button(briefControls,'Escribir mi proyecto  ·  E',0,-1.08,2.08,()=>interact('diagnostico'));
    function visible(root,on){
      if(root.getAttribute('visible')===on)return;
      root.setAttribute('visible',on);
      root.querySelectorAll('.holo-action').forEach(button=>{let enabled=on;for(let node=button;node&&node!==scene;node=node.parentElement){if([false,'false'].includes(node.getAttribute('visible')))enabled=false;}button.classList.toggle('interactive-object',enabled);});
    }
    brief=document.createElement('div');brief.id='brief-world-hologram';brief.className='world-html-hologram';brief.inert=true;
    const heading=document.createElement('h2');heading.textContent='Hablemos de tu proyecto';brief.appendChild(heading);
    const form=document.querySelector('#studio-form');if(form)brief.appendChild(form);
    legal=document.createElement('details');
    const summary=document.createElement('summary');summary.textContent='Privacidad';legal.appendChild(summary);
    document.querySelectorAll('[data-screen-content="privacidad"] p').forEach(p=>legal.appendChild(p.cloneNode(true)));
    brief.appendChild(legal);
    const briefClose=document.createElement('button');briefClose.type='button';briefClose.textContent='Volver al holograma';briefClose.onclick=()=>{briefOpen=false;window.EDA_SFX?.play('close');};brief.appendChild(briefClose);
    document.querySelector('#scene-container').appendChild(brief);
    // Discord prohibits reading its cross-origin iframe into a WebGL texture.
    // Project the official iframe from a fixed world anchor instead of a modal.
    const widget = document.createElement('div'); widget.id = 'discord-world-widget'; widget.inert = true;
    document.querySelector('#scene-container').appendChild(widget);
    const serverId = String(window.EDA_SITE_CONFIG?.discord?.serverId || '');
    if (/^\d{16,22}$/.test(serverId)) {
      const iframe = document.createElement('iframe'); iframe.title = 'Widget oficial de Discord';
      iframe.src = 'https://discord.com/widget?id=' + encodeURIComponent(serverId) + '&theme=dark';
      iframe.setAttribute('sandbox', 'allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts');
      iframe.referrerPolicy = 'no-referrer'; widget.appendChild(iframe);
    } else {
      const note = document.createElement('p'); note.textContent = 'DISCORD / Widget oficial\nFalta vincular el ID de tu servidor y activar su widget. No hay un servidor conectado.'; widget.appendChild(note);
    }
    const dismiss = document.createElement('button'); dismiss.textContent = '×'; dismiss.setAttribute('aria-label', 'Ocultar holograma de Discord'); dismiss.onclick = close; widget.appendChild(dismiss);
    window.EDA_DISCORD_WIDGET_READY = true;
    const anchor = new THREE.Vector3(-4.5, 1.9, 4.4), projected = new THREE.Vector3(), view = new THREE.Vector3();
    let prior = '';
    const surfaces=[{node:widget,anchor,width:350,height:500,shown:()=>window.EDA_V4?.active==='discord'},
      {node:brief,anchor:new THREE.Vector3(3.5,1.9,4.4),width:440,height:560,shown:()=>window.EDA_V4?.active==='diagnostico'&&briefOpen}];
    function tick() {
      if (!scene.isConnected) return;
      const active = window.EDA_V4?.active || '';
      if(prior!==active){
        if(prior==='membresias')expanded=false;
        if(prior==='diagnostico')briefOpen=false;
        if(active)window.EDA_SFX?.play('open');
      }
      prior=active;
      window.EDA_MEMBERSHIP_EXPANDED=active==='membresias'&&expanded;
      window.EDA_BRIEF_OPEN=active==='diagnostico'&&briefOpen;
      visible(controls,active==='membresias'&&!expanded);
      visible(details,active==='membresias'&&expanded);
      visible(serviceControls,active==='servicios');
      visible(briefControls,active==='diagnostico'&&!briefOpen);
      const camera = cameraEl.getObject3D('camera');
      if (camera) {
        camera.getWorldPosition(cameraPosition);
        roots.forEach(root => {
          root.object3D.lookAt(cameraPosition);
          const scale=window.EDA_HOLO?.scale(root.object3D.position,camera)||1;
          root.object3D.scale.setScalar(scale);
        });
        const bounds = document.querySelector('#scene-container').getBoundingClientRect();
        for(const surface of surfaces){
          const {node,anchor,width,height}=surface;
          projected.copy(anchor).project(camera);view.copy(anchor).applyMatrix4(camera.matrixWorldInverse);
          const shown=surface.shown()&&!scene.is('vr-mode')&&view.z<0&&projected.z>-1&&projected.z<1&&Math.abs(projected.x)<1.15&&Math.abs(projected.y)<1.15;
          node.classList.toggle('is-visible',shown);node.inert=!shown;node.setAttribute('aria-hidden',String(!shown));
          if(shown){
            const scale=Math.min((bounds.width-24)/width,(bounds.height-70)/height,bounds.height*.72/height);
            node.style.left=((projected.x+1)*.5*bounds.width)+'px';node.style.top=Math.max(height*scale/2+24,Math.min(bounds.height-height*scale/2-24,(1-projected.y)*.5*bounds.height))+'px';
            node.style.transform=`translate(-50%,-50%) scale(${Math.max(.2,scale)})`;
          }
        }
      }
      requestAnimationFrame(tick);
    }
    tick();
    const route = pendingStation||new URLSearchParams(location.search).get('estacion');pendingStation=null;if(names.includes(route))show(route);
  }
  document.querySelector('#office-scene')?.addEventListener('loaded', init, { once: true });
  window.addEventListener('load', init, { once: true }); init();
})();
