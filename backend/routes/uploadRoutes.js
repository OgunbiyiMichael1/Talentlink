const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const { uploadImage, uploadResume } = require('../config/multer')
const { uploadProfilePicture, uploadCompanyLogo, uploadResume: uploadResumeController } = require('../controller/uploadController')

router.post('/profile-picture', protect, uploadImage.single('image'), uploadProfilePicture)
router.post('/company-logo', protect, uploadImage.single('image'), uploadCompanyLogo)
router.post('/resume', protect, uploadResume.single('resume'), uploadResumeController)

module.exports = router