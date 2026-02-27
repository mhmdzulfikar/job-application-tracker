import { useState, useEffect } from "react";
import { DndContext } from "@dnd-kit/core";
import { initialJobs, columns } from "../data/initialData";
import JobCard from "../components/JobCard";
import KanbanColumn from "../components/KanbanColumn";
import AddJobModal from "../components/AddJobModal";
import JobModal from "../components/JobModal";
import EmptyState from "../components/EmptyState";
import { FaPlus, FaMagnifyingGlass, FaBell } from "react-icons/fa6";

export default function Dashboard() {

  // =========================================
  // 1. STATE MANAGEMENT
  // =========================================

  const [jobs, setJobs] = useState(() => {
    try {
      const saved = localStorage.getItem("magang-jobs");
      return saved ? JSON.parse(saved) : (initialJobs || []);
    } catch (error) {
      console.error("Gagal baca LocalStorage.", error);
      return initialJobs || [];
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeId, setActiveId] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  // =========================================
  // 2. AUTO SAVE
  // =========================================

  useEffect(() => {
    localStorage.setItem("magang-jobs", JSON.stringify(jobs));
  }, [jobs]);

  // =========================================
  // 3. HANDLERS
  // =========================================

  const handleDeleteJob = (id) => {
    if (window.confirm("Yakin mau hapus lamaran ini?")) {
      setJobs((prev) => prev.filter((job) => job.id !== id));
    }
  };

  const handleSaveJob = (jobData) => {
    if (editingJob) {
      // EDIT MODE
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.id === editingJob.id ? { ...job, ...jobData } : job
        )
      );
      setEditingJob(null);
    } else {
      // ADD MODE
      const newJob = {
        ...jobData,
        id: Date.now(),
        date: new Date().toLocaleDateString("id-ID"),
      };
      setJobs((prev) => [newJob, ...prev]);
    }

    setIsModalOpen(false);
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const jobId = Number(active.id);
    const newStatus = over.id;

    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.id === jobId ? { ...job, status: newStatus } : job
      )
    );

    setActiveId(null);
  };

  const openAddModal = () => {
    setEditingJob(null);
    setIsModalOpen(true);
  };

  const openEditModal = (job) => {
    setEditingJob(job);
    setIsModalOpen(true);
  };

  const handleSaveJobDetails = (updatedJob) => {
    setJobs((prevJobs) =>
      prevJobs.map((j) =>
        j.id === updatedJob.id ? updatedJob : j
      )
    );
  };

  // =========================================
  // 4. TODAY INTERVIEW CHECK
  // =========================================

  const todayInterviews = jobs.filter(job => {
    // 1. Skip kalau belum diisi tanggalnya
    if (!job.interviewDate) return false; 
    
    // Skip kalau kartunya udah di kolom Rejected atau Offer
    if (job.status === 'Rejected' || job.status === 'Offer') return false;

    const targetDate = new Date(job.interviewDate);
    const today = new Date();
    
    // 3. Reset jam biar presisi
    targetDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    // 4. Cek apakah harinya sama
    return targetDate.getTime() === today.getTime();
  });

  // =========================================
  // 5. RENDER
  // =========================================

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
    >
      <div className="p-6 h-full flex flex-col">
        
        {/* BANNER INTERVIEW (Udah dipindah ke dalem sini biar layoutnya rapi) */}
        {todayInterviews.length > 0 && (
          <div className="mb-6 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl p-4 shadow-lg flex items-center justify-between text-white animate-fade-in shrink-0">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-full animate-pulse">
                <FaBell size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">
                  Panggilan Perang Hari Ini! 🔥
                </h3>
                <p className="text-white/90 text-sm font-medium">
                  Lu punya{" "}
                  <span className="font-extrabold text-yellow-200">
                    {todayInterviews.length} jadwal interview/test
                  </span>{" "}
                  hari ini.
                </p>
              </div>
            </div>

            <div className="hidden md:flex gap-2">
              {todayInterviews.map((job) => (
                <span
                  key={job.id}
                  className="bg-white text-red-600 px-3 py-1 rounded-full text-xs font-bold shadow-sm"
                >
                  {job.company}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              Kanban Board
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Geser kartu untuk update status.
            </p>
          </div>

          <div className="flex gap-4">
            <div className="relative w-full max-w-xs">
              <input
                type="text"
                placeholder="Cari perusahaan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="py-4 px-6 border border-gray-300 rounded-lg w-full outline-none focus:ring-2 focus:ring-indigo-500"
              />

              {!searchTerm && (
                <FaMagnifyingGlass className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              )}
            </div>

            <button
              onClick={openAddModal}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 shadow-lg transition-all shrink-0"
            >
              <FaPlus /> New Job
            </button>
          </div>
        </div>

        {/* EMPTY OR KANBAN */}
        {jobs.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState
              title="Papan Kanban Masih Kosong"
              message="Lu belum masukin data lamaran sama sekali."
              actionText="+ Tambah Lamaran Perdana"
              onAction={openAddModal}
            />
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4 h-full items-start">
            {columns.map((colTitle) => (
              <KanbanColumn
                key={colTitle}
                id={colTitle}
                title={colTitle}
                count={jobs.filter((j) => j.status === colTitle).length}
              >
                {jobs
                  .filter((job) => job.status === colTitle)
                  .filter((job) => {
                    // 👇 PENGAMAN CRASH: Dikasih ( || "" ) biar kalau kosong ngga error
                    const companyName = (job.company || "").toLowerCase();
                    const positionName = (job.position || "").toLowerCase();
                    const search = searchTerm.toLowerCase();
                    
                    return companyName.includes(search) || positionName.includes(search);
                  })
                  .map((job) => (
                    <JobCard
                      key={job.id}
                      id={job.id.toString()}
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

        {/* ADD / EDIT MODAL */}
        <AddJobModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveJob}
          initialData={editingJob}
        />
      </div>

      {/* DETAIL MODAL */}
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