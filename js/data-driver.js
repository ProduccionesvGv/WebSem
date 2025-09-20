
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
  renderCards('carousel', (window.PRODUCTS||[]));
}

function renderCards(listId, products){
  var list = document.getElementById(listId);
  if(!list) return;
  list.setAttribute('role','list');
  list.setAttribute('aria-label','Listado de productos');
  list.innerHTML = '';
  var prods = (products || []);
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


  

function renderVariantsSpecs(p){
  if(!p || !Array.isArray(p.variants) || !p.variants.length) return '';
  var isPack = (Array.isArray(p.tags) && p.tags.indexOf('pack') !== -1);
  function esc(s){ return (s==null || s==='') ? '-' : String(s); }
  function rend(v){
    var a = [];
    if (v.produccion_int) a.push('INT: ' + v.produccion_int);
    if (v.produccion_ext) a.push('EXT: ' + v.produccion_ext);
    return a.length ? a.join(' / ') : (p.rendimiento || '-');
  }
  function block(v){
    var banco = esc(v.banco || p.banco);
    var genetica = esc(v.genetica);
    var flor = esc(v.ciclo_completo || p.floracion);
    var thc = esc(v.thc);
    var rendimiento = esc(rend(v));
    var sabor = esc(v.sabor || p.sabor);
    var notas = esc(v.notas || p.notas || (isPack ? 'Pack con cuatro genéticas destacadas.' : ''));
    return '' +
      '<article class="spec-card">' +
      '  <header class="spec-card__head"><h5>'+ esc(v.name||'-') +'</h5></header>' +
      '  <div class="spec-card__grid">' +
      '    <div><div class="label">Banco</div><div class="value">'+ banco +'</div></div>' +
      '    <div><div class="label">Genética</div><div class="value">'+ genetica +'</div></div>' +
      '    <div><div class="label">Floración</div><div class="value">'+ flor +'</div></div>' +
      '    <div><div class="label">THC</div><div class="value">'+ thc +'</div></div>' +
      '    <div><div class="label">Rendimiento</div><div class="value">'+ rendimiento +'</div></div>' +
      '    <div><div class="label">Sabor</div><div class="value">'+ sabor +'</div></div>' +
      '    <div class="full"><div class="label">Notas</div><div class="value">'+ notas +'</div></div>' +
      '  </div>' +
      '</article>';
  }
  return (p.variants||[]).map(block).join('');
}

function showSpecsFromProducts(id){
  function updateVariantSpecsView(target, v){
    if(!target || !v) return;
    var rows = [
      ['Genética', v.genetica || '-'],
      ['Satividad', v.satividad || '-'],
      ['THC', v.thc || '-'],
      ['Producción INT', v.produccion_int || '-'],
      ['Producción EXT', v.produccion_ext || '-'],
      ['Ciclo Completo', v.ciclo_completo || '-'],
      ['Efecto', v.efecto || '-'],
      ['Sabor', v.sabor || '-']
    ];
    target.innerHTML = '<div class="spec-grid">'
      + rows.map(function(r){ return '<div><div class="label">'+r[0]+'</div><div class="value">'+r[1]+'</div></div>'; }).join('')
      + '</div>';
  }


    var _all = (window.PRODUCTS||[]).concat(window.PRODUCTS_INDOOR||[]);
    var p = _all.find(function(x){ return x.id === id; });
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
    
    
    
    
    
    
    /* STACKED EXTRA SPECS v7: 4 fichas con título y mismo estilo, SOLO para Cuadro 2 → Card 1 (id: dealer-deal-xxl) */
    try{
      if (p && Array.isArray(p.variants) && p.variants.length >= 1 && (window.SPECS_VIEW_MODE === 'all' || (Array.isArray(p.tags) && p.tags.indexOf('pack') !== -1))){

        // Helper to build rows from a variant or from product fields
        function rowsFrom(v, p){
          return [
            ['Banco', (p && p.banco) ? p.banco : '—'],
            ['Genética', (v && v.genetica) || (p && p.genetica) || '—'],
            ['Floración', (v && v.ciclo_completo) || (p && p.floracion) || '—'],
            ['THC', (v && v.thc) || (p && p.thc) || '—'],
            ['Satividad', (v && v.satividad) || (p && p.satividad) || '—'],
            ['Rendimiento', (v && ( ((v.produccion_int?('INT: '+v.produccion_int):'') + (v.produccion_ext?(' / EXT: '+v.produccion_ext):'') ).trim() )) || (p && p.rendimiento) || '—'],
            ['Efecto', (v && v.efecto) || (p && p.efecto) || '—'],
            ['Sabor', (v && v.sabor) || (p && p.sabor) || '—'],
            ['Cantidad', (v && v.cantidad) || (p && p.cantidad) || ((p && p.notas) ? p.notas : '—')]
          ];
        }

        function articleHTML(title, rows){
          return ''
            + '<article class="spec-card">'
            + '  <header class="spec-card__head"><h5>'+title+'</h5></header>'
            + '  <div class="spec-grid">'
            + rows.map(function(r){ return '<div><div class="label">'+r[0]+'</div><div class="value">'+r[1]+'</div></div>'; }).join('')
            + '  </div>'
            + '</article>';
        }

        // Ensure FIRST card is wrapped and titled "Critical +2"
        (function(){
          var firstGrid = card.querySelector('.spec-grid');
          var alreadyArticle = card.querySelector('.spec-card');
          if(firstGrid && !alreadyArticle){
            var firstTitle = (p.variants && p.variants[0] && p.variants[0].name) ? p.variants[0].name : 'Critical +2';
            var htmlWrapped = articleHTML(firstTitle, rowsFrom(p.variants && p.variants[0], p));
            // Replace inner with wrapped HTML instead of plain grid
            card.innerHTML = htmlWrapped;
          } else if (alreadyArticle){
            // If an article exists but no <h5>, add it
            var hasTitle = alreadyArticle.querySelector('h5');
            if(!hasTitle){
              var h = document.createElement('header');
              h.className = 'spec-card__head';
              var t = document.createElement('h5');
              t.textContent = (p.variants && p.variants[0] && p.variants[0].name) ? p.variants[0].name : 'Critical +2';
              h.appendChild(t);
              alreadyArticle.insertBefore(h, alreadyArticle.firstChild);
            }
          }
        })();

        // Append fichas 2..4 with separators
        function appendSep(){ var sep = document.createElement('div'); sep.className='spec-separator'; sep.setAttribute('aria-hidden','true'); card.appendChild(sep); }

        var v1 = (p.variants && p.variants[1]) || null; // Black Dom
        var v2 = (p.variants && p.variants[2]) || null; // Moby D
        var v3 = (p.variants && p.variants[3]) || null; // Northeren

        appendSep(); card.insertAdjacentHTML('beforeend', articleHTML( (v1 && v1.name) || 'Black Dom', rowsFrom(v1,p) ));
        appendSep(); card.insertAdjacentHTML('beforeend', articleHTML( (v2 && v2.name) || 'Moby D', rowsFrom(v2,p) ));
        appendSep(); card.insertAdjacentHTML('beforeend', articleHTML( (v3 && v3.name) || 'Northeren', rowsFrom(v3,p) ));
      }
    }catch(e){ /* swallow */ }
var vwrap = document.getElementById('specsVariants');
    if(vwrap){
      if(Array.isArray(p.variants) && p.variants.length){
        var pills = p.variants.map(function(v, i){
          var lab = (v.name || v.genetica || ('Var '+(i+1)));
          return '<button class="variant-pill'+(i===0?' active':'')+'" data-vi="'+i+'">'+lab+'</button>';
        }).join('');
        vwrap.innerHTML = '<div class="variant-pills">'+pills+'</div><div id="variantSpecsContainer" class="variant-specs"></div>';
        if(typeof updateVariantSpecsView==='function'){
          updateVariantSpecsView(document.getElementById('variantSpecsContainer'), p.variants[0]);
        }
        vwrap.addEventListener('click', function(ev){
          var b = ev.target && ev.target.closest('.variant-pill');
          if(!b) return;
          var idx = parseInt(b.getAttribute('data-vi')||'0',10);
          selectVariant(idx);
        }, {passive:true});
      } else {
        vwrap.innerHTML = '';
      }
    }
    }

    var gal = document.getElementById('specsGallery');
    if(gal){
      var arr = (p.images||[]);
      var want = (arr.length >= 5) ? 4 : 3;
      var imgs = (arr.length >= 5) ? arr.slice(1, 1+want) : arr.slice(0, want);
      if(imgs.length < want){
        var ph = (window.PLACEHOLDER || 'img/placeholder.svg');
        while(imgs.length < want) imgs.push(ph);
      }
      gal.innerHTML = imgs.map(function(src, i){
      var alt = (p.title||p.id) + ' ' + (i+1);
      var cls = 'gal-variant';
      var dv = ' data-vi="'+i+'"';
      return '<button class="'+cls+'"'+dv+'><img src="'+src+'" alt="'+alt+'" loading="lazy"></button>';
    }).join('');
    
    if(window.SPECS_VIEW_MODE === 'all'){
      // highlight none; stacked view doesn't need per-image selection
      [].forEach.call(gal.querySelectorAll('.gal-variant'), function(el){ el.classList.remove('active'); });
      // reset mode to default for next interactions
      window.SPECS_VIEW_MODE = null;
    }
/*__GAL_VARIANT_BIND__*/
    if(Array.isArray(p.variants) && p.variants.length){
      gal.addEventListener('click', function(ev){
        var b = ev.target && ev.target.closest('.gal-variant');
        if(!b) return;
        var idx = parseInt(b.getAttribute('data-vi')||'0',10);
        selectVariant(idx);
      }, {passive:true});
    }

    }
  
  // === Post-render fix: enforce 4 stacked fichas for indo-beta ===

  // === Post-render fix: enforce ONLY 1 example ficha for indo-gamma (third card) ===
  try{
    if(p && p.id === 'indo-gamma'){
      var card = document.getElementById('specsCard');
      if(card){
        function rowsFrom(v, p){
          return [
            ['Banco', (p && p.banco) ? p.banco : '—'],
            ['Genética', (v && v.genetica) || (p && p.genetica) || '—'],
            ['Floración', (v && v.ciclo_completo) || (p && p.floracion) || '—'],
            ['THC', (v && v.thc) || (p && p.thc) || '—'],
            ['Satividad', (v && v.satividad) || (p && p.satividad) || '—'],
            ['Rendimiento', (v && ((v.produccion_int?('INT: '+v.produccion_int):'') + (v.produccion_ext?(' | EXT: '+v.produccion_ext):'')).trim()) || (p && p.rendimiento) || '—'],
            ['Efecto', (v && v.efecto) || (p && p.efecto) || '—'],
            ['Sabor', (v && v.sabor) || (p && p.sabor) || '—'],
            ['Cantidad', (v && v.cantidad) || (p && p.cantidad) || ((p && p.notas) ? p.notas : '—')]
          ];
        }
        function articleHTML(title, rows){
          return '<article class="spec-card">'
            + '  <header class="spec-card__head"><h5>'+title+'</h5></header>'
            + '  <div class="spec-grid">'
            + rows.map(function(r){ return '<div><div class="label">'+r[0]+'</div><div class="value">'+r[1]+'</div></div>'; }).join('')
            + '  </div>'
            + '</article>';
        }
        var title = (p && p.title) ? p.title : 'Ficha técnica';
        // Render a SINGLE article using product-level fields (not variants)
        card.innerHTML = articleHTML(title, rowsFrom(null, p));
      }
    }
  }catch(e){}

  try{
    if(p && p.id === 'indo-beta' && Array.isArray(p.variants) && p.variants.length >= 1){
      var card = document.getElementById('specsCard');
      if(card){
        function rowsFrom(v, p){
          return [
            ['Banco', (p && p.banco) ? p.banco : '—'],
            ['Genética', (v && v.genetica) || (p && p.genetica) || '—'],
            ['Floración', (v && v.ciclo_completo) || (p && p.floracion) || '—'],
            ['THC', (v && v.thc) || (p && p.thc) || '—'],
            ['Satividad', (v && v.satividad) || (p && p.satividad) || '—'],
            ['Rendimiento', (v && ((v.produccion_int?('INT: '+v.produccion_int):'') + (v.produccion_ext?(' | EXT: '+v.produccion_ext):'')).trim()) || (p && p.rendimiento) || '—'],
            ['Efecto', (v && v.efecto) || (p && p.efecto) || '—'],
            ['Sabor', (v && v.sabor) || (p && p.sabor) || '—'],
            ['Cantidad', (v && v.cantidad) || (p && p.cantidad) || ((p && p.notas) ? p.notas : '—')]
          ];
        }
        function articleHTML(title, rows){
          return '<article class="spec-card">'
            + '  <header class="spec-card__head"><h5>'+title+'</h5></header>'
            + '  <div class="spec-grid">'
            + rows.map(function(r){ return '<div><div class="label">'+r[0]+'</div><div class="value">'+r[1]+'</div></div>'; }).join('')
            + '  </div>'
            + '</article>';
        }
        function appendSep(){ var sep = document.createElement('div'); sep.className = 'spec-sep'; sep.setAttribute('aria-hidden','true'); card.appendChild(sep); }
        // Build from up to 4 variants
        var v0 = p.variants[0], v1 = p.variants[1], v2 = p.variants[2], v3 = p.variants[3];
        // Reset content to ensure deterministic output
        card.innerHTML = articleHTML((v0 && v0.name) || 'Var 1', rowsFrom(v0, p));
        if(v1){ appendSep(); card.insertAdjacentHTML('beforeend', articleHTML((v1.name||'Var 2'), rowsFrom(v1,p))); }
        if(v2){ appendSep(); card.insertAdjacentHTML('beforeend', articleHTML((v2.name||'Var 3'), rowsFrom(v2,p))); }
        if(v3){ appendSep(); card.insertAdjacentHTML('beforeend', articleHTML((v3.name||'Var 4'), rowsFrom(v3,p))); }
      }
    }
  }catch(e){}

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
        try { sec.scrollIntoView({behavior:'smooth', block:'start'});
    /*__SELECT_VARIANT__*/
    var selectVariant = function(idx){
      try{
        // pills
        var vwrap = document.getElementById('specsVariants');
        if(vwrap){
          var pills = vwrap.querySelectorAll('.variant-pill');
          [].forEach.call(pills, function(el){ el.classList.remove('active'); });
          if(pills[idx]) pills[idx].classList.add('active');
          // update specs view
          if(Array.isArray(p.variants) && p.variants[idx]){
            var cont = document.getElementById('variantSpecsContainer');
            if(cont && typeof updateVariantSpecsView==='function'){
              updateVariantSpecsView(cont, p.variants[idx]);
            }
          }
        }
        // gallery highlight
        [].forEach.call(gal.querySelectorAll('.gal-variant'), function(el){ el.classList.remove('active'); });
        var target = gal.querySelector('.gal-variant[data-vi="'+idx+'"]');
        if(target) target.classList.add('active');
      }catch(e){}
    };
 } catch(_){}
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
      try{ renderCards('carousel2', (window.PRODUCTS_INDOOR||[])); }catch(_){ }
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


// === Carousel Controls (Prev/Next) ===
(function(){
  
  function scrollByCard(list, dir){
    try {
      if(!list) return;
      var item = list.querySelector('.card');
      var step = list.clientWidth * 0.9; // fallback
      if(item){
        var rect = item.getBoundingClientRect();
        step = rect.width;
        var cs = getComputedStyle(list);
        var gap = parseFloat(cs.columnGap || cs.gap || '0') || 0;
        step += gap;
      }
      list.scrollBy({ left: dir * step, behavior: 'smooth' });
    } catch(e){ try { console.error('scrollByCard error', e); } catch(_){} }
  }

  function bindCarouselArrows(){
    var sections = document.querySelectorAll('.carousel-section');
    for(var i=0;i<sections.length;i++){
      (function(section){
        if(section._arrowsWired) return;
        section._arrowsWired = true;
        var list = section.querySelector('.carousel');
        var prev = section.querySelector('#prevBtn, #prevBtn2, .prevBtn');
        var next = section.querySelector('#nextBtn, #nextBtn2, .nextBtn');
        if(prev){ prev.addEventListener('click', function(e){ e.preventDefault(); scrollByCard(list, -1); }); }
        if(next){ next.addEventListener('click', function(e){ e.preventDefault(); scrollByCard(list, 1); }); }
      })(sections[i]);
    }
  }

  if(document.readyState !== 'loading') bindCarouselArrows();
  else document.addEventListener('DOMContentLoaded', bindCarouselArrows);
})();


/* === Render all variants stacked (one below another) === */
function renderAllVariantsStacked(target, p){
  if(!target || !p || !Array.isArray(p.variants) || !p.variants.length) return false;
  var blocks = p.variants.map(function(v, i){
    var rows = [
      ['Genética', v.genetica || '-'],
      ['Satividad', v.satividad || '-'],
      ['THC', v.thc || '-'],
      ['Producción INT', v.produccion_int || '-'],
      ['Producción EXT', v.produccion_ext || '-'],
      ['Ciclo Completo', v.ciclo_completo || '-'],
      ['Efecto', v.efecto || '-'],
      ['Sabor', v.sabor || '-']
    ];
    return '<div class="variant-block">'
      + '<div class="variant-title">'+(v.name||v.genetica||('Var '+(i+1)))+'</div>'
      + '<div class="spec-grid">'
      + rows.map(function(r){ return '<div><div class="label">'+r[0]+'</div><div class="value">'+r[1]+'</div></div>'; }).join('')
      + '</div></div>';
  }).join('');
  target.innerHTML = '<div class="variant-stack">'+blocks+'</div>';
  return true;
}





// Hero area click (capture) -> stacked variants for Cuadro 2
document.addEventListener('click', function(ev){
  try{
    var thumb = ev.target && ev.target.closest('.card-img-wrap');
    if(!thumb) return;
    var section = thumb.closest('.carousel-section');
    if(!section) return;
    var isCuadro2 = !!section.querySelector('#carousel2');
    if(!isCuadro2) return;
    var card = thumb.closest('.card');
    var btn = card && card.querySelector('.card-btn');
    var pid = btn && btn.getAttribute('data-id');
    if(!pid) return;
    // set mode BEFORE the card-btn handler runs
    window.SPECS_VIEW_MODE = 'all';
  }catch(e){}
}, true); // capture = true, runs before bubbling handlers

// === Ensure stacked mode also when clicking the button or any card inside CUADRO 2 ===
document.addEventListener('click', function(ev){
  try{
    var section = ev.target && ev.target.closest('#cuadro2');
    if(!section) return;
    var card = ev.target.closest('.card');
    if(!card) return;
    // set mode BEFORE the card-btn handler runs
    window.SPECS_VIEW_MODE = 'all';
  }catch(e){}
}, true);



