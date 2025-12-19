import axios from 'axios';

const API_URL = process.env.API_URL;

const config = () => {
    return {
        withCredentials: true,
    };
};

const createOrder = async (orderData: any) => {
    const response = await axios.post(`${API_URL}/api/orders`, orderData, config());
    return response.data;
};

const getMyOrders = async () => {
    const response = await axios.get(`${API_URL}/api/orders/myorders`, config());
    return response.data;
};

const getOrderById = async (id: string) => {
    const response = await axios.get(`${API_URL}/api/orders/${id}`, config());
    return response.data;
};

const getOrders = async () => {
    const response = await axios.get(`${API_URL}/api/orders`, config());
    return response.data;
};

const orderService = {
    createOrder,
    getMyOrders,
    getOrderById,
    getOrders,
};

export default orderService;
