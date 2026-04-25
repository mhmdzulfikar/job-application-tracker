import { useState, useEffect } from 'react';
import { FaSave, FaDownload, FaSignOutAlt, FaExclamationTriangle, FaUserCircle, FaBriefcase, FaCloudUploadAlt } from "react-icons/fa";
import toast, { Toaster } from 'react-hot-toast';
import api from '../../src/lib/axios'; 
import { useNavigate } from 'react-router-dom';

export default function Settings() {
    const [profile, setProfile] = useState({ name: "", target_role: "" });
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // ==========================================
    // 1. AMBIL DATA DARI DATABASE (GET)
    // ==========================================
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                const response = await api.get('/auth/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setProfile({
                    name: response.data.user.name || "",
                    target_role: response.data.user.target_role || ""
                });
            } catch (error) {
                toast.error("Gagal sinkronisasi data dari Cloud!");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);
    
    // ==========================================
    // 2. SIMPAN KE DATABASE (PUT)
    // ==========================================
    const handleSaveProfile = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            
            await api.put('/auth/profile', profile, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            toast.success("Identitas berhasil di-update!");
        } catch (error) {
            toast.error("Gagal menyimpan ke server Cloud!");
        }
    };

    // ==========================================
    // 3. BACKUP DATA DARI DATABASE
    // ==========================================
    const handleExportData = async () => {
        try {
            const token = localStorage.getItem("token");
            const profileRes = await api.get('/auth/profile', { headers: { Authorization: `Bearer ${token}` } });
            const jobsRes = await api.get('/jobs', { headers: { Authorization: `Bearer ${token}` } });

            const dataToBackup = {
                profile: profileRes.data.user,
                jobs: jobsRes.data
            };

            const blob = new Blob([JSON.stringify(dataToBackup, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement("a");
            link.href = url;
            link.download = `MagangHunter_Backup_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.success("Berhasil mengunduh Backup Data!");
        } catch (error) {
            toast.error("Gagal mengekspor data dari server.");
        }
    };

    // ==========================================
    // 4. LOGOUT 
    // ==========================================
    const handleLogout = () => {
        const confirmLogout = window.confirm("Yakin ingin mengakhiri sesi dan keluar?");
        if (confirmLogout) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            
            toast.success("Sesi diakhiri. Sampai jumpa!");
            setTimeout(() => {
                navigate('/login');
            }, 1000);
        }
    };

    // ==============================
    // LOADING SCREEN (MODERN SKELETON)
    // ==============================
    if (isLoading) {
        return (
            <div className="p-6 max-w-5xl mx-auto w-full flex flex-col gap-6 animate-pulse mt-10">
                <div className="h-8 bg-slate-200 rounded-md w-64 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded-md w-96 mb-8"></div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 h-96 bg-slate-100 rounded-3xl border border-slate-200"></div>
                    <div className="flex flex-col gap-6">
                        <div className="h-48 bg-slate-100 rounded-3xl border border-slate-200"></div>
                        <div className="h-40 bg-slate-100 rounded-3xl border border-slate-200"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] p-6 lg:p-12 font-sans selection:bg-indigo-200">
            <Toaster position="top-right"
                toastOptions={{
                    style: {
                        background: '#1E293B', // slate-800
                        color: '#fff',
                        borderRadius: '12px',
                        fontWeight: '500'
                    }
                }} 
            />
            
            <div className="max-w-5xl mx-auto animate-fade-in-up">
                {/* HEADER SECTION */}
                <div className="mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-indigo-50 text-indigo-600 font-semibold text-xs tracking-wide uppercase border border-indigo-100">
                        <FaCloudUploadAlt className="text-sm" /> Cloud Sync Active
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">Pengaturan Sistem</h1>
                    <p className="text-slate-500 text-lg">Kelola identitas kamu dan amankan data lamaranmu.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* --- KARTU 1: EDIT PROFIL (Porsi Lebih Lebar) --- */}
                    <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/40 border border-slate-200/60 relative overflow-hidden group">
                        {/* Dekorasi Glow */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        <div className="relative z-10">
                            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <span className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><FaUserCircle /></span>
                                Identitas Profil
                            </h2>
                            
                            <form onSubmit={handleSaveProfile} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Nama Tampilan</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                            <FaUserCircle />
                                        </div>
                                        <input
                                            type="text"
                                            value={profile.name}
                                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white outline-none transition-all"
                                            placeholder="Masukkan nama panggilanmu..."
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Target Posisi (Role Impian)</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                            <FaBriefcase />
                                        </div>
                                        <input
                                            type="text"
                                            value={profile.target_role}
                                            onChange={(e) => setProfile({ ...profile, target_role: e.target.value })}
                                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white outline-none transition-all"
                                            placeholder="Contoh: Fullstack Developer"
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div className="pt-4">
                                    <button type="submit" className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2">
                                        <FaSave className="text-indigo-400" /> Simpan Perubahan
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* --- KOLOM KANAN: BACKUP & DANGER ZONE --- */}
                    <div className="space-y-6">
                        
                        {/* KARTU 2: BACKUP CLOUD */}
                        <div className="bg-white rounded-3xl p-6 shadow-lg shadow-slate-200/40 border border-slate-200/60">
                            <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                                📦 Pencadangan Data
                            </h2>
                            <p className="text-sm text-slate-500 mb-5 leading-relaxed">
                                Data kamu aman terenkripsi di server. Unduh salinan lokal dalam format JSON untuk keperluan arsip.
                            </p>
                            
                            <button onClick={handleExportData} className="w-full flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 py-3 rounded-xl font-bold transition-all">
                                <FaDownload /> Unduh Backup Lokal
                            </button>
                        </div>

                        {/* KARTU 3: LOGOUT / DANGER ZONE */}
                        <div className="bg-white rounded-3xl p-6 shadow-lg shadow-slate-200/40 border border-red-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                            
                            <h2 className="text-lg font-bold text-red-600 mb-2 flex items-center gap-2 relative z-10">
                                <FaExclamationTriangle /> Zona Berbahaya
                            </h2>
                            <p className="text-sm text-slate-500 mb-5 leading-relaxed relative z-10">
                                Kamu akan keluar dari sesi saat ini. Akses menuju Kanban Board akan ditangguhkan hingga login berikutnya.
                            </p>
                            
                            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-white border-2 border-red-500 text-red-600 hover:bg-red-50 hover:border-red-600 py-3 rounded-xl font-bold transition-all relative z-10">
                                <FaSignOutAlt /> Keluar Aplikasi
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}