// client/src/contexts/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Configuration d'Axios
    axios.defaults.baseURL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const loadUser = async () => {
            if (token) {
                setAuthToken(token);
                try {
                    const res = await axios.get('/auth/me');
                    setUser(res.data.user);
                    setIsAuthenticated(true);
                } catch (err) {
                    localStorage.removeItem('token');
                    setToken(null);
                    setUser(null);
                    setIsAuthenticated(false);
                    setError(err.response?.data?.error || 'Une erreur est survenue');
                }
            }
            setLoading(false);
        };

        loadUser();
    }, [token]);

    // Définir le token dans les en-têtes
    const setAuthToken = (token) => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            localStorage.setItem('token', token);
        } else {
            delete axios.defaults.headers.common['Authorization'];
            localStorage.removeItem('token');
        }
    };

    // Inscription
    const register = async (formData) => {
        try {
            const res = await axios.post('/auth/register', formData);
            setToken(res.data.token);
            setUser(res.data.user);
            setIsAuthenticated(true);
            setLoading(false);
            setError(null);
            return res.data;
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur lors de l\'inscription');
            throw err;
        }
    };

    // Connexion
    const login = async (formData) => {
        try {
            const res = await axios.post('/auth/login', formData);
            setToken(res.data.token);
            setUser(res.data.user);
            setIsAuthenticated(true);
            setLoading(false);
            setError(null);
            return res.data;
        } catch (err) {
            setError(err.response?.data?.error || 'Identifiants incorrects');
            throw err;
        }
    };

    // Déconnexion
    const logout = async () => {
        try {
            await axios.get('/auth/logout');
        } finally {
            setToken(null);
            setUser(null);
            setIsAuthenticated(false);
            setError(null);
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
        }
    };

    // Mettre à jour le profil
    const updateProfile = async (formData) => {
        try {
            const res = await axios.put(`/users/${user.id}`, formData);
            setUser({ ...user, ...res.data.data });
            setError(null);
            return res.data;
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur lors de la mise à jour du profil');
            throw err;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated,
                loading,
                error,
                register,
                login,
                logout,
                updateProfile,
                setError
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;