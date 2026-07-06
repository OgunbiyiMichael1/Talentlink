const pool = require('../config/db')

const getAllJobs = async (req, res) => {
    try {
        // 1. Get search term from URL if provided
        const { search } = req.query

        // 2. Query the database with optional search
        const result = await pool.query(`
      SELECT * FROM jobs 
      WHERE is_active = true 
      AND ($1 = '' OR job_title ILIKE '%' || $1 || '%')
      ORDER BY created_at DESC
    `, [search || ''])

        // 3. Send back the results
        res.status(200).json(result.rows)

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' })
    }
}

const getJobById = async (req, res) => {
    try {
        // 1. Get the job id from the URL
        const { id } = req.params

        // 2. Query the database for that specific job
        const result = await pool.query(
            `SELECT * FROM jobs WHERE job_id = $1`,
            [id]
        )

        // 3. If no job found...
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // 4. Send back the job
        res.status(200).json(result.rows[0]);

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' })
    }
}

const createJob = async (req, res) => {
    try {
        // 1. Who can create a job? (Role verification)
        // This can also be handled by a separate 'isEmployer' middleware
        if (req.user.role !== 'employer') {
            return res.status(403).json({
                success: false,
                message: "Access denied. Only employers can post jobs."
            });
        }

        // 2. What fields come from req.body?
        const { job_title, job_description, requirements, job_location, job_type, salary_range } = req.body;

        // 3. Where does employer_id come from? 
        // It comes securely from the auth middleware (e.g., req.user filled by JWT verification)
        const employerId = req.user.user_id

        // Simple validation check
        if (!job_title || !job_description || !requirements || !job_location || !job_type || !salary_range) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required job information."
            });
        }

        // 4. What do you INSERT into the database?
        const queryText = `
           INSERT INTO jobs (employer_id, job_title, job_description, requirements, job_location, job_type, salary_range)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING *
        `;

        const values = [employerId, job_title, job_description, requirements, job_location, job_type, salary_range];

        const result = await pool.query(queryText, values);
        const newJob = result.rows[0];

        // 5. Respond with the newly created job
        return res.status(201).json({
            success: true,
            message: "Job created successfully!",
            job: newJob
        });

    } catch (error) {
        console.error("Error in createJob controller:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

const updateJob = async (req, res) => {
  try {
    // 1. Get job id from URL
    const { id } = req.params

    // 2. Get logged in user
    const loggedInUserId = req.user.user_id

    // 3. Check if job exists and get its employer_id
    const job = await pool.query(
      'SELECT employer_id FROM jobs WHERE job_id = $1',
      [id]
    )

    if (job.rows.length === 0) {
  return res.status(404).json({ message: 'Job not found' })
}

// 4. Check ownership - is the logged in user the one who posted this job?
if (job.rows[0].employer_id !== loggedInUserId) {
  return res.status(403).json({ message: 'Unauthorized to update this job' })
}


    // 5. Get new values from req.body
    const { job_title, job_description, requirements, job_location, job_type, salary_range } = req.body

    // 6. Run the UPDATE query
    const result = await pool.query(`
      UPDATE jobs 
      SET job_title = $1, job_description = $2, requirements = $3, 
          job_location = $4, job_type = $5, salary_range = $6, updated_at = NOW()
      WHERE job_id = $7
      RETURNING *
    `, [job_title, job_description, requirements, job_location, job_type, salary_range, id])

    // 7. Send back the updated job
     res.status(200).json(result.rows[0]);


  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

const deleteJob = async (req, res) => {
  try {
    // 1. Get job id from URL
    const { id } = req.params

    // 2. Get logged in user
    const loggedInUserId = req.user.user_id

    // 3. Check if job exists and get its employer_id
    const job = await pool.query(
      'SELECT employer_id FROM jobs WHERE job_id = $1',
      [id]
    )

    //404
    if (job.rows.length === 0) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // 4. Check ownership
    if (job.rows[0].employer_id !== loggedInUserId) {
      return res.status(403).json({ message: 'Unauthorized to delete this job' });
    }

    // 5. Delete the job
    const result = await pool.query('DELETE FROM jobs WHERE job_id = $1', [id])
    // 6. Send success message
    return res.status(200).json({ message: 'Job deleted successfully' });

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { getAllJobs, getJobById, createJob, updateJob, deleteJob }