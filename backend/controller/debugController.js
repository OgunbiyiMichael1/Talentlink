const debug = (req, res) => {
  res.json({
    origin: req.headers.origin || null,
    cookies: req.cookies || {}
  })
}

const protectedDebug = (req, res) => {
  res.json({ user: req.user || null })
}

module.exports = { debug, protectedDebug }
