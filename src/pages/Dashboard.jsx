import { useState, useEffect } from "react";
import { DndContext } from "@dnd-kit/core";
import { initialJobs, columns } from "../data/initialData";
import JobCard from "../components/JobCard";
import KanbanColumn from "../components/KanbanColumn";
import AddJobModal from "../components/AddJobModal";
import { FaPlus, FaMagnifyingGlass } from "react-icons/fa6"; 
import JobModal from "../components/JobModal";
import EmptyState from "../components/EmptyState";

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
  const [selectedJob, setSelectedJob] = useState(null);
 
  // =========================================
  // 2. SIDE EFFECTS (PENJAGA)
  // =========================================

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

  // E. Logic Simpan Detail Edit dari Modal JobModal
  const handleSaveJobDetails = (updatedJob) => {
    // Cari kartu yang lama, ganti sama kartu yang baru diedit
    const newJobs = jobs.map(j => j.id === updatedJob.id ? updatedJob : j);
    setJobs(newJobs);
    localStorage.setItem("magang-jobs", JSON.stringify(newJobs)); // Update ke Gudang
};

  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <div className="p-6 h-full flex flex-col">
        {/* Header Dashboard */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Kanban Board</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Geser kartu untuk update status.</p>
          </div>

          <div className="flex gap-4" > 
            <div className="relative w-full max-w-xs">
                <input
                  type="text"
                  placeholder="Cari perusahaan..."
                  value={searchTerm} // Pastikan value terikat ke state
                  className="py-4 px-6 border border-gray-300 rounded-lg w-full outline-none focus:ring-2 focus:ring-indigo-500"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                {/* Ikon hanya muncul JIKA searchTerm kosong */}
                {!searchTerm && (
                  <FaMagnifyingGlass 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" 
                  />
                )}
              </div>
            
            {/* Tombol New Job */}
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 shadow-lg transition-all"
            >
              <FaPlus /> New Job
            </button>
          </div>
        </div>

        {/* Kanban Columns Container */}
       {/* Kanban Columns Container ATAU Empty State */}
        {jobs.length === 0 ? (
            // JIKA KOSONG: Munculin Empty State di tengah layar
            <div className="flex-1 flex items-center justify-center">
                <EmptyState 
                    title="Papan Kanban Masih Kosong"
                    message="Lu belum masukin data lamaran sama sekali. Yuk mulai catat perjuangan lu nembus perusahaan impian!"
                    actionText="+ Tambah Lamaran Perdana"
                    onAction={openAddModal} 
                />
            </div>
        ) : (
            // JIKA ADA ISINYA: Munculin Papan Kanban beserta kolom-kolomnya
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
                                job.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                job.position.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .map((job) => (
                                <JobCard
                                    key={job.id}
                                    job={job}
                                    onDelete={handleDeleteJob}
                                    onCardClick={() => setSelectedJob(job)}
                                    onEdit={() => openEditModal(job)} 
                                />
                            ))}
                    </KanbanColumn>
                ))}
            </div>
        )}

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

      {/* KALAU ADA KARTU YANG DIKLIK, MUNCULIN MODAL */}
      {selectedJob && (
          <JobModal 
              job={selectedJob} 
              onClose={() => setSelectedJob(null)} 
              onSave={handleSaveJobDetails} 
          />
      )}
    </DndContext>
  );
}