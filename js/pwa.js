(function(){
  // Registrar Service Worker para experiencia tipo "app" (PWA)
  if('serviceWorker' in navigator){
    window.addEventListener('load', function(){
      navigator.serviceWorker.register('./sw.js').catch(function(){});
    });
  }
})();