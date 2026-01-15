(function(){
  // Registrar Service Worker para experiencia tipo "app" (PWA)
  if('serviceWorker' in navigator){
    window.addEventListener('load', function(){
      navigator.serviceWorker.register('./sw.js').catch(function(){});
    });
  }

  // Instalación PWA (Android/Chromium). En iPhone se muestra guía.
  var deferredPrompt = null;

  function isIOS(){
    return /iphone|ipad|ipod/i.test(navigator.userAgent);
  }
  function isStandalone(){
    return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true;
  }

  function initInstallUI(){
    var installEl = document.getElementById('install-toast');
    if(!installEl) return;

    // Si ya está instalada, no mostrar el acceso
    if(isStandalone()){
      installEl.style.display = 'none';
      return;
    }

    installEl.addEventListener('click', function(ev){
      ev.preventDefault();

      if(deferredPrompt){
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(function(){
          deferredPrompt = null;
        }).catch(function(){
          deferredPrompt = null;
        });
        return;
      }

      // Fallback (por ejemplo iPhone/Safari)
      if(isIOS()){
        alert('En iPhone: tocá "Compartir" y elegí "Agregar a pantalla de inicio".');
      } else {
        alert('Si tu navegador lo permite, vas a ver la opción "Instalar" en el menú del navegador.');
      }
    });
  }

  window.addEventListener('beforeinstallprompt', function(e){
    // Guardar el evento para poder lanzarlo desde el botón
    e.preventDefault();
    deferredPrompt = e;
  });

  window.addEventListener('appinstalled', function(){
    var installEl = document.getElementById('install-toast');
    if(installEl) installEl.style.display = 'none';
  });

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initInstallUI);
  } else {
    initInstallUI();
  }
})();