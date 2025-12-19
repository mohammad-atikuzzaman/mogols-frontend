import axios from 'axios';

const API_ENDPOINT = `${process.env.API_URL}/api/auth/`;

// Register user
const register = async (userData: any) => {
    const response = await axios.post(API_ENDPOINT + 'register', userData);

    if (response.data) {
        if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
    }

    return response.data;
};

// Login user
const login = async (userData: any) => {
    const response = await axios.post(`${API_ENDPOINT}login`, userData);

    if (response.data) {
        if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
    }

    return response.data;
};

// Logout user
const logout = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
    }
};

const authService = {
    register,
    logout,
    login,
};

export default authService;
