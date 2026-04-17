const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // SSL DIMATIKAN KARENA PAKAI DOCKER LOKAL
  // ssl: {
  //   rejectUnauthorized: false 
  // }
});

pool.connect((err) => {
  if (err) {
    console.error('========= Connection Failed =========', err.message);
  } else {
    console.log('========= PostgreSQL (Docker) Connected! =========');
  }
});

module.exports = pool;