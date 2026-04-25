import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaClipboardList, FaChartPie, FaArrowRight, FaGithub, FaBriefcase } from "react-icons/fa";

// --- 1. KOMPONEN BUAT EFEK MUNCUL (SCROLL REVEAL) ---
const RevealOnScroll = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target); 
        }
      },
      { threshold: 0.1 } 
    );

    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const LandingPage = () => {
  // --- 2. LOGIC PARALLAX (MOUSE MOVE) ---
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    // Dibikin lebih smooth pergerakannya
    const x = (e.clientX - window.innerWidth / 2) / 35; 
    const y = (e.clientY - window.innerHeight / 2) / 35;
    setMousePosition({ x, y });
  };

  return (
    <div 
        onMouseMove={handleMouseMove}
        className="min-h-screen bg-[#FAFAFA] text-slate-800 font-sans selection:bg-indigo-200 overflow-x-hidden"
    >
      
      {/* --- NAVBAR GLASSMORPHISM --- */}
      <nav className="fixed top-0 w-full py-4 px-6 md:px-12 flex justify-between items-center z-50 bg-white/70 backdrop-blur-lg border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
            <div className="text-2xl font-extrabold tracking-tight flex items-center gap-2 cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-lg flex items-center justify-center text-white text-sm shadow-md shadow-indigo-200">
                    <FaBriefcase />
                </div>
                <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    MagangHunter
                </span>
            </div>
            <div className="flex gap-4 items-center">
                <Link to="/login" className="px-5 py-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors hidden md:block">
                    Sign In
                </Link>
                <Link to="/register" className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2">
                    Mulai Berburu <FaArrowRight className="text-xs"/>
                </Link>
            </div>
        </div>
      </nav>

      {/* --- HERO SECTION DENGAN GRID BACKGROUND --- */}
      <header className="relative pt-40 pb-20 overflow-hidden">
        {/* Background Pattern Grid ala Developer Tools */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
            <RevealOnScroll>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 font-semibold text-xs tracking-wide uppercase shadow-sm">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                    Tinggalkan Spreadsheet Lama
                </div>
            </RevealOnScroll>

            <RevealOnScroll delay={100}>
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1]">
                    Lacak Lamaran Kerja. <br className="hidden md:block"/>
                    <span className="bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
                        Fokus Lolos Interview.
                    </span>
                </h1>
            </RevealOnScroll>

            <RevealOnScroll delay={200}>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
                    Sistem manajemen lamaran magang berbasis Kanban Board. Atur status <span className="font-semibold text-slate-700">Applied</span> hingga <span className="font-semibold text-slate-700">Offering</span> dengan drag-and-drop, pantau statistikmu, dan temukan loker langsung dalam satu aplikasi.
                </p>
            </RevealOnScroll>
            
            <RevealOnScroll delay={300}>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white text-lg font-bold rounded-xl shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 transition-all hover:-translate-y-1 flex items-center justify-center gap-2">
                        Coba Gratis Sekarang
                    </Link>
                    <a href="#features" className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 text-lg font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all text-center">
                        Lihat Cara Kerjanya
                    </a>
                </div>
            </RevealOnScroll>

            {/* --- AREA MOCKUP BROWSER (PARALLAX YANG BIKIN MAHAL) --- */}
            <div className="mt-20 relative mx-auto max-w-5xl group perspective-1000">
                <RevealOnScroll delay={400}>
                    {/* Glow Effect di belakang mockup */}
                    <div 
                        className="absolute -inset-4 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-[2rem] blur-2xl opacity-20 group-hover:opacity-40 transition duration-500"
                        style={{ transform: `translate(${mousePosition.x * -1}px, ${mousePosition.y * -1}px)` }}
                    ></div>
                    
                    {/* Mockup Window macOS */}
                    <div 
                        className="relative bg-white rounded-2xl shadow-2xl shadow-slate-900/20 border border-slate-200 overflow-hidden transform transition-transform duration-200 ease-out flex flex-col"
                        style={{
                            transform: `rotateX(${mousePosition.y * 0.05}deg) rotateY(${mousePosition.x * 0.05}deg)`,
                            height: '500px'
                        }}
                    >
                        {/* Title Bar macOS */}
                        <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center gap-2">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                            </div>
                            <div className="flex-1 text-center text-xs font-medium text-slate-400 font-mono">
                                app.maganghunter.com/kanban
                            </div>
                        </div>

                        {/* Isi Dashboard Dummy */}
                        <div className="flex-1 bg-slate-50/50 p-8 flex items-center justify-center relative overflow-hidden">
                            {/* Decorative Kanban Columns Placeholder */}
                            <div className="absolute inset-0 p-8 grid grid-cols-3 gap-6 opacity-40">
                                <div className="bg-slate-100 rounded-xl border border-dashed border-slate-300 h-full"></div>
                                <div className="bg-slate-100 rounded-xl border border-dashed border-slate-300 h-full mt-8"></div>
                                <div className="bg-slate-100 rounded-xl border border-dashed border-slate-300 h-full mt-4"></div>
                            </div>

                            <div className="relative z-10 flex flex-col items-center gap-4 bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 shadow-sm">
                                <FaClipboardList className="text-5xl text-indigo-500 drop-shadow-sm" />
                                <p className="font-bold text-slate-800 text-lg">Kanban Board Siap Digunakan</p>
                                <p className="text-sm text-slate-500">Tarik dan letakkan lamaranmu di sini.</p>
                            </div>
                        </div>
                    </div>
                </RevealOnScroll>
            </div>
        </div>
      </header>

      {/* --- TECH STACK (MINIMALIST) --- */}
      <section className="py-10 border-y border-slate-200 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest text-center md:text-left">Ditenagai Oleh Teknologi Modern</p>
            <div className="flex flex-wrap justify-center gap-8 text-slate-400 font-semibold text-lg">
                <span className="hover:text-[#61DAFB] transition-colors cursor-default">React.js</span>
                <span className="hover:text-[#339933] transition-colors cursor-default">Node.js</span>
                <span className="hover:text-[#06B6D4] transition-colors cursor-default">Tailwind</span>
                <span className="hover:text-[#336791] transition-colors cursor-default">PostgreSQL</span>
            </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
            <RevealOnScroll>
                <div className="mb-16 md:w-1/2">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 leading-tight">Satu Platform,<br/>Seluruh Proses Karirmu.</h2>
                    <p className="text-slate-500 text-lg">Sistem yang dirancang khusus untuk membuang rasa pusing akibat lupa status lamaran terakhir di berbagai perusahaan.</p>
                </div>
            </RevealOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                    {
                        icon: <FaClipboardList />,
                        title: "Visual Kanban Board",
                        desc: "Geser kartu lamaran dari kolom 'Applied', 'Test', 'Interview', hingga 'Accepted' hanya dengan sentuhan jari.",
                        color: "from-blue-500 to-cyan-400",
                        bg: "bg-blue-50"
                    },
                    {
                        icon: <FaChartPie />,
                        title: "Statistik Real-time",
                        desc: "Dashboard analitik untuk mengukur persentase keberhasilanmu menembus tahap interview secara otomatis.",
                        color: "from-indigo-500 to-purple-500",
                        bg: "bg-indigo-50"
                    },
                    {
                        icon: <FaBriefcase />,
                        title: "Integrasi Loker Live",
                        desc: "Cari lowongan magang langsung dari sistem, klik 'Save', dan data otomatis tersimpan di Kanban Board kamu.",
                        color: "from-emerald-400 to-teal-500",
                        bg: "bg-teal-50"
                    }
                ].map((feat, i) => (
                    <RevealOnScroll delay={100 * (i + 1)} key={i}>
                        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-900/5 transition-all duration-300 h-full group">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl mb-8 bg-gradient-to-br ${feat.color} shadow-sm group-hover:scale-110 transition-transform`}>
                                {feat.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900">{feat.title}</h3>
                            <p className="text-slate-500 leading-relaxed">{feat.desc}</p>
                        </div>
                    </RevealOnScroll>
                ))}
            </div>
        </div>
      </section>

      {/* --- CTA BOTTOM --- */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blur-[128px] opacity-20 translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <RevealOnScroll>
                <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Siap Mengakhiri Masa Pengangguran?</h2>
                <p className="text-slate-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
                    Berhenti membuang waktu membuka email satu per satu. Mulai rapihkan mimpimu malam ini juga.
                </p>
                <Link to="/register" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-slate-900 font-bold text-lg rounded-full shadow-xl hover:scale-105 hover:bg-indigo-50 transition-all">
                    Buat Akun MagangHunter <FaArrowRight />
                </Link>
            </RevealOnScroll>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-950 text-slate-500 py-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 font-bold text-slate-300">
                <FaBriefcase /> MagangHunter
            </div>
            <p className="text-sm">&copy; {new Date().getFullYear()} MagangHunter. Engineered by Muhamad Zulfikar.</p>
            <div className="flex gap-4">
                <a href="https://github.com/mhmzulfikar" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                    <FaGithub className="text-xl" />
                </a>
            </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;