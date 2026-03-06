const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// ==========================================
// 1. REGISTER
// ==========================================
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: "Email udah dipakai Bos!" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
            [name, email, hashedPassword]
        );
        res.status(201).json({ message: "Berhasil daftar! Silakan login." });
    } catch (err) {
        res.status(500).json({ error: "Server Error pas Register" });
    }
};

// ==========================================
// 2. LOGIN
// ==========================================
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) return res.status(400).json({ error: "Email ngga ketemu!" });

        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) return res.status(400).json({ error: "Password salah Bos!" });

        const token = jwt.sign(
            { id: user.rows[0].id, email: user.rows[0].email }, 
            process.env.JWT_SECRET || 'RahasiaNegaraMagangHunter2026', 
            { expiresIn: '1d' }
        );

        res.json({
            message: "Login Sukses!",
            token,
            user: { id: user.rows[0].id, name: user.rows[0].name, target_role: user.rows[0].target_role }
        });
    } catch (err) {
        res.status(500).json({ error: "Server Error pas Login" });
    }
};

// ==========================================
// 3. GET PROFILE (Ini yang bikin error 404 lu!)
// ==========================================
const getProfile = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, name, email, target_role FROM users WHERE id = $1', 
            [req.user.id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: "User ngga ada" });
        res.json({ user: result.rows[0] });
    } catch (err) {
        // 👇 INI CCTV-NYA BOS! Biar kita tau Supabase ngomong apa
        console.error("🚨 ERROR DARI KOKI/DATABASE:", err.message); 
        res.status(500).json({ error: "Server Error pas ngambil profil" });
    }
};

// ==========================================
// 4. UPDATE PROFILE
// ==========================================
const updateProfile = async (req, res) => {
    try {
        const { name, target_role } = req.body;
        await pool.query(
            'UPDATE users SET name = $1, target_role = $2 WHERE id = $3',
            [name, target_role, req.user.id]
        );
        res.json({ message: "Profil berhasil di-update Bos!" });
    } catch (err) {
        res.status(500).json({ error: "Server Error pas update profil" });
    }
};

module.exports = { register, login, getProfile, updateProfile };