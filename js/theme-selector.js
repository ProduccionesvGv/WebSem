(function(){
  var root = document.documentElement;
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.getElementById('siteMenu');
  var buttons = document.querySelectorAll('.theme-btn');

  // apply saved theme
  try {
    var saved = localStorage.getItem('theme-color');
    if (saved) { root.setAttribute('data-theme', saved); }
  } catch (e) {}

  // toggle menu open/close
  if (toggle && menu){
    toggle.addEventListener('click', function(){
      var open = !menu.hasAttribute('hidden');
      if (open){
        menu.setAttribute('hidden','');
        toggle.setAttribute('aria-expanded','false');
      } else {
        menu.removeAttribute('hidden');
        toggle.setAttribute('aria-expanded','true');
      }
    });
  }

  // close on link click
  if (menu){
    menu.addEventListener('click', function(e){
      var t = e.target;
      var link = t && t.closest ? t.closest('a') : null;
      if (link){
        menu.setAttribute('hidden','');
        if (toggle) toggle.setAttribute('aria-expanded','false');
      }
    });
  }

  // theme switch
  for (var i = 0; i < buttons.length; i++){
    (function(btn){
      btn.addEventListener('click', function(){
        var theme = btn.getAttribute('data-theme');
        root.setAttribute('data-theme', theme);
        try { localStorage.setItem('theme-color', theme); } catch (e) {}
      });
    })(buttons[i]);
  }

  // close on ESC
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && menu && !menu.hasAttribute('hidden')){
      menu.setAttribute('hidden','');
      if (toggle) toggle.setAttribute('aria-expanded','false');
    }
  });
})();