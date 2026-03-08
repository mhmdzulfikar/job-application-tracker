import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../src/lib/axios';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate(); // Ini supir kita buat pindah halaman

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Nembak API Login
            const response = await api.post('/auth/login', formData);
            
            // Simpan Token JWT ke dompet browser (Local Storage)
            localStorage.setItem('token', response.data.token);
            
            // Simpan juga data user (nama, role) biar gampang ditampilin di header nanti
            localStorage.setItem('user', JSON.stringify(response.data.user));

            alert("Login Sukses!");
            
            // Arahin langsung ke halaman Dashboard
            navigate('/dashboard'); 
        } catch (err) {
            setError(err.response?.data?.error || 'Gagal login! Cek lagi email/password lu.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-900">Masuk MagangHunter</h2>
                
                {error && <div className="p-3 text-sm text-red-700 bg-red-100 rounded">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Email</label>
                        <input 
                            type="email" name="email" required
                            value={formData.email} onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="john@example.com"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Password</label>
                        <input 
                            type="password" name="password" required
                            value={formData.password} onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="••••••••"
                        />
                    </div>
                    <button 
                        type="submit" disabled={isLoading}
                        className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                    >
                        {isLoading ? 'Mengecek brankas...' : 'Masuk Sekarang'}
                    </button>
                </form>

                {/* Tombol pindah ke halaman Register */}
                <p className="text-sm text-center text-gray-600">
                   Don't have an account yet?{' '}
                    <Link to="/register" className="font-medium text-blue-600 hover:underline">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;