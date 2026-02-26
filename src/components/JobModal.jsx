import { useState, useEffect } from "react";
import { FaTimes, FaLink, FaCalendarAlt, FaStickyNote } from "react-icons/fa";

export default function JobModal({ job, onClose, onSave }) {
  // Bikin fotokopi data buat diedit sementara di Pop-Up
  const [formData, setFormData] = useState({ ...job });

  // Fungsi nangkep ketikan user
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Fungsi pas tombol "Simpan" diklik
  const handleSubmit = (e) => {
    e.preventDefault(); // Biar web ga me-refresh
    onSave(formData); // Kirim data baru ke Bos Besar (Board.jsx)
    onClose(); // Tutup pop-up
  };

  return (
    // 1. KAIN GELAP PENUTUP LAYAR (Z-50)
    <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in p-4"
        onClick={onClose} // Klik kain gelap = Tutup pop-up
    >
      {/* 2. KOTAK POP-UP UTAMA */}
      <div 
        className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-2xl shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()} // KLIK DISINI GA BAKAL NUTUP POP-UP
      >
        {/* HEADER POP-UP */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-gray-700">
            <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{job.position}</h2>
                <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{job.company}</p>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                <FaTimes size={18} />
            </button>
        </div>

        {/* FORM ISIAN */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
            
            {/* Input Link Lowongan */}
            <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    <FaLink className="text-gray-400" /> Link Lowongan / Portal
                </label>
                <input 
                    type="url" 
                    name="url"
                    value={formData.url || ""}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/..."
                    className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
            </div>

            {/* Input Jadwal Interview */}
            <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    <FaCalendarAlt className="text-gray-400" /> Tanggal Interview / Test
                </label>
                <input 
                    type="datetime-local" 
                    name="interviewDate"
                    value={formData.interviewDate || ""}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
            </div>

            {/* Input Catatan Rahasia */}
            <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    <FaStickyNote className="text-gray-400" /> Catatan Tambahan
                </label>
                <textarea 
                    name="notes"
                    value={formData.notes || ""}
                    onChange={handleChange}
                    rows="3"
                    placeholder="HRD-nya namanya Bapak Budi. Test teknikal soal React Hooks..."
                    className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                ></textarea>
            </div>

            {/* TOMBOL SIMPAN */}
            <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    Batal
                </button>
                <button type="submit" className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors">
                    Simpan Perubahan
                </button>
            </div>
        </form>

      </div>
    </div>
  );
}