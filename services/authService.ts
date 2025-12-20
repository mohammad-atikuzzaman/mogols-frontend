import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Helper to get token from localStorage
const getToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
};

// Helper to set token in localStorage
export const setToken = (token: string) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
    }
};

// Helper to remove token
export const removeToken = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
    }
};

// Config with token in Authorization header
const authConfig = () => {
    const token = getToken();
    return {
        headers: {
            Authorization: token ? `Bearer ${token}` : '',
        },
        withCredentials: true,
    };
};

interface LoginData {
    email: string;
    password: string;
}

interface RegisterData {
    name: string;
    email: string;
    password: string;
}

const login = async (userData: LoginData) => {
    const response = await axios.post(`${API_URL}/api/auth/login`,
        userData,
        { withCredentials: true }
    );

    if (response.data.token) {
        setToken(response.data.token);
    }

    return response.data;
};

const register = async (userData: RegisterData) => {
    const response = await axios.post(`${API_URL}/api/auth/register`,
        userData,
        { withCredentials: true }
    );

    if (response.data.token) {
        setToken(response.data.token);
    }

    return response.data;
};

const logout = () => {
    removeToken();
};

const getCurrentUser = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/auth/me`, authConfig());
        return response.data;
    } catch (error) {
        removeToken();
        return null;
    }
};

const authService = {
    login,
    register,
    logout,
    getCurrentUser,
    getToken,
    setToken,
    removeToken,
};

export default authService;
