const jwt = require('jsonwebtoken')

const protect = (req, res, next) => {
  try {
    // 1. Get token from cookie
    const token = req.cookies.token

    // 2. If no token, block the request
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, please login' })
    }

    // 3. Verify the token is valid and not expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // 4. Attach the user info to the request
    req.user = decoded

    // 5. Move on to the next function (the controller)
    next()

  } catch (error) {
    return res.status(401).json({ message: 'Token is invalid or expired' })
  }
}

module.exports = { protect }