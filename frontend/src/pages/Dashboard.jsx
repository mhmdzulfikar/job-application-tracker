import { useState } from "react";
import { DndContext } from "@dnd-kit/core";
import { columns } from "../data/initialData";
import JobCard from "../components/JobCard";
import KanbanColumn from "../components/KanbanColumn";
import AddJobModal from "../components/AddJobModal";
import JobModal from "../components/JobModal";
import EmptyState from "../components/EmptyState";
import { FaPlus, FaMagnifyingGlass, FaBell, FaRocket } from "react-icons/fa6";
import toast, { Toaster } from "react-hot-toast";
import useLocalStorage from "../hooks/useLocalStorage";

export default function Dashboard() {

  // =========================================
  // 1. STATE MANAGEMENT
  // =========================================

  // 👇 2. PANGGIL SIHIRNYA CUMA PAKE 1 BARIS INI (Gantiin useEffect lu)
  const [jobs, setJobs] = useLocalStorage("magang-jobs", []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeId, setActiveId] = useState(null); // Fix unused warning later if needed
  const [selectedJob, setSelectedJob] = useState(null);

  // =========================================
  // 3. HANDLERS
  // =========================================

  const handleDeleteJob = (id) => {
    if (window.confirm("Yakin mau hapus lamaran ini?")) {
      setJobs((prev) => prev.filter((job) => job.id !== id));
      toast.success("Lamaran berhasil dihapus! ");
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
      toast.success("Perubahan berhasil disimpan! ");
    } else {
      // ADD MODE
      const newJob = {
        ...jobData,
        id: Date.now(),
        date: new Date().toLocaleDateString("id-ID"),
      };
      setJobs((prev) => [newJob, ...prev]);
      toast.success("Lamaran perdana berhasil ditambah! ");
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
    toast.success("Catatan rahasia di-update! ");
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
    <>
      <Toaster 
        position="top-right" 
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '10px',
          },
        }} 
      />

      <DndContext
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
      >
        <div className="p-6 h-full flex flex-col ">
          
          {/* BANNER INTERVIEW */}
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
          <div className="flex justify-between items-center mb-6 md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                Kanban Board
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Geser kartu untuk update status.
              </p>
            </div>

            <div className="flex gap-4 flex-col lg:flex-row-reverse sm:flex-col w-full md:flex-row">
              <div className="relative w-full max-w-xs md:w-64">
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
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 shadow-lg transition-all shrink-0 sm:w-auto"
              >
                <FaPlus /> New Job
              </button>

              <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-3 shadow-sm flex items-center gap-2 animate-fade-in">
                <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg text-indigo-600 dark:text-indigo-400">
                  <FaRocket size={14} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Target Lamaran Mingguan</span>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        {jobs.length} / 10
                    </span>
                  </div>
                  {/* Garis Progress Bar */}
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div 
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${Math.min((jobs.length / 10) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                {jobs.length >= 10 && (
                  <div className="hidden sm:block text-xs font-bold text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                      Target Tercapai! 🎉
                  </div>
                )}
              </div>
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
    </>
  );
}