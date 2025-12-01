// Configuración de secciones principales y subcategorías visibles
// Estas secciones controlan qué tiendas y productos se muestran

export const SECTIONS = [
  {
    id: 'restaurantes',
    label: 'Restaurantes',
    // Se mapea a la categoría de productos del backend
    categoria: 'comida',
    subcategories: [
      'Pizza',
      'Hamburguesa',
      'Sushi',
      'Pasta',
      'Desayuno',
      'Veggie',
    ],
  },
  {
    id: 'tiendas',
    label: 'Tiendas',
    categoria: 'snack',
    subcategories: ['Kiosco', 'Panadería', 'Bebidas', 'Snacks'],
  },
  {
    id: 'farmacia',
    label: 'Farmacia',
    categoria: 'otro', // usar tags en el futuro
    subcategories: ['Medicamentos', 'Higiene', 'Suplementos'],
  },
]

