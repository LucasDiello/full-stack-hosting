import axios from 'axios';

const apiRequest = axios.create({
    baseURL: 'https://aluguejahotel.onrender.com/api',
    withCredentials: true,
})

export default apiRequest;
