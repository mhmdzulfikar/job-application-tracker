const express = require('express');
const router = express.Router();

// Panggil Koki kita
const { register, login, getProfile, updateProfile, logout } = require('../controllers/authController');

// Panggil Satpam kita
const  verifyToken  = require('../middleware/authMiddleware'); 

// Rute Publik (Tanpa Tiket)
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Rute Rahasia (Wajib Pakai Tiket / verifyToken) -> INI PINTU BUAT /profile BOS!
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);

module.exports = router;