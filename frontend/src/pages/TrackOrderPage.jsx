import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { orderApi } from '../api/orderApi';

export default function TrackOrderPage() {
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleBackToMarketto = (e) => {
    e.preventDefault();
    if (window.opener && !window.opener.closed) {
      window.close();
    } else {
      navigate('/');
    }
  };

  const handleTrack = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    const cleanId = orderId.replace('#', '').trim();
    if (!cleanId) {
      setError('Please enter a valid order number.');
      return;
    }

    try {
      setLoading(true);
      const orders = await orderApi.getMyOrders();
      const match = Array.isArray(orders) ? orders.find((o) => String(o.id) === cleanId) : null;
      if (match) {
        setResult(match);
      } else {
        setError(`No active order found with ID #${cleanId}. If you recently placed an order, please sign in to view it in Order History.`);
      }
    } catch {
      setError('Unable to fetch order status. Please verify your connection or sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="target-page-container" style={{ minHeight: '80vh', backgroundColor: '#f8fafc', padding: '32px 16px' }}>
      {/* Target Page Top Navigation Bar */}
      <div
        style={{
          maxWidth: '780px',
          margin: '0 auto 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#fff',
          padding: '16px 24px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}
      >
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            fontWeight: 800,
            fontSize: '1.25rem',
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
          >
            <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
          </svg>
          <span>Marketto</span>
        </Link>

        <button
          onClick={handleBackToMarketto}
          className="btn-outline"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '14px',
            padding: '8px 16px',
          }}
        >
          ← Back to Marketto
        </button>
      </div>

      {/* Main Track Order Card */}
      <div
        style={{
          maxWidth: '780px',
          margin: '0 auto',
          backgroundColor: '#fff',
          borderRadius: '16px',
          padding: '36px 32px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
        }}
      >
        <span
          style={{
            backgroundColor: '#eff6ff',
            color: '#2563eb',
            padding: '4px 12px',
            borderRadius: '999px',
            fontSize: '12px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Live Tracking
        </span>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', margin: '12px 0 8px' }}>
          Track Your Order
        </h1>
        <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '28px' }}>
          Enter your order number from your confirmation email or order history to view real-time delivery status.
        </p>

        <form onSubmit={handleTrack} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="e.g. 1042 or #1042"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            required
            style={{
              flex: '1',
              minWidth: '220px',
              padding: '12px 16px',
              border: '1.5px solid #cbd5e1',
              borderRadius: '8px',
              fontSize: '15px',
            }}
          />
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ padding: '12px 24px', fontSize: '15px', fontWeight: 600 }}
          >
            {loading ? 'Searching...' : 'Track Package'}
          </button>
        </form>

        {error && (
          <div
            style={{
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              padding: '14px 16px',
              marginTop: '20px',
              fontSize: '14px',
            }}
          >
            {error}
          </div>
        )}

        {result && (
          <div
            style={{
              marginTop: '32px',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '24px',
              backgroundColor: '#f8fafc',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>Order #{result.id}</h3>
                <span style={{ fontSize: '13px', color: '#64748b' }}>
                  Placed on {result.createdAt ? new Date(result.createdAt).toLocaleDateString() : 'Recent'}
                </span>
              </div>
              <span
                style={{
                  backgroundColor: '#dcfce7',
                  color: '#16a34a',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  fontSize: '13px',
                  fontWeight: 700,
                }}
              >
                {result.status || 'CONFIRMED'}
              </span>
            </div>

            {/* Tracking Progress Steps */}
            <div style={{ margin: '24px 0', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', textAlign: 'center' }}>
              {['Order Placed', 'Processing', 'In Transit', 'Delivered'].map((step, idx) => (
                <div key={step}>
                  <div
                    style={{
                      height: '6px',
                      backgroundColor: idx <= 1 ? '#16a34a' : '#cbd5e1',
                      borderRadius: '4px',
                      marginBottom: '8px',
                    }}
                  />
                  <span style={{ fontSize: '12px', fontWeight: idx <= 1 ? 700 : 500, color: idx <= 1 ? '#0f172a' : '#94a3b8' }}>
                    {step}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', marginTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                <span style={{ color: '#64748b' }}>Shipping Address</span>
                <span style={{ fontWeight: 600 }}>{result.shippingAddress}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                <span style={{ color: '#64748b' }}>Estimated Arrival</span>
                <span style={{ fontWeight: 600, color: '#2563eb' }}>3–5 business days</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: 700, borderTop: '1px solid #e2e8f0', paddingTop: '12px', marginTop: '12px' }}>
                <span>Total Amount</span>
                <span>${Number(result.totalAmount || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        <div style={{ marginTop: '36px', borderTop: '1px solid #f1f5f9', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: '#64748b' }}>Need further assistance with your shipment?</span>
          <Link to="/contact" style={{ color: '#2563eb', fontWeight: 600, fontSize: '14px' }}>
            Contact Support →
          </Link>
        </div>
      </div>
    </div>
  );
}
