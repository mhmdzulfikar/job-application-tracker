require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./config/db'); // Pastikan ini ngga error ya path-nya

const app = express();
const PORT = process.env.PORT || 5000;
const jobRoutes = require('./routes/jobRoutes');
const authRoutes = require('./routes/authRoutes');
const { searchExternalJobs } = require('./controllers/externalJobController');

// ==============================
// 1. MIDDLEWARE (SATPAM DEPAN WAJIB DI ATAS)
// ==============================
app.use(cors({ origin: '*' })); // CORS harus di atas biar jalan tol-nya kebuka buat React!
app.use(express.json()); // Biar backend bisa baca request JSON dari React
app.get('/ping', (req, res) => {
    res.json({ message: "PONG! SERVER SEHAT!" });
});

// ==============================
// 2. ROUTES (JALAN TOL API)
// ==============================
app.use('/api/auth', authRoutes); 
app.use('/api/jobs', jobRoutes);
app.get('/api/external-jobs', searchExternalJobs); // Route buat nembak API luar (JSearch)

// Route Percobaan (Buat ngecek server hidup/mati)
app.get('/', (req, res) => {
    res.json({ message: "========= Welcome to MagangHunter API! Server is running! =========" });
});

// ==============================
// 3. NYALAIN MESIN & EXPORT VERCEL
// ==============================
app.listen(PORT, () => {
    console.log(`========= Server MagangHunter port ${PORT} =========`);
});



module.exports = app;