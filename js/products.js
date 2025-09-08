// Centralized PRODUCTS config
const PRODUCTS = [
  {
    id: 'phantom-ice',
    title: 'Phantom Ice',
    subtitle: 'Feminizada Híbrida',
    price_ars: 18000,
    tags: ['indoor','resistente'],
    stock: 'en-stock',
    notas: 'Planta robusta, ideal para principiantes.',
    sabor: 'Dulce, Incienso, Herbal',
    rendimiento: 'Alto',
    thc: '17-20%',
    floracion: '8-10 semanas',
    genetica: 'Phantom Cookies x Jamaican Ice',
    banco: 'Mamua Seeds',
    images: [
      'img/phantom-ice-1.jpg',
      'img/phantom-ice-2.jpg',
      'img/phantom-ice-hero.jpg'
    ]
  },
  {
    id: 'la-messias',
    title: 'La Messias',
    subtitle: 'Feminizada Híbrida',
    price_ars: 18000,
    tags: ['indoor','resistente'],
    stock: 'en-stock',
    notas: 'Entrenamiento simple y adaptable.',
    sabor: 'Cítrico, Herbal',
    rendimiento: 'Medio-Alto',
    thc: '16-22%',
    floracion: '8-10 semanas',
    genetica: 'Híbrido',
    banco: 'VGVSERV Seeds',
    images: [
      'img/la-messias-hero.png',
      'img/la-messias-1.png',
      'img/la-messias-2.png'
    ]
  },
  // --- TEMPLATE (copy/paste and edit) ---
  {
    id: 'template-id',              // cambia por tu slug en kebab-case, ej: 'white-widow-auto'
    title: 'Template Title',
    subtitle: 'Feminizada Híbrida',
    price_ars: 18000,
    tags: ['auto','rápida'],
    stock: 'en-stock',
    notas: 'Entrenamiento simple y adaptable.',
    sabor: 'Cítrico, Herbal',
    rendimiento: 'Medio-Alto',
    thc: '16-22%',
    floracion: '8-10 semanas',
    genetica: 'Híbrido',
    banco: 'VGVSERV Seeds',        // cambia por el título visible
    images: [
      'img/template-hero.jpg',      // reemplaza por tus rutas reales
      'img/template-1.jpg',
      'img/template-2.jpg'
    ]
  }
];


// Exponer global para el bootstrap
window.PRODUCTS = PRODUCTS;
