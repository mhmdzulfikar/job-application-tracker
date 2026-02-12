import { useState } from "react";
import { FaTimes } from "react-icons/fa";

// Terima props: isOpen (buka/tutup), onClose (fungsi tutup), onAdd (fungsi nambah data)
export default function AddJobModal({ isOpen, onClose, onAdd }) {
  // State untuk form input
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    salary: "",
    status: "Wishlist" // Default masuk ke Wishlist dulu
  });

  // Kalau isOpen false, jangan tampilkan apa-apa (return null)
  if (!isOpen) return null;

  // Logic pas tombol Simpan ditekan
  const handleSubmit = (e) => {
    e.preventDefault(); // Biar gak reload halaman
    
    // Kirim data ke Bapak (Dashboard)
    onAdd(formData); 
    
    // Reset Form jadi kosong lagi
    setFormData({ company: "", position: "", salary: "", status: "Wishlist" });
    
    // Tutup Modal
    onClose();
  };

  return (
    // Overlay Hitam (Background)
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      
      {/* Kotak Putih (Modal) */}
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in">
        
        {/* Header Modal */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Tambah Lamaran 💼</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500">
            <FaTimes />
          </button>
        </div>

        {/* Form Input */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Perusahaan</label>
            <input 
              required
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Contoh: Tokopedia"
              value={formData.company}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Posisi</label>
            <input 
              required
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Contoh: Frontend Intern"
              value={formData.position}
              onChange={(e) => setFormData({...formData, position: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gaji (Opsional)</label>
                <input 
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Contoh: 5jt"
                  value={formData.salary}
                  onChange={(e) => setFormData({...formData, salary: e.target.value})}
                />
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status Awal</label>
                <select 
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                    <option value="Wishlist">Wishlist</option>
                    <option value="Applied">Applied</option>
                </select>
             </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all mt-2"
          >
            Simpan Lamaran 
          </button>
        </form>
      </div>
    </div>
  );
}