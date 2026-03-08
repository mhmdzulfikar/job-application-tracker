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
        notes: job.notes || "",
        salary: job.salary || ""                       // Pastiin string ngga undefined
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
        salary: updatedJobData.salary || null,
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
        notes: updated.notes || "",
        salary: updated.salary || ""
      };

      setJobs((prev) =>
        prev.map((job) =>
          job.id === updatedJobData.id ? normalizedUpdated : job
        )
      );

      toast.success("Detail lamaran berhasil disimpan! ");
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
  // CREATE / UPDATE JOB (Modal Basic)
  // ==============================
  const handleSaveJob = async (jobData) => {
    try {
      if (editingJob) {
        // 1. JURUS GABUNG KARDUS (Merge Data)
        // Bawa barang baru dari modal, sisanya ambil dari data lama (editingJob) biar ngga kehapus!
        const payload = {
          // Tangkap semua kemungkinan nama 'company' dari modal, kalau gagal, balikin ke nama lama
          company_name: jobData.company || jobData.company_name || jobData.companyName || editingJob.company,
          position: jobData.position || editingJob.position,
          status: jobData.status || editingJob.status,
          salary: jobData.salary || null,
          
          // 🚨 PENYELAMAT BARANG MAHAL (Biar Notes & Tasks ngga keriset pas lu ngedit gaji)
          url: editingJob.url || null,
          interview_date: editingJob.interviewDate || null, 
          notes: editingJob.notes || "",
          tasks: editingJob.tasks || []
        };

        const updated = await jobService.update(editingJob.id, payload);

        // 2. NORMALISASI BALIKAN SERVER
        const normalizedUpdated = {
          ...updated,
          company: updated.company_name, // Terjemahin ke camelCase
          interviewDate: updated.interview_date || "",
          salary: updated.salary || "",
          tasks: updated.tasks || [],
          notes: updated.notes || ""
        };

        // 3. UPDATE UI REACT
        setJobs((prev) =>
          prev.map((job) =>
            job.id === editingJob.id ? normalizedUpdated : job
          )
        );

        toast.success("Perubahan gaji & status disimpan!");
        setEditingJob(null);

      } else {
        // --- LOGIKA BUAT BIKIN LAMARAN BARU ---
        const payload = {
          company_name: jobData.company || jobData.company_name || jobData.companyName,
          position: jobData.position,
          status: "Applied",
          salary: jobData.salary || null
        };

        const created = await jobService.create(payload);

        // Normalisasi data baru
        const normalizedCreated = {
          ...created,
          company: created.company_name,
          salary: created.salary || ""
        };

        setJobs((prev) => [normalizedCreated, ...prev]);
        toast.success("Lamaran perdana mengudara!");
      }

      setIsModalOpen(false);
    } catch (error) {
      toast.error("Gagal menyimpan ke server!");
      console.error(error);
    }
  };


  // ==============================
  // DRAG & DROP (Udah Lulus Sensor Satpam!)
  // ==============================
  const handleDragEnd = async (event) => {
    const { active, over } = event; 
    if (!over) return; 

    const jobId = active.id; 
    const newStatus = over.id;    

    const jobToUpdate = jobs.find((j) => j.id === jobId);
    if (!jobToUpdate || jobToUpdate.status === newStatus) return;

    // 1. UPDATE UI INSTAN (Optimistic UI)
    setJobs((prevJobs) => 
        prevJobs.map((job) => 
            job.id === jobId ? { ...job, status: newStatus } : job                          
        )
    );

    // 2. LAPOR KE BACKEND DENGAN KARDUS LENGKAP!
    try {
        // Jangan males! Kirim ulang semua data bawaan kartu, cuma statusnya aja yang diganti
        const payloadToBackend = {
            company_name: jobToUpdate.company || jobToUpdate.company_name, 
            position: jobToUpdate.position,
            salary: jobToUpdate.salary || null,
            status: newStatus, 
            url: jobToUpdate.url || null,
            interview_date: jobToUpdate.interviewDate || null, 
            notes: jobToUpdate.notes || "",
            tasks: jobToUpdate.tasks || []
        };

        // Ganti pake jobService.update (karena backend lu nerimanya di updateJob yang butuh 8 parameter)
        await jobService.update(jobId, payloadToBackend);

        toast.success(`Berhasil pindah ke kolom ${newStatus}!`);

    } catch (error) {
        toast.error("Koneksi putus! Gagal pindah kolom.");
        // Rollback mundur kalau server nolak
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