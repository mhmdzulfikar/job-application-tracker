import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Sesuaikan URL backend lu
    withCredentials: true // KUNCI SAKTI FRONTEND (Wajib true biar cookie kebawa)
});

export default api;