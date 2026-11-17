import React, { useState, useEffect } from 'react';
import { useModal } from '../../context/ModalContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { productApi } from '../../api/productApi';

export default function ProductDetailModal() {
  const { activeModal, modalData, closeModal, openModal } = useModal();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const product = activeModal === 'detail' ? modalData?.product : null;

  const [selectedImg, setSelectedImg] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('desc'); // 'desc' | 'specs' | 'reviews'
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    if (product) {
      setSelectedImg(0);
      setSelectedColor(product.colors?.[0] || null);
      setSelectedSize(product.sizes?.[0] || null);
      setQuantity(1);
      setActiveTab('desc');

      // Fetch related products
      productApi.getAll().then((all) => {
        const related = all
          .filter((p) => p.category === product.category && p.id !== product.id)
          .slice(0, 4);
        setRelatedProducts(related);
      });
    }
  }, [product]);

  if (activeModal !== 'detail' || !product) return null;

  const formatPrice = (n) => '$' + Number(n || 0).toFixed(2);
  const starRow = (r) => '⭐'.repeat(Math.round(r || 5));

  // Find matching variant ID if variants exist
  const getSelectedVariant = () => {
    if (!product.variants || product.variants.length === 0) return null;
    return product.variants.find((v) => {
      const matchColor = !selectedColor || v.color === selectedColor;
      const matchSize = !selectedSize || v.size === selectedSize;
      return matchColor && matchSize;
    });
  };

  const handleAddToCart = () => {
    const variant = getSelectedVariant();
    addToCart(product.id, quantity, variant?.id || null);
  };

  const handleBuyNow = () => {
    const variant = getSelectedVariant();
    closeModal();
    openModal('checkout', {
      mode: 'buyNow',
      product,
      quantity,
      variant,
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Link copied to clipboard!');
  };

  const reviews = [
    { name: 'Sarah M.', text: 'Exactly as described and arrived fast. Really happy with this purchase.', rating: 5, date: '2 days ago' },
    { name: 'David L.', text: 'Good quality for the price. Would recommend to a friend.', rating: 4, date: '1 week ago' },
    { name: 'Elena V.', text: 'Exceeded my expectations. Will definitely buy from this brand again.', rating: 5, date: '3 weeks ago' },
  ];

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div
        className="modal detail-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto' }}
      >
        <button className="close-btn" onClick={closeModal} aria-label="Close">
          ✕
        </button>

        <div className="detail-body">
          <div className="detail-gallery">
            <img
              className="detail-main-img"
              src={product.images[selectedImg] || product.images[0]}
              alt={product.name}
              onError={(e) => {
                e.target.src = 'https://loremflickr.com/500/500/product';
              }}
            />
            <div className="detail-thumbs">
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  className={i === selectedImg ? 'selected' : ''}
                  onClick={() => setSelectedImg(i)}
                  alt={`Thumbnail ${i + 1}`}
                  onError={(e) => {
                    e.target.src = 'https://loremflickr.com/500/500/product';
                  }}
                />
              ))}
            </div>
          </div>

          <div className="detail-info">
            <div className="product-brand">{product.brand}</div>
            <h2>{product.name}</h2>
            <div className="product-rating">
              {starRow(product.rating)} {product.rating} ({product.reviews} reviews)
            </div>

            <div className="detail-price">
              <span className="price-current">
                {formatPrice(product.discountPrice ?? product.price)}
              </span>
              {product.discountPrice && (
                <>
                  <span className="price-original">{formatPrice(product.price)}</span>
                  <span className="detail-discount">-{product.discountPct}%</span>
                </>
              )}
            </div>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div style={{ marginTop: '12px' }}>
                <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '6px' }}>Color</div>
                <div className="qv-colors" style={{ display: 'flex', gap: '8px' }}>
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      className={`swatch ${c === selectedColor ? 'selected' : ''}`}
                      style={{
                        backgroundColor: c.toLowerCase(),
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        border: c === selectedColor ? '3px solid #2563eb' : '1px solid #ccc',
                        cursor: 'pointer',
                      }}
                      onClick={() => setSelectedColor(c)}
                      title={c}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div style={{ marginTop: '12px' }}>
                <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '6px' }}>Size</div>
                <div className="qv-sizes" style={{ display: 'flex', gap: '8px' }}>
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      className={`size-opt ${s === selectedSize ? 'selected' : ''}`}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '6px',
                        border: s === selectedSize ? '2px solid #2563eb' : '1px solid #e2e8f0',
                        backgroundColor: s === selectedSize ? '#eff6ff' : '#fff',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                      onClick={() => setSelectedSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="qty-row" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px' }}>
              <span style={{ fontWeight: 600, fontSize: '14px' }}>Quantity:</span>
              <button
                className="qty-btn"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <span style={{ minWidth: '24px', textAlign: 'center', fontWeight: 600 }}>{quantity}</span>
              <button
                className="qty-btn"
                onClick={() => setQuantity((q) => q + 1)}
              >
                +
              </button>
            </div>

            {/* Actions */}
            <div className="detail-actions" style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button
                className="btn-primary"
                disabled={product.stock === 0}
                onClick={handleAddToCart}
                style={{ flex: 1 }}
              >
                Add to Cart
              </button>
              <button
                className="btn-secondary"
                disabled={product.stock === 0}
                onClick={handleBuyNow}
                style={{ flex: 1 }}
              >
                Buy Now
              </button>
            </div>

            {/* Share */}
            <div className="share-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px', fontSize: '13px', color: '#64748b' }}>
              <span>Share:</span>
              <button onClick={handleCopyLink} title="Copy link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>🔗</button>
            </div>
          </div>
        </div>

        {/* Detail Tabs */}
        <div className="detail-tabs" style={{ marginTop: '28px' }}>
          <div className="tab-nav" style={{ display: 'flex', gap: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
            <button
              className={`tab-btn ${activeTab === 'desc' ? 'active' : ''}`}
              onClick={() => setActiveTab('desc')}
              style={{ background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer', borderBottom: activeTab === 'desc' ? '2px solid #2563eb' : 'none', paddingBottom: '4px' }}
            >
              Description
            </button>
            <button
              className={`tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
              onClick={() => setActiveTab('specs')}
              style={{ background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer', borderBottom: activeTab === 'specs' ? '2px solid #2563eb' : 'none', paddingBottom: '4px' }}
            >
              Specifications
            </button>
            <button
              className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
              style={{ background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer', borderBottom: activeTab === 'reviews' ? '2px solid #2563eb' : 'none', paddingBottom: '4px' }}
            >
              Reviews ({reviews.length})
            </button>
          </div>

          <div className="tab-content" style={{ padding: '16px 0' }}>
            {activeTab === 'desc' && <p>{product.desc}</p>}

            {activeTab === 'specs' && (
              <div className="specs-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {Object.entries(product.specs || {}).map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ color: '#64748b' }}>{k}</span>
                    <span style={{ fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="reviews-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {reviews.map((r, i) => (
                  <div key={i} style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                      <span>{r.name}</span>
                      <span style={{ fontSize: '13px', color: '#94a3b8' }}>{r.date}</span>
                    </div>
                    <div style={{ margin: '4px 0' }}>{starRow(r.rating)}</div>
                    <p style={{ fontSize: '14px', color: '#475569' }}>{r.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="related-section" style={{ marginTop: '28px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
            <h3 style={{ marginBottom: '16px' }}>Related Products</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  className="product-card"
                  onClick={() => openModal('detail', { product: rel })}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="product-image-wrap">
                    <img
                      src={rel.images[0]}
                      alt={rel.name}
                      onError={(e) => {
                        e.target.src = 'https://loremflickr.com/500/500/product';
                      }}
                    />
                  </div>
                  <div className="product-info" style={{ padding: '8px' }}>
                    <div className="product-name" style={{ fontSize: '13px' }}>{rel.name}</div>
                    <div className="price-current" style={{ fontSize: '14px', fontWeight: 600 }}>
                      {formatPrice(rel.discountPrice ?? rel.price)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
