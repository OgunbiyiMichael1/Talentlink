const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    },
    // 1. Give up after 5 seconds if Supabase is frozen/offline
    connectionTimeoutMillis: 5000,   
    // 2. Shut down background connections if they sit idle for 30 seconds
    idleTimeoutMillis: 30000         
})

// 3. THE INSURANCE POLICY: Catch background drops so your entire Node server doesn't crash
pool.on('error', (err, client) => {
    console.error('Unexpected error on idle PostgreSQL client:', err.message)
})

// Your original startup test connection check
pool.connect()
  .then(() => console.log('Connected to TalentLink database'))
  .catch((err) => console.error('Database connection error:', err))

module.exports = pool