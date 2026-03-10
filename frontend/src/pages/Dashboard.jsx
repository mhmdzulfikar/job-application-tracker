import { 
  DndContext, 
  useSensor, 
  useSensors, 
  MouseSensor, 
  TouchSensor 
} from "@dnd-kit/core";

import { columns } from "../features/jobs/data/initialData";
import JobCard from "../features/jobs/components/JobCard";
import KanbanColumn from "../features/jobs/components/KanbanColumn";
import AddJobModal from "../features/jobs/components/AddJobModal";
import JobModal from "../features/jobs/components/JobModal";
import EmptyState from "../features/jobs/components/EmptyState";
import Button from "../components/UI/Button";

import { FaPlus, FaMagnifyingGlass, FaBell, FaRocket } from "react-icons/fa6";
import { Toaster } from "react-hot-toast";
import useDashboard from "../features/jobs/hooks/useDashboard";

export default function Dashboard() {

  // ==============================
  // 1. AMBIL SEMUA LOGIC DARI HOOK
  // ==============================
  const {
    jobs,
    isLoading,
    isModalOpen,
    editingJob,
    searchTerm,
    selectedJob,
    filteredJobs, 
    setSearchTerm,
    setIsModalOpen,
    setSelectedJob,
    setActiveId,
    handleDeleteJob,
    handleSaveJob,
    handleDragEnd,
    openAddModal,
    openEditModal,
    handleSaveJobDetails,
    todayInterviews
  } = useDashboard();

  // ==============================
  // 2. SENSOR HP & LAPTOP (WAJIB DI SINI, DI BAWAH HOOK, DI ATAS IF)
  // ==============================
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  // ==============================
  // 3. LOADING SCREEN
  // ==============================
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center h-screen w-full">
        <div className="w-48 h-1.5 bg-slate-700 rounded-full overflow-hidden relative">
          <div className="absolute bg-[#006BFF] h-full w-24 animate-[loading_1.5s_ease-in-out_infinite] rounded-full"></div>
        </div>
        <p className="text-slate-400 text-sm font-medium animate-pulse">
          Memuat data...
        </p>
      </div>
    );
  }

  // ==============================
  // 4. MAIN RENDER
  // ==============================
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#333",
            color: "#fff",
            borderRadius: "10px"
          }
        }}
      />

      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        onDragStart={(e) => setActiveId(e.active.id)}
      >
        <div className="p-6 h-full flex flex-col">

          {/* INTERVIEW BANNER */}
          {todayInterviews.length > 0 && (
            <div className="mb-6 bg-blue-600 from-red-500 to-orange-500 rounded-xl p-4 shadow-lg flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <FaBell size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Panggilan Perang Hari Ini!!!</h3>
                  <p className="text-white/90 text-sm font-medium">
                    Kamu punya <span className="font-extrabold text-yellow-200">{todayInterviews.length} jadwal interview</span> hari ini
                  </p>
                </div>
              </div>
              <div className="hidden md:flex gap-2">
                {todayInterviews.map((job) => (
                  <span key={job.id} className="bg-white text-red-600 px-3 py-1 rounded-full text-xs font-bold">
                    {job.company || job.company_name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* HEADER */}
          <div className="flex justify-between items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Kanban Board</h1>
              <p className="text-sm text-gray-500">Geser kartu untuk update status.</p>
            </div>

            {/* SEARCH + BUTTON */}
            <div className="flex gap-4 flex-col lg:flex-row-reverse w-full md:flex-row">
              <div className="relative w-full max-w-xs bg-white rounded-lg">
                <input
                  type="text"
                  placeholder="Cari perusahaan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="py-4 px-6 border rounded-lg w-full outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {!searchTerm && (
                  <FaMagnifyingGlass className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                )}
              </div>

              <Button onClick={openAddModal} icon={<FaPlus />} variant="primary" className="px-6 shrink-0 sm:w-auto shadow-lg">
                New Job
              </Button>

              {/* WEEKLY TARGET */}
              <div className="bg-white border rounded-xl p-3 shadow-sm flex items-center gap-2">
                <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                  <FaRocket size={14} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>Target Mingguan</span>
                    <span>{jobs.length} / 10</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-blue-600 from-indigo-500 to-purple-500 h-2 rounded-full"
                      style={{ width: `${Math.min((jobs.length / 10) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* EMPTY STATE ATAU KANBAN BOARD */}
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
                  count={filteredJobs.filter((j) => j.status === colTitle).length}
                >
                  {filteredJobs
                    .filter((job) => job.status === colTitle)
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

          {/* ADD JOB MODAL */}
          <AddJobModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveJob}
            initialData={editingJob}
          />
        </div>

        {/* DETAIL JOB MODAL */}
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