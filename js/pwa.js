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
    updateInstallVisibility();
  });

  window.addEventListener('appinstalled', function(){
    deferredPrompt = null;
    document.body.classList.remove('can-install');
  });

  function isIOS(){
    return /iphone|ipad|ipod/i.test(navigator.userAgent);
  }


  function isStandalone(){
    return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || (navigator.standalone === true);
  }

  function updateInstallVisibility(){
    var btn = document.querySelector('.app-toast');
    if(!btn) return;

    // ocultar si ya está instalada
    if(isStandalone()){
      btn.style.display = 'none';
      return;
    }

    // Mostrar siempre el botón: si hay prompt se instala con 1 click; si no, se muestran instrucciones.
    btn.style.display = '';
  }

  function bindInstallButton(){
    var btn = document.querySelector('.app-toast');
    if(!btn) return;

    function openInstallModal(html){
      var modal = document.getElementById('installModal');
      var body  = document.getElementById('installModalBody');
      var close = document.getElementById('installModalClose');
      if(!modal || !body) return;

      body.innerHTML = html;
      modal.classList.add('active');
      modal.setAttribute('aria-hidden','false');

      function doClose(){
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden','true');
        window.removeEventListener('keydown', onKey);
      }
      function onKey(ev){
        if(ev.key === 'Escape') doClose();
      }
      if(close) close.onclick = doClose;
      modal.onclick = function(ev){
        if(ev.target === modal) doClose();
      };
      window.addEventListener('keydown', onKey);
    }

    function syncAppSize(){
      var appImg = btn.querySelector('img');
      var andreani = document.querySelector('.shipping-img');
      if(!appImg || !andreani) return;

      function update(){
        var w = andreani.getBoundingClientRect().width || 0;
        if(w > 0){
          // Nunca más grande que Andreani (y mantiene tamaño chico por CSS)
          appImg.style.maxWidth = w + 'px';
        }
      }
      update();
      window.addEventListener('resize', update);
    }

    syncAppSize();

    btn.addEventListener('click', function(){
      // Si el navegador soporta el prompt de instalación
      if(deferredPrompt){
        deferredPrompt.prompt();
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
        openInstallModal(
          '<p>En <b>iPhone/iPad</b> se instala desde el navegador.</p>' +
          '<ul>' +
            '<li>Abrí el botón <b>Compartir</b> (⬆️).</li>' +
            '<li>Elegí <b>“Agregar a pantalla de inicio”</b>.</li>' +
            '<li>Confirmá con <b>Agregar</b>.</li>' +
          '</ul>'
        );
        return;
      }

      // Otros navegadores: instalación manual desde el menú
      openInstallModal(
        '<p>Si tu navegador no muestra el instalador automático, podés hacerlo manualmente:</p>' +
        '<ul>' +
          '<li><b>Android (Chrome/Edge)</b>: menú (⋮) → <b>Instalar app</b> o <b>Agregar a pantalla principal</b>.</li>' +
          '<li><b>Escritorio</b>: buscá el ícono de instalación en la barra de direcciones o menú → <b>Instalar</b>.</li>' +
        '</ul>'
      );
    });
  }

  document.addEventListener('DOMContentLoaded', function(){ bindInstallButton(); updateInstallVisibility(); });
  window.addEventListener('appinstalled', updateInstallVisibility);
  window.addEventListener('load', updateInstallVisibility);
})();