import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useModal } from '../../context/ModalContext';

export default function MobileMenu({ isOpen, onClose }) {
  const { user, isAuthenticated, openAuth, logout } = useAuth();
  const { openWishlist } = useWishlist();
  const { openCart } = useCart();
  const { openModal } = useModal();

  if (!isOpen) return null;

  const handleLinkClick = (cb) => {
    onClose();
    if (cb) cb();
  };

  return (
    <div className="mobile-menu" style={{ display: 'block' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px' }}>
        <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>
          ✕
        </button>
      </div>
      <div style={{ padding: '0 20px 20px' }}>
        <NavLink
          to="/"
          onClick={() => onClose()}
          style={{ display: 'block', padding: '12px 0', borderBottom: '1px solid #eee', fontWeight: 600 }}
        >
          Home
        </NavLink>
        <NavLink
          to="/products"
          onClick={() => onClose()}
          style={{ display: 'block', padding: '12px 0', borderBottom: '1px solid #eee', fontWeight: 600 }}
        >
          All Products
        </NavLink>
        <button
          onClick={() => handleLinkClick(openWishlist)}
          style={{ display: 'block', width: '100%', textAlign: 'left', padding: '12px 0', border: 'none', background: 'none', borderBottom: '1px solid #eee', fontWeight: 600, cursor: 'pointer' }}
        >
          Wishlist
        </button>
        <button
          onClick={() => handleLinkClick(openCart)}
          style={{ display: 'block', width: '100%', textAlign: 'left', padding: '12px 0', border: 'none', background: 'none', borderBottom: '1px solid #eee', fontWeight: 600, cursor: 'pointer' }}
        >
          Cart
        </button>

        {isAuthenticated ? (
          <>
            <button
              onClick={() => handleLinkClick(() => openModal('dashboard'))}
              style={{ display: 'block', width: '100%', textAlign: 'left', padding: '12px 0', border: 'none', background: 'none', borderBottom: '1px solid #eee', fontWeight: 600, cursor: 'pointer' }}
            >
              My Account ({user?.name})
            </button>
            <button
              onClick={() => handleLinkClick(() => openModal('orders'))}
              style={{ display: 'block', width: '100%', textAlign: 'left', padding: '12px 0', border: 'none', background: 'none', borderBottom: '1px solid #eee', fontWeight: 600, cursor: 'pointer' }}
            >
              Order History
            </button>
            <button
              onClick={() => handleLinkClick(logout)}
              style={{ display: 'block', width: '100%', textAlign: 'left', padding: '12px 0', border: 'none', background: 'none', borderBottom: '1px solid #eee', color: '#dc2626', fontWeight: 600, cursor: 'pointer' }}
            >
              Sign Out
            </button>
          </>
        ) : (
          <button
            onClick={() => handleLinkClick(() => openAuth('login'))}
            style={{ display: 'block', width: '100%', textAlign: 'left', padding: '12px 0', border: 'none', background: 'none', borderBottom: '1px solid #eee', color: '#2563eb', fontWeight: 600, cursor: 'pointer' }}
          >
            Sign In / Register
          </button>
        )}
      </div>
    </div>
  );
}
