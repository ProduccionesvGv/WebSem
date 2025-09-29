
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


/* === Limpia/oculta la sección central de Especificaciones === */
function clearSpecs(){
  const sec = document.getElementById('specs');
  if(!sec) return;
  const name = document.getElementById('specs-name');
  const grid = document.getElementById('specs-grid');
  const gal  = document.getElementById('specs-gallery');
  if(name) name.textContent = '';
  if(grid) grid.innerHTML = '';
  if(gal)  gal.innerHTML  = '';
  sec.style.display = 'none';
}
function showSpecs(){
  const sec = document.getElementById('specs');
  if(sec) sec.style.display = '';
}


/* === Auto-ocultar #specs cuando no hay tarjetas abiertas === */
function _anyCardOpen(){ return !!document.querySelector('.card.open'); }
function _hideSpecsIfNoOpen(){
  const sec = document.getElementById('specs');
  if(!sec) return;
  if(!_anyCardOpen()){
    clearSpecs();
  }
}
const _specsObserver = new MutationObserver(()=>{ _hideSpecsIfNoOpen(); });
_specsObserver.observe(document.documentElement, {subtree:true, childList:true, attributes:true});
document.addEventListener('click', (e)=>{
  const insideCard = e.target.closest('.card');
  const insideSpecs = e.target.closest('#specs');
  if(!insideCard && !insideSpecs){
    _hideSpecsIfNoOpen();
  }
});
