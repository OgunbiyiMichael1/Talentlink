function setButtonLoading(btn, loadingText) {
  if (!btn) return
  if (!btn.dataset.originalHtml) btn.dataset.originalHtml = btn.innerHTML
  btn.innerHTML = loadingText
  btn.disabled = true
}

function resetButtonState(btn, fallbackHtml) {
  if (!btn) return
  btn.innerHTML = btn.dataset.originalHtml || fallbackHtml
  btn.disabled = false
  delete btn.dataset.originalHtml
}
