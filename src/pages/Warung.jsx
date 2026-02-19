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


    const handleSimpanMenu = (dataDariForm) => {

        if (menuEdit) {
               setDaftarMenu((prevMenu) => 
            prevMenu.map((menuLama) => 
            menuLama.id === menuEdit.id ? { ...menuLama, ...dataDariForm} : menuLama
            )
          );

          setMenuEdit(null);
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
                        onEdit={() => setMenuEdit(menu)}
                        // 👇 KABEL INI LUPA LU COLOK BANG ZUL! 👇
                        onDelete={() => handleHapusMenu(menu.id)} 
                    />
                ))}
            </div>

        </div>
    );
}