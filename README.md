# Estudio de Autor | Interactive World 3.0

Una experiencia digital de una sola página presentada como un mundo isométrico explorable, con suscripciones mensuales, portafolio propio y captación de prospectos.

## Funcionalidad de la versión 3.0

- Exploración mediante un pequeño dron: teclado WASD / flechas, controles táctiles y clic sobre el escenario para desplazarse automáticamente. Shift acelera; las estaciones también son pulsables y el menú superior ofrece acceso directo.
- Cuatro estaciones: Estudio (servicios), Archivo (PeekDex, IQ-Bites, GUBE), Membresías (cinco planes) y Diagnóstico (solicitud).
- Personaje, plataformas, arquitectura, carreteras y señalización ilustrados con Canvas 2D y perspectiva isométrica, sin dependencias JavaScript externas ni herramientas 3D pesadas.
- Panel lateral interactivo, selector de planes, accesibilidad con teclado, foco, adaptación móvil y control para reducir movimiento.
- Formulario vinculado a WordPress vía admin-ajax.php; lista de solicitudes protegida en WordPress > Solicitudes.
- Capacidad de 55 horas activas controlada manualmente por el administrador.

**Importante:** Es una experiencia visual isométrica 2.5D. No es un videojuego con física real, un mundo WebGL ni VR para visores. No requiere gafas.

## Instalar en WordPress con Hostinger

1. En el panel hPanel de Hostinger crea un **WordPress nuevo** para la marca independiente. No cambies las instalaciones de IQ-Bites ni GUBE.
2. En WordPress entra a **Apariencia → Temas → Añadir nuevo → Subir tema**.
3. Sube `Estudio_de_Autor_WordPress_Interactive_World_v3.zip` y activa **Estudio de Autor · Mundo Interactivo**.
4. Comprueba en una ventana privada que la portada abre y permite explorar, y prueba el formulario con un correo propio.
5. Comprueba que el registro aparezca en **Escritorio → Solicitudes**. El correo de aviso depende de `wp_mail`; configura SMTP para entrega confiable.
6. Completa el aviso de privacidad integral, contacto legal, condiciones comerciales, licencias, política de cancelación, HTTPS, respaldos y controles de spam antes de captar datos reales.
7. Configura los enlaces/planes **reales** en tu cuenta de Mercado Pago. Tras revisar el proyecto y aprobar el alcance, envía manualmente al cliente el enlace. En esta versión no hay integración de cobro automático ni comprobación de webhook.
8. Crea y prueba el servidor Discord antes de promocionar beneficios asociados. Las salas de voz del plan Integral están sujetas a agenda.

## Planes actuales (MXN por mes, IVA según corresponda)

| Plan | Precio | Horas / mes |
|---|---:|---:|
| Inicio | $790 | 0.5 |
| Impulso | $1,990 | 1.5 |
| Presencia | $4,990 | 4 |
| Evolución | $10,900 | 9 |
| Integral | $19,900 | 16 |

Ninguna membresía es de trabajo ilimitado. Hosting, APIs, dominio, publicidad, licencias y especialistas requeridos por proyectos complejos se presupuestan aparte. Los precios necesitan revisión final con los gastos e impuestos reales.

## Seguridad y límites

- El formulario utiliza la verificación de nonce de WordPress, saneamiento y validación en servidor, honeypot y límite básico de envíos por IP con hash efímero.
- Nunca publiques credenciales de Mercado Pago, contraseñas ni claves de API dentro del tema o en GitHub.
- El control de capacidad cuenta las horas declaradas de solicitudes marcadas como activas, y requiere cerrar manualmente las canceladas. No es un registro de horas consumidas ni conciliación de cobros.
- La demo HTML independiente **no envía formularios ni guarda datos**. Solo después de instalar y validar WordPress puede registrarse una solicitud.
- Este proyecto no fue publicado ni instalado en Hostinger en esta entrega. Es necesario verificar conexión al hosting, dominio, SSL y pruebas de producción.
- El estudio trabaja con IA, herramientas visuales y coordinación de especialistas. No se presentan soluciones financieras, blockchain y trading complejas como seguras o listas para producción sin pruebas y auditorías independientes.

## Archivos

`estudio-de-autor/` tema WordPress listo para instalar; su `front-page.php` contiene la interfaz, `assets/js/world.js` la navegación e interacciones, `assets/css/world.css` el diseño, `functions.php` el backend de solicitudes y el panel privado. `assets/images/` contiene logotipos originales de proyectos propios.

La demo HTML es autocontenida (CSS, JS e imágenes en un solo archivo) y puede abrirse localmente para revisar la experiencia; no sustituye una instalación de WordPress.

## GitHub

Repositorio designado: `https://github.com/MacachyMazo/PAGINA-WEB-IA`.

Para mantener el proyecto versionado, incluye el tema en `wp-content/themes/estudio-de-autor/` y no subas credenciales de producción. La instalación en Hostinger y el código de GitHub son pasos separados.