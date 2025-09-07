// Datos de ejemplo. Reemplaza con tus variedades reales.
let DATA = [
  {
    id: 'gorilla-glue-auto',
    title: 'Gorilla Glue Auto',
    subtitle: 'Autofloreciente · Índica dominante',
    price_ars: 18999,
    badge: 'TOP',
    // Imagen de relleno con SVG embebido (puedes reemplazar por tu propia ruta/URL)
    image: 'https://ibb.co/svJvGv3R' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000">
        <defs>
          <linearGradient id="g" x1="0" x2="1">
            <stop offset="0" stop-color="#1f2937"/>
            <stop offset="1" stop-color="#0b0f1a"/>
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#g)"/>
        <text x="50%" y="48%" fill="#9ca3af" font-family="Inter, Arial" font-size="48" text-anchor="middle">Gorilla Glue</text>
        <text x="50%" y="56%" fill="#6ee7b7" font-family="Inter, Arial" font-weight="bold" font-size="34" text-anchor="middle">AUTO</text>
      </svg>
    `),
    specs: {
      banco: 'Demo Seeds',
      genetica: 'Gorilla Glue x Ruderalis',
      floracion: '9-10 semanas',
      thc: '22-25%',
      rendimiento: 'Alto',
      sabor: 'Terroso, pino, cítrico',
      notas: 'Planta robusta, ideal para principiantes.'
    }
  },
  {
    id: 'lemon-haze-fem',
    title: 'Lemon Haze Fem',
    subtitle: 'Feminizada · Sativa',
    price_ars: 20999,
    badge: 'NUEVA',
    image: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000">
        <defs>
          <linearGradient id="g2" x1="0" x2="1">
            <stop offset="0" stop-color="#1b4332"/>
            <stop offset="1" stop-color="#081c15"/>
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#g2)"/>
        <text x="50%" y="48%" fill="#b7e4c7" font-family="Inter, Arial" font-size="48" text-anchor="middle">Lemon Haze</text>
        <text x="50%" y="56%" fill="#ffd166" font-family="Inter, Arial" font-weight="bold" font-size="34" text-anchor="middle">FEM</text>
      </svg>
    `),
    specs: {
      banco: 'Demo Seeds',
      genetica: 'Lemon Skunk x Haze',
      floracion: '10-12 semanas',
      thc: '20-23%',
      rendimiento: 'Medio-Alto',
      sabor: 'Limón, dulce, especias',
      notas: 'Aroma cítrico muy marcado. Efecto energizante.'
    }
  },
  {
    id: 'cookies-kush',
    title: 'Cookies Kush',
    subtitle: 'Feminizada · Índica',
    price_ars: 19999,
    badge: 'HOT',
    image: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000">
        <defs>
          <linearGradient id="g3" x1="0" x2="1">
            <stop offset="0" stop-color="#28203f"/>
            <stop offset="1" stop-color="#0d0b14"/>
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#g3)"/>
        <text x="50%" y="48%" fill="#c4b5fd" font-family="Inter, Arial" font-size="48" text-anchor="middle">Cookies</text>
        <text x="50%" y="56%" fill="#a78bfa" font-family="Inter, Arial" font-weight="bold" font-size="34" text-anchor="middle">KUSH</text>
      </svg>
    `),
    specs: {
      banco: 'Demo Seeds',
      genetica: 'Girl Scout Cookies x OG Kush',
      floracion: '8-9 semanas',
      thc: '19-22%',
      rendimiento: 'Alto',
      sabor: 'Dulce, tierra húmeda, vainilla',
      notas: 'Muy resinosa, perfecta para extracciones.'
    }
  },
  {
    id: 'blueberry-auto',
    title: 'Blueberry Auto',
    subtitle: 'Autofloreciente · Índica',
    price_ars: 15499,
    badge: 'SALE',
    image: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000">
        <defs>
          <linearGradient id="g4" x1="0" x2="1">
            <stop offset="0" stop-color="#1f1147"/>
            <stop offset="1" stop-color="#0a0717"/>
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#g4)"/>
        <text x="50%" y="48%" fill="#cbd5ff" font-family="Inter, Arial" font-size="48" text-anchor="middle">Blueberry</text>
        <text x="50%" y="56%" fill="#93c5fd" font-family="Inter, Arial" font-weight="bold" font-size="34" text-anchor="middle">AUTO</text>
      </svg>
    `),
    specs: {
      banco: 'Demo Seeds',
      genetica: 'Blueberry Auto',
      floracion: '9 semanas',
      thc: '18-20%',
      rendimiento: 'Medio',
      sabor: 'Frutos del bosque, dulce',
      notas: 'Coloraciones moradas en climas fríos.'
    }
  }
];

