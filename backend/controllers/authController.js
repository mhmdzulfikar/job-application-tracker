const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// ==========================================
// 1. FUNGSI REGISTER (DAFTAR AKUN BARU)
// ==========================================
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Cek apakah email udah pernah dipakai?
        const userExist = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExist.rows.length > 0) {
            return res.status(400).json({ error: "Waduh Bos, Email ini udah terdaftar! ❌" });
        }

        // Enkripsi (Hash) Password pakai bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Masukin data ke Database Supabase
        const newUser = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, role',
            [name, email, hashedPassword]
        );

        res.status(201).json({ 
            message: "Akun berhasil dibuat Bos! 🎉", 
            user: newUser.rows[0] 
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server Error di fungsi Register 🚨" });
    }
};

// ==========================================
// 2. FUNGSI LOGIN (MASUK APLIKASI)
// ==========================================
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Cari user berdasarkan email
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(401).json({ error: "Email belum terdaftar Bos! ❌" });
        }

        // Cocokin password yang diketik sama password acak di Database
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(401).json({ error: "Password salah Bos! Coba ingat-ingat lagi ❌" });
        }

        // Kalau benar, kita buatin Tiket Masuk (Token JWT)
        const token = jwt.sign(
            { id: user.rows[0].id, role: user.rows[0].role }, // Data yang diselipin ke token
            process.env.JWT_SECRET,                           // Stempel rahasia dari .env
            { expiresIn: '1d' }                               // Tiket hangus dalam 1 hari
        );

        res.json({
            message: "Login Sukses! Selamat datang Bos! 🚀",
            token: token,
            user: {
                id: user.rows[0].id,
                name: user.rows[0].name,
                email: user.rows[0].email,
                role: user.rows[0].role
            }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server Error di fungsi Login 🚨" });
    }
};

module.exports = { register, login };