const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const { getAllPosts, getPostById, createPost, updatePost, deletePost, getUserPosts } = require('../controller/postController')

router.get('/', protect, getAllPosts)
router.get('/user/:userId', protect, getUserPosts)
router.get('/:id', protect, getPostById)
router.post('/', protect, createPost)
router.patch('/:id', protect, updatePost)
router.delete('/:id', protect, deletePost)

module.exports = router