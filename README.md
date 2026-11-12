# Estudio de Autor · WordPress / Hostinger

Tema clásico de WordPress (PHP 8+, WordPress 6.2+), optimizado para una landing **de una sola página** con identidad editorial.

## Incluye realmente

- Navegación con menú móvil y desplazamiento por secciones.
- Cinco membresías interactivas (Inicio, Impulso, Presencia, Evolución, Integral).
- Selector dinámico de planes, beneficios, precios y horas. Sin compras automáticas.
- Orientador interactivo por horas que sugiere plan según capacidad. No cotiza entregables complejos automáticamente.
- Portafolio de PeekDex, IQ-Bites y Estacionamiento GUBE con links externos.
- FAQ accesible, formulario de prospectos con validación y respuesta de folio.
- Backend nativo de WordPress: solicitudes en base de datos, notificación al correo administrador si wp_mail está configurado y panel privado **WordPress → Solicitudes**.
- Gestión privada de estados y límite de 55 horas activas mensuales, con cierre manual de planes.
- Protección CSRF, saneamiento de campos, límite básico de envío por IP (hash efímero), honeypot antispam, permiso de administrador en gestión de datos.
- Información clara sobre Mercado Pago, Discord y servicios complejos sin declarar funciones no habilitadas.

## Instalar en Hostinger

1. En hPanel crea un **sitio WordPress nuevo**, con un dominio propio del nuevo negocio. No reutilices los WordPress de IQ-Bites, GUBE o otros negocios.
2. Sube el archivo `estudio-de-autor-wordpress.zip` desde **WordPress → Apariencia → Temas → Añadir tema → Subir tema**.
3. Activa **Estudio de Autor**.
4. Ve a **Ajustes → Generales** y configura el email administrador. Verifica entrega de correo SMTP, aunque todos los prospectos quedan guardados en el panel incluso si el correo no funciona.
5. En **WordPress → Solicitudes** revisa las solicitudes y cambia su estado manualmente. Marca `Activo` solo cuando haya contrato y cobro confirmado por Mercado Pago.
6. Antes de campañas públicas, publica aviso de privacidad integral, T&C, correo de contacto real, nombre legal responsable y política de cancelación. El texto provisional del footer **no sustituye** el aviso completo.
7. Para cobrar, crea planes reales en Mercado Pago → Planes de suscripción. Tras aprobar cada solicitud, comparte manualmente el link del plan correspondiente. **Nunca incluyas API keys en el tema**.
8. Crea tu servidor de Discord y define políticas de acceso. El tema no asigna roles ni crea llamadas automáticamente.

## Seguridad y límites honestos

- El tema no procesa pagos, no guarda tarjetas y no verifica estados de cobro: los administra Mercado Pago.
- El control de 55 horas usa la suma de solicitudes marcadas como `Activo`, y requiere cerrar manualmente los planes cancelados. No es un ERP ni calendario de horas consumidas.
- Los leads se guardan como post type privado y no se exponen en la REST API. Gestionarlos requiere la capacidad `manage_options`.
- No almacenes secretos en GitHub, frontend ni wp-config público. Para crecer, añade un CRM con permisos, retención de datos, back-ups, CAPTCHA, SMTP y monitorización.
- Los precios son iniciales; antes de lanzar sustituye gastos estimados por reales y revisa IVA/régimen fiscal.
- Nombre comercial provisional hasta confirmar branding y dominio.

## Archivos

`wp-content/themes/estudio-de-autor/style.css` cabecera del tema, `functions.php` backend WordPress, `front-page.php` HTML editorial, `index.php` respaldo, `assets/css/studio.css`, `assets/js/studio.js`.

## GitHub

Repositorio elegido: `MacachyMazo/PAGINA-WEB-IA`. La carpeta del tema debe ir bajo `wp-content/themes/estudio-de-autor/` para poder versionarlo y copiarlo a WordPress.

## Referencias oficiales

- https://developer.wordpress.org/themes/classic-themes/your-first-theme/
- https://developer.wordpress.org/reference/functions/register_post_type/
- https://www.mercadopago.com.mx/developers/es/docs/subscription-plans/create-subscription-plan