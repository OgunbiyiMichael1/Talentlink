const pool = require('../config/db')

const createComment = async (req, res) => {
  try {
    // 1. Get post_id and content from req.body
    const { post_id, content } = req.body

    // 2. Get user_id from logged in user
    const user_id = req.user.user_id

    // 3. Validate content is not empty
    if (!content) {
      return res.status(400).json({ message: 'Content is required' })
    }

    // 4. Insert the comment
    const result = await pool.query(
      `INSERT INTO comments (post_id, user_id, content)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [post_id, user_id, content]
    )

    // 5. Send back the new comment
    res.status(201).json(result.rows[0])

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

const updateComment = async (req, res) => {
  try {
    // 1. Get comment id from URL
    const { id } = req.params

    // 2. Get new content from req.body
    const { content } = req.body

    // 3. Check ownership first
    const comment = await pool.query(
      'SELECT * FROM comments WHERE comment_id = $1',
      [id]
    )

    if (comment.rows.length === 0) {
      return res.status(404).json({ message: 'Comment not found' })
    }

    if (comment.rows[0].user_id !== req.user.user_id) {
      return res.status(403).json({ message: 'Unauthorized to update this comment' })
    }

    // 4. Update the comment
    const result = await pool.query(
      `UPDATE comments SET content = $1 WHERE comment_id = $2 RETURNING *`,
      [content, id]
    )

    // 5. Send back updated comment
    res.status(200).json(result.rows[0])

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

const deleteComment = async (req, res) => {
  try {
    // 1. Get comment id from URL
    const { id } = req.params

    // 2. Check ownership first
    const comment = await pool.query(
      'SELECT * FROM comments WHERE comment_id = $1',
      [id]
    )

    if (comment.rows.length === 0) {
      return res.status(404).json({ message: 'Comment not found' })
    }

    if (comment.rows[0].user_id !== req.user.user_id) {
      return res.status(403).json({ message: 'Unauthorized to delete this comment' })
    }

    // 3. Delete the comment
    await pool.query(
      'DELETE FROM comments WHERE comment_id = $1',
      [id]
    )

    // 4. Send success message
    res.status(200).json({ message: 'Comment deleted successfully' })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { createComment, updateComment, deleteComment }