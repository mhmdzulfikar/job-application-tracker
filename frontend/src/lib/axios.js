import axios from 'axios';

// Kita kasih tau Axios alamat pabrik Backend lu
const api = axios.create({
  // Ubah URL Vercel jadi URL Node.js lu
  baseURL: 'http://localhost:5000/api', 
});

export default api;