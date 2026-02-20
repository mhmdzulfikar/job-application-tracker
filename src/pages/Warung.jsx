import { useState } from "react";
import CardTakjil from "./CardTakjil";
import FormTakjil from "./FormTakjil";
import { FaTimes } from "react-icons/fa";

export default function Warung() {
    const [menuEdit, setMenuEdit] = useState(null);

    const [daftarMenu, setDaftarMenu] = useState([
        { id: 1, nama: "Es Kuwut", harga: 5000 },
        { id: 2, nama: "Kolak Pisang", harga: 8000 },
    ]);


    //  6
    const handleSimpanMenu = (dataDariForm) => {

        // dataDariForm = {nama: "Es Kuwut", harga: 6000} (tanpa ID!)

    if (menuEdit) { 
        // 1. Apakah kita lagi mode edit? YA. (Karena tadi di Langkah 1 kita set)

        setDaftarMenu((prevMenu) => 
            prevMenu.map((menuLama) => 
                // 2. Kita cek satu-satu semua menu di database (prevMenu)
                menuLama.id === menuEdit.id 
                    
                    ? { ...menuLama, ...dataDariForm} // 3. JIKA KETEMU ID YANG SAMA: update data lama dengan data baru dari form
                    
                    : menuLama // 4. JIKA BEDA: kembalikan data lama tanpa perubahan
            )
        );
        setMenuEdit(null); // 5. Reset mode edit
          
        } else {
            const menuBaru = {
                ...dataDariForm,
                id: Date.now()
            };

            setDaftarMenu((prevMenu) =>  [menuBaru, ...prevMenu]);
        }
    };



    const handleHapusMenu = (id) => {
        if (window.confirm("Yakin mau hapus menu ini?")) {
            setDaftarMenu((prevMenu) => prevMenu.filter((menu) =>  menu.id !== id));
        }
    }

    return (
        <div className="p-10 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Warung Takjil Bang Zul</h1>
            

            <div className="mb-8 p-4 bg-white border rounded shadow">
                <h2 className="font-bold mb-2">Papan Ketik (Form)</h2>

                {/* 3 */}
                <FormTakjil
                 onSimpan={handleSimpanMenu}
                 dataTitipan={menuEdit}
                />

                {menuEdit && (
                    <button onClick={() => setMenuEdit(null)} className="text-red-500 text-sm mt-2">
                        <FaTimes className="inline mb-1" /> Batal Edit
                    </button>
                )}

            </div>

                <div className="flex gap-4">
                {daftarMenu.map((menu) => (
                    <CardTakjil 
                        key={menu.id}
                        dataMenu={menu}
                        // 2
                        onEdit={() => setMenuEdit(menu)}
                        onDelete={() => handleHapusMenu(menu.id)} 
                    />
                ))}
            </div>

        </div>
    );
}