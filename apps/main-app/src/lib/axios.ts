'use client'

import axios from 'axios';

// N8N Webhook URL from environment
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://n8n.grupoom.com.br/webhook/painel-aprovacao';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
    (config) => {
        if (typeof window === 'undefined') return config;
        const storedTokenEnc = sessionStorage.getItem('auth_token');
        if (storedTokenEnc) {
            try {
                const token = atob(storedTokenEnc).split(':')[0];
                config.headers.Authorization = `Bearer ${token}`;
            } catch (e) {
                console.error('Token decryption failed', e);
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle 401 errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                sessionStorage.removeItem('auth_token');
                sessionStorage.removeItem('auth_user');
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export const endpoints = {
    webhook: '',
};
