import axios from 'axios';

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

const getProducts = async (keyword = '') => {
    const response = await axios.get(`${NEXT_PUBLIC_API_URL}/api/products?keyword=${keyword}`);
    return response.data;
};

const getProductById = async (id: string) => {
    const response = await axios.get(`${NEXT_PUBLIC_API_URL}/api/products/${id}`);
    return response.data;
};

// Config for simple requests (public) is empty or defaults
// But for protected routes we need credentials
const config = () => {
    return {
        withCredentials: true,
    };
};

const deleteProduct = async (id: string) => {
    const response = await axios.delete(`${NEXT_PUBLIC_API_URL}/api/products/${id}`, config());
    return response.data;
};

const createProduct = async (productData?: any) => {
    const response = await axios.post(`${NEXT_PUBLIC_API_URL}/api/products`, productData || {}, config());
    return response.data;
};

const updateProduct = async (product: any) => {
    const response = await axios.put(`${NEXT_PUBLIC_API_URL}/api/products/${product._id}`, product, config());
    return response.data;
};

const productService = {
    getProducts,
    getProductById,
    deleteProduct,
    createProduct,
    updateProduct,
};

export default productService;
