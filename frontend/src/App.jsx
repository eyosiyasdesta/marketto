import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Providers
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';
import { ModalProvider } from './context/ModalContext';

// Layout
import TopBanner from './components/layout/TopBanner';
import Header from './components/layout/Header';
import CategoryNav from './components/layout/CategoryNav';
import Footer from './components/layout/Footer';
import MobileMenu from './components/layout/MobileMenu';

// Modals & Drawers
import AuthModal from './components/modals/AuthModal';
import CartDrawer from './components/modals/CartDrawer';
import WishlistDrawer from './components/modals/WishlistDrawer';
import ProductDetailModal from './components/modals/ProductDetailModal';
import CheckoutModal from './components/modals/CheckoutModal';
import OrdersModal from './components/modals/OrdersModal';
import DashboardModal from './components/modals/DashboardModal';
import AddressesModal from './components/modals/AddressesModal';

// Pages
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import TrackOrderPage from './pages/TrackOrderPage';
import InfoPage from './pages/InfoPage';

function MainLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="app-container">
      <TopBanner />
      <Header onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />
      <CategoryNav />
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<CatalogPage />} />
        <Route path="/track-order" element={<TrackOrderPage />} />
        <Route path="/contact" element={<InfoPage />} />
        <Route path="/faqs" element={<InfoPage />} />
        <Route path="/store-locations" element={<InfoPage />} />
        <Route path="/careers" element={<InfoPage />} />
        <Route path="/returns-policy" element={<InfoPage />} />
        <Route path="/shipping-info" element={<InfoPage />} />
        <Route path="/terms" element={<InfoPage />} />
        <Route path="/privacy" element={<InfoPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>

      <Footer />

      {/* Global Modals & Drawers */}
      <AuthModal />
      <CartDrawer />
      <WishlistDrawer />
      <ProductDetailModal />
      <CheckoutModal />
      <OrdersModal />
      <DashboardModal />
      <AddressesModal />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <ModalProvider>
              <Router>
                <MainLayout />
              </Router>
            </ModalProvider>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
