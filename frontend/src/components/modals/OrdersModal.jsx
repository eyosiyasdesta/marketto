import React, { useState, useEffect } from 'react';
import { useModal } from '../../context/ModalContext';
import { orderApi } from '../../api/orderApi';

export default function OrdersModal() {
  const { activeModal, closeModal } = useModal();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeModal === 'orders') {
      setLoading(true);
      orderApi
        .getMyOrders()
        .then((data) => setOrders(Array.isArray(data) ? data : []))
        .catch(() => setOrders([]))
        .finally(() => setLoading(false));
    }
  }, [activeModal]);

  if (activeModal !== 'orders') return null;

  const formatPrice = (n) => '$' + Number(n || 0).toFixed(2);

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div
        className="modal auth-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '600px', maxHeight: '85vh', overflowY: 'auto' }}
      >
        <button className="close-btn" onClick={closeModal} aria-label="Close">
          ✕
        </button>

        <h2>Order History</h2>
        <p className="subtitle">Track and review your past orders</p>

        {loading ? (
          <p style={{ textAlign: 'center', padding: '24px 0', color: '#64748b' }}>
            Loading orders...
          </p>
        ) : orders.length === 0 ? (
          <p className="empty-state" style={{ textAlign: 'center', padding: '32px 0', color: '#64748b' }}>
            You haven't placed any orders yet.
          </p>
        ) : (
          <div className="order-history-list" style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {orders.map((o) => (
              <div
                key={o.id}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '16px',
                  backgroundColor: '#f8fafc',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                  <span>Order #{o.id}</span>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      backgroundColor: '#dcfce7',
                      color: '#16a34a',
                    }}
                  >
                    {o.status || 'CONFIRMED'}
                  </span>
                </div>
                <div style={{ color: '#888', fontSize: '13px', margin: '4px 0 10px' }}>
                  {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'Recent'}
                </div>
                <div style={{ borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '8px 0', margin: '8px 0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {o.items?.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                      <span>
                        {item.product?.name} × {item.quantity}
                      </span>
                      <span>{formatPrice(item.priceAtPurchase * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, marginTop: '4px' }}>
                  <span>Total</span>
                  <span>{formatPrice(o.totalAmount)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
