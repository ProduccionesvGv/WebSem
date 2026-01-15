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
notas: "Cuatro variantes disponibles en este pack.",
sabor: "Dulce, limón, cítricos",
rendimiento: "INT: 300–450 gr × m² / EXT: 100–300 gr × planta",
thc: "20%",
floracion: "55 días",
genetica: "CRITICAL +2",
banco: "BSF",
  images: ['img/dealer.jpg','img/FOTO1.png','img/FOTO2.png','img/FOTO3.jpg','img/FOTO4.png'],
  variants: [
      {
name: "Critical +2",
genetica: "CRITICAL +2",
satividad: "40%",
thc: "20%",
produccion_int: "300-450 Gr × m2",
produccion_ext: "100-300 Gr × Planta",
ciclo_completo: "55 Días",
efecto: "Relajante, Potente de larga Duración",
sabor: "Dulce, Limón, Cítrico"
      ,
      cantidad: "x3 Semillas"
    },
      {
        name: "Black Dom",
        genetica: "BLACK DOM",
        satividad: "20%",
        thc: "18%",
        produccion_int: "200-400 gr × m²",
        produccion_ext: "50-450 gr × planta",
        ciclo_completo: "50-55 días",
        efecto: "Relajante, fuerte",
        sabor: "Hachís, afgano, dulce, pino"
      ,
      cantidad: "x3 Semillas"
    },
      {
        name: "Moby D",
        genetica: "MOBY-D",
        satividad: "80%",
        thc: "18%",
        produccion_int: "300-500 gr × m²",
        produccion_ext: "60-250 gr × planta",
        ciclo_completo: "75 días",
        efecto: "Euforia, psicodelia, energizante",
        sabor: "Cítrico, pino, haze, madera"
      ,
      cantidad: "x3 Semillas"
    },
      {
        name: "Northeren",
        genetica: "NORTHERN",
        satividad: "20%",
        thc: "18%",
        produccion_int: "250-450 gr × m²",
        produccion_ext: "60-350 gr × planta",
        ciclo_completo: "50-55 días",
        efecto: "Narcótico, sedante",
        sabor: "Dulce, tierra"
      ,
      cantidad: "x3 Semillas"
    }
    ]
},
  {
    id: 'indo-beta',
    title: 'Psycho XXL',
    subtitle: 'Autoflorecientes',
    price_ars: 20500,
    tags: ['indoor','resina'],
    stock: 'en-stock',
    notas: 'Alta producción de resina, aromas intensos.',
    sabor: 'Floral, Pino',
    rendimiento: 'Alto',
    thc: '19-22%',
    floracion: '8-10 semanas',
    genetica: 'Cruce Selecto',
    banco: 'BSF',
    images: ['img/Psycho.jpeg','img/1amnesia.png','img/2ak.png','img/03LemonHaze.png','img/04chesse.png','img/Psycho2.jpg']
  ,
  variants: [
  {
    name: "Amnesia XXL",
    genetica: "Amnesia Auto",
    satividad: "70% Sativa",
    thc: "20-22%",
    produccion_int: "450-550 gr × m²",
    produccion_ext: "80-200 gr × planta",
    ciclo_completo: "70-80 días",
    efecto: "Eufórico, enérgico, creativo",
    sabor: "Cítrico, incienso",
    cantidad: "x3 Semillas"
  },
  {
    name: "AK XXL",
    genetica: "AK Auto",
    satividad: "60% Sativa",
    thc: "18-21%",
    produccion_int: "400-500 gr × m²",
    produccion_ext: "70-180 gr × planta",
    ciclo_completo: "65-75 días",
    efecto: "Estímulo y claridad mental",
    sabor: "Especiado, terroso",
    cantidad: "x3 Semillas"
  },
  {
    name: "Lemon Haze XXL",
    genetica: "Lemon Haze Auto",
    satividad: "80% Sativa",
    thc: "19-22%",
    produccion_int: "450-600 gr × m²",
    produccion_ext: "90-220 gr × planta",
    ciclo_completo: "70-80 días",
    efecto: "Energético y social",
    sabor: "Limón, cítrico",
    cantidad: "x3 Semillas"
  },
  {
    name: "Cheese XXL",
    genetica: "Cheese Auto",
    satividad: "50% Sativa",
    thc: "17-20%",
    produccion_int: "400-500 gr × m²",
    produccion_ext: "70-180 gr × planta",
    ciclo_completo: "65-75 días",
    efecto: "Relajante, feliz",
    sabor: "Queso, terroso",
    cantidad: "x3 Semillas"
  }
]
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
