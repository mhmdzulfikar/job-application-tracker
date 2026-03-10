import axios from 'axios';

// Kita kasih tau Axios alamat pabrik Backend lu
const api = axios.create({
    baseURL: 'https://job-application-tracker-9j3l.vercel.app/api',
});

export default api;