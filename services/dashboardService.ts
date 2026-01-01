import axios from 'axios';

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7000';

const config = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return {
        headers: {
            Authorization: token ? `Bearer ${token}` : '',
        },
        withCredentials: true,
    };
};

const getSummary = async () => {
    const response = await axios.get(`${NEXT_PUBLIC_API_URL}/api/dashboard/summary`, config());
    return response.data;
};

const dashboardService = {
    getSummary,
};

export default dashboardService;
