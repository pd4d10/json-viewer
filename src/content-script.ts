const el = document.body.children[0]

if (el instanceof HTMLElement && el.tagName === 'PRE') {
  try {
    JSON.parse(el.innerText)
    chrome.runtime.sendMessage({ type: 'render' })
  } catch (err) {
    chrome.runtime.sendMessage({ type: 'delete' })
    console.error(err)
  }
} else {
  chrome.runtime.sendMessage({ type: 'delete' })
}
