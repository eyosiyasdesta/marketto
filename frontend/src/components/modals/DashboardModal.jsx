import React, { useState, useEffect } from 'react';
import { useModal } from '../../context/ModalContext';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { orderApi } from '../../api/orderApi';

export default function DashboardModal() {
  const { activeModal, closeModal, openModal } = useModal();
  const { user, logout } = useAuth();
  const { openWishlist } = useWishlist();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (activeModal === 'dashboard') {
      orderApi
        .getMyOrders()
        .then((data) => setOrders(Array.isArray(data) ? data : []))
        .catch(() => setOrders([]));
    }
  }, [activeModal]);

  if (activeModal !== 'dashboard' || !user) return null;

  const totalSpent = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
  const formatPrice = (n) => '$' + Number(n || 0).toFixed(2);

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div
        className="modal auth-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '480px' }}
      >
        <button className="close-btn" onClick={closeModal} aria-label="Close">
          ✕
        </button>

        <h2>My Account</h2>
        <p className="subtitle">Welcome back, {user.name}</p>

        <div
          className="order-summary-box"
          style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '16px',
            marginTop: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
            <span style={{ color: '#64748b' }}>Name</span>
            <span style={{ fontWeight: 600 }}>{user.name}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
            <span style={{ color: '#64748b' }}>Email</span>
            <span style={{ fontWeight: 600 }}>{user.email}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
            <span style={{ color: '#64748b' }}>Total Orders</span>
            <span style={{ fontWeight: 600 }}>{orders.length}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: 700, borderTop: '1px solid #e2e8f0', paddingTop: '8px' }}>
            <span>Total Spent</span>
            <span style={{ color: '#2563eb' }}>{formatPrice(totalSpent)}</span>
          </div>
        </div>

        <button
          className="btn-primary full-width"
          style={{ marginTop: '16px' }}
          onClick={() => {
            closeModal();
            openModal('orders');
          }}
        >
          View Order History
        </button>

        <button
          className="btn-outline full-width"
          style={{ marginTop: '8px' }}
          onClick={() => {
            closeModal();
            openWishlist();
          }}
        >
          View Wishlist
        </button>

        <button
          className="btn-outline full-width"
          style={{ marginTop: '8px', color: '#dc2626', borderColor: '#fca5a5' }}
          onClick={() => {
            closeModal();
            logout();
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
