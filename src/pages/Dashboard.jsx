import { useState, useEffect } from "react";
import { DndContext, DragOverlay } from "@dnd-kit/core"; 
import { initialJobs, columns } from "../data/initialData";
import JobCard from "../components/JobCard";
import KanbanColumn from "../components/KanbanColumn"; 
import { FaPlus } from "react-icons/fa";

export default function Dashboard() {
  const [jobs, setJobs] = useState(() => {
    const saved = localStorage.getItem("magang-jobs");
    return saved ? JSON.parse(saved) : initialJobs;
  });

  useEffect(() => {
  localStorage.setItem("magang-jobs", JSON.stringify(jobs));
}, [jobs]);

  const [activeId, setActiveId] = useState(null); 


  // --- LOGIC: SAAT KARTU DILEPAS (DROP) ---
  const handleDragEnd = (event) => {
    const { active, over } = event;

    // active.id = ID Kartu (misal: "1")
    // over.id = ID Kolom tujuan (misal: "Interview")

    if (!over) return; // Kalo dilepas di luar angkasa, batalin.

    const jobId = parseInt(active.id); // Ubah string "1" jadi number 1
    const newStatus = over.id; // Status baru = Nama Kolom

    // Update State
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.id === jobId ? { ...job, status: newStatus } : job
      )
    );
    
    setActiveId(null); // Reset
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDeleteJob = (Id) => {
    if(window.confirm('Yakin mau hapus lamaran ini?')) {
        setJobs((prev) => prev.filter(job => job.id !== jobId))
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
        <div className="p-6 h-full flex flex-col">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800"> Kanban Board</h1>
                    <p className="text-sm text-gray-500">Geser kartu untuk update status lamaran.</p>
                </div>
                <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                    <FaPlus /> New Job
                </button>
            </div>

            {/* AREA KANBAN */}
            <div className="flex gap-4 overflow-x-auto pb-4 h-full items-start">
                {columns.map((colTitle) => (  // columns DAFTAR LABEL yang mau ditempel di rak (Wishlist, Applied, Interview).
                    <KanbanColumn 
                        key={colTitle} 
                        id={colTitle} 
                        title={colTitle}
                        count={jobs.filter(j => j.status === colTitle).length}
                    >   
                        {jobs  // TUMPUKAN PAKET yang berserakan
                            .filter((job) => job.status === colTitle)
                            .map((job) => (
                                <JobCard key={job.id} job={job} /> // JobCard PAKET satuannya.
                            ))
                        }

                        <jobCard 
                            key={job.id}
                            job={id}
                            onDelete={handleDeleteJob}
                        />
                    </KanbanColumn> // KERANJANG/RAK fisiknya.
                ))}
            </div>
     
         
        </div>
    </DndContext>
  );
}