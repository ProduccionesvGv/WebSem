
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

