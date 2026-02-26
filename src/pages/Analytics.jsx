import { useEffect, useState } from "react";
import { FaBriefcase, FaComments, FaTimesCircle, FaCheckCircle  } from "react-icons/fa";

export default function Analytics() {
  const [jobs, setJobs] = useState([]);
  const [sortBy, setSortBy] = useState("terbaru");

  // 1. Ambil Data pas loading
  useEffect(() => {
    // Pastiin nama kunci brankasnya sama kayak yang di Board lu ya ("magang-jobs")
    const saved = localStorage.getItem("magang-jobs");
    if (saved) {
      setJobs(JSON.parse(saved));
    }
  }, []);

  // 2. HITUNG-HITUNGAN
  const totalJobs = jobs.length;
  const interviewCount = jobs.filter(j => j.status === "Interview").length;
  const rejectedCount = jobs.filter(j => j.status === "Rejected").length;
  const offerCount = jobs.filter(j => j.status === "Offer").length;
  const appliedCount = jobs.filter(j => j.status === "Applied").length;

  // Hitung Win Rate
  const winRate = totalJobs > 0 ? Math.round((interviewCount / totalJobs) * 100) : 0;

  const calcPercent = (count) => totalJobs > 0 ? Math.round((count / totalJobs) * 100) : 0;
  
  const appliedPct = calcPercent(appliedCount);
  const interviewPct = calcPercent(interviewCount);
  const offerPct = calcPercent(offerCount);
  const rejectedPct = calcPercent(rejectedCount);

  // 3. FUNGSI EXPORT CSV
  const handleExportCSV = () => {
    const headers = ["ID", "Perusahaan", "Posisi", "Gaji", "Status"];

    const rows = jobs.map(job => [
      job.id,
      `"${job.company}"`,
      `"${job.position}"`,
      `"${job.salary}"`,
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
  };


  const sortedJobs = [...jobs].sort((a, b) => {
    if (sortBy === "a-z") {
    return a.company.localeCompare(b.company);
    } else if (sortBy === "z-a") {
    return b.company.localeCompare(a.company);
    } else if (sortBy === "status" ) {
    return a.status.localeCompare(b.status);
    } else {
    return b.id - a.id;
    }
    });



  return (
    <div className="p-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Laporan Perjuangan</h1>

      {/* --- GRAFIK CONVERSION RATE (PROGRESS BAR) --- */}
      <div className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 animate-fade-in">
        <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4">Grafik Conversion Rate</h3>

        {/* Balok Utama */}
        <div className="w-full h-6 flex rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
            {totalJobs === 0 ? (
                // Kalau datanya masih kosong banget
                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 font-medium">Belum ada data lamaran</div>
            ) : (
                // Kalau datanya ada, baloknya dibagi-bagi sesuai persentase
                <>
                    <div style={{ width: `${appliedPct}%` }} className="bg-purple-500 hover:opacity-80 transition-all duration-500 cursor-pointer" title={`Terkirim: ${appliedPct}%`}></div>
                    <div style={{ width: `${interviewPct}%` }} className="bg-yellow-400 hover:opacity-80 transition-all duration-500 cursor-pointer" title={`Interview: ${interviewPct}%`}></div>
                    <div style={{ width: `${offerPct}%` }} className="bg-green-500 hover:opacity-80 transition-all duration-500 cursor-pointer" title={`Offer: ${offerPct}%`}></div>
                    <div style={{ width: `${rejectedPct}%` }} className="bg-red-500 hover:opacity-80 transition-all duration-500 cursor-pointer" title={`Ditolak: ${rejectedPct}%`}></div>
                </>
            )}
        </div>

        {/* Legend (Keterangan Warna) di bawah balok */}
        <div className="flex flex-wrap items-center gap-6 mt-5 text-sm">
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-purple-500 shadow-sm"></span>
                <span className="text-gray-600 dark:text-gray-400 font-medium">Terkirim ({appliedPct}%)</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-yellow-400 shadow-sm"></span>
                <span className="text-gray-600 dark:text-gray-400 font-medium">Interview ({interviewPct}%)</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500 shadow-sm"></span>
                <span className="text-gray-600 dark:text-gray-400 font-medium">Offer ({offerPct}%)</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 shadow-sm"></span>
                <span className="text-gray-600 dark:text-gray-400 font-medium">Ditolak ({rejectedPct}%)</span>
            </div>
        </div>
      </div>

      {/* Grid Kartu Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        
        {/* KARTU 1: TOTAL */}
        <MetricCard 
          title="Total Lamaran" 
          value={totalJobs} 
          icon={<FaBriefcase />} 
          color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" 
        />

        {/* KARTU 2: INTERVIEW */}
        <MetricCard 
          title="Dapet Interview" 
          value={interviewCount} 
          icon={<FaComments />} 
          color="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400" 
        />

         {/* KARTU 3: DITOLAK */}
         <MetricCard 
          title="Ditolak / Ghosting" 
          value={rejectedCount} 
          icon={<FaTimesCircle />} 
          color="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" 
        />

         {/* KARTU 4: DAPAT PENAWARAN */}
         <MetricCard 
          title="Dapat Penawaran" 
          value={offerCount} 
          icon={<FaCheckCircle />} 
          color="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" 
        />

         {/* KARTU 5: TERKIRIM */}
         <MetricCard 
          title="Lamaran Terkirim" 
          value={appliedCount} 
          icon={<FaBriefcase />} 
          color="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" 
        />

        {/* KARTU 6: WIN RATE */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-center items-center">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Interview Rate</h3>
            <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">{winRate}%</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Keep pushing!</p>
        </div>

      </div>

      {/* LIST PERUSAHAAN & TOMBOL EXPORT */}
     {/* LIST PERUSAHAAN & TOMBOL EXPORT */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        
        {/* Header Tabel + Filter + Tombol Export Sejajar */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
            <h3 className="font-bold text-gray-800 dark:text-gray-100">Riwayat Lamaran</h3>

            {/* Bungkus Dropdown dan Tombol Export biar rapi sebelahan */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
                <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white transition-colors cursor-pointer"
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

        {/* Tabel */}
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
                    {/* 👇 INI KUNCINYA: Pakai 'sortedJobs.map', bukan 'jobs.map' 👇 */}
                    {sortedJobs.map((job) => (
                        <tr key={job.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{job.company}</td>
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
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}

// Komponen Kecil buat Kartu (Nama diganti jadi MetricCard biar ga bentrok)
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