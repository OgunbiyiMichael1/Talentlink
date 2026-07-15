// Dark mode
    function toggleTheme() {
      const isDark = document.documentElement.classList.toggle('dark')
      localStorage.theme = isDark ? 'dark' : 'light'
      document.getElementById('themeIcon').textContent = isDark ? '☀️' : '🌙'
      document.getElementById('themeIconMobile').textContent = isDark ? '☀️' : '🌙'
    }
    document.getElementById('themeToggle').addEventListener('click', toggleTheme)
    document.getElementById('themeToggleMobile').addEventListener('click', toggleTheme)

    // Hamburger
    document.getElementById('hamburger').addEventListener('click', () => {
      document.getElementById('mobileMenu').classList.toggle('hidden')
      document.getElementById('menuOpen').classList.toggle('hidden')
      document.getElementById('menuClose').classList.toggle('hidden')
    })

    // Get job ID from URL
    const params = new URLSearchParams(window.location.search)
    const jobId = params.get('id')
    const user = JSON.parse(localStorage.getItem('user'))

    let currentJob = null

    // Load job details
    async function loadJob() {
      if (!jobId) {
        window.location.href = 'jobs.html'
        return
      }

      try {
        const response = await fetch(`${API_BASE}/api/jobs/${jobId}`, {
          credentials: 'include'
        })
        const job = await response.json()
        currentJob = job

        document.getElementById('loadingState').classList.add('hidden')
        document.getElementById('jobContent').classList.remove('hidden')

        // Fill in details
        document.getElementById('jobTitle').textContent = job.job_title
        document.getElementById('jobLocation').textContent = `📍 ${job.job_location}`
        document.getElementById('jobType').textContent = job.job_type
        document.getElementById('jobSalary').textContent = job.salary_range ? `💰 ${job.salary_range}` : ''
        document.getElementById('jobDescription').textContent = job.job_description
        document.getElementById('jobRequirements').textContent = job.requirements
        document.getElementById('overviewType').textContent = job.job_type
        document.getElementById('overviewLocation').textContent = job.job_location
        document.getElementById('overviewSalary').textContent = job.salary_range || 'Not specified'
        document.getElementById('overviewDate').textContent = new Date(job.created_at).toLocaleDateString()

        document.title = `${job.job_title} — TalentLink`

        // If job is closed
        if (!job.is_active) {
          const applyBtn = document.getElementById('applyBtn')
          applyBtn.textContent = 'Applications Closed'
          applyBtn.disabled = true
          applyBtn.className = 'w-full md:w-auto bg-[#D9D9D9] text-[#4B5563] px-8 py-3 rounded-lg font-semibold cursor-not-allowed'
        }

      } catch (error) {
        console.error(error)
      }
    }

    // Apply to job
    async function applyToJob() {
      if (!user) {
  window.location.href = `login.html?redirect=job-detail.html?id=${jobId}`
  return
}

      if (user.role === 'employer') {
        alert('Employers cannot apply to jobs.')
        return
      }

      const applyBtn = document.getElementById('applyBtn')
      setButtonLoading(applyBtn, '⏳ Applying...')

      try {
        const response = await fetch(`${API_BASE}/api/applications`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ job_id: parseInt(jobId) })
        })

        const data = await response.json()

        if (response.ok) {
          applyBtn.textContent = '✅ Applied Successfully'
          applyBtn.className = 'w-full md:w-auto bg-green-500 text-white px-8 py-3 rounded-lg font-semibold cursor-not-allowed'
        } else {
          applyBtn.textContent = data.message === 'You have already applied to this job' ? '✅ Already Applied' : 'Apply Now'
          applyBtn.disabled = data.message === 'You have already applied to this job'
          if (data.message !== 'You have already applied to this job') {
            alert(data.message)
          }
        }

      } catch (error) {
        console.error(error)
      } finally {
        if (!applyBtn.disabled) resetButtonState(applyBtn, 'Apply Now')
      }
    }

    loadJob()