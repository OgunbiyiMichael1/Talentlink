const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const { createComment, updateComment, deleteComment } = require('../controller/commentController')

// POST /api/comments → protected route
router.post('/', protect, createComment)

router.patch('/:id', protect, updateComment)

router.delete('/:id', protect, deleteComment)

module.exports = router