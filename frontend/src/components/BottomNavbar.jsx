import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaShoppingBag, FaMotorcycle, FaStore, FaUser, FaShoppingCart, FaChartBar, FaHistory, FaClipboardList } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const BottomNavbar = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  if (!user) return null;
  
  const getNavItems = () => {
    const items = [];
    
    switch (user.rol) {
      case 'cliente':
        items.push(
          { to: '/cliente/tiendas', icon: <FaStore />, label: 'Tiendas' },
          { to: '/cliente/mycart', icon: <FaShoppingCart />, label: 'Carrito' },
          { to: '/dashboard', icon: <FaHome />, label: 'Home', isHome: true },
          { to: '/cliente/pedidos', icon: <FaClipboardList />, label: 'Pedidos' },
          { to: '/cliente/perfil', icon: <FaUser />, label: 'Perfil' }
        );
        break;
        
      case 'tienda':
        items.push(
          { to: '/tienda/productos', icon: <FaStore />, label: 'Productos' },
          { to: '/tienda/pedidos', icon: <FaClipboardList />, label: 'Pedidos' },
          { to: '/dashboard', icon: <FaHome />, label: 'Home', isHome: true },
          { to: '/tienda/estadisticas', icon: <FaChartBar />, label: 'Stats' },
          { to: '/tienda/perfil', icon: <FaUser />, label: 'Perfil' }
        );
        break;
        
      case 'repartidor':
        items.push(
          { to: '/repartidor/historial', icon: <FaHistory />, label: 'Historial' },
          { to: '/dashboard', icon: <FaHome />, label: 'Home', isHome: true },
          { to: '/repartidor/perfil', icon: <FaUser />, label: 'Perfil' }
        );
        break;
        
      case 'administrador':
        items.push(
          { to: '/admin/usuarios', icon: <FaUser />, label: 'Usuarios' },
          { to: '/admin/tiendas', icon: <FaStore />, label: 'Tiendas' },
          { to: '/dashboard', icon: <FaHome />, label: 'Home', isHome: true },
          { to: '/admin/repartidores', icon: <FaMotorcycle />, label: 'Repartidores' },
          { to: '/admin/reportes', icon: <FaChartBar />, label: 'Reportes' }
        );
        break;
        
      default:
        return null;
    }
    
    return items;
  };
  
  const navItems = getNavItems();
  if (!navItems) return null;
  
  return (
    <div className="bottom-navbar fixed-bottom bg-dark">
      <div className="d-flex justify-content-around align-items-center py-2">
        {navItems.map((item, index) => (
          <Link 
            key={index} 
            to={item.to} 
            className={`text-center nav-item ${location.pathname === item.to ? 'active' : ''} ${item.isHome ? 'home-button' : ''}`}
          >
            <div className={`nav-icon ${item.isHome ? 'home-icon' : ''}`}>
              {item.icon}
            </div>
            <div className="nav-label small">{item.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BottomNavbar;