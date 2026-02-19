import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const savedUser = await AsyncStorage.getItem('user');

            if (token && savedUser) {
                try {
                    const { data } = await authService.getMe();
                    setUser(data);
                    await AsyncStorage.setItem('user', JSON.stringify(data));
                } catch (error) {
                    if (error.response?.status === 401) {
                        // Token expired or invalid (e.g. after seed), fail silently
                        logout();
                    } else {
                        console.error('Mobile session sync failed:', error);
                    }
                }
            } else if (savedUser) {
                setUser(JSON.parse(savedUser));
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const { data } = await authService.login(email, password);
            setUser(data.user);
            await AsyncStorage.setItem('token', data.token);
            await AsyncStorage.setItem('user', JSON.stringify(data.user));
        } catch (error) {
            throw error;
        }
    };

    const register = async (email, password) => {
        try {
            const { data } = await authService.register(email, password);
            setUser(data.user);
            await AsyncStorage.setItem('token', data.token);
            await AsyncStorage.setItem('user', JSON.stringify(data.user));
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        setUser(null);
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
