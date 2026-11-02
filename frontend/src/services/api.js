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
  
  if (params.search && params.search.trim()) {
    queryParams.search = params.search.trim();
  }
  if (params.category && params.category !== 'All') {
    queryParams.category = params.category;
  }
  if (params.minRating) {
    // Aligns with min_rating in backend ProductFilter
    queryParams.min_rating = params.minRating;
  }

  const response = await api.get('/products/', { params: queryParams });
  return response.data;
};

export default api;