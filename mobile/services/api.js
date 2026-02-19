import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

import Constants from 'expo-constants';

// Dynamic IP addressing for Expo (Simulators & Physical Devices)
const getBaseUrl = () => {
    if (Platform.OS === 'android') {
        // 10.0.2.2 is the special IP for Android Emulator to access host machine
        // If on a physical Android device, we need the LAN IP
        return Constants.isDevice ? `http://${Constants.expoConfig.hostUri.split(':')[0]}:5001` : 'http://10.0.2.2:5001';
    }
    // For iOS (Simulator or Physical), hostUri usually points to the LAN IP of the bundler
    if (Constants.expoConfig?.hostUri) {
        const host = Constants.expoConfig.hostUri.split(':')[0];
        return `http://${host}:5001`;
    }
    // Fallback for iOS Simulator if hostUri is missing (rare)
    return 'http://localhost:5001';
};

const BASE_URL = getBaseUrl();

const api = axios.create({
    baseURL: BASE_URL,
});

api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');
            // Force app reload or handle redirect in AuthContext
        }
        return Promise.reject(error);
    }
);

export const authService = {
    login: (email, password) => api.post('/auth/login', { email, password }),
    register: (email, password) => api.post('/auth/register', { email, password }),
    getMe: () => api.get('/auth/me'),
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
