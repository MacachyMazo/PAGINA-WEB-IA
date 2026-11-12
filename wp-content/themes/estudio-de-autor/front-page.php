<?php if (!defined('ABSPATH')) { exit; } ?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo('charset'); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#f7f8f6">
  <meta name="description" content="Estudio digital independiente. Diseño web, WordPress, identidad, contenido, UX/UI y automatizaciones por suscripción. Un proyecto claro, una entrega posible.">
  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="skip-link" href="#contenido">Ir al contenido</a>
<div id="inicio" class="site-shell">
  <div class="reading-progress" aria-hidden="true"><span id="reading-progress-bar"></span></div>
  <header class="nav-shell" id="nav-shell">
    <a class="brand" href="#inicio" aria-label="Estudio de Autor, inicio">
      <span class="brand-mark" aria-hidden="true">e<span>.</span></span>
      <span class="brand-text">estudio<br><strong>de autor</strong></span>
    </a>
    <div class="nav-claim"><span class="status-dot" aria-hidden="true"></span> ESTUDIO DIGITAL INDEPENDIENTE <span class="nav-slash">/</span> MÉXICO, REMOTO</div>
    <button class="nav-toggle" id="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-links" aria-label="Abrir menú"><span></span><span></span></button>
    <nav id="nav-links" aria-label="Navegación principal">
      <a href="#servicios">Qué hacemos</a>
      <a href="#obra">Proyectos</a>
      <a href="#membresias">Membresías</a>
      <a class="nav-cta" href="#contacto">Hablemos <span aria-hidden="true">↗</span></a>
    </nav>
  </header>

  <main id="contenido">
    <!-- Una interacción con intención: los tres botones siempre son accesibles y no están dentro del objeto animado. -->
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-inner wrap">
        <div class="hero-copy">
          <div class="eyebrow"><span class="pill-line"></span> ESTUDIO INDEPENDIENTE · EDICIÓN 01/26</div>
          <h1 id="hero-title">Ideas con<br><em>carácter.</em><br>Digital por<br><span class="hero-outline">naturaleza.</span></h1>
          <p>Diseño, experiencias web y contenido con una mirada personal. Para negocios que no quieren otra página más, sino una presencia que tenga sentido.</p>
          <div class="hero-actions">
            <a href="#contacto" class="button button-primary">Cuéntame tu proyecto <span aria-hidden="true">↗</span></a>
            <a href="#obra" class="button-link">Ver trabajo propio <span aria-hidden="true">↓</span></a>
          </div>
          <div class="hero-metadata"><span><i></i> Por suscripción</span><span><i></i> Trabajo remoto</span><span><i></i> Alcances claros</span></div>
        </div>
        <div class="lab" id="lab-stage" tabindex="0" aria-label="Laboratorio interactivo: elige un servicio o mueve el cursor para cambiar la perspectiva">
          <div class="lab-header"><span>ESTUDIO / LABORATORIO VISUAL</span><span class="lab-live"><i></i> EN EXPLORACIÓN</span></div>
          <div class="lab-canvas">
            <div class="lab-grid" aria-hidden="true"></div>
            <div class="lab-corner corner-tl" aria-hidden="true">+</div><div class="lab-corner corner-tr" aria-hidden="true">+</div><div class="lab-corner corner-bl" aria-hidden="true">+</div><div class="lab-corner corner-br" aria-hidden="true">+</div>
            <div class="lab-object" id="lab-object" aria-hidden="true">
              <div class="object-shadow"></div>
              <div class="object-plane plane-back"></div>
              <div class="object-plane plane-middle"></div>
              <div class="object-plane plane-front"><span>e.</span><small>ESTUDIO DE AUTOR</small></div>
              <div class="object-glow"></div>
            </div>
            <div class="lab-side-note" aria-hidden="true">MUEVE TU IDEA ↗</div>
            <div class="lab-controls" role="group" aria-label="Explorar áreas del estudio">
              <button class="lab-choice is-active" type="button" data-lab="web" data-label="Sitios & UX" data-target="#servicios" aria-pressed="true"><span class="lab-choice-no">01</span> Sitios & UX <span aria-hidden="true">↗</span></button>
              <button class="lab-choice" type="button" data-lab="marca" data-label="Marca & contenido" data-target="#servicios" aria-pressed="false"><span class="lab-choice-no">02</span> Marca & contenido <span aria-hidden="true">↗</span></button>
              <button class="lab-choice" type="button" data-lab="sistemas" data-label="Automatización" data-target="#servicios" aria-pressed="false"><span class="lab-choice-no">03</span> Automatización <span aria-hidden="true">↗</span></button>
            </div>
          </div>
          <div class="lab-footer"><span id="lab-description" aria-live="polite">01 / Diseñamos experiencias fáciles de usar.</span><button class="motion-toggle" id="motion-toggle" type="button" aria-pressed="false">Reducir movimiento <span aria-hidden="true">◌</span></button></div>
        </div>
      </div>
      <div class="hero-bottom wrap"><span>PROYECTOS REALES. CONVERSACIONES REALES.</span><a href="#recorrido">DESLIZA PARA DESCUBRIR <span aria-hidden="true">↓</span></a><span>DISEÑO CON INTENCIÓN / 2026</span></div>
    </section>

    <div class="soft-divider" aria-hidden="true"><span>DISEÑO WEB</span><b>·</b><span>IDENTIDAD DIGITAL</span><b>·</b><span>CONTENIDO</span><b>·</b><span>UX / UI</span><b>·</b><span>AUTOMATIZACIÓN</span></div>

    <section class="story section-pad" id="recorrido" aria-labelledby="story-title">
      <div class="wrap story-grid">
        <div class="story-intro" data-reveal>
          <span class="eyebrow eyebrow-muted">01 / LA FORMA DE TRABAJAR</span>
          <h2 id="story-title">Menos ruido.<br><em>Más intención.</em></h2>
          <p>La tecnología es el medio. Lo importante es que tus clientes comprendan, confíen y puedan dar el siguiente paso.</p>
          <a class="inline-link" href="#contacto">Empecemos por tu idea <span aria-hidden="true">↗</span></a>
        </div>
        <div class="story-steps" aria-label="Tres etapas del proyecto">
          <article class="story-step" data-reveal><span class="story-number">01 / ENTENDER</span><span class="story-icon icon-orbit" aria-hidden="true"><i></i></span><h3>Primero, una buena pregunta.</h3><p>¿Qué necesita hacer tu cliente? ¿Qué obstáculo estamos resolviendo? Lo definimos antes de abrir cualquier herramienta.</p></article>
          <article class="story-step" data-reveal><span class="story-number">02 / CREAR</span><span class="story-icon icon-grid" aria-hidden="true"><i></i></span><h3>Después, una primera versión.</h3><p>Elegimos un alcance viable, construimos una pieza útil y la revisamos contigo. Sin vender imposibles.</p></article>
          <article class="story-step" data-reveal><span class="story-number">03 / MEJORAR</span><span class="story-icon icon-wave" aria-hidden="true"><i></i></span><h3>Luego, lo hacemos evolucionar.</h3><p>Medimos lo que sí puede comprobarse, recibimos comentarios y priorizamos las siguientes mejoras.</p></article>
        </div>
      </div>
    </section>

    <section id="servicios" class="services section-pad" aria-labelledby="services-title">
      <div class="wrap">
        <div class="section-heading" data-reveal><span class="eyebrow eyebrow-muted">02 / LO QUE PODEMOS HACER</span><div><h2 id="services-title">Un estudio pequeño.<br><em>Muchas posibilidades.</em></h2><p>Conocimiento digital, herramientas creativas e IA como apoyo de producción. Cada servicio se contrata por horas y con entregables acordados.</p></div></div>
        <div class="service-rows">
          <details class="service-row" open><summary><span>01</span><b>Web, WordPress y experiencia UX/UI</b><span class="service-meta">DISEÑO + PRODUCCIÓN</span><span class="service-plus" aria-hidden="true">+</span></summary><div><p>Landing pages, sitios comerciales, tiendas sencillas, prototipos, diseño de interfaces y ajustes a sitios existentes.</p><a href="#contacto">Solicitar diagnóstico ↗</a></div></details>
          <details class="service-row"><summary><span>02</span><b>Identidad, gráficos e imágenes</b><span class="service-meta">CANVA + IA VISUAL</span><span class="service-plus" aria-hidden="true">+</span></summary><div><p>Conceptos de marca, piezas para redes sociales, imágenes asistidas por IA, presentaciones y materiales digitales.</p><a href="#contacto">Solicitar diagnóstico ↗</a></div></details>
          <details class="service-row"><summary><span>03</span><b>Video, guiones y storytelling</b><span class="service-meta">FILMORA + EDICIÓN</span><span class="service-plus" aria-hidden="true">+</span></summary><div><p>Guiones, edición de clips, piezas cortas de contenido y propuestas narrativas. Duración y complejidad sujetas a evaluación.</p><a href="#contacto">Solicitar diagnóstico ↗</a></div></details>
          <details class="service-row"><summary><span>04</span><b>SEO, marketing y automatización</b><span class="service-meta">ESTRATEGIA + FLUJOS</span><span class="service-plus" aria-hidden="true">+</span></summary><div><p>SEO básico, mejoras de conversión, formularios y automatizaciones sencillas con herramientas disponibles y verificadas.</p><a href="#contacto">Solicitar diagnóstico ↗</a></div></details>
          <details class="service-row"><summary><span>05</span><b>Prototipos, apps y conceptos Web3</b><span class="service-meta">EXPLORACIÓN + VIABILIDAD</span><span class="service-plus" aria-hidden="true">+</span></summary><div><p>Prototipos de aplicaciones y DApps, interfaces y validación conceptual. Infraestructura financiera y contratos productivos requieren especialistas y auditorías externas.</p><a href="#contacto">Solicitar diagnóstico ↗</a></div></details>
        </div>
      </div>
    </section>

    <section id="obra" class="portfolio section-pad" aria-labelledby="work-title">
      <div class="wrap">
        <div class="portfolio-top" data-reveal><div><span class="eyebrow">03 / SELECCIÓN DE TRABAJO PROPIO</span><h2 id="work-title">Tres ideas.<br><em>Tres universos.</em></h2></div><p>Productos propios en diferentes etapas. El objetivo no es presumir cifras, sino mostrar cómo una idea toma forma en contextos distintos.</p></div>
        <div class="portfolio-grid">
          <a href="https://peekdex.com" class="case case-peek" target="_blank" rel="noopener noreferrer" aria-label="Visitar PeekDex en una nueva pestaña" data-reveal>
            <div class="case-art"><div class="case-mockup mockup-peek"><span class="case-topline"><b>PEEK DEX</b><span>TCG / 001</span></span><div class="mini-deck"><span>01</span><span>02</span><span>03</span></div><img loading="lazy" src="<?php echo esc_url(get_template_directory_uri() . '/assets/images/peekdex-logo.png'); ?>" alt="Logotipo de PeekDex"><small>COLECCIONAR / COMPARTIR / EXPLORAR</small></div><span class="case-link-icon" aria-hidden="true">↗</span></div>
            <div class="case-details"><span>01 · EXPERIENCIA DIGITAL</span><h3>PeekDex</h3><p>Concepto de comunidad y plataforma para coleccionistas de cartas, desarrollado por etapas.</p><strong>Proyecto en evolución</strong></div>
          </a>
          <a href="https://iq-bites.com" class="case case-iq" target="_blank" rel="noopener noreferrer" aria-label="Visitar IQ-Bites en una nueva pestaña" data-reveal>
            <div class="case-art"><div class="case-mockup mockup-iq"><span class="case-topline"><b>IQ-BITES</b><span>FOOD / 002</span></span><img loading="lazy" src="<?php echo esc_url(get_template_directory_uri() . '/assets/images/iq-bites-logo.png'); ?>" alt="Logotipo original IQ-Bites"><small>SNACKS INTELIGENTES</small></div><span class="case-link-icon" aria-hidden="true">↗</span></div>
            <div class="case-details"><span>02 · MARCA Y COMERCIO</span><h3>IQ-Bites</h3><p>Identidad, catálogo digital y comunicación para una marca propia de snacks.</p><strong>Marca en desarrollo comercial</strong></div>
          </a>
          <a href="https://estacionamientogube.com.mx" class="case case-gube" target="_blank" rel="noopener noreferrer" aria-label="Visitar Estacionamiento GUBE en una nueva pestaña" data-reveal>
            <div class="case-art"><div class="case-mockup mockup-gube"><span class="case-topline"><b>GUBE</b><span>SERVICIOS / 003</span></span><img loading="lazy" src="<?php echo esc_url(get_template_directory_uri() . '/assets/images/gube-logo.png'); ?>" alt="Logotipo de Estacionamiento GUBE"><small>SERVICIOS EN ZAPOPAN</small></div><span class="case-link-icon" aria-hidden="true">↗</span></div>
            <div class="case-details"><span>03 · PRESENCIA DE NEGOCIO</span><h3>Estacionamiento GUBE</h3><p>Presencia digital y experiencia de servicio para un negocio local. Funciones de autofacturación aún por validar.</p><strong>Servicio real, mejoras en desarrollo</strong></div>
          </a>
        </div>
        <p class="portfolio-note">* Estos son proyectos propios. Las funciones aún en desarrollo se describen como tales; no se atribuyen ventas ni resultados comerciales no comprobados.</p>
      </div>
    </section>

    <section id="membresias" class="membership section-pad" aria-labelledby="plans-title">
      <div class="wrap">
        <div class="section-heading" data-reveal><span class="eyebrow eyebrow-muted">04 / TRABAJO POR SUSCRIPCIÓN</span><div><h2 id="plans-title">Un plan a tu medida.<br><em>Sin contratar un equipo completo.</em></h2><p>Selecciona cuántas horas de acompañamiento necesitas. Antes de cobrar, revisamos alcance, disponibilidad y entregables.</p></div></div>
        <div class="plan-layout">
          <div class="plan-list" role="tablist" aria-label="Elige una membresía">
            <button role="tab" type="button" class="plan-tab" aria-selected="false" data-plan="Inicio"><span>01</span><strong>Inicio</strong><span>$790</span><b>↗</b></button>
            <button role="tab" type="button" class="plan-tab" aria-selected="false" data-plan="Impulso"><span>02</span><strong>Impulso</strong><span>$1,990</span><b>↗</b></button>
            <button role="tab" type="button" class="plan-tab" aria-selected="false" data-plan="Presencia"><span>03</span><strong>Presencia</strong><span>$4,990</span><b>↗</b></button>
            <button role="tab" type="button" class="plan-tab is-current" aria-selected="true" data-plan="Evolución"><span>04</span><strong>Evolución</strong><span>$10,900</span><b>↗</b></button>
            <button role="tab" type="button" class="plan-tab" aria-selected="false" data-plan="Integral"><span>05</span><strong>Integral</strong><span>$19,900</span><b>↗</b></button>
            <p class="plans-note">Horas mensuales no acumulables. No incluye entregas ilimitadas, licencias, anuncios ni hosting de tu negocio.</p>
          </div>
          <div id="plan-display" class="plan-display" role="tabpanel" aria-live="polite">
            <div class="plan-index"><span>MEMBRESÍA <strong id="plan-index">04</strong> / 05</span><span>ESTUDIO DE AUTOR</span></div>
            <span class="plan-badge">PLANEACIÓN & PRODUCCIÓN</span>
            <h3 id="plan-title">Las ideas toman forma.</h3>
            <p id="plan-description" class="plan-description">Ideal para proyectos digitales que avanzan por etapas.</p>
            <div class="plan-price"><strong id="plan-cost">$10,900</strong><span>MXN / MES<br>+ IVA CUANDO CORRESPONDA</span></div>
            <p class="plan-hours" id="plan-hours">9 horas de trabajo por mes</p>
            <ul id="plan-features"><li>9 horas de trabajo por mes</li><li>Desarrollo web por fases</li><li>Automatización evaluada</li><li>Diseño y contenido según prioridad</li></ul>
            <p class="plan-limit" id="plan-limit">Los proyectos complejos pueden requerir varias mensualidades.</p>
            <button class="button button-primary button-wide" id="apply-plan" type="button">Solicitar este plan <span aria-hidden="true">↗</span></button>
            <p class="plan-disclaimer">Pago recurrente por Mercado Pago solo después de acordar alcance y disponibilidad. Discord comunitario sujeto a activación; voz bajo cita en Integral cuando esté disponible.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="advisor section-pad" aria-labelledby="advisor-title"><div class="wrap advisor-layout">
      <div><span class="eyebrow eyebrow-muted">05 / ENCUENTRA TU PUNTO DE PARTIDA</span><h2 id="advisor-title">¿Cuánto apoyo<br><em>necesitas?</em></h2><p>Desliza para explorar una sugerencia. No es una cotización automática, solo una forma rápida de orientarte.</p></div>
      <div class="advisor-card"><div class="advisor-top"><span>HORAS DE TRABAJO AL MES</span><b id="advisor-hours">4 h</b></div>
        <input type="range" min="0.5" max="16" step="0.5" value="4" id="hours-slider" aria-label="Horas mensuales necesarias">
        <div class="range-labels"><span>30 MIN</span><span>16 H</span></div>
        <div class="advisor-recommendation"><span>OPCIÓN SUGERIDA</span><b id="advisor-plan">Presencia</b><small id="advisor-price">4 h · $4,990 mensuales</small></div>
        <button type="button" id="advisor-action" class="button button-primary button-wide">Ver el plan sugerido <span aria-hidden="true">↗</span></button>
        <p>La estimación de cada tarea se confirma antes de contratar; no garantiza que un proyecto termine en ese número de horas.</p>
      </div>
    </div></section>

    <section class="process section-pad" aria-labelledby="process-title"><div class="wrap">
      <div class="section-heading" data-reveal><span class="eyebrow eyebrow-muted">06 / UN PROCESO SIN COMPLICACIONES</span><div><h2 id="process-title">Primero claridad.<br><em>Después resultados comprobables.</em></h2></div></div>
      <div class="process-grid"><div><span>01</span><h3>Cuéntanos el reto.</h3><p>Un mensaje claro sobre lo que necesitas. Sin tener que saber de tecnología.</p></div><div><span>02</span><h3>Definimos la entrega.</h3><p>Revisamos viabilidad, horas, herramientas externas y fecha acordada.</p></div><div><span>03</span><h3>Acordamos el pago.</h3><p>Si ambos aceptamos, enviamos el enlace de suscripción de Mercado Pago.</p></div><div><span>04</span><h3>Hacemos y revisamos.</h3><p>Entregas por etapas y seguimiento remoto en horario acordado.</p></div></div>
    </div></section>

    <section id="contacto" class="contact section-pad" aria-labelledby="contact-title"><div class="wrap contact-layout">
      <div class="contact-intro" data-reveal><span class="eyebrow">07 / EMPECEMOS</span><h2 id="contact-title">¿Y si esa idea<br><em>ya empieza?</em></h2><p>No necesitas un brief perfecto. Cuéntanos el problema y analizamos juntos una primera entrega viable.</p><div class="contact-claims"><span>Sin costo por preguntar</span><span>Sin contratación automática</span><span>Respuesta sujeta a agenda</span></div></div>
      <div class="form-card"><div class="form-top"><span>FORMULARIO / 001</span><span>ESTUDIO DE AUTOR</span></div>
        <form id="studio-form" novalidate>
          <div class="form-row"><label>Tu nombre *<input name="name" required minlength="2" maxlength="100" autocomplete="name" placeholder="¿Cómo te llamas?"></label><label>Empresa o marca<input name="company" maxlength="120" placeholder="Opcional"></label></div>
          <div class="form-row"><label>Correo electrónico *<input name="email" required type="email" maxlength="160" autocomplete="email" placeholder="hola@tuempresa.com"></label><label>WhatsApp<input name="phone" maxlength="30" autocomplete="tel" placeholder="Opcional"></label></div>
          <div class="form-row"><label>¿Qué servicio buscas?<select name="service" required><option>Web / WordPress</option><option>Diseño / redes</option><option>Video / guiones</option><option>SEO / marketing</option><option>Prototipos / automatización</option><option>Blockchain / viabilidad</option><option>Otra idea</option></select></label><label>Plan que te interesa<select name="plan" id="form-plan" required><option>Inicio</option><option>Impulso</option><option>Presencia</option><option selected>Evolución</option><option>Integral</option></select></label></div>
          <label>¿Qué te gustaría resolver? *<textarea name="description" required minlength="15" maxlength="2000" rows="4" placeholder="Cuéntanos qué quieres lograr, aunque sea en pocas palabras..."></textarea></label>
          <div class="bot-field" aria-hidden="true"><label>No completar<input name="website" tabindex="-1" autocomplete="off"></label></div>
          <label class="consent-line"><input type="checkbox" name="consent" value="1" required><span>Autorizo el uso de mis datos para revisar y responder mi solicitud. No compartiré información confidencial. <a href="#privacidad">Ver privacidad.</a></span></label>
          <div id="form-result" class="form-result" role="status" aria-live="polite"></div>
          <button class="button button-primary button-wide" id="form-submit" type="submit">Enviar mi idea <span aria-hidden="true">↗</span></button>
          <small>Este formulario no procesa pagos ni activa suscripciones.</small>
        </form>
      </div>
    </div></section>

    <section class="faq section-pad" id="preguntas" aria-labelledby="faq-title"><div class="wrap faq-layout"><div><span class="eyebrow eyebrow-muted">08 / SIN CONFUSIONES</span><h2 id="faq-title">Lo que conviene<br><em>saber.</em></h2></div><div class="faq-list">
      <details><summary>¿Cada plan incluye una web completa? <span>+</span></summary><p>No necesariamente. Se contratan horas y tareas acordadas. Una web o aplicación puede necesitar varias etapas o mensualidades.</p></details>
      <details><summary>¿Cómo se hace el pago? <span>+</span></summary><p>Primero aprobamos el alcance y la agenda. Después enviamos un enlace generado en Mercado Pago. Los cobros automáticos aún no están conectados a esta página.</p></details>
      <details><summary>¿El plan Integral lo incluye todo? <span>+</span></summary><p>Ofrece acceso al catálogo elegible dentro de 16 horas mensuales, no entregas ilimitadas. Las llamadas de voz por Discord serán bajo cita, una vez habilitado el servicio.</p></details>
      <details><summary>¿Qué costos no están incluidos? <span>+</span></summary><p>Hosting, dominios, herramientas de pago, campañas publicitarias, APIs, auditorías y especialistas externos. Se presentan para aprobación antes de contratarlos.</p></details>
      <details><summary>¿También trabajan con blockchain y apps? <span>+</span></summary><p>Se pueden explorar conceptos, diseñar interfaces y construir prototipos. Para sistemas financieros o contratos en producción hacen falta evaluación, pruebas y especialistas.</p></details>
    </div></div></section>
  </main>

  <div class="floating-cta" id="floating-conversion"><span>¿Tienes algo en mente?</span><a href="#contacto">Hablemos ↗</a></div>
  <footer class="site-footer" id="privacidad"><div class="wrap">
    <div class="footer-lead"><div><span class="eyebrow">ESTUDIO DIGITAL INDEPENDIENTE</span><h2>Hagamos algo<br><em>que valga la pena.</em></h2></div><a class="footer-arrow" href="#contacto" aria-label="Ir al formulario de contacto">↗</a></div>
    <div class="footer-bottom"><span>ESTUDIO DE AUTOR · NOMBRE COMERCIAL PROVISIONAL</span><span>© <?php echo esc_html((string) date('Y')); ?> · MÉXICO, REMOTO</span><a href="<?php echo esc_url(wp_login_url()); ?>">ACCESO PRIVADO ↗</a></div>
    <div class="privacy"><b>Privacidad provisional:</b> Tus datos se almacenan en este WordPress para valorar tu solicitud y contactarte. No se venden ni se usan para campañas no autorizadas. Antes de publicar comercialmente se requiere aviso de privacidad integral, datos del responsable, condiciones de contratación y mecanismo de derechos ARCO. Mercado Pago y Discord se configuran por separado.</div>
  </div></footer>
</div>
<?php wp_footer(); ?>
</body></html>