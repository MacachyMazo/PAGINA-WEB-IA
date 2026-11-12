<?php if (!defined('ABSPATH')) { exit; } ?>
<!doctype html>
<html lang="es-MX">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#111418">
<meta name="description" content="Estudio de Autor. Explora nuestra oficina 3D en primera persona. Diseño, WordPress, contenido y tecnología por suscripción, con atención personal y un alcance claro.">
<title>Estudio de Autor · Oficina Interactiva VR</title>


<?php wp_head(); ?>
</head>
<body class="eda-office-vr">
<?php wp_body_open(); ?>
<div id="studio-app" class="studio-app">
<a class="skip-link" href="#direct-nav">Saltar a navegación directa</a>
<header class="global-header" aria-label="Menú del estudio">
  <a class="brand" href="#inicio" id="brand-home" aria-label="Volver a recepción">
    <span class="brand-glyph">e<span>·</span>a</span>
    <span class="brand-copy"><strong>ESTUDIO DE AUTOR</strong><small>CREATIVE TECHNOLOGY STUDIO / MÉXICO</small></span>
  </a>
  <nav class="global-nav" id="direct-nav" aria-label="Navegación directa">
    <button type="button" data-screen="servicios">Servicios</button>
    <button type="button" data-screen="portafolio">Proyectos</button>
    <button type="button" data-screen="membresias">Membresías</button>
    <button type="button" class="header-contact" data-screen="diagnostico">Solicitar diagnóstico <span aria-hidden="true">↗</span></button>
  </nav>
  <button type="button" class="nav-menu-btn" id="nav-menu-btn" aria-expanded="false" aria-controls="direct-nav" aria-label="Abrir menú">☰</button>
