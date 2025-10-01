
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


// vDealer-Details: render etiqueta/valor in 2-column grid ONLY for 02Genext/01
(function(){
  var DATA_DEALER = [{"titulo": "Critical +2", "detalles": [{"etiqueta": "Banco", "valor": "BSF Seeds"}, {"etiqueta": "Satividad", "valor": "40%"}, {"etiqueta": "Thc", "valor": "20%"}, {"etiqueta": "Producción INT", "valor": "300-450 GR"}, {"etiqueta": "Producción EXT", "valor": "100-300 GR"}, {"etiqueta": "Ciclo Completo", "valor": "55 Dias"}, {"etiqueta": "Efecto", "valor": "Relajante, Potente Larga Duracion"}, {"etiqueta": "Sabor", "valor": "Dulce, Limon, Citricos"}, {"etiqueta": "Cantidad", "valor": "X3 Semillas"}]}, {"titulo": "Black Dom", "detalles": [{"etiqueta": "Banco", "valor": "BSF Seeds"}, {"etiqueta": "Satividad", "valor": "20%"}, {"etiqueta": "Thc", "valor": "18%"}, {"etiqueta": "Producción INT", "valor": "200-400 GR"}, {"etiqueta": "Producción EXT", "valor": "50-450 GR"}, {"etiqueta": "Ciclo Completo", "valor": "50-55 Dias"}, {"etiqueta": "Efecto", "valor": "Relajante, Fuerte"}, {"etiqueta": "Sabor", "valor": "Hachis, Afgano, Dulce, Pino"}, {"etiqueta": "Cantidad", "valor": "X3 Semillas"}]}, {"titulo": "Moby-D", "detalles": [{"etiqueta": "Banco", "valor": "BSF Seeds"}, {"etiqueta": "Satividad", "valor": "80%"}, {"etiqueta": "Thc", "valor": "18%"}, {"etiqueta": "Producción INT", "valor": "300-500"}, {"etiqueta": "Producción EXT", "valor": "60-250"}, {"etiqueta": "Ciclo Completo", "valor": "75 DÍAS"}, {"etiqueta": "Efecto", "valor": "Euforia, Psicodelica, Energizante"}, {"etiqueta": "Sabor", "valor": "Citrico, Pino, Haze, Madera"}, {"etiqueta": "Cantidad", "valor": "X3 Semillas"}]}, {"titulo": "Northern", "detalles": [{"etiqueta": "Banco", "valor": "BSF Seeds"}, {"etiqueta": "Satividad", "valor": "20%"}, {"etiqueta": "Thc", "valor": "18%"}, {"etiqueta": "Producción INT", "valor": "250-450 GR"}, {"etiqueta": "Producción EXT", "valor": "60-350 GR"}, {"etiqueta": "Ciclo Completo", "valor": "50-55 Dias"}, {"etiqueta": "Efecto", "valor": "Narcotico, Sedante"}, {"etiqueta": "Sabor", "valor": "Dulce, Tierra"}, {"etiqueta": "Cantidad", "valor": "X3 Semillas"}]}];
  function buildGrid(items){
    var grid = document.createElement('div');
    grid.className = 'dealer-details-grid';
    items.forEach(function(it){
      var d = document.createElement('div');
      d.className = 'dd-item';
      d.innerHTML = '<b class="dd-label"></b><span class="dd-value"></span>';
      d.querySelector('.dd-label').textContent = it.etiqueta;
      d.querySelector('.dd-value').textContent = it.valor;
      grid.appendChild(d);
    });
    return grid;
  }
  function renderDealer(lb, folder, id){
    if(folder!=='02Genext' || id!=='01') return;
    var right = lb.querySelector('.panel-fichas') || lb.querySelector('.lb-fichas') || lb;
    if(!right) return;
    right.innerHTML = '';
    var cont = document.createElement('div');
    cont.className = 'lb-fichas-multi';
    DATA_DEALER.forEach(function(card){
      var panel = document.createElement('div');
      panel.className = 'lb-ficha-panel dealer-only';
      var h = document.createElement('h4');
      h.className = 'lb-ficha-title';
      h.textContent = card.titulo || 'Ficha';
      panel.appendChild(h);
      panel.appendChild(buildGrid(card.detalles||[]));
      cont.appendChild(panel);
    });
    right.appendChild(cont);
  }
  // Patch openGallery to post-render
  var _og = window.openGallery;
  window.openGallery = function(folderPath){
    if (typeof _og === 'function') _og.apply(this, arguments);
    try {
      var lb = document.getElementById('lightbox');
      var parts = (folderPath||'').split('/');
      var folder = parts[1], id = parts[2];
      renderDealer(lb, folder, id);
    } catch(e) {}
  };
})();



