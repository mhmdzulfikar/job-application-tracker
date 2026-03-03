import {useState, useEffect} from 'react';
import { FaPlus, FaCheck } from 'react-icons/fa';

export default function FormTakjil({ onSimpan, dataTitipan}) {
    const [formData, setFormData] = useState({
        nama: "",
        harga: ""
    });

    // 4
    useEffect(() => {
        if (dataTitipan) {
            setFormData(dataTitipan);
        } else {
            setFormData({
                nama: "",
                harga: "" 
            });
        }
    }, [dataTitipan]);

    // 5
    const handleSubmit = (e) => {
        e.preventDefault();
        onSimpan(formData); // Mengirim data ke parent (Warung.jsx)
        setFormData({
            nama:"",
            harga: ""
        });
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 items-center">
            <input 
            placeholder="Nama Takjil"
            value={formData.nama}
            onChange={(e) => setFormData({...formData, nama: e.target.value})}
            className="border p-2"
            />

            <input 
            type="number"
            placeholder="Harga"
            value={formData.harga}
            onChange={(e) => setFormData({...formData, harga: e.target.value})}
            className="border p-2"
            />

            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">
                {dataTitipan ? <FaCheck size={25} /> : <FaPlus size={25} />  }
            </button>
        </form>
    );
}