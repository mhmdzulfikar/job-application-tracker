const axios = require('axios');

const searchExternalJobs = async (req, res) => {
    // Tangkap kata kunci DAN lokasi dari React
    const { search, location } = req.query; 

    if (!search) {
        return res.status(400).json({ error: "Kata kunci pencarian tidak boleh kosong!" });
    }

    // LOGIKA PINTAR: Gabungin keyword sama lokasi
    // Contoh: "Frontend Intern" + "in Indonesia" = "Frontend Intern in Indonesia"
    let finalQuery = search;
    if (location && location !== 'Global') {
        finalQuery = `${search} in ${location}`;
    }

    console.log(`🔎 Mencari lowongan: "${finalQuery}"...`);

    const options = {
        method: 'GET',
        url: 'https://jsearch.p.rapidapi.com/search',
        params: {
            query: finalQuery, // Pakai query yang udah digabung lokasi
            page: '1',
            num_pages: '1'
        },
        headers: {
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        res.json(response.data.data); 
    } catch (error) {
        console.error("ALASAN ERROR:", error.message); 
        res.status(500).json({ error: "Gagal mengambil data dari server luar." });
    }
};

module.exports = { searchExternalJobs };