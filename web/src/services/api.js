import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5001',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
        return Promise.reject(error);
    }
);

export const authService = {
    login: (email, password) => api.post('/auth/login', { email, password }),
    register: (email, password) => api.post('/auth/register', { email, password }),
};

export const productService = {
    getProducts: (params) => api.get('/products', { params }),
    getProduct: (id) => api.get(`/products/${id}`),
    createProduct: (productData) => api.post('/products', productData),
    deleteProduct: (id) => api.delete(`/products/${id}`),
};

export const favoriteService = {
    getFavorites: () => api.get('/favorites'),
    addFavorite: (productId) => api.post(`/favorites/${productId}`),
    removeFavorite: (productId) => api.delete(`/favorites/${productId}`),
};

export default api;
