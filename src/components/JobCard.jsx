import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities"; // 2. Buat animasi gerak
import { FaBuilding, FaMoneyBillWave, FaCalendarAlt } from "react-icons/fa";



const JobCard = ({ job, onDelete }) => {
  // 3. Pasang Hook useDraggable
  // id: KTP kartu ini biar sistem tau siapa yang lagi diangkat
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: job.id.toString(), // ID harus String
  });


  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const getStatusColor = (status) => {
    switch(status) {
        case 'Interview': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        case 'Offer': return 'bg-green-100 text-green-700 border-green-200';
        case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
        default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
  
    // {...listeners} {...attributes} 
    <div 
        ref={setNodeRef} 
        style={style} 
        {...listeners} 
        {...attributes}
        className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-grab active:cursor-grabbing mb-3 group relative z-10"
    >
      
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div>
            <h3 className="font-bold text-gray-800 text-sm">{job.position}</h3>
            <div className="flex items-center gap-1 text-xs text-gray-500 font-medium mt-0.5">
                <FaBuilding className="text-gray-400" />
                {job.company}
            </div>
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${getStatusColor(job.status)}`}>
            {job.status}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
        <div className="flex items-center gap-1 text-xs text-gray-400">
            <FaMoneyBillWave /> {job.salary}
        </div>
        <div className="flex items-center gap-1 text-[10px] text-gray-400">
            <FaCalendarAlt /> {job.date}
        </div>
      </div>
    </div>
  );
};

export default JobCard;