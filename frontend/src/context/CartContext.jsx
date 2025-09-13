import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import api from '../services/apiClient'

const CartContext = createContext(null)

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

// Obtiene el ID de la tienda de un producto o item de carrito
const getStoreId = (p) => p?.tiendaId?._id ?? p?.tienda?._id ?? p?.tiendaId ?? p?.tienda ?? null;

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem('yega_cart')
      if (!raw) return []
      
      const parsed = JSON.parse(raw)
      // Migrar formato antiguo a nuevo formato
      const migrated = parsed.map(item => {
        if (item.producto && item.cantidad) {
          return { product: item.producto, quantity: item.cantidad, tiendaId: item.tiendaId }
        }
        return item
      })
      
      // Validar que todos los items tienen la estructura correcta
      const validated = migrated.filter(item => item.product && typeof item.quantity === 'number')
      return validated
    } catch {
      return []
    }
  })
  
  // Refresh product data on cart load and periodically
  const refreshCartProducts = useCallback(async () => {
    if (items.length === 0) return;
    
    try {
      // Get the store ID from the first item
      const currentStoreId = getStoreId(items[0]);
      if (!currentStoreId) return;
      
      // Fetch latest products from this store
      const response = await api.get(`/products?tiendaId=${currentStoreId}`);
      const latestProducts = response.data?.productos || [];
      
      if (latestProducts.length === 0) return;
      
      // Update cart items with latest product data
      setItems(prevItems => 
        prevItems.map(item => {
          const updatedProduct = latestProducts.find(p => p._id === item.product._id);
          if (updatedProduct) {
            return { ...item, product: updatedProduct };
          }
          return item;
        })
      );
    } catch (error) {
      console.warn('Failed to refresh cart products:', error);
    }
  }, [items]);

  // Refresh products when cart loads
  useEffect(() => {
    if (items.length > 0) {
      refreshCartProducts();
    }
  }, []);
  
  // Save cart to localStorage when it changes
  useEffect(() => {
    try { localStorage.setItem('yega_cart', JSON.stringify(items)) } catch {}
  }, [items])

  const storeId = useMemo(() => items.length ? getStoreId(items[0]) : null, [items])

  const addItem = (product, quantity = 1) => {
    const p = product
    const idTienda = getStoreId(p)
    if (!idTienda) return

    if (storeId && storeId !== idTienda) {
      // Resetear carrito si cambia de tienda
      setItems([{ product: p, quantity, tiendaId: idTienda }])
      return
    }

    setItems(prev => {
      const idx = prev.findIndex(it => it.product._id === p._id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity }
        return next
      }
      return [...prev, { product: p, quantity, tiendaId: idTienda }]
    })
  }

  const removeItem = (productId) => {
    setItems(prev => prev.filter(it => it.product._id !== productId))
  }

  const clear = () => setItems([])

  const subtotal = useMemo(() => 
    items.reduce((sum, it) => {
      if (!it.product || typeof it.quantity !== 'number' || typeof it.product.precio !== 'number') {
        return sum
      }
      return sum + (it.product.precio * it.quantity)
    }, 0), [items]
  )

  const updateQuantity = (productId, newQuantity) => {
    setItems(prev => prev.map(it => 
      it.product._id === productId 
        ? { ...it, quantity: newQuantity }
        : it
    ))
  }

  const clearCart = () => setItems([])
  
  // Make refreshCartProducts available to components
  const refreshCart = useCallback(() => {
    refreshCartProducts();
  }, [refreshCartProducts]);

  const value = { 
    items, 
    addItem, 
    removeItem, 
    updateQuantity, 
    clearCart, 
    clear: clearCart, 
    subtotal, 
    storeId,
    refreshCart
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

