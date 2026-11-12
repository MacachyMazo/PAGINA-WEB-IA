<?php if (!defined('ABSPATH')) { exit; } ?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo('charset'); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#f5f3ec">
  <meta name="description" content="Estudio de Autor: diseño web, WordPress, experiencias digitales, contenido y automatización con atención personal y por suscripción. Explora un mundo interactivo y solicita un diagnóstico.">
  <?php wp_head(); ?>
</head>
<body <?php body_class('eda-v3'); ?> >
<?php wp_body_open(); ?>
<a class="skip-link" href="#menu-mundo">Saltar al menú del mundo</a>
<div class="studio-app" id="studio-app">
  <header class="topbar">
    <a class="brand" href="#inicio" id="home-link" aria-label="Estudio de Autor, volver al inicio"><span class="brand-mark">e<span class="brand-dot">.</span></span><span class="brand-word">ESTUDIO<br><em>DE AUTOR</em></span></a>
    <span class="edition">ESTUDIO DIGITAL INDEPENDIENTE <span class="edition-divider">/</span> MÉXICO · REMOTO</span>
    <nav class="main-nav" aria-label="Navegación directa" id="menu-mundo">
      <button type="button" data-screen="servicios">Servicios</button>
      <button type="button" data-screen="portafolio">Proyectos</button>
      <button type="button" data-screen="membresias">Planes</button>
      <button class="nav-contact" type="button" data-screen="diagnostico">Hablemos de tu idea <span aria-hidden="true">↗</span></button>
    </nav>
    <button class="mobile-menu" id="menu-toggle" type="button" aria-label="Abrir menú" aria-controls="menu-mundo" aria-expanded="false"><span></span><span></span></button>
  </header>

  <main class="world-main" id="inicio">
    <canvas id="world-canvas" class="world-canvas" aria-hidden="true"></canvas>
    <div class="world-noise" aria-hidden="true"></div>
    <div class="world-coordinate" aria-hidden="true">EA/03 <span>·</span> EXPERIMENTO INTERACTIVO</div>

    <div class="world-pins" id="world-pins">
      <button class="world-pin" data-station="servicios" type="button"><span class="pin-number">01</span><span class="pin-copy"><strong>ESTUDIO</strong><small>QUÉ PODEMOS CREAR</small></span><span class="pin-arrow">↗</span></button>
      <button class="world-pin" data-station="portafolio" type="button"><span class="pin-number">02</span><span class="pin-copy"><strong>ARCHIVO</strong><small>PROYECTOS REALES</small></span><span class="pin-arrow">↗</span></button>
      <button class="world-pin" data-station="membresias" type="button"><span class="pin-number">03</span><span class="pin-copy"><strong>MEMBRESÍAS</strong><small>5 FORMAS DE AVANZAR</small></span><span class="pin-arrow">↗</span></button>
      <button class="world-pin" data-station="diagnostico" type="button"><span class="pin-number">04</span><span class="pin-copy"><strong>PUERTA DE ENTRADA</strong><small>HABLEMOS DE TU IDEA</small></span><span class="pin-arrow">↗</span></button>
    </div>

    <section class="hero-intro" id="hero-intro" aria-labelledby="hero-title">
      <span class="intro-eyebrow"><span class="mini-spark">✳</span> ESTUDIO DIGITAL / VISITA 001</span>
      <h1 id="hero-title">Una idea.<br><em>Un mundo</em><br>de posibilidades<span class="period">.</span></h1>
      <p>Diseño web, contenido y tecnología aplicada a problemas reales. Explora el estudio y descubre una forma de crear por suscripción, con trabajo personal y límites claros.</p>
      <div class="intro-actions"><button class="solid-button" type="button" id="explore-button">Explorar el mundo <span aria-hidden="true">→</span></button><button class="inline-button" type="button" data-screen="diagnostico">Solicitar diagnóstico ↗</button></div>
      <div class="intro-foot"><span class="dot-online"></span> SIN COMPROMISO INICIAL <span class="intro-divider"></span> 100 % REMOTO</div>
    </section>

    <div class="scene-status" id="scene-status" aria-live="polite"><span class="status-dot"></span><span id="location-label">PLAZA CENTRAL</span><span class="status-separator">·</span><span>RECORRIDO LIBRE</span></div>
    <div class="world-bottom">
      <div class="movement-guide" id="movement-guide"><span class="keycap">W</span><span class="key-row"><span class="keycap">A</span><span class="keycap">S</span><span class="keycap">D</span></span><span class="guide-text"><b>CONDUCE EL DRON</b><small>WASD / FLECHAS · HAZ CLIC EN UNA ESTACIÓN</small></span></div>
      <div class="journey-guide"><span id="visited-count">00/04</span><span class="guide-progress"><i id="progress-marker"></i></span><span>DESCUBRE EL ESTUDIO A TU RITMO</span></div>
      <div class="world-actions"><button type="button" class="small-action" id="reset-camera" title="Volver al centro" aria-label="Volver al centro">⌖ <span>REINICIAR</span></button><button type="button" class="small-action" id="motion-toggle" aria-pressed="false">◌ <span>REDUCIR MOVIMIENTO</span></button></div>
    </div>
    <div class="touch-controller" id="touch-controller" aria-label="Controles táctiles de movimiento"><button type="button" data-drive="up" aria-label="Avanzar">↑</button><div><button type="button" data-drive="left" aria-label="Mover a la izquierda">←</button><button type="button" data-drive="down" aria-label="Retroceder">↓</button><button type="button" data-drive="right" aria-label="Mover a la derecha">→</button></div></div>
    <button class="floating-action" type="button" data-screen="diagnostico">SOLICITA TU DIAGNÓSTICO <span aria-hidden="true">↗</span></button>

    <aside class="drawer" id="world-drawer" aria-label="Información del estudio" aria-hidden="true" inert>
      <div class="drawer-top"><div><span class="drawer-stamp">ESTUDIO DE AUTOR</span><span class="drawer-step" id="drawer-step">ESTACIÓN / 01</span></div><button class="drawer-close" id="close-drawer" type="button" aria-label="Cerrar panel">✕</button></div>
      <div class="drawer-content" id="drawer-content">
        <section class="screen" id="screen-servicios" data-screen-content="servicios" aria-labelledby="services-title"><span class="screen-eyebrow">LABORATORIO 01 / CREACIÓN</span><h2 id="services-title">Tu idea merece <em>forma.</em></h2><p class="screen-lead">No vendemos herramientas por vender. Elegimos qué hacer, con qué hacerlo y qué resultado puedes revisar.</p>
          <div class="service-list">
            <details open><summary><span>01</span><strong>Web, WordPress y experiencia UX/UI</strong><b>+</b></summary><p>Landing pages, sitios, tiendas sencillas, prototipos, interfaces y mejoras progresivas.</p></details>
            <details><summary><span>02</span><strong>Diseño, imágenes e identidad</strong><b>+</b></summary><p>Creatividades para redes, presentaciones y propuestas visuales con Canva y herramientas de IA.</p></details>
            <details><summary><span>03</span><strong>Guiones, video y edición</strong><b>+</b></summary><p>Guiones, piezas audiovisuales y edición con Filmora, dentro del tiempo contratado.</p></details>
            <details><summary><span>04</span><strong>SEO, marketing y automatización</strong><b>+</b></summary><p>SEO básico, formularios, embudos, automatizaciones sencillas y optimización de experiencia.</p></details>
            <details><summary><span>05</span><strong>Apps, IA aplicada y Web3</strong><b>+</b></summary><p>Conceptos, prototipos y evaluaciones de viabilidad. Sistemas complejos requieren especialistas y validación técnica.</p></details>
          </div><div class="screen-note">Una persona dirige tu proyecto con apoyo de IA y herramientas visuales. No se promete programación especializada sin evaluación previa.</div><button class="solid-button wide" type="button" data-screen="membresias">Conocer los planes <span>→</span></button>
        </section>

        <section class="screen" id="screen-portafolio" data-screen-content="portafolio" aria-labelledby="portfolio-title"><span class="screen-eyebrow">ARCHIVO 02 / TRABAJO PROPIO</span><h2 id="portfolio-title">No solo ideas.<br><em>Hay proyectos.</em></h2><p class="screen-lead">Tres iniciativas reales que muestran distintas formas de abordar una experiencia digital. Todos son proyectos propios y continúan evolucionando.</p>
          <div class="projects">
            <a class="project" href="https://peekdex.com" target="_blank" rel="noopener noreferrer"><div class="project-media peek"><img src="<?php echo esc_url(get_template_directory_uri()); ?>/assets/images/peekdex-logo.png" alt="Logotipo de PeekDex" loading="lazy"><span>01 · COMUNIDAD DIGITAL</span></div><div class="project-copy"><h3>PeekDex <span>↗</span></h3><p>Concepto de plataforma para coleccionistas de cartas con comunidad, contenido y comercio desarrollados por etapas.</p></div></a>
            <a class="project" href="https://iq-bites.com" target="_blank" rel="noopener noreferrer"><div class="project-media iq"><img src="<?php echo esc_url(get_template_directory_uri()); ?>/assets/images/iq-bites-logo.png" alt="Logotipo original IQ-Bites" loading="lazy"><span>02 · MARCA Y COMERCIO</span></div><div class="project-copy"><h3>IQ-Bites <span>↗</span></h3><p>Construcción de marca, comunicación comercial y experiencia digital para presentar snacks y facilitar pedidos.</p></div></a>
            <a class="project" href="https://estacionamientogube.com.mx" target="_blank" rel="noopener noreferrer"><div class="project-media gube"><img src="<?php echo esc_url(get_template_directory_uri()); ?>/assets/images/gube-logo.png" alt="Logotipo original Estacionamiento GUBE" loading="lazy"><span>03 · SERVICIO LOCAL</span></div><div class="project-copy"><h3>GUBE <span>↗</span></h3><p>Presencia web de un estacionamiento y evolución de herramientas para clientes, con autofacturación aún como proyecto.</p></div></a>
          </div><p class="footnote">No atribuimos métricas comerciales ni funciones productivas que no han sido comprobadas.</p><button class="solid-button wide" type="button" data-screen="diagnostico">Quiero trabajar mi proyecto <span>→</span></button>
        </section>

        <section class="screen" id="screen-membresias" data-screen-content="membresias" aria-labelledby="plans-title"><span class="screen-eyebrow">ACCESO 03 / SUSCRIPCIÓN</span><h2 id="plans-title">A tu ritmo.<br><em>Con un plan.</em></h2><p class="screen-lead">Cinco niveles de acompañamiento remoto. Cada uno limita las horas mensuales; primero revisamos el alcance y la agenda.</p>
          <div class="plan-selector" id="plan-selector" role="tablist" aria-label="Selecciona una membresía"><button type="button" class="plan-choice" data-plan="Inicio" role="tab">01</button><button type="button" class="plan-choice" data-plan="Impulso" role="tab">02</button><button type="button" class="plan-choice" data-plan="Presencia" role="tab">03</button><button type="button" class="plan-choice current" data-plan="Evolución" role="tab">04</button><button type="button" class="plan-choice" data-plan="Integral" role="tab">05</button></div>
          <div class="plan-card" role="tabpanel" aria-live="polite"><div class="plan-card-top"><span id="plan-numeral">NIVEL 04</span><span id="plan-time">9 HORAS / MES</span></div><h3 id="plan-name">Evolución</h3><p id="plan-tagline">Construir por etapas, con dirección clara.</p><div class="plan-price"><strong id="plan-price">$10,900</strong><span>MXN / MES<br>+ IVA SI CORRESPONDE</span></div><ul id="plan-items"></ul><p class="plan-caveat" id="plan-caveat"></p></div>
          <p class="footnote">Dominio, hosting del cliente, publicidad, APIs y licencias externas se cotizan aparte. No incluye trabajo ilimitado. Discord comunitario, y salas de voz en Integral, cuando estén habilitados y según agenda.</p>
          <button type="button" class="solid-button wide" id="choose-plan">Solicitar este plan <span>→</span></button><button type="button" class="inline-button centered" data-screen="servicios">¿Qué servicios puedo solicitar? ↗</button>
        </section>

        <section class="screen" id="screen-diagnostico" data-screen-content="diagnostico" aria-labelledby="contact-title"><span class="screen-eyebrow">PUERTA 04 / CONVERSACIÓN</span><h2 id="contact-title">Cuéntanos<br><em>tu próximo paso.</em></h2><p class="screen-lead">No tienes que saber de tecnología. Explícanos qué quieres resolver; evaluaremos si podemos ayudarte y con qué alcance.</p>
          <form id="studio-form" class="lead-form" novalidate>
            <div class="field-row"><label>Tu nombre *<input name="name" autocomplete="name" required minlength="2" maxlength="100" placeholder="Tu nombre"></label><label>Marca o negocio<input name="company" maxlength="120" placeholder="Opcional"></label></div>
            <label>Correo electrónico *<input type="email" autocomplete="email" required name="email" maxlength="160" placeholder="hola@tuempresa.com"></label>
            <label>WhatsApp (opcional)<input name="phone" autocomplete="tel" maxlength="30" placeholder="+52 ..."></label>
            <div class="field-row"><label>Servicio<select name="service" id="form-service"><option>Web / WordPress</option><option>Diseño / redes</option><option>Video / guiones</option><option>SEO / marketing</option><option>Prototipos / automatización</option><option>Blockchain / viabilidad</option><option>Otra idea</option></select></label><label>Plan<select name="plan" id="form-plan"><option>Inicio</option><option>Impulso</option><option>Presencia</option><option selected>Evolución</option><option>Integral</option></select></label></div>
            <label>¿Qué te gustaría lograr? *<textarea name="description" rows="4" required minlength="15" maxlength="2000" placeholder="Por ejemplo: quiero mejorar mi catálogo web y recibir solicitudes de clientes..." ></textarea></label>
            <label class="honeypot" aria-hidden="true">Sitio web<input type="text" name="website" tabindex="-1" autocomplete="off"></label>
            <label class="consent"><input type="checkbox" name="consent" value="1" required><span>Autorizo el uso de mis datos exclusivamente para atender esta solicitud. <button type="button" class="link-button" data-screen="privacidad">Ver información de privacidad</button>.</span></label>
            <div class="form-feedback" id="form-feedback" role="status" aria-live="polite"></div><button class="solid-button wide" id="form-submit" type="submit">Enviar solicitud <span>↗</span></button>
            <p class="form-legal">Sin cobro en este formulario. Si aceptamos el proyecto, acordaremos su alcance antes de facilitar un enlace de suscripción de Mercado Pago.</p>
          </form>
        </section>

        <section class="screen" id="screen-privacidad" data-screen-content="privacidad"><span class="screen-eyebrow">PRIVACIDAD / TRANSPARENCIA</span><h2>Tu información,<br><em>con cuidado.</em></h2><p class="screen-lead">Los datos que escribes se guardan en la instalación WordPress de este estudio para responder y evaluar la solicitud. No se usan para publicidad de terceros.</p><p class="screen-lead">Este texto es un resumen provisional. Antes de publicar el sitio comercialmente deben incluirse el aviso integral, responsable legal, domicilio, medios para ejercer derechos ARCO y política de retención.</p><button type="button" class="solid-button wide" data-screen="diagnostico">Volver al formulario <span>→</span></button></section>
      </div>
      <div class="drawer-bottom"><span>ESTUDIO DE AUTOR / PROYECTOS POR ETAPAS</span><span>✳</span></div>
    </aside>
    <div class="drawer-scrim" id="drawer-scrim"></div>
  </main>
  <div class="mobile-tip" id="mobile-tip">TOCA UNA ESTACIÓN O EXPLORA CON LOS CONTROLES</div>
</div>
<?php wp_footer(); ?>
</body>
</html>