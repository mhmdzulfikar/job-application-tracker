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

        // A. Cek User di Database
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(400).json({ error: "Email belum terdaftar!" });
        }

        const user = result.rows[0]; // <--- NAH! DI SINI VARIABEL 'user' BARU LAHIR!

        // B. Cek Password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: "Password salah Bos!" });
        }

        // C. BIKIN TIKET & MASUKIN KE BRANKAS (TARUH KODENYA DI SINI!)
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: false, 
           sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 
        });

        // D. Balikin respon sukses (Tanpa nyebutin tokennya)
        res.json({ 
            message: "Login sukses!", 
            user: { id: user.id, name: user.name, target_role: user.target_role } 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server lagi pusing." });
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


// FUNGSI BUAT NGANCURIN BRANKAS COOKIE
const logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
    res.json({ message: "Brankas dihancurkan. Berhasil logout!" });
};



module.exports = { 
    register, 
    login, 
    getProfile,
    updateProfile,
    logout
};