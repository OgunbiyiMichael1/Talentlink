function selectRole(role) {
  document.getElementById('role').value = role
  const candidateBtn = document.getElementById('candidateBtn')
  const employerBtn = document.getElementById('employerBtn')

  if (role === 'candidate') {
    candidateBtn.className = 'role-btn border-2 border-[#009B77] bg-[#009B77]/10 text-[#009B77] py-3 rounded-lg font-medium transition-all'
    employerBtn.className = 'role-btn border-2 border-[#E5E7EB] text-[#4B5563] py-3 rounded-lg font-medium transition-all hover:border-[#009B77]'
  } else {
    employerBtn.className = 'role-btn border-2 border-[#009B77] bg-[#009B77]/10 text-[#009B77] py-3 rounded-lg font-medium transition-all'
    candidateBtn.className = 'role-btn border-2 border-[#E5E7EB] text-[#4B5563] py-3 rounded-lg font-medium transition-all hover:border-[#009B77]'
  }
}

function togglePassword() {
  const input = document.getElementById('password')
  input.type = input.type === 'password' ? 'text' : 'password'
}

async function register() {
  const errorMsg = document.getElementById('errorMsg')
  const submitBtn = document.getElementById('submitBtn')
  const first_name = document.getElementById('first_name').value.trim()
  const last_name = document.getElementById('last_name').value.trim()
  const email = document.getElementById('email').value.trim()
  const password = document.getElementById('password').value
  const role = document.getElementById('role').value

  if (!first_name || !last_name || !email || !password) {
    errorMsg.textContent = 'Please fill in all fields'
    errorMsg.classList.remove('hidden')
    return
  }

  if (password.length < 8) {
    errorMsg.textContent = 'Password must be at least 8 characters'
    errorMsg.classList.remove('hidden')
    return
  }

  submitBtn.textContent = '⏳ Creating Account...'
  submitBtn.disabled = true
  errorMsg.classList.add('hidden')

  try {
    const response = await fetchWithAuth(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ first_name, last_name, email, password, role })
    })

    const data = await response.json()

    if (!response.ok) {
      errorMsg.textContent = data.message || 'Registration failed'
      errorMsg.classList.remove('hidden')
      submitBtn.textContent = 'Create Account'
      submitBtn.disabled = false
      return
    }

    localStorage.setItem('user', JSON.stringify(data.user))
    localStorage.setItem('token', data.token)
    window.location.href = 'dashboard.html'

  } catch (error) {
    errorMsg.textContent = 'Something went wrong. Please try again.'
    errorMsg.classList.remove('hidden')
    submitBtn.textContent = 'Create Account'
    submitBtn.disabled = false
  }
}

document.getElementById('themeToggle').addEventListener('click', () => {
  const isDark = document.documentElement.classList.toggle('dark')
  localStorage.theme = isDark ? 'dark' : 'light'
  document.getElementById('themeIcon').textContent = isDark ? '☀️' : '🌙'
})