// vDealer-Details v6: pares en 2 columnas como en 1.txt, SOLO 02Genext/01
(function(){
  window.DEALER_V6 = {"cards": [{"titulo": "Critical +2", "detalles": [{"etiqueta": "GENÉTICA", "valor": "CRITICAL +2"}, {"etiqueta": "SATIVIDAD", "valor": "40%"}, {"etiqueta": "THC", "valor": "20%"}, {"etiqueta": "PRODUCCIÓN INT", "valor": "300-450 GR"}, {"etiqueta": "PRODUCCIÓN EXT", "valor": "100-300 GR"}, {"etiqueta": "CICLO COMPLETO", "valor": "55 Dias"}, {"etiqueta": "EFECTO", "valor": "Relajante, Potente Larga Duracion"}, {"etiqueta": "SABOR", "valor": "Dulce, Limon, Citricos"}, {"etiqueta": "CANTIDAD", "valor": "X3 Semillas"}]}, {"titulo": "Black Dom", "detalles": [{"etiqueta": "GENÉTICA", "valor": "BLACK DOM"}, {"etiqueta": "SATIVIDAD", "valor": "20%"}, {"etiqueta": "THC", "valor": "18%"}, {"etiqueta": "PRODUCCIÓN INT", "valor": "200-400 GR"}, {"etiqueta": "PRODUCCIÓN EXT", "valor": "50-450 GR"}, {"etiqueta": "CICLO COMPLETO", "valor": "50-55 Dias"}, {"etiqueta": "EFECTO", "valor": "Relajante, Fuerte"}, {"etiqueta": "SABOR", "valor": "Hachis, Afgano, Dulce, Pino"}, {"etiqueta": "CANTIDAD", "valor": "X3 Semillas"}]}, {"titulo": "Moby-D", "detalles": [{"etiqueta": "GENÉTICA", "valor": "MOBY-D"}, {"etiqueta": "SATIVIDAD", "valor": "80%"}, {"etiqueta": "THC", "valor": "18%"}, {"etiqueta": "PRODUCCIÓN INT", "valor": "300-500"}, {"etiqueta": "PRODUCCIÓN EXT", "valor": "60-250"}, {"etiqueta": "CICLO COMPLETO", "valor": "75 DÍAS"}, {"etiqueta": "EFECTO", "valor": "Euforia, Psicodelica, Energizante"}, {"etiqueta": "SABOR", "valor": "Citrico, Pino, Haze, Madera"}, {"etiqueta": "CANTIDAD", "valor": "X3 Semillas"}]}, {"titulo": "Northern", "detalles": [{"etiqueta": "GENÉTICA", "valor": "NORTHERN"}, {"etiqueta": "SATIVIDAD", "valor": "20%"}, {"etiqueta": "THC", "valor": "18%"}, {"etiqueta": "PRODUCCIÓN INT", "valor": "250-450 GR"}, {"etiqueta": "PRODUCCIÓN EXT", "valor": "60-350 GR"}, {"etiqueta": "CICLO COMPLETO", "valor": "50-55 Dias"}, {"etiqueta": "EFECTO", "valor": "Narcotico, Sedante"}, {"etiqueta": "SABOR", "valor": "Dulce, Tierra"}, {"etiqueta": "CANTIDAD", "valor": "X3 Semillas"}]}], "pairs": [["BANCO", "GENETICA"], ["SATIVIDAD", "THC"], ["PRODUCCION INT", "PRODUCCION EXT"], ["CICLO COMPLETO", "SABOR"], ["EFECTO", "CANTIDAD"]]};
  function NORM(s){ 
    try{ return s.normalize('NFD').replace(/\p{M}/gu,'').replace(/\./g,'').trim().toUpperCase(); }
    catch(e){ return (s||'').toString().toUpperCase(); }
  }
  function renderV6(lb, folder, id){
    if(folder!=='02Genext' || id!=='01') return;
    var cfg = window.DEALER_V6, cards = cfg.cards||[], pairs = cfg.pairs||[];
    var right = lb.querySelector('.panel-fichas') || lb.querySelector('.lb-fichas') || lb;
    if(!right) return;
    right.innerHTML = '';
    var cont = document.createElement('div');
    cont.className = 'lb-fichas-multi';
    cards.forEach(function(card){
      var panel = document.createElement('div');
      panel.className = 'lb-ficha-panel dealer-only';
      var h = document.createElement('h4');
      h.className = 'lb-ficha-title';
      h.textContent = card.titulo || 'Ficha';
      panel.appendChild(h);
      var grid = document.createElement('div');
      grid.className = 'dealer-details-grid2';
      // index items by normalized label
      var map = Object.create(null);
      (card.detalles||[]).forEach(function(it){ map[NORM(it.etiqueta||'')] = it.valor||''; });
      // build rows of two pairs per row
      pairs.forEach(function(p){
        var leftK = NORM(p[0]), rightK = NORM(p[1]);
        var leftV = map[leftK]; var rightV = map[rightK];
        if(!leftV && !rightV) return; // skip empty row
        var pairL = document.createElement('div');
        pairL.className = 'dd-pair';
        var l1 = document.createElement('span'); l1.className='dd-label'; l1.textContent = p[0].replace(/INT/g,'INT').replace(/EXT/g,'EXT');
        var lsep = document.createElement('span'); lsep.className='dd-sep'; lsep.textContent = ':';
        var l2 = document.createElement('span'); l2.className='dd-value'; l2.textContent = leftV || '—';
        pairL.append(l1, lsep, l2);
        grid.appendChild(pairL);
        var pairR = document.createElement('div');
        pairR.className = 'dd-pair';
        var r1 = document.createElement('span'); r1.className='dd-label'; r1.textContent = p[1].replace(/INT/g,'INT').replace(/EXT/g,'EXT');
        var rsep = document.createElement('span'); rsep.className='dd-sep'; rsep.textContent = ':';
        var r2 = document.createElement('span'); r2.className='dd-value'; r2.textContent = rightV || '—';
        pairR.append(r1, rsep, r2);
        grid.appendChild(pairR);
      });
      panel.appendChild(grid);
      cont.appendChild(panel);
    });
    right.appendChild(cont);
  }
  // Hook openGallery
  var _og = window.openGallery;
  window.openGallery = function(folderPath){
    if (typeof _og === 'function') _og.apply(this, arguments);
    try {
      var lb = document.getElementById('lightbox');
      var parts = (folderPath||'').split('/');
      var folder = parts[1], id = parts[2];
      renderV6(lb, folder, id);
    } catch(e) { /* silent */ }
  };
})();




// v7: override BANCO value for all cards in 02Genext/01
(function(){
  var _og = window.openGallery;
  window.openGallery = function(folderPath){
    if (typeof _og === 'function') _og.apply(this, arguments);
    try{
      var lb = document.getElementById('lightbox');
      var parts = (folderPath||'').split('/'); var folder = parts[1], id = parts[2];
      if(folder==='02Genext' && id==='01'){
        // Buscar pares ya pintados y forzar BANCO a "BSF Seeds"
        lb.querySelectorAll('.dealer-only .dealer-details-grid2').forEach(function(grid){
          var pairs = grid.querySelectorAll('.dd-pair');
          pairs.forEach(function(p){
            var lab = p.querySelector('.dd-label'); var val = p.querySelector('.dd-value');
            if(lab && /BANCO/i.test(lab.textContent)) { if(val) val.textContent = 'BSF Seeds'; }
          });
        });
      }
    }catch(e){/*silent*/}
  };
})();



