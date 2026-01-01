import axios from 'axios';

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

const config = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return {
        headers: {
            Authorization: token ? `Bearer ${token}` : '',
        },
        withCredentials: true,
    };
};

const createOrder = async (orderData: any) => {
    const response = await axios.post(`${NEXT_PUBLIC_API_URL}/api/orders`, orderData, config());
    return response.data;
};

const getMyOrders = async () => {
    const response = await axios.get(`${NEXT_PUBLIC_API_URL}/api/orders/myorders`, config());
    return response.data;
};

const getOrderById = async (id: string) => {
    const response = await axios.get(`${NEXT_PUBLIC_API_URL}/api/orders/${id}`, config());
    return response.data;
};

const getOrders = async () => {
    const response = await axios.get(`${NEXT_PUBLIC_API_URL}/api/orders`, config());
    return response.data;
};

const checkPurchaseStatus = async (productId: string) => {
    const response = await axios.get(`${NEXT_PUBLIC_API_URL}/api/orders/check-purchase/${productId}`, config());
    return response.data;
};

const deliverOrder = async (orderId: string) => {
    const response = await axios.put(`${NEXT_PUBLIC_API_URL}/api/orders/${orderId}/deliver`, {}, config());
    return response.data;
};

const payOrder = async (orderId: string, paymentResult: any) => {
    const response = await axios.put(`${NEXT_PUBLIC_API_URL}/api/orders/${orderId}/pay`, paymentResult, config());
    return response.data;
};

const orderService = {
    createOrder,
    getMyOrders,
    getOrderById,
    getOrders,
    checkPurchaseStatus,
    deliverOrder,
    payOrder,
};

export default orderService;
