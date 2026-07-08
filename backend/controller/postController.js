const pool = require('../config/db')

const getAllPosts = async (req, res) => {
  try {
    // 1. Query all posts with user details
    const result = await pool.query(
      `SELECT p.*, u.first_name, u.last_name, u.profile_picture_url 
       FROM posts p
       JOIN users u ON p.user_id = u.user_id
       ORDER BY p.created_at DESC`
    )

    // 2. Send back the posts
    return res.status(200).json(result.rows)    

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

const getPostById = async (req, res) => {
  try {
    // 1. Get post id from URL
    const { id } = req.params

    // 2. Query the database for that post
    const result = await pool.query(
      `SELECT p.*, u.first_name, u.last_name, u.profile_picture_url 
       FROM posts p
       JOIN users u ON p.user_id = u.user_id
       WHERE p.post_id = $1`,
      [id]
    )

    if (result.rows.length === 0) {
  return res.status(404).json({ message: 'Post not found' })
}

return res.status(200).json(result.rows[0])

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

const createPost = async (req, res) => {
  try {
    // 1. Get content and media_url from req.body
    const { content, media_url } = req.body

    // 2. Get user_id from logged in user
    const user_id = req.user.user_id

    // 3. Validate content is not empty
    if (!content) {
      return res.status(400).json({ message: 'Content is required' })
    }

    // 4. Insert the post
    const result = await pool.query(
      `INSERT INTO posts (user_id, content, media_url)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [user_id, content, media_url]
    )

    // 5. Send back the new post
    return res.status(201).json(result.rows[0])

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

const updatePost = async (req, res) => {
  try {
   const { id } = req.params
const { content, media_url } = req.body

// Check ownership FIRST
const post = await pool.query('SELECT * FROM posts WHERE post_id = $1', [id])

if (post.rows.length === 0) {
  return res.status(404).json({ message: 'Post not found' })
}

if (post.rows[0].user_id !== req.user.user_id) {
  return res.status(403).json({ message: 'You can only edit your own posts' })
}

// THEN update
const result = await pool.query(
  `UPDATE posts SET content = $1, media_url = $2 WHERE post_id = $3 RETURNING *`,
  [content, media_url, id]
)

return res.status(200).json(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

const deletePost = async (req, res) => {
  try {
const { id } = req.params

// Check ownership FIRST
const post = await pool.query('SELECT * FROM posts WHERE post_id = $1', [id])

if (post.rows.length === 0) {
  return res.status(404).json({ message: 'Post not found' })
}

if (post.rows[0].user_id !== req.user.user_id) {
  return res.status(403).json({ message: 'You can only edit your own posts' })
}

// THEN update
const result = await pool.query(
  `DELETE FROM posts WHERE post_id = $1 RETURNING *`,
  [id]
)

return res.status(200).json({ message: 'Post deleted successfully' })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

const getUserPosts = async (req, res) => {
  try {
    // 1. Get user id from URL
    const { userId } = req.params 

    // 2. Query the database for posts by that user
    const result = await pool.query(
      `SELECT p.*, u.first_name, u.last_name, u.profile_picture_url
        FROM posts p
        JOIN users u ON p.user_id = u.user_id
        WHERE p.user_id = $1
        ORDER BY p.created_at DESC`,
      [userId]
    )

    return res.status(200).json(result.rows)

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { getAllPosts, getPostById, createPost, updatePost, deletePost, getUserPosts }