// v12: Photo-style cards ONLY for 02Genext/01 (labels above values, 2 columns). Combine Rendimiento.
(function(){
  function NORM(s){ try{ return (s||'').toString().normalize('NFD').replace(/\p{M}/gu,'').toUpperCase().replace(/\./g,'').trim(); }catch(e){ return (s||'').toString().toUpperCase().trim(); } }
  function buildCard(card){
    var panel = document.createElement('div');
    panel.className = 'ft-card dealer-only';
    var h = document.createElement('h4');
    h.className = 'ft-title'; h.textContent = card.titulo || 'Ficha';
    panel.appendChild(h);
    var grid = document.createElement('div');
    grid.className = 'ft-grid';
    var items = card.detalles || [];
    // map labels
    var map = Object.create(null);
    items.forEach(function(it){ map[NORM(it.etiqueta)] = (it.valor||'').trim(); });
    var prodInt = map[NORM('PRODUCCIÓN INT')] || map[NORM('PRODUCCION INT')] || '';
    var prodExt = map[NORM('PRODUCCIÓN EXT')] || map[NORM('PRODUCCION EXT')] || '';
    var rendimiento = '';
    if (prodInt || prodExt){
      rendimiento = (prodInt?('INT: ' + prodInt):'') + (prodExt?((prodInt?' / ':'') + 'EXT: ' + prodExt):'');
    }
    var order = [
      ['BANCO', map[NORM('BANCO')]||''],
      ['GENÉTICA', map[NORM('GENÉTICA')]||map[NORM('GENETICA')]||''],
      ['FLORACIÓN', map[NORM('FLORACIÓN')]||map[NORM('FLORACION')]||''],
      ['THC', map[NORM('THC')]||''],
      ['SATIVIDAD', map[NORM('SATIVIDAD')]||''],
      ['RENDIMIENTO', rendimiento],
      ['EFECTO', map[NORM('EFECTO')]||''],
      ['SABOR', map[NORM('SABOR')]||''],
      ['CANTIDAD', map[NORM('CANTIDAD')]||'']
    ];
    order.forEach(function(pair){
      if(!pair[1]) return;
      var item = document.createElement('div'); item.className='ft-item';
      var lbl = document.createElement('div'); lbl.className='ft-label'; lbl.textContent = pair[0].replace('GENÉTICA','Genética');
      var val = document.createElement('div'); val.className='ft-val'; val.textContent = pair[1];
      item.append(lbl, val);
      grid.appendChild(item);
    });
    panel.appendChild(grid);
    return panel;
  }
  function toCardsFromDOM(lb){
    var cards = [];
    lb.querySelectorAll('.dealer-only').forEach(function(panel){
      var title = panel.querySelector('.lb-ficha-title')?.textContent || 'Ficha';
      var items = [];
      panel.querySelectorAll('.dd-pair, .dd-item').forEach(function(p){
        var l = p.querySelector('.dd-label')?.textContent?.replace(/:$/,'') || '';
        var v = p.querySelector('.dd-value')?.textContent || '';
        if(l && v) items.push({etiqueta:l, valor:v});
      });
      if (items.length) cards.push({titulo:title, detalles:items});
    });
    return cards;
  }
  var _og = window.openGallery;
  window.openGallery = function(folderPath){
    if (typeof _og === 'function') _og.apply(this, arguments);
    try{
      var lb = document.getElementById('lightbox');
      var parts = (folderPath||'').split('/'); var folder = parts[1], id = parts[2];
      if(folder==='02Genext' && id==='01'){
        var right = lb.querySelector('.panel-fichas') || lb.querySelector('.lb-fichas') || lb;
        if(!right) return;
        // Source data: prefer previous payload if exists, else collect from current DOM
        var src = (window.DEALER_V6 && window.DEALER_V6.cards) || toCardsFromDOM(lb);
        right.innerHTML = '';
        var cont = document.createElement('div'); cont.className = 'ft-wrap';
        (src||[]).forEach(function(c){ cont.appendChild(buildCard(c)); });
        right.appendChild(cont);
      }
    }catch(e){/* silent */}
  };
})(); 



