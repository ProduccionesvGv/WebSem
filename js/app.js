
const DATA_OVERRIDE = {
  "02Genext": {
    "01": {"title":"Dealer Deal XXL","genetica":"Autofloreciente","price":"99.000"},
    "02": {"title":"Psycho XXL","genetica":"Autofloreciente","price":"99.000"},
    "03": {"title":"Auto Granel","genetica":"Autofloreciente","price":"99.000"}
  },
  "01Genint": {
    "01": {"title":"Gen1","genetica":"Feminizada","price":"49.999"},
    "02": {"title":"Gen2","genetica":"Feminizada","price":"49.999"},
    "03": {"title":"Gen3","genetica":"Feminizada","price":"49.999"}
  }
};

function buildCarousel(rootId, folder){
  const container = document.getElementById(rootId);
  if(!container) return;
  ['01','02','03'].forEach(id=>{
    const folderPath = `img/${folder}/${id}`;
    const hero = `${folderPath}/Front.jpg`;
    const card = document.createElement('article');
    card.className = 'card';
    card.setAttribute('data-folder', folder);
    card.setAttribute('data-id', id);

    const heroDiv = document.createElement('div');
    heroDiv.className = 'hero';
    heroDiv.style.backgroundImage = `url('${hero}')`;

    const body = document.createElement('div');
    body.className = 'body';
    const meta = (DATA_OVERRIDE[folder] && DATA_OVERRIDE[folder][id]) || {title:`Item ${id}`, genetica:'', price:''};
    body.innerHTML = `<h3>${meta.title}</h3><div class="spec">${meta.genetica}</div><div class="price">${meta.price ? '$'+meta.price : 'Consultar'}</div>`;

    card.appendChild(heroDiv);
    card.appendChild(body);
    card.addEventListener('click', ()=> openGallery(folderPath));
    container.appendChild(card);
  });
}

