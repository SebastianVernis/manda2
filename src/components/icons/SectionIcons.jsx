import React from 'react'

export const IconWrapper = ({ children, size = 18 }) => (
  <span style={{ width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
    {children}
  </span>
)

export const RestaurantIcon = ({ size = 18, color = '#C0C0C0' }) => (
  <IconWrapper size={size}>
    <svg viewBox="0 0 24 24" width={size} height={size} fill={color} aria-hidden>
      <path d="M4 3h2v7a1 1 0 0 0 2 0V3h2v7a3 3 0 0 1-6 0V3zm10 0h1a3 3 0 0 1 3 3v5h2v10h-2v-6h-2v6h-2V3z"/>
    </svg>
  </IconWrapper>
)

export const ShopIcon = ({ size = 18, color = '#C0C0C0' }) => (
  <IconWrapper size={size}>
    <svg viewBox="0 0 24 24" width={size} height={size} fill={color} aria-hidden>
      <path d="M3 4h18l-1.5 5H4.5L3 4zm1 7h16v9H4v-9zm3 2v5h2v-5H7zm6 0v5h2v-5h-2z"/>
    </svg>
  </IconWrapper>
)

export const PharmacyIcon = ({ size = 18, color = '#C0C0C0' }) => (
  <IconWrapper size={size}>
    <svg viewBox="0 0 24 24" width={size} height={size} fill={color} aria-hidden>
      <path d="M9 3h6v2h-2v3h3v2h-3v3h-2V10H8V8h3V5H9V3zm-5 9h16v9H4v-9z"/>
    </svg>
  </IconWrapper>
)

// Subcategorías sólidas
export const PizzaIcon = ({ size = 16, color = '#FFFFFF' }) => (
  <IconWrapper size={size}>
    <svg viewBox="0 0 24 24" width={size} height={size} fill={color} aria-hidden>
      <path d="M2 4c6-3 14-3 20 0l-10 18L2 4zm10 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM7 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
    </svg>
  </IconWrapper>
)

export const BurgerIcon = ({ size = 16, color = '#FFFFFF' }) => (
  <IconWrapper size={size}>
    <svg viewBox="0 0 24 24" width={size} height={size} fill={color} aria-hidden>
      <path d="M4 7c0-2.8 3.6-4 8-4s8 1.2 8 4H4zm-1 3h18a2 2 0 0 1 0 4H3a2 2 0 0 1 0-4zm1 6h16a2 2 0 0 1 0 4H4a2 2 0 0 1 0-4z"/>
    </svg>
  </IconWrapper>
)

export const SushiIcon = ({ size = 16, color = '#FFFFFF' }) => (
  <IconWrapper size={size}>
    <svg viewBox="0 0 24 24" width={size} height={size} fill={color} aria-hidden>
      <path d="M3 8c0-2.2 4.5-4 9-4s9 1.8 9 4-4.5 4-9 4-9-1.8-9-4zm0 5h18v6H3v-6z"/>
    </svg>
  </IconWrapper>
)

export const PastaIcon = ({ size = 16, color = '#FFFFFF' }) => (
  <IconWrapper size={size}>
    <svg viewBox="0 0 24 24" width={size} height={size} fill={color} aria-hidden>
      <path d="M2 11h20v2H2v-2zm2 4h16v2H4v-2zm2 4h12v2H6v-2zM5 7h14v2H5V7z"/>
    </svg>
  </IconWrapper>
)

export const BreakfastIcon = ({ size = 16, color = '#FFFFFF' }) => (
  <IconWrapper size={size}>
    <svg viewBox="0 0 24 24" width={size} height={size} fill={color} aria-hidden>
      <path d="M4 4h10v6H4V4zm12 0h4v4a2 2 0 0 1-2 2h-2V4zM4 12h16v8H4v-8z"/>
    </svg>
  </IconWrapper>
)

export const VeggieIcon = ({ size = 16, color = '#FFFFFF' }) => (
  <IconWrapper size={size}>
    <svg viewBox="0 0 24 24" width={size} height={size} fill={color} aria-hidden>
      <path d="M12 2c3 0 6 3 6 6 0 5-6 12-6 12S6 13 6 8c0-3 3-6 6-6zm0 3a3 3 0 1 0 .001 6.001A3 3 0 0 0 12 5z"/>
    </svg>
  </IconWrapper>
)

export const SectionIconMap = {
  restaurantes: RestaurantIcon,
  tiendas: ShopIcon,
  farmacia: PharmacyIcon,
}

export const SubcatIconMap = {
  Pizza: PizzaIcon,
  Hamburguesa: BurgerIcon,
  Sushi: SushiIcon,
  Pasta: PastaIcon,
  Desayuno: BreakfastIcon,
  Veggie: VeggieIcon,
  Kiosco: ShopIcon,
  Panadería: BreakfastIcon,
  Bebidas: SushiIcon,
  Snacks: BurgerIcon,
  Medicamentos: PharmacyIcon,
  Higiene: PharmacyIcon,
  Suplementos: PharmacyIcon,
}

// Filtros (cercanía, valorados, rápido)
export const LocationIcon = ({ size = 16, color = '#FFFFFF' }) => (
  <IconWrapper size={size}>
    <svg viewBox="0 0 24 24" width={size} height={size} fill={color} aria-hidden>
      <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
    </svg>
  </IconWrapper>
)

export const StarIcon = ({ size = 16, color = '#FFFFFF' }) => (
  <IconWrapper size={size}>
    <svg viewBox="0 0 24 24" width={size} height={size} fill={color} aria-hidden>
      <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
    </svg>
  </IconWrapper>
)

export const ClockIcon = ({ size = 16, color = '#FFFFFF' }) => (
  <IconWrapper size={size}>
    <svg viewBox="0 0 24 24" width={size} height={size} fill={color} aria-hidden>
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 11h5v-2h-4V6h-2v7z"/>
    </svg>
  </IconWrapper>
)
