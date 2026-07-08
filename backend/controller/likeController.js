const pool = require('../config/db')

const likePost = async (req, res) => {
  try {
    // 1. Get post_id from req.body
    const { post_id } = req.body
    
    // 2. Get user_id from logged in user
    const user_id = req.user.user_id

    // Validation: Ensure post_id is provided
    if (!post_id) {
      return res.status(400).json({ message: 'Post ID is required' })
    }

    // 3. Insert into post_likes
    const result = await pool.query(
      `INSERT INTO post_likes (post_id, user_id) 
       VALUES ($1, $2) 
       RETURNING *`,
      [post_id, user_id]
    )

    // 4. Send back success response
    res.status(201).json({
      success: true,
      message: 'Post liked successfully',
      like: result.rows[0]
    })
  } catch (error) {
    // Check for PostgreSQL unique constraint violation error code
    if (error.code === '23505') {
      return res.status(400).json({ message: 'You have already liked this post' })
    }
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

const unlikePost = async (req, res) => {
  try {
    // 1. Get post_id from req.body
    const { post_id } = req.body
    
    // 2. Get user_id from logged in user
    const user_id = req.user.user_id

    // Validation: Ensure post_id is provided
    if (!post_id) {
      return res.status(400).json({ message: 'Post ID is required' })
    }

    // 3. Delete from post_likes matching both post and user
    const result = await pool.query(
      `DELETE FROM post_likes 
       WHERE post_id = $1 AND user_id = $2 
       RETURNING *`,
      [post_id, user_id]
    )

    // Check if a row was actually deleted
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Like record not found' })
    }

    // 4. Send back success response
    res.status(200).json({
      success: true,
      message: 'Post unliked successfully'
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { likePost, unlikePost }