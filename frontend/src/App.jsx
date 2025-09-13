import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import BottomNavbar from './components/BottomNavbar'
import LoadingSpinner from './components/LoadingSpinner'
import ReturnHomeButton from './components/ui/ReturnHomeButton'
import FloatingMenuButton from './components/ui/FloatingMenuButton'
import './styles/bottom-navbar.css'

// Function to clear any demo products from localStorage
const clearDemoProducts = () => {
  try {
    localStorage.removeItem('yega_demo_products');
    console.log('Demo products cleared from localStorage');
  } catch (error) {
    console.error('Error clearing demo products:', error);
  }
};

// Páginas públicas
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import VerifyOTP from './pages/VerifyOTP'
import Onboarding from './pages/Onboarding'
import ForgotPassword from './pages/ForgotPassword'

// Páginas por rol
// import ClienteDashboard from './pages/Cliente/Dashboard'
import TiendaDashboard from './pages/Tienda/Dashboard'
import RepartidorDashboard from './pages/Repartidor/Dashboard'
import AdminDashboard from './pages/Admin/Dashboard'

// Subrutas Cliente
import ClienteTiendas from './pages/Cliente/Tiendas'
import ClientePedidos from './pages/Cliente/Pedidos'
import ClienteSeguimiento from './pages/Cliente/Seguimiento'
import ClienteHistorial from './pages/Cliente/Historial'
import MyCart from './pages/Cliente/MyCart'
import PaymentMethod from './pages/Cliente/OldPaymentMethod'
import PaymentSuccess from './pages/Cliente/PaymentSuccess'

// Subrutas Tienda
import TiendaProductos from './pages/Tienda/Productos'
import TiendaPedidos from './pages/Tienda/Pedidos'
import TiendaInventario from './pages/Tienda/Inventario'
import TiendaEstadisticas from './pages/Tienda/Estadisticas'
import TiendaDireccion from './pages/Tienda/Direccion'

// Subrutas Repartidor
import RepartidorHistorial from './pages/Repartidor/Historial'
import RepartidorEstadisticas from './pages/Repartidor/Estadisticas'
import RepartidorVehiculo from './pages/Repartidor/Vehiculo'
import RepartidorPerfil from './pages/Repartidor/Perfil'
import RepartidorUbicacion from './pages/Repartidor/Ubicacion'

// Subrutas Admin
import AdminUsuarios from './pages/Admin/Usuarios'
import AdminTiendas from './pages/Admin/Tiendas'
import AdminRepartidores from './pages/Admin/Repartidores'
import AdminReportes from './pages/Admin/Reportes'
import TiendaPerfil from './pages/Tienda/Perfil'
import ClientePerfil from './pages/Cliente/Perfil'

// Componente de ruta protegida
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.rol)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

// Componente para redireccionar según el rol
const RoleBasedRedirect = () => {
  const { user, loading } = useAuth()
  const hasToken = !!localStorage.getItem('token')

  if (loading && hasToken) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  switch (user.rol) {
    case 'cliente':
      return <Navigate to="/cliente/tiendas" replace />
    case 'tienda':
      return <Navigate to="/tienda" replace />
    case 'repartidor':
      return <Navigate to="/repartidor" replace />
    case 'administrador':
      return <Navigate to="/admin" replace />
    default:
      return <Navigate to="/login" replace />
  }
}

// Rutas públicas que redirigen si ya está autenticado
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth()
  const hasToken = !!localStorage.getItem('token')

  if (loading && hasToken) {
    return <LoadingSpinner />
  }

  if (user) {
    return <Navigate to="/dashboard" replace />
  }
  return children
}

