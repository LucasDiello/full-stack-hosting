import axios from 'axios';

const apiRequest = axios.create({
    baseURL: 'https://aluguejahotel.vercel.app',
    withCredentials: true,
})

export default apiRequest;
