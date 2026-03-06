import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities"; 
import { FaBuilding, FaMoneyBillWave, FaPen, FaTrash, FaEye } from "react-icons/fa";

const JobCard = ({ job, onDelete, onEdit, onCardClick }) => {
  // 1. Setup Drag and Drop
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: job.id.toString(), 
  });

  const style = { transform: CSS.Translate.toString(transform) };

  // 2. Pewarna Status
  const getStatusColor = (status) => {
    switch(status) {
        case 'Interview': return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700/50';
        case 'Offer': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700/50';
        case 'Rejected': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700/50';
        default: return 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
    }
  };

  // --- 3. FITUR BARU: TUKANG HITUNG SISA HARI INTERVIEW ---
  const getDaysLeftInfo = () => {
    // Kalau user belum ngisi tanggal interview di Pop-Up, ngga usah nampilin Badge
    if (!job.interviewDate) return null;

    const targetDate = new Date(job.interviewDate);
    const today = new Date();
    
    // Kita reset jamnya jadi 00:00 biar hitungan harinya presisi (Math logic)
    targetDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    // Hitung selisih waktu pakai rumus: Milidetik -> Hari
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Nentuin warna dan teks Badge sesuai sisa hari
    if (diffDays < 0) {
        return { text: "Terlewat", color: "bg-gray-100 text-gray-500 border border-gray-200 dark:bg-gray-700 dark:text-gray-400" };
    } else if (diffDays === 0) {
        return { text: "Hari Ini! 🔥", color: "bg-red-500 text-white animate-pulse shadow-md" };
    } else if (diffDays === 1) {
        return { text: "Besok ⚠️", color: "bg-orange-100 text-orange-700 border border-orange-200 dark:bg-orange-900/50 dark:text-orange-400" };
    } else {
        return { text: `H-${diffDays} ⏳`, color: "bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/50 dark:text-blue-400" };
    }
  };

  const badgeInfo = getDaysLeftInfo();

  return (
    <div 
        ref={setNodeRef} 
        style={style} 
        {...listeners} 
        {...attributes}
        // UI Kartu diubah biar lebih bersih, support dark mode, dan ngga gelap (bg-gray-300 dihapus)
        className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all cursor-grab active:cursor-grabbing mb-3 group relative z-10"
    >

      {/* --- TOMBOL AKSI (Muncul pas hover, dipojok kanan atas) --- */}
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-1 rounded-lg">
        {/* Tombol Detail (Mata) */}
        <button 
            onPointerDown={(e) => {
                e.stopPropagation(); 
                onCardClick(job); 
            }}
            className="p-1.5 text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:text-green-400 dark:hover:bg-green-900/50 rounded-md"
            title="Lihat Detail"
        >
            <FaEye size={12} />
        </button>

        {/* Tombol Edit */}
        <button 
            onPointerDown={(e) => {
                e.stopPropagation(); 
                onEdit();
            }}
            className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:bg-blue-900/50 rounded-md"
            title="Edit Cepat"
        >
            <FaPen size={12} />
        </button>

        {/* Tombol Delete */}
        <button 
            onPointerDown={(e) => {
                e.stopPropagation(); 
                onDelete(job.id);
            }}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-900/50 rounded-md"
            title="Hapus Lamaran"
        >
            <FaTrash size={12} />
        </button>

        
      </div>
      {/* ------------------------------------- */}

      {/* Header (Posisi & Perusahaan) */}
      <div className="flex justify-between items-start mb-2 pr-16"> {/* pr-16 biar teks ga ketimpa tombol hover */}
        <div>
            <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm leading-tight">{job.position}</h3>
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
                <FaBuilding className="text-gray-400" />
                {job.company}
            </div>
        </div>
      </div>

      {/* Footer (Status, Badge, & Gaji) */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
        
        {/* Kumpulan Badge di Kiri Bawah */}
        <div className="flex items-center gap-2 flex-wrap">
             <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${getStatusColor(job.status)}`}>
                {job.status}
            </span>

            {/* --- MUNCULIN BADGE COUNTDOWN DI SINI --- */}
            {badgeInfo && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeInfo.color}`}>
                    {badgeInfo.text}
                </span>
            )}
        </div>

        {/* Gaji di Kanan Bawah */}
        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 font-medium shrink-0">
            <FaMoneyBillWave /> {job.salary}
        </div>
      </div>

    </div>
  );
};

export default JobCard;