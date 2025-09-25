
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
const TECH_SPECS = {
  "01Genint": {
    "01": {
      "Banco":"Genetic1",
      "Genética":"Feminizada",
      "Floración":"70-80 días",
      "THC":"20-22%",
      "Satividad":"70% Sativa",
      "Rendimiento":"INT: 450-550 gr × m² | EXT: 80-200 gr × planta",
      "Efecto":"Eufórico, enérgico, creativo",
      "Sabor":"Cítrico, incienso",
      "Cantidad":"x3 Semillas"
    },
    "02": {},
    "03": {}
  },
  "02Genext": {
    "01": {},
    "02": {},
    "03": {}
  }
};
// Estructura opcional para múltiples fichas por tarjeta (hasta 4)
const TECH_SPECS_SETS = {
  "01Genint": {
    "01": [
      {
        title: "Ficha 1",
        data: {
          "Banco":"Genetic1",
          "Genética":"Feminizada",
          "Floración":"70-80 días",
          "THC":"20-22%",
          "Satividad":"70% Sativa",
          "Rendimiento":"INT: 450-550 gr × m² | EXT: 80-200 gr × planta",
          "Efecto":"Eufórico, enérgico, creativo",
          "Sabor":"Cítrico, incienso",
          "Cantidad":"x3 Semillas"
        }
      },
      { title: "Ficha 2", data: { "Notas":"Ejemplo de segunda ficha técnica opcional" } }
    ],
    "02": [],
    "03": []
  },
  "02Genext": { "01": [], "02": [], "03": [] }
};



const EXTS = ['jpg','JPG','jpeg','JPEG','png','PNG','webp','WEBP'];
function candidates(name){
  // name like 'Front' or 'foto1' or 'Front2'
  const base = [name, name.toLowerCase(), name.toUpperCase()];
  const out = [];
  base.forEach(b=> EXTS.forEach(ext=> out.push(`${b}.${ext}`)));
  return out;
}

function resolveFirst(folderPath, baseName){
  return new Promise((resolve)=>{
    const list = candidates(baseName);
    let idx = 0;
    function tryNext(){
      if(idx >= list.length){ resolve(null); return; }
      const src = `${folderPath}/${list[idx++]}`;
      const img = new Image();
      img.onload = ()=> resolve(src);
      img.onerror = tryNext;
      img.src = src + `?v=${Date.now()%999999}`; // bypass cache
    }
    tryNext();
  });
}

async function buildCard(folder, id){
  const folderPath = `img/${folder}/${id}`;
  const heroSrc = await resolveFirst(folderPath, 'Front');
  const card = document.createElement('article');
  card.className = 'card';
  card.setAttribute('data-folder', folder);
  card.setAttribute('data-id', id);

  const heroDiv = document.createElement('div');
  heroDiv.className = 'hero skeleton';
  if(heroSrc){ heroDiv.style.backgroundImage = `url('${heroSrc}')`; heroDiv.classList.remove('skeleton'); }

  const body = document.createElement('div');
  body.className = 'body';
  const meta = (DATA_OVERRIDE[folder] && DATA_OVERRIDE[folder][id]) || {title:`Item ${id}`, genetica:'', price:''};
  body.innerHTML = `<h3>${meta.title}</h3><div class="spec">${meta.genetica}</div><div class="price">${meta.price ? '$'+meta.price : 'Consultar'}</div>`;

  card.appendChild(heroDiv);
  card.appendChild(body);
  card.addEventListener('click', async ()=> { updateSpecs(meta); renderFichaStatic(folder, id, meta); });
  return card;
}

function openGallery(images){
  if(!images || !images.length){ return; }
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
  lb.classList.add('active');
  lb.setAttribute('aria-hidden','false');
}

async function buildCarousel(rootId, folder){
  const container = document.getElementById(rootId);
  if(!container) return;
  for(const id of ['01','02','03']){
    const card = await buildCard(folder, id);
    container.appendChild(card);
  }
}

document.addEventListener('DOMContentLoaded', async function(){
  bindCarouselControls('cuadro1','carousel','prevBtn','nextBtn');
  bindCarouselControls('cuadro2','carousel2','prevBtn2','nextBtn2');
  await buildCarousel('carousel','01Genint');
  await buildCarousel('carousel2','02Genext');
  document.getElementById('lb-close').addEventListener('click', ()=>{
    const lb = document.getElementById('lightbox');
    closeLightbox();
  });
});


