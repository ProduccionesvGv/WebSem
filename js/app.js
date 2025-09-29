
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
  // PATCH v6: Ficha técnica dentro del lightbox para 01Genint/01
// Limpia fichas previas
const oldFicha = lb.querySelector('.lb-ficha-panel');
if (oldFicha) oldFicha.remove();

// Derivar folder e id desde folderPath: img/<folder>/<id>
try {
  const parts = folderPath.split('/'); // ["img", "01Genint", "01"]
  const folder = parts[1];
  const id = parts[2];
  if (folder === '01Genint' && id === '01') {
    const meta = (DATA_OVERRIDE[folder] && DATA_OVERRIDE[folder][id]) || {};
    const ficha = document.createElement('div');
    ficha.className = 'lb-ficha-panel';
    ficha.innerHTML = `
        <h4 class=\"lb-ficha-title\">${meta.title || ''}</h4>
        
      <div class="ficha-grid">
        <div><b>Banco</b><span>${meta.banco || '—'}</span></div>
        <div><b>Genética</b><span>${meta.genetica || '—'}</span></div>
        <div><b>Floración</b><span>${meta.floracion || '—'}</span></div>
        <div><b>THC</b><span>${meta.thc || '—'}</span></div>
        <div><b>Rendimiento</b><span>${meta.rendimiento || '—'}</span></div>
        <div><b>Sabor</b><span>${meta.sabor || '—'}</span></div>
        <div class="notas"><b>Notas</b><span>${meta.notas || '—'}</span></div>
      </div>`;
    // Insertar después de las miniaturas
    const thumbsParent = thumbs.parentElement || lb;
    thumbs.insertAdjacentElement('afterend', ficha);
  }
} catch(e) { /* silencioso */ }
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


// PATCH: Datos completos de ficha para 01Genint/01 (plantilla de ejemplo)
try {
  if (!DATA_OVERRIDE["01Genint"]) DATA_OVERRIDE["01Genint"] = {};
  DATA_OVERRIDE["01Genint"]["01"] = {
    title: "Gen1",
    genetica: "Feminizada",
    price: "49.999",
    banco: "BSF Seeds",
    floracion: "9 semanas",
    thc: "25%",
    rendimiento: "650 g/m²",
    sabor: "Dulce y terroso",
    notas: "Planta robusta, recomendada para interiores. Responde bien a poda y SCROG."
  };
} catch(e) {}
