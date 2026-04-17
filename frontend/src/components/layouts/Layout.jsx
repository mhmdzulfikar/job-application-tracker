import { useState, useEffect } from "react";
import { Outlet, NavLink } from "react-router-dom";
import OnboardingModal from "../../features/jobs/components/OnboardingModal";
import api from "../../lib/axios"; 

import { 
  FaColumns, 
  FaChartPie, 
  FaCog, 
  FaChevronLeft, 
  FaChevronRight, 
  FaRocket,
  FaUserAstronaut,
  FaBars,
  FaTimes,
  FaBrain
} from "react-icons/fa";

export default function Layout() {
  // 1. STATE MANAGEMENT
  const [isOpen, setIsOpen] = useState(() => {
    const savedSidebar = localStorage.getItem("sidebar-open");
    return savedSidebar !== null ? JSON.parse(savedSidebar) : true;
  });
  
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [streak, setStreak] = useState(0);

  // 👇 2. State Profil (Awalnya kosong, nanti diisi dari Backend)
  const [userProfile, setUserProfile] = useState(null);

  const menus = [
    { name: "Board", path: "/dashboard", icon: <FaColumns size={20} /> },
    { name: "Analytics", path: "/analytics", icon: <FaChartPie size={20} /> },
    { name: "Find Job", path: "/find-job", icon: <FaRocket size={20} /> },
    { name: "Settings", path: "/settings", icon: <FaCog size={20} /> },
    { name: "AIAgent", path: "/aiagent", icon: <FaBrain size={20} /> },
  ];

  // ==========================================
  // 3. AMBIL DATA PROFIL DARI CLOUD (BACKEND)
  // ==========================================
  // Logic-nya: Pas halaman pertama kali diload, kita nanya ke server, "Siapa nama user yang lagi login?"
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token"); // Cek tiket masuk di browser
        if (!token) return; // Kalau ga ada tiket, yaudah ga usah nanya server

        // Suruh kurir nembak API
        const response = await api.get('/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Tangkep datanya dan masukin ke State React biar tampil di Sidebar
        setUserProfile({
            name: response.data.user.name,
            role: response.data.user.target_role // Inget, nama kolom di DB kita itu 'target_role'
        });

      } catch (error) {
        console.error("Gagal ngambil profil di Layout:", error);
      }
    };

    fetchProfile(); // Jalanin fungsinya
  }, []); // [] artinya cuma dijalanin sekali pas halaman pertama dirender

  useEffect(() => {
    localStorage.setItem("sidebar-open", JSON.stringify(isOpen));
  }, [isOpen]);

  useEffect(() => {
   const today = new Date().toDateString();
   const storedGamification = JSON.parse(localStorage.getItem('magang-gamification') || '{"streak": 0, "lastDate": null}');

   if (storedGamification.lastDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (storedGamification.lastDate === yesterday.toDateString()){
      storedGamification.streak += 1;
    } else {
      storedGamification.streak = 1;
    }

    storedGamification.lastDate = today;
    localStorage.setItem('magang-gamification', JSON.stringify(storedGamification));
   }

   setStreak(storedGamification.streak);
  }, []);

   // 4. SIDE EFFECTS LAINNYA
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
    <div className="flex h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300 overflow-hidden">
      
      {/* Kalau user belum isi target_role (Posisi Impian), OnboardingModal bakal nongol. 
        Pas dia selesai ngisi dan nyimpen ke Backend, OnboardingModal manggil onComplete 
        dan ngupdate tampilan Sidebar lu!
      */}
      <OnboardingModal onComplete={(profileData) => setUserProfile({
          name: profileData.name,
          role: profileData.target_role
      })} />

      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* --- SIDEBAR --- */}
      <aside 
        className={`fixed md:relative z-40 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 ease-in-out
        ${isMobileOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0"} 
        ${isOpen ? "md:w-64" : "md:w-20"} 
        `} 
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100 dark:border-gray-700 shrink-0">
          <h1 className={`text-xl font-bold text-indigo-600 dark:text-indigo-400 truncate transition-opacity duration-300
            ${!isOpen && "md:opacity-0 md:hidden"}
          `}>
            MagangHunter
          </h1>
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="hidden md:block p-1.5 rounded-lg bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-300 hover:text-indigo-600 transition-colors shrink-0"
          >
            {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
          </button>
          <button 
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden p-1.5 text-gray-500 dark:text-gray-300"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-2 flex flex-col overflow-y-auto custom-scrollbar">
          {menus.map((menu) => (
            <NavLink
              key={menu.name}
              to={menu.path}
              onClick={() => setIsMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-xl transition-all font-medium overflow-hidden whitespace-nowrap
                ${isActive 
                    ? "bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 shadow-sm" 
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100"
                }
                ${!isOpen && "md:justify-center"} 
                ` 
              }
            >
              <div className="shrink-0">{menu.icon}</div>
              <span className={`transition-opacity duration-200 
                ${isOpen ? "opacity-100" : "md:opacity-0 md:w-0 md:hidden"}
              `}>
                {menu.name}
              </span>
            </NavLink>
          ))}

          <button
            onClick={toggleDarkMode}
            className={`flex items-center gap-3 px-3 py-3 mt-auto rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
            ${!isOpen && "md:justify-center"}
            `}
          >
            <span className="text-xl shrink-0">
              {isDarkMode ? "☀️" : "🌙"}
            </span>
            <span className={`font-medium whitespace-nowrap transition-opacity duration-200 
                ${isOpen ? "opacity-100" : "md:opacity-0 md:w-0 md:hidden"}
            `}>
              {isDarkMode ? "Mode Light" : "Mode Dark"}
            </span>
          </button>
        </nav>

        {/* --- AREA PROFIL USER (Udah Fix) --- */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-700 shrink-0">
            <div className={`mb-3 transition-all duration-300 ${!isOpen && "md:hidden"}`}> 
                {/* Kalau data userProfile udah berhasil diambil dari Backend, tampilin ini */}
                {userProfile ? (
                    <div className="bg-indigo-50 dark:bg-gray-800 p-4 rounded-xl border border-indigo-100 dark:border-gray-700 flex items-center gap-3 shadow-sm">
                        <div className="bg-indigo-500 text-white p-2.5 rounded-lg shrink-0">
                            <FaUserAstronaut />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Semangat,</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate" title={userProfile.name}>
                                {userProfile.name}
                            </p>
                            <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold truncate mt-0.5">
                                Target: {userProfile.role || "Belum diisi"}
                            </p>

                            <div className="flex items-center gap-1 mt-1 bg-orange-100 dark:bg-orange-900/40 px-2 py-0.5 rounded-md w-fit border border-orange-200 dark:border-orange-800/50">
                                <span className="text-[10px]">🔥</span>
                                <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400">
                                    {streak} Hari Streak!
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Kalau masih loading nunggu balasan dari Backend, tampilin animasi kotak abu-abu (Pulse)
                    <div className="h-16 w-full bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"></div>
                )}
            </div>

            {/* {isOpen ? (
                <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-xl p-4 animate-fade-in w-full md:block hidden">
                    <p className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 uppercase">Status</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 font-bold mt-1">Ready to Work </p>
                </div>
            ) : (
                <div className="hidden md:flex justify-center">
                    <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-500 dark:text-indigo-400 cursor-pointer" title="Ready to Work">
                        <FaRocket />
                    </div>
                </div>
            )} */}
        </div>
      </aside>

      {/* --- KONTEN UTAMA --- */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        <header className="md:hidden h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-2">
            <FaRocket className="text-indigo-600 dark:text-indigo-400" size={20} />
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">MagangHunter</h1>
          </div>
          <button 
            onClick={() => setIsMobileOpen(true)}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <FaBars size={20} />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

    </div>
  );
}