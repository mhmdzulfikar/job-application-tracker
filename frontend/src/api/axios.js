import axios from 'axios';

// Kita kasih tau Axios alamat pabrik Backend lu
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

export default api;