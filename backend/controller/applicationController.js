const pool = require('../config/db')

const applyToJob = async (req, res) => {
  try {
    // 1. Block employers
    if (req.user.role !== 'candidate') {
      return res.status(403).json({ message: 'Only candidates can apply to jobs' })
    }

    // 2. Get job_id from req.body and candidate_id from req.user
    const job_id = req.body.job_id
    const candidate_id = req.user.user_id

    // 3. Check if job exists and is active
    const job = await pool.query(
      'SELECT * FROM jobs WHERE job_id = $1',
      [job_id]
    )

    if (job.rows.length === 0) {
        return res.status(404).json({ message: 'Job not found' })
    }

    if (job.rows[0].is_active === false) {
      return res.status(400).json({ message: 'This job is no longer accepting applications' })
    }

    // 4. Check if candidate already applied
    const existingApplication = await pool.query(
      'SELECT * FROM job_applications WHERE job_id = $1 AND candidate_id = $2',
      [job_id, candidate_id]
    )

    if (existingApplication.rows.length > 0) {
        return res.status(400).json({ message: 'You have already applied to this job' })
    }

    // 5. Insert the application
    const result = await pool.query(
      'INSERT INTO job_applications (job_id, candidate_id) VALUES ($1, $2) RETURNING *',
      [job_id, candidate_id]
    )

    // 6. Send back the new application
    return res.status(201).json(result.rows[0])

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Get all applications for a candidate
const getCandidateApplications = async (req, res) => {
  try {
    // 1. Get userId from URL params
    const { userId } = req.params

    // 2. Block other candidates from viewing this
    if (parseInt(userId) !== req.user.user_id) {
      return res.status(403).json({ message: 'You can only view your own applications' })
    }

    // 3. Get all applications for this candidate
    const result = await pool.query(
      `SELECT ja.*, j.job_title, j.job_location, j.job_type, j.salary_range
       FROM job_applications ja
       JOIN jobs j ON ja.job_id = j.job_id
       WHERE ja.candidate_id = $1
       ORDER BY ja.applied_at DESC`,
      [userId]
    )

    // 4. Send back the applications
    return res.status(200).json(result.rows)

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Get all applicants for a job
const getJobApplications = async (req, res) => {
  try {
    // 1. Get jobId from URL params
    const { jobId } = req.params

    // 2. Check if job exists and get employer_id
    const job = await pool.query(
      'SELECT employer_id FROM jobs WHERE job_id = $1',
      [jobId]
    )

    if (job.rows.length === 0) {
      return res.status(404).json({ message: 'Job not found' })
    }

    // 3. Block employers who don't own this job
    if (job.rows[0].employer_id !== req.user.user_id) {
      return res.status(403).json({ message: 'You are not the owner of this job' })
    }

    // 4. Get all applications for this job
    const result = await pool.query(
      `SELECT ja.*, u.first_name, u.last_name, u.email, u.headline
       FROM job_applications ja
       JOIN users u ON ja.candidate_id = u.user_id
       WHERE ja.job_id = $1
       ORDER BY ja.applied_at DESC`,
      [jobId]
    )

    // 5. Send back the applicants
    return res.status(200).json(result.rows)

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Update application status
const updateApplicationStatus = async (req, res) => {
  try {
    // 1. Get application id from URL
    const { id } = req.params

    // 2. Get new status from body
    const { status } = req.body

    // 3. Validate status is one of the allowed values
    const validStatuses = ['Pending', 'Reviewed', 'Interviewing', 'Offered', 'Rejected']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' })
    }

    // 4. Get the application and check ownership
    const application = await pool.query(
      `SELECT ja.*, j.employer_id 
       FROM job_applications ja
       JOIN jobs j ON ja.job_id = j.job_id
       WHERE ja.application_id = $1`,
      [id]
    )

    if (application.rows.length === 0) {
      return res.status(404).json({ message: 'Application not found' })
    }

    if (application.rows[0].employer_id !== req.user.user_id) {
      return res.status(403).json({ message: 'You are not the owner of this application' })
    }

    // 5. Update the status
    const result = await pool.query(
      `UPDATE job_applications SET status = $1 WHERE application_id = $2 RETURNING *`,
      [status, id]
    )

    // 6. Send back updated application
    return res.status(200).json(result.rows[0])

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Withdraw application
const withdrawApplication = async (req, res) => {
  try {
    // 1. Get application id from URL
    const { id } = req.params

    // 2. Check if application exists and belongs to this candidate
    const application = await pool.query(
      'SELECT * FROM job_applications WHERE application_id = $1',
      [id]
    )

    if (application.rows.length === 0) {
      return res.status(404).json({ message: 'Application not found' })
    }

    if (application.rows[0].candidate_id !== req.user.user_id) {
      return res.status(403).json({ message: 'You can only withdraw your own applications' })
    }

    // 3. Delete the application
    await pool.query(
      'DELETE FROM job_applications WHERE application_id = $1',
      [id]
    )

    // 4. Send success message
    return res.status(200).json({ message: 'Application withdrawn successfully' })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}
module.exports = { applyToJob, getCandidateApplications, getJobApplications, updateApplicationStatus, withdrawApplication }