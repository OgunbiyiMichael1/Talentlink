// Dark mode
    document.getElementById('themeToggle').addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark')
      localStorage.theme = isDark ? 'dark' : 'light'
      document.getElementById('themeIcon').textContent = isDark ? '☀️' : '🌙'
    })

    document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('mobileMenu').classList.toggle('hidden')
  document.getElementById('menuOpen').classList.toggle('hidden')
  document.getElementById('menuClose').classList.toggle('hidden')
})

    // Get logged in user
    const user = JSON.parse(localStorage.getItem('user'))

    // Redirect if not logged in
    if (!user) {
      window.location.href = 'login.html'
    }

    // Set user info in sidebar
    if (user) {
      const initials = user.first_name[0] + user.last_name[0]
      document.getElementById('sidebarAvatar').textContent = initials
      document.getElementById('postAvatar').textContent = initials
      document.getElementById('avatarBtn').textContent = initials
      document.getElementById('sidebarName').textContent = `${user.first_name} ${user.last_name}`
    }

    // Logout
    async function logout(btn) {
      setButtonLoading(btn, '⏳ Logging out...')

      try {
        await fetchWithAuth(API_BASE + '/api/auth/logout', {
          method: 'POST',
          credentials: 'include'
        })
      } catch (error) {
        console.error(error)
      } finally {
        localStorage.removeItem('user')
        window.location.href = 'login.html'
      }
    }

    // Load posts
    async function loadPosts() {
      try {
        const response = await fetchWithAuth(`${API_BASE}/api/posts`, {
          credentials: 'include'
        })
       const posts = await response.json()
    const container = document.getElementById('postsContainer')

    if (!Array.isArray(posts)) {
      container.innerHTML = `
        <div class="bg-white dark:bg-[#014421] rounded-2xl p-8 text-center border border-[#E5E7EB] dark:border-[#009B77]/20">
          <p class="text-[#4B5563] dark:text-[#D9D9D9]">Unable to load posts right now. Please try again later.</p>
        </div>
      `
      return
    }
    
        document.getElementById('postsLoading').remove()

        if (posts.length === 0) {
          container.innerHTML = `
            <div class="bg-white dark:bg-[#014421] rounded-2xl p-8 text-center border border-[#E5E7EB] dark:border-[#009B77]/20">
              <p class="text-[#4B5563] dark:text-[#D9D9D9]">No posts yet. Be the first to share something!</p>
            </div>
          `
          return
        }

        posts.forEach(post => {
          const initials = post.first_name[0] + post.last_name[0]
          const card = document.createElement('div')
          card.className = 'bg-white dark:bg-[#014421] rounded-2xl shadow-sm border border-[#E5E7EB] dark:border-[#009B77]/20 p-5'
          card.innerHTML = `
            <div class="flex items-center gap-3 mb-4">
              ${post.profile_picture_url ? `
                <div onclick="openLightbox('${post.profile_picture_url}')" class="w-10 h-10 bg-[#009B77] rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                  <img src="${post.profile_picture_url}" class="w-full h-full object-cover rounded-full">
                </div>
              ` : `
                <div class="w-10 h-10 bg-[#009B77] rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                  ${initials}
                </div>
              `}
              <div>
                <a href="public-profile.html?id=${post.user_id}" class="font-bold text-[#222222] dark:text-white text-sm hover:text-[#009B77] transition-colors">${post.first_name} ${post.last_name}</a>
                <p class="text-[#4B5563] dark:text-[#D9D9D9] text-xs">${new Date(post.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <p class="text-[#222222] dark:text-white text-sm leading-relaxed mb-4">${post.content}</p>
            ${post.media_url ? `<img src="${post.media_url}" class="w-full rounded-lg mb-4 object-cover max-h-64">` : ''}
            <div class="flex items-center gap-4 pt-3 border-t border-[#E5E7EB] dark:border-[#009B77]/20">
              <button onclick="likePost(${post.post_id}, this)" 
                class="like-btn flex items-center gap-1 ${post.liked_by_user ? 'text-[#009B77] dark:text-[#9EEAD2]' : 'text-[#4B5563] dark:text-[#D9D9D9]'} hover:text-[#009B77] text-sm transition-colors"
                data-post-id="${post.post_id}" data-liked="${post.liked_by_user}">
                👍 <span class="like-count">${post.like_count || 0}</span>
              </button>
              <button onclick="toggleComments(${post.post_id})" data-comment-post-id="${post.post_id}" class="flex items-center gap-1 text-[#4B5563] dark:text-[#D9D9D9] hover:text-[#009B77] text-sm transition-colors">
                💬 <span class="comment-count">${post.comment_count || 0}</span>
              </button>
              ${post.user_id === user.user_id ? `
                <button onclick="deletePost(${post.post_id}, this)" class="flex items-center gap-1 text-red-400 hover:text-red-600 text-sm transition-colors ml-auto">
                  🗑️ Delete
                </button>
              ` : ''}
            </div>
            <div id="comments-${post.post_id}" data-loaded="false" class="hidden mt-3 pt-3 border-t border-[#E5E7EB] dark:border-[#009B77]/20">
              <div class="comment-list space-y-3 mb-3"></div>
              <div class="flex gap-2">
                <input type="text" id="commentInput-${post.post_id}" placeholder="Write a comment..."
                  class="flex-1 px-3 py-2 rounded-lg border border-[#E5E7EB] dark:border-[#014421] bg-[#FCFCFC] dark:bg-[#022F1F] text-[#222222] dark:text-white text-xs focus:outline-none focus:border-[#009B77]">
                <button onclick="addComment(${post.post_id})" class="bg-[#009B77] text-white px-3 py-2 rounded-lg text-xs hover:bg-[#007A5E]">Send</button>
              </div>
            </div>
          `
          container.appendChild(card)
        })
// After getting user from localStorage
if (user) {
  const initials = user.first_name[0] + user.last_name[0]
  
  // Fetch actual profile to get picture
  fetchWithAuth(`${API_BASE}/api/users/${user.user_id}`, { credentials: 'include' })
    .then(res => res.json())
    .then(userData => {
      if (userData.profile_picture_url) {
        document.getElementById('avatarBtn').innerHTML = `<img src="${userData.profile_picture_url}" class="w-full h-full object-cover rounded-full">`
        document.getElementById('postAvatar').innerHTML = `<img src="${userData.profile_picture_url}" class="w-full h-full object-cover rounded-full">`
        document.getElementById('sidebarAvatar').innerHTML = `<img src="${userData.profile_picture_url}" class="w-full h-full object-cover rounded-full">`
      } else {
        document.getElementById('avatarBtn').textContent = initials
        document.getElementById('postAvatar').textContent = initials
        document.getElementById('sidebarAvatar').textContent = initials
      }
      document.getElementById('sidebarName').textContent = `${userData.first_name} ${userData.last_name}`
      document.getElementById('sidebarHeadline').textContent = userData.headline || 'TalentLink Member'
    })
    .catch(err => console.error(err))
}
      } catch (error) {
        console.error(error)
      }
    }

    // Load recent jobs
    async function loadRecentJobs() {
      try {
        const response = await fetchWithAuth(`${API_BASE}/api/jobs`, {
          credentials: 'include'
        })
        const jobs = await response.json()

        if (!Array.isArray(jobs)) return


        const container = document.getElementById('recentJobs')
        container.innerHTML = ''

        jobs.slice(0, 3).forEach(job => {
          container.innerHTML += `
            <a href="job-detail.html?id=${job.job_id}" class="block hover:bg-[#009B77]/5 rounded-lg p-2 transition-colors">
              <p class="font-medium text-[#222222] dark:text-white text-xs">${job.job_title}</p>
              <p class="text-[#4B5563] dark:text-[#D9D9D9] text-xs">${job.job_location} · ${job.job_type}</p>
            </a>
          `
        })
      } catch (error) {
        console.error(error)
      }
    }

    //image preview
    function previewImage(input) {
  const file = input.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    document.getElementById('previewImg').src = e.target.result
    document.getElementById('imagePreview').classList.remove('hidden')
  }
  reader.readAsDataURL(file)
}

