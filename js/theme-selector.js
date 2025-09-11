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

/* === Accordion for menu sections (compat) === */
(function(){
  var groups = document.querySelectorAll('.site-menu .menu-group');
  for (var i = 0; i < groups.length; i++){
    (function(group){
      group.setAttribute('aria-expanded', 'false');
      var header = group.querySelector('h3');
      if (!header) return;
      header.setAttribute('role','button');
      header.setAttribute('tabindex','0');
      var toggle = function(){
        var isOpen = group.getAttribute('aria-expanded') === 'true';
        // close all
        for (var j = 0; j < groups.length; j++){
          groups[j].setAttribute('aria-expanded','false');
        }
        // open this if it was closed
        group.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
      };
      header.addEventListener('click', toggle);
      header.addEventListener('keydown', function(e){
        if (e.key === 'Enter' || e.key === ' '){
          e.preventDefault();
          toggle();
        }
      });
    })(groups[i]);
  }
})();