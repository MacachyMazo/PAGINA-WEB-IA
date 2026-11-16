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
   serverId:"1570878284131074199",                    // ID público del servidor autorizado de Estudio de Autor
   inviteUrl:"https://discord.com/invite/EQrbUX8V",                   // URL de invitación específica de este estudio
   textChannelUrl:"",              // https://discord.com/channels/SERVER_ID/CHANNEL_ID
   voiceChannelUrl:"",             // Canal de voz en Discord; desde allí puede activar cámara
   videoChannelUrl:""              // Puede usar el mismo canal de voz con permiso de vídeo
 },
 billingPortal:"https://billing.stripe.com/p/login/aFa00j45v9gOeqH1s5grS00",
 checkout:{
   Inicio:{mercadopago:"",stripe:"https://buy.stripe.com/aFa00j45v9gOeqH1s5grS00"},
   Impulso:{mercadopago:"",stripe:"https://buy.stripe.com/6oU28r59zboW82j2w9grS01"},
   Presencia:{mercadopago:"",stripe:"https://buy.stripe.com/4gMeVd59zeB8dmD6MpgrS02"},
   "Evolución":{mercadopago:"",stripe:"https://buy.stripe.com/14A14n31rct082j6MpgrS03"},
   Integral:{mercadopago:"",stripe:"https://buy.stripe.com/bJe6oHgSh8cKfuL2w9grS04"}
 }
});
