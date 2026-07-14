// Dark mode
    function toggleTheme() {
      const isDark = document.documentElement.classList.toggle('dark')
      localStorage.theme = isDark ? 'dark' : 'light'
      document.getElementById('themeIcon').textContent = isDark ? '☀️' : '🌙'
      document.getElementById('themeIconMobile').textContent = isDark ? '☀️' : '🌙'
    }
    document.getElementById('themeToggle').addEventListener('click', toggleTheme)
    document.getElementById('themeToggleMobile').addEventListener('click', toggleTheme)
    document.getElementById('hamburger').addEventListener('click', () => {
      document.getElementById('mobileMenu').classList.toggle('hidden')
      document.getElementById('menuOpen').classList.toggle('hidden')
      document.getElementById('menuClose').classList.toggle('hidden')
    })

    const user = JSON.parse(localStorage.getItem('user'))
    if (!user) window.location.href = 'login.html'

    async function logout() {
      await fetch(API_BASE + '/api/auth/logout', { method: 'POST', credentials: 'include' })
      localStorage.removeItem('user')
      window.location.href = 'login.html'
    }

    function showSuccess(msg) {
      const el = document.getElementById('successMsg')
      el.textContent = msg
      el.classList.remove('hidden')
      setTimeout(() => el.classList.add('hidden'), 3000)
    }

    function showError(msg) {
      const el = document.getElementById('errorMsg')
      el.textContent = msg
      el.classList.remove('hidden')
      setTimeout(() => el.classList.add('hidden'), 3000)
    }

    // Load user data
    async function loadProfile() {
  try {
    const userRes = await fetch(`${API_BASE}/api/users/${user.user_id}`, { 
      credentials: 'include' 
    })
    const userData = await userRes.json()

    // Only fetch candidate profile if user is a candidate
    let candidateData = {}
    if (user.role === 'candidate') {
      const candidateRes = await fetch(`${API_BASE}/api/candidates/${user.user_id}`, { 
        credentials: 'include' 
      })
      candidateData = await candidateRes.json()
    }

    // Fill basic info
    document.getElementById('firstName').value = userData.first_name || ''
    document.getElementById('lastName').value = userData.last_name || ''
    document.getElementById('headline').value = userData.headline || ''
    document.getElementById('location').value = userData.location || ''
    document.getElementById('contactEmail').value = userData.contact_email || ''
    document.getElementById('phone').value = userData.phone || ''

    // Fill professional info — only for candidates
    if (user.role === 'candidate') {
      document.getElementById('bio').value = candidateData.bio || ''
      document.getElementById('skills').value = candidateData.skills || ''
      document.getElementById('githubUrl').value = candidateData.github_url || ''
      document.getElementById('linkedinUrl').value = candidateData.linkedin_url || ''
    }

    // Update profile card
    document.getElementById('profileName').textContent = `${userData.first_name} ${userData.last_name}`
    document.getElementById('profileHeadline').textContent = userData.headline || 'TalentLink Member'
    document.getElementById('profileLocation').textContent = userData.location ? `📍 ${userData.location}` : ''

    // Avatar
    if (userData.profile_picture_url) {
      document.getElementById('avatarDisplay').innerHTML = `<img src="${userData.profile_picture_url}" class="w-full h-full object-cover">`
    } else {
      document.getElementById('avatarDisplay').textContent = userData.first_name[0] + userData.last_name[0]
    }

    // Resume — only for candidates
    if (user.role === 'candidate' && candidateData.resume_url) {
      document.getElementById('resumeStatus').innerHTML = `<a href="${candidateData.resume_url}" target="_blank" class="text-[#009B77] hover:underline">📄 View Resume</a>`
    }

    // Social links — only for candidates
    const socialLinks = document.getElementById('socialLinks')
    socialLinks.innerHTML = ''
    if (user.role === 'candidate') {
      if (candidateData.github_url) {
        socialLinks.innerHTML += `<a href="${candidateData.github_url}" target="_blank" class="text-[#4B5563] dark:text-[#D9D9D9] hover:text-[#009B77] text-sm transition-colors">🐙 GitHub</a>`
      }
      if (candidateData.linkedin_url) {
        socialLinks.innerHTML += `<a href="${candidateData.linkedin_url}" target="_blank" class="text-[#4B5563] dark:text-[#D9D9D9] hover:text-[#009B77] text-sm transition-colors">💼 LinkedIn</a>`
      }
    }

  } catch (error) {
    console.error(error)
  }
}

    // Update basic info
    async function updateBasicInfo() {
      const btn = document.getElementById('basicInfoBtn')
      btn.textContent = '⏳ Saving...'
      btn.disabled = true

      try {
        const response = await fetch(`${API_BASE}/api/users/${user.user_id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
  first_name: document.getElementById('firstName').value,
  last_name: document.getElementById('lastName').value,
  headline: document.getElementById('headline').value,
  location: document.getElementById('location').value,
  contact_email: document.getElementById('contactEmail').value,
  phone: document.getElementById('phone').value
})
        })

        if (response.ok) {
          showSuccess('Basic info updated successfully')
          btn.textContent = '✅ Saved!'
          setTimeout(() => { btn.textContent = 'Save Basic Info'; btn.disabled = false }, 2000)
          loadProfile()
        } else {
          showError('Failed to update')
          btn.textContent = 'Save Basic Info'
          btn.disabled = false
        }
      } catch (error) {
        showError('Something went wrong')
        btn.textContent = 'Save Basic Info'
        btn.disabled = false
      }
    }

    // Update professional info
    async function updateProfessionalInfo() {
      const btn = document.getElementById('professionalInfoBtn')
      btn.textContent = '⏳ Saving...'
      btn.disabled = true

      try {
        const response = await fetch(`${API_BASE}/api/candidates/${user.user_id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            bio: document.getElementById('bio').value,
            skills: document.getElementById('skills').value,
            github_url: document.getElementById('githubUrl').value,
            linkedin_url: document.getElementById('linkedinUrl').value
          })
        })

        if (response.ok) {
          showSuccess('Professional info updated successfully')
          btn.textContent = '✅ Saved!'
          setTimeout(() => { btn.textContent = 'Save Professional Info'; btn.disabled = false }, 2000)
          loadProfile()
        } else {
          showError('Failed to update')
          btn.textContent = 'Save Professional Info'
          btn.disabled = false
        }
      } catch (error) {
        showError('Something went wrong')
        btn.textContent = 'Save Professional Info'
        btn.disabled = false
      }
    }

    // Upload avatar
    async function uploadAvatar(input) {
      const file = input.files[0]
      if (!file) return

      const formData = new FormData()
      formData.append('image', file)

      try {
        const response = await fetch(API_BASE + '/api/upload/profile-picture', {
          method: 'POST',
          credentials: 'include',
          body: formData
        })

        if (response.ok) {
          showSuccess('Profile picture updated!')
          loadProfile()
        }
      } catch (error) {
        showError('Failed to upload image')
      }
    }

    // Upload resume
    async function uploadResume(input) {
      const file = input.files[0]
      if (!file) return

      const formData = new FormData()
      formData.append('resume', file)

      try {
        const response = await fetch(API_BASE + '/api/upload/resume', {
          method: 'POST',
          credentials: 'include',
          body: formData
        })

        if (response.ok) {
          showSuccess('Resume uploaded successfully!')
          loadProfile()
        }
      } catch (error) {
        showError('Failed to upload resume')
      }
    }

    // Delete account
    async function deleteAccount() {
      if (!confirm('Are you sure? This will permanently delete your account and all your data.')) return
      if (!confirm('This cannot be undone. Are you absolutely sure?')) return

      try {
        const response = await fetch(`${API_BASE}/api/users/${user.user_id}`, {
          method: 'DELETE',
          credentials: 'include'
        })

        if (response.ok) {
          localStorage.removeItem('user')
          window.location.href = 'index.html'
        }
      } catch (error) {
        showError('Failed to delete account')
      }
    }

    loadProfile()