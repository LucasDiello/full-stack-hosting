import axios from 'axios';

const url = import.meta.env.VITE_API_URL; 
const urlLocal = import.meta.env.VITE_API_URL_LOCAL;
console.log(url);
const apiRequest = axios.create({
    baseURL: urlLocal,
    withCredentials: true,
});

export default apiRequest;
