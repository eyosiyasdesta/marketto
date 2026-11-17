import { apiRequest } from './client';

export const cartApi = {
  getCart: () => apiRequest('/api/cart'),

  addToCart: ({ productId, quantity = 1, variantId = null }) =>
    apiRequest('/api/cart/add', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity, variantId }),
    }),

  updateCartItem: (cartItemId, quantity) =>
    apiRequest(`/api/cart/update/${cartItemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    }),

  removeCartItem: (cartItemId) =>
    apiRequest(`/api/cart/remove/${cartItemId}`, {
      method: 'DELETE',
    }),
};
