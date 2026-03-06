import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { FaBriefcase, FaComments, FaTimesCircle, FaCheckCircle } from "react-icons/fa";
import EmptyState from "../../src/features/jobs/components/EmptyState";
import { jobService } from "../features/jobs/services/jobService";
import toast, { Toaster } from "react-hot-toast";

export default function Analytics() {
  const [jobs, setJobs] = useState([]);
  const [sortBy, setSortBy] = useState("terbaru");
  const [isLoading, setIsLoading] = useState(true);

  // 1. Ambil Data pas loading
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await jobService.getAll();
        setJobs(data);
      } catch (error) {
        console.error("Gagal mengambil data untuk Analytics:", error);
        toast.error("Gagal mengambil data dari server! 🚨"); 
      } finally {
        setIsLoading(false); 
      }
    };

    fetchJobs();
  }, []);

  // ==============================
  // LOADING SCREEN (HARUS DI LUAR useEffect!)
  // ==============================
  if (isLoading) {
    return (
      <div className="p-6 h-full flex items-center justify-center text-gray-500">
        Memuat brankas data...
      </div>
    );
  }

  // 2. HITUNG-HITUNGAN
  const totalJobs = jobs.length;
  const interviewCount = jobs.filter(j => j.status === "Interview").length;
  const rejectedCount = jobs.filter(j => j.status === "Rejected").length;
  const offerCount = jobs.filter(j => j.status === "Offer").length;
  const appliedCount = jobs.filter(j => j.status === "Applied").length;

  const winRate = totalJobs > 0 ? Math.round((interviewCount / totalJobs) * 100) : 0;

  // 3. FUNGSI EXPORT CSV
  const handleExportCSV = () => {
    const headers = ["ID", "Perusahaan", "Posisi", "Status"];
    const rows = jobs.map(job => [
      job.id,
      `"${job.company_name || job.company || "-"}"`,
      `"${job.position || "-"}"`,
      job.status
    ].join(","));

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;"});
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Laporan_MagangHunter.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Laporan berhasil di-download! 📊");
  };

  // SORTING DATA (Udah disesuaiin sama nama kolom Supabase)
  const sortedJobs = [...jobs].sort((a, b) => {
    const compA = a.company_name || a.company || "";
    const compB = b.company_name || b.company || "";

    if (sortBy === "a-z") return compA.localeCompare(compB);
    if (sortBy === "z-a") return compB.localeCompare(compA);
    if (sortBy === "status") return a.status.localeCompare(b.status);
    return b.id - a.id;
  });

  // --- DATA BUAT GRAFIK DONAT ---
  const rawChartData = [
    { name: "Terkirim", value: appliedCount, color: "#8b5cf6" }, // Purple
    { name: "Interview", value: interviewCount, color: "#facc15" }, // Yellow
    { name: "Offer", value: offerCount, color: "#22c55e" }, // Green
    { name: "Ditolak", value: rejectedCount, color: "#ef4444" }, // Red
  ];
  
  const chartData = rawChartData.filter(item => item.value > 0);

  return (
    <div className="p-6 animate-fade-in max-w-7xl mx-auto">
      {/* PANGGIL KOMPONEN TOASTER DI SINI */}
      <Toaster position="top-right" toastOptions={{ duration: 3000, style: { background: '#333', color: '#fff', borderRadius: '10px' } }} />
      
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Laporan Perjuangan</h1>

      {/* --- BAGIAN ATAS: GRAFIK DONAT --- */}
      <div className="mb-6 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 animate-fade-in flex flex-col md:flex-row items-center gap-8">
        <div className="w-full md:w-1/3 flex flex-col justify-center">
            <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-2 text-center md:text-left">Statistik Lamaran</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center md:text-left">
                Visualisasi dari {totalJobs} total lamaran lu sejauh ini.
            </p>
            
            <div className="space-y-3">
                {rawChartData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }}></span>
                            <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">{item.name}</span>
                        </div>
                        <span className="text-sm font-bold text-gray-800 dark:text-gray-100">{item.value}</span>
                    </div>
                ))}
            </div>
        </div>

        <div className="w-full md:w-2/3 h-62.5"> 
            {totalJobs === 0 ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                    <p className="font-medium">Belum ada data visual.</p>
                    <p className="text-xs">Tambah lamaran buat ngeliat grafik lu!</p>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                            cornerRadius={8}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: '#1f2937', color: '#fff' }}
                            itemStyle={{ fontWeight: 'bold' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            )}
        </div>
      </div>

      {/* --- BAGIAN TENGAH: KARTU METRIK --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        <MetricCard title="Total Lamaran" value={totalJobs} icon={<FaBriefcase />} color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" />
        <MetricCard title="Dapet Interview" value={interviewCount} icon={<FaComments />} color="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400" />
        <MetricCard title="Ditolak" value={rejectedCount} icon={<FaTimesCircle />} color="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" />
        <MetricCard title="Penawaran" value={offerCount} icon={<FaCheckCircle />} color="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" />
        <MetricCard title="Terkirim" value={appliedCount} icon={<FaBriefcase />} color="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" />
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-center items-center">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Interview Rate</h3>
            <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">{winRate}%</p>
        </div>
      </div>

      {/* --- BAGIAN BAWAH: TABEL RIWAYAT --- */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
            <h3 className="font-bold text-gray-800 dark:text-gray-100">Riwayat Lamaran</h3>
            <div className="flex items-center gap-3 w-full sm:w-auto">
                <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white cursor-pointer"
                >
                    <option value="terbaru">Paling Baru</option>
                    <option value="a-z">Perusahaan (A - Z)</option>
                    <option value="z-a">Perusahaan (Z - A)</option>
                    <option value="status">Status Lamaran</option>
                </select>
                <button 
                    onClick={handleExportCSV}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm whitespace-nowrap"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Export
                </button>
            </div>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th className="px-6 py-3">Perusahaan</th>
                        <th className="px-6 py-3">Posisi</th>
                        <th className="px-6 py-3">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedJobs.length === 0 ? (
                        <tr>
                            <td colSpan="3">
                                <EmptyState title="Riwayat Bersih" message="Belum ada data lamaran." />
                            </td>
                        </tr>
                    ) : (
                        sortedJobs.map((job) => (
                            <tr key={job.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{job.company_name || job.company}</td>
                                <td className="px-6 py-4">{job.position}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                        ${job.status === 'Interview' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 
                                          job.status === 'Rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 
                                          job.status === 'Offer' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                                          'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>
                                        {job.status}
                                    </span>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, color }) {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
            <div className={`p-4 rounded-xl ${color} text-xl`}>
                {icon}
            </div>
            <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
            </div>
        </div>
    )
}