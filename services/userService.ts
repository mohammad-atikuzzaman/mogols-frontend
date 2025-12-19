import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:7000';

const config = () => {
    return {
        withCredentials: true,
    };
};

const getUsers = async () => {
    const response = await axios.get(`${API_URL}/api/users`, config());
    return response.data;
};

const deleteUser = async (id: string) => {
    const response = await axios.delete(`${API_URL}/api/users/${id}`, config());
    return response.data;
};

const userService = {
    getUsers,
    deleteUser,
};

export default userService;
