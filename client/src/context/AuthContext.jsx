import { createContext, useState, useEffect } from 'react';
import axios from '../config/axiosConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    console.log('[Auth] Verifying existing token...');
                    const { data } = await axios.get('/api/auth/me');
                    console.log('[Auth] User verified:', data);
                    setUser({ ...data, token });
                } catch (error) {
                    console.error('[Auth] Token verification failed:', error.response?.data?.message || error.message);
                    localStorage.removeItem('token');
                    setUser(null);
                }
            } else {
                console.log('[Auth] No token found in localStorage');
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    const login = async (email, password) => {
        console.log('[Auth] Attempting login for:', email);
        const { data } = await axios.post('/api/auth/login', { email, password });
        console.log('[Auth] Login successful:', { role: data.role, name: data.name });
        localStorage.setItem('token', data.token);
        setUser(data);
        return data;
    };

    const register = async (name, email, password, role) => {
        console.log('[Auth] Attempting registration for:', email);
        const { data } = await axios.post('/api/auth/register', { name, email, password, role });
        console.log('[Auth] Registration successful:', { role: data.role, name: data.name });
        localStorage.setItem('token', data.token);
        setUser(data);
        return data;
    };

    const logout = () => {
        console.log('[Auth] Logging out user');
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
