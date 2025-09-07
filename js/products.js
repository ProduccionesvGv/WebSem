// Centralized PRODUCTS config
const PRODUCTS = [
  {
    id: 'phantom-ice',
    title: 'Phantom Ice',
    images: [
      'img/phantom-ice-hero.jpg',
      'img/phantom-ice-1.jpg',
      'img/phantom-ice-2.jpg'
    ]
  },
  {
    id: 'la-messias',
    title: 'La Messias',
    images: [
      'img/la-messias-hero.png',
      'img/la-messias-1.png',
      'img/la-messias-2.png'
    ]
  },
  // --- TEMPLATE (copy/paste and edit) ---
  {
    id: 'template-id',              // cambia por tu slug en kebab-case, ej: 'white-widow-auto'
    title: 'Template Title',        // cambia por el título visible
    images: [
      'img/template-hero.jpg',      // reemplaza por tus rutas reales
      'img/template-1.jpg',
      'img/template-2.jpg'
    ]
  }
];


// Exponer global para el bootstrap
window.PRODUCTS = PRODUCTS;
