import api from './api';
import { setToken, setUser, clearAuth } from '../utils/auth';

export const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
        setToken(response.data.token);
        setUser({
            _id: response.data._id,
            name: response.data.name,
            email: response.data.email,
        });
    }
    return response.data;
};

export const register = async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    if (response.data.token) {
        setToken(response.data.token);
        setUser({
            _id: response.data._id,
            name: response.data.name,
            email: response.data.email,
        });
    }
    return response.data;
};

export const logout = () => {
    clearAuth();
};
