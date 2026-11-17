import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { categoryApi } from '../../api/categoryApi';

const DEFAULT_CATEGORIES = [
  { name: 'Electronics', icon: '⚡', subs: ['Audio', 'Computers', 'Wearables'] },
  { name: 'Clothing', icon: '👕', subs: ['Men', 'Women', 'Kids'] },
  { name: 'Home', icon: '🏠', subs: ['Furniture', 'Kitchen', 'Decor'] },
  { name: 'Books', icon: '📚', subs: ['Fiction', 'Non-Fiction', 'Kids Books'] },
  { name: 'Accessories', icon: '👜', subs: ['Bags', 'Jewelry', 'Eyewear'] },
];

export default function CategoryNav() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  useEffect(() => {
    categoryApi
      .getAll()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          // Format categories & subcategories from backend
          const parentMap = new Map();
          data.forEach((cat) => {
            if (!cat.parent) {
              parentMap.set(cat.id, {
                name: cat.name,
                icon: getCategoryIcon(cat.name),
                subs: [],
              });
            }
          });
          data.forEach((cat) => {
            if (cat.parent && parentMap.has(cat.parent.id)) {
              parentMap.get(cat.parent.id).subs.push(cat.name);
            }
          });
          if (parentMap.size > 0) {
            setCategories([...parentMap.values()]);
          }
        }
      })
      .catch(() => {
        // Fallback to DEFAULT_CATEGORIES
      });
  }, []);

  function getCategoryIcon(name) {
    const icons = {
      Electronics: '⚡',
      Clothing: '👕',
      Home: '🏠',
      Books: '📚',
      Accessories: '👜',
      Gaming: '🎮',
    };
    return icons[name] || '🛍️';
  }

  const handleCategoryClick = (catName) => {
    navigate(`/products?category=${encodeURIComponent(catName)}`);
  };

  const handleSubcategoryClick = (catName, subName, e) => {
    e.stopPropagation();
    navigate(`/products?category=${encodeURIComponent(catName)}&subcategory=${encodeURIComponent(subName)}`);
  };

  return (
    <nav className="category-nav">
      <NavLink
        to="/products"
        className={({ isActive }) => `cat-link ${isActive ? 'active' : ''}`}
      >
        All Products
      </NavLink>

      {categories.map((cat) => (
        <div key={cat.name} className="cat-item">
          <button
            className="cat-link"
            onClick={() => handleCategoryClick(cat.name)}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
          {cat.subs && cat.subs.length > 0 && (
            <div className="cat-dropdown">
              <div className="dropdown-col">
                <h4>Subcategories</h4>
                {cat.subs.map((sub) => (
                  <button
                    key={sub}
                    className="dropdown-sub-btn"
                    onClick={(e) => handleSubcategoryClick(cat.name, sub, e)}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}
