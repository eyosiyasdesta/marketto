import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { productApi } from '../api/productApi';
import ProductCard from '../components/products/ProductCard';
import { useToast } from '../context/ToastContext';

const HERO_SLIDES = [
  {
    title: 'Transform Your Space',
    desc: 'Furniture and decor that elevates every room in your home.',
    btnText: 'Shop Home',
    category: 'Home',
  },
  {
    title: 'Next-Gen Tech, Real Prices',
    desc: 'Laptops, phones, and audio gear from brands you trust.',
    btnText: 'Shop Electronics',
    category: 'Electronics',
  },
  {
    title: 'Gear Up & Level Up',
    desc: 'Everything you need for your next gaming setup.',
    btnText: 'Shop Gaming',
    category: 'Electronics',
  },
];

const BRANDS = ['TechWatch', 'SoundWave', 'TechPhone', 'FitBand', 'GameGear', 'BasicCo', 'StepUp', 'BrewMaster', 'Artisan', 'PenPress', 'CarryAll'];

export default function HomePage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [loading, setLoading] = useState(true);

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Fetch products
  useEffect(() => {
    setLoading(true);
    productApi
      .getAll()
      .then((data) => {
        setProducts(data);

        // Group categories
        const catMap = new Map();
        data.forEach((p) => {
          if (!catMap.has(p.category)) {
            catMap.set(p.category, {
              name: p.category,
              icon: getCategoryIcon(p.category),
              count: 0,
            });
          }
          catMap.get(p.category).count++;
        });
        setCategories([...catMap.values()]);
      })
      .catch((err) => {
        console.error('Failed to load products:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  function getCategoryIcon(cat) {
    const icons = {
      Electronics: '⚡',
      Clothing: '👕',
      Home: '🏠',
      Books: '📚',
      Accessories: '👜',
      Gaming: '🎮',
    };
    return icons[cat] || '🛍️';
  }

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      showToast('Thank you for subscribing! Your 10% coupon has been sent.');
      setNewsletterEmail('');
    }
  };

  const trendingProducts = products.slice(0, 4);
  const bestsellerProducts = products.filter((p) => p.bestseller || p.reviews > 400).slice(0, 4);

  return (
    <div id="homeView">
      {/* Hero Carousel */}
      <section className="hero" id="hero">
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={idx}
            className={`hero-slide ${idx === currentSlide ? 'active' : ''}`}
            data-index={idx}
            style={{ display: idx === currentSlide ? 'flex' : 'none' }}
          >
            <h1>{slide.title}</h1>
            <p>{slide.desc}</p>
            <button
              className="btn-primary"
              onClick={() => navigate(`/products?category=${encodeURIComponent(slide.category)}`)}
            >
              {slide.btnText}
            </button>
          </div>
        ))}

        <button
          className="hero-arrow hero-prev"
          onClick={() =>
            setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
          }
          aria-label="Previous slide"
        >
          ‹
        </button>
        <button
          className="hero-arrow hero-next"
          onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
          aria-label="Next slide"
        >
          ›
        </button>

        <div className="hero-dots">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              className={`hero-dot ${idx === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Main Content */}
      <main className="main-content">
        {/* Categories */}
        <section className="section">
          <div className="section-head">
            <h2>Shop by Category</h2>
          </div>
          <div className="category-cards">
            {categories.map((cat) => (
              <div
                key={cat.name}
                className="category-card"
                onClick={() => navigate(`/products?category=${encodeURIComponent(cat.name)}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="cat-card-icon" style={{ fontSize: '32px', marginBottom: '8px' }}>
                  {cat.icon}
                </div>
                <h3>{cat.name}</h3>
                <p style={{ color: '#64748b', fontSize: '13px' }}>{cat.count} items</p>
              </div>
            ))}
          </div>
        </section>

        {/* Trending Now */}
        <section className="section">
          <div className="section-head">
            <h2>Trending Now</h2>
            <Link to="/products?sort=featured" className="view-all">
              View All →
            </Link>
          </div>
          {loading ? (
            <p style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
              Loading trending items...
            </p>
          ) : (
            <div className="product-grid">
              {trendingProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>

        {/* Best Sellers */}
        <section className="section">
          <div className="section-head">
            <h2>Best Sellers</h2>
            <Link to="/products?sort=rating" className="view-all">
              View All →
            </Link>
          </div>
          {loading ? (
            <p style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
              Loading best sellers...
            </p>
          ) : (
            <div className="product-grid">
              {(bestsellerProducts.length > 0 ? bestsellerProducts : products.slice(4, 8)).map(
                (p) => (
                  <ProductCard key={p.id} product={p} />
                )
              )}
            </div>
          )}
        </section>

        {/* Shop by Brand */}
        <section className="section brand-section">
          <div className="section-head">
            <h2>Shop by Brand</h2>
          </div>
          <div className="brand-strip">
            {BRANDS.map((brand) => (
              <button
                key={brand}
                className="brand-pill"
                onClick={() => navigate(`/products?brand=${encodeURIComponent(brand)}`)}
              >
                {brand}
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* Newsletter */}
      <section className="newsletter">
        <div className="newsletter-inner">
          <div>
            <h2>Get 10% off your first order</h2>
            <p>
              Subscribe to our newsletter for exclusive deals, new arrivals, and insider updates.
            </p>
          </div>
          <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
            />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
}
