if (
  document.body &&
  document.body.childNodes[0] &&
  document.body.childNodes[0].tagName == 'PRE'
) {
  try {
    JSON.parse(document.body.childNodes[0].innerText)
    chrome.runtime.sendMessage({ type: 'render' })
  } catch (err) {
    console.error(err)
  }
}
