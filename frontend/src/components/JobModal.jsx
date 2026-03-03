import { useState } from "react";
import { FaTimes, FaLink, FaCalendarAlt, FaPlus, FaTrash } from "react-icons/fa";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css'; 

export default function JobModal({ job, onClose, onSave }) {
  // 1. STATE BUNDLE (Termasuk fallback kalau data lama belum punya tasks/notes)
  const [formData, setFormData] = useState({ 
    ...job,
    tasks: job.tasks || [], // Wadah buat Sub-Tasks
    notes: job.notes || ""  // Wadah buat Rich Text HTML
  });

  // State khusus buat ngetik sub-task baru
  const [newTaskText, setNewTaskText] = useState("");

  // 2. HANDLER TEXT INPUT BIASA (Link & Date)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. HANDLER KHUSUS REACT QUILL
  // Quill ngga pakai (e.target.value), dia langsung nge-return string HTML-nya
  const handleNotesChange = (value) => {
    setFormData({ ...formData, notes: value });
  };

  // ==========================================
  // 4. LOGIKA SUB-TASKS (NESTED STATE)
  // ==========================================
  const handleAddTask = (e) => {
    e.preventDefault(); // Biar pas enter ga nutup modal
    if (!newTaskText.trim()) return;

    const newTask = {
      id: Date.now(),
      text: newTaskText,
      isCompleted: false
    };

    setFormData({
      ...formData,
      tasks: [...formData.tasks, newTask] // Masukin task baru ke dalam array tasks
    });
    setNewTaskText(""); // Kosongin input setelah ditambah
  };

  const handleToggleTask = (taskId) => {
    setFormData({
      ...formData,
      tasks: formData.tasks.map(t =>
        t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
      )
    });
  };

  const handleDeleteTask = (taskId) => {
    setFormData({
      ...formData,
      tasks: formData.tasks.filter(t => t.id !== taskId)
    });
  };
  // ==========================================

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  // Settingan Menu di atas Editor (Biar ngga keramean)
  const quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link', 'clean']
    ],
  };

  return (
    // Kain Gelap (Background)
    <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4"
        onClick={onClose} 
    >
      {/* Kotak Modal (Dikasih max-h-[90vh] dan overflow-y-auto biar bisa discroll kalau kepanjangan) */}
      <div 
        className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()} 
      >
        {/* HEADER FIXED */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-gray-700 shrink-0">
            <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{job.position}</h2>
                <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{job.company}</p>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                <FaTimes size={18} />
            </button>
        </div>

        {/* BODY SCROLLABLE */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
            
            {/* --- BAGIAN 1: INFO DASAR (Grid 2 Kolom) --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        <FaLink className="text-gray-400" /> Link Lowongan
                    </label>
                    <input 
                        type="url" name="url" value={formData.url || ""} onChange={handleChange}
                        placeholder="https://..."
                        className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        <FaCalendarAlt className="text-gray-400" /> Tanggal Interview
                    </label>
                    <input 
                        type="datetime-local" name="interviewDate" value={formData.interviewDate || ""} onChange={handleChange}
                        className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
            </div>

            <hr className="border-gray-100 dark:border-gray-700" />

            {/* --- BAGIAN 2: CHECKLIST PERSIAPAN (NESTED STATE) --- */}
            <div>
                <label className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3 block">
                    ✅ Checklist Persiapan ({formData.tasks.filter(t => t.isCompleted).length}/{formData.tasks.length})
                </label>
                
                {/* Input Tambah Task */}
                <div className="flex gap-2 mb-3">
                    <input 
                        type="text" 
                        value={newTaskText}
                        onChange={(e) => setNewTaskText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddTask(e)}
                        placeholder="Cth: Riset profil CEO..."
                        className="flex-1 p-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg text-sm dark:text-white focus:ring-indigo-500"
                    />
                    <button 
                        type="button" onClick={handleAddTask}
                        className="bg-indigo-100 text-indigo-600 hover:bg-indigo-200 px-4 rounded-lg flex items-center justify-center transition-colors"
                    >
                        <FaPlus size={14} />
                    </button>
                </div>

                {/* List Tasks */}
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {formData.tasks.length === 0 ? (
                        <p className="text-xs text-gray-400 italic text-center py-2">Belum ada target persiapan.</p>
                    ) : (
                        formData.tasks.map(task => (
                            <div key={task.id} className="flex items-center justify-between group bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg border border-gray-100 dark:border-gray-700">
                                <label className="flex items-center gap-3 cursor-pointer flex-1">
                                    <input 
                                        type="checkbox" 
                                        checked={task.isCompleted}
                                        onChange={() => handleToggleTask(task.id)}
                                        className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 cursor-pointer"
                                    />
                                    <span className={`text-sm ${task.isCompleted ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                        {task.text}
                                    </span>
                                </label>
                                <button 
                                    type="button" onClick={() => handleDeleteTask(task.id)}
                                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                >
                                    <FaTrash size={12} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <hr className="border-gray-100 dark:border-gray-700" />

            {/* --- BAGIAN 3: RICH TEXT EDITOR --- */}
            <div className="pb-4">
                <label className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-2 block">
                    📝 Catatan / Jurnal Rahasia
                </label>
                <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                    <ReactQuill 
                        theme="snow" 
                        value={formData.notes} 
                        onChange={handleNotesChange}
                        modules={quillModules}
                        placeholder="Tulis ringkasan obrolan sama HRD di sini..."
                        className="dark:text-white"
                    />
                </div>
            </div>

        </div>

        {/* FOOTER FIXED (TOMBOL SIMPAN) */}
        <div className="p-5 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 shrink-0 flex justify-end gap-3 rounded-b-2xl">
            <button type="button" onClick={onClose} className="px-5 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                Batal
            </button>
            <button type="button" onClick={handleSubmit} className="px-6 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md transition-colors">
                Simpan Perubahan
            </button>
        </div>

      </div>
    </div>
  );
}