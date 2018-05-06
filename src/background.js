const data = {}
const filter = { urls: ['<all_urls>'], types: ['main_frame'] }

chrome.webRequest.onSendHeaders.addListener(
  details => {
    console.log('onSendHeaders', details, data)
    data[details.tabId] = {
      request: details.requestHeaders,
    }
  },
  filter,
  ['requestHeaders'],
)

chrome.webRequest.onHeadersReceived.addListener(
  details => {
    console.log('onHeadersReceived', details, data)
    data[details.tabId].response = details.responseHeaders
  },
  filter,
  ['responseHeaders'],
)

chrome.webRequest.onErrorOccurred.addListener(details => {
  console.log('onErrorOccurred', details, data)
  delete data[details.tabId]
}, filter)

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { id } = sender.tab
  console.log('onMessage', message, id, data)
  switch (message.type) {
    case 'render':
      chrome.tabs.executeScript(id, {
        file: 'dist/render.js',
      })
      break
    case 'headers':
      sendResponse(data[id])
      delete data[id]
      break
    case 'delete':
      delete data[id]
      break
  }
})
