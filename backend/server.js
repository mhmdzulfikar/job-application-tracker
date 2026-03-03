require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;
const authRoutes = require('./routes/authRoutes');

// Middleware
app.use(cors());
app.use(express.json()); // Biar backend bisa baca request JSON dari React

app.use('/api/auth', authRoutes);

// Route Percobaan
app.get('/', (req, res) => {
    res.json({ message: "========= Welcome to MagangHunter API! Server is running! =========" });
});

// Nyalain Mesin
app.listen(PORT, () => {
    console.log(`========= Server MagangHunter port ${PORT} =========`);
});