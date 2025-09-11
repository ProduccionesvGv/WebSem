(function(){
  var root = document.documentElement;
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.getElementById('siteMenu');
  var buttons = document.querySelectorAll('.theme-btn');

  function closeMenu(){
    if (menu){ menu.setAttribute('hidden',''); }
    if (toggle){ toggle.setAttribute('aria-expanded','false'); }
  }
  function openMenu(){
    if (menu){ menu.removeAttribute('hidden'); }
    if (toggle){ toggle.setAttribute('aria-expanded','true'); }
  }

  // safe localStorage
  function saveTheme(theme){ try { localStorage.setItem('theme-color', theme); } catch(e){} }
  function loadTheme(){ try { return localStorage.getItem('theme-color'); } catch(e){ return null; } }

  // apply saved theme
  var saved = loadTheme();
  if (saved){ root.setAttribute('data-theme', saved); }

  // toggle menu open/close
  if (toggle && menu){
    toggle.addEventListener('click', function(){
      var open = !menu.hasAttribute('hidden');
      if (open){ closeMenu(); } else { openMenu(); }
    });
  }

  // helper: find ancestor anchor (compat, no closest)
  function findAnchor(el, stopAt){
    while (el && el !== document && el !== stopAt){
      if (el.tagName && el.tagName.toLowerCase() === 'a'){ return el; }
      el = el.parentNode;
    }
    return null;
  }

  // close on link click (e.g., "Feminizadas")
  if (menu){
    menu.addEventListener('click', function(e){
      var link = findAnchor(e.target, menu);
      if (link){
        closeMenu(); // let anchor navigate and close the drawer
      }
    });
  }

  // theme switch: apply + save + close menu
  for (var i = 0; i < buttons.length; i++){
    (function(btn){
      btn.addEventListener('click', function(){
        var theme = btn.getAttribute('data-theme');
        if (theme){
          root.setAttribute('data-theme', theme);
          saveTheme(theme);
        }
        closeMenu();
      });
    })(buttons[i]);
  }

  // Accordion behavior for sections (Estilo / Genéticas)
  var groups = document.querySelectorAll('.site-menu .menu-group');
  for (var i = 0; i < groups.length; i++){
    (function(group){
      // collapsed by default
      group.setAttribute('aria-expanded', 'false');
      var header = group.querySelector('h3');
      if (!header) return;
      header.setAttribute('role','button');
      header.setAttribute('tabindex','0');

      function toggleGroup(){
        var isOpen = group.getAttribute('aria-expanded') === 'true';
        // close all groups first
        for (var j = 0; j < groups.length; j++){
          groups[j].setAttribute('aria-expanded','false');
        }
        // open if it was closed
        group.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
      }

      header.addEventListener('click', toggleGroup);
      header.addEventListener('keydown', function(e){
        if (e.key === 'Enter' || e.key === ' '){
          e.preventDefault();
          toggleGroup();
        }
      });
    })(groups[i]);
  }

  // close with ESC
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && menu && !menu.hasAttribute('hidden')){
      closeMenu();
    }
  });
})();