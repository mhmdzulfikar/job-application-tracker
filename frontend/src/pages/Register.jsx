import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import api from '../../src/lib/axios';

const Register = () => {

    const navigate = useNavigate();
    // State buat nangkep ketikan user
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Fungsi pas user ngetik di kotak input
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Fungsi pas tombol "Daftar" diklik
    const handleSubmit = async (e) => {
        e.preventDefault(); // Biar halaman ngga ke-refresh
        setMessage('');
        setError('');

        try {
            const response = await api.post('/auth/register', formData);
            setMessage(response.data.message); // Nangkep pesan sukses dari Node.js
            setFormData({ name: '', email: '', password: '' });
             alert("Registration Successful! Please Login.");
             navigate("/login");
        } catch (err) {
            setError(err.response?.data?.error || 'Gagal mendaftar!');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-900">Daftar MagangHunter</h2>
                
                {/* Notifikasi Sukses/Error */}
                {message && <div className="p-3 text-sm text-green-700 bg-green-100 rounded">{message}</div>}
                {error && <div className="p-3 text-sm text-red-700 bg-red-100 rounded">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* 1. INPUT NAMA LENGKAP (USERNAME) */}
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Nama Lengkap</label>
                        <input 
                            type="text" 
                            name="name" // Pastikan name="name" sesuai dengan key di state formData
                            required
                            value={formData.name} 
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="John Doe"
                        />
                    </div>

                    {/* 2. INPUT EMAIL */}
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Email</label>
                        <input 
                            type="email" 
                            name="email" // Pastikan name="email"
                            required
                            value={formData.email} 
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="john@example.com"
                        />
                    </div>

                    {/* 3. INPUT PASSWORD DENGAN SHOW/HIDE */}
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Password</label>
                        <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                name="password" // WAJIB ADA supaya password tidak hilang saat handleSubmit
                                required
                                value={formData.password} 
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-blue-600"
                            >
                               {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Daftar Sekarang
                    </button>

                    <p className="text-sm text-center text-gray-600">
                                       Do you have account?{' '}
                                        <Link to="/login" className="font-medium text-blue-600 hover:underline">
                                            Login here
                                        </Link>
                                    </p>
                </form>

                
            </div>
        </div>
    );
};

export default Register;