function openGallery(folderPath){
  const images = ['foto1.jpg','foto2.jpg','foto3.jpg','foto4.jpg','Front2.jpg'].map(n=> `${folderPath}/${n}`);
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lb-img');
  const thumbs = document.getElementById('lb-thumbs');
  thumbs.innerHTML = '';
  img.src = images[0];
  images.forEach(src=>{
    const im = document.createElement('img');
    im.src = src;
    im.loading = 'lazy';
    im.onclick = ()=> img.src = src;
    thumbs.appendChild(im);
  });

// v32: split-view layout + fichas always visible
// Cleanup any previous split/fichas blocks
lb.querySelectorAll('.lb-split, .lb-ficha-panel, .lb-fichas-multi').forEach(n=>n.remove());

// Build split container with two panels
const split = document.createElement('div');
split.className = 'lb-split';
const left = document.createElement('section');
left.className = 'panel panel-visual';
const right = document.createElement('section');
right.className = 'panel panel-fichas';
split.appendChild(left);
split.appendChild(right);

// Insert split into lightbox
lb.appendChild(split);

// Move image and thumbs into left panel
if (img && img.parentElement !== left) left.appendChild(img);
if (thumbs && thumbs.parentElement !== left) left.appendChild(thumbs);

// Derive folder/id from folderPath: img/<folder>/<id>
const parts = folderPath.split('/');
const folder = parts[1];
const id = parts[2];

// Helper to build a ficha panel
function buildFicha(meta, titleOverride){
  const d = document.createElement('div');
  d.className = 'lb-ficha-panel';
  const t = titleOverride || meta.title || `${folder}-${id}`;
  d.innerHTML = `
    <h4 class="lb-ficha-title">${t}</h4>
    <div class="ficha-grid">
      <div><b>Banco</b><span>${meta.banco || '—'}</span></div>
      <div><b>Genética</b><span>${meta.genetica || '—'}</span></div>
      <div><b>Floración</b><span>${meta.floracion || '—'}</span></div>
      <div><b>THC</b><span>${meta.thc || '—'}</span></div>
      <div><b>Rendimiento</b><span>${meta.rendimiento || '—'}</span></div>
      <div><b>Sabor</b><span>${meta.sabor || '—'}</span></div>
      <div class="notas"><b>Notas</b><span>${meta.notas || '—'}</span></div>
    </div>`;
  return d;
}

// Render fichas
try{
  let rendered = false;
  if (folder === '02Genext' && id === '01' && window.DATA_FICHAS && DATA_FICHAS['02Genext'] && Array.isArray(DATA_FICHAS['02Genext']['01'])) {
    const arr = DATA_FICHAS['02Genext']['01'];
    if (arr.length){
      const cont = document.createElement('div');
      cont.className = 'lb-fichas-multi';
      arr.forEach(f => {
        const m = { title:f.titulo, banco:f.banco, genetica:f.genetica, floracion:f.floracion, thc:f.thc, rendimiento:f.rendimiento, sabor:f.sabor, notas:f.notas };
        cont.appendChild(buildFicha(m, f.titulo || ''));
      });
      right.appendChild(cont);
      rendered = true;
    }
  }
  if (!rendered){
    const meta = (window.DATA_OVERRIDE && DATA_OVERRIDE[folder] && DATA_OVERRIDE[folder][id]) || {};
    right.appendChild(buildFicha(meta));
  }
} catch(e) {
  right.appendChild(buildFicha({}));
}


// v46: ensure single visible close button
(function(){
  // remove duplicates
  lb.querySelectorAll('#lb-close').forEach((n,i)=>{ if(i>0) n.remove(); });
  let closeBtn = lb.querySelector('#lb-close');
  if (!closeBtn){
    closeBtn = document.createElement('button');
    closeBtn.id = 'lb-close';
    closeBtn.className = 'lb-close';
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label','Cerrar');
    closeBtn.innerHTML = '&times;';
    lb.appendChild(closeBtn);
  }
  // handler
  closeBtn.onclick = function(ev){ ev.stopPropagation(); lb.classList.remove('active'); };
  // keyboard ESC once per open
  function onKey(ev){
    if(ev.key === 'Escape'){ lb.classList.remove('active'); document.removeEventListener('keydown', onKey); }
  }
  document.addEventListener('keydown', onKey);
})();

  lb.classList.add('active');

// v34: Forzar render de 4 fichas para Dealer Deal XXL cuando aplique
try{
  const parts = folderPath.split('/'); const folder = parts[1]; const id = parts[2];
  const right = lb.querySelector('.panel-fichas');
  // builder local por si no existe en scope
  function _buildFicha(meta, titleOverride){
    const d = document.createElement('div');
    d.className = 'lb-ficha-panel';
    const t = titleOverride || meta.title || `${folder}-${id}`;
    d.innerHTML = `
      <h4 class="lb-ficha-title">${t}</h4>
      <div class="ficha-grid">
        <div><b>Banco</b><span>${meta.banco || '—'}</span></div>
        <div><b>Genética</b><span>${meta.genetica || '—'}</span></div>
        <div><b>Floración</b><span>${meta.floracion || '—'}</span></div>
        <div><b>THC</b><span>${meta.thc || '—'}</span></div>
        <div><b>Rendimiento</b><span>${meta.rendimiento || '—'}</span></div>
        <div><b>Sabor</b><span>${meta.sabor || '—'}</span></div>
        <div class="notas"><b>Notas</b><span>${meta.notas || '—'}</span></div>
      </div>`;
    return d;
  }
  const metaTitle = (window.DATA_OVERRIDE && DATA_OVERRIDE[folder] && DATA_OVERRIDE[folder][id] && DATA_OVERRIDE[folder][id].title) || '';
  const arr = (window.DATA_FICHAS && DATA_FICHAS[folder] && DATA_FICHAS[folder][id])
           || (metaTitle === 'Dealer Deal XXL' && DATA_FICHAS['02Genext'] && DATA_FICHAS['02Genext']['01'])
           || null;
  if (right && arr && Array.isArray(arr) && arr.length){
    right.innerHTML = '';
    const cont = document.createElement('div'); cont.className = 'lb-fichas-multi';
    arr.forEach(f => {
      const m = { title:f.titulo, banco:f.banco, genetica:f.genetica, floracion:f.floracion, thc:f.thc, rendimiento:f.rendimiento, sabor:f.sabor, notas:f.notas };
      cont.appendChild(_buildFicha(m, f.titulo || ''));
    });
    right.appendChild(cont);
  }
}catch(e){}

  lb.setAttribute('aria-hidden','false');
}

document.addEventListener('DOMContentLoaded', function(){
  buildCarousel('carousel','01Genint');
  buildCarousel('carousel2','02Genext');
  document.getElementById('lb-close').addEventListener('click', ()=>{
    const lb = document.getElementById('lightbox');
    lb.classList.remove('active');
    lb.setAttribute('aria-hidden','true');
  });
});


