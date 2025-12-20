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

const getUsers = async () => {
    const response = await axios.get(`${NEXT_PUBLIC_API_URL}/api/users`, config());
    return response.data;
};

const deleteUser = async (id: string) => {
    const response = await axios.delete(`${NEXT_PUBLIC_API_URL}/api/users/${id}`, config());
    return response.data;
};

const userService = {
    getUsers,
    deleteUser,
};

export default userService;
