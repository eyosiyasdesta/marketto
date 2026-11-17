import React, { useState } from 'react';
import { useModal } from '../../context/ModalContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { orderApi } from '../../api/orderApi';

export default function CheckoutModal() {
  const { activeModal, modalData, closeModal } = useModal();
  const { cart, cartSubtotal, loadCart } = useCart();
  const { user, isAuthenticated, openAuth } = useAuth();
  const { showToast } = useToast();

  const isBuyNow = modalData?.mode === 'buyNow';

  // State for fields
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  if (activeModal !== 'checkout') return null;

  if (!isAuthenticated) {
    closeModal();
    openAuth('login');
    showToast('Please sign in before checking out.', 'error');
    return null;
  }

  const formatPrice = (n) => '$' + Number(n || 0).toFixed(2);

  const buyNowProduct = modalData?.product;
  const buyNowQty = modalData?.quantity || 1;
  const buyNowSubtotal = buyNowProduct
    ? (buyNowProduct.discountPrice ?? buyNowProduct.price) * buyNowQty
    : 0;

  const total = isBuyNow ? buyNowSubtotal : cartSubtotal;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!name.trim() || !address.trim() || !city.trim()) {
      showToast('Please complete your name, shipping address, and city.', 'error');
      return;
    }

    const shippingAddress = `${address.trim()}, ${city.trim()}${zip ? ' ' + zip.trim() : ''}`;

    try {
      setLoading(true);
      let order;
      if (isBuyNow) {
        order = await orderApi.buyNow({
          productId: buyNowProduct.id,
          quantity: buyNowQty,
          shippingAddress,
        });
      } else {
        order = await orderApi.checkout({ shippingAddress });
        await loadCart();
      }
      setConfirmedOrder(order);
      showToast('Order placed successfully!');
    } catch (err) {
      showToast(err.message || 'Order failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setConfirmedOrder(null);
    closeModal();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal checkout-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}
      >
        <button className="close-btn" onClick={handleClose} aria-label="Close">
          ✕
        </button>

        {confirmedOrder ? (
          <div className="confirmation" style={{ textAlign: 'center', padding: '24px 0' }}>
            <div
              className="check-icon"
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#dcfce7',
                color: '#16a34a',
                fontSize: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              ✓
            </div>
            <h2>Order Confirmed!</h2>
            <p className="subtitle">
              Thanks, {name.split(' ')[0]} — your order is on its way.
            </p>

            <div
              className="confirmation-details"
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '16px',
                margin: '20px 0',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Order Number</span>
                <span className="order-number" style={{ fontWeight: 700 }}>
                  #{confirmedOrder.id}
                </span>
              </div>
              {confirmedOrder.items?.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span>
                    {item.product?.name} × {item.quantity}
                  </span>
                  <span>{formatPrice(item.priceAtPurchase * item.quantity)}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '8px' }}>
                <span style={{ color: '#64748b' }}>Delivery Address</span>
                <span style={{ fontWeight: 600 }}>{confirmedOrder.shippingAddress}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                <span>Total Paid</span>
                <span>{formatPrice(confirmedOrder.totalAmount)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748b' }}>
                <span>Estimated Delivery</span>
                <span>3–5 business days</span>
              </div>
            </div>

            <button className="btn-primary full-width" onClick={handleClose}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <div>
            <h2>Checkout</h2>
            <p className="subtitle">Complete your shipping &amp; order information</p>

            {/* Order Items Preview */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '12px 16px',
                margin: '16px 0',
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: '8px' }}>Order Summary</div>
              {isBuyNow ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span>
                    {buyNowProduct.name} × {buyNowQty}
                  </span>
                  <span>{formatPrice(buyNowSubtotal)}</span>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '4px' }}
                  >
                    <span>
                      {item.product?.name} × {item.quantity}
                    </span>
                    <span>
                      {formatPrice(
                        (item.product?.discountPrice ?? item.product?.price ?? 0) * item.quantity
                      )}
                    </span>
                  </div>
                ))
              )}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: 700,
                  marginTop: '10px',
                  borderTop: '1px solid #e2e8f0',
                  paddingTop: '8px',
                }}
              >
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <form onSubmit={handlePlaceOrder}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label>Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label>Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ marginTop: '12px' }}>
                <label>Street Address</label>
                <input
                  type="text"
                  placeholder="123 Main St, Apt 4B"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginTop: '12px' }}>
                <div>
                  <label>City</label>
                  <input
                    type="text"
                    placeholder="New York"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div>
                  <label>Postal Code</label>
                  <input
                    type="text"
                    placeholder="10001"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ marginTop: '16px' }}>
                <label>Payment Method</label>
                <div style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: '#f8fafc', fontSize: '14px', color: '#64748b' }}>
                  💳 Card ending in 4242 (Demo Simulation)
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary full-width"
                style={{ marginTop: '20px' }}
                disabled={loading}
              >
                {loading ? 'Placing Order...' : `Pay ${formatPrice(total)} & Complete Order`}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
