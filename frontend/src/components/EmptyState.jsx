import { FaBoxOpen } from "react-icons/fa";

export default function EmptyState({ title, message, onAction, actionText }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in w-full">
      {/* Ikon Kerdus Kosong */}
      <div className="bg-indigo-50 dark:bg-indigo-900/30 p-6 rounded-full mb-5 shadow-sm">
        <FaBoxOpen className="text-5xl text-indigo-400 dark:text-indigo-500" />
      </div>
      
      {/* Teks Penjelasan */}
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-6 text-sm">
        {message}
      </p>

      {/* Tombol Aksi (Opsional, cuma muncul kalau dikasih actionText) */}
      {actionText && (
        <button 
            onClick={onAction}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-all active:scale-95"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}