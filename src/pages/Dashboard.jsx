import { useState, useEffect } from "react";
import { DndContext } from "@dnd-kit/core";
import { initialJobs, columns } from "../data/initialData";
import JobCard from "../components/JobCard";
import KanbanColumn from "../components/KanbanColumn";
import AddJobModal from "../components/AddJobModal";
import { FaPlus } from "react-icons/fa";

export default function Dashboard() {
  // =========================================
  // 1. STATE MANAGEMENT (DATA PUSAT)
  // =========================================
  
  // State Utama: Daftar Lamaran (Jobs)
  // Logic: Coba ambil dari LocalStorage dulu. Kalau kosong/error, pake data bawaan (initialJobs).
  const [jobs, setJobs] = useState(() => {
    try {
      const saved = localStorage.getItem("magang-jobs");
      return saved ? JSON.parse(saved) : (initialJobs || []);
    } catch (error) {
      console.error("Gagal baca LocalStorage, reset ke default.", error);
      return initialJobs || [];
    }
  });

  // State UI: Kontrol Modal & Pencarian
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null); // Menyimpan data job yang sedang diedit (null = mode add)
  const [searchTerm, setSearchTerm] = useState("");
  const [activeId, setActiveId] = useState(null); // Untuk animasi drag-and-drop
 
  // =========================================
  // 2. SIDE EFFECTS (PENJAGA)
  // =========================================


  useEffect(() => {
    const savedJobs = localStorage.getItem("magang-jobs");
    if (savedJobs) {
      setJobs(JSON.parse(savedJobs));
    }
  }, []); // <--- Kurung siku kosong artinya kerja sekali doang pas awal

  // Auto-Save: Setiap kali 'jobs' berubah, simpan ke LocalStorage biar data gak ilang pas refresh.
  useEffect(() => {
    localStorage.setItem("magang-jobs", JSON.stringify(jobs));
  }, [jobs]);

  // =========================================
  // 3. HANDLERS (LOGIC & ACTION)
  // =========================================

  // A. Logic Hapus Data
  const handleDeleteJob = (idYangMauDihapus) => {
    if (window.confirm("Yakin mau hapus lamaran ini?")) {
      setJobs((prev) => prev.filter((job) => job.id !== idYangMauDihapus));
    }
  };

  // B. Logic Tambah / Edit Data (Jantung Aplikasi)
  // Fungsi ini dipanggil oleh Child (AddJobModal) saat tombol 'Simpan' ditekan.
  // 6
  const handleSaveJob = (jobData) => {
    if (editingJob) {
      // --- JALUR EDIT (UPDATE) ---
      // User sedang mengedit data lama.
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          // Cari job yang ID-nya sama, lalu GABUNGKAN data lama (...job) dengan data baru (...jobData).
          // PENTING: Spread operator (...job) di kiri menjaga ID dan Date lama agar tidak hilang.
          job.id === editingJob.id ? { ...job, ...jobData } : job
        )
      );
      setEditingJob(null); // Reset mode edit setelah selesai. //7
    } else {
      // --- JALUR BARU (ADD) ---
      // User menambah data baru. Kita perlu bikin ID dan Tanggal baru manual.
      const newJob = {
        ...jobData, // Ambil data dari form (Company, Position, dll)
        id: Date.now(), // Generate ID unik pakai waktu sekarang
        date: new Date().toLocaleDateString("id-ID"), // Tanggal hari ini
      };
      setJobs((prev) => [newJob, ...prev]); // Masukkan data baru di urutan paling atas.
    }
    
    setIsModalOpen(false); // Tutup modal setelah selesai.
  };

  // C. Logic Drag & Drop (Kanban)
  const handleDragStart = (event) => setActiveId(event.active.id);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return; // Kalau didrop di luar kolom, batalkan.

       const jobId = parseInt(active.id); // ID Kartu yang diangkat
       const newStatus = over.id; // Nama Kolom tujuan (Status Baru)

    // Update status job yang digeser
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.id === jobId ? { ...job, status: newStatus } : job
      )
    );
    setActiveId(null);
  };

  // D. Logic Buka Modal (Helper)
  const openAddModal = () => {
    setEditingJob(null); // Pastikan mode edit mati (null) saat tombol 'New Job' ditekan
    setIsModalOpen(true);
  };


  const openEditModal = (job) => {
    setEditingJob(job); // Simpan job yang mau diedit
    setIsModalOpen(true);
  };


  // const SearchJob = (job) => {
  //   if (searchTerm === "") {
  //     return true;
  //   }

  //   return job.company.toLowerCase().includes(searchTerm.toLowerCase());
    
  // }

  // =========================================
  // 4. RENDERING (TAMPILAN)
  // =========================================
  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <div className="p-6 h-full flex flex-col">
        {/* Header Dashboard */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Kanban Board</h1>
            <p className="text-sm text-gray-500">Geser kartu untuk update status.</p>
          </div>

          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Cari perusahaan..."
              className="p-2 border border-gray-300 rounded-lg w-full max-w-xs outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            {/* Tombol New Job */}
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 shadow-lg transition-all"
            >
              <FaPlus /> New Job
            </button>
          </div>
        </div>

        {/* Kanban Columns Container */}
        <div className="flex gap-4 overflow-x-auto pb-4 h-full items-start">
          {columns.map((colTitle) => (
            <KanbanColumn
              key={colTitle}
              id={colTitle}
              title={colTitle}
              count={jobs.filter((j) => j.status === colTitle).length}
            >
              {jobs
                .filter((job) => job.status === colTitle) // Filter by Column
                .filter((job) =>
                  job.company.toLowerCase().includes(searchTerm.toLowerCase()) || // Filter by Search 
                  job.position.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onDelete={handleDeleteJob}

                    // 2
                    onEdit={() => openEditModal(job)} // Panggil fungsi helper edit
                  />
                ))}
            </KanbanColumn>
          ))}
        </div>

        {/* Modal Form */}
        {/* Props Drilling: Kirim state & handler ke Anak */}

        {/* 3 */}
        <AddJobModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveJob} // Aku ganti nama props jadi 'onSave' biar lebih intuitif
          initialData={editingJob}
        />
      </div>
    </DndContext>
  );
}