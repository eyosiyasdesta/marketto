import { apiRequest } from './client';

// Real, high-resolution product photography from Unsplash
const PRODUCT_IMAGE_MAP = {
  'smart watch': [
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
  ],
  'bluetooth speaker': [
    'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80',
  ],
  'smartphone': [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&auto=format&fit=crop&q=80',
  ],
  'headphones': [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80',
  ],
  'fitness tracker': [
    'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1510017803434-a899398421b3?w=800&auto=format&fit=crop&q=80',
  ],
  'keyboard': [
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=80',
  ],
  'black tee': [
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80',
  ],
  'sneakers': [
    'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80',
  ],
  'coffee maker': [
    'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=800&auto=format&fit=crop&q=80',
  ],
  'ceramic vase': [
    'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=800&auto=format&fit=crop&q=80',
  ],
  'book': [
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80',
  ],
  'daypack': [
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&auto=format&fit=crop&q=80',
  ],
};

const CATEGORY_IMAGE_MAP = {
  electronics: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&auto=format&fit=crop&q=80',
  clothing: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&auto=format&fit=crop&q=80',
  home: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
  books: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80',
  accessories: 'https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?w=800&auto=format&fit=crop&q=80',
};

export function resolveProductImages(name = '', category = '', rawUrl = null) {
  const lowerName = name.toLowerCase();

  // If a specific reliable product match exists
  for (const [key, imgs] of Object.entries(PRODUCT_IMAGE_MAP)) {
    if (lowerName.includes(key)) {
      return imgs;
    }
  }

  // Check if rawUrl is a valid non-placeholder image
  if (rawUrl && !rawUrl.includes('loremflickr') && !rawUrl.includes('placeholder')) {
    return [rawUrl, rawUrl];
  }

  // Category fallback
  const lowerCat = (category || '').toLowerCase();
  for (const [catKey, catImg] of Object.entries(CATEGORY_IMAGE_MAP)) {
    if (lowerCat.includes(catKey)) {
      return [catImg, catImg];
    }
  }

  // Universal high-quality product fallback
  const fallback = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80';
  return [fallback, fallback];
}

export function normalizeProduct(p) {
  if (!p) return null;
  const price = Number(p.price || 0);
  const discountPrice = p.discountPrice != null ? Number(p.discountPrice) : null;
  const discountPct = discountPrice ? Math.round(100 - (discountPrice / price) * 100) : 0;
  const categoryName = typeof p.category === 'object' && p.category?.name ? p.category.name : (p.category || 'General');

  const variants = p.variants || [];
  const colors = variants.length ? [...new Set(variants.map((v) => v.color).filter(Boolean))] : null;
  const sizes = variants.length ? [...new Set(variants.map((v) => v.size).filter(Boolean))] : null;

  const images = resolveProductImages(p.name, categoryName, p.imageUrl);

  return {
    id: p.id,
    name: p.name,
    brand: p.brand || 'Marketto Brand',
    category: categoryName,
    subcategory: categoryName,
    price,
    discountPrice,
    discountPct,
    rating: p.rating || 4.5,
    reviews: p.reviewCount || 0,
    stock: p.stock ?? 10,
    imageUrl: images[0],
    images,
    desc: p.description || 'Premium quality product carefully tested and backed by Marketto guarantee.',
    specs: {
      Brand: p.brand || 'Marketto',
      Category: categoryName,
      Availability: (p.stock ?? 10) > 0 ? 'In Stock' : 'Out of Stock',
    },
    colors,
    sizes,
    variants,
    featured: false,
    bestseller: (p.reviewCount || 0) > 500,
  };
}

export const productApi = {
  getAll: async () => {
    const list = await apiRequest('/api/products');
    return Array.isArray(list) ? list.map(normalizeProduct) : [];
  },

  getById: async (id) => {
    const p = await apiRequest(`/api/products/${id}`);
    return normalizeProduct(p);
  },

  getByCategory: async (categoryId) => {
    const list = await apiRequest(`/api/products/category/${categoryId}`);
    return Array.isArray(list) ? list.map(normalizeProduct) : [];
  },
};
