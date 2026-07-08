const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const { likePost, unlikePost } = require('../controller/likeController')

// POST /api/likes → protected route
router.post('/', protect, likePost)
// DELETE /api/likes → protected route
router.delete('/', protect, unlikePost)

module.exports = router