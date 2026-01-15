(function(){
  // Registrar Service Worker para experiencia tipo "app" (PWA)
  if('serviceWorker' in navigator){
    // En GitHub Pages (project site) la ruta suele ser /WebSem/
    // Intentamos primero con scope absoluto y, si falla, con ruta relativa.
    var regPromise = null;
    try{
      regPromise = navigator.serviceWorker.register('/WebSem/sw.js', { scope: '/WebSem/' })
        .catch(function(){ return navigator.serviceWorker.register('./sw.js'); })
        .catch(function(){});
    }catch(e){
      try{ regPromise = navigator.serviceWorker.register('./sw.js').catch(function(){}); }catch(e2){}
    }

    // En algunos Android/Chromium el instalador no aparece hasta que el SW controla la página.
    // Hacemos un "reload una sola vez" para que quede controlada sin loops.
    try{
      if(regPromise && navigator.serviceWorker.ready){
        regPromise.then(function(){
          navigator.serviceWorker.ready.then(function(reg){
            try{ reg.update(); }catch(e){}
            try{
              if(!navigator.serviceWorker.controller && !sessionStorage.getItem('pwa_sw_reloaded')){
                sessionStorage.setItem('pwa_sw_reloaded','1');
                location.reload();
              }
            }catch(e){}
          }).catch(function(){});
        }).catch(function(){});
      }
    }catch(e){}
  }

  // Instalación (PWA) - Android/Chromium permite prompt mediante beforeinstallprompt
  var deferredPrompt = null;
  var installNowBtn = null;
  var pendingClick = false;
  var clickInstallTimeoutMs = 2500;

  function waitForDeferredPrompt(timeoutMs){
    timeoutMs = (typeof timeoutMs === 'number' && timeoutMs > 0) ? timeoutMs : clickInstallTimeoutMs;
    if(deferredPrompt) return Promise.resolve(deferredPrompt);
    return new Promise(function(resolve){
      var start = Date.now();
      (function tick(){
        if(deferredPrompt) return resolve(deferredPrompt);
        if(Date.now() - start >= timeoutMs) return resolve(null);
        setTimeout(tick, 120);
      })();
    });
  }

  function setInstallNowReady(ready){
    if(!installNowBtn) return;
    installNowBtn.disabled = !ready;
    installNowBtn.style.opacity = ready ? '1' : '0.7';
    installNowBtn.style.cursor = ready ? 'pointer' : 'not-allowed';
    if(ready) installNowBtn.classList.add('is-ready');
    else installNowBtn.classList.remove('is-ready');
  }

  window.addEventListener('beforeinstallprompt', function(e){
    e.preventDefault();
    deferredPrompt = e;
    document.body.classList.add('can-install');
    updateInstallVisibility();
    // Si el usuario ya abrió el modal, habilitar el botón apenas el navegador habilite el instalador
    setInstallNowReady(true);
  });

  window.addEventListener('appinstalled', function(){
    deferredPrompt = null;
    document.body.classList.remove('can-install');
    setInstallNowReady(false);
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

    function doPrompt(){
      if(!deferredPrompt) return;
      deferredPrompt.prompt();
      try{
        deferredPrompt.userChoice.then(function(){
          deferredPrompt = null;
          setInstallNowReady(false);
        });
      }catch(err){
        deferredPrompt = null;
      }
    }

    btn.addEventListener('click', function(){
      if(pendingClick) return;

      // Si el navegador soporta el prompt de instalación, 1 click.
      if(deferredPrompt){
        doPrompt();
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

      // Android/Chromium: a veces el instalador aparece unos segundos después (SW/engagement).
      // Esperamos un poco para que el click siga funcionando "como antes".
      pendingClick = true;
      btn.classList.add('is-waiting');

      var swReady = Promise.resolve();
      try{
        if('serviceWorker' in navigator && navigator.serviceWorker && navigator.serviceWorker.ready){
          swReady = navigator.serviceWorker.ready.catch(function(){ return null; });
        }
      }catch(e){}

      swReady
        .then(function(){
          return waitForDeferredPrompt(clickInstallTimeoutMs);
        })
        .then(function(dp){
          pendingClick = false;
          btn.classList.remove('is-waiting');
          if(dp){
            doPrompt();
            return;
          }

          // Si no aparece el instalador, mostramos el fallback.
          openInstallModal(
            '<p><b>No aparece el instalador automático todavía.</b></p>' +
            '<p>En algunos dispositivos se habilita tras recargar la página o tras unos segundos de navegación.</p>' +
            '<button id="installNowBtn" type="button" disabled style="width:100%;margin:12px 0;padding:12px 14px;border-radius:12px;border:0;background:#25D366;color:#0b0b0e;font-weight:700;cursor:pointer;opacity:0.7">Instalar ahora</button>' +
            '<p style="margin:0 0 8px">Si no se habilita, instalá manualmente:</p>' +
            '<ul>' +
              '<li><b>Android (Chrome/Edge)</b>: menú (⋮) → <b>Instalar app</b> o <b>Agregar a pantalla principal</b>.</li>' +
              '<li><b>Escritorio</b>: ícono de instalación en la barra de direcciones o menú → <b>Instalar</b>.</li>' +
            '</ul>'
          );

          installNowBtn = document.getElementById('installNowBtn');
          if(installNowBtn){
            setInstallNowReady(!!deferredPrompt);
            installNowBtn.onclick = function(){
              if(!deferredPrompt) return;
              doPrompt();
            };
          }
        })
        .catch(function(){
          pendingClick = false;
          btn.classList.remove('is-waiting');
        });

      return;
    });
  }

  document.addEventListener('DOMContentLoaded', function(){ bindInstallButton(); updateInstallVisibility(); });
  window.addEventListener('appinstalled', updateInstallVisibility);
  window.addEventListener('load', updateInstallVisibility);
})();