(function(){
  // Registrar Service Worker para experiencia tipo "app" (PWA)
  if('serviceWorker' in navigator){
    window.addEventListener('load', function(){
      navigator.serviceWorker.register('./sw.js').catch(function(){});
    });
  }

  // Instalación (PWA) - Android/Chromium permite prompt mediante beforeinstallprompt
  var deferredPrompt = null;

  window.addEventListener('beforeinstallprompt', function(e){
    e.preventDefault();
    deferredPrompt = e;
    document.body.classList.add('can-install');
  });

  window.addEventListener('appinstalled', function(){
    deferredPrompt = null;
    document.body.classList.remove('can-install');
  });

  function isIOS(){
    return /iphone|ipad|ipod/i.test(navigator.userAgent);
  }

  function bindInstallButton(){
    var btn = document.querySelector('.app-toast');
    if(!btn) return;

    btn.addEventListener('click', function(){
      // Si el navegador soporta el prompt de instalación
      if(deferredPrompt){
        deferredPrompt.prompt();
        // userChoice puede no existir en algunos navegadores antiguos
        try{
          deferredPrompt.userChoice.then(function(){
            deferredPrompt = null;
          });
        }catch(err){
          deferredPrompt = null;
        }
        return;
      }

      // iOS: no permite disparar el instalador desde un botón
      if(isIOS()){
        alert('En iPhone/iPad: tocá Compartir (⬆️) y elegí “Agregar a pantalla de inicio”.');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', bindInstallButton);
})();