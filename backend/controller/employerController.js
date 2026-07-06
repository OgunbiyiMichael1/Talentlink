const pool = require('../config/db')

const getEmployerProfile = async (req, res) => {
    try{
        // 1. Get the id from the URL params
    const { userId } = req.params;

     // 2. Query the database for that candidate
    const queryText = `
      SELECT * FROM employer_profiles WHERE user_id = $1
    `;
    const result = await pool.query(queryText, [userId]);

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

    //Update employer profile
    const updateEmployerProfile = async (req, res) => {
  try {
    // 1. Get the id from the URL and the logged-in user's id
    const targetUserId = req.params.userId;
    const loggedInUserId = req.user.user_id; // Assumes your auth middleware attaches the user object here

    // 2. If they don't match — block it
   if (parseInt(targetUserId) !== loggedInUserId) {
      return res.status(403).json({ message: 'Forbidden: You can only update your own profile' });
    }

    // 3. Get new values from req.body
    const { company_name, company_website, company_bio, industry } = req.body;

    // 4. Run the UPDATE query
    const queryText = `
     UPDATE employer_profiles 
SET company_name = $1, company_website = $2, company_bio = $3, industry = $4
WHERE user_id = $5
RETURNING *
    `;
    const values = [company_name, company_website, company_bio, industry, targetUserId];
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

module.exports = { getEmployerProfile, updateEmployerProfile }