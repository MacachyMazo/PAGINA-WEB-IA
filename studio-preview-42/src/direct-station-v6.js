(function stationDeepLinks(){
 'use strict';
 const params=new URLSearchParams(location.search);
 const station=params.get('estacion');
 if(!['portafolio','membresias','discord'].includes(station))return;
 const start=performance.now();
 let tries=0;
 const timer=setInterval(()=>{
   tries++;
   const holograms=window.EDA_V4,ui=window.EDA_SPATIAL;
   const scene=document.querySelector('#office-scene');
   if(!holograms||!ui||!scene?.hasLoaded){
     if(performance.now()-start>15000)clearInterval(timer);
     return;
   }
   clearInterval(timer);
   window.EDA_CINEMA?.skip?.();
   document.querySelector('#enter-office')?.click();
   holograms.focus(station,true);
   ui.show(station);
   const help=document.querySelector('#status-help');
   if(help)help.textContent='Estación '+station+' abierta. Usa Escape para regresar a la oficina.';
 },180);
})();