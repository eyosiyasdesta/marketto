import React, { useState, useEffect } from 'react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { productApi } from '../../api/productApi';

export default function WishlistDrawer() {
  const { wishlist, isWishlistOpen, closeWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (isWishlistOpen && wishlist.length > 0) {
      productApi.getAll().then((all) => {
        setProducts(all.filter((p) => wishlist.includes(p.id)));
      });
    }
  }, [isWishlistOpen, wishlist]);

  if (!isWishlistOpen) return null;

  const formatPrice = (n) => '$' + Number(n || 0).toFixed(2);

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <>
      <div className="overlay" onClick={closeWishlist} style={{ display: 'block' }}></div>
      <div className="drawer" style={{ display: 'flex', flexDirection: 'column', right: 0 }}>
        <div className="drawer-header">
          <h3>
            Wishlist <span>({wishlist.length})</span>
          </h3>
          <button className="close-btn" onClick={closeWishlist} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="cart-items" style={{ flex: 1, overflowY: 'auto' }}>
          {wishlistProducts.length === 0 ? (
            <p className="empty-state" style={{ padding: '32px 16px', textAlign: 'center', color: '#64748b' }}>
              Your wishlist is empty.
            </p>
          ) : (
            wishlistProducts.map((p) => (
              <div key={p.id} className="cart-item">
                <img
                  src={p.images[0]}
                  alt={p.name}
                  className="cart-thumb"
                  onError={(e) => {
                    e.target.src = 'https://loremflickr.com/500/500/product';
                  }}
                />
                <div className="cart-info" style={{ flex: 1 }}>
                  <div className="cart-name" style={{ fontWeight: 600, fontSize: '14px' }}>
                    {p.name}
                  </div>
                  <div className="cart-price" style={{ color: '#2563eb', fontWeight: 600, marginTop: '4px' }}>
                    {formatPrice(p.discountPrice ?? p.price)}
                  </div>
                  <button
                    className="btn-primary"
                    style={{ marginTop: '8px', padding: '6px 12px', fontSize: '13px' }}
                    onClick={() => addToCart(p.id, 1)}
                  >
                    Add to Cart
                  </button>
                </div>
                <button
                  className="cart-remove-btn"
                  onClick={() => toggleWishlist(p.id)}
                  aria-label="Remove from wishlist"
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
