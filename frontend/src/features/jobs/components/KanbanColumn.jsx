import { useDroppable } from "@dnd-kit/core";

const KanbanColumn = ({ id, title, count, children }) => {
  // Pasang Hook useDroppable
  // id: Nama kolom (misal: "Applied", "Interview")
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  // Kalo ada kartu di atasnya (hover), warnanya jadi agak gelap
  const style = isOver ? "bg-indigo-50 border-indigo-200" : "bg-gray-100/50 border-gray-200/60";

  return (
    <div 
        ref={setNodeRef} 
        className={`min-w-[280px] w-80 flex flex-col rounded-2xl border transition-colors duration-200 max-h-full ${style}`}
    >
        {/* Header Kolom */}
        <div className="p-4 flex justify-between items-center sticky top-0 backdrop-blur-sm rounded-t-2xl z-10">
            <h2 className="font-bold text-gray-700 flex items-center gap-2">
                {title}
                <span className="bg-white text-gray-600 text-xs px-2 py-0.5 rounded-full shadow-sm">
                    {count}
                </span>
            </h2>
        </div>

        {/* Area Card (Children) */}
        <div className="p-3 overflow-y-auto flex-1 custom-scrollbar">
            {children}
            
            {count === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-gray-200/50 rounded-xl">
                    <p className="text-gray-400 text-xs">Drop here </p>
                </div>
            )}
        </div>
    </div>
  );
};

export default KanbanColumn;