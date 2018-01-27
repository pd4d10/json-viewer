const data = {}

chrome.webRequest.onSendHeaders.addListener(
  details => {
    console.log('onSendHeaders', details)
    if (!data[details.tabId]) data[details.tabId] = {}
    data[details.tabId].request = details.requestHeaders
  },
  { urls: ['<all_urls>'], types: ['main_frame'] },
  ['requestHeaders']
)

chrome.webRequest.onHeadersReceived.addListener(
  details => {
    console.log('onHeadersReceived', details)
    if (!data[details.tabId]) data[details.tabId] = {}
    data[details.tabId].response = details.responseHeaders
  },
  { urls: ['<all_urls>'], types: ['main_frame'] },
  ['responseHeaders']
)

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('onMessage', data, sender.tab.id)
  sendResponse(data[sender.tab.id])
})
