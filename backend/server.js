const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/authRoutes')
const pool = require('./config/db')
const userRoutes = require('./routes/userRoutes')
const candidateRoutes = require('./routes/candidateRoutes')
const employerRoutes = require('./routes/employerRoutes')
const jobRoutes = require('./routes/jobRoutes')
const applicationRoutes = require('./routes/applicationRoutes')
const uploadRoutes = require('./routes/uploadRoutes')
const connectionRoutes = require('./routes/connectionRoutes')
const postRoutes = require('./routes/postRoutes')
const commentRoutes = require('./routes/commentRoutes')
const likeRoutes = require('./routes/likeRoutes')

const cookieParser = require('cookie-parser')
require('dotenv').config()

const app = express()

//middleware
app.use(express.json())
app.use(cookieParser())
// Configure allowed origins via env var for deployments. Comma-separated list.
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim())
  : [
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'http://localhost:5501',
    'http://127.0.0.1:5501',
    'https://talentlink-topaz.vercel.app'
  ]

console.log('Allowed CORS origins:', allowedOrigins)

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin like mobile apps or curl
    if (!origin) return callback(null, true)
    if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true)
    return callback(new Error('Not allowed by CORS'))
  },
  credentials: true
}))

//testing
app.get("/", (req,res) => {
    res.json({message: "TalentLink API is running"})
})
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/candidates', candidateRoutes)
app.use('/api/employers', employerRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/applications', applicationRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/connections', connectionRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/comments', commentRoutes)
app.use('/api/likes', likeRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})