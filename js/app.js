
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
