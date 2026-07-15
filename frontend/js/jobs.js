// Dark mode
    document.getElementById('themeToggle').addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark')
      localStorage.theme = isDark ? 'dark' : 'light'
      document.getElementById('themeIcon').textContent = isDark ? '☀️' : '🌙'
    })

    // Search jobs
    async function searchJobs() {
      const btn = document.querySelector('button[onclick="searchJobs()"]')
      setButtonLoading(btn, '⏳ Searching...')

      const search = document.getElementById('searchInput').value.trim()
      const jobType = document.getElementById('jobTypeFilter').value

      let url = `${API_BASE}/api/jobs?`
      if (search) url += `search=${encodeURIComponent(search)}&`
      if (jobType) url += `job_type=${encodeURIComponent(jobType)}`

      try {
        const response = await fetchWithAuth(url, { credentials: 'include' })
        const jobs = await response.json()
        renderJobs(jobs)
      } catch (error) {
        console.error(error)
      } finally {
        resetButtonState(btn, 'Search')
      }
    }

    // Render jobs
    function renderJobs(jobs) {
      const container = document.getElementById('jobsContainer')
      const emptyState = document.getElementById('emptyState')
      const resultsCount = document.getElementById('resultsCount')

      container.innerHTML = ''
      resultsCount.textContent = `${jobs.length} job${jobs.length !== 1 ? 's' : ''} found`

      if (jobs.length === 0) {
        emptyState.classList.remove('hidden')
        return
      }

      emptyState.classList.add('hidden')

      jobs.forEach(job => {
        const daysAgo = Math.floor((new Date() - new Date(job.created_at)) / (1000 * 60 * 60 * 24))
        const timeAgo = daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo} days ago`

        const card = document.createElement('div')
        card.className = 'bg-white dark:bg-[#014421] rounded-2xl shadow-sm border border-[#E5E7EB] dark:border-[#009B77]/20 p-6 hover:shadow-md hover:border-[#009B77] transition-all cursor-pointer'
        card.onclick = () => window.location.href = `job-detail.html?id=${job.job_id}`
        card.innerHTML = `
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 bg-[#009B77]/10 rounded-xl flex items-center justify-center text-xl">🏢</div>
            <span class="text-xs px-3 py-1 rounded-full font-medium ${
              job.job_type === 'Full-time' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
              job.job_type === 'Part-time' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
              job.job_type === 'Contract' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
              'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
            }">${job.job_type}</span>
          </div>
          <h3 class="font-bold text-[#222222] dark:text-white mb-1 text-lg" style="font-family: Poppins, sans-serif;">${job.job_title}</h3>
          <p class="text-[#4B5563] dark:text-[#D9D9D9] text-sm mb-3">${job.job_location}</p>
          ${job.salary_range ? `<p class="text-[#009B77] font-medium text-sm mb-3">💰 ${job.salary_range}</p>` : ''}
          <p class="text-[#4B5563] dark:text-[#D9D9D9] text-sm line-clamp-2 mb-4">${job.job_description}</p>
          <div class="flex items-center justify-between pt-3 border-t border-[#E5E7EB] dark:border-[#009B77]/20">
            <span class="text-[#4B5563] dark:text-[#D9D9D9] text-xs">${timeAgo}</span>
            <span class="text-[#009B77] text-sm font-medium hover:underline">View Details →</span>
          </div>
        `
        container.appendChild(card)
      })
    }

    // Search on enter key
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') searchJobs()
    })

    // Initial load
    searchJobs()
    // Theme toggle
function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark')
  localStorage.theme = isDark ? 'dark' : 'light'
  document.getElementById('themeIcon').textContent = isDark ? '☀️' : '🌙'
  document.getElementById('themeIconMobile').textContent = isDark ? '☀️' : '🌙'
}
document.getElementById('themeToggle').addEventListener('click', toggleTheme)
document.getElementById('themeToggleMobile').addEventListener('click', toggleTheme)

// Hamburger
const hamburger = document.getElementById('hamburger')
const mobileMenu = document.getElementById('mobileMenu')
const menuOpen = document.getElementById('menuOpen')
const menuClose = document.getElementById('menuClose')

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden')
  menuOpen.classList.toggle('hidden')
  menuClose.classList.toggle('hidden')
})
