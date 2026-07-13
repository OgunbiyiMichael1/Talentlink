const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const { getUserById, updateUser, deleteUser, searchUsers, globalSearch } = require('../controller/userController')



// PATCH /api/users/:id → protected route
router.patch('/:id', protect, updateUser)

router.get('/search', protect, globalSearch)
// GET /api/users/:id → protected route 
router.get('/:id', protect, getUserById)

router.get('/', protect, searchUsers)


// DELETE /api/users/:id → protected route
router.delete('/:id', protect, deleteUser)

module.exports = router