function bindCarouselControls(sectionId, carouselId, prevId, nextId){
  const wrap = document.getElementById(carouselId);
  const prev = document.getElementById(prevId);
  const next = document.getElementById(nextId);
  if(!wrap || !prev || !next) return;
  function cardWidth(){
    const card = wrap.querySelector('.card');
    return card ? (card.getBoundingClientRect().width + 14) : 320;
  }
  prev.addEventListener('click', ()=> wrap.scrollBy({left: -cardWidth()*1.2, behavior:'smooth'}));
  next.addEventListener('click', ()=> wrap.scrollBy({left:  cardWidth()*1.2, behavior:'smooth'}));
}


function updateSpecs(meta){
  const box = document.querySelector('.specs-box');
  if(!box) return;
  box.querySelector('.specs-empty')?.setAttribute('hidden','');
  const content = box.querySelector('.specs-content');
  if(content) content.hidden = false;
  const t = document.getElementById('specs-title');
  const g = document.getElementById('specs-gen');
  const p = document.getElementById('specs-price');
  if(t) t.textContent = meta.title || '';
  if(g) g.textContent = meta.genetica || '';
  if(p) p.textContent = meta.price ? ('$'+meta.price) : 'Consultar';

  // Update WA links
  const msg = encodeURIComponent(`Consulta por ${meta.title} (${meta.genetica})`);
  const wa = document.getElementById('wa-link');
  if(wa) wa.href = `https://wa.me/5490000000000?text=${msg}`; // reemplazar número
  const fab = document.getElementById('wa-fab');
  if(fab) fab.href = `https://wa.me/5490000000000?text=${msg}`;
}


function renderFicha(folder, id){
  const grid = document.getElementById('specs-grid');
  if(!grid) return;
  grid.innerHTML = '';
  const data = (TECH_SPECS[folder] && TECH_SPECS[folder][id]) || {};
  const order = ["Banco","Genética","Floración","THC","Satividad","Rendimiento","Efecto","Sabor","Cantidad"];
  let hasAny = false;
  order.forEach(k=>{
    const v = data[k];
    if(v){
      hasAny = true;
      const div = document.createElement('div');
      div.className = 'kv';
      div.innerHTML = `<div class="k">${k}</div><div class="v">${v}</div>`;
      grid.appendChild(div);
    }
  });
  if(!hasAny){
    const div = document.createElement('div');
    div.className = 'kv';
    div.innerHTML = `<div class="k">Ficha técnica</div><div class="v">Próximamente…</div>`;
    grid.appendChild(div);
  }
}


function renderFichaLB(folder, id, meta){
  const box = document.getElementById('lb-ficha');
  const name = document.getElementById('lb-ficha-name');
  if(name && meta && meta.title){ name.textContent = meta.title; }
  const grid = document.getElementById('lb-ficha-grid');
  if(!box || !grid) return;
  grid.innerHTML = '';
  const data = (typeof TECH_SPECS !== 'undefined' && TECH_SPECS[folder] && TECH_SPECS[folder][id]) || {};
  const order = ["Banco","Genética","Floración","THC","Satividad","Rendimiento","Efecto","Sabor","Cantidad"];
  let has = false;
  order.forEach(k=>{
    const v = data[k];
    if(v){
      has = true;
      const div = document.createElement('div');
      div.className = 'kv';
      div.innerHTML = `<div class="k">${k}</div><div class="v">${v}</div>`;
      grid.appendChild(div);
    }
  });
  if(!has){
    const div = document.createElement('div');
    div.className = 'kv';
    div.innerHTML = `<div class="k">Ficha técnica</div><div class="v">Próximamente…</div>`;
    grid.appendChild(div);
  }
  box.hidden = false;
}


// lb backdrop click to close
document.addEventListener('click', (e)=>{
  const lb = document.getElementById('lightbox');
  if(!lb || !lb.classList.contains('active')) return;
  const inner = document.querySelector('.lb-inner');
  if(inner && !inner.contains(e.target) || e.target.id==='lb-close'){
    closeLightbox();
  }
});


/* === Scroll lock when lightbox is open === */
let __scrollY = 0;
function lockScroll(){
  __scrollY = window.scrollY || window.pageYOffset || 0;
  const b = document.body;
  b.classList.add('no-scroll');
  b.style.top = `-${__scrollY}px`;
}
function unlockScroll(){
  const b = document.body;
  b.classList.remove('no-scroll');
  const y = __scrollY || 0;
  b.style.top = '';
  window.scrollTo(0, y);
}


function closeLightbox(){
  const lb = document.getElementById('lightbox');
  if(!lb) return;
  lb.classList.remove('active');
  lb.setAttribute('aria-hidden','true');
  unlockScroll();
}

