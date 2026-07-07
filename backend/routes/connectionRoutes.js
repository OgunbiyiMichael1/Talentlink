const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const { sendConnection, getConnections,  respondToConnection, removeConnection, getPendingConnections } = require('../controller/connectionController')

// POST /api/connections → protected route
router.post('/', protect, sendConnection)  
router.get('/', protect, getConnections)
router.get('/pending', protect, getPendingConnections) 
router.patch('/:id', protect, respondToConnection)
router.delete('/:id', protect, removeConnection)

module.exports = router