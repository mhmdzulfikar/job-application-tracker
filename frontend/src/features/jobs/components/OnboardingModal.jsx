import { useState, useEffect } from "react";
import { FaRocket } from "react-icons/fa";
import api from "../../../lib/axios"; // 👈 Import kurir Axios kita

export default function OnboardingModal({ onComplete }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", target_role: "" });
  const [isLoading, setIsLoading] = useState(true);

  // Cek ke Backend pas pertama kali load
  useEffect(() => {
    const checkProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        // 1. Nanya ke Backend pakai Token JWT
        const response = await api.get('/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const userData = response.data.user;

        // 2. Kalau Posisi Impian (target_role) belum diisi, buka pop-up!
        // (Kita tampilin nama yang udah dia daftarin pas Register)
        if (!userData.target_role) {
          setFormData({ name: userData.name || "", target_role: "" });
          setIsOpen(true); 
        }
      } catch (error) {
        console.error("Gagal ngecek profil dari server:", error);
      } finally {
        setIsLoading(false); // Selesai loading
      }
    };

    checkProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.target_role.trim()) return;

    try {
      const token = localStorage.getItem("token");
      
      // 3. Simpan data perubahannya ke Backend (Database Supabase)
      await api.put('/auth/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setIsOpen(false);
      
      // Kasih tau komponen bapaknya kalau udah selesai
      if (onComplete) onComplete(formData);
    } catch (error) {
      console.error("Server nolak simpen data:", error);
      alert("Waduh Bos, gagal nyimpen profil ke server!");
    }
  };

  // Kalau lagi loading ngecek ke server, atau pop-up ditutup, jangan tampilin apa-apa
  if (isLoading || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
        
        {/* Header Keren */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-center text-white">
          <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <FaRocket size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-1">Selamat Datang, Bos!</h2>
          <p className="text-indigo-100 text-sm">Sebelum mulai tempur, kenalan dulu yuk.</p>
        </div>

        {/* Form Input */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
              Nama Panggilan / Alias
            </label>
            <input
              type="text"
              placeholder="Cth: Budi"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
              Posisi Impian
            </label>
            <input
              type="text"
              placeholder="Cth: Frontend Developer"
              value={formData.target_role}
              onChange={(e) => setFormData({ ...formData, target_role: e.target.value })}
              className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-95 flex justify-center items-center gap-2"
          >
            Mulai Perjalanan <FaRocket size={14} />
          </button>
        </form>

      </div>
    </div>
  );
}