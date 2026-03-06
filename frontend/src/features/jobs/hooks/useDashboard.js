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
  // FETCH JOBS
  // ==============================

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const data = await jobService.getAll();
      setJobs(data);

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
  // DRAG
  // ==============================

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over) return;

    setActiveId(null);
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

    todayInterviews
  };
}