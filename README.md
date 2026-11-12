# Estudio de Autor · Oficina VR 3.1

Experiencia de oficina **3D en primera persona**, con recorrido de teclado/ratón, controles táctiles y entrada WebXR para visores compatibles.

## Qué funciona

- Oficina 3D con mobiliario geométrico interactivo, panorama fotográfico 360°, iluminación ambiental y cuatro estaciones.
- WASD / flechas para caminar; arrastrar el ratón o pantalla para mirar; E para abrir una estación cercana.
- Menú de acceso directo y botones táctiles para evitar bloquear conversiones.
- Modo VR WebXR: A-Frame habilita render estereoscópico y selección por controladores; además hay cursor de mirada. Para mayor comodidad el recorrido en VR utiliza puntos de teletransporte, no desplazamiento continuo.
- Cinco membresías: Inicio $790 (0.5h), Impulso $1,990 (1.5h), Presencia $4,990 (4h), Evolución $10,900 (9h), Integral $19,900 (16h). Precios mensuales antes de los impuestos aplicables. Son propuestas, no tarifas validadas.
- PeekDex, IQ-Bites y GUBE con descripciones honestas de su estado.
- Formularios de prospectos en WordPress: protección nonce, validación, límite de solicitudes, registro privado y panel admin con tope manual de 55h.
- Demo HTML independiente: formulario en modo simulación, no almacena ni envía información.

## Requisitos técnicos

- WordPress 6.2+, PHP 8+, hosting de WordPress (Hostinger compatible).
- HTTPS obligatorio para usar WebXR en un visor; también hace falta un navegador WebXR y dispositivo compatible.
- A-Frame **1.8.0** desde `https://aframe.io/releases/1.8.0/aframe.min.js`; internet necesario para cargar el motor. Se recomienda autoalojar esta dependencia antes de campañas comerciales después de revisar licencia y actualizaciones.
- Las fotografías del entorno son referencias visuales generadas para el sitio. La geometría es WebGL 3D en tiempo real, no captura de un espacio físico ni un gemelo digital real.
- VR no está probado en hardware real dentro de esta entrega: hace falta una prueba de Meta Quest u otro visor WebXR y comprobar rendimiento, teletransporte y lectura de textos en casco.

## Instalación en Hostinger

1. Crear un WordPress independiente para el nuevo negocio. No intervenir sitios de GUBE o IQ-Bites.
2. Instalar el tema ZIP desde **Apariencia → Temas → Añadir → Subir tema** y activar.
3. Asegurar HTTPS y abrir la web en computadora/móvil. Probar que carga A-Frame y se ven objetos 3D.
4. Hacer una solicitud de prueba y verificar que aparece en **Escritorio → Solicitudes**; revisar el correo SMTP.
5. Probar WebXR en visor compatible y navegador seguro; la experiencia se usa sin gafas en todos los demás casos.
6. Completar el aviso de privacidad integral, condiciones, marca/dominio, correo legal, backups, seguridad, caché, política de cancelación y consentimiento.
7. Configurar planes en Mercado Pago, enviar links solo tras aprobación del alcance; el tema no procesa tarjetas ni consulta webhooks.
8. Configurar Discord real antes de ofrecer acceso a canales o salas de voz.

## Seguridad y veracidad

Esta oficina es un entorno virtual promocional y no una oficina física abierta al público. El responsable presta servicio remoto con IA y herramientas visuales; desarrollo complejo y tareas de seguridad deben ser evaluados antes de aceptar. En VR, por comodidad, el usuario debe salir del visor para llenar el formulario. No se prometen resultados comerciales ni funcionalidades de terceros aún no habilitadas.

Repositorio de referencia: https://github.com/MacachyMazo/PAGINA-WEB-IA

Dependencia A-Frame, licencia MIT: https://github.com/aframevr/aframe
