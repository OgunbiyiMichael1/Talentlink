const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const { uploadImage, uploadResume: uploadResumeMulter } = require('../config/multer')
const { uploadProfilePicture, uploadCompanyLogo, uploadResume, uploadPostImage } = require('../controller/uploadController')

router.post('/profile-picture', protect, uploadImage.single('image'), uploadProfilePicture)
router.post('/company-logo', protect, uploadImage.single('image'), uploadCompanyLogo)
router.post('/resume', protect, uploadResumeMulter.single('resume'), uploadResume)
router.post('/post-image', protect, uploadImage.single('image'), uploadPostImage)

module.exports = router