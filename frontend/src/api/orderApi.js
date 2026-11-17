import { apiRequest } from './client';

export const orderApi = {
  checkout: ({ shippingAddress }) =>
    apiRequest('/api/orders/checkout', {
      method: 'POST',
      body: JSON.stringify({ shippingAddress }),
    }),

  buyNow: ({ productId, quantity, shippingAddress }) =>
    apiRequest('/api/orders/buy-now', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity, shippingAddress }),
    }),

  getMyOrders: () => apiRequest('/api/orders'),
};
