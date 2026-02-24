import { useState, useEffect } from "react";
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
  const [isOpen, setIsOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const menus = [
    { name: "Board", path: "/", icon: <FaColumns size={20} /> },
    { name: "Analytics", path: "/analytics", icon: <FaChartPie size={20} /> },
    { name: "Settings", path: "/settings", icon: <FaCog size={20} /> },
  ];

  // Pekerja Pagi: Cek Gudang pas web baru dibuka
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Tombol Saklar buat diklik
  const toggleDarkMode = () => {
    if (isDarkMode) {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  return (
    // Tambahin transisi dan dark:bg-gray-900 biar layarnya ikut gelap
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      
      {/* --- SIDEBAR --- */}
      <aside 
        className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:flex flex-col transition-all duration-300 ease-in-out
        ${isOpen ? "w-64" : "w-20"} 
        `} 
      >
        
        {/* HEADER & TOGGLE BUTTON */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100 dark:border-gray-700">
          {isOpen && (
             <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 truncate animate-fade-in">
               MagangHunter
             </h1>
          )}

          {/* TOMBOL PENGENDALI KIRI/KANAN */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-300 hover:text-indigo-600 transition-colors"
          >
            {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
          </button>
        </div>

        {/* MENU ITEMS */}
        <nav className="flex-1 px-3 py-6 space-y-2 flex flex-col">
          {menus.map((menu) => (
            <NavLink
              key={menu.name}
              to={menu.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-xl transition-all font-medium overflow-hidden whitespace-nowrap
                ${isActive 
                    ? "bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 shadow-sm" 
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100"
                }
                ${!isOpen && "justify-center"} 
                ` 
              }
            >
              <div>{menu.icon}</div>
              
              {/* Teks Menu */}
              <span className={`transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0 w-0 hidden"}`}>
                {menu.name}
              </span>
            </NavLink>
          ))}

          {/* --- TOMBOL DARK MODE (DIPINDAH KE SINI) --- */}
          <button
            onClick={toggleDarkMode}
            className={`flex items-center gap-3 px-3 py-3 mt-auto rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
            ${!isOpen && "justify-center"}
            `}
          >
            <span className="text-xl">
              {isDarkMode ? "☀️" : "🌙"}
            </span>
            <span className={`font-medium whitespace-nowrap transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0 w-0 hidden"}`}>
              {isDarkMode ? "Mode Terang" : "Mode Gelap"}
            </span>
          </button>
        </nav>

        {/* STATUS CARD */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-700">
            {isOpen ? (
                <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-xl p-4 animate-fade-in">
                    <p className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 uppercase">Status</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 font-bold mt-1">Ready to Work </p>
                </div>
            ) : (
                <div className="flex justify-center">
                    <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-500 dark:text-indigo-400">
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