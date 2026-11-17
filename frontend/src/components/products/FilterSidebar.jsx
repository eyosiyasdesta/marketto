import React from 'react';

export default function FilterSidebar({
  filters,
  onFilterChange,
  availableSubcategories = [],
  availableBrands = [],
  onClearFilters,
}) {
  const handlePriceSlider = (val) => {
    onFilterChange({ ...filters, priceMax: Number(val) });
  };

  const handleBrandToggle = (brand) => {
    const brands = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    onFilterChange({ ...filters, brands });
  };

  const handleSubcategoryToggle = (sub) => {
    const newSub = filters.subcategory === sub ? null : sub;
    onFilterChange({ ...filters, subcategory: newSub });
  };

  return (
    <aside className="filters-sidebar">
      <div className="filters-head">
        <h3>Filters</h3>
      </div>

      {/* Price Range */}
      <div className="filter-group">
        <h4>Price Range</h4>
        <div className="price-inputs">
          <input
            type="number"
            value={filters.priceMin}
            min="0"
            max={filters.priceMax}
            onChange={(e) =>
              onFilterChange({ ...filters, priceMin: Number(e.target.value) })
            }
          />
          <span>—</span>
          <input
            type="number"
            value={filters.priceMax}
            min={filters.priceMin}
            max="3000"
            onChange={(e) =>
              onFilterChange({ ...filters, priceMax: Number(e.target.value) })
            }
          />
        </div>
        <input
          type="range"
          min="0"
          max="2000"
          step="10"
          value={filters.priceMax}
          onChange={(e) => handlePriceSlider(e.target.value)}
        />
        <div className="price-range-label" style={{ fontSize: '13px', color: '#64748b', marginTop: '6px' }}>
          Up to ${filters.priceMax}
        </div>
      </div>

      {/* Subcategories */}
      {availableSubcategories.length > 0 && (
        <div className="filter-group">
          <h4>Subcategory</h4>
          <div className="brand-list">
            {availableSubcategories.map((sub) => (
              <label key={sub} className="checkbox-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '6px' }}>
                <input
                  type="checkbox"
                  checked={filters.subcategory === sub}
                  onChange={() => handleSubcategoryToggle(sub)}
                />
                <span>{sub}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Brands */}
      {availableBrands.length > 0 && (
        <div className="filter-group">
          <h4>Brands</h4>
          <div className="brand-list" style={{ maxHeight: '180px', overflowY: 'auto' }}>
            {availableBrands.map((brand) => (
              <label key={brand} className="checkbox-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '6px' }}>
                <input
                  type="checkbox"
                  checked={filters.brands.includes(brand)}
                  onChange={() => handleBrandToggle(brand)}
                />
                <span>{brand}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Rating */}
      <div className="filter-group">
        <h4>Rating</h4>
        <div className="rating-list">
          {[4, 3, 2].map((stars) => (
            <label key={stars} className="checkbox-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '6px' }}>
              <input
                type="radio"
                name="ratingFilter"
                checked={filters.minRating === stars}
                onChange={() =>
                  onFilterChange({
                    ...filters,
                    minRating: filters.minRating === stars ? 0 : stars,
                  })
                }
              />
              <span>{'⭐'.repeat(stars)} &amp; Up</span>
            </label>
          ))}
        </div>
      </div>

      {/* In Stock Only */}
      <div className="filter-group">
        <label className="checkbox-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) =>
              onFilterChange({ ...filters, inStockOnly: e.target.checked })
            }
          />
          <span>In Stock Only</span>
        </label>
      </div>

      <button className="btn-outline full-width" onClick={onClearFilters}>
        Clear All
      </button>
    </aside>
  );
}
