require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./config/db'); 
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 5000;
const jobRoutes = require('./routes/jobRoutes');
const authRoutes = require('./routes/authRoutes');
const { searchExternalJobs } = require('./controllers/externalJobController');

// ==============================
// 1. MIDDLEWARE (SATPAM DEPAN WAJIB DI ATAS)
// ==============================
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true // INI KUNCI SAKTINYA BIAR COOKIE BISA NYEBRANG!
}));

app.use(express.json()); 
app.use(cookieParser()); // ✅ PINDAHIN KE SINI BOS! WAJIB SEBELUM ROUTES!

app.get('/ping', (req, res) => {
    res.json({ message: "PONG! SERVER SEHAT!" });
});

// ==============================
// 2. ROUTES (JALAN TOL API)
// ==============================
app.use('/api/auth', authRoutes); 
app.use('/api/jobs', jobRoutes);
app.get('/api/external-jobs', searchExternalJobs); 

// Route Percobaan
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