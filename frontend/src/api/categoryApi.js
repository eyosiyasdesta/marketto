import { apiRequest } from './client';

export const categoryApi = {
  getAll: () => apiRequest('/api/categories'),
};
