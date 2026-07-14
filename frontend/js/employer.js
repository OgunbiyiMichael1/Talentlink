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
    if (!user || user.role !== 'employer') window.location.href = 'login.html'

    async function logout() {
      await fetch(API_BASE + '/api/auth/logout', { method: 'POST', credentials: 'include' })
      localStorage.removeItem('user')
      window.location.href = 'login.html'
    }

    // Show/hide sections
    function showSection(section) {
      document.getElementById('jobsSection').classList.add('hidden')
      document.getElementById('postSection').classList.add('hidden')
      document.getElementById('profileSection').classList.add('hidden')
      document.getElementById('applicantsSection').classList.add('hidden')
      document.getElementById(`${section}Section`).classList.remove('hidden')
    }

    // Load employer profile
    async function loadProfile() {
      try {
        const response = await fetch(`${API_BASE}/api/employers/${user.user_id}`, {
          credentials: 'include'
        })
        const profile = await response.json()
        document.getElementById('sidebarCompany').textContent = profile.company_name || 'My Company'
        document.getElementById('sidebarIndustry').textContent = profile.industry || 'Employer'
        document.getElementById('companyName').textContent = profile.company_name || ''
        document.getElementById('companyNameInput').value = profile.company_name || ''
        document.getElementById('industryInput').value = profile.industry || ''
        document.getElementById('websiteInput').value = profile.company_website || ''
        document.getElementById('bioInput').value = profile.company_bio || ''
      } catch (error) {
        console.error(error)
      }
    }

    // Load jobs
    async function loadJobs() {
  try {
    const response = await fetch(`${API_BASE}/api/jobs/employer/${user.user_id}`, {
      credentials: 'include'
    })
    const jobs = await response.json()
    const container = document.getElementById('jobsContainer')
    container.innerHTML = ''

    document.getElementById('totalJobs').textContent = jobs.length
    document.getElementById('activeJobs').textContent = jobs.filter(j => j.is_active).length

    if (jobs.length === 0) {
      container.innerHTML = `
        <div class="bg-white dark:bg-[#014421] rounded-2xl p-12 text-center border border-[#E5E7EB] dark:border-[#009B77]/20">
          <p class="text-4xl mb-4">💼</p>
          <h3 class="text-xl font-bold text-[#222222] dark:text-white mb-2" style="font-family: Poppins, sans-serif;">No jobs posted yet</h3>
          <p class="text-[#4B5563] dark:text-[#D9D9D9] mb-6">Post your first job to start receiving applications.</p>
          <button onclick="showSection('post')" class="bg-[#009B77] text-white px-6 py-2 rounded-lg hover:bg-[#007A5E] transition-colors font-medium">Post a Job</button>
        </div>
      `
      return
    }

    // Count total applicants across all jobs
    let totalApplicants = 0
    await Promise.all(jobs.map(async (job) => {
      try {
        const appRes = await fetch(`${API_BASE}/api/applications/job/${job.job_id}`, {
          credentials: 'include'
        })
        const applicants = await appRes.json()
        totalApplicants += applicants.length
      } catch (e) {}
    }))
    document.getElementById('totalApplicants').textContent = totalApplicants

    jobs.forEach(job => {
      const card = document.createElement('div')
      card.className = 'bg-white dark:bg-[#014421] rounded-2xl p-6 border border-[#E5E7EB] dark:border-[#009B77]/20'
      card.innerHTML = `
        <div class="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 class="font-bold text-[#222222] dark:text-white text-lg" style="font-family: Poppins, sans-serif;">${job.job_title}</h3>
            <p class="text-[#4B5563] dark:text-[#D9D9D9] text-sm">${job.job_location} · ${job.job_type}</p>
            ${job.salary_range ? `<p class="text-[#009B77] text-sm font-medium mt-1">💰 ${job.salary_range}</p>` : ''}
          </div>
          <span class="text-xs px-3 py-1 rounded-full font-medium shrink-0 ${job.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}">
            ${job.is_active ? 'Active' : 'Closed'}
          </span>
        </div>
        <div class="flex flex-wrap gap-2 pt-4 border-t border-[#E5E7EB] dark:border-[#009B77]/20">
          <button onclick="viewApplicants(${job.job_id}, '${job.job_title}')" 
            class="bg-[#009B77] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#007A5E] transition-colors">
            View Applicants
          </button>
          <button onclick="closeJob(${job.job_id}, this)"
            class="border border-[#E5E7EB] dark:border-[#009B77]/30 text-[#4B5563] dark:text-[#D9D9D9] px-4 py-2 rounded-lg text-sm hover:border-red-400 hover:text-red-500 transition-colors">
            ${job.is_active ? 'Close Job' : 'Reopen Job'}
          </button>
          <button onclick="deleteJob(${job.job_id})"
            class="border border-red-200 text-red-400 px-4 py-2 rounded-lg text-sm hover:bg-red-50 transition-colors">
            Delete
          </button>
        </div>
      `
      container.appendChild(card)
    })
  } catch (error) {
    console.error(error)
  }
}

    // View applicants for a job
    async function viewApplicants(jobId, jobTitle) {
      showSection('applicants')
      document.getElementById('applicantsTitle').textContent = `Applicants — ${jobTitle}`
      document.getElementById('applicantsContainer').innerHTML = '<p class="text-[#4B5563] dark:text-[#D9D9D9]">Loading applicants...</p>'

      try {
        const response = await fetch(`${API_BASE}/api/applications/job/${jobId}`, {
          credentials: 'include'
        })
        const applicants = await response.json()
        const container = document.getElementById('applicantsContainer')
        container.innerHTML = ''

        // Update total applicants stat
        document.getElementById('totalApplicants').textContent = applicants.length

        if (applicants.length === 0) {
          container.innerHTML = `
            <div class="bg-white dark:bg-[#014421] rounded-2xl p-8 text-center border border-[#E5E7EB] dark:border-[#009B77]/20">
              <p class="text-[#4B5563] dark:text-[#D9D9D9]">No applicants yet for this job.</p>
            </div>
          `
          return
        }

        applicants.forEach(applicant => {
          const initials = applicant.first_name[0] + applicant.last_name[0]
          const card = document.createElement('div')
          card.className = 'bg-white dark:bg-[#014421] rounded-2xl p-6 border border-[#E5E7EB] dark:border-[#009B77]/20'
          card.innerHTML = `
            <div class="flex items-center justify-between gap-4">
              <div class="flex items-center gap-4">
                ${applicant.profile_picture_url ? `
                  <div onclick="openLightbox('${applicant.profile_picture_url}')" class="w-12 h-12 bg-[#009B77] rounded-full flex items-center justify-center text-white font-bold shrink-0 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                    <img src="${applicant.profile_picture_url}" class="w-full h-full object-cover rounded-full">
                  </div>
                ` : `
                  <div class="w-12 h-12 bg-[#009B77] rounded-full flex items-center justify-center text-white font-bold shrink-0">${initials}</div>
                `}
                <div>
                  <a href="public-profile.html?id=${applicant.user_id}" class="font-bold text-[#222222] dark:text-[#D9D9D9] hover:text-[#009B77] transition-colors">${applicant.first_name} ${applicant.last_name}</a>
                  <p class="text-[#4B5563] dark:text-[#D9D9D9] text-sm">${applicant.email}</p>
                  ${applicant.headline ? `<p class="text-[#4B5563] dark:text-[#D9D9D9] text-xs mt-1">${applicant.headline}</p>` : ''}
                  <p class="text-[#4B5563] dark:text-[#D9D9D9] text-xs mt-1">Applied ${new Date(applicant.applied_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div class="flex flex-col gap-2 items-end">
                <select onchange="updateStatus(${applicant.application_id}, this.value)"
                  class="px-3 py-2 rounded-lg border border-[#E5E7EB] dark:border-[#014421] bg-[#FCFCFC] dark:bg-[#022F1F] text-[#222222] dark:text-white text-sm focus:outline-none focus:border-[#009B77]">
                  <option ${applicant.status === 'Pending' ? 'selected' : ''}>Pending</option>
                  <option ${applicant.status === 'Reviewed' ? 'selected' : ''}>Reviewed</option>
                  <option ${applicant.status === 'Interviewing' ? 'selected' : ''}>Interviewing</option>
                  <option ${applicant.status === 'Offered' ? 'selected' : ''}>Offered</option>
                  <option ${applicant.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
                </select>
              </div>
            </div>
          `
          container.appendChild(card)
        })
      } catch (error) {
        console.error(error)
      }
    }

    // Update application status
    async function updateStatus(applicationId, status) {
      try {
        await fetch(`${API_BASE}/api/applications/${applicationId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ status })
        })
      } catch (error) {
        console.error(error)
      }
    }

    // Post a job
    async function postJob() {
      const btn = document.getElementById('postJobBtn')
      const errorMsg = document.getElementById('postErrorMsg')
      const successMsg = document.getElementById('postSuccessMsg')

      const job_title = document.getElementById('jobTitle').value.trim()
      const job_type = document.getElementById('jobType').value
      const job_location = document.getElementById('jobLocation').value.trim()
      const salary_range = document.getElementById('salaryRange').value.trim()
      const job_description = document.getElementById('jobDescription').value.trim()
      const requirements = document.getElementById('jobRequirements').value.trim()

      if (!job_title || !job_location || !job_description || !requirements) {
        errorMsg.textContent = 'Please fill in all required fields'
        errorMsg.classList.remove('hidden')
        return
      }

      btn.textContent = '⏳ Posting...'
      btn.disabled = true
      errorMsg.classList.add('hidden')

      try {
        const response = await fetch(`${API_BASE}/api/jobs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ job_title, job_type, job_location, salary_range, job_description, requirements })
        })

        const data = await response.json()

        if (response.ok) {
          successMsg.textContent = 'Job posted successfully!'
          successMsg.classList.remove('hidden')
          btn.textContent = '✅ Posted!'
          setTimeout(() => {
            btn.textContent = 'Post Job'
            btn.disabled = false
            successMsg.classList.add('hidden')
            showSection('jobs')
            loadJobs()
          }, 2000)
        } else {
          errorMsg.textContent = data.message || 'Failed to post job'
          errorMsg.classList.remove('hidden')
          btn.textContent = 'Post Job'
          btn.disabled = false
        }
      } catch (error) {
        errorMsg.textContent = 'Something went wrong'
        errorMsg.classList.remove('hidden')
        btn.textContent = 'Post Job'
        btn.disabled = false
      }
    }

    // Close/reopen job
   async function closeJob(jobId, btn) {
  const originalText = btn.textContent.trim()
  btn.textContent = '⏳ Updating...'
  btn.disabled = true

  try {
      const response = await fetch(`${API_BASE}/api/jobs/${jobId}/close`, {
        method: 'PATCH',
        credentials: 'include'
    })  

    if (response.ok) {
      btn.textContent = '✅ Done!'
      setTimeout(() => {
        loadJobs()
      }, 1000)
    } else {
      btn.textContent = originalText
      btn.disabled = false
    }
  } catch (error) {
    btn.textContent = originalText
    btn.disabled = false
    console.error(error)
  }
}

    // Delete job
    async function deleteJob(jobId) {
      if (!confirm('Delete this job? All applications will be removed.')) return
      try {
        await fetch(`${API_BASE}/api/jobs/${jobId}`, {
          method: 'DELETE',
          credentials: 'include'
        })
        loadJobs()
      } catch (error) {
        console.error(error)
      }
    }

    // Update company profile
    async function updateCompanyProfile() {
      const btn = document.getElementById('updateProfileBtn')
      btn.textContent = '⏳ Saving...'
      btn.disabled = true

      try {
        const response = await fetch(`${API_BASE}/api/employers/${user.user_id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            company_name: document.getElementById('companyNameInput').value,
            industry: document.getElementById('industryInput').value,
            company_website: document.getElementById('websiteInput').value,
            company_bio: document.getElementById('bioInput').value
          })
        })

        if (response.ok) {
          btn.textContent = '✅ Saved!'
          setTimeout(() => {
            btn.textContent = 'Save Changes'
            btn.disabled = false
          }, 2000)
          loadProfile()
        }
      } catch (error) {
        btn.textContent = 'Save Changes'
        btn.disabled = false
      }
    }

    function handleSearch(e) {
  if (e.key === 'Enter') {
    const query = document.getElementById('searchInput').value.trim()
    if (query) {
      window.location.href = `search.html?q=${encodeURIComponent(query)}`
    }
  }
}


    // Init
    loadProfile()
    loadJobs()