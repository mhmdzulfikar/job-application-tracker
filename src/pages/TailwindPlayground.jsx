// src/pages/TailwindPlayground.jsx
import React, {useState} from 'react';
import {FaHeart, FaRegHeart} from  'react-icons/fa';

export default function TailwindPlayground() {
  const [isFollowed, setIsFollowed] = useState(false); // boleean buat toggle tombol follow
  const [isLiked, setIsLiked] = useState(false); // boolean buat toggle tombol like (hati)
  const [likeCount, setLikeCount] = useState(0); // state buat nyimpen jumlah like
  const [name, setName] = useState("ZULFIKAR"); // state buat nyimpen nama di kartu profil


  const handleLikeToggele = () => {
    if (isLiked) {
      setLikeCount(likeCount -1);
      setIsLiked(false);
    } else {
      setLikeCount(likeCount +1);
      setIsLiked(true);
    }
  }


  return (
    <div className="p-10 min-h-screen bg-gray-100 flex flex-col gap-10">
      
      {/* JUDUL */}
      <h1 className="text-3xl font-bold text-gray-800 border-b-4 border-indigo-500 pb-2 w-fit">
        Tailwind Playground 
      </h1>

      {/* AREA 1: LATIHAN KARTU PROFIL (Yang kemarin) */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-600">1. Profile Card</h2>
        
        {/* Paste Kodingan Kartu Profil Lu Di Sini */}
        <div className="bg-white w-64 rounded-[10px] gap-4 mt-6  shadow-lg p-6 flex flex-col justify-center items-center">
            <div className="bg-blue-500 w-24 h-24 rounded-full mb-4"></div>

            <h1 className="text-2xl font-bold text-gray-800 uppercase">
              {name}
              </h1>

              <div className="mt-6 w-full">
                <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='Ganti nama kamu...'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-center text-sm'
                />
              </div>


            <p className="text-sm text-gray-500 mb-2">Mahasiswa Semester 6</p>
            <ul className="text-xs text-gray-600 text-center mb-6">
                <li>Skill: React, Tailwindcss, HTML, CSS</li>
            </ul>

            {/* // Tombol follow yang bisa toggle warna dan tulisan */}
            <button 
                onClick={() => setIsFollowed(!isFollowed)}
                className={`px-6 py-2 rounded-full font-semibold shadow-md transition duration-300
            ${isFollowed 
              ? 'bg-green-500 hover:bg-green-600' 
              : 'bg-blue-500 hover:bg-blue-600'
            }
            `}
            >
            {isFollowed ? "Unfollow" : "Follow"}
            </button>
             <button className="bg-blue-500 text-white px-6 py-2 rounded-full font-semibold shadow-md hover:bg-blue-600 transition duration-300">
                Contact Me
            </button>
              <button className="bf-transparent border-2 border-blue-500 text-blue-500 px-6 py-2 rounded-full font-semibold shadow-md hover:bg-blue-500 hover:text-white transition duration-300">
               Portofolio
            </button>

              {/* // Tombol like (hati) yang bisa toggle warna dan ikon */}
            <button
              onClick={handleLikeToggele}
              className={`p-3 rounded-full shadow-md transition-all duration-300 transform active:scale-90
                ${isLiked 
                  ? "bg-red-50 text-red-500 border-red-500" 
                  : "bg-white text-gray-400 border-gray-200"
                }
                `}
                >
              {isLiked ? <FaHeart size={24} /> : <FaRegHeart size={24} />}

              <span className="font-semibold text-sm" >
                {likeCount}
              </span>
            </button>

              {isLiked && (
                <p className="mt-2 text-xs text-green-600 font-semibold animate-bounce ">
                  You liked this!
                </p>
              )}

        </div>

        
        
      </section>

    </div>
  );
}