// TODO: Prevent memory leak
const data = {}

const filter = { urls: ['<all_urls>'], types: ['main_frame'] }

chrome.webRequest.onSendHeaders.addListener(
  details => {
    console.log('onSendHeaders', details, data)
    if (!data[details.tabId]) data[details.tabId] = {}
    data[details.tabId].request = details.requestHeaders
  },
  filter,
  ['requestHeaders']
)

chrome.webRequest.onHeadersReceived.addListener(
  details => {
    console.log('onHeadersReceived', details, data)
    if (!data[details.tabId]) data[details.tabId] = {}
    data[details.tabId].response = details.responseHeaders
  },
  filter,
  ['responseHeaders']
)

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { id } = sender.tab
  console.log('onMessage', message, id, data)
  switch (message.type) {
    case 'render':
      chrome.tabs.executeScript(id, {
        file: 'dist/render.js',
      })
    case 'headers':
      sendResponse(data[id])
  }
})
