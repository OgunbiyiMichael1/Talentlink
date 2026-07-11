// routes/jobRoutes.js
const express = require('express');
const router = express.Router();
const { getAllJobs, getJobById, createJob, updateJob, deleteJob,closeJob,getEmployerJobs } = require('../controller/jobController')
const { protect } = require('../middleware/authMiddleware'); // Your JWT validation middleware

// 'protect' runs first, verifies the token, attaches user to req.user, then calls createJob
router.get('/', getAllJobs)
router.get('/:id', getJobById)
router.get('/employer/:userId', protect, getEmployerJobs)
router.post('/', protect, createJob)
router.patch('/:id/close', protect, closeJob)
router.patch('/:id', protect, updateJob)
router.delete('/:id', protect, deleteJob)

module.exports = router;