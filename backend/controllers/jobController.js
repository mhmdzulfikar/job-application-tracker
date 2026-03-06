const pool = require('../config/db');

// 1. AMBIL SEMUA LAMARAN (GET)
const getJobs = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM jobs WHERE user_id = $1 ORDER BY created_at DESC',
            [req.user.id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Gagal ngambil data lamaran dari brankas Bos!" });
    }
};

// 2. TAMBAH LAMARAN BARU (POST)
const createJob = async (req, res) => {
    try {
        const { company_name, position, status, date_applied } = req.body;
        
        const newJob = await pool.query(
            `INSERT INTO jobs (user_id, company_name, position, status, date_applied) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [req.user.id, company_name, position, status || 'applied', date_applied || new Date()]
        );
        res.status(201).json(newJob.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Gagal nambahin lamaran baru Bos!" });
    }
};

// 3. UPDATE STATUS LAMARAN (PUT) - Buat pas kartu digeser (Drag & Drop)
const updateJob = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updatedJob = await pool.query(
            'UPDATE jobs SET status = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
            [status, id, req.user.id]
        );

        if (updatedJob.rows.length === 0) {
            return res.status(404).json({ error: "Lamaran ngga ketemu atau bukan punya lu Bos!" });
        }
        res.json(updatedJob.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Gagal update status lamaran Bos!" });
    }
};

// 4. HAPUS LAMARAN (DELETE)
const deleteJob = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedJob = await pool.query(
            'DELETE FROM jobs WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, req.user.id]
        );

        if (deletedJob.rows.length === 0) {
            return res.status(404).json({ error: "Lamaran ngga ketemu atau bukan punya lu Bos!" });
        }
        res.json({ message: "Lamaran berhasil dihapus permanen! 🗑️" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Gagal hapus lamaran Bos!" });
    }
};

module.exports = { getJobs, createJob, updateJob, deleteJob };