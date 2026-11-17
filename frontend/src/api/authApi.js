import { apiRequest } from './client';

export const authApi = {
  login: (credentials) =>
    apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  register: (userData) =>
    apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  me: () => apiRequest('/api/auth/me'),
};
