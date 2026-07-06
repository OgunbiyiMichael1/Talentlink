const pool = require('../config/db')
const cloudinary = require('../config/cloudinary')

// Upload to cloudinary from memory buffer
const uploadToCloudinary = (buffer, folder, resourceType = 'image') => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }
    ).end(buffer)
  })
}

const uploadProfilePicture = async (req, res) => {
  try {
    // 1. Check if file exists
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' })    
    }

    // 2. Upload to Cloudinary
    const result = await uploadToCloudinary(
      req.file.buffer,
      'talentlink/images'
    )

    // 3. Save URL to database
    await pool.query(
      'UPDATE users SET profile_picture_url = $1 WHERE user_id = $2',
      [result.secure_url, req.user.user_id]
    )

    // 4. Send back the URL
    res.status(200).json({ 
      message: 'Profile picture uploaded successfully',
      url: result.secure_url 
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

const uploadCompanyLogo = async (req, res) => {
  try {
    // 1. Check if file exists
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' })
    }

    // 2. Upload to Cloudinary
   const result = await uploadToCloudinary(
      req.file.buffer,
      'talentlink/images'
    )

    // 3. Save URL to database
    await pool.query(
      'UPDATE employer_profiles SET company_logo_url = $1 WHERE user_id = $2',
      [result.secure_url, req.user.user_id]
    )

    // 4. Send back the URL
    res.status(200).json({ 
      message: 'Profile picture uploaded successfully',
      url: result.secure_url 
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

const uploadResume = async (req, res) => {
  try {
    // 1. Check if file exists
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' })
    }

    // 2. Upload to Cloudinary
     const result = await uploadToCloudinary(
  req.file.buffer,
  'talentlink/resumes',
  'raw'
)

    // 3. Save URL to database
    await pool.query(
      'UPDATE candidate_profiles SET resume_url = $1 WHERE user_id = $2',
      [result.secure_url, req.user.user_id]
    )

    // 4. Send back the URL
    res.status(200).json({ 
      message: 'Resume uploaded successfully',
      url: result.secure_url 
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { uploadProfilePicture, uploadCompanyLogo, uploadResume }