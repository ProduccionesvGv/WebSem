// Unified renderer: delegate to data-driver's renderCards so #carousel usa el mismo template que #carousel2
(function(){
  function ready(fn){ if(document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  ready(function(){
    if (typeof renderCards === 'function') {
      try { renderCards('carousel', (window.PRODUCTS||[])); } catch(e){}
    }
  });
})();\n