// prevent background scroll through lightbox
document.addEventListener('wheel', (e)=>{
  const lb = document.getElementById('lightbox');
  const inner = document.querySelector('.lb-inner');
  if(lb && lb.classList.contains('active') && inner && !inner.contains(e.target)){
    e.preventDefault();
    e.stopPropagation();
  }
}, {passive:false});
document.addEventListener('touchmove', (e)=>{
  const lb = document.getElementById('lightbox');
  const inner = document.querySelector('.lb-inner');
  if(lb && lb.classList.contains('active') && inner && !inner.contains(e.target)){
    e.preventDefault();
    e.stopPropagation();
  }
}, {passive:false});


function renderFichaStatic(folder, id, meta){
  if(renderFichaTabs(folder, id, meta)) return;
  const grid = document.getElementById('specs-grid');
  const name = document.getElementById('specs-name');
  if(!grid) return;
  if(name) name.textContent = (meta && meta.title) ? meta.title : '';
  grid.innerHTML = '';
  const data = (typeof TECH_SPECS !== 'undefined' && TECH_SPECS[folder] && TECH_SPECS[folder][id]) || {};
  const order = ["Banco","Genética","Floración","THC","Satividad","Rendimiento","Efecto","Sabor","Cantidad"];
  if(Object.keys(data).length === 0){
    const div = document.createElement('div');
    div.className = 'kv';
    div.innerHTML = `<div class="k">Ficha técnica</div><div class="v">Próximamente…</div>`;
    grid.appendChild(div);
  }else{
    order.forEach(k=>{
      const v = data[k];
      if(v){
        const div = document.createElement('div');
        div.className = 'kv';
        div.innerHTML = `<div class="k">${k}</div><div class="v">${v}</div>`;
        grid.appendChild(div);
      }
    });
  }
  // Scroll to specs for mobile convenience
  const specs = document.getElementById('specs');
  if(specs) specs.scrollIntoView({behavior:'smooth', block:'start'});
}


function renderFichaTabs(folder, id, meta){
  const tabs = document.getElementById('specs-tabs');
  const panels = document.getElementById('specs-panels');
  const gridSingle = document.getElementById('specs-grid');
  if(!tabs || !panels) return;

  const sets = (TECH_SPECS_SETS[folder] && TECH_SPECS_SETS[folder][id]) || [];
  const validSets = sets.filter(s => s && s.data && Object.keys(s.data).length);
  if(validSets.length === 0){
    tabs.hidden = true;
    panels.hidden = true;
    gridSingle.hidden = false;
    return false;
  }

  tabs.innerHTML = '';
  panels.innerHTML = '';
  validSets.slice(0,4).forEach((set, i)=>{
    const btn = document.createElement('button');
    btn.className = 'specs-tab'; btn.type='button';
    btn.textContent = set.title || `Ficha ${i+1}`;
    btn.setAttribute('role','tab');
    btn.setAttribute('aria-selected', i===0 ? 'true' : 'false');
    btn.dataset.index = i;
    tabs.appendChild(btn);

    const pan = document.createElement('div');
    pan.className = 'specs-panel'; pan.setAttribute('role','tabpanel');
    pan.setAttribute('aria-hidden', i===0 ? 'false' : 'true');

    const grid = document.createElement('div');
    grid.className = 'specs-grid';
    const order = ["Banco","Genética","Floración","THC","Satividad","Rendimiento","Efecto","Sabor","Cantidad"];
    const data = set.data || {};
    if(Object.keys(data).length === 0){
      const div = document.createElement('div');
      div.className = 'kv';
      div.innerHTML = `<div class="k">Ficha técnica</div><div class="v">Próximamente…</div>`;
      grid.appendChild(div);
    }else{
      order.forEach(k=>{
        const v = data[k];
        if(v){
          const div = document.createElement('div');
          div.className = 'kv';
          div.innerHTML = `<div class="k">${k}</div><div class="v">${v}</div>`;
          grid.appendChild(div);
        }
      });
      Object.keys(data).forEach(k=>{
        if(!order.includes(k)){
          const div = document.createElement('div');
          div.className = 'kv';
          div.innerHTML = `<div class="k">${k}</div><div class="v">${data[k]}</div>`;
          grid.appendChild(div);
        }
      });
    }
    pan.appendChild(grid);
    panels.appendChild(pan);
  });

  tabs.hidden = false;
  panels.hidden = false;
  gridSingle.hidden = true;

  tabs.addEventListener('click', (e)=>{
    const btn = e.target.closest('.specs-tab'); if(!btn) return;
    const idx = parseInt(btn.dataset.index, 10);
    [...tabs.children].forEach((b, i)=> b.setAttribute('aria-selected', i===idx ? 'true' : 'false'));
    [...panels.children].forEach((p, i)=> p.setAttribute('aria-hidden', i===idx ? 'false' : 'true'));
  });

  const specs = document.getElementById('specs');
  if(specs) specs.scrollIntoView({behavior:'smooth', block:'start'});
  return true;
}
