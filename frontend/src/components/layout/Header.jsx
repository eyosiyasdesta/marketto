import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useModal } from '../../context/ModalContext';

export default function Header({ onToggleMobileMenu }) {
  const navigate = useNavigate();
  const { user, isAuthenticated, openAuth, logout } = useAuth();
  const { cartCount, openCart } = useCart();
  const { wishlistCount, openWishlist } = useWishlist();
  const { openModal } = useModal();

  const [searchQuery, setSearchQuery] = useState('');
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/products');
    }
  };

  return (
    <header className="site-header">
      <div className="header-row">
        {/* Logo */}
        <Link
          to="/"
          className="logo"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '1.2rem',
            color: '#0b1a2e',
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#7CBA3F"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: 'drop-shadow(0 0 8px rgba(124, 186, 63, 0.6))' }}
          >
            <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
          </svg>
          <span>Marketto</span>
        </Link>

        {/* Search Bar */}
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search for products, brands and more..."
            aria-label="Search products"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" aria-label="Search">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </form>

        {/* Header Actions */}
        <nav className="header-actions">
          {isAuthenticated ? (
            <div className="account-group" style={{ position: 'relative' }}>
              <button
                className="icon-link"
                onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                style={{ cursor: 'pointer', background: 'none', border: 'none' }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>Hi, {user?.name?.split(' ')[0] || 'User'}</span>
              </button>

              {accountDropdownOpen && (
                <div
                  className="account-dropdown"
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    border: '1px solid #e2e8f0',
                    padding: '8px 0',
                    minWidth: '170px',
                    zIndex: 300,
                  }}
                  onMouseLeave={() => setAccountDropdownOpen(false)}
                >
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setAccountDropdownOpen(false);
                      openModal('dashboard');
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 16px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    My Account
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setAccountDropdownOpen(false);
                      openModal('orders');
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 16px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Order History
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setAccountDropdownOpen(false);
                      openModal('addresses');
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 16px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Addresses
                  </button>
                  <hr style={{ margin: '6px 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setAccountDropdownOpen(false);
                      logout();
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 16px',
                      background: 'none',
                      border: 'none',
                      color: '#dc2626',
                      cursor: 'pointer',
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="account-group">
              <button className="icon-link" onClick={() => openAuth('login')}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>Sign In</span>
              </button>
              <span className="account-divider">|</span>
              <button className="text-link" onClick={() => openAuth('register')}>
                Create Account
              </button>
            </div>
          )}

          {/* Wishlist Button */}
          <button className="icon-link" onClick={openWishlist} aria-label="Wishlist">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
            </svg>
            <span className={`badge ${wishlistCount > 0 ? '' : 'hidden'}`}>
              {wishlistCount}
            </span>
          </button>

          {/* Cart Button */}
          <button className="icon-link" onClick={openCart} aria-label="Cart">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
            </svg>
            <span className="badge">{cartCount}</span>
          </button>

          {/* Mobile menu toggle */}
          <button
            className="mobile-menu-btn"
            onClick={onToggleMobileMenu}
            aria-label="Menu"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </nav>
      </div>
    </header>
  );
}
