import { useState, useEffect } from 'react';
import { FaSave, FaDownload, FaUpload, FaTrash, FaExclamationTriangle } from "react-icons/fa";
import toast, { Toaster } from 'react-hot-toast';

export default function Settings() {
    const [profile, setProfile] = useState({name: "" , role: ""});

    useEffect(() => {
        const savedProfile = localStorage.getItem("magang-profile");
        if (savedProfile) {
            setProfile(JSON.parse(savedProfile));
        }
    }, []);
    
    const handleSaveProfile= (e) => {
        e.preventDefault();
        localStorage.setItem("magang-profile", JSON.stringify(profile));
        toast.success("Profile Berhasil di-update! Memuat ulang...");


        setTimeout(() => {
            window.location.reload();
        }, 1500);
    };

    const handleExportData = () => {
    const dataToBackup = {
      profile: JSON.parse(localStorage.getItem("magang-profile") || "{}"),
      jobs: JSON.parse(localStorage.getItem("magang-jobs") || "[]"),
    };

    // Sulap JSON jadi File Beneran (Blob)
    const blob = new Blob([JSON.stringify(dataToBackup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    // Bikin link rahasia buat download
    const link = document.createElement("a");
    link.href = url;
    link.download = `Backup_MagangHunter_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Data berhasil diamankan! 🛡️");
  };

  // 4. HANDLER: IMPORT DATA (RESTORE)
  const handleImportData = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        
        // Masukin lagi ke Brankas (LocalStorage)
        if (importedData.profile) localStorage.setItem("magang-profile", JSON.stringify(importedData.profile));
        if (importedData.jobs) localStorage.setItem("magang-jobs", JSON.stringify(importedData.jobs));

        toast.success("Restorasi berhasil! Membangkitkan data... 🪄");
        setTimeout(() => window.location.reload(), 1500);
      } catch (error) {
        toast.error("Gagal! File JSON korup atau tidak valid.");
      }
    };
    reader.readAsText(file);
  };

  // 5. HANDLER: DANGER ZONE (RESET)
  const handleReset = () => {
    const confirmDelete = window.confirm(
      "YAKIN BOS?! 🚨\n\nSemua data lamaran dan profil lu bakal musnah dari muka bumi dan ngga bisa dibalikin lagi (kecuali lu punya file backup)."
    );

    if (confirmDelete) {
      localStorage.removeItem("magang-jobs");
      localStorage.removeItem("magang-profile");
      window.location.href = "/"; // Lempar balik ke depan biar disuruh Onboarding lagi
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto animate-fade-in">
      <Toaster position="top-right" />
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Pengaturan Sistem</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Atur profil dan amankan data lamaran Kamu di sini.</p>
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
                value={profile.name || ""}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Target Posisi</label>
              <input
                type="text"
                value={profile.role || ""}
                onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                required
              />
            </div>
            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition-all shadow-md active:scale-95">
              <FaSave /> Simpan Perubahan
            </button>
          </form>
        </div>

        {/* --- KARTU 2 & 3: BACKUP DAN DANGER ZONE --- */}
        <div className="space-y-6">
            
            {/* KARTU 2: BACKUP & RESTORE */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">📦 Backup & Restore</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    Data Kamu disimpen di browser ini. Download backup biar aman kalau ganti laptop atau hapus history.
                </p>
                
                <div className="flex flex-col gap-3">
                    <button onClick={handleExportData} className="w-full flex items-center justify-center gap-2 bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 py-3 rounded-xl font-bold transition-all">
                        <FaDownload /> Download Data (JSON)
                    </button>
                    
                    {/* Tombol Upload File Beneran (Pakai label biar elegan) */}
                    <label className="w-full flex items-center justify-center gap-2 bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 py-3 rounded-xl font-bold transition-all cursor-pointer">
                        <FaUpload /> Upload Backup (JSON)
                        <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
                    </label>
                </div>
            </div>

            {/* KARTU 3: DANGER ZONE */}
            <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl p-6 border border-red-200 dark:border-red-900/30">
                <h2 className="text-lg font-bold text-red-700 dark:text-red-500 mb-2 flex items-center gap-2">
                    <FaExclamationTriangle /> Danger Zone
                </h2>
                <p className="text-xs text-red-600/80 dark:text-red-400/80 mb-4">
                    Peringatan: Tindakan ini akan menghapus permanen seluruh data lamaran dan profil Kamu dari browser ini.
                </p>
                <button onClick={handleReset} className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold transition-all shadow-md active:scale-95">
                    <FaTrash /> Hapus Semua Data
                </button>
            </div>

        </div>
      </div>
    </div>
  );

}