function AppShell() {
  const location = useLocation()
  const { user } = useAuth()
  const showNavbar = user?.rol === 'administrador' && location.pathname.startsWith('/admin')
  
  // Clear demo products when app loads
  useEffect(() => {
    clearDemoProducts();
  }, []);

  return (
      <div className="App d-flex flex-column min-vh-100">
        {/* <ReturnHomeButton /> */}
        {/* <FloatingMenuButton /> */}
        {showNavbar && <Navbar />}

        <main className="flex-grow-1">
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
            <Route path="/onboarding" element={<PublicRoute><Onboarding /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
            <Route path="/verify-otp" element={<PublicRoute><VerifyOTP /></PublicRoute>} />
            
            {/* Redirección basada en rol */}
            <Route path="/dashboard" element={<RoleBasedRedirect />} />
            
            {/* Rutas protegidas por rol */}
            {/* Ruta de inicio cliente */}
            <Route path="/cliente/tiendas" element={<ProtectedRoute allowedRoles={['cliente']}><ClienteTiendas /></ProtectedRoute>} />
            <Route path="/cliente/mycart" element={<ProtectedRoute allowedRoles={['cliente']}><MyCart /></ProtectedRoute>} />
            <Route path="/cliente/payment-method" element={<ProtectedRoute allowedRoles={['cliente']}><PaymentMethod /></ProtectedRoute>} />
            <Route path="/cliente/payment-success" element={<ProtectedRoute allowedRoles={['cliente']}><PaymentSuccess /></ProtectedRoute>} />
            <Route path="/cliente/pedidos" element={<ProtectedRoute allowedRoles={['cliente']}><ClientePedidos /></ProtectedRoute>} />
            <Route path="/cliente/seguimiento" element={<ProtectedRoute allowedRoles={['cliente']}><ClienteSeguimiento /></ProtectedRoute>} />
            <Route path="/cliente/historial" element={<ProtectedRoute allowedRoles={['cliente']}><ClienteHistorial /></ProtectedRoute>} />
            <Route path="/cliente/perfil" element={<ProtectedRoute allowedRoles={['cliente']}><ClientePerfil /></ProtectedRoute>} />
            
            {/* Ruta de inicio tienda */}
            <Route path="/tienda" element={<ProtectedRoute allowedRoles={['tienda']}><TiendaDashboard /></ProtectedRoute>} />
            <Route path="/tienda/productos" element={<ProtectedRoute allowedRoles={['tienda']}><TiendaProductos /></ProtectedRoute>} />
            <Route path="/tienda/pedidos" element={<ProtectedRoute allowedRoles={['tienda']}><TiendaPedidos /></ProtectedRoute>} />
            <Route path="/tienda/inventario" element={<ProtectedRoute allowedRoles={['tienda']}><TiendaInventario /></ProtectedRoute>} />
            <Route path="/tienda/estadisticas" element={<ProtectedRoute allowedRoles={['tienda']}><TiendaEstadisticas /></ProtectedRoute>} />
            <Route path="/tienda/direccion" element={<ProtectedRoute allowedRoles={['tienda']}><TiendaDireccion /></ProtectedRoute>} />
            <Route path="/tienda/perfil" element={<ProtectedRoute allowedRoles={['tienda']}><TiendaPerfil /></ProtectedRoute>} />
            
            {/* Ruta de inicio repartidor */}
            <Route path="/repartidor" element={<ProtectedRoute allowedRoles={['repartidor']}><RepartidorDashboard /></ProtectedRoute>} />
            <Route path="/repartidor/ubicacion" element={<ProtectedRoute allowedRoles={['repartidor']}><RepartidorUbicacion /></ProtectedRoute>} />
            <Route path="/repartidor/historial" element={<ProtectedRoute allowedRoles={['repartidor']}><RepartidorHistorial /></ProtectedRoute>} />
            <Route path="/repartidor/estadisticas" element={<ProtectedRoute allowedRoles={['repartidor']}><RepartidorEstadisticas /></ProtectedRoute>} />
            <Route path="/repartidor/vehiculo" element={<ProtectedRoute allowedRoles={['repartidor']}><RepartidorVehiculo /></ProtectedRoute>} />
            <Route path="/repartidor/perfil" element={<ProtectedRoute allowedRoles={['repartidor']}><RepartidorPerfil /></ProtectedRoute>} />
            
            {/* Ruta de inicio admin */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['administrador']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/usuarios" element={<ProtectedRoute allowedRoles={['administrador']}><AdminUsuarios /></ProtectedRoute>} />
            <Route path="/admin/tiendas" element={<ProtectedRoute allowedRoles={['administrador']}><AdminTiendas /></ProtectedRoute>} />
            <Route path="/admin/repartidores" element={<ProtectedRoute allowedRoles={['administrador']}><AdminRepartidores /></ProtectedRoute>} />
            <Route path="/admin/reportes" element={<ProtectedRoute allowedRoles={['administrador']}><AdminReportes /></ProtectedRoute>} />
            
            {/* Página de no autorizado */}
            <Route 
              path="/unauthorized" 
              element={
                <div className="container mt-5 text-center">
                  <h2>Acceso No Autorizado</h2>
                  <p>No tienes permisos para acceder a esta página.</p>
                </div>
              } 
            />
            
            {/* Página 404 */}
            <Route 
              path="*" 
              element={
                <div className="container mt-5 text-center">
                  <h2>Página No Encontrada</h2>
                  <p>La página que buscas no existe.</p>
                </div>
              } 
            />
          </Routes>
        </main>
        
        <BottomNavbar />
        {/* <Footer /> */}
      </div>
  )
}

function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  )
}

export default App