</header>
<main id="inicio" class="experience">
  <section id="scene-container" class="scene-container" aria-label="Oficina virtual fotorrealista en primera persona" style="--office-photo:url('<?php echo esc_url(get_template_directory_uri()); ?>/assets/images/office-360.jpg')">
    <div class="scene-fallback" aria-hidden="true"></div>
    <div class="scene-wait" id="scene-wait" role="status"><span class="wait-orb"></span> Preparando oficina interactiva…</div>
    <a-scene id="office-scene" embedded background="color:#12191e" fog="type:linear; color:#191819; near:24; far:85" renderer="antialias:true; colorManagement:true" vr-mode-ui="enabled:false" loading-screen="enabled:false" device-orientation-permission-ui="enabled:true">
      <a-assets timeout="25000">
        <img id="scene-panorama" src="<?php echo esc_url(get_template_directory_uri()); ?>/assets/images/office-360.jpg" crossorigin="anonymous" alt="">
        <img id="image-peek" src="<?php echo esc_url(get_template_directory_uri()); ?>/assets/images/peekdex-logo.png" crossorigin="anonymous" alt="">
        <img id="image-iq" src="<?php echo esc_url(get_template_directory_uri()); ?>/assets/images/iq-bites-logo.png" crossorigin="anonymous" alt="">
        <img id="image-gube" src="<?php echo esc_url(get_template_directory_uri()); ?>/assets/images/gube-logo.png" crossorigin="anonymous" alt="">
      </a-assets>
      <a-sky src="#scene-panorama" radius="72" rotation="0 -90 0"></a-sky>
      <a-entity light="type:ambient; color:#e6e3df; intensity:.56"></a-entity>
      <a-entity light="type:directional; color:#ffdfb8; intensity:.84" position="-4 8 -2"></a-entity>
      <a-entity light="type:point; color:#ca9bfc; intensity:.75; distance:10" position="1.8 3 -3.5"></a-entity>
      <a-entity light="type:point; color:#fac290; intensity:.65; distance:12" position="-4 3 0"></a-entity>
      <a-plane id="office-floor" rotation="-90 0 0" position="0 -.025 0" width="13" height="14" material="color:#42362e; roughness:.84; metalness:.03; transparent:true; opacity:.46" shadow="receive:true"></a-plane>
      <a-plane rotation="-90 0 0" position="0 -.006 -3.0" width="5.5" height="4.1" material="color:#45434a; roughness:1; transparent:true; opacity:.63"></a-plane>
      <a-entity id="office-furniture"></a-entity>
      <a-entity id="office-points"></a-entity>
      <a-entity id="player-rig" position="0 0 4.5" eda-walk="speed:2.35">
        <a-entity id="player-camera" camera look-controls="pointerLockEnabled:true; touchEnabled:true; magicWindowTrackingEnabled:false" wasd-controls="enabled:false" position="0 1.64 0" cursor="rayOrigin:mouse; fuse:false" raycaster="objects:.interactive-object; far:14">
          <a-entity id="gaze-cursor" position="0 0 -1" geometry="primitive:ring; radiusInner:.007; radiusOuter:.011" material="color:#fff; shader:flat; depthTest:false; opacity:.9" cursor="fuse:true; fuseTimeout:1350" raycaster="enabled:false; objects:.interactive-object; far:12" visible="false"></a-entity>
        </a-entity>
        <a-entity id="vr-left" laser-controls="hand:left" raycaster="objects:.interactive-object;far:14;showLine:true" line="color:#a1b9ff"></a-entity>
        <a-entity id="vr-right" laser-controls="hand:right" raycaster="objects:.interactive-object;far:14;showLine:true" line="color:#a1b9ff"></a-entity>
      </a-entity>
      <a-entity id="vr-information" visible="false" position="0 1.5 1">
        <a-plane width="2.55" height="1.72" color="#141c25" opacity=".97" material="side:double;shader:flat" position="0 0 -.02"></a-plane>
        <a-text id="vr-info-title" value="ESTUDIO DE AUTOR" font="roboto" width="2.25" color="#d7bbf9" align="left" position="-1.07 .64 .01"></a-text>
        <a-text id="vr-info-copy" value="Elige una estación para explorar." width="2.2" color="#ffffff" align="left" wrap-count="36" position="-1.07 .22 .02"></a-text>
        <a-text value="Pulsa en otra estación para cambiar.\nPara contratar, sal de VR y usa el formulario." width="2.2" color="#a7b6c9" wrap-count="42" position="-1.07 -.63 .02"></a-text>
      </a-entity>
    </a-scene>
    <div class="vignette" aria-hidden="true"></div>
    <div class="reticle" id="reticle" aria-hidden="true"><span></span></div>
    <div class="orientation-tag"><span class="led"></span> RECORRIDO EN PRIMERA PERSONA <span class="tag-delimiter">/</span> EDICIÓN 3.1</div>
    <div class="welcome" id="welcome">
      <p class="eyebrow">BIENVENIDO AL ESTUDIO / 001</p>
      <h1>Las ideas<br>toman <em>espacio.</em></h1>
      <p class="welcome-copy">Entra a nuestra oficina digital. Conoce proyectos, explora lo que podemos crear y elige cómo trabajar juntos.</p>
      <div class="welcome-actions"><button class="button button-light" id="enter-office" type="button">Entrar y explorar <span aria-hidden="true">↗</span></button><button class="button button-transparent" data-screen="diagnostico" type="button">Ir al diagnóstico</button></div>
      <div class="welcome-meta"><span>OFICINA INTERACTIVA</span><span>◦</span><span>100% REMOTO</span><span>◦</span><span>MÉXICO</span></div>
    </div>
    <aside class="wayfinding" id="wayfinding" aria-label="Puntos de interés de la oficina">
      <div class="wayfinding-label">ELIGE UN DESTINO</div>
      <button type="button" data-goto="servicios"><span class="wayfinding-number">01</span><span><strong>Zona creativa</strong><small>Servicios</small></span><span aria-hidden="true">↗</span></button>
      <button type="button" data-goto="portafolio"><span class="wayfinding-number">02</span><span><strong>Monitor principal</strong><small>Proyectos</small></span><span aria-hidden="true">↗</span></button>
      <button type="button" data-goto="membresias"><span class="wayfinding-number">03</span><span><strong>Panel de acceso</strong><small>Planes</small></span><span aria-hidden="true">↗</span></button>
      <button type="button" data-goto="diagnostico"><span class="wayfinding-number">04</span><span><strong>Mesa de reuniones</strong><small>Diagnóstico</small></span><span aria-hidden="true">↗</span></button>
    </aside>
    <div class="game-hud" id="game-hud">
      <div class="controls-tip"><b>W A S D</b> CAMINAR <span>·</span> <b>RATÓN</b> MIRAR <span>·</span> <b>E</b> INTERACTUAR</div>
      <div class="status-help" id="status-help" aria-live="polite">Acércate a una estación o elige un destino.</div>
      <div class="hud-actions"><button type="button" id="reset-view" title="Volver a recepción">⌖ <span>Recepción</span></button><button type="button" id="soundless" title="Esta experiencia no reproduce audio">◌ <span>Sin audio</span></button><button type="button" id="vr-button" aria-label="Entrar en realidad virtual" disabled>◎ <span>VR · Comprobando</span></button></div>
    </div>
    <div class="mobile-pad" id="mobile-pad" aria-label="Controles de movimiento táctiles"><button type="button" data-move="forward" aria-label="Caminar adelante">↑</button><div><button type="button" data-move="left" aria-label="Mover izquierda">←</button><button type="button" data-move="back" aria-label="Caminar atrás">↓</button><button type="button" data-move="right" aria-label="Mover derecha">→</button></div></div>
    <button type="button" class="mobile-interact" id="interact-button">INTERACTUAR <span>↗</span></button>
    <div class="screen-fallback-navigation" id="fallback-navigation"><span>También puedes navegar sin usar el mundo 3D:</span><button type="button" data-screen="servicios">Servicios</button><button type="button" data-screen="portafolio">Portafolio</button><button type="button" data-screen="membresias">Planes</button><button type="button" data-screen="diagnostico">Diagnóstico</button></div>
  </section>
  <aside id="detail-panel" class="detail-panel" aria-hidden="true" inert aria-label="Información del estudio">
    <header class="panel-head"><div><small>ESTUDIO DE AUTOR / EXPERIENCIA</small><strong id="panel-location">SERVICIOS</strong></div><button class="panel-close" id="panel-close" aria-label="Cerrar información" type="button">✕</button></header>
    <div class="panel-scroll">
      <section class="panel-screen" data-screen-content="servicios" aria-labelledby="servicios-title">
        <p class="panel-kicker">01 / QUÉ HACEMOS</p><h2 id="servicios-title">La herramienta correcta.<br><em>Para tu idea.</em></h2>
        <p class="intro-text">Creamos soluciones digitales por etapas: un proyecto personal, apoyado por herramientas de IA, diseño visual y colaboradores especializados cuando se necesitan.</p>
        <div class="service-catalog">
          <details open><summary><span>01</span> WEB & UX/UI <b>+</b></summary><p>Landing pages, WordPress, tiendas sencillas, estructuras web, interfaces y experiencia de usuario.</p></details>
          <details><summary><span>02</span> CONTENIDO & DISEÑO <b>+</b></summary><p>Branding funcional, imágenes, creatividades para redes, presentaciones y gráficos con Canva y herramientas de IA.</p></details>
          <details><summary><span>03</span> VIDEO & STORYTELLING <b>+</b></summary><p>Guiones, edición de video con Filmora y producción visual según alcance y disponibilidad.</p></details>
          <details><summary><span>04</span> MARKETING & AUTOMATIZACIÓN <b>+</b></summary><p>SEO básico, embudos de captación, mejora de conversión, formularios e integraciones viables.</p></details>
          <details><summary><span>05</span> PRODUCTO & WEB3 <b>+</b></summary><p>Exploración de apps web, DApps, experiencias blockchain y prototipos. Las funciones críticas requieren validación y especialistas.</p></details>
        </div>
        <p class="disclaimer">No ofrecemos entregables ilimitados ni garantizamos programación especializada, resultados de marketing o seguridad financiera sin evaluación previa.</p>
        <button class="button button-dark full" type="button" data-screen="membresias">Ver los cinco planes <span>→</span></button>
      </section>
      <section class="panel-screen" data-screen-content="portafolio" aria-labelledby="portafolio-title">
        <p class="panel-kicker">02 / TRABAJO PROPIO</p><h2 id="portafolio-title">Tres ideas.<br><em>Tres mundos.</em></h2>
        <p class="intro-text">Casos propios que muestran cómo planteamos productos, marcas y experiencias digitales.</p>
        <a href="https://peekdex.com" target="_blank" rel="noopener noreferrer" class="case"><div class="case-image lilac"><img src="<?php echo esc_url(get_template_directory_uri()); ?>/assets/images/peekdex-logo.png" alt="Logo de PeekDex"></div><div><small>COMUNIDAD / COLECCIONISMO</small><h3>PeekDex <span>↗</span></h3><p>Concepto de plataforma para coleccionistas de cartas con comunidad, contenido y comercio desarrollados por etapas.</p></div></a>
        <a href="https://iq-bites.com" target="_blank" rel="noopener noreferrer" class="case"><div class="case-image cream"><img src="<?php echo esc_url(get_template_directory_uri()); ?>/assets/images/iq-bites-logo.png" alt="Logo original de IQ-Bites"></div><div><small>BRANDING / COMERCIO</small><h3>IQ-Bites <span>↗</span></h3><p>Marca de snacks con identidad visual, contenido comercial y experiencia digital para presentar productos y facilitar pedidos.</p></div></a>
        <a href="https://estacionamientogube.com.mx" target="_blank" rel="noopener noreferrer" class="case"><div class="case-image mint"><img src="<?php echo esc_url(get_template_directory_uri()); ?>/assets/images/gube-logo.png" alt="Logo de Estacionamiento GUBE"></div><div><small>SERVICIO LOCAL / EXPERIENCIA</small><h3>GUBE <span>↗</span></h3><p>Presencia digital para estacionamiento y herramientas para clientes, con autofacturación como proyecto en desarrollo.</p></div></a>
        <p class="disclaimer">No atribuimos métricas comerciales ni funcionalidades productivas sin comprobación.</p>
        <button class="button button-dark full" type="button" data-screen="diagnostico">Quiero mi proyecto <span>→</span></button>
      </section>
      <section class="panel-screen" data-screen-content="membresias" aria-labelledby="membresias-title">
        <p class="panel-kicker">03 / CINCO NIVELES</p><h2 id="membresias-title">Tu equipo creativo.<br><em>A tu ritmo.</em></h2>
        <p class="intro-text">Elige cuánto acompañamiento necesitas. En cada plan las horas son limitadas y las entregas se acuerdan antes de cobrar.</p>
        <div class="plan-choice-row" role="tablist" aria-label="Selecciona suscripción">
          <button type="button" role="tab" data-plan="Inicio">01</button><button type="button" role="tab" data-plan="Impulso">02</button><button type="button" role="tab" data-plan="Presencia">03</button><button type="button" role="tab" data-plan="Evolución">04</button><button type="button" role="tab" data-plan="Integral">05</button>
        </div>
        <div class="selected-plan" role="tabpanel" aria-live="polite"><div class="selected-top"><small id="selected-number">NIVEL / 04</small><small id="selected-hours">9 HORAS MENSUALES</small></div><h3 id="selected-name">Evolución</h3><p id="selected-tagline"></p><div class="selected-price"><strong id="selected-price">$10,900</strong><span>MXN / MES<br>IVA SEGÚN CORRESPONDA</span></div><ul id="selected-benefits"></ul><p class="plan-warning" id="selected-limit"></p><button type="button" id="plan-apply" class="button button-dark full">Solicitar este plan <span>→</span></button></div>
        <p class="disclaimer">Hosting del cliente, APIs, dominios, licencias y publicidad no están incluidos. Discord comunitario y voz en Integral se ofrecerán cuando se encuentren habilitados, con cita y dentro del horario disponible.</p>
      </section>
      <section class="panel-screen" data-screen-content="diagnostico" aria-labelledby="diagnostico-title">
        <p class="panel-kicker">04 / CONVERSEMOS</p><h2 id="diagnostico-title">Una buena idea<br><em>empieza aquí.</em></h2>
        <p class="intro-text">Describe tu objetivo sin tecnicismos. Revisaremos la viabilidad, la agenda y el alcance antes de proponerte un plan.</p>
        <form id="studio-form" class="studio-form" novalidate>
          <div class="fields"><label>Nombre *<input name="name" autocomplete="name" minlength="2" maxlength="100" required placeholder="Tu nombre"></label><label>Negocio<input name="company" maxlength="120" placeholder="Opcional"></label></div>
          <label>Correo *<input type="email" name="email" autocomplete="email" maxlength="160" required placeholder="hola@tuempresa.com"></label>
          <label>WhatsApp<input name="phone" autocomplete="tel" maxlength="30" placeholder="Opcional"></label>
          <div class="fields"><label>Servicio<select name="service" id="form-service"><option>Web / WordPress</option><option>Diseño / redes</option><option>Video / guiones</option><option>SEO / marketing</option><option>Prototipos / automatización</option><option>Blockchain / viabilidad</option><option>Otra idea</option></select></label><label>Plan<select name="plan" id="form-plan"><option>Inicio</option><option>Impulso</option><option>Presencia</option><option selected>Evolución</option><option>Integral</option></select></label></div>
          <label>¿Qué necesitas resolver? *<textarea name="description" required minlength="15" maxlength="2000" rows="4" placeholder="Cuéntanos qué necesitas cambiar, crear o mejorar…"></textarea></label>
          <label class="honeypot" aria-hidden="true">Sitio web<input name="website" tabindex="-1" autocomplete="off"></label>
          <label class="consent"><input type="checkbox" name="consent" value="1" required><span>Autorizo utilizar mis datos para responder esta solicitud. <button type="button" class="text-button" data-screen="privacidad">Ver privacidad</button>.</span></label>
          <div class="form-result" id="form-result" role="status" aria-live="polite"></div>
          <button type="submit" id="submit-form" class="button button-dark full">Enviar mi proyecto <span>↗</span></button><small class="form-note">Sin cobro inmediato. Los enlaces de Mercado Pago se enviarán después de aprobar el alcance y la disponibilidad.</small>
        </form>
      </section>
      <section class="panel-screen" data-screen-content="privacidad">
        <p class="panel-kicker">TRANSPARENCIA</p><h2>Tu información<br><em>es tuya.</em></h2><p class="intro-text">Los datos se almacenan en WordPress para evaluar y responder esta solicitud. La demostración local no los almacena ni transmite.</p>
        <p class="disclaimer">Antes de publicar comercialmente se requiere aviso integral de privacidad, domicilio y contacto del responsable, tratamiento y derechos ARCO, condiciones comerciales y política de cancelación.</p><button type="button" class="button button-dark full" data-screen="diagnostico">Regresar al formulario →</button>
      </section>
    </div>
    <footer class="panel-footer">ESTUDIO DE AUTOR <span>✳</span> PROYECTOS POR ETAPAS</footer>
  </aside>
  <div id="panel-scrim" class="panel-scrim"></div>
</main>
<div class="site-underbar"><span>ESTUDIO DE AUTOR © 2026 · OFICINA DIGITAL, NO SEDE FÍSICA ABIERTA AL PÚBLICO</span><button type="button" data-screen="privacidad">Privacidad</button></div>
</div>

<?php wp_footer(); ?>
</body>
</html>