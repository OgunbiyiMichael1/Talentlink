const jwt = require('jsonwebtoken')

const protect = (req, res, next) => {
  try {
    // Check cookie first, then Authorization header
    let token = req.cookies.token

    if (!token) {
      const authHeader = req.headers.authorization
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7)
      }
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, please login' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()

  } catch (error) {
    return res.status(401).json({ message: 'Token is invalid or expired' })
  }
}

module.exports = { protect }