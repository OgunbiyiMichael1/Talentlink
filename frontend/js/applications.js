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

    async function logout(btn) {
      setButtonLoading(btn, '⏳ Logging out...')

      try {
        await fetchWithAuth(`${API_BASE}/api/auth/logout`, { method: 'POST', })
      } catch (error) {
        console.error(error)
      } finally {
        localStorage.removeItem('user')
  localStorage.removeItem('token')
  window.location.href = 'login.html'
      }
    }

    const statusColors = {
      'Pending': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      'Reviewed': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      'Interviewing': 'bg-[#009B77]/10 text-[#009B77]',
      'Offered': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'Rejected': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    }

    async function loadApplications() {
      try {
        const response = await fetchWithAuth(`${API_BASE}/api/applications/candidate/${user.user_id}`, {
          credentials: 'include'
        })
        const applications = await response.json()
        const container = document.getElementById('applicationsContainer')
        container.innerHTML = ''

        // Update stats
        document.getElementById('totalCount').textContent = applications.length
        document.getElementById('pendingCount').textContent = applications.filter(a => a.status === 'Pending').length
        document.getElementById('interviewCount').textContent = applications.filter(a => a.status === 'Interviewing').length
        document.getElementById('offeredCount').textContent = applications.filter(a => a.status === 'Offered').length

        if (applications.length === 0) {
          container.innerHTML = `
            <div class="bg-white dark:bg-[#014421] rounded-2xl p-12 text-center border border-[#E5E7EB] dark:border-[#009B77]/20">
              <p class="text-4xl mb-4">📋</p>
              <h3 class="text-xl font-bold text-[#222222] dark:text-white mb-2" style="font-family: Poppins, sans-serif;">No applications yet</h3>
              <p class="text-[#4B5563] dark:text-[#D9D9D9] mb-6">Start applying to jobs to track your progress here.</p>
              <a href="jobs.html" class="bg-[#009B77] text-white px-6 py-2 rounded-lg hover:bg-[#007A5E] transition-colors font-medium">Browse Jobs</a>
            </div>
          `
          return
        }

        applications.forEach(app => {
          const card = document.createElement('div')
          card.className = 'bg-white dark:bg-[#014421] rounded-2xl p-6 border border-[#E5E7EB] dark:border-[#009B77]/20 hover:shadow-md transition-shadow'
          card.innerHTML = `
            <div class="flex items-start justify-between gap-4">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-[#009B77]/10 rounded-xl flex items-center justify-center text-xl shrink-0">🏢</div>
                <div>
                  <h3 class="font-bold text-[#222222] dark:text-white" style="font-family: Poppins, sans-serif;">${app.job_title}</h3>
                  <p class="text-[#4B5563] dark:text-[#D9D9D9] text-sm">${app.job_location} · ${app.job_type}</p>
                  ${app.salary_range ? `<p class="text-[#009B77] text-sm font-medium">💰 ${app.salary_range}</p>` : ''}
                </div>
              </div>
              <span class="text-xs px-3 py-1 rounded-full font-medium shrink-0 ${statusColors[app.status] || 'bg-gray-100 text-gray-700'}">
                ${app.status}
              </span>
            </div>
            <div class="flex items-center justify-between mt-4 pt-4 border-t border-[#E5E7EB] dark:border-[#009B77]/20">
              <p class="text-[#4B5563] dark:text-[#D9D9D9] text-xs">Applied ${new Date(app.applied_at).toLocaleDateString()}</p>
              <button onclick="withdrawApplication(${app.application_id}, this)"
                class="text-red-400 hover:text-red-600 text-xs font-medium transition-colors">
                Withdraw
              </button>
            </div>
          `
          container.appendChild(card)
        })

      } catch (error) {
        console.error(error)
      }
    }

    async function withdrawApplication(applicationId, btn) {
      if (!confirm('Withdraw this application?')) return
      setButtonLoading(btn, '⏳ Withdrawing...')
      try {
        const response = await fetchWithAuth(`${API_BASE}/api/applications/${applicationId}`, {
          method: 'DELETE',
        })
        if (response.ok) {
          btn.closest('.rounded-2xl')?.remove()
          loadApplications()
        }
      } catch (error) {
        console.error(error)
      } finally {
        resetButtonState(btn, 'Withdraw')
      }
    }

    loadApplications()
