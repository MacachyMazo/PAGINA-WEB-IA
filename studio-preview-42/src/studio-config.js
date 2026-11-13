/**
 * Configuración pública de Estudio de Autor.
 * No guardar aquí claves secretas, tokens ni datos bancarios.
 * Las URLs de pago deben provenir de un checkout real creado en la cuenta del comerciante.
 * Apple Pay y Google Pay se muestran a través de un checkout habilitado por el proveedor.
 */
window.EDA_SITE_CONFIG=Object.freeze({
 monitors:{
   videoUrl:"" // URL HTTPS de tu MP4/WebM. Se reproducirá en silencio y en loop.
 },
 discord:{
   serverId:"",                    // ID público del servidor autorizado de Estudio de Autor
   inviteUrl:"",                   // URL de invitación específica de este estudio
   textChannelUrl:"",              // https://discord.com/channels/SERVER_ID/CHANNEL_ID
   voiceChannelUrl:"",             // Canal de voz en Discord; desde allí puede activar cámara
   videoChannelUrl:""              // Puede usar el mismo canal de voz con permiso de vídeo
 },
 checkout:{
   Inicio:{mercadopago:"",stripe:""},
   Impulso:{mercadopago:"",stripe:""},
   Presencia:{mercadopago:"",stripe:""},
   "Evolución":{mercadopago:"",stripe:""},
   Integral:{mercadopago:"",stripe:""}
 }
});
