  const pool = require('../config/db')
  const { sendApplicationConfirmation, sendNewApplicationAlert, sendStatusUpdate, sendWelcomeEmail } = require('../utils/emails')
  const bcrypt = require('bcryptjs')
  const jwt = require('jsonwebtoken')

  const register = async (req, res) => {
    const { first_name, last_name, email, password, role } = req.body

    // Get a dedicated client from the pool to run a transaction
    const client = await pool.connect()

    try {
      // 1. Check if email already exists
      const existingUser = await client.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      )

      if (existingUser.rows.length > 0) {
        client.release() // Always release the client back to the pool
        return res.status(400).json({ message: 'Email already in use' })
      }

      // 2. Hash the password
      const salt = await bcrypt.genSalt(10)
      const password_hash = await bcrypt.hash(password, salt)

      // START TRANSACTION
      await client.query('BEGIN')

      // 3. Save user to database
      const newUser = await client.query(
        `INSERT INTO users (first_name, last_name, email, password_hash, role)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING user_id, first_name, last_name, email, role`,
        [first_name, last_name, email, password_hash, role]
      )

      const user = newUser.rows[0]

      // 4. Automatically create candidate or employer profile
      if (role === 'candidate') {
        await client.query(
          'INSERT INTO candidate_profiles (user_id) VALUES ($1)',
          [user.user_id]
        )
      } else if (role === 'employer') {
        await client.query(
          'INSERT INTO employer_profiles (user_id, company_name) VALUES ($1, $2)',
          [user.user_id, 'My Company']
        )
      }

      // COMMIT TRANSACTION (This saves BOTH changes permanently)
      await client.query('COMMIT')
      client.release() // Done with DB operations

      // 5. Create JWT and store in cookie
      const token = jwt.sign(
        { user_id: user.user_id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      )

      res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000
  })

      // Send welcome email
  try {
    await sendWelcomeEmail(user.email, user.first_name, user.role)
  } catch (emailError) {
    console.error('Welcome email failed:', emailError)
  }


      // 6. Send back response
      res.status(201).json({
        message: 'Account created successfully',
        user: {
          user_id: user.user_id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          role: user.role
        }
      })

    } catch (error) {
      // IF ANYTHING FAILS, ROLLBACK EVERYTHING INSIDE THE TRANSACTION
      await client.query('ROLLBACK')
      client.release()
      
      console.error(error)
      res.status(500).json({ message: 'Server error' })
    }
  }


  //login 
  const login = async (req, res) => {
    const { email, password } = req.body

    try {
      // 1. Check if user exists
      const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      )

      if (result.rows.length === 0) {
        return res.status(400).json({ message: 'Invalid email or password' })
      }

      const user = result.rows[0]

      // 2. Compare password with hashed password in database
      const isMatch = await bcrypt.compare(password, user.password_hash)

      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' })
      }

      // 3. Create JWT and store in cookie
      const token = jwt.sign(
        { user_id: user.user_id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      )

     res.cookie('token', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  maxAge: 7 * 24 * 60 * 60 * 1000
})

      // 4. Send back response
      res.status(200).json({
        message: 'Login successful',
        user: {
          user_id: user.user_id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          role: user.role
        }
      })

    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Server error' })
    }
  }

  const logout = (req, res) => {
    res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'none'
  })
    res.status(200).json({ message: 'Logged out successfully' })
  }


  module.exports = { register, login, logout}