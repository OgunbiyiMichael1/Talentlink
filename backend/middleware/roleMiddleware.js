const employerOnly = (req, res, next) => {
  if (req.user.role !== 'employer') {
    return res.status(403).json({ message: 'Access denied, employers only' })
  }
  next()
}

const candidateOnly = (req, res, next) => {
  if (req.user.role !== 'candidate') {
    return res.status(403).json({ message: 'Access denied, candidates only' })
  }
  next()
}

module.exports = { employerOnly, candidateOnly }