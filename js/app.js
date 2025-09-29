
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
  // CLEAN previous ficha panels to avoid mixing
lb.querySelectorAll('.lb-ficha-panel, .lb-fichas-multi, .lb-sep').forEach(n => n.remove());

// Ensure a separator after thumbs to keep flow
const lbSep = document.createElement('div');
lbSep.className = 'lb-sep';
thumbs.insertAdjacentElement('afterend', lbSep);

// FICHA for 01Genint/01 inside lightbox
try {
  const parts = folderPath.split('/'); // ["img","<folder>","<id>"]
  const folder = parts[1];
  const id = parts[2];
  if (folder === '01Genint' && id === '01') {
    const meta = (DATA_OVERRIDE[folder] && DATA_OVERRIDE[folder][id]) || {};
    const ficha = document.createElement('div');
    ficha.className = 'lb-ficha-panel';
    ficha.innerHTML = `
      <h4 class="lb-ficha-title">${meta.title || ''}</h4>
      <div class="ficha-grid">
        <div><b>Banco</b><span>${meta.banco || '—'}</span></div>
        <div><b>Genética</b><span>${meta.genetica || '—'}</span></div>
        <div><b>Floración</b><span>${meta.floracion || '—'}</span></div>
        <div><b>THC</b><span>${meta.thc || '—'}</span></div>
        <div><b>Rendimiento</b><span>${meta.rendimiento || '—'}</span></div>
        <div><b>Sabor</b><span>${meta.sabor || '—'}</span></div>
        <div class="notas"><b>Notas</b><span>${meta.notas || '—'}</span></div>
      </div>`;
    lbSep.insertAdjacentElement('afterend', ficha);
  }
} catch(e) {}

// MULTI FICHAS for 02Genext/01 inside lightbox
try {
  const parts2 = folderPath.split('/');
  const folder2 = parts2[1];
  const id2 = parts2[2];
  if (folder2 === '02Genext' && id2 === '01') {
    const fichas = (window.DATA_FICHAS && DATA_FICHAS['02Genext'] && DATA_FICHAS['02Genext']['01']) || [];
    if (fichas.length) {
      const cont = document.createElement('div');
      cont.className = 'lb-fichas-multi';
      fichas.forEach(f => {
        const panel = document.createElement('div');
        panel.className = 'lb-ficha-panel';
        panel.innerHTML = `
          <h4 class="lb-ficha-title">${f.titulo || ''}</h4>
          <div class="ficha-grid">
            <div><b>Banco</b><span>${f.banco || '—'}</span></div>
            <div><b>Genética</b><span>${f.genetica || '—'}</span></div>
            <div><b>Floración</b><span>${f.floracion || '—'}</span></div>
            <div><b>THC</b><span>${f.thc || '—'}</span></div>
            <div><b>Rendimiento</b><span>${f.rendimiento || '—'}</span></div>
            <div><b>Sabor</b><span>${f.sabor || '—'}</span></div>
            <div class="notas"><b>Notas</b><span>${f.notas || '—'}</span></div>
          </div>`;
        cont.appendChild(panel);
      });
      lbSep.insertAdjacentElement('afterend', cont);
    }
  }
} catch(e) {}

// SCROLL-LOCK: block background scroll and let lightbox scroll
(function(){
  const y = window.scrollY || document.documentElement.scrollTop || 0;
  document.body.dataset.modalScrollY = String(y);
  document.body.classList.add('modal-open');
  document.body.style.top = `-${y}px`;
})();
lb.classList.add('active');
  lb.setAttribute('aria-hidden','false');
}

document.addEventListener('DOMContentLoaded', function(){
  buildCarousel('carousel','01Genint');
  buildCarousel('carousel2','02Genext');
  document.getElementById('lb-close').addEventListener('click', ()=>{
    const lb = document.getElementById('lightbox');
    lb.classList.remove('active');
    lb.setAttribute('aria-hidden','true');

// SCROLL-UNLOCK
(function(){
  const y = parseInt(document.body.dataset.modalScrollY || '0', 10);
  document.body.classList.remove('modal-open');
  document.body.style.top = '';
  delete document.body.dataset.modalScrollY;
  window.scrollTo(0, y);
})();

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


// DATA: ensure Gen1 title and fichas multi for 02Genext/01
try {
  if (!window.DATA_OVERRIDE) window.DATA_OVERRIDE = DATA_OVERRIDE;
  if (!DATA_OVERRIDE["01Genint"]) DATA_OVERRIDE["01Genint"] = {};
  DATA_OVERRIDE["01Genint"]["01"] = Object.assign({}, DATA_OVERRIDE["01Genint"]["01"], { title: "Gen1" });

  window.DATA_FICHAS = window.DATA_FICHAS || {};
  if (!DATA_FICHAS["02Genext"]) DATA_FICHAS["02Genext"] = {};
  DATA_FICHAS["02Genext"]["01"] = [
    { titulo: "Critical+2", banco: "BSF Seeds", genetica: "Auto", floracion: "8-9 semanas", thc: "20%", rendimiento: "550 g/m²", sabor: "Dulce", notas: "Ficha 1" },
    { titulo: "Black Dom",  banco: "BSF Seeds", genetica: "Fem",  floracion: "8 semanas",   thc: "22%", rendimiento: "600 g/m²", sabor: "Terroso", notas: "Ficha 2" },
    { titulo: "Moby-D",     banco: "BSF Seeds", genetica: "Fem",  floracion: "10 semanas",  thc: "24%", rendimiento: "700 g/m²", sabor: "Cítrico", notas: "Ficha 3" },
    { titulo: "northern",   banco: "BSF Seeds", genetica: "Auto", floracion: "9 semanas",   thc: "19%", rendimiento: "500 g/m²", sabor: "Picante", notas: "Ficha 4" }
  ];
} catch(e) {}
