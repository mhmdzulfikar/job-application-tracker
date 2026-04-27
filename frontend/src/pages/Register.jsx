import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaUserPlus, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';
import api from '../../src/lib/axios';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Tambahan: Biar ada efek loading

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setMessage('');
        setError('');
        setIsLoading(true);

        try {
            const response = await api.post('/auth/register', formData);
            setMessage(response.data.message); 
            setFormData({ name: '', email: '', password: '' });
            
            // Pindah ke login setelah 1.5 detik biar user sempet baca pesan suksesnya
            setTimeout(() => {
                navigate("/login");
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.error || 'Gagal mendaftar!');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        /* WRAPPER UTAMA: Dark mode ready dengan efek ambient glow */
        <div className="relative flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-hidden px-4">
            
            {/* --- EFEK CAHAYA BACKGROUND (AMBIENT GLOW) --- */}
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-indigo-500/20 dark:bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-500/20 dark:bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none"></div>

            {/* --- KARTU REGISTER --- */}
            <div className="w-full max-w-md p-8 md:p-10 space-y-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 relative z-10 animate-fade-in">
                
                {/* HEADER */}
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-blue-500/30">
                            <FaUserPlus className="ml-1" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Mulai Perjalanan
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                        Buat akun MagangHunter secara gratis.
                    </p>
                </div>
                
                {/* NOTIFIKASI MAHAL (SUKSES & ERROR) */}
                {message && (
                    <div className="flex items-center gap-3 p-4 text-sm text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl animate-fade-in">
                        <FaCheckCircle className="text-lg shrink-0" />
                        <p>{message} Mengalihkan ke halaman Login...</p>
                    </div>
                )}
                {error && (
                    <div className="flex items-center gap-3 p-4 text-sm text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl animate-shake">
                        <FaExclamationCircle className="text-lg shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* INPUT NAMA */}
                    <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Nama Lengkap
                        </label>
                        <input 
                            type="text" name="name" required
                            value={formData.name} onChange={handleChange}
                            className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            placeholder="Zulfikar"
                        />
                    </div>

                    {/* INPUT EMAIL */}
                    <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Email
                        </label>
                        <input 
                            type="email" name="email" required
                            value={formData.email} onChange={handleChange}
                            className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            placeholder="bos@maganghunter.com"
                        />
                    </div>

                    {/* INPUT PASSWORD */}
                    <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Password
                        </label>
                        <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                name="password" required
                                value={formData.password} onChange={handleChange}
                                className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all pr-12"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 px-4 flex items-center text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus:outline-none"
                            >
                                {showPassword ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
                            </button>
                        </div>
                    </div>

                    {/* TOMBOL DAFTAR */}
                    <div className="pt-2">
                        <button 
                            type="submit" disabled={isLoading}
                            className="w-full flex justify-center items-center py-3.5 px-4 font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl transition-all shadow-lg shadow-blue-500/30 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Mendaftarkan...
                                </span>
                            ) : (
                                'Buat Akun Sekarang'
                            )}
                        </button>
                    </div>
                </form>

                {/* LINK KE LOGIN */}
                <p className="text-sm text-center text-slate-600 dark:text-slate-400 font-medium">
                    Sudah punya akun?{' '}
                    <Link to="/login" className="text-indigo-600 dark:text-indigo-400 hover:underline hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors font-bold">
                        Masuk di sini
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;