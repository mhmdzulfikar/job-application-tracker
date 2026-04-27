const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // console.log("CCTV MENDETEKSI COOKIES: ", req.cookies);
    // 1. CARA BARU: Satpam langsung ngecek brankas Cookie!
    // (Pastiin lu pake req.cookies, JANGAN req.headers lagi)
    const token = req.cookies?.token;

    // 2. Kalau brankasnya kosong (User belum login)
    if (!token) {
        return res.status(401).json({ error: "Akses ditolak! Tiket tidak ditemukan di dalam Cookie." });
    }

    try {
        // 3. Cek keaslian tiket
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Masukin data user (ID) ke request biar bisa dipake sama Controller
        next(); // Silakan masuk Bos!
    } catch (error) {
        res.status(403).json({ error: "Token tidak valid atau sudah expired!" });
    }
};

module.exports = verifyToken;