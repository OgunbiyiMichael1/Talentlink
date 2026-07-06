const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const { getCandidateProfile, updateCandidateProfile } = require('../controller/candidateController')


// PATCH /api/candidates/:id → protected route
router.patch('/:userId', protect, updateCandidateProfile)

// GET /api/candidates/:id → protected route 
router.get('/:userId', protect, getCandidateProfile)

module.exports = router