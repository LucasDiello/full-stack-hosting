import axios from 'axios';

const apiRequest = axios.create({
    baseURL: 'https://full-stack-hosting.onrender.com/api',
    withCredentials: true,
})

export default apiRequest;
