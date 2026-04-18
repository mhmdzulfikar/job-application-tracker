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
        res.status(500).json({ error: "Gagal ngambil data lamaran dari brankas!" });
    }
};

// 2. TAMBAH LAMARAN BARU (POST)
const createJob = async (req, res) => {
    try {
        const { company_name, position, salary, status, date_applied } = req.body;
        
        const newJob = await pool.query(
            `INSERT INTO jobs (user_id, company_name, position, salary, status, date_applied) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [
            req.user.id, 
            company_name, 
            position, 
            salary || null,
            status || 'applied', 
            date_applied || new Date()
        ]
        );
        res.status(201).json(newJob.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Gagal nambahin lamaran baru Bos!" });
    }
};

// 3. UPDATE STATUS LAMARAN (PUT) - Buat pas kartu digeser (Drag & Drop)
// backend/controllers/jobController.js

const updateJob = async (req, res) => {
    try {



        const { id } = req.params;
        // 1. Tangkap SEMUA data yang dikirim dari React
        const { company_name, position, salary, status, url, interview_date, notes, tasks } = req.body;

        // 2. Update ke Database (Kalau lu pake Pool Query pg)
        const updateQuery = `
            UPDATE jobs 
            SET company_name = $1, 
                position = $2,
                salary = $3,
                status = $4, 
                url = $5, 
                interview_date = $6, 
                notes = $7, 
                tasks = $8
            WHERE id = $9 AND user_id = $10
            RETURNING *;
        `;
        
        // PENTING: tasks harus diubah jadi JSON string kalau pakai raw SQL
        const values = [
            company_name,
            position,  
            salary,
            status, 
            url || null, 
            interview_date || null, 
            notes || "", 
            JSON.stringify(tasks || []),
            id, 
            req.user.id
        ];

        const result = await pool.query(updateQuery, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Job tidak ditemukan atau bukan milikmu" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("ERROR UPDATE JOB:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
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