function removeImage() {
  document.getElementById('postImageInput').value = ''
  document.getElementById('imagePreview').classList.add('hidden')
  document.getElementById('previewImg').src = ''
}

  // Create post
async function createPost() {
  const content = document.getElementById('postContent').value.trim()
  const imageInput = document.getElementById('postImageInput')
  const btn = document.getElementById('postBtn')

  if (!content && !imageInput.files[0]) return

  btn.textContent = '⏳ Posting...'
  btn.disabled = true

  try {
    let media_url = null

    // Upload image first if selected (use post-image endpoint)
    if (imageInput.files[0]) {
      const formData = new FormData()
      formData.append('image', imageInput.files[0])
      const uploadRes = await fetchWithAuth(`${API_BASE}/api/upload/post-image`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      })
      const uploadData = await uploadRes.json()
      media_url = uploadData.url
    }

    const response = await fetchWithAuth(`${API_BASE}/api/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ content, media_url })
    })

    if (response.ok) {
      document.getElementById('postContent').value = ''
      removeImage()
      btn.textContent = '✅ Posted!'
      setTimeout(() => {
        btn.textContent = 'Post'
        btn.disabled = false
      }, 1500)
      document.getElementById('postsContainer').innerHTML = ''
      loadPosts()
    }

    // image already uploaded above to post-image; no further upload needed
  } catch (error) {
    btn.textContent = 'Post'
    btn.disabled = false
    console.error(error)
  }
}


    // Like post
    async function likePost(postId, btn) {
      const isLiked = btn.dataset.liked === 'true'
      const current = parseInt(btn.querySelector('.like-count')?.textContent || '0', 10)
      let shouldReset = true

      setButtonLoading(btn, `⏳ ${isLiked ? 'Unliking' : 'Liking'}...`)

      try {
        const response = await fetchWithAuth(`${API_BASE}/api/likes`, {
          method: isLiked ? 'DELETE' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ post_id: postId })
        })

        const data = await response.json().catch(() => ({}))
        if (!response.ok) {
          alert(data.message || 'Unable to update like')
          return
        }

        btn.dataset.liked = (!isLiked).toString()
        if (!isLiked) {
          btn.classList.add('text-[#009B77]', 'dark:text-[#9EEAD2]')
          btn.classList.remove('text-[#4B5563]', 'dark:text-[#D9D9D9]')
        } else {
          btn.classList.remove('text-[#009B77]', 'dark:text-[#9EEAD2]')
          btn.classList.add('text-[#4B5563]', 'dark:text-[#D9D9D9]')
        }

        resetButtonState(btn, '👍 Like')
        shouldReset = false

        const count = btn.querySelector('.like-count')
        const newCount = isLiked ? Math.max(0, current - 1) : current + 1
        if (count) count.textContent = newCount
      } catch (error) {
        console.error(error)
      } finally {
        if (shouldReset) resetButtonState(btn, '👍 Like')
      }
    }

    async function loadComments(postId) {
      const section = document.getElementById(`comments-${postId}`)
      const list = section.querySelector('.comment-list')
      list.innerHTML = `<p class="text-sm text-[#4B5563] dark:text-[#D9D9D9]">Loading comments...</p>`

      try {
        const response = await fetchWithAuth(`${API_BASE}/api/comments/post/${postId}`, {
          credentials: 'include'
        })
        if (!response.ok) {
          list.innerHTML = `<p class="text-sm text-[#ef4444] dark:text-[#fca5a5]">Unable to load comments.</p>`
          return
        }

        const comments = await response.json()
        if (comments.length === 0) {
          list.innerHTML = `<p class="text-sm text-[#4B5563] dark:text-[#D9D9D9]">No comments yet.</p>`
        } else {
          list.innerHTML = comments.map(comment => `
            <div class="flex gap-2 comment-item" data-comment-id="${comment.comment_id}">
              <div class="w-7 h-7 bg-[#009B77] rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                ${comment.first_name[0]}
              </div>
              <div class="bg-[#FCFCFC] dark:bg-[#022F1F] rounded-lg px-3 py-2 flex-1 relative">
                <p class="font-medium text-[#222222] dark:text-white text-xs">${comment.first_name} ${comment.last_name}</p>
                <p class="text-[#4B5563] dark:text-[#D9D9D9] text-xs mt-1">${comment.content}</p>
                ${String(comment.user_id) === String(user.user_id) ? `<button onclick="deleteComment(${comment.comment_id}, ${postId}, this)" class="absolute right-2 top-2 text-red-400 text-xs hover:text-red-600">Delete</button>` : ''}
              </div>
            </div>
          `).join('')
        }

        const commentBtn = document.querySelector(`[data-comment-post-id="${postId}"] .comment-count`)
        if (commentBtn) commentBtn.textContent = comments.length
        section.dataset.loaded = 'true'
      } catch (error) {
        console.error(error)
        list.innerHTML = `<p class="text-sm text-[#ef4444] dark:text-[#fca5a5]">Unable to load comments.</p>`
      }
    }

    // Toggle comments
    async function toggleComments(postId) {
      const section = document.getElementById(`comments-${postId}`)
      const isHidden = section.classList.toggle('hidden')
      if (!isHidden && section.dataset.loaded !== 'true') {
        await loadComments(postId)
      }
    }

    // Add comment
    async function addComment(postId) {
      const input = document.getElementById(`commentInput-${postId}`)
      const btn = document.querySelector(`#comments-${postId} button[onclick="addComment(${postId})"]`)
      const content = input.value.trim()
      if (!content) return

      setButtonLoading(btn, '⏳ Sending...')

      try {
        const response = await fetchWithAuth(`${API_BASE}/api/comments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ post_id: postId, content })
        })

        if (!response.ok) {
          const data = await response.json().catch(() => ({}))
          alert(data.message || 'Unable to send comment')
          return
        }

        const comment = await response.json()
        input.value = ''

        const commentsSection = document.getElementById(`comments-${postId}`)
        const commentList = commentsSection.querySelector('.comment-list')
        const commentEl = document.createElement('div')
        commentEl.className = 'flex gap-2 comment-item'
        commentEl.setAttribute('data-comment-id', comment.comment_id)
        commentEl.innerHTML = `
          <div class="w-7 h-7 bg-[#009B77] rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
            ${user.first_name[0]}
          </div>
          <div class="bg-[#FCFCFC] dark:bg-[#022F1F] rounded-lg px-3 py-2 flex-1 relative">
            <p class="font-medium text-[#222222] dark:text-white text-xs">${user.first_name} ${user.last_name}</p>
            <p class="text-[#4B5563] dark:text-[#D9D9D9] text-xs mt-1">${content}</p>
            <button onclick="deleteComment(${comment.comment_id}, ${postId}, this)" class="absolute right-2 top-2 text-red-400 text-xs hover:text-red-600">Delete</button>
          </div>
        `

        if (commentList && commentList.textContent.includes('No comments yet.')) {
          commentList.innerHTML = ''
        }
        commentList.appendChild(commentEl)

        const commentCount = document.querySelector(`[data-comment-post-id="${postId}"] .comment-count`)
        if (commentCount) {
          commentCount.textContent = parseInt(commentCount.textContent || '0', 10) + 1
        }
      } catch (error) {
        console.error(error)
      } finally {
        resetButtonState(btn, 'Send')
      }
    }

    // Delete comment
    async function deleteComment(commentId, postId, btn) {
      if (!confirm('Delete this comment?')) return
      setButtonLoading(btn, '⏳ Deleting...')
      try {
        const response = await fetchWithAuth(`${API_BASE}/api/comments/${commentId}`, {
          method: 'DELETE',
          credentials: 'include'
        })
        if (!response.ok) {
          const data = await response.json().catch(() => ({}))
          alert(data.message || 'Unable to delete comment')
          return
        }

        const el = btn.closest('.comment-item')
        if (el) el.remove()

        const commentCount = document.querySelector(`[data-comment-post-id="${postId}"] .comment-count`)
        if (commentCount) {
          commentCount.textContent = Math.max(0, parseInt(commentCount.textContent || '0', 10) - 1)
        }
      } catch (error) {
        console.error(error)
      } finally {
        resetButtonState(btn, 'Delete')
      }
    }

    // Delete post
    async function deletePost(postId, btn) {
      if (!confirm('Delete this post?')) return
      setButtonLoading(btn, '⏳ Deleting...')
      try {
        await fetchWithAuth(`${API_BASE}/api/posts/${postId}`, {
          method: 'DELETE',
          credentials: 'include'
        })
        document.getElementById('postsContainer').innerHTML = ''
        loadPosts()
      } catch (error) {
        console.error(error)
      } finally {
        resetButtonState(btn, '🗑️ Delete')
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
    loadPosts()
    loadRecentJobs()

    