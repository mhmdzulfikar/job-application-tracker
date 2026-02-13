import { useEffect, useState } from "react";
import { FaBriefcase, FaComments, FaTimesCircle, FaCheckCircle } from "react-icons/fa";

export default function Analytics() {
  const [jobs, setJobs] = useState([]);

  // 1. Ambil Data pas loading
  useEffect(() => {
    const saved = localStorage.getItem("magang-jobs");
    if (saved) {
      setJobs(JSON.parse(saved));
    }
  }, []);

  // 2. HITUNG-HITUNGAN (Pake .filter dan .length)
  const totalJobs = jobs.length;
  const interviewCount = jobs.filter(j => j.status === "Interview").length;
  const rejectedCount = jobs.filter(j => j.status === "Rejected").length;
  const offerCount = jobs.filter(j => j.status === "Offer").length;

  // Hitung Win Rate (Interview / Total Lamaran * 100)
  // Kalau total 0, tulis 0 biar gak error (NaN)
  const winRate = totalJobs > 0 ? Math.round((interviewCount / totalJobs) * 100) : 0;

  return (
    <div className="p-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-800 mb-6"> Laporan Perjuangan</h1>

      {/* Grid Kartu Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* KARTU 1: TOTAL */}
        <StatCard 
          title="Total Lamaran" 
          value={totalJobs} 
          icon={<FaBriefcase />} 
          color="bg-blue-100 text-blue-600" 
        />

        {/* KARTU 2: INTERVIEW */}
        <StatCard 
          title="Dapet Interview" 
          value={interviewCount} 
          icon={<FaComments />} 
          color="bg-yellow-100 text-yellow-600" 
        />

         {/* KARTU 3: DITOLAK */}
         <StatCard 
          title="Ditolak / Ghosting" 
          value={rejectedCount} 
          icon={<FaTimesCircle />} 
          color="bg-red-100 text-red-600" 
        />

        {/* KARTU 4: WIN RATE */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center items-center">
            <h3 className="text-gray-500 text-sm font-medium">Interview Rate</h3>
            <p className="text-4xl font-bold text-indigo-600 mt-2">{winRate}%</p>
            <p className="text-xs text-gray-400 mt-1">Keep pushing! </p>
        </div>

      </div>

      {/* LIST PERUSAHAAN (Tabel Simpel) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-gray-800 mb-4">Riwayat Lamaran</h3>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th className="px-6 py-3">Perusahaan</th>
                        <th className="px-6 py-3">Posisi</th>
                        <th className="px-6 py-3">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {jobs.map((job) => (
                        <tr key={job.id} className="bg-white border-b hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900">{job.company}</td>
                            <td className="px-6 py-4">{job.position}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                    ${job.status === 'Interview' ? 'bg-yellow-100 text-yellow-700' : 
                                      job.status === 'Rejected' ? 'bg-red-100 text-red-700' : 
                                      'bg-gray-100 text-gray-600'}`}>
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

// Komponen Kecil buat Kartu (biar gak copas berulang)
function StatCard({ title, value, icon, color }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`p-4 rounded-xl ${color} text-xl`}>
                {icon}
            </div>
            <div>
                <p className="text-gray-500 text-sm font-medium">{title}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    )
}