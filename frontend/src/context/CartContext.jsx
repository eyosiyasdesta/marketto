import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartApi } from '../api/cartApi';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated, openAuth } = useAuth();
  const { showToast } = useToast();
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart([]);
      return;
    }
    try {
      setLoading(true);
      const data = await cartApi.getCart();
      setCart(data?.items || []);
    } catch {
      setCart([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const addToCart = async (productId, quantity = 1, variantId = null) => {
    if (!isAuthenticated) {
      openAuth('login');
      showToast('Please sign in to add items to your cart.', 'error');
      return false;
    }
    try {
      const data = await cartApi.addToCart({ productId, quantity, variantId });
      setCart(data?.items || []);
      showToast('Added to cart!');
      return true;
    } catch (err) {
      showToast(err.message || "Couldn't add to cart.", 'error');
      return false;
    }
  };

  const updateCartQty = async (cartItemId, newQty) => {
    if (newQty <= 0) {
      return removeCartItem(cartItemId);
    }
    try {
      const data = await cartApi.updateCartItem(cartItemId, newQty);
      setCart(data?.items || []);
    } catch (err) {
      showToast(err.message || "Couldn't update quantity.", 'error');
    }
  };

  const removeCartItem = async (cartItemId) => {
    try {
      const data = await cartApi.removeCartItem(cartItemId);
      setCart(data?.items || []);
      showToast('Item removed from cart.');
    } catch (err) {
      showToast(err.message || "Couldn't remove item.", 'error');
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);

  const cartSubtotal = cart.reduce((sum, item) => {
    const p = item.product;
    if (!p) return sum;
    const price = p.discountPrice != null ? Number(p.discountPrice) : Number(p.price || 0);
    return sum + price * (item.quantity || 1);
  }, 0);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartSubtotal,
        isCartOpen,
        openCart,
        closeCart,
        addToCart,
        updateCartQty,
        removeCartItem,
        loadCart,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
