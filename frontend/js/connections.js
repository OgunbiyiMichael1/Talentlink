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

    if (user.role === 'employer') {
  roleLink.innerHTML = `<a href="jobs.html" class="text-[#4B5563] dark:text-[#D9D9D9] hover:text-[#009B77] font-medium transition-colors text-sm">Job Market</a>`
} else {
  roleLink.innerHTML = `<a href="jobs.html" class="text-[#4B5563] dark:text-[#D9D9D9] hover:text-[#009B77] font-medium transition-colors text-sm">Browse Jobs</a>`
}

if (user.role === 'employer') {
  roleLinkMobile.innerHTML = `<a href="jobs.html" class="flex items-center gap-3 px-3 py-2 rounded-lg text-[#4B5563] dark:text-[#D9D9D9] hover:bg-[#009B77]/10 hover:text-[#009B77] font-medium text-sm">📊 Job Market</a>`
} else {
  roleLinkMobile.innerHTML = `<a href="jobs.html" class="flex items-center gap-3 px-3 py-2 rounded-lg text-[#4B5563] dark:text-[#D9D9D9] hover:bg-[#009B77]/10 hover:text-[#009B77] font-medium text-sm">💼 Browse Jobs</a>`
}

    async function logout() {
  await fetch(`${API_BASE}/api/auth/logout`, { method: 'POST', credentials: 'include' })
  localStorage.removeItem('user')
  localStorage.removeItem('token')
  window.location.href = 'login.html'
}
    

    // Switch tabs
    function switchTab(tab) {
      document.getElementById('connectionsPanel').classList.add('hidden')
      document.getElementById('pendingPanel').classList.add('hidden')
      document.getElementById('findPanel').classList.add('hidden')
      document.getElementById(`${tab}Panel`).classList.remove('hidden')

      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('text-[#009B77]', 'border-[#009B77]')
        btn.classList.add('text-[#4B5563]', 'border-transparent')
      })
      const activeBtn = document.getElementById(`${tab}Tab`)
      activeBtn.classList.add('text-[#009B77]', 'border-[#009B77]')
      activeBtn.classList.remove('text-[#4B5563]', 'border-transparent')
    }

    // Load connections
    async function loadConnections() {
      try {
        const response = await fetch(`${API_BASE}/api/connections`, {
          credentials: 'include'
        })
        const connections = await response.json()
        const container = document.getElementById('connectionsContainer')
        container.innerHTML = ''
        document.getElementById('connectionsCount').textContent = connections.length

        if (connections.length === 0) {
          container.innerHTML = `
            <div class="col-span-2 bg-white dark:bg-[#014421] rounded-2xl p-12 text-center border border-[#E5E7EB] dark:border-[#009B77]/20">
              <p class="text-4xl mb-4">🤝</p>
              <h3 class="text-xl font-bold text-[#222222] dark:text-white mb-2" style="font-family: Poppins, sans-serif;">No connections yet</h3>
              <p class="text-[#4B5563] dark:text-[#D9D9D9] mb-4">Start building your network by finding people to connect with.</p>
              <button onclick="switchTab('find')" class="bg-[#009B77] text-white px-6 py-2 rounded-lg hover:bg-[#007A5E] transition-colors font-medium">Find People</button>
            </div>
          `
          return
        }

        connections.forEach(conn => {
          const initials = conn.other_first_name[0] + conn.other_last_name[0]
          const card = document.createElement('div')
          card.className = 'bg-white dark:bg-[#014421] rounded-2xl p-5 border border-[#E5E7EB] dark:border-[#009B77]/20'
          card.innerHTML = `
            <div class="flex items-center gap-3 mb-4">
              ${conn.other_profile_picture ? `
                <div onclick="openLightbox('${conn.other_profile_picture}')" class="w-12 h-12 bg-[#009B77] rounded-full flex items-center justify-center text-white font-bold shrink-0 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                  <img src="${conn.other_profile_picture}" class="w-full h-full object-cover rounded-full">
                </div>
              ` : `
                <div class="w-12 h-12 bg-[#009B77] rounded-full flex items-center justify-center text-white font-bold shrink-0">
                  ${initials}
                </div>
              `}
              <div>
                <a href="public-profile.html?id=${conn.other_user_id}" class="font-bold text-[#222222] dark:text-white hover:text-[#009B77] transition-colors">${conn.other_first_name} ${conn.other_last_name}</a>
                <p class="text-[#4B5563] dark:text-[#D9D9D9] text-xs">Connected</p>
              </div>
            </div>
            <button onclick="removeConnection(${conn.connection_id}, this)"
              class="w-full border border-red-200 text-red-400 py-2 rounded-lg text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              Remove Connection
            </button>
          `
          container.appendChild(card)
        })
      } catch (error) {
        console.error(error)
      }
    }

    // Load pending requests
    async function loadPending() {
      try {
        const response = await fetch(`${API_BASE}/api/connections/pending`, {
          credentials: 'include'
        })
        const pending = await response.json()
        const container = document.getElementById('pendingContainer')
        container.innerHTML = ''
        document.getElementById('pendingCount').textContent = pending.length

        if (pending.length === 0) {
          container.innerHTML = `
            <div class="bg-white dark:bg-[#014421] rounded-2xl p-8 text-center border border-[#E5E7EB] dark:border-[#009B77]/20">
              <p class="text-[#4B5563] dark:text-[#D9D9D9]">No pending connection requests.</p>
            </div>
          `
          return
        }

        pending.forEach(req => {
          const initials = req.first_name[0] + req.last_name[0]
          const card = document.createElement('div')
          card.className = 'bg-white dark:bg-[#014421] rounded-2xl p-5 border border-[#E5E7EB] dark:border-[#009B77]/20'
          card.innerHTML = `
            <div class="flex items-center gap-3 mb-4">
              <div class="w-12 h-12 bg-[#009B77] rounded-full flex items-center justify-center text-white font-bold shrink-0">
                ${req.profile_picture_url ? `<img src="${req.profile_picture_url}" class="w-full h-full object-cover rounded-full">` : initials}
              </div>
              <div>
                <p class="font-bold text-[#222222] dark:text-white">${req.first_name} ${req.last_name}</p>
                <p class="text-[#4B5563] dark:text-[#D9D9D9] text-xs">Wants to connect</p>
              </div>
            </div>
            <div class="flex gap-2">
              <button onclick="respondToRequest(${req.connection_id}, 'Accepted', this)"
                class="flex-1 bg-[#009B77] text-white py-2 rounded-lg text-sm hover:bg-[#007A5E] transition-colors font-medium">
                Accept
              </button>
              <button onclick="respondToRequest(${req.connection_id}, 'Rejected', this)"
                class="flex-1 border border-[#E5E7EB] dark:border-[#014421] text-[#4B5563] dark:text-[#D9D9D9] py-2 rounded-lg text-sm hover:border-red-400 hover:text-red-500 transition-colors">
                Decline
              </button>
            </div>
          `
          container.appendChild(card)
        })
      } catch (error) {
        console.error(error)
      }
    }

    // Respond to connection request
    async function respondToRequest(connectionId, status, btn) {
      btn.textContent = '⏳'
      btn.disabled = true

      try {
        await fetch(`${API_BASE}/api/connections/${connectionId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ status })
        })
        loadPending()
        loadConnections()
      } catch (error) {
        console.error(error)
      }
    }

    // Remove connection
    async function removeConnection(connectionId, btn) {
      if (!confirm('Remove this connection?')) return
      btn.textContent = '⏳ Removing...'
      btn.disabled = true

      try {
        await fetch(`${API_BASE}/api/connections/${connectionId}`, {
          method: 'DELETE',
          credentials: 'include'
        })
        loadConnections()
      } catch (error) {
        console.error(error)
      }
    }

    // Find people - search all users
    async function findPeople(query) {
      try {
        const response = await fetch(`${API_BASE}/api/jobs?search=${query}`, {
          credentials: 'include'
        })
      } catch (error) {
        console.error(error)
      }
    }

    document.getElementById('searchPeople').addEventListener('input', async (e) => {
      const query = e.target.value.trim()
      if (query.length < 2) return

      try {
        const response = await fetch(`${API_BASE}/api/users?search=${encodeURIComponent(query)}`, {
          credentials: 'include'
        })
        const users = await response.json()
        const container = document.getElementById('findContainer')
        container.innerHTML = ''

        if (!Array.isArray(users) || users.length === 0) {
          container.innerHTML = `<div class="col-span-2 text-center text-[#4B5563] dark:text-[#D9D9D9] py-8">No users found</div>`
          return
        }

        users.filter(u => u.user_id !== user.user_id).forEach(u => {
          const initials = u.first_name[0] + u.last_name[0]
          const card = document.createElement('div')
          card.className = 'bg-white dark:bg-[#014421] rounded-2xl p-5 border border-[#E5E7EB] dark:border-[#009B77]/20'
          card.innerHTML = `
            <div class="flex items-center gap-3 mb-4">
              <div class="w-12 h-12 bg-[#009B77] rounded-full flex items-center justify-center text-white font-bold shrink-0">
                ${u.profile_picture_url ? `<img src="${u.profile_picture_url}" class="w-full h-full object-cover rounded-full">` : initials}
              </div>
              <div>
                <p class="font-bold text-[#222222] dark:text-white">${u.first_name} ${u.last_name}</p>
                <p class="text-[#4B5563] dark:text-[#D9D9D9] text-xs">${u.role} ${u.headline ? '· ' + u.headline : ''}</p>
              </div>
            </div>
            <button onclick="sendConnection(${u.user_id}, this)"
              class="w-full bg-[#009B77] text-white py-2 rounded-lg text-sm hover:bg-[#007A5E] transition-colors font-medium">
              Connect
            </button>
          `
          container.appendChild(card)
        })
      } catch (error) {
        console.error(error)
      }
    })

    // Send connection request
    async function sendConnection(receiverId, btn) {
      btn.textContent = '⏳ Sending...'
      btn.disabled = true

      try {
        const response = await fetch(`${API_BASE}/api/connections`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ receiver_id: receiverId })
        })

        const data = await response.json()

        if (response.ok) {
          btn.textContent = '✅ Request Sent'
          btn.className = 'w-full bg-gray-200 text-gray-500 py-2 rounded-lg text-sm cursor-not-allowed'
        } else {
          btn.textContent = data.message === 'Connection request already exists' ? '✅ Already Connected' : 'Connect'
          btn.disabled = data.message === 'Connection request already exists'
        }
      } catch (error) {
        btn.textContent = 'Connect'
        btn.disabled = false
      }
    }

    // Init
    loadConnections()
    loadPending()
