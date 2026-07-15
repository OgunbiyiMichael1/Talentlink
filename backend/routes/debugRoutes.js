const express = require('express')
const router = express.Router()
const { debug, protectedDebug } = require('../controller/debugController')
const { protect } = require('../middleware/authMiddleware')

router.get('/', debug)
router.get('/protected', protect, protectedDebug)

module.exports = router
