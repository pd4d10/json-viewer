const data: Record<string, any> = {}
const filter: chrome.webRequest.RequestFilter = {
  urls: ['<all_urls>'],
  types: ['main_frame'],
}

// https://developer.chrome.com/docs/extensions/reference/webRequest/#life-cycle-of-requests
// use `onSendHeaders` and `onResponseStarted` here, which are the final steps
chrome.webRequest.onSendHeaders.addListener(
  (details) => {
    console.log('onSendHeaders', details, data)
    data[details.tabId] = {
      request: details.requestHeaders,
    }
  },
  filter,
  ['requestHeaders']
)

chrome.webRequest.onResponseStarted.addListener(
  (details) => {
    console.log('onResponseStarted', details, data)
    data[details.tabId].response = details.responseHeaders
    // TODO: Merge same key like `Vary`
  },
  filter,
  ['responseHeaders']
)

chrome.webRequest.onErrorOccurred.addListener((details) => {
  console.log('onErrorOccurred', details, data)
  delete data[details.tabId]
}, filter)

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('onMessage', message, data)

  const tabId = sender.tab?.id
  if (!tabId) return

  if (message === 'headers') {
    sendResponse(data[tabId])
  }

  delete data[tabId]
})
