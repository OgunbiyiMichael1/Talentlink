const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const { createComment, getCommentsByPost, updateComment, deleteComment } = require('../controller/commentController')

router.get('/post/:postId', protect, getCommentsByPost)

// POST /api/comments → protected route
router.post('/', protect, createComment)

router.patch('/:id', protect, updateComment)

router.delete('/:id', protect, deleteComment)

module.exports = router