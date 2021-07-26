const el = document.body.children[0]

if (el.tagName === 'PRE') {
  try {
    JSON.parse(el.innerHTML)
    chrome.runtime.sendMessage('render', async (headers) => {
      const { render } = await import('./render')
      render(headers)
    })
  } catch (err) {
    console.error(err)
  }
}