// vZoom-1: preview grande al hacer clic en la imagen principal (#lb-img)
(function(){
  function ensureModal(){
    var m = document.getElementById('zoom-modal');
    if (m) return m;
    m = document.createElement('div');
    m.id = 'zoom-modal';
    m.innerHTML = [
      '<div class="zm-backdrop"></div>',
      '<div class="zm-content">',
        '<button class="zm-close" type="button" aria-label="Cerrar">&times;</button>',
        '<img class="zm-img" alt="Vista ampliada">',
      '</div>'
    ].join('');
    document.body.appendChild(m);
    // Handlers
    var img = m.querySelector('.zm-img');
    var close = function(){ m.classList.remove('active'); document.body.classList.remove('no-scroll'); img.removeAttribute('src'); };
    m.querySelector('.zm-backdrop').onclick = close;
    m.querySelector('.zm-close').onclick = close;
    document.addEventListener('keydown', function(ev){ if(ev.key === 'Escape') close(); });
    return m;
  }
  function getMainSrc(){
    var c = document.getElementById('lb-img');
    if (!c) return '';
    var tag = c.querySelector('img');
    if (tag && tag.src) return tag.src;
    var bg = getComputedStyle(c).backgroundImage;
    if (bg && bg.startsWith('url(')){
      var u = bg.slice(4,-1).replace(/["']/g,'');
      return u;
    }
    return '';
  }
  function bindZoom(){
    var c = document.getElementById('lb-img');
    if (!c) return;
    c.style.cursor = 'zoom-in';
    // Avoid duplicate listeners
    if (c.dataset.zoomBound === '1') return;
    c.dataset.zoomBound = '1';
    c.addEventListener('click', function(ev){
      // Sólo la imagen principal, no miniaturas
      if (ev.target.closest('#lb-img')){
        var src = getMainSrc();
        if(!src) return;
        var m = ensureModal();
        m.querySelector('.zm-img').src = src;
        m.classList.add('active');
        document.body.classList.add('no-scroll');
      }
    });
  }
  // Hook: tras abrir cualquier tarjeta
  var _og = window.openGallery;
  window.openGallery = function(folderPath){
    if (typeof _og === 'function') _og.apply(this, arguments);
    try{ bindZoom(); }catch(e){}
  };
  // Por si ya está abierto al cargar
  document.addEventListener('DOMContentLoaded', function(){ try{ bindZoom(); }catch(e){} });
})();



// vZoom-2: robust src discovery + rebinding
(function(){
  function isImgURL(u){
    return /\.(?:jpe?g|png|webp|gif|bmp|avif)(?:\?|#|$)/i.test(u||"");
  }
  function pickFromImg(img){
    if(!img) return "";
    var ds = img.dataset||{};
    return ds.large || ds.full || ds.src || img.currentSrc || img.src || "";
  }
  function pickFromAnchor(a){
    if(!a) return "";
    var ds = a.dataset||{};
    var href = ds.large || ds.full || a.getAttribute("href") || "";
    return href;
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
    // 1) if click on IMG
    if(clickTarget && clickTarget.tagName === "IMG"){
      var u = pickFromImg(clickTarget);
      if(isImgURL(u)) return u;
    }
    // 2) IMG descendants with data-large/full then currentSrc
    var imgs = container.querySelectorAll("img");
    for (var i=0;i<imgs.length;i++){
      var u2 = pickFromImg(imgs[i]);
      if(isImgURL(u2)) return u2;
    }
    // 3) Anchors with image href
    var as = container.querySelectorAll("a[href]");
    for (var j=0;j<as.length;j++){
      var u3 = pickFromAnchor(as[j]);
      if(isImgURL(u3)) return u3;
    }
    // 4) background-image on container or descendants
    var u4 = pickBg(container);
    if(isImgURL(u4)) return u4;
    var nodes = container.querySelectorAll("*");
    for (var k=0;k<nodes.length;k++){
      var u5 = pickBg(nodes[k]);
      if(isImgURL(u5)) return u5;
    }
    // 5) fallback: any main-like selector in lightbox
    var lb = document.getElementById('lightbox');
    if(lb){
      var cand = lb.querySelector('img[src*="/02/"], img[src*="main"], img[srcset]') || lb.querySelector('img');
      var u6 = pickFromImg(cand);
      if(isImgURL(u6)) return u6;
    }
    return "";
  }
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
  function bindZoomV2(){
    var c = document.getElementById('lb-img');
    if (!c) return;
    c.style.cursor = 'zoom-in';
    if (c.dataset.zoomBound === '2') return;
    c.dataset.zoomBound = '2';
    c.addEventListener('click', function(ev){
      if (!ev.target.closest('#lb-img')) return;
      var src = getMainSrc(c, ev.target);
      if(!src) return;
      var m = ensureModal();
      m.querySelector('.zm-img').src = src;
      m.classList.add('active');
      document.body.classList.add('no-scroll');
    });
  }
  var _og = window.openGallery;
  window.openGallery = function(folderPath){
    if (typeof _og === 'function') _og.apply(this, arguments);
    try{ bindZoomV2(); }catch(e){}
  };
  document.addEventListener('DOMContentLoaded', function(){ try{ bindZoomV2(); }catch(e){} });
})(); 



// v12c: Inject new label 'CICLO' with per-card values only for 02Genext/01
(function(){
  var CICLO_MAP = {
    "CRITICAL+2": "55 Dias",
    "BLACK DOM": "50-55 Dias",
    "MOBY-D": "75 Dias",
    "NORTHERN": "50-55 Dias"
  };
  function normTitle(s){
    return (s||"").toString().trim().toUpperCase().replace(/\s+/g,"").replace(/\+/g,"+");
  }
  function prettyTitle(s){
    // keep existing title as rendered by v12; we only need matching
    return (s||"").toString();
  }
  function injectCiclo(){
    var lb = document.getElementById('lightbox');
    if(!lb) return;
    var wrap = lb.querySelector('.ft-wrap');
    if(!wrap) return;
    wrap.querySelectorAll('.ft-card.dealer-only').forEach(function(card){
      var titleEl = card.querySelector('.ft-title');
      var title = titleEl ? titleEl.textContent.trim() : "";
      var key = title.toUpperCase().replace(/\s+/g,"").replace(/\+/g,"+");
      var val = CICLO_MAP[key];
      if(!val) return;
      var grid = card.querySelector('.ft-grid');
      if(!grid) return;
      // If CICLO already exists, update and exit
      var exists = grid.querySelector('.ft-item .ft-label') && Array.prototype.some.call(grid.querySelectorAll('.ft-item .ft-label'), function(lbl){
        return /CICLO\s*$/i.test(lbl.textContent.trim());
      });
      if(exists){
        grid.querySelectorAll('.ft-item').forEach(function(it){
          var lbl = it.querySelector('.ft-label'); var v = it.querySelector('.ft-val');
          if(lbl && /CICLO\s*$/i.test(lbl.textContent.trim()) && v){ v.textContent = val; }
        });
        return;
      }
      // Create item
      var item = document.createElement('div'); item.className='ft-item';
      var lbl = document.createElement('div'); lbl.className='ft-label'; lbl.textContent='CICLO';
      var v = document.createElement('div'); v.className='ft-val'; v.textContent = val;
      item.append(lbl, v);
      // Insert after FLORACIÓN if present
      var afterNode = null;
      Array.prototype.forEach.call(grid.querySelectorAll('.ft-item'), function(it){
        var l = it.querySelector('.ft-label'); 
        if(l && /FLORACI[ÓO]N\s*$/i.test(l.textContent.trim())) afterNode = it;
      });
      if(afterNode && afterNode.nextSibling){
        grid.insertBefore(item, afterNode.nextSibling);
      }else if(afterNode){
        grid.appendChild(item);
      }else{
        grid.appendChild(item);
      }
    });
  }
  // Hook openGallery to inject after v12 renders
  var _og = window.openGallery;
  window.openGallery = function(folderPath){
    if (typeof _og === 'function') _og.apply(this, arguments);
    try{
      var parts = (folderPath||'').split('/'); var folder = parts[1], id = parts[2];
      if(folder==='02Genext' && id==='01'){ injectCiclo(); }
    }catch(e){}
  };
  // In case the lightbox is already open
  document.addEventListener('DOMContentLoaded', function(){ setTimeout(injectCiclo, 0); });
})(); 



// v12c-fix: garantizar 'CICLO' en la ficha 'Black Dom' (02Genext/01) sin tocar el resto
(function(){
  function ensureCicloBlackDom(){
    var lb = document.getElementById('lightbox'); if(!lb) return;
    var wrap = lb.querySelector('.ft-wrap'); if(!wrap) return;
    wrap.querySelectorAll('.ft-card.dealer-only').forEach(function(card){
      var titleEl = card.querySelector('.ft-title');
      var title = titleEl ? titleEl.textContent.trim().toUpperCase() : "";
      if(title.indexOf('BLACK DOM') === -1) return;
      var grid = card.querySelector('.ft-grid'); if(!grid) return;
      var updated = false;
      grid.querySelectorAll('.ft-item').forEach(function(it){
        var lbl = it.querySelector('.ft-label'); var val = it.querySelector('.ft-val');
        if(lbl && /CICLO\s*$/i.test(lbl.textContent.trim())){
          if(val) val.textContent = '50-55 Dias';
          updated = true;
        }
      });
      if(updated) return;
      // Insertar después de FLORACIÓN si existe
      var item = document.createElement('div'); item.className = 'ft-item';
      var l = document.createElement('div'); l.className = 'ft-label'; l.textContent = 'CICLO';
      var v = document.createElement('div'); v.className = 'ft-val'; v.textContent = '50-55 Dias';
      item.append(l, v);
      var after = null;
      grid.querySelectorAll('.ft-item').forEach(function(it){
        var a = it.querySelector('.ft-label');
        if(a && /FLORACI[ÓO]N\s*$/i.test(a.textContent.trim())) after = it;
      });
      if(after && after.nextSibling) grid.insertBefore(item, after.nextSibling);
      else if(after) grid.appendChild(item);
      else grid.appendChild(item);
    });
  }
  var _og = window.openGallery;
  window.openGallery = function(folderPath){
    if (typeof _og === 'function') _og.apply(this, arguments);
    try{
      var parts = (folderPath||'').split('/'); var folder = parts[1], id = parts[2];
      if(folder==='02Genext' && id==='01') ensureCicloBlackDom();
    }catch(e){}
  };
  document.addEventListener('DOMContentLoaded', function(){ try{ ensureCicloBlackDom(); }catch(e){} });
})();


// vZoom-3: zoom inicial +30% al abrir la previsualización
(function(){
  var INITIAL_ZOOM = 1.3;
  function applyInitialZoom(modal){
    try{
      var img = modal.querySelector('.zm-img');
      var cont = modal.querySelector('.zm-content');
      if(!img || !cont) return;
      // Reset sizing to get natural fit
      img.style.maxWidth = 'none';
      img.style.maxHeight = 'none';
      img.style.width = '';
      img.style.height = '';
      // Compute scale-to-fit within 95% viewport
      var vw = Math.floor(window.innerWidth * 0.95);
      var vh = Math.floor(window.innerHeight * 0.95);
      var nw = img.naturalWidth || img.width;
      var nh = img.naturalHeight || img.height;
      if(!nw || !nh) return;
      var fit = Math.min(vw / nw, vh / nh);
      var scale = fit * INITIAL_ZOOM;
      var targetW = Math.max(1, Math.round(nw * scale));
      // Apply size; height auto mantiene proporción
      img.style.width = targetW + 'px';
      img.style.height = 'auto';
      // Contenedor scrolleable si excede viewport
      cont.style.maxWidth = '95vw';
      cont.style.maxHeight = '95vh';
      cont.style.overflow = 'auto';
    }catch(e){ /* silent */ }
  }
  // Hook en la apertura del modal existente vZoom-2
  var _og = window.openGallery;
  window.openGallery = function(folderPath){
    if (typeof _og === 'function') _og.apply(this, arguments);
    try{
      var lb = document.getElementById('lb-img');
      if(!lb) return;
      // inyectamos listener sobre click si no existe
      if (!document.body.dataset.zoomV3Bound){
        document.addEventListener('click', function(ev){
          var m = document.getElementById('zoom-modal');
          if(!m || !m.classList.contains('active')) return;
          // cuando la imagen cargue, aplicar zoom inicial
          var img = m.querySelector('.zm-img');
          if(!img) return;
          img.addEventListener('load', function once(){
            img.removeEventListener('load', once);
            applyInitialZoom(m);
          });
        }, true);
        document.body.dataset.zoomV3Bound = '1';
      }
    }catch(e){ /* silent */ }
  };
})(); 



// vZoom-4: zoom inicial 1.56x y centrado en el modal
(function(){
  var INITIAL_ZOOM_V4 = 1.56; // +20% sobre 1.3
  if (!document.body.dataset.zoomV4Bound){
    document.addEventListener('click', function(){
      var m = document.getElementById('zoom-modal');
      if(!m || !m.classList.contains('active')) return;
      var img = m.querySelector('.zm-img');
      var cont = m.querySelector('.zm-content');
      if(!img || !cont) return;
      function apply(){
        try{
          // reset and compute fit
          img.style.maxWidth = 'none';
          img.style.maxHeight = 'none';
          img.style.width = ''; img.style.height = '';
          var vw = Math.floor(window.innerWidth * 0.95);
          var vh = Math.floor(window.innerHeight * 0.95);
          var nw = img.naturalWidth || img.width;
          var nh = img.naturalHeight || img.height;
          if(!nw || !nh) return;
          var fit = Math.min(vw / nw, vh / nh);
          var scale = fit * INITIAL_ZOOM_V4;
          var targetW = Math.max(1, Math.round(nw * scale));
          img.style.width = targetW + 'px';
          img.style.height = 'auto';
          cont.style.maxWidth = '95vw';
          cont.style.maxHeight = '95vh';
          cont.style.overflow = 'auto';
          // Center after layout
          requestAnimationFrame(function(){
            var cw = cont.clientWidth, ch = cont.clientHeight;
            var iw = img.clientWidth, ih = img.clientHeight;
            if (iw > cw) cont.scrollLeft = Math.max(0, Math.floor((iw - cw)/2));
            if (ih > ch) cont.scrollTop  = Math.max(0, Math.floor((ih - ch)/2));
          });
        }catch(e){}
      }
      if (img.complete) apply();
      else {
        img.addEventListener('load', function once(){
          img.removeEventListener('load', once);
          apply();
        });
      }
    }, true);
    document.body.dataset.zoomV4Bound = '1';
  }
})(); 



// vPsycho-1: Fichas para Psycho XXL (Carrusel 2 · Tarjeta 2) SIN tocar otras tarjetas
(function(){
  window.PSYCHO_DATA = {"cards": [{"titulo": "Amnesia", "detalles": []}, {"titulo": "Genética", "detalles": []}, {"titulo": "AK", "detalles": []}, {"titulo": "Genética", "detalles": []}, {"titulo": "Haze Lemon", "detalles": []}, {"titulo": "Genética", "detalles": []}, {"titulo": "London Cheese", "detalles": []}, {"titulo": "Genética", "detalles": []}]};
  function NORM(s){ try{return s.normalize('NFD').replace(/\p{M}/gu,'').trim().toUpperCase();}catch(e){return (s||'').toString().toUpperCase().trim();} }
  function isPsychoContext(folder,id,lb){
    if(folder==='02Genext' && id==='02') return true; // probable id de tarjeta 2
    // fallback por título visible en lightbox si existe
    var t = (lb && (lb.querySelector('.product-title, .lb-title, h3, h2')||{}).textContent)||"";
    return /PSYCHO\s*XXL/i.test(t||"");
  }
  function buildCard(card){
    var panel = document.createElement('div'); panel.className='ft-card psycho-only';
    var h = document.createElement('h4'); h.className='ft-title'; h.textContent = card.titulo||'Ficha';
    panel.appendChild(h);
    var grid = document.createElement('div'); grid.className='ft-grid';
    (card.detalles||[]).forEach(function(pair){
      var item = document.createElement('div'); item.className='ft-item';
      var lbl = document.createElement('div'); lbl.className='ft-label'; lbl.textContent = pair.etiqueta;
      var val = document.createElement('div'); val.className='ft-val';   val.textContent = pair.valor;
      item.append(lbl,val); grid.appendChild(item);
    });
    panel.appendChild(grid);
    return panel;
  }
  function renderPsycho(lb){
    var right = lb.querySelector('.panel-fichas') || lb.querySelector('.lb-fichas') || lb;
    if(!right) return;
    right.innerHTML = '';
    var wrap = document.createElement('div'); wrap.className='ft-wrap';
    (window.PSYCHO_DATA.cards||[]).forEach(function(c){ wrap.appendChild(buildCard(c)); });
    right.appendChild(wrap);
  }
  var _og = window.openGallery;
  window.openGallery = function(folderPath){
    if (typeof _og === 'function') _og.apply(this, arguments);
    try{
      var lb = document.getElementById('lightbox');
      var parts = (folderPath||'').split('/'); var folder = parts[1], id = parts[2];
      if(isPsychoContext(folder,id,lb)) renderPsycho(lb);
    }catch(e){}
  };
})();



// vPsycho-2: Ensure detalles and build RENDIMIENTO from PRODUCCIÓN INT/EXT if needed
(function(){
  function NORM(s){ try{return (s||'').toString().normalize('NFD').replace(/\p{M}/gu,'').toUpperCase().replace(/\./g,'').trim();}catch(e){return (s||'').toString().toUpperCase().trim();} }
  function enhancePsychoData(card){
    var det = Array.isArray(card.detalles)? card.detalles.slice(): [];
    // index existing labels
    var map = Object.create(null);
    det.forEach(function(it){ map[NORM(it.etiqueta||'')] = it.valor||''; });
    // If no RENDIMIENTO, but have PRODUCCION INT/EXT, compose it
    var hasR = !!map[NORM('RENDIMIENTO')];
    var pint = map[NORM('PRODUCCIÓN INT')] || map[NORM('PRODUCCION INT')] || '';
    var pext = map[NORM('PRODUCCIÓN EXT')] || map[NORM('PRODUCCION EXT')] || '';
    if(!hasR && (pint || pext)){
      var val = (pint?('INT: ' + pint):'') + (pext?((pint?' / ':'')+'EXT: ' + pext):'');
      // remove old INT/EXT entries if present
      det = det.filter(function(it){
        var k = NORM(it.etiqueta||'');
        return k !== NORM('PRODUCCIÓN INT') && k !== NORM('PRODUCCION INT') &&
               k !== NORM('PRODUCCIÓN EXT') && k !== NORM('PRODUCCION EXT');
      });
      // insert RENDIMIENTO after FLORACIÓN if exists, else before THC
      var idx = det.findIndex(function(it){ return /FLORACI[ÓO]N\s*$/i.test(it.etiqueta||''); });
      var item = { etiqueta:'RENDIMIENTO', valor: val };
      if(idx >= 0) det.splice(idx+1, 0, item);
      else{
        var idx2 = det.findIndex(function(it){ return NORM(it.etiqueta||'') === NORM('THC'); });
        if(idx2 >= 0) det.splice(idx2, 0, item);
        else det.push(item);
      }
    }
    // compact empty entries
    det = det.filter(function(it){ return (it && (it.valor||'').toString().trim() !== ''); });
    card.detalles = det;
    return card;
  }
  // Patch render for Psycho to enhance data right before painting
  (function waitPsycho(){
    if(!window.PSYCHO_DATA || !Array.isArray(window.PSYCHO_DATA.cards)){ return setTimeout(waitPsycho, 300); }
    try{
      window.PSYCHO_DATA.cards = window.PSYCHO_DATA.cards.map(enhancePsychoData);
    }catch(e){}
  })();
})(); 



// vPsycho-3: Replace Psycho XXL fichas with parsed data from TXT (labels line-by-line)
(function(){
  window.PSYCHO_DATA = {"cards": [{"titulo": "Amnesia", "detalles": [{"etiqueta": "GenéTica", "valor": "Amnesia Auto"}, {"etiqueta": "Thc", "valor": "19%"}, {"etiqueta": "Satividad", "valor": "80%"}, {"etiqueta": "Rendimiento", "valor": "INT: 400-500 GR / EXT: 60-250 GR"}, {"etiqueta": "Efecto", "valor": "Potente, Fisico, Activo"}, {"etiqueta": "Sabor", "valor": "Pino, Incienso, Haze"}, {"etiqueta": "Cantidad", "valor": "X3 Semillas"}, {"etiqueta": "Ciclo", "valor": "75-90 Dias"}]}, {"titulo": "AK", "detalles": [{"etiqueta": "GenéTica", "valor": "AK 47"}, {"etiqueta": "Thc", "valor": "18%"}, {"etiqueta": "Satividad", "valor": "60%"}, {"etiqueta": "Rendimiento", "valor": "INT: 500-600 GR / EXT: 70-50 GR"}, {"etiqueta": "Efecto", "valor": "Subidon Cerebral, Intenso"}, {"etiqueta": "Sabor", "valor": "Dulce, Citrico, Pino"}, {"etiqueta": "Cantidad", "valor": "X3 Semillas"}, {"etiqueta": "Ciclo", "valor": "70 Dias"}]}, {"titulo": "Haze Lemon", "detalles": [{"etiqueta": "GenéTica", "valor": "Jack Herer Auto"}, {"etiqueta": "Thc", "valor": "18%"}, {"etiqueta": "Satividad", "valor": "80%"}, {"etiqueta": "Rendimiento", "valor": "INT: 350-550 GR / EXT: 60-330 GR"}, {"etiqueta": "Efecto", "valor": "Subidon Cerebral, Activo"}, {"etiqueta": "Sabor", "valor": "Limon, Haze, Pino"}, {"etiqueta": "Cantidad", "valor": "X3 Semillas"}, {"etiqueta": "Ciclo", "valor": "75 Dias"}]}, {"titulo": "London Cheese", "detalles": [{"etiqueta": "GenéTica", "valor": "Chesee Auto"}, {"etiqueta": "Thc", "valor": "20%"}, {"etiqueta": "Satividad", "valor": "70%"}, {"etiqueta": "Rendimiento", "valor": "INT: 350-500 GR / EXT: 80-200 GR"}, {"etiqueta": "Efecto", "valor": "Narcotico, Euforizante"}, {"etiqueta": "Sabor", "valor": "Queso, Dulce, Skunk"}, {"etiqueta": "Cantidad", "valor": "X3 Semillas"}, {"etiqueta": "Ciclo", "valor": "70 Dias"}]}]};
})();



// vZoom-Fix r1: un solo clic abre ampliada y centrada. Solo #lb-img.
(function(){
  var ZF = { SCALE: 1.2 }; // respeta zoom "ampliada" sin exagerar
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
  function isImgURL(u){ return /\.(?:jpe?g|png|webp|gif|bmp|avif)(?:\?|#|$)/i.test(u||''); }
  function pickFromImg(img){
    if(!img) return '';
    var ds = img.dataset||{};
    return ds.large || ds.full || ds.src || img.currentSrc || img.src || '';
  }
  function pickBg(el){
    if(!el) return '';
    var bg = getComputedStyle(el).backgroundImage;
    if(bg && bg !== 'none'){
      return bg.replace(/^url\((['"]?)(.*)\1\)$/,'$2');
    }
    return '';
  }
  function getMainSrc(container, clickTarget){
    if(!container) return '';
    // 1) si clic en IMG
    if(clickTarget && clickTarget.tagName === 'IMG'){
      var u = pickFromImg(clickTarget); if(isImgURL(u)) return u;
    }
    // 2) buscar IMG hija
    var im = container.querySelector('img'); if(im){ var u2 = pickFromImg(im); if(isImgURL(u2)) return u2; }
    // 3) background-image
    var u3 = pickBg(container); if(isImgURL(u3)) return u3;
    var nds = container.querySelectorAll('*');
    for (var i=0;i<nds.length;i++){ var u4 = pickBg(nds[i]); if(isImgURL(u4)) return u4; }
    return '';
  }
  function applyZoomAndCenter(){
    var m = document.getElementById('zoom-modal');
    if(!m || !m.classList.contains('active')) return;
    var img = m.querySelector('.zm-img');
    var cont = m.querySelector('.zm-content');
    if(!img || !cont) return;
    // reset tamaño
    img.style.maxWidth = 'none'; img.style.maxHeight = 'none'; img.style.width=''; img.style.height='';
    var vw = Math.floor((window.visualViewport ? window.visualViewport.width : window.innerWidth) * 0.95);
    var vh = Math.floor((window.visualViewport ? window.visualViewport.height: window.innerHeight) * 0.95);
    var nw = img.naturalWidth || img.width, nh = img.naturalHeight || img.height;
    if(!nw || !nh) return;
    var fit = Math.min(vw / nw, vh / nh);
    var targetW = Math.max(1, Math.round(nw * fit * ZF.SCALE));
    img.style.width = targetW + 'px'; img.style.height = 'auto';
    // centrar por scroll tras layout estable
    cont.scrollLeft = 0; cont.scrollTop = 0;
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        var sw = img.scrollWidth || img.clientWidth;
        var sh = img.scrollHeight || img.clientHeight;
        var cw = cont.clientWidth, ch = cont.clientHeight;
        if (sw > cw) cont.scrollLeft = Math.max(0, Math.floor((sw - cw)/2));
        if (sh > ch) cont.scrollTop  = Math.max(0, Math.floor((sh - ch)/2));
      });
    });
  }
  function bindZoomFix(){
    var c = document.getElementById('lb-img'); if(!c) return;
    c.style.cursor = 'zoom-in';
    if (c.dataset.zoomFixBound === '1') return;
    c.dataset.zoomFixBound = '1';
    c.addEventListener('click', function(ev){
      if (!ev.target.closest('#lb-img')) return;
      var src = getMainSrc(c, ev.target); if(!src) return;
      var m = ensureModal();
      var img = m.querySelector('.zm-img');
      // Asignar src y abrir
      img.src = src;
      m.classList.add('active'); document.body.classList.add('no-scroll');
      // aplicar zoom/centrado al cargar o inmediatamente si ya está cacheado
      if (img.complete) applyZoomAndCenter();
      else img.addEventListener('load', function once(){ img.removeEventListener('load', once); applyZoomAndCenter(); });
    });
  }
  var _og = window.openGallery;
  window.openGallery = function(fp){
    if (typeof _og === 'function') _og.apply(this, arguments);
    try{ bindZoomFix(); }catch(e){}
  };
  document.addEventListener('DOMContentLoaded', function(){ try{ bindZoomFix(); }catch(e){} });
  window.addEventListener('resize', applyZoomAndCenter);
  window.addEventListener('orientationchange', applyZoomAndCenter);
})(); 



// v8 zoom center fix: centrar exacto en móvil sin alterar zoom
(function(){
  function centerZoomModal(){
    var m = document.getElementById('zoom-modal');
    if(!m || !m.classList.contains('active')) return;
    var img = m.querySelector('.zm-img');
    var cont = m.querySelector('.zm-content');
    if(!img || !cont) return;
    // reset scroll primero
    cont.scrollLeft = 0; cont.scrollTop = 0;
    var attempt = function(){
      try{
        var sw = img.scrollWidth || img.clientWidth;
        var sh = img.scrollHeight || img.clientHeight;
        var cw = cont.clientWidth, ch = cont.clientHeight;
        if (sw > cw) cont.scrollLeft = Math.max(0, Math.floor((sw - cw)/2));
        if (sh > ch) cont.scrollTop  = Math.max(0, Math.floor((sh - ch)/2));
      }catch(e){}
    };
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        requestAnimationFrame(function(){
          attempt();
          setTimeout(attempt, 40);
        });
      });
    });
  }
  function bindCentering(){
    if (document.body.dataset.zoomCenterV8 === '1') return;
    document.addEventListener('click', centerZoomModal, true);
    window.addEventListener('resize', centerZoomModal);
    window.addEventListener('orientationchange', centerZoomModal);
    if (window.visualViewport){
      window.visualViewport.addEventListener('resize', centerZoomModal);
    }
    document.body.dataset.zoomCenterV8 = '1';
  }
  // run
  var _og = window.openGallery;
  window.openGallery = function(fp){
    if (typeof _og === 'function') _og.apply(this, arguments);
    try{ bindCentering(); }catch(e){}
  };
  document.addEventListener('DOMContentLoaded', function(){ try{ bindCentering(); }catch(e){} });
})(); 



// vNZ-1: abrir imagen ampliada SIN zoom extra (fit-to-viewport), centrada.
(function(){
  function ensureModal(){
    var m = document.getElementById('zoom-modal');
    if(!m){
      m = document.createElement('div');
      m.id = 'zoom-modal';
      m.innerHTML = '<div class="zm-backdrop"></div><div class="zm-content"><button class="zm-close" type="button" aria-label="Cerrar">&times;</button><img class="zm-img" alt="Vista ampliada"></div>';
      document.body.appendChild(m);
      var img = m.querySelector('.zm-img');
      var close = function(){ m.classList.remove('active'); document.body.classList.remove('no-scroll'); img.removeAttribute('src'); };
      m.querySelector('.zm-backdrop').onclick = close;
      m.querySelector('.zm-close').onclick = close;
      document.addEventListener('keydown', function(ev){ if(ev.key==='Escape') close(); });
    }
    return m;
  }
  function isImgURL(u){ return /\.(?:jpe?g|png|webp|gif|bmp|avif)(?:\?|#|$)/i.test(u||''); }
  function pickFromImg(img){
    if(!img) return '';
    var ds = img.dataset||{};
    return ds.large || ds.full || ds.src || img.currentSrc || img.src || '';
  }
  function pickBg(el){
    if(!el) return '';
    var bg = getComputedStyle(el).backgroundImage;
    if(bg && bg!=='none'){ return bg.replace(/^url\((['"]?)(.*)\1\)$/,'$2'); }
    return '';
  }
  function getMainSrc(container, target){
    if(!container) return '';
    if(target && target.tagName==='IMG'){ var u=pickFromImg(target); if(isImgURL(u)) return u; }
    var im = container.querySelector('img'); if(im){ var u2=pickFromImg(im); if(isImgURL(u2)) return u2; }
    var u3 = pickBg(container); if(isImgURL(u3)) return u3;
    var nds = container.querySelectorAll('*');
    for (var i=0;i<nds.length;i++){ var u4 = pickBg(nds[i]); if(isImgURL(u4)) return u4; }
    return '';
  }
  function fitNoZoom(){
    var m = document.getElementById('zoom-modal'); if(!m||!m.classList.contains('active')) return;
    var img = m.querySelector('.zm-img'); var cont = m.querySelector('.zm-content'); if(!img||!cont) return;
    // Eliminar cualquier tamaño anterior y forzar fit puro
    img.style.width = ''; img.style.height = '';
    img.style.maxWidth = '95vw'; img.style.maxHeight = '95vh';
    // Centrar por scroll si hiciera falta (normalmente no, por contain)
    cont.scrollLeft = 0; cont.scrollTop = 0;
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        var sw = img.scrollWidth || img.clientWidth;
        var sh = img.scrollHeight || img.clientHeight;
        var cw = cont.clientWidth, ch = cont.clientHeight;
        if (sw > cw) cont.scrollLeft = Math.max(0, Math.round((sw - cw)/2));
        if (sh > ch) cont.scrollTop  = Math.max(0, Math.round((sh - ch)/2));
      });
    });
  }
  function openNoZoom(ev){
    var host = ev.target.closest('#lb-img'); if(!host) return;
    ev.preventDefault(); ev.stopPropagation();
    var src = getMainSrc(host, ev.target); if(!src) return;
    var m = ensureModal(); var img = m.querySelector('.zm-img');
    // reset estilos para evitar zoom previo
    img.removeAttribute('style');
    m.classList.add('active'); document.body.classList.add('no-scroll');
    img.addEventListener('load', function once(){ img.removeEventListener('load', once); fitNoZoom(); });
    img.src = src;
  }
  function bind(){
    if (document.body.dataset.nz1Bound==='1') return;
    document.addEventListener('click', openNoZoom, true);
    window.addEventListener('resize', fitNoZoom);
    window.addEventListener('orientationchange', fitNoZoom);
    if (window.visualViewport){ window.visualViewport.addEventListener('resize', fitNoZoom); }
    document.body.dataset.nz1Bound='1';
  }
  document.addEventListener('DOMContentLoaded', bind);
})(); 



// vNZ-2: quitar residuos de zoom y forzar apertura sin escalados previos
(function(){
  function ensureModal(){
    var m = document.getElementById('zoom-modal');
    if(!m){
      m = document.createElement('div');
      m.id = 'zoom-modal';
      m.innerHTML = '<div class="zm-backdrop"></div><div class="zm-content"><button class="zm-close" type="button" aria-label="Cerrar">&times;</button><img class="zm-img" alt="Vista ampliada"></div>';
      document.body.appendChild(m);
    }else if(!m.querySelector('.zm-content')){
      m.innerHTML = '<div class="zm-backdrop"></div><div class="zm-content"><button class="zm-close" type="button" aria-label="Cerrar">&times;</button><img class="zm-img" alt="Vista ampliada"></div>';
    }
    // listeners de cierre idempotentes
    (function(){
      var img = m.querySelector('.zm-img');
      var close = function(){ 
        m.classList.remove('active'); 
        document.body.classList.remove('no-scroll'); 
        document.body.classList.remove('zoomed'); 
        if(img){ img.removeAttribute('src'); img.removeAttribute('style'); }
      };
      var bd = m.querySelector('.zm-backdrop'); if(bd && !bd.dataset.nzb){ bd.onclick = close; bd.dataset.nzb='1'; }
      var bt = m.querySelector('.zm-close');    if(bt && !bt.dataset.nzb){ bt.onclick = close; bt.dataset.nzb='1'; }
      if(!document.body.dataset.nzEsc){ 
        document.addEventListener('keydown', function(ev){ if(ev.key==='Escape') close(); });
        document.body.dataset.nzEsc='1';
      }
    })();
    return m;
  }
  function isImgURL(u){ return /\.(?:jpe?g|png|webp|gif|bmp|avif)(?:\?|#|$)/i.test(u||''); }
  function pickFromImg(img){
    if(!img) return '';
    var ds = img.dataset||{};
    return ds.large || ds.full || ds.src || img.currentSrc || img.src || '';
  }
  function pickBg(el){
    if(!el) return '';
    var bg = getComputedStyle(el).backgroundImage;
    if(bg && bg!=='none'){ return bg.replace(/^url\((['"]?)(.*)\1\)$/,'$2'); }
    return '';
  }
  function getMainSrc(container, target){
    if(!container) return '';
    if(target && target.tagName==='IMG'){ var u=pickFromImg(target); if(isImgURL(u)) return u; }
    var im = container.querySelector('img'); if(im){ var u2=pickFromImg(im); if(isImgURL(u2)) return u2; }
    var u3 = pickBg(container); if(isImgURL(u3)) return u3;
    var nds = container.querySelectorAll('*');
    for (var i=0;i<nds.length;i++){ var u4 = pickBg(nds[i]); if(isImgURL(u4)) return u4; }
    return '';
  }
  function resetStyles(img, cont){
    try{
      img.removeAttribute('style');
      cont && cont.removeAttribute('style');
      // limpiar clases heredadas de implementaciones previas
      img.classList.remove('zoomed','is-zoom','zoom-in','zoom-out');
      document.body.classList.remove('zoomed');
    }catch(e){}
  }
  function centerIfNeeded(m){
    var img = m.querySelector('.zm-img'); var cont = m.querySelector('.zm-content');
    if(!img || !cont) return;
    cont.scrollLeft = 0; cont.scrollTop = 0;
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        var sw = img.scrollWidth || img.clientWidth;
        var sh = img.scrollHeight || img.clientHeight;
        var cw = cont.clientWidth, ch = cont.clientHeight;
        if (sw > cw) cont.scrollLeft = Math.max(0, Math.round((sw - cw)/2));
        if (sh > ch) cont.scrollTop  = Math.max(0, Math.round((sh - ch)/2));
      });
    });
  }
  function openPlain(ev){
    var host = ev.target.closest('#lb-img'); if(!host) return;
    // cancelar handlers previos que podrían aplicar zoom
    if (ev.stopImmediatePropagation) ev.stopImmediatePropagation();
    ev.stopPropagation(); ev.preventDefault();
    var src = getMainSrc(host, ev.target); if(!src) return;
    var m = ensureModal();
    var img = m.querySelector('.zm-img');
    var cont = m.querySelector('.zm-content');
    resetStyles(img, cont);
    // apertura simple sin escalado: fit por CSS (max 95vw/95vh)
    m.classList.add('active');
    document.body.classList.add('no-scroll');
    img.addEventListener('load', function once(){ img.removeEventListener('load', once); centerIfNeeded(m); });
    img.src = src;
  }
  function bindNZ2(){
    if (document.body.dataset.nz2Bound === '1') return;
    document.addEventListener('click', openPlain, true); // captura para ganar a otros listeners
    window.addEventListener('resize', function(){ var m=document.getElementById('zoom-modal'); if(m&&m.classList.contains('active')) centerIfNeeded(m); });
    window.addEventListener('orientationchange', function(){ var m=document.getElementById('zoom-modal'); if(m&&m.classList.contains('active')) centerIfNeeded(m); });
    if (window.visualViewport){ window.visualViewport.addEventListener('resize', function(){ var m=document.getElementById('zoom-modal'); if(m&&m.classList.contains('active')) centerIfNeeded(m); }); }
    document.body.dataset.nz2Bound = '1';
  }
  document.addEventListener('DOMContentLoaded', bindNZ2);
})(); 

