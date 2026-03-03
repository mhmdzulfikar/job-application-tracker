const { Pool } = require('pg');
require('dotenv').config();

// Bikin jalur koneksi nembak ke URL Supabase lu
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
//   // Wajib ditambahin ssl ini kalau pakai Cloud Database (Supabase/Neon)
//   ssl: {
//     rejectUnauthorized: false 
//   }
});

// Tes koneksi pas file ini dipanggil
pool.connect((err) => {
  if (err) {
    console.error('========= Connection Failed =========', err.message);
  } else {
    console.log('========= PostgreSQL (Supabase) Connected! =========');
  }
});

module.exports = pool;