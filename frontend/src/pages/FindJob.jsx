import React, { useState, useEffect } from 'react';
import api from '../lib/axios'; 
import toast from 'react-hot-toast';
import { jobService } from '../features/jobs/services/jobService';
import { Toaster } from 'react-hot-toast';

const FindJob = () => {
const [query, setQuery] = useState(sessionStorage.getItem('savedQuery') || '');
    const [location, setLocation] = useState(sessionStorage.getItem('savedLocation') || 'Indonesia');
    const [results, setResults] = useState(JSON.parse(sessionStorage.getItem('savedResults')) || []);
    const [isLoading, setIsLoading] = useState(false);

    // 2. TAMBAHIN KODE INI: Suruh React nge-save data secara otomatis setiap kali isi pencarian berubah
    useEffect(() => {
        sessionStorage.setItem('savedQuery', query);
        sessionStorage.setItem('savedLocation', location);
        sessionStorage.setItem('savedResults', JSON.stringify(results));
    }, [query, location, results]);
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query) return;

        setIsLoading(true);
        try {
            // Nembak backend bawa 2 data: search & location
            const response = await api.get(`/external-jobs?search=${query}&location=${location}`);
            console.log("INI DATA DARI JSEARCH BOS: ", response.data);
            setResults(response.data); 
        } catch (error) {
            console.error("Gagal mencari loker:", error);
            toast.error("Gagal mengambil data dari server luar!");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveToKanban = async (job) => {
        try {
            const newJobData = {
                                company_name: job.employer_name || 'Perusahaan Tidak Diketahui', // <--- Ganti jadi company_name
                                position: job.job_title,
                                status: 'Wishlist',
                                url: job.job_apply_link || job.job_google_link,
                            };
            await jobService.create(newJobData);
            toast.success("Berhasil disimpan ke Kanban!");
        } catch (error) {
            console.error("Gagal save loker:", error);
            toast.error("Gagal menyimpan ke database.");
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">

            <Toaster position="top-right" reverseOrder={false} />
            <h1 className="text-3xl font-bold mb-6">🔍 Cari Magang Impian</h1>

            {/* FORM PENCARIAN & FILTER LOKASI */}
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-8">
                <input 
                    type="text" 
                    placeholder="Contoh: React Developer, UI/UX..." 
                    className="flex-grow p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                
                {/* DROPDOWN REGION FILTER */}
                <select 
                    className="p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-700"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                >
                    <option value="Indonesia">🇮🇩 Seluruh Indonesia</option>
                    <option value="Jakarta, Indonesia">🏢 Jakarta</option>
                    <option value="Bekasi, Indonesia">🏭 Bekasi / Cikarang</option>
                    <option value="Singapore">🇸🇬 Singapore</option>
                    <option value="Global">🌍 Seluruh Dunia (Global/Remote)</option>
                </select>

                <button 
                    type="submit" 
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 whitespace-nowrap"
                    disabled={isLoading}
                >
                    {isLoading ? 'Mencari...' : 'Search'}
                </button>
            </form>

            {/* HASIL PENCARIAN */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.length > 0 ? (
                    results.map((job, index) => (
                        <div key={index} className="border p-5 rounded-xl shadow-sm bg-white flex flex-col justify-between hover:shadow-md transition">
                            <div>
                                <h2 className="font-bold text-xl mb-1 text-gray-800">{job.job_title}</h2>
                                <p className="text-blue-600 font-semibold">{job.employer_name}</p>
                                <div className="flex items-center gap-2 mt-2 mb-3">
                                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded font-medium">
                                        📍 {job.job_city || job.job_country || 'Remote/Unknown'}
                                    </span>
                                    <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded font-medium">
                                        💼 {job.job_employment_type || 'Full-time'}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 mt-2 line-clamp-3">
                                    {job.job_description || "Tidak ada deskripsi singkat."}
                                </p>
                            </div>
                            
                            <div className="mt-5 flex justify-between items-center gap-2">
                                <a 
                                    href={job.job_apply_link || job.job_google_link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-500 text-sm font-medium hover:underline"
                                >
                                    Detail Asli ↗
                                </a>
                                <button 
                                    onClick={() => handleSaveToKanban(job)}
                                    className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-600 transition"
                                >
                                    + Save to Kanban
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    !isLoading && <p className="text-gray-500 col-span-full text-center py-10">Pilih lokasi dan masukkan kata kunci untuk mulai mencari.</p>
                )}
            </div>
        </div>
    );
};

export default FindJob;