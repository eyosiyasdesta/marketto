import React from 'react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useModal } from '../../context/ModalContext';

export default function ProductCard({ product, viewMode = 'grid' }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { openModal } = useModal();

  const isFavorited = isInWishlist(product.id);

  const formatPrice = (val) => '$' + Number(val || 0).toFixed(2);

  const starRow = (rating) => {
    return '⭐'.repeat(Math.round(rating || 5));
  };

  const handleCardClick = (e) => {
    // If user clicked heart button or add to cart button, don't open modal
    if (e.target.closest('.wish-btn') || e.target.closest('.add-cart-btn')) {
      return;
    }
    openModal('detail', { product });
  };

  return (
    <div
      className={`product-card ${viewMode === 'list' ? 'list-card' : ''}`}
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="product-image-wrap">
        {product.discountPct > 0 && (
          <span className="badge-tag">SAVE {product.discountPct}%</span>
        )}
        {product.stock === 0 && (
          <span className="badge-tag" style={{ background: '#64748b' }}>
            Out of Stock
          </span>
        )}
        <button
          className={`wish-btn ${isFavorited ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          aria-label="Add to wishlist"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill={isFavorited ? '#dc2626' : 'none'}
            stroke={isFavorited ? '#dc2626' : 'currentColor'}
            strokeWidth="2"
          >
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
          </svg>
        </button>
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://loremflickr.com/500/500/product';
          }}
        />
      </div>

      <div className="product-info">
        <div className="product-brand">{product.brand}</div>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-rating">
          <span>{starRow(product.rating)}</span>
          <span style={{ marginLeft: '4px' }}>({product.reviews})</span>
        </div>
        <div className="product-price-row">
          <span className="price-current">
            {formatPrice(product.discountPrice ?? product.price)}
          </span>
          {product.discountPrice && (
            <span className="price-original">{formatPrice(product.price)}</span>
          )}
        </div>
        <button
          className="btn-primary add-cart-btn"
          disabled={product.stock === 0}
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product.id, 1);
          }}
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