/* === Carousel controls binding === */
function bindCarouselControls(carouselId, prevId, nextId){
  const wrap = document.getElementById(carouselId);
  const prev = document.getElementById(prevId);
  const next = document.getElementById(nextId);
  if(!wrap || !prev || !next) return;
  function cardWidth(){
    const c = wrap.querySelector('.card');
    return c ? (c.getBoundingClientRect().width + 14) : 280;
  }
  prev.addEventListener('click', (e)=>{ e.stopPropagation(); wrap.scrollBy({left: -cardWidth()*1.2, behavior:'smooth'}); });
  next.addEventListener('click', (e)=>{ e.stopPropagation(); wrap.scrollBy({left:  cardWidth()*1.2, behavior:'smooth'}); });
}

document.addEventListener('DOMContentLoaded', function(){
  try{
    bindCarouselControls('carousel','prevBtn','nextBtn');
    bindCarouselControls('carousel2','prevBtn2','nextBtn2');
  }catch(e){ console.error('bind controls error', e); }
});


// v34: Datos Dealer Deal XXL (Carrusel 2 · Tarjeta 1)
(function(){
  try {
    window.DATA_OVERRIDE = window.DATA_OVERRIDE || DATA_OVERRIDE || {};
    if (!DATA_OVERRIDE["02Genext"]) DATA_OVERRIDE["02Genext"] = {};
    DATA_OVERRIDE["02Genext"]["01"] = Object.assign({}, DATA_OVERRIDE["02Genext"]["01"] || {}, {
      title: "Dealer Deal XXL"
    });

    window.DATA_FICHAS = window.DATA_FICHAS || {};
    if (!DATA_FICHAS["02Genext"]) DATA_FICHAS["02Genext"] = {};
    DATA_FICHAS["02Genext"]["01"] = [
      { titulo: "Critical+2", banco: "BSF Seeds", genetica: "Auto XXL",  floracion: "8-9 semanas", thc: "20%", rendimiento: "550 g/m²", sabor: "Dulce, afrutado", notas: "Estructura compacta, ideal para espacios reducidos." },
      { titulo: "Black Dom",  banco: "BSF Seeds", genetica: "Fem XXL",   floracion: "8 semanas",   thc: "22%", rendimiento: "600 g/m²", sabor: "Terroso, especiado", notas: "Fenotipo rápido, tronco fuerte para SCROG." },
      { titulo: "Moby-D",     banco: "BSF Seeds", genetica: "Fem XXL",   floracion: "10 semanas",  thc: "24%", rendimiento: "700 g/m²", sabor: "Cítrico, pino", notas: "Alta ramificación, responde bien a LST." },
      { titulo: "northern",   banco: "BSF Seeds", genetica: "Auto XXL",  floracion: "9 semanas",   thc: "19%", rendimiento: "500 g/m²", sabor: "Dulce, picante", notas: "Estable y resistente a estrés hídrico." }
    ];
  } catch(e) {}
})();


