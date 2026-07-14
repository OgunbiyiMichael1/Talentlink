// Global lightbox for any profile picture
function openLightbox(imgSrc) {
  if (!imgSrc) return
  
  let lightbox = document.getElementById('globalLightbox')
  if (!lightbox) {
    lightbox = document.createElement('div')
    lightbox.id = 'globalLightbox'
    lightbox.className = 'fixed inset-0 bg-black/80 z-50 flex items-center justify-center cursor-pointer hidden'
    lightbox.innerHTML = `<img id="lightboxImg" src="" class="max-w-[70vmin] max-h-[70vmin] rounded-full object-cover shadow-2xl">`
    lightbox.addEventListener('click', closeLightbox)
    document.body.appendChild(lightbox)
  }

  document.getElementById('lightboxImg').src = imgSrc
  lightbox.classList.remove('hidden')
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  const lightbox = document.getElementById('globalLightbox')
  if (lightbox) {
    lightbox.classList.add('hidden')
    document.body.style.overflow = ''
  }
}

window.openLightbox = openLightbox
window.closeLightbox = closeLightbox

// Close on escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox()
})
