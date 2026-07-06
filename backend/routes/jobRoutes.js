// routes/jobRoutes.js
const express = require('express');
const router = express.Router();
const { getAllJobs, getJobById, createJob, updateJob, deleteJob } = require('../controller/jobController')
const { protect } = require('../middleware/authMiddleware'); // Your JWT validation middleware

// 'protect' runs first, verifies the token, attaches user to req.user, then calls createJob
router.get('/', getAllJobs)
router.get('/:id', protect, getJobById)
router.post('/', protect, createJob)
router.patch('/:id', protect, updateJob)
router.delete('/:id', protect, deleteJob)

module.exports = router;