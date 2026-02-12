import { useState, useEffect } from "react";
import { DndContext } from "@dnd-kit/core"; 
import { initialJobs, columns } from "../data/initialData";
import JobCard from "../components/JobCard";
import KanbanColumn from "../components/KanbanColumn"; 
import AddJobModal from "../components/AddJobModal"; 
import { FaPlus } from "react-icons/fa";

export default function Dashboard() {
  // 1. STATE: Tempat nyimpen data
  // Ganti bagian useState ini:
const [jobs, setJobs] = useState(() => {
  // Cek dulu, local storage aman gak?
  try {
    const saved = localStorage.getItem("magang-jobs");
    // Kalau ada saved, pake saved. Kalau gak, pake initialJobs.
    // PENTING: Kalo initialJobs juga rusak, pake Array Kosong [] biar gak crash.
    return saved ? JSON.parse(saved) : (initialJobs || []);
  } catch (error) {
    console.log("Error baca LocalStorage, reset data.");
    return initialJobs || [];
  }
});

  
  const [isModalOpen, setIsModalOpen] = useState(false); // State buat buka tutup modal
  const [activeId, setActiveId] = useState(null); 

  // 2. EFFECT: Penjaga yang kerja tiap ada perubahan
  useEffect(() => {
    localStorage.setItem("magang-jobs", JSON.stringify(jobs));
  }, [jobs]);


  // 3. LOGIC HAPUS
  const handleDeleteJob = (idYangMauDihapus) => {
    if(window.confirm('Yakin mau hapus lamaran ini?')) {
        // Filter: "Balikin semua job KECUALI yang ID-nya sama dengan idYangMauDihapus"
        setJobs((prev) => prev.filter(job => job.id !== idYangMauDihapus));
    }
  }

  // 4. LOGIC DRAG 
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    const jobId = parseInt(active.id);
    const newStatus = over.id;

    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.id === jobId ? { ...job, status: newStatus } : job 
      )
    );
    setActiveId(null);
  };

  const handleDragStart = (event) => setActiveId(event.active.id);

  // 5. LOGIC NAMBAH JOB (Dari Modal)
  const handleAddJob = (newJobData) => {
    const newJob = {
      ...newJobData,
      id: Date.now(), // ID unik berdasarkan timestamp
      ...newJobData,
      date: new Date().toLocaleDateString('id-ID'),
    };
    setJobs((prev) => [newJob, ...prev]); // Masukin data job baru ke paling depan (...prev(prev itu data lama.)))
    setIsModalOpen(false); // Tutup modalnya
  };

  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
        <div className="p-6 h-full flex flex-col">
            
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">📌 Kanban Board</h1>
                    <p className="text-sm text-gray-500">Geser kartu untuk update status.</p>
                </div>
                {/* Tombol buat BUKA modal (set true) */}
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 shadow-lg"
                >
                    <FaPlus /> New Job
                </button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 h-full items-start">
                {columns.map((colTitle) => (
                    <KanbanColumn 
                        key={colTitle} 
                        id={colTitle} 
                        title={colTitle}
                        count={jobs.filter(j => j.status === colTitle).length}
                    >
                        {/* INI BAGIAN PENTING: Rendering List */}
                        {jobs
                            .filter((job) => job.status === colTitle)
                            .map((job) => (
                                // Kita oper fungsi handleDeleteJob ke anak (JobCard)
                                // Biar tombol sampah di anak bisa berfungsi
                                <JobCard 
                                    key={job.id} 
                                    job={job} 
                                    onDelete={handleDeleteJob} 
                                />
                            ))
                        }
                    </KanbanColumn>
                ))}
            </div>
            
            {/* Modal ditaruh disini, dikasih props biar bisa komunikasi */}
            <AddJobModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddJob}
            />
        </div>
    </DndContext>
  );
}