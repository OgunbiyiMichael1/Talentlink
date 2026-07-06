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
const cookieParser = require('cookie-parser')
require('dotenv').config()

const app = express()

//middleware
app.use(express.json())
app.use(cookieParser())
app.use(cors({
     origin: 'http://localhost:5500',  // your frontend URL, we'll update this when we deploy
  credentials: true                  // allows cookies to be sent between frontend and backend
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

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})