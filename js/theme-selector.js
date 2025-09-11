
(function(){
  const root = document.documentElement;
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.getElementById('siteMenu');
  const buttons = document.querySelectorAll('.theme-btn');

  // apply saved theme
  const saved = localStorage.getItem('theme-color');
  if(saved){ root.setAttribute('data-theme', saved); }

  // toggle menu open/close
  if(toggle && menu){
    toggle.addEventListener('click', () => {
      const open = menu.hasAttribute('hidden') ? false : true;
      if(open){
        menu.setAttribute('hidden', '');
        toggle.setAttribute('aria-expanded', 'false');
      }else{
        menu.removeAttribute('hidden');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });
  }

  // close on link click
  menu?.addEventListener('click', (e)=>{
    if(e.target.closest('a')){
      menu.setAttribute('hidden','');
      toggle.setAttribute('aria-expanded','false');
    }
  });

  // theme switch
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.getAttribute('data-theme');
      root.setAttribute('data-theme', theme);
      localStorage.setItem('theme-color', theme);
    });
  });

  // close on ESC
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape' && !menu.hasAttribute('hidden')){
      menu.setAttribute('hidden','');
      toggle.setAttribute('aria-expanded','false');
    }
  });
})();
