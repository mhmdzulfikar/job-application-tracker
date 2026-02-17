import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

// Props:
// - isOpen: Apakah modal tampil? (Boolean)
// - onClose: Fungsi untuk menutup modal
// - onSave: Fungsi untuk mengirim data balik ke Dashboard (sebelumnya onAdd)
// - initialData: Data job yang mau diedit (Object atau Null)
export default function AddJobModal({ isOpen, onClose, onSave, initialData }) {
  
  // =========================================
  // 1. STATE & CONSTANTS
  // =========================================
  const defaultFormState = {
    company: "",
    position: "",
    salary: "",
    status: "Wishlist",
  };

  const [formData, setFormData] = useState(defaultFormState);

  // =========================================
  // 2. EFFECT (SINKRONISASI DATA)
  // =========================================
  
  // Logic: Setiap kali Modal dibuka (isOpen true) ATAU initialData berubah...
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // MODE EDIT: Isi form dengan data titipan dari Bapak
        setFormData(initialData);
      } else {
        // MODE ADD: Bersihkan form (Reset)
        setFormData(defaultFormState);
      }
    }
  }, [isOpen, initialData]);

  // =========================================
  // 3. HANDLERS
  // =========================================

  const handleSubmit = (e) => {
    e.preventDefault(); // Mencegah reload halaman browser

    // Validasi Sederhana
    if (!formData.company.trim() || !formData.position.trim()) {
      alert("Nama perusahaan dan posisi wajib diisi!");
      return;
    }

    // Kirim data formulir ke Dashboard
    onSave(formData);

    // Form akan di-reset otomatis oleh useEffect saat modal dibuka kembali nanti,
    // tapi kita bisa reset manual disini juga untuk kebersihan.
    setFormData(defaultFormState); 
  };

  // =========================================
  // 4. RENDERING
  // =========================================

  // Jika modal tertutup, jangan render apapun (Performance Optimization)
  if (!isOpen) return null;

  return (
    // Overlay (Background Gelap)
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm transition-opacity">
      
      {/* Modal Box (Kotak Putih) */}
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in transform scale-100">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {initialData ? "Edit Lamaran" : "Tambah Lamaran Baru"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <FaTimes />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Input Company */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Perusahaan</label>
            <input
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="Contoh: Tokopedia"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            />
          </div>

          {/* Input Position */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Posisi</label>
            <input
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="Contoh: Frontend Intern"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            />
          </div>

          {/* Input Salary & Status (Grid) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gaji (Opsional)</label>
              <input
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="Contoh: 5jt"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status Awal</label>
              <select
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white transition-all"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Wishlist">Wishlist</option>
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all mt-4 shadow-md hover:shadow-lg"
          >
            {initialData ? "Simpan Perubahan" : "Buat Lamaran Baru"}
          </button>
        </form>
      </div>
    </div>
  );
}