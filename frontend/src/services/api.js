import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getProducts = async (params = {}) => {
  const queryParams = {};
  if (params.search) queryParams.search = params.search;
  if (params.category && params.category !== 'All') queryParams.category = params.category;
  if (params.minRating) queryParams.star_rating__gte = params.minRating;

  const response = await api.get('/products/', { params: queryParams });
  return response.data;
};

export default api;