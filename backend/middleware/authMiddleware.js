const jwt = require('jsonwebtoken'); // 1. Panggil library JWT (alat scanner tiket)

const verifyToken = (req, res, next) => {
    // 2. Cek Header Request: "Eh, lu bawa surat jalan (Authorization) gak?"
    const authHeader = req.headers['authorization'];
    
    // 3. Ambil Tokennya: Header biasanya isinya "Bearer <token_panjang>"
    // Kita cuma butuh bagian tokennya aja (index 1 setelah spasi).
    const token = authHeader && authHeader.split(' ')[1];

    // 4. Cek Keberadaan Token: Kalau kosong, berarti dia tamu tak diundang.
    if (token == null) return res.status(401).json({ msg: "Belum Login / Gak Ada Token" });

    // 5. Verifikasi Token: Validasi tanda tangan digitalnya.
    // Pake kunci rahasia yang sama pas bikin token (ACCESS_TOKEN_SECRET).
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        
        // 6. Kalau Error: Tokennya palsu atau expired
        if (err) return res.status(403).json({ msg: "Token Salah / Kadaluarsa" });
        
        // 7. SUCCESS!
        req.user = decoded; 
        
        // 8. Silakan Masuk
        next();
    });
};

module.exports = { verifyToken };