// vZoom-6 (standalone): modal de imagen al clic en #lb-img, zoom inicial 1.872x y centrado
(function(){
  function ensureModal(){
    var m = document.getElementById('zoom-modal');
    if (m) return m;
    m = document.createElement('div');
    m.id = 'zoom-modal';
    m.innerHTML = '<div class="zm-backdrop"></div><div class="zm-content"><button class="zm-close" type="button" aria-label="Cerrar">&times;</button><img class="zm-img" alt="Vista ampliada"></div>';
    document.body.appendChild(m);
    var img = m.querySelector('.zm-img');
    var close = function(){ m.classList.remove('active'); document.body.classList.remove('no-scroll'); img.removeAttribute('src'); };
    m.querySelector('.zm-backdrop').onclick = close;
    m.querySelector('.zm-close').onclick = close;
    document.addEventListener('keydown', function(ev){ if(ev.key === 'Escape') close(); });
    return m;
  }
  function isImgURL(u){ return /\.(?:jpe?g|png|webp|gif|bmp|avif)(?:\?|#|$)/i.test(u||""); }
  function pickFromImg(img){
    if(!img) return "";
    var ds = img.dataset||{};
    return ds.large || ds.full || ds.src || img.currentSrc || img.src || "";
  }
  function pickFromAnchor(a){
    if(!a) return "";
    var ds = a.dataset||{};
    return ds.large || ds.full || a.getAttribute("href") || "";
  }
  function pickBg(el){
    if(!el) return "";
    var bg = getComputedStyle(el).backgroundImage;
    if(bg && bg !== "none"){
      var u = bg.replace(/^url\((['"]?)(.*)\1\)$/,'$2');
      return u;
    }
    return "";
  }
  function getMainSrc(container, clickTarget){
    if(!container) return "";
    if(clickTarget && clickTarget.tagName === "IMG"){
      var u = pickFromImg(clickTarget); if(isImgURL(u)) return u;
    }
    var imgs = container.querySelectorAll("img");
    for (var i=0;i<imgs.length;i++){ var u2 = pickFromImg(imgs[i]); if(isImgURL(u2)) return u2; }
    var as = container.querySelectorAll("a[href]");
    for (var j=0;j<as.length;j++){ var u3 = pickFromAnchor(as[j]); if(isImgURL(u3)) return u3; }
    var u4 = pickBg(container); if(isImgURL(u4)) return u4;
    var nodes = container.querySelectorAll("*");
    for (var k=0;k<nodes.length;k++){ var u5 = pickBg(nodes[k]); if(isImgURL(u5)) return u5; }
    return "";
  }
  function applyZoomAndCenter(scale){
    var m = document.getElementById('zoom-modal');
    if(!m || !m.classList.contains('active')) return;
    var img = m.querySelector('.zm-img');
    var cont = m.querySelector('.zm-content');
    if(!img || !cont) return;
    try{
      img.style.maxWidth = 'none'; img.style.maxHeight = 'none'; img.style.width=''; img.style.height='';
      var vw = Math.floor(window.innerWidth * 0.95);
      var vh = Math.floor(window.innerHeight * 0.95);
      var nw = img.naturalWidth || img.width;
      var nh = img.naturalHeight || img.height;
      if(!nw || !nh) return;
      var fit = Math.min(vw / nw, vh / nh);
      var targetW = Math.max(1, Math.round(nw * fit * scale));
      img.style.width = targetW + 'px'; img.style.height = 'auto';
      cont.style.maxWidth = '95vw'; cont.style.maxHeight = '95vh'; cont.style.overflow='auto';
      requestAnimationFrame(function(){
        requestAnimationFrame(function(){
          var sw = img.scrollWidth || img.clientWidth;
          var sh = img.scrollHeight || img.clientHeight;
          var cw = cont.clientWidth, ch = cont.clientHeight;
          if (sw > cw) cont.scrollLeft = Math.max(0, Math.floor((sw - cw)/2));
          if (sh > ch) cont.scrollTop  = Math.max(0, Math.floor((sh - ch)/2));
        });
      });
    }catch(e){}
  }
  function bindZoom(){
    var c = document.getElementById('lb-img'); if(!c) return;
    c.style.cursor = 'zoom-in';
    if (c.dataset.zoomBound === '6') return;
    c.dataset.zoomBound = '6';
    c.addEventListener('click', function(ev){
      if (!ev.target.closest('#lb-img')) return;
      var src = getMainSrc(c, ev.target);
      if(!src) return;
      var m = ensureModal();
      var img = m.querySelector('.zm-img');
      img.src = src;
      m.classList.add('active');
      document.body.classList.add('no-scroll');
      if (img.complete) applyZoomAndCenter(1.872);
      else img.addEventListener('load', function once(){ img.removeEventListener('load', once); applyZoomAndCenter(1.872); });
    });
  }
  // re-centrar en cambios de tamaño/orientación
  function reCenter(){ applyZoomAndCenter(1.872); }
  if (!document.body.dataset.zoomRecenterBound){
    window.addEventListener('resize', reCenter);
    window.addEventListener('orientationchange', reCenter);
    document.body.dataset.zoomRecenterBound = '1';
  }
  // Hook: tras abrir tarjeta
  var _og = window.openGallery;
  window.openGallery = function(fp){
    if (typeof _og === 'function') _og.apply(this, arguments);
    try{ bindZoom(); }catch(e){}
  };
  document.addEventListener('DOMContentLoaded', function(){ try{ bindZoom(); }catch(e){} });
})(); 



// vFichas-Restore: photo-style cards + green title, only 02Genext/01
(function(){
  window.DEALER_RESTORE = {"cards": [{"titulo": "CRITICAL +2", "detalles": [{"etiqueta": "Genética", "valor": "CRITICAL +2"}, {"etiqueta": "THC", "valor": "20%"}, {"etiqueta": "Satividad", "valor": "40%"}, {"etiqueta": "Rendimiento", "valor": "INT: 300-450 GR / EXT: 100-300 GR"}, {"etiqueta": "Ciclo", "valor": "55 Dias"}, {"etiqueta": "Efecto", "valor": "Relajante, Potente Larga Duracion"}, {"etiqueta": "Sabor", "valor": "Dulce, Limon, Citricos"}, {"etiqueta": "Cantidad", "valor": "X3 Semillas"}]}, {"titulo": "BLACK DOM", "detalles": [{"etiqueta": "Genética", "valor": "BLACK DOM"}, {"etiqueta": "THC", "valor": "18%"}, {"etiqueta": "Satividad", "valor": "20%"}, {"etiqueta": "Rendimiento", "valor": "INT: 200-400 GR / EXT: 50-450 GR"}, {"etiqueta": "Ciclo", "valor": "50-55 Dias"}, {"etiqueta": "Efecto", "valor": "Relajante, Fuerte"}, {"etiqueta": "Sabor", "valor": "Hachis, Afgano, Dulce, Pino"}, {"etiqueta": "Cantidad", "valor": "X3 Semillas"}]}, {"titulo": "MOBY-D", "detalles": [{"etiqueta": "Genética", "valor": "MOBY-D"}, {"etiqueta": "THC", "valor": "18%"}, {"etiqueta": "Satividad", "valor": "80%"}, {"etiqueta": "Rendimiento", "valor": "INT: 300-500 / EXT: 60-250"}, {"etiqueta": "Ciclo", "valor": "75 Dias"}, {"etiqueta": "Efecto", "valor": "Euforia, Psicodelica, Energizante"}, {"etiqueta": "Sabor", "valor": "Citrico, Pino, Haze, Madera"}, {"etiqueta": "Cantidad", "valor": "X3 Semillas"}]}, {"titulo": "NORTHERN", "detalles": [{"etiqueta": "Genética", "valor": "NORTHERN"}, {"etiqueta": "THC", "valor": "18%"}, {"etiqueta": "Satividad", "valor": "20%"}, {"etiqueta": "Rendimiento", "valor": "INT: 250-450 GR / EXT: 60-350 GR"}, {"etiqueta": "Ciclo", "valor": "50-55 Dias"}, {"etiqueta": "Efecto", "valor": "Narcotico, Sedante"}, {"etiqueta": "Sabor", "valor": "Dulce, Tierra"}, {"etiqueta": "Cantidad", "valor": "X3 Semillas"}]}]};
  function renderRestore(lb, folder, id){
    if(folder!=='02Genext' || id!=='01') return;
    var right = lb.querySelector('.panel-fichas') || lb.querySelector('.lb-fichas') || lb;
    if(!right) return;
    right.innerHTML = '';
    var wrap = document.createElement('div');
    wrap.className = 'ft-wrap';
    (window.DEALER_RESTORE.cards||[]).forEach(function(card){
      var panel = document.createElement('div');
      panel.className = 'ft-card dealer-only';
      var h = document.createElement('h4');
      h.className = 'ft-title';
      h.textContent = card.titulo || 'Ficha';
      panel.appendChild(h);
      var grid = document.createElement('div');
      grid.className = 'ft-grid';
      (card.detalles||[]).forEach(function(it){
        if(!it.valor) return;
        var item = document.createElement('div'); item.className='ft-item';
        var lbl = document.createElement('div'); lbl.className='ft-label'; lbl.textContent = (it.etiqueta||'').toUpperCase();
        var val = document.createElement('div'); val.className='ft-val'; val.textContent = it.valor;
        item.append(lbl, val);
        grid.appendChild(item);
      });
      panel.appendChild(grid);
      wrap.appendChild(panel);
    });
    right.appendChild(wrap);
  }
  var _og = window.openGallery;
  window.openGallery = function(folderPath){
    if (typeof _og === 'function') _og.apply(this, arguments);
    try { 
      var lb = document.getElementById('lightbox');
      var parts = (folderPath||'').split('/'); var folder = parts[1], id = parts[2];
      renderRestore(lb, folder, id);
    } catch(e){}
  };
})();

