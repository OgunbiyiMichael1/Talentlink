const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const { getUserById, updateUser, deleteUser } = require('../controller/userController')


// PATCH /api/users/:id → protected route
router.patch('/:id', protect, updateUser)

// GET /api/users/:id → protected route 
router.get('/:id', protect, getUserById)

// DELETE /api/users/:id → protected route
router.delete('/:id', protect, deleteUser)

module.exports = router