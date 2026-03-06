
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaRocket, FaCode, FaGamepad, FaClock, FaCheckCircle, FaArrowRight } from "react-icons/fa";

// Import gambar assets
// import dashboardImg from "../assets/image.png"; 

// --- 1. KOMPONEN BUAT EFEK MUNCUL (SCROLL REVEAL) ---
const RevealOnScroll = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Jika elemen muncul di layar, set visible
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target); // Stop observasi setelah muncul (biar performa ringan)
        }
      },
      { threshold: 0.1 } // Muncul saat 10% elemen terlihat
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
        isVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-20"
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
    // Menghitung posisi mouse relatif terhadap tengah layar
    const x = (e.clientX - window.innerWidth / 2) / 25; // Bagi 25 biar gerakannya halus/lambat
    const y = (e.clientY - window.innerHeight / 2) / 25;
    setMousePosition({ x, y });
  };

  return (
    // Tambahkan 'scroll-smooth' di parent div atau html (biasanya di global css, tapi disini kita paksa di div utama)
    // onMouseMove dipasang di sini untuk efek parallax
    <div 
        onMouseMove={handleMouseMove}
        className="min-h-screen bg-white text-gray-800 font-sans selection:bg-indigo-100 overflow-x-hidden"
        style={{ scrollBehavior: "smooth" }} // CSS Smooth Scroll
    >
      
      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full py-4 px-6 md:px-12 flex justify-between items-center max-w-7xl mx-auto left-0 right-0 z-50 bg-white/80 backdrop-blur-md transition-all border-b border-gray-100">
        <div className="text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent cursor-pointer">
          DevBoard
        </div>
        <div className="flex gap-4 items-center">
          <Link 
            to="/login" 
            className="px-6 py-2 rounded-full text-gray-600 font-bold hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-300"
          >
            Login
          </Link>
          <Link to="/register" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold transition-all shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5">
            Get Started
          </Link>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="max-w-7xl mx-auto px-6 pt-32 pb-20 text-center relative">
        
        <RevealOnScroll>
            <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-indigo-50 text-indigo-700 font-semibold text-sm border border-indigo-100">
                🚀 The Ultimate Productivity Tool for Developers
            </div>
        </RevealOnScroll>

        <RevealOnScroll delay={100}>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
            Manage Code. <br className="hidden md:block"/>
            <span className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                Level Up Your Life.
            </span>
            </h1>
        </RevealOnScroll>

        <RevealOnScroll delay={200}>
            <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10">
            Gabungkan Todo List, Code Snippet Library, dan Gamification RPG dalam satu dashboard. 
            Selesaikan tugas, dapatkan XP, dan jadilah developer yang lebih produktif.
            </p>
        </RevealOnScroll>
        
        <RevealOnScroll delay={300}>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center z-20 relative">
            <Link to="/register" className="px-8 py-4 bg-indigo-600 text-white text-lg font-bold rounded-xl shadow-xl hover:bg-indigo-700 transition-all hover:-translate-y-1 flex items-center gap-2">
                Start Your Journey <FaArrowRight />
            </Link>
            {/* Tombol Smooth Scroll ke #features */}
            <a 
                href="#features" 
                onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 bg-white text-gray-700 border border-gray-200 text-lg font-bold rounded-xl hover:bg-gray-50 transition-all cursor-pointer"
            >
                Learn More
            </a>
            </div>
        </RevealOnScroll>

        {/* --- AREA FOTO/SCREENSHOT (DENGAN PARALLAX) --- */}
        <div className="mt-16 relative mx-auto max-w-5xl group perspective-1000">
            <RevealOnScroll delay={400}>
                {/* Efek Glow Bergerak Mengikuti Mouse (Parallax) */}
                <div 
                    className="absolute -inset-1 bg-linear-to-r from-indigo-500 to-purple-600 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition duration-200"
                    style={{
                        transform: `translate(${mousePosition.x * -1}px, ${mousePosition.y * -1}px)`
                    }}
                ></div>
                
                {/* Container Gambar */}
                <div 
                    className="relative bg-slate-900 rounded-2xl p-1 shadow-2xl border border-slate-800 overflow-hidden transform transition-transform duration-100 ease-out"
                    style={{
                        transform: `rotateX(${mousePosition.y * 0.05}deg) rotateY(${mousePosition.x * 0.05}deg)`
                    }}
                >
                    <img 
                        // src={dashboardImg} 
                        alt="App Screenshot" 
                        className="w-full h-auto rounded-xl shadow-inner"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-linear-to-t from-slate-900/50 via-transparent to-transparent pointer-events-none"></div>
                </div>
            </RevealOnScroll>
        </div>
      </header>

      {/* --- FEATURES GRID --- */}
      <section id="features" className="py-24 bg-gray-50 relative overflow-hidden">
        {/* Dekorasi Background Bulat */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -left-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-40 -right-20 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
            <RevealOnScroll>
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Developers Love DevBoard?</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">Kami mengerti kebutuhan developer. Bukan sekadar to-do list biasa, ini adalah command center kamu.</p>
                </div>
            </RevealOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Feature 1 */}
                <RevealOnScroll delay={100}>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full">
                        <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 text-2xl mb-6">
                            <FaGamepad />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-gray-800">RPG Gamification</h3>
                        <p className="text-gray-500 leading-relaxed">
                            Ubah pekerjaan membosankan menjadi petualangan. Dapatkan <span className="font-bold text-indigo-600">XP</span> setiap menyelesaikan task dan naikkan Level kamu!
                        </p>
                    </div>
                </RevealOnScroll>

                {/* Feature 2 */}
                <RevealOnScroll delay={200}>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full">
                        <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 text-2xl mb-6">
                            <FaCode />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-gray-800">Snippet Library</h3>
                        <p className="text-gray-500 leading-relaxed">
                            Jangan pernah kehilangan kode penting lagi. Simpan snippet JavaScript, CSS, atau Python kamu di satu tempat yang aman dan rapi.
                        </p>
                    </div>
                </RevealOnScroll>

                {/* Feature 3 */}
                <RevealOnScroll delay={300}>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full">
                        <div className="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center text-pink-600 text-2xl mb-6">
                            <FaClock />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-gray-800">Focus Timer</h3>
                        <p className="text-gray-500 leading-relaxed">
                            Gunakan teknik Pomodoro bawaan untuk menjaga fokus coding. Timer otomatis terintegrasi dengan sistem XP kamu.
                        </p>
                    </div>
                </RevealOnScroll>
            </div>
        </div>
      </section>

      {/* --- TECH STACK --- */}
      <section className="py-12 border-t border-gray-200 bg-white">
        <RevealOnScroll>
            <div className="max-w-7xl mx-auto px-6 text-center">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Built with Modern Tech Stack</p>
                <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    <span className="text-xl font-bold flex items-center gap-2 hover:scale-110 transition-transform"><span className="text-blue-500">⚛️</span> React</span>
                    <span className="text-xl font-bold flex items-center gap-2 hover:scale-110 transition-transform"><span className="text-green-500">🟢</span> Node.js</span>
                    <span className="text-xl font-bold flex items-center gap-2 hover:scale-110 transition-transform"><span className="text-blue-400">🌊</span> Tailwind</span>
                    <span className="text-xl font-bold flex items-center gap-2 hover:scale-110 transition-transform"><span className="text-yellow-500">⚡</span> Vite</span>
                    <span className="text-xl font-bold flex items-center gap-2 hover:scale-110 transition-transform"><span className="text-blue-600">🐘</span> PostgreSQL</span>
                </div>
            </div>
        </RevealOnScroll>
      </section>

      {/* --- CTA BOTTOM --- */}
      <section className="py-24 bg-slate-900 text-white text-center px-6 relative overflow-hidden">
        {/* Dekorasi Background CTA */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-linear-to-b from-indigo-900/50 to-slate-900 pointer-events-none"></div>

        <div className="max-w-3xl mx-auto relative z-10">
            <RevealOnScroll>
                <h2 className="text-4xl font-bold mb-6">Ready to Boost Your Productivity?</h2>
                <p className="text-slate-400 text-lg mb-8">
                    Bergabunglah sekarang dan rasakan sensasi coding yang berbeda. Gratis selamanya untuk developer indie.
                </p>
                <Link to="/register" className="inline-block px-10 py-4 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-500/50 hover:scale-105 transition-all">
                    Create Free Account
                </Link>
            </RevealOnScroll>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-950 text-slate-500 py-8 text-center text-sm border-t border-slate-900">
        <p>&copy; {new Date().getFullYear()} DevBoard. Built with MZ.</p>
      </footer>

    </div>
  );
};

export default LandingPage;
