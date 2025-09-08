
(function(){
  function ready(fn){ if(document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  function money(n){ try{ return n.toLocaleString('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:0}); }catch(e){ return n; } }
  function renderFromProducts(){
    try{
      var c = document.getElementById('carousel');
      if(!c) return;
      // Clear only comments/whitespace
      while(c.firstChild){ c.removeChild(c.firstChild); }
      var prods = (window.PRODUCTS||[]);
      if(!prods.length) return;
      var frag = document.createDocumentFragment();
      prods.forEach(function(p){
        var card = document.createElement('div');
        card.className = 'card';

        var imgWrap = document.createElement('a');
        imgWrap.href = '#specs';
        imgWrap.className = 'card-img-wrap';
        imgWrap.dataset.id = p.id;

        var hero = (p.images && p.images[0]) || (window.PLACEHOLDER || 'img/placeholder.svg');
        imgWrap.style.backgroundImage = "url('"+ hero +"')";
        imgWrap.style.backgroundSize = "cover";
        imgWrap.style.backgroundPosition = "center";

        imgWrap.addEventListener('click', function(e){
          if(typeof showSpecs === 'function'){ showSpecs(p.id); }
          e.preventDefault();
        });

        var body = document.createElement('div');
        body.className = 'card-body';
        var title = document.createElement('h3');
        title.className = 'title';
        title.textContent = p.title || p.id;
        body.appendChild(title);

        card.appendChild(imgWrap);
        card.appendChild(body);
        frag.appendChild(card);
      });
      c.appendChild(frag);
    }catch(e){
      console && console.error && console.error('fix-cards render error', e);
    }
  }
  ready(renderFromProducts);
})();
