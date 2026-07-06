const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const { getEmployerProfile, updateEmployerProfile } = require('../controller/employerController')


// PATCH /api/employers/:id → protected route
router.patch('/:userId', protect, updateEmployerProfile)

// GET /api/employers/:id → protected route 
router.get('/:userId', protect, getEmployerProfile)

module.exports = router