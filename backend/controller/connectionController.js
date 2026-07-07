const pool = require('../config/db')

const sendConnection = async (req, res) => {
  try {
    // 1. Get sender and receiver IDs
    const sender_id = req.user.user_id
    const { receiver_id } = req.body

    // 2. Block sending to yourself
    if (sender_id === receiver_id) {
      return res.status(400).json({ message: 'You cannot send a connection request to yourself' })
    }

    // 3. Check if connection already exists
    const existing = await pool.query(
      `SELECT * FROM connections 
       WHERE (sender_id = $1 AND receiver_id = $2) 
       OR (sender_id = $2 AND receiver_id = $1)`,
      [sender_id, receiver_id]
    )

    if (existing.rows.length > 0) {
       return res.status(400).json({ message: 'Connection request already exists' })
    }

    // 4. Insert the connection request
    const result = await pool.query(
      'INSERT INTO connections (sender_id, receiver_id) VALUES ($1, $2) RETURNING *',
      [sender_id, receiver_id]
    )

    // 5. Send back the new connection
    return res.status(201).json({ message: 'Connection request sent successfully', connection: result.rows[0] })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

const getConnections = async (req, res) => {
  try {
    const user_id = req.user.user_id

    const result = await pool.query(
      `SELECT 
        c.*,
        CASE 
          WHEN c.sender_id = $1 THEN receiver.user_id
          ELSE sender.user_id
        END as other_user_id,
        CASE 
          WHEN c.sender_id = $1 THEN receiver.first_name
          ELSE sender.first_name
        END as other_first_name,
        CASE 
          WHEN c.sender_id = $1 THEN receiver.last_name
          ELSE sender.last_name
        END as other_last_name,
        CASE 
          WHEN c.sender_id = $1 THEN receiver.profile_picture_url
          ELSE sender.profile_picture_url
        END as other_profile_picture
       FROM connections c
       JOIN users sender ON c.sender_id = sender.user_id
       JOIN users receiver ON c.receiver_id = receiver.user_id
       WHERE (c.sender_id = $1 OR c.receiver_id = $1)
       AND c.status = 'Accepted'`,
      [user_id]
    )

    return res.status(200).json(result.rows)

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

const respondToConnection = async (req, res) => {
  try {
    const user_id = req.user.user_id
    const { id } = req.params 
  
    const { status } = req.body

    // Update the connection status
    const result = await pool.query(
      'UPDATE connections SET status = $1 WHERE connection_id = $2 AND receiver_id = $3 RETURNING *',
      [status, id, user_id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Connection not found' })
    }

    return res.status(200).json({ message: 'Connection status updated', connection: result.rows[0] })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

const removeConnection = async (req, res) => {
  try {
    const user_id = req.user.user_id
    const { id } = req.params

    const result = await pool.query(
      'DELETE FROM connections WHERE connection_id = $1 AND (sender_id = $2 OR receiver_id = $2) RETURNING *',
      [id, user_id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Connection not found' })
    }

    return res.status(200).json({ message: 'Connection removed successfully' })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

const getPendingConnections = async (req, res) => {
  try {
    const user_id = req.user.user_id
    const result = await pool.query(
      `SELECT c.*, u.first_name, u.last_name, u.profile_picture_url 
FROM connections c
JOIN users u ON c.sender_id = u.user_id
WHERE c.receiver_id = $1 AND c.status = 'Pending'`,
      [user_id]
    )

    return res.status(200).json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}
      
      
      module.exports = { sendConnection, getConnections, respondToConnection, removeConnection, getPendingConnections }