import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { productApi } from '../api/productApi';
import ProductCard from '../components/products/ProductCard';
import FilterSidebar from '../components/products/FilterSidebar';

const PER_PAGE = 12;

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [filters, setFilters] = useState({
    priceMin: 0,
    priceMax: 2000,
    brands: [],
    subcategory: null,
    minRating: 0,
    inStockOnly: false,
  });

  const [sort, setSort] = useState('featured');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [currentPage, setCurrentPage] = useState(1);

  // Sync URL search params
  const categoryParam = searchParams.get('category');
  const subcategoryParam = searchParams.get('subcategory');
  const searchParam = searchParams.get('search');
  const brandParam = searchParams.get('brand');
  const sortParam = searchParams.get('sort');

  useEffect(() => {
    if (sortParam) setSort(sortParam);
    if (subcategoryParam) {
      setFilters((f) => ({ ...f, subcategory: subcategoryParam }));
    }
    if (brandParam) {
      setFilters((f) => ({ ...f, brands: [brandParam] }));
    }
  }, [sortParam, subcategoryParam, brandParam]);

  useEffect(() => {
    setLoading(true);
    productApi
      .getAll()
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => {
        console.error('Failed to load products:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  // Compute available brands & subcategories for current category/view
  const availableSubcategories = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      if (!categoryParam || p.category === categoryParam) {
        if (p.subcategory) set.add(p.subcategory);
      }
    });
    return [...set];
  }, [products, categoryParam]);

  const availableBrands = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      if (!categoryParam || p.category === categoryParam) {
        if (p.brand) set.add(p.brand);
      }
    });
    return [...set];
  }, [products, categoryParam]);

  // Filter & sort products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (categoryParam && p.category.toLowerCase() !== categoryParam.toLowerCase()) {
        return false;
      }
      // Subcategory filter
      if (filters.subcategory && p.subcategory !== filters.subcategory) {
        return false;
      }
      // Search query
      if (searchParam) {
        const query = searchParam.toLowerCase();
        const matches =
          p.name.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query);
        if (!matches) return false;
      }
      // Brand filter
      if (filters.brands.length > 0 && !filters.brands.includes(p.brand)) {
        return false;
      }
      // Price filter
      const price = p.discountPrice ?? p.price;
      if (price < filters.priceMin || price > filters.priceMax) {
        return false;
      }
      // Rating filter
      if (filters.minRating > 0 && p.rating < filters.minRating) {
        return false;
      }
      // In stock
      if (filters.inStockOnly && p.stock <= 0) {
        return false;
      }
      return true;
    });
  }, [products, categoryParam, searchParam, filters]);

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sort) {
      case 'price-asc':
        return list.sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price));
      case 'price-desc':
        return list.sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price));
      case 'rating':
        return list.sort((a, b) => b.rating - a.rating);
      case 'discount':
        return list.sort((a, b) => b.discountPct - a.discountPct);
      case 'featured':
      default:
        return list;
    }
  }, [filteredProducts, sort]);

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / PER_PAGE);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );

  const handleClearFilters = () => {
    setFilters({
      priceMin: 0,
      priceMax: 2000,
      brands: [],
      subcategory: null,
      minRating: 0,
      inStockOnly: false,
    });
    setSearchParams(categoryParam ? { category: categoryParam } : {});
  };

  return (
    <div id="productsView">
      {/* Breadcrumb */}
      <div className="breadcrumb-bar">
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          {categoryParam ? (
            <>
              <Link to={`/products?category=${encodeURIComponent(categoryParam)}`}>
                {categoryParam}
              </Link>
              {filters.subcategory && (
                <>
                  <span>/</span>
                  <span style={{ color: '#1e293b', fontWeight: 600 }}>
                    {filters.subcategory}
                  </span>
                </>
              )}
            </>
          ) : (
            <span style={{ color: '#1e293b', fontWeight: 600 }}>All Products</span>
          )}
          {searchParam && (
            <>
              <span>/</span>
              <span>Search: "{searchParam}"</span>
            </>
          )}
        </div>
      </div>

      {/* Category Intro */}
      <div className="category-intro" style={{ margin: '16px auto', maxWidth: '1320px', padding: '0 24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800 }}>
          {categoryParam || (searchParam ? `Results for "${searchParam}"` : 'All Products')}
        </h1>
        <p style={{ color: '#64748b', marginTop: '4px' }}>
          Explore our handpicked selection of top-quality products.
        </p>
      </div>

      <div className="products-layout">
        {/* Filter Sidebar */}
        <FilterSidebar
          filters={filters}
          onFilterChange={setFilters}
          availableSubcategories={availableSubcategories}
          availableBrands={availableBrands}
          onClearFilters={handleClearFilters}
        />

        {/* Main Products Area */}
        <div className="products-main">
          {/* Toolbar */}
          <div className="products-toolbar">
            <span id="resultsCount">
              Showing {sortedProducts.length} result{sortedProducts.length === 1 ? '' : 's'}
            </span>
            <div className="toolbar-actions">
              <select
                id="sortSelect"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="discount">Biggest Discount</option>
              </select>

              <div className="view-toggle">
                <button
                  className={viewMode === 'grid' ? 'active' : ''}
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                >
                  ▦
                </button>
                <button
                  className={viewMode === 'list' ? 'active' : ''}
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                >
                  ☰
                </button>
              </div>
            </div>
          </div>

          {/* Product Grid / List */}
          {loading ? (
            <p style={{ textAlign: 'center', padding: '48px 0', color: '#64748b' }}>
              Loading products...
            </p>
          ) : paginatedProducts.length === 0 ? (
            <div className="empty-state" style={{ padding: '48px 0', textAlign: 'center' }}>
              <p style={{ fontSize: '18px', color: '#64748b', marginBottom: '16px' }}>
                No products match your selected filters.
              </p>
              <button className="btn-outline" onClick={handleClearFilters}>
                Reset Filters
              </button>
            </div>
          ) : (
            <div
              className="product-grid"
              style={
                viewMode === 'list'
                  ? { display: 'flex', flexDirection: 'column', gap: '16px' }
                  : {}
              }
            >
              {paginatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} viewMode={viewMode} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination" style={{ marginTop: '32px' }}>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                ‹
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={currentPage === page ? 'active' : ''}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                ›
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
