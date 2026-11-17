import React from 'react';
import { Link } from 'react-router-dom';
import { useModal } from '../../context/ModalContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';

export default function Footer() {
  const { openModal } = useModal();
  const { openWishlist } = useWishlist();
  const { isAuthenticated, openAuth } = useAuth();

  const handleAccountAction = (action) => {
    if (!isAuthenticated) {
      openAuth('login');
      return;
    }
    if (action === 'wishlist') {
      openWishlist();
    } else {
      openModal(action);
    }
  };

  return (
    <footer className="site-footer">
      <div className="footer-grid">
        {/* Brand */}
        <div className="footer-brand">
          <Link
            to="/"
            className="logo"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#7CBA3F"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ filter: 'drop-shadow(0 0 6px rgba(124, 186, 63, 0.6))' }}
            >
              <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
            </svg>
            <span>Marketto</span>
          </Link>
          <p>
            Your premium online shopping destination for quality products at
            unbeatable prices.
          </p>
        </div>

        {/* About Us (dedicated target pages) */}
        <div className="footer-col">
          <h4>About Us</h4>
          <a href="https://eyosiyas.page.gd/?i=1" target="_blank" rel="noopener noreferrer">
            Our Story ↗
          </a>
          <Link to="/contact" target="_blank" rel="noopener noreferrer">
            Contact ↗
          </Link>
          <Link to="/store-locations" target="_blank" rel="noopener noreferrer">
            Store Locations ↗
          </Link>
          <Link to="/careers" target="_blank" rel="noopener noreferrer">
            Careers ↗
          </Link>
        </div>

        {/* Help & FAQs (dedicated target pages) */}
        <div className="footer-col">
          <h4>Help &amp; FAQs</h4>
          <Link to="/faqs" target="_blank" rel="noopener noreferrer">
            FAQs ↗
          </Link>
          <Link to="/returns-policy" target="_blank" rel="noopener noreferrer">
            Returns Policy ↗
          </Link>
          <Link to="/shipping-info" target="_blank" rel="noopener noreferrer">
            Shipping Info ↗
          </Link>
          <Link to="/track-order" target="_blank" rel="noopener noreferrer">
            Track Order ↗
          </Link>
        </div>

        {/* My Account */}
        <div className="footer-col">
          <h4>My Account</h4>
          <button
            className="text-footer-link"
            onClick={() => handleAccountAction('dashboard')}
          >
            Dashboard
          </button>
          <button
            className="text-footer-link"
            onClick={() => handleAccountAction('orders')}
          >
            Order History
          </button>
          <button
            className="text-footer-link"
            onClick={() => handleAccountAction('wishlist')}
          >
            Wishlist
          </button>
          <button
            className="text-footer-link"
            onClick={() => handleAccountAction('addresses')}
          >
            Addresses
          </button>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 Marketto. All rights reserved.</span>
        <div className="footer-legal">
          <Link to="/terms" target="_blank" rel="noopener noreferrer">
            Terms of Service
          </Link>
          <Link to="/privacy" target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </Link>
          <a
            href="https://www.linkedin.com/in/eyosiyas-desta-73b593383/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            aria-label="LinkedIn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
          <a
            href="https://github.com/eyosiyasdesta"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            aria-label="GitHub"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.15 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.62.24 2.85.12 3.15.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
