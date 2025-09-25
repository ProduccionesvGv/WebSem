
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
  card.addEventListener('click', async ()=> { updateSpecs(meta); renderFicha(folder, id);
    const names = ['foto1','foto2','foto3','foto4','Front2'];
    const resolved = [];
    for(const n of names){
      const r = await resolveFirst(folderPath, n);
      if(r) resolved.push(r);
    }
    openGallery(resolved); try { renderFichaUnderLightbox(folder, id, meta); } catch(e){}
  });
  return card;
}

function openGallery(images){
  if(!images || !images.length) return;
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
  await buildCarousel('carousel','01Genint');
  await buildCarousel('carousel2','02Genext');
  document.getElementById('lb-close').addEventListener('click', ()=>{
    const lb = document.getElementById('lightbox');
    lb.classList.remove('active');
    lb.setAttribute('aria-hidden','true');
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


function renderFichaUnderLightbox(folder, id, meta){
  const box = document.getElementById('lb-ficha-fixed');
  const name = document.getElementById('lb-ficha-name');
  const grid = document.getElementById('lb-ficha-grid');
  if(!box || !grid) return;
  const data = (TECH_SPECS[folder] && TECH_SPECS[folder][id]) || {};
  if(name) name.textContent = meta && meta.title ? meta.title : '';
  grid.innerHTML = '';
  const order = ["Banco","Genética","Floración","THC","Satividad","Rendimiento","Efecto","Sabor","Cantidad"];
  if(Object.keys(data).length === 0){
    const div = document.createElement('div');
    div.className = 'kv'; div.innerHTML = `<div class="k">Ficha técnica</div><div class="v">Próximamente…</div>`;
    grid.appendChild(div);
  }else{
    order.forEach(k=>{ const v = data[k]; if(v){ const d=document.createElement('div'); d.className='kv'; d.innerHTML=`<div class="k">${k}</div><div class="v">${v}</div>`; grid.appendChild(d); } });
  }
  box.hidden = false;
}


function renderFichaUnderInline(card, folder, id, meta){
  // Try to find an inline details container just after images
  let host = card.querySelector('.details') || card;
  let panel = host.querySelector('.inline-ficha-fixed');
  if(!panel){
    panel = document.createElement('div');
    panel.className = 'inline-ficha-fixed';
    host.appendChild(panel);
  }
  const data = (TECH_SPECS[folder] && TECH_SPECS[folder][id]) || {};
  panel.innerHTML = `<div class="ft-title">Ficha técnica</div><div class="ft-name">${meta && meta.title ? meta.title : ''}</div><div class="grid"></div>`;
  const grid = panel.querySelector('.grid');
  const order = ["Banco","Genética","Floración","THC","Satividad","Rendimiento","Efecto","Sabor","Cantidad"];
  if(Object.keys(data).length === 0){
    const div = document.createElement('div');
    div.className = 'kv'; div.innerHTML = `<div class="k">Ficha técnica</div><div class="v">Próximamente…</div>`;
    grid.appendChild(div);
  }else{
    order.forEach(k=>{ const v = data[k]; if(v){ const d=document.createElement('div'); d.className='kv'; d.innerHTML=`<div class="k">${k}</div><div class="v">${v}</div>`; grid.appendChild(d); } });
  }
}

document.addEventListener('DOMContentLoaded', function(){
  try{
    bindCarouselControls('cuadro1','carousel','prevBtn','nextBtn');
    bindCarouselControls('cuadro2','carousel2','prevBtn2','nextBtn2');
  }catch(e){ console.error('bind controls err', e); }
});


function bindThumbClicks(scope){
  const mainInline = scope.querySelector('#main-img');
  const mainLb = document.getElementById('lb-img');
  scope.querySelectorAll('.thumbs img, #lb-thumbs img').forEach(im=>{
    im.addEventListener('click', (e)=>{
      const src = im.dataset.src || im.getAttribute('src');
      if(mainInline){ mainInline.src = src; }
      if(mainLb && document.getElementById('lightbox')?.classList.contains('active')){ mainLb.src = src; }
      e.stopPropagation();
    });
  });
}

document.addEventListener('click', (e)=>{
  const scope = e.target.closest('.details, .lightbox, body');
  if(scope){ bindThumbClicks(scope); }
}, {capture:true});


// === Inject close button when a details panel appears and wire interactions ===
(function(){
  const ensureCloseButton = (host)=>{
    if(!host || host.querySelector('.details-close')) return;
    const btn = document.createElement('button');
    btn.className = 'details-close';
    btn.type = 'button';
    btn.innerHTML = 'Cerrar ✕';
    // Insert at top of details
    const viewer = host.querySelector('.viewer');
    if(viewer) host.insertBefore(btn, viewer);
    else host.prepend(btn);
  };

  // Observe additions of .details and enhance them
  const mo = new MutationObserver((mutations)=>{
    mutations.forEach(m=>{
      m.addedNodes && m.addedNodes.forEach(node=>{
        if(node.nodeType===1){
          if(node.classList.contains('details')) ensureCloseButton(node);
          node.querySelectorAll && node.querySelectorAll('.details').forEach(ensureCloseButton);
        }
      });
    });
  });
  mo.observe(document.documentElement, {subtree:true, childList:true});

  // Delegate close action
  document.addEventListener('click', (e)=>{
    const btn = e.target.closest('.details-close');
    if(!btn) return;
    const details = btn.closest('.details');
    const card = btn.closest('.card');
    if(details){ details.innerHTML=''; }
    if(card){ card.classList.remove('open'); }
  });

  // Close on ESC
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape'){
      const open = document.querySelector('.card.open .details');
      if(open){
        open.innerHTML='';
        open.closest('.card')?.classList.remove('open');
      }
    }
  });
})();


// === Sync large image height with card hero height ===
function _matchMainToHero(card){
  if(!card) return;
  const hero = card.querySelector('.hero');
  const main = card.querySelector('.details .viewer .main');
  if(!hero || !main) return;
  const h = Math.max(160, Math.round(hero.getBoundingClientRect().height || 0));
  main.style.height = h + 'px';
}

// Recompute on resize for the currently open card
window.addEventListener('resize', ()=>{
  const openCard = document.querySelector('.card.open');
  if(openCard) _matchMainToHero(openCard);
});
