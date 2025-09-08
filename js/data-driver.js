
(function(){
  "use strict";

  // Module-scoped state
  var __currentCardBtn = null;

  function ready(fn){
    if(document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  function moneyARS(n){
    try { return n.toLocaleString('es-AR', {style:'currency', currency:'ARS', maximumFractionDigits:0}); }
    catch(e){ return n; }
  }

  function heroOf(p){
    return (p && Array.isArray(p.images) && p.images[0]) || (window.PLACEHOLDER || 'img/placeholder.svg');
  }

  function verifyImages(products){
    (products||[]).forEach(function(p){
      (p.images||[]).forEach(function(src){
        var img = new Image();
        img.onerror = function(){ try{ console.warn('[IMAGEN FALTANTE]', p.id, '→', src); }catch(_){ } };
        img.src = src;
      });
    });
  }

  

function renderCardsFromProducts(){
  var list = document.getElementById('carousel');
  if(!list) return;
  list.setAttribute('role','list');
  list.setAttribute('aria-label','Listado de productos');
  list.innerHTML = '';
  var prods = (window.PRODUCTS || []);
  var frag = document.createDocumentFragment();

  prods.forEach(function(p){
    var item = document.createElement('div');
    item.setAttribute('role','listitem');
    item.className = 'card';

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'card-btn';
    btn.setAttribute('data-id', p.id);
    btn.setAttribute('aria-label', (p.title || p.id) + ': abrir especificaciones');
    btn.setAttribute('aria-expanded', 'false');

    var imgWrap = document.createElement('div');
    imgWrap.className = 'card-img-wrap';
    imgWrap.setAttribute('aria-hidden','true');
    imgWrap.style.backgroundImage = "url('"+ heroOf(p) +"')";
    imgWrap.style.backgroundSize = 'cover';
    imgWrap.style.backgroundPosition = 'center';

    var body = document.createElement('div');
    body.className = 'card-body';
    body.innerHTML = ''  + '<h3 class="title">'+(p.title||p.id)+'</h3>'  + (p.subtitle ? '<p class="subtitle">'+p.subtitle+'</p>' : '')  + (typeof p.price_ars !== 'undefined' && p.price_ars!==null ? '<p class="price">'+moneyARS(p.price_ars)+'</p>' : '<p class="price">Consultar</p>');
    btn.addEventListener('click', function(e){
      e.preventDefault();
      if(window.__currentCardBtn){ window.__currentCardBtn.setAttribute('aria-expanded','false'); }
      window.__currentCardBtn = btn;
      btn.setAttribute('aria-expanded','true');
      showSpecsFromProducts(p.id);
      openSpecsAccordion();
      scrollToSpecs();
    }, {passive:false});

    btn.appendChild(imgWrap);
    btn.appendChild(body);
    item.appendChild(btn);
    frag.appendChild(item);
  });

  list.appendChild(frag);

  // Delegation (safety). Attach only once.
  if(!list._delegated){
    list.addEventListener('click', function(ev){
      var el = ev.target;
      var btn = el.closest ? el.closest('.card-btn') : null;
      if(!btn) return;
      var id = btn.getAttribute('data-id');
      if(!id) return;
      ev.preventDefault();
      if(window.__currentCardBtn){ window.__currentCardBtn.setAttribute('aria-expanded','false'); }
      window.__currentCardBtn = btn;
      btn.setAttribute('aria-expanded','true');
      showSpecsFromProducts(id);
      openSpecsAccordion();
      scrollToSpecs();
    }, {passive:false});
    list._delegated = true;
  }
}


  function showSpecsFromProducts(id){
    var p = (window.PRODUCTS || []).find(function(x){ return x.id === id; });
    if(!p) return;

    var name = document.getElementById('specName');
    if(name) name.textContent = p.title || p.id;

    var card = document.getElementById('specsCard');
    if(card){
      var html = ''
        + '<div class="spec-grid">'
        + '  <div><div class="label">Banco</div><div class="value">'+(p.banco||'-')+'</div></div>'
        + '  <div><div class="label">Genética</div><div class="value">'+(p.genetica||'-')+'</div></div>'
        + '  <div><div class="label">Floración</div><div class="value">'+(p.floracion||'-')+'</div></div>'
        + '  <div><div class="label">THC</div><div class="value">'+(p.thc||'-')+'</div></div>'
        + '  <div><div class="label">Rendimiento</div><div class="value">'+(p.rendimiento||'-')+'</div></div>'
        + '  <div><div class="label">Sabor</div><div class="value">'+(p.sabor||'-')+'</div></div>'
        + '  <div class="notes full"><div class="label">Notas</div><div class="value">'+(p.notas||'-')+'</div></div>'
        + '</div>';
      card.setAttribute('aria-live','polite');
      card.setAttribute('aria-atomic','false');
      card.innerHTML = html;
    }

    var gal = document.getElementById('specsGallery');
    if(gal){
      var imgs = (p.images && p.images.slice(0,3)) || [];
      if(imgs.length < 3){
        var ph = (window.PLACEHOLDER || 'img/placeholder.svg');
        while(imgs.length < 3) imgs.push(ph);
      }
      gal.innerHTML = imgs.map(function(src, i){
        var alt = (p.title||p.id) + ' ' + (i+1);
        return '<img src="'+src+'" alt="'+alt+'" loading="lazy">';
      }).join('');
    }
  }

  function openSpecsAccordion(){
    var section = document.getElementById('specs');
    var panel = document.getElementById('specsPanel');
    var btn = document.getElementById('specsToggle');
    if(!section || !panel) return;
    section.classList.remove('collapsed');
    panel.hidden = false;
    section.setAttribute('aria-expanded','true');
    if(btn) btn.setAttribute('aria-expanded','true');
  }
  function closeSpecsAccordion(){
    var section = document.getElementById('specs');
    var panel = document.getElementById('specsPanel');
    var btn = document.getElementById('specsToggle');
    if(!section || !panel) return;
    section.classList.add('collapsed');
    panel.hidden = true;
    section.setAttribute('aria-expanded','false');
    if(btn) btn.setAttribute('aria-expanded','false');
  }
  function toggleSpecsAccordion(){
    var section = document.getElementById('specs');
    if(!section) return;
    if(section.classList.contains('collapsed')) {
      openSpecsAccordion();
      scrollToSpecs();
    } else {
      closeSpecsAccordion();
    }
  }

  function scrollToSpecs(){
    try{
      var sec = document.getElementById('specs');
      if(!sec) return;
      requestAnimationFrame(function(){
        try { sec.scrollIntoView({behavior:'smooth', block:'start'}); } catch(_){}
      });
      setTimeout(function(){ try{ location.hash = '#specs'; }catch(_){ } }, 200);
    }catch(_){}
  }

  // Toggle button hookup
  document.addEventListener('DOMContentLoaded', function(){
    var tgl = document.getElementById('specsToggle');
    if(tgl && !tgl._wired){
      tgl.addEventListener('click', function(e){ e.preventDefault(); toggleSpecsAccordion(); }, {passive:false});
      tgl._wired = true;
    }
  });

  // Boot
  ready(function(){
    try {
      renderCardsFromProducts();
      verifyImages(window.PRODUCTS);
      closeSpecsAccordion(); // Start collapsed; do not auto-open
    } catch (e) {
      try { console.error('data-driver init error:', e); } catch(_){}
    }
  });

  // Expose
  window.showSpecs = showSpecsFromProducts;
  window.openSpecsAccordion = openSpecsAccordion;
  window.closeSpecsAccordion = closeSpecsAccordion;
  window.toggleSpecsAccordion = toggleSpecsAccordion;
})();
