import { useState, useEffect } from 'react';
import { FaSave, FaDownload, FaSignOutAlt, FaExclamationTriangle } from "react-icons/fa";
import toast, { Toaster } from 'react-hot-toast';
import api from '../../src/lib/axios'; 
import { useNavigate } from 'react-router-dom';

export default function Settings() {
    // Sesuaikan nama variabel dengan database: target_role
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

                // Nanya ke Supabase lewat Node.js
                const response = await api.get('/auth/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Masukin data dari server ke state React
                setProfile({
                    name: response.data.user.name || "",
                    target_role: response.data.user.target_role || ""
                });
            } catch (error) {
                toast.error("Gagal ngambil data dari brankas server! 🚨");
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
            
            // Ngirim data baru ke Node.js buat disimpen ke Supabase
            await api.put('/auth/profile', profile, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            toast.success("Profile Berhasil diamankan di Cloud! ☁️🚀");
        } catch (error) {
            toast.error("Gagal nyimpen profile ke server!");
        }
    };

    // ==========================================
    // 3. BACKUP DATA DARI DATABASE
    // ==========================================
    const handleExportData = async () => {
        try {
            const token = localStorage.getItem("token");
            
            // Ambil data terbaru dari 2 tabel di database sekaligus!
            const profileRes = await api.get('/auth/profile', { headers: { Authorization: `Bearer ${token}` } });
            const jobsRes = await api.get('/jobs', { headers: { Authorization: `Bearer ${token}` } });

            const dataToBackup = {
                profile: profileRes.data.user,
                jobs: jobsRes.data
            };

            // Sulap JSON jadi File Beneran (Blob)
            const blob = new Blob([JSON.stringify(dataToBackup, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement("a");
            link.href = url;
            link.download = `Backup_MagangHunter_Cloud_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.success("Data dari Database berhasil didownload! 🛡️");
        } catch (error) {
            toast.error("Gagal nge-backup data dari server.");
        }
    };

    // ==========================================
    // 4. LOGOUT (Gantiin Reset)
    // ==========================================
    const handleLogout = () => {
        const confirmLogout = window.confirm("Yakin mau keluar akun Bos? 🚪");

        if (confirmLogout) {
            // Hapus tiket masuk dari dompet browser
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            
            toast.success("Berhasil keluar. Sampai jumpa lagi!");
            
            // Lempar balik ke halaman Login
            setTimeout(() => {
                navigate('/login');
            }, 1000);
        }
    };

    
  // ==============================
  // LOADING SCREEN
  // ==============================

  if (isLoading) {
  return (
    // Gunakan h-screen agar benar-benar setinggi layar penuh (Viewport Height)
    <div className="flex flex-col gap-4 items-center justify-center h-screen w-full">
      
      {/* Container Bar Loading */}
      <div className="w-48 h-1.5 bg-slate-700 rounded-full overflow-hidden relative">
        {/* Bar yang bergerak (Pastikan animasi 'loading' sudah ada di tailwind.config.js) */}
        <div className="absolute bg-[#006BFF] h-full w-24 animate-[loading_1.5s_ease-in-out_infinite] rounded-full"></div>
      </div>

      {/* Teks diletakkan di luar bar agar tidak ikut terpotong/h-1.5 */}
      <p className="text-slate-400 text-sm font-medium animate-pulse">
        Memuat data...
      </p>
      
    </div>
  );
}

    return (
        <div className="p-6 max-w-4xl mx-auto animate-fade-in">
            <Toaster position="top-right" />
            
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Pengaturan Sistem Cloud</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Atur profil dan amankan akun Kamu di sini.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* --- KARTU 1: EDIT PROFIL --- */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                         Identitas Bos
                    </h2>
                    <form onSubmit={handleSaveProfile} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Nama Panggilan</label>
                            <input
                                type="text"
                                value={profile.name}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Target Posisi (Role)</label>
                            <input
                                type="text"
                                value={profile.target_role}
                                onChange={(e) => setProfile({ ...profile, target_role: e.target.value })}
                                className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                required
                            />
                        </div>
                        <button type="submit" className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition-all shadow-md active:scale-95">
                            <FaSave /> Simpan ke Database
                        </button>
                    </form>
                </div>

                {/* --- KARTU 2 & 3: BACKUP DAN KELUAR AKUN --- */}
                <div className="space-y-6">
                    
                    {/* KARTU 2: BACKUP CLOUD */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">📦 Backup Data Server</h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                            Data Kamu sekarang udah aman di server Supabase! Tapi kalau mau simpan salinannya di laptop, klik tombol ini.
                        </p>
                        
                        <div className="flex flex-col gap-3">
                            <button onClick={handleExportData} className="w-full flex items-center justify-center gap-2 bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 py-3 rounded-xl font-bold transition-all">
                                <FaDownload /> Download Data dari Server
                            </button>
                            {/* Tombol Import gua hapus, karena di sistem Cloud, import data massal butuh API khusus yang kompleks */}
                        </div>
                    </div>

                    {/* KARTU 3: LOGOUT */}
                    <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl p-6 border border-red-200 dark:border-red-900/30">
                        <h2 className="text-lg font-bold text-red-700 dark:text-red-500 mb-2 flex items-center gap-2">
                            <FaExclamationTriangle /> Keluar Akun
                        </h2>
                        <p className="text-xs text-red-600/80 dark:text-red-400/80 mb-4">
                            Sistem kita sekarang pakai Cloud. Data lu ngga akan hilang kalau lu keluar. Lu tinggal login lagi buat akses datanya.
                        </p>
                        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white py-3 rounded-xl font-bold transition-all active:scale-95">
                            <FaSignOutAlt /> Keluar Aplikasi
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}