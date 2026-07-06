const pool = require('../config/db')

const getUserById = async (req, res) => {
  try {
    // 1. Get the id from the URL params
    const { id } = req.params;

    // 2. Query the database for that user
    const queryText = `
      SELECT user_id, first_name, last_name, email, role, profile_picture_url, headline, location, created_at 
      FROM users 
      WHERE user_id = $1
    `;
    const result = await pool.query(queryText, [id]);

    // 3. If no user found return 404
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 4. Send back the user data
    res.status(200).json(result.rows[0]);

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

const updateUser = async (req, res) => {
  try {
    // 1. Get the id from the URL and the logged-in user's id
    const targetUserId = req.user.user_id;
    const loggedInUserId = req.user.user_id; // Assumes your auth middleware attaches the user object here

    // 2. If they don't match — block it
   if (parseInt(targetUserId) !== loggedInUserId) {
      return res.status(403).json({ message: 'Forbidden: You can only update your own profile' });
    }

    // 3. Get new values from req.body
    const { first_name, last_name, headline, location } = req.body;

    // 4. Run the UPDATE query
    const queryText = `
      UPDATE users 
      SET first_name = $1, last_name = $2, headline = $3, location = $4, updated_at = NOW()
      WHERE user_id = $5
      RETURNING user_id, first_name, last_name, email, role, headline, location
    `;
    const values = [first_name, last_name, headline, location, targetUserId];
    const result = await pool.query(queryText, values);

    // 5. If user record somehow doesn't exist anymore
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 6. Send back the updated user
    res.status(200).json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

  const deleteUser = async (req, res) => {
  try {
    // 1. Get the id from the URL and the logged-in user's id
    const targetUserId = req.params.id;
    const loggedInUserId = req.user.user_id; // Assumes your auth middleware attaches the user object here

    // 2. If they don't match — block it
    if (parseInt(targetUserId) !== loggedInUserId) {
      return res.status(403).json({ message: 'Forbidden: You can only delete your own profile' });
    }

    // 3. Run the DELETE query
    const queryText = `
      DELETE FROM users 
      WHERE user_id = $1
      RETURNING user_id
    `;
    const result = await pool.query(queryText, [targetUserId]);

    // 4. If user record somehow doesn't exist anymore
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 5. Send back a success message
    res.status(200).json({ message: 'User deleted successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { getUserById, updateUser, deleteUser }
