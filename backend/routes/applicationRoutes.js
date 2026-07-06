const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const { applyToJob,getCandidateApplications,getJobApplications,updateApplicationStatus,withdrawApplication } = require('../controller/applicationController')

router.post('/', protect, applyToJob)
router.get('/candidate/:userId', protect, getCandidateApplications)
router.get('/job/:jobId', protect, getJobApplications)
router.patch('/:id/status', protect, updateApplicationStatus)
router.delete('/:id', protect, withdrawApplication)

module.exports = router