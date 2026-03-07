import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { jobService } from "../services/jobService";
import { isTodayInterview } from "../utils/jobHelpers";

export default function useDashboard() {

  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [activeId, setActiveId] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);


  // ==============================
  // 1. FETCH JOBS (Dengan Penerjemah)
  // ==============================
  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const data = await jobService.getAll();
      
      // JURUS SENIOR: Normalisasi data biar UI lu ngga bingung!
      const normalizedData = data.map(job => ({
        ...job,
        company: job.company_name || job.company || "", // Paksa ke 'company'
        interviewDate: job.interview_date || "",        // Terjemahin tanggal
        tasks: job.tasks || [],                         // Pastiin array ngga undefined
        notes: job.notes || ""                          // Pastiin string ngga undefined
      }));

      setJobs(normalizedData);
    } catch (error) {
      toast.error("Gagal mengambil data lamaran!");
    } finally {
      setIsLoading(false);
    }
  };

    useEffect(() => {
    fetchJobs();
  }, []);

  // ==============================
  // 2. SAVE DETAIL JOB (Benerin Tipe Data)
  // ==============================
  const handleSaveJobDetails = async (updatedJobData) => {
    try {
      // Packing kardus dengan nama yang dikenal Backend (Snake_case)
      const payloadToBackend = {
        company_name: updatedJobData.company,
        position: updatedJobData.position,
        status: updatedJobData.status,
        url: updatedJobData.url || null,
        
        // Kalau tanggal kosong (""), ubah jadi null biar database ngga error
        interview_date: updatedJobData.interviewDate ? updatedJobData.interviewDate : null, 
        notes: updatedJobData.notes || "",
        tasks: updatedJobData.tasks || []
      };

      const updated = await jobService.update(updatedJobData.id, payloadToBackend);

      // Terjemahin lagi balasan dari backend sebelum dimasukin ke UI
      const normalizedUpdated = {
        ...updated,
        company: updated.company_name,
        interviewDate: updated.interview_date || "",
        tasks: updated.tasks || [],
        notes: updated.notes || ""
      };

      setJobs((prev) =>
        prev.map((job) =>
          job.id === updatedJobData.id ? normalizedUpdated : job
        )
      );

      toast.success("Detail lamaran berhasil disimpan! 📝");
      setSelectedJob(null);
    } catch (error) {
      toast.error("Gagal menyimpan detail lamaran!");
      console.error(error);
    }
  };


  // ==============================
  // DELETE JOB
  // ==============================

  const handleDeleteJob = async (id) => {

    if (!window.confirm("Yakin hapus lamaran ini?")) return;

    try {
      await jobService.delete(id);

      setJobs((prev) =>
        prev.filter((job) => job.id !== id)
      );

      toast.success("Dihapus permanen!");

    } catch {
      toast.error("Gagal menghapus lamaran!");
    }
  };


  // ==============================
  // CREATE / UPDATE JOB
  // ==============================

  const handleSaveJob = async (jobData) => {

    try {

      if (editingJob) {

        const updated = await jobService.update(editingJob.id, {
          company_name: jobData.company || jobData.company_name,
          position: jobData.position,
          status: jobData.status
        });

        setJobs((prev) =>
          prev.map((job) =>
            job.id === editingJob.id ? updated : job
          )
        );

        toast.success("Perubahan disimpan!");
        setEditingJob(null);

      } else {

        const created = await jobService.create({
          company_name: jobData.company || jobData.company_name,
          position: jobData.position,
          status: "Applied"
        });

        setJobs((prev) => [created, ...prev]);

        toast.success("Lamaran perdana mengudara!");
      }

      setIsModalOpen(false);

    } catch {
      toast.error("Gagal menyimpan ke server!");
    }
  };


  // ==============================
  // DRAG & DROP 
  // ==============================

  const handleDragEnd = async (event) => {
    // 1. BACA LAPORAN CCTV
    const { active, over } = event; 

    // 2. CEK JURANG (Kalau dilepas di luar kolom, batalin)
    if (!over) return; 

    // 3. SIAPIN DATA (JANGAN PAKE parseInt, biarin aja string UUID-nya!)
    const jobId = active.id; 
    const newStatus = over.id;    

    // Cek dulu, kalau dia dilepas di kolom yang sama, ngapain di-update? Batalin aja hemat kuota.
    const jobToUpdate = jobs.find((j) => j.id === jobId);
    if (!jobToUpdate || jobToUpdate.status === newStatus) return;

    // 4. UPDATE UI INSTAN (Biar kerasa smooth di mata User)
    setJobs((prevJobs) => 
        prevJobs.map((job) => 
            job.id === jobId ? { ...job, status: newStatus } : job                          
        )
    );

    // 5. LAPOR KE BACKEND (Penting!)
    try {
        await jobService.updateStatus(jobId, newStatus);
    } catch (error) {
        toast.error("Koneksi putus! Gagal pindah kolom.");
        // Kalau Backend nolak (error), balikin lagi posisi kartunya ke tempat asal (Rollback)
        setJobs((prevJobs) => 
            prevJobs.map((job) => 
                job.id === jobId ? { ...job, status: jobToUpdate.status } : job                          
            )
        );
    }
  };

  // ==============================
  // MODAL
  // ==============================

  const openAddModal = () => {
    setEditingJob(null);
    setIsModalOpen(true);
  };

  const openEditModal = (job) => {
    setEditingJob(job);
    setIsModalOpen(true);
  };



  // ==============================
  // SELECTOR
  // ==============================

  const todayInterviews = jobs.filter(isTodayInterview);


  return {

    jobs,
    isLoading,

    isModalOpen,
    editingJob,

    searchTerm,
    activeId,
    selectedJob,

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
  };
}