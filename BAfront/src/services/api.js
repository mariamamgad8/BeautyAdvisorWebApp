import axios from 'axios';

// Create an axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Basic GET request method
api.get = (url, config = {}) => {
  return api.request({
    method: 'get',
    url,
    ...config
  });
};

// Authentication service
export const authService = {
  register: (userData) => api.post('/api/auth/register', userData),
  login: (credentials) => api.post('/api/auth/login', credentials),
  getProfile: () => api.get('/api/auth/profile'),
};

// Images service
export const imageService = {
  uploadImage: (formData) => {
    return api.post('/api/images/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getUserImages: () => api.get('/api/images/user'),
  getImage: (id) => api.get(`/api/images/${id}`),
  deleteImage: (id) => api.delete(`/api/images/${id}`),
};

// Recommendations service
export const recommendationService = {
  generateRecommendation: (photoId) => api.post(`/api/recommendations/generate/${photoId}`),
  getUserRecommendations: () => api.get('/api/recommendations/user'),
  getRecommendation: (id) => api.get(`/api/recommendations/${id}`),
  deleteRecommendation: (id) => api.delete(`/api/recommendations/${id}`),
};

// Feedback service
export const feedbackService = {
  submitFeedback: (data) => api.post('/api/feedback', data),
  getUserFeedback: () => api.get('/api/feedback/user'),
  getRecommendationFeedback: (recommendationId) => 
    api.get(`/api/feedback/recommendation/${recommendationId}`),
  updateFeedback: (id, data) => api.put(`/api/feedback/${id}`, data),
  deleteFeedback: (id) => api.delete(`/api/feedback/${id}`),
};

export default api;