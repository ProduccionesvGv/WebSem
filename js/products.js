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



// Productos de interior (placeholders, cámbialos luego)
const PRODUCTS_INDOOR = [
  {
  id: 'dealer-deal-xxl',
  title: 'Dealer Deal XXL',
  subtitle: 'Autoflorecientes',
  price_ars: 19500,
  tags: ['pack','indoor'],
  stock: 'en-stock',
  notas: 'Pack con cuatro genéticas destacadas.',
  sabor: '',
  rendimiento: '',
  thc: '',
  floracion: '',
  genetica: '',
  banco: '',
  images: ['img/dealer.jpg','img/FOTO1.png','img/FOTO2.png','img/FOTO3.jpg','img/FOTO4.png'],
  variants: [
    {
      name: 'Critical + 2',
      genetica: 'CRITICAL +2',
      satividad: '40%',
      thc: '20%',
      produccion_int: '300-450 gr × m²',
      produccion_ext: '100-300 gr × planta',
      ciclo_completo: '55 días',
      efecto: 'Relajante, potente de larga duración',
      sabor: 'Dulce, Limón, Cítricos'
    },
    {
      name: 'Black Dom',
      genetica: 'BLACK DOM',
      satividad: '20%',
      thc: '18%',
      produccion_int: '200-400 gr × m²',
      produccion_ext: '50-450 gr × planta',
      ciclo_completo: '50-55 días',
      efecto: 'Relajante, fuerte',
      sabor: 'Hachís, Afgano, Dulce, Pino'
    },
    {
      name: 'Moby - D',
      genetica: 'MOBY-D',
      satividad: '80%',
      thc: '18%',
      produccion_int: '300-500 gr × m²',
      produccion_ext: '60-250 gr × planta',
      ciclo_completo: '75 días',
      efecto: 'Euforia, psicodelia, energizante',
      sabor: 'Cítrico, Pino, Haze, Madera'
    },
    {
      name: 'Northern',
      genetica: 'NORTHERN',
      satividad: '20%',
      thc: '18%',
      produccion_int: '250-450 gr × m²',
      produccion_ext: '60-350 gr × planta',
      ciclo_completo: '50-55 días',
      efecto: 'Narcótico, sedante',
      sabor: 'Dulce, Tierra'
    }
  ]
},
  {
    id: 'indo-beta',
    title: 'Indoor Beta',
    subtitle: 'Feminizada Selecta',
    price_ars: 20500,
    tags: ['indoor','resina'],
    stock: 'en-stock',
    notas: 'Alta producción de resina, aromas intensos.',
    sabor: 'Floral, Pino',
    rendimiento: 'Alto',
    thc: '19-22%',
    floracion: '8-10 semanas',
    genetica: 'Cruce Selecto',
    banco: 'Mamua Seeds',
    images: ['img/template-1.jpg','img/template-2.jpg','img/template-hero.jpg']
  },
  {
    id: 'indo-gamma',
    title: 'Indoor Gamma',
    subtitle: 'Feminizada Híbrida',
    price_ars: 21500,
    tags: ['indoor','rápida'],
    stock: 'en-stock',
    notas: 'Ciclo rápido con estructura compacta.',
    sabor: 'Dulce, Caramelo',
    rendimiento: 'Medio',
    thc: '17-20%',
    floracion: '7-8 semanas',
    genetica: 'Híbrido',
    banco: 'Mamua Seeds',
    images: ['img/template-2.jpg','img/template-hero.jpg','img/template-1.jpg']
  }
];
window.PRODUCTS_INDOOR = PRODUCTS_INDOOR;
