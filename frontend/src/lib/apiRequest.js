import axios from 'axios';

const url = import.meta.env.VITE_API_URL; 
const apiRequest = axios.create({
    baseURL: url,
    withCredentials: true,
});

export default apiRequest;
