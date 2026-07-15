function togglePassword() {
  const input = document.getElementById('password')
  input.type = input.type === 'password' ? 'text' : 'password'
}

async function login() {
  const errorMsg = document.getElementById('errorMsg')
  const submitBtn = document.getElementById('submitBtn')
  const email = document.getElementById('email').value.trim()
  const password = document.getElementById('password').value

  if (!email || !password) {
    errorMsg.textContent = 'Please fill in all fields'
    errorMsg.classList.remove('hidden')
    return
  }

  submitBtn.textContent = '⏳ Logging in...'
  submitBtn.disabled = true
  errorMsg.classList.add('hidden')

  try {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    })

    const data = await response.json()

    if (!response.ok) {
      errorMsg.textContent = data.message || 'Login failed'
      errorMsg.classList.remove('hidden')
      submitBtn.textContent = 'Login'
      submitBtn.disabled = false
      return
    }

    localStorage.setItem('user', JSON.stringify(data.user))
    const params = new URLSearchParams(window.location.search)
    const redirect = params.get('redirect')
    window.location.href = redirect || (data.user.role === 'employer' ? 'employer-dashboard.html' : 'dashboard.html')

  } catch (error) {
    errorMsg.textContent = 'Something went wrong. Please try again.'
    errorMsg.classList.remove('hidden')
    submitBtn.textContent = 'Login'
    submitBtn.disabled = false
  }
}

document.getElementById('themeToggle').addEventListener('click', () => {
  const isDark = document.documentElement.classList.toggle('dark')
  localStorage.theme = isDark ? 'dark' : 'light'
  document.getElementById('themeIcon').textContent = isDark ? '☀️' : '🌙'
})

localStorage.setItem('user', JSON.stringify(data.user))
localStorage.setItem('token', data.token)