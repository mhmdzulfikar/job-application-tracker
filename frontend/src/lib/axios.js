import axios from 'axios';

// Kita kasih tau Axios alamat pabrik Backend lu
const api = axios.create({
    baseURL: 'job-application-tracker-9j3l.vercel.app',
});

export default api;