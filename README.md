# Estudio de Autor · Tema WordPress 2.0

Diseño editorial minimalista e interactivo para un estudio digital independiente, preparado para instalarse en un WordPress nuevo alojado en Hostinger.

## Propuesta visual

Una página continua, con tipografía editorial, fondo limpio y acentos tecnológicos en azul. La portada incluye un pequeño laboratorio de capas con reacción al cursor y tres modos seleccionables. La inspiración es conceptual y no copia materiales ni interacciones completas de otros estudios.

## Funcionalidades incluidas

- Secciones de servicios, proyectos, cinco membresías, orientador por horas, proceso, FAQ y formulario.
- Portafolio con los logotipos proporcionados en los archivos del usuario: PeekDex, IQ-Bites y GUBE.
- Selección dinámica de 5 membresías en JS; los planes y horas se corresponden con el backend de WordPress.
- Formulario con validación, autorización de privacidad, nonce y guardado privado de solicitudes en WordPress.
- Menú Solicitudes en WordPress para revisar clientes, administrar estados y controlar máximo 55 horas activas reservadas de forma manual.
- Responsive, navegación por teclado, reducción de movimiento y componentes semánticos.

## Instalación en Hostinger

1. Crear un sitio WordPress nuevo en hPanel bajo el dominio definitivo de este emprendimiento. No instalar sobre IQ-Bites, GUBE ni PeekDex.
2. En el administrador WordPress ir a Apariencia > Temas > Añadir > Subir tema.
3. Subir el ZIP `Estudio_de_Autor_WordPress_Clean_v2.zip`, activar el tema y abrir la portada.
4. En Ajustes > Generales verificar la dirección del administrador, además de entregar correo SMTP para recibir notificaciones; las solicitudes también se registran en el panel.
5. Abrir la sección Solicitudes del administrador. No marcar una solicitud como activa sin acuerdo comercial y cobro confirmado.
6. Publicar un aviso de privacidad **integral** y los términos de contratación antes de campañas, incluyendo razón social, contacto, tratamiento de datos, derechos ARCO y política de cancelación.
7. Crear manualmente en Mercado Pago los planes reales y compartir sus enlaces solo tras aprobar un proyecto. Esta versión NO procesa pagos ni verifica suscripciones automáticamente.
8. Crear servidor Discord y reglas de horarios y acceso antes de ofrecer invitaciones y sesiones de voz.
9. Configurar respaldos, HTTPS, reCAPTCHA o Turnstile, y monitorización de entregas de correo antes de hacer campañas de volumen.

## Pruebas realizadas

- `php -l` en front-page.php y functions.php.
- `node --check` en ambos scripts JS.
- Navegación e interacciones probadas en navegador sin errores JS: selector de áreas del laboratorio, pestañas de planes, recomendador por horas, formulario sin backend y menú móvil.
- Vista de escritorio 1440 px y móvil 390 px, sin desbordamiento horizontal.
- **Pendiente:** comprobar almacenamiento real de solicitudes en un WordPress instalado y SMTP, conectar hosting, licencias y Mercado Pago.

## Seguridad y límites

- El tema no contiene contraseñas, tokens, ni claves API de Mercado Pago.
- La demo HTML es visual; no envía formularios a WordPress y no debe usarse como página de captación real.
- El trabajo Web3 es de viabilidad y prototipos; sistemas financieros requieren revisión y auditoría independiente.
- La marca `Estudio de Autor` es un nombre provisional sin declaración de marca registrada.
- El control de horas depende de registrar/actualizar manualmente solicitudes activas.

## Estructura

- `estudio-de-autor/front-page.php` landing
- `estudio-de-autor/functions.php` backend de prospectos y ajustes del tema
- `estudio-de-autor/assets/css/studio.css` sistema visual
- `estudio-de-autor/assets/css/immersive.css` estados visuales del laboratorio
- `estudio-de-autor/assets/js/studio.js` planes, recomendador y formulario
- `estudio-de-autor/assets/js/immersive.js` laboratorio, progreso, accesibilidad
- `estudio-de-autor/assets/images/` logotipos de portafolio

## Referencias de inspiración consultadas

- https://bruno-simon.com/
- https://www.cyclemon.com/index.html
- https://www.latecheckout.studio/