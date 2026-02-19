import {FaPen, FaTrash} from 'react-icons/fa';

export default function CardTakjil({dataMenu, onEdit, onDelete}) {
    return (
     <div className="p-4 bg-white border rounded shadow w-48">
        <h3 className="font-bold text-lg">{dataMenu.nama}</h3>
        <p className="text-gray-600 mb-4">Rp. {dataMenu.harga}</p>

        <button 
        onClick={onEdit}
        className="px-3 py-1  hover:text-blue-500 hover:bg-blue-50 rounded-md"
        >
            <FaPen size={10} /> 
        </button>


        <button 
        onClick={onDelete}
        className="px-3 py-1  hover:text-red-500 hover:bg-red-50 rounded-md"
        >
            <FaTrash size={10} /> 
        </button>

     </div>
    );
}