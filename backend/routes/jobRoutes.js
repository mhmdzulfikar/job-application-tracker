const express = require('express');
const router = express.Router();
const { getJobs, createJob, updateJob, deleteJob } = require('../controllers/jobController');

// 1. Lu import namanya "verifyToken"
const { verifyToken } = require('../middleware/authMiddleware'); 

// 2. Makanya di sini pakenya juga HARUS "verifyToken" Bos!
router.use(verifyToken); 

router.get('/', getJobs);               // Ambil semua
router.post('/', createJob);            // Tambah baru
router.put('/:id', updateJob);          // Update status
router.delete('/:id', deleteJob);       // Hapus

module.exports = router;