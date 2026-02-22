import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { 
  FaColumns, 
  FaChartPie, 
  FaCog, 
  FaChevronLeft, 
  FaChevronRight, 
  FaRocket 
} from "react-icons/fa";

export default function Layout() {
  // 3. STATE: Default-nya terbuka (true)
  const [isOpen, setIsOpen] = useState(true);

  const menus = [
    { name: "Board", path: "/", icon: <FaColumns size={20} /> },
    { name: "Analytics", path: "/analytics", icon: <FaChartPie size={20} /> },
    { name: "Settings", path: "/settings", icon: <FaCog size={20} /> },
    // { name: "Tailwind", path: "/tailwind", icon: <FaRocket size={20} /> },
    // { name: "Warung", path: "/warung", icon: <FaRocket size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      
      {/* --- SIDEBAR --- */}
      <aside 
        className={`bg-white border-r border-gray-200 hidden md:flex flex-col transition-all duration-300 ease-in-out
        ${isOpen ? "w-64" : "w-20"} 
        `} 
      >
        
        {/* HEADER & TOGGLE BUTTON */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
          {isOpen && (
             <h1 className="text-xl font-bold text-indigo-600 truncate animate-fade-in">
               MagangHunter
             </h1>
          )}

          {/* TOMBOL PENGENDALI  */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-indigo-600 transition-colors"
          >
            {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
          </button>
        </div>

        {/* MENU ITEMS */}
        <nav className="flex-1 px-3 py-6 space-y-2">
          {menus.map((menu) => (
            <NavLink
              key={menu.name}
              to={menu.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-xl transition-all font-medium overflow-hidden whitespace-nowrap
                ${isActive 
                    ? "bg-indigo-50 text-indigo-600 shadow-sm" 
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                }
                ${!isOpen && "justify-center"} 
                ` 
              }
            >
              <div>{menu.icon}</div>
              
              {/* Teks Menu (Cuma muncul kalo isOpen = true) */}
              <span className={`transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0 w-0 hidden"}`}>
                {menu.name}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* STATUS CARD */}
        <div className="p-4 border-t border-gray-100">
            {isOpen ? (
                <div className="bg-indigo-50 rounded-xl p-4 animate-fade-in">
                    <p className="text-xs font-semibold text-indigo-500 uppercase">Status</p>
                    <p className="text-sm text-gray-700 font-bold mt-1">Ready to Work </p>
                </div>
            ) : (
                // Versi Mini (Cuma ikon roket)
                <div className="flex justify-center">
                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500">
                        <FaRocket />
                    </div>
                </div>
            )}
        </div>
      </aside>

      {/* --- KONTEN KANAN --- */}
      <main className="flex-1 overflow-y-auto transition-all duration-300">
        <Outlet />
      </main>
    </div>
  );
}