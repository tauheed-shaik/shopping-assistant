import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    getProfile: () => api.get('/auth/profile'),
    updateProfile: (data) => api.put('/auth/profile', data),
};

export const productAPI = {
    getAll: () => api.get('/products'),
    getById: (id) => api.get(`/products/${id}`),
    create: (data) => api.post('/products', data),
    update: (id, data) => api.put(`/products/${id}`, data),
    delete: (id) => api.delete(`/products/${id}`),
};

export const userAPI = {
    addToCart: (productId, quantity) => api.post('/user/cart', { productId, quantity }),
    removeFromCart: (id) => api.delete(`/user/cart/${id}`),
    addToWishlist: (productId) => api.post('/user/wishlist', { productId }),
    removeFromWishlist: (id) => api.delete(`/user/wishlist/${id}`),
    getAllUsers: () => api.get('/user'),
    deleteUser: (id) => api.delete(`/user/${id}`),
};

export const aiAPI = {
    getRecommendations: () => api.get('/ai/recommendations'),
    getTrending: () => api.get('/ai/trending'),
    generateInsights: (data) => api.post('/ai/insights', data),
};

export default api;