const $carousel = document.getElementById('carousel');
const $prev = document.getElementById('prevBtn');
const $next = document.getElementById('nextBtn');
const $specsCard = document.getElementById('specsCard');

function moneyARS(n){
  try{
    return n.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });
  }catch(e){
    return '$ ' + (n||0);
  }
}

function renderCards(){
  const frag = document.createDocumentFragment();
  DATA.forEach(item => {
    const card = document.createElement('article');
    card.className = 'card';

    const imgWrap = document.createElement('a');
    imgWrap.href = '#specs';
    imgWrap.className = 'card-img-wrap';
    imgWrap.dataset.id = item.id;
    imgWrap.addEventListener('click', () => showSpecs(item.id));
    
imgWrap.innerHTML = `<span class="badge">${item.badge}</span>`;

// Si es Gorilla, usar imagen local como background cover
if(item.id === 'gorilla-glue-auto'){
  imgWrap.style.backgroundImage = "url('img/gorilla.jpg')";
  imgWrap.style.backgroundSize = "cover";
  imgWrap.style.backgroundPosition = "center";
} else if(item.id === 'lemon-haze-fem'){
  imgWrap.style.backgroundImage = "url('img/lemon.jpg')";
  imgWrap.style.backgroundSize = "cover";
  imgWrap.style.backgroundPosition = "center";
} else {
  const imgTag = document.createElement('img');
  imgTag.src = item.image;
  imgTag.alt = item.title;
  imgTag.loading = 'lazy';
  imgWrap.appendChild(imgTag);
}


    const body = document.createElement('div');
    body.className = 'card-body';
    body.innerHTML = `
      <h3 class="title">${item.title}</h3>
      <p class="subtitle">${item.subtitle}</p>
      <p class="price">${moneyARS(item.price_ars)}</p>
    `;

    card.appendChild(imgWrap);
    card.appendChild(body);
    frag.appendChild(card);
  });
  $carousel.appendChild(frag);
}

function showSpecs(id){
  const item = DATA.find(x => x.id === id);
  if(!item){ return; }

  const { banco, genetica, floracion, thc, rendimiento, sabor, notas } = item.specs;

  $specsCard.innerHTML = `
    <div class="spec-grid">
      <div><div class="label">Nombre</div><div class="value">${item.title}</div></div>
      <div><div class="label">Banco</div><div class="value">${banco}</div></div>
      <div><div class="label">Genética</div><div class="value">${genetica}</div></div>
      <div><div class="label">Floración</div><div class="value">${floracion}</div></div>
      <div><div class="label">THC</div><div class="value">${thc}</div></div>
      <div><div class="label">Rendimiento</div><div class="value">${rendimiento}</div></div>
      <div style="grid-column: 1 / -1">
        <div class="label">Sabor</div><div class="value">${sabor}</div>
      </div>
      <div style="grid-column: 1 / -1">
        <div class="label">Notas</div><div class="value">${notas}</div>
      </div>
    </div>
  `;

  // Scroll suave hasta la sección de especificaciones
  document.getElementById('specs').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Navegación con botones
function scrollByCards(dir = 1){
  const cardWidth = $carousel.querySelector('.card')?.getBoundingClientRect().width || 260;
  $carousel.scrollBy({ left: dir * (cardWidth + 16) * 2, behavior: 'smooth' }); // desplaza ~2 tarjetas
}

$prev.addEventListener('click', () => scrollByCards(-1));
$next.addEventListener('click', () => scrollByCards(1));

// Soporte de teclas
$carousel.addEventListener('keydown', (e) => {
  if(e.key === 'ArrowRight') scrollByCards(1);
  if(e.key === 'ArrowLeft') scrollByCards(-1);
});

// Inicializa
DATA = DATA.filter(item => item.id !== 'blueberry-auto');
renderCards();

// Enfocar carrusel al cargar para flechas
window.addEventListener('load', () => {
  $carousel.focus({ preventScroll: true });
});
