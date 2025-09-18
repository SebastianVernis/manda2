import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ModernNavbar from '../modern/ModernNavbar'

// Mock de useAuth
vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(() => ({
    user: null,
    isAuthenticated: false,
    logout: vi.fn()
  }))
}))

// Mock de useCart
vi.mock('../../context/CartContext', () => ({
  useCart: vi.fn(() => ({
    items: []
  }))
}))

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('ModernNavbar', () => {
  it('renders navbar with logo', () => {
    renderWithRouter(<ModernNavbar />)
    
    const logo = screen.getByAltText('YEGA')
    expect(logo).toBeInTheDocument()
  })

  it('shows login and register buttons when not authenticated', () => {
    renderWithRouter(<ModernNavbar />)
    
    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument()
    expect(screen.getByText('Registrarse')).toBeInTheDocument()
  })

  it('applies correct Bootstrap classes', () => {
    const { container } = renderWithRouter(<ModernNavbar />)
    
    const navbar = container.querySelector('.bg-black\\/90')
    expect(navbar).toBeInTheDocument()
  })
})