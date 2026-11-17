import React from 'react';
import { useCart } from '../../context/CartContext';
import { useModal } from '../../context/ModalContext';

export default function CartDrawer() {
  const { cart, isCartOpen, closeCart, cartSubtotal, updateCartQty, removeCartItem } = useCart();
  const { openModal } = useModal();

  if (!isCartOpen) return null;

  const formatPrice = (n) => '$' + Number(n || 0).toFixed(2);

  const handleCheckout = () => {
    closeCart();
    openModal('checkout', { mode: 'cart', items: cart });
  };

  return (
    <>
      <div className="overlay" onClick={closeCart} style={{ display: 'block' }}></div>
      <div className="drawer" style={{ display: 'flex', flexDirection: 'column', right: 0 }}>
        <div className="drawer-header">
          <h3>
            Shopping Cart <span>({cart.length})</span>
          </h3>
          <button className="close-btn" onClick={closeCart} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="cart-items" style={{ flex: 1, overflowY: 'auto' }}>
          {cart.length === 0 ? (
            <p className="empty-state" style={{ padding: '32px 16px', textAlign: 'center', color: '#64748b' }}>
              Your cart is empty.
            </p>
          ) : (
            cart.map((item) => {
              const p = item.product;
              const unitPrice = p?.discountPrice ?? p?.price ?? 0;
              const variantText = [item.variant?.color, item.variant?.size].filter(Boolean).join(' / ');

              return (
                <div key={item.id} className="cart-item">
                  <img
                    src={p?.imageUrl || 'https://loremflickr.com/500/500/product'}
                    alt={p?.name || 'Product'}
                    className="cart-thumb"
                    onError={(e) => {
                      e.target.src = 'https://loremflickr.com/500/500/product';
                    }}
                  />
                  <div className="cart-info" style={{ flex: 1 }}>
                    <div className="cart-name" style={{ fontWeight: 600, fontSize: '14px' }}>
                      {p?.name}
                    </div>
                    {variantText && (
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                        {variantText}
                      </div>
                    )}
                    <div className="cart-price" style={{ color: '#2563eb', fontWeight: 600, marginTop: '4px' }}>
                      {formatPrice(unitPrice)}
                    </div>
                    <div className="cart-qty-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                      <button
                        className="qty-btn"
                        onClick={() => updateCartQty(item.id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: 600 }}>
                        {item.quantity}
                      </span>
                      <button
                        className="qty-btn"
                        onClick={() => updateCartQty(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    className="cart-remove-btn"
                    onClick={() => removeCartItem(item.id)}
                    aria-label="Remove item"
                    style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                  >
                    🗑️
                  </button>
                </div>
              );
            })
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="subtotal-row">
              <span>Subtotal</span>
              <span id="cartSubtotal">{formatPrice(cartSubtotal)}</span>
            </div>
            <p className="ship-note">Shipping and taxes calculated at checkout</p>
            <button className="btn-primary full-width" onClick={handleCheckout}>
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
