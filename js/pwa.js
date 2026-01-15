(function(){
  // Registrar Service Worker para experiencia tipo "app" (PWA)
  if('serviceWorker' in navigator){
    // Registrar lo antes posible (mejora la chance de que el instalador se habilite rápido)
    try{ navigator.serviceWorker.register('./sw.js').catch(function(){}); }catch(e){}
  }

  // Instalación (PWA) - Android/Chromium permite prompt mediante beforeinstallprompt
  var deferredPrompt = null;
  var installNowBtn = null;

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

      // Chromium/Android a veces habilita el instalador unos segundos después.
      // Mostramos un modal con un botón que se habilita apenas llegue beforeinstallprompt.
      openInstallModal(
        '<p>Si el instalador automático está disponible, se va a habilitar el botón de abajo.</p>' +
        '<button id="installNowBtn" type="button" disabled style="width:100%;margin:12px 0;padding:12px 14px;border-radius:12px;border:0;background:#25D366;color:#0b0b0e;font-weight:700;cursor:pointer;opacity:0.7">Instalar ahora</button>' +
        '<p style="margin:0 0 8px">Si no se habilita, podés instalar manualmente:</p>' +
        '<ul>' +
          '<li><b>Android (Chrome/Edge)</b>: menú (⋮) → <b>Instalar app</b> o <b>Agregar a pantalla principal</b>.</li>' +
          '<li><b>Escritorio</b>: ícono de instalación en la barra de direcciones o menú → <b>Instalar</b>.</li>' +
        '</ul>'
      );

      // Conectar botón del modal (si existe)
      installNowBtn = document.getElementById('installNowBtn');
      if(installNowBtn){
        setInstallNowReady(!!deferredPrompt);
        installNowBtn.onclick = function(){
          if(!deferredPrompt) return;
          doPrompt();
        };
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function(){ bindInstallButton(); updateInstallVisibility(); });
  window.addEventListener('appinstalled', updateInstallVisibility);
  window.addEventListener('load', updateInstallVisibility);
})();