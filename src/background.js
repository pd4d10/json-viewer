// const data = {}

// chrome.webRequest.onSendHeaders.addListener(
//   details => {
//     console.log('', details)
//     data[details.tabId] = details.requestHeaders
//   },
//   { urls: ['<all_urls>'], types: ['main_frame'] },
//   ['responseHeaders']
// )

// chrome.webRequest.onHeadersReceived.addListener(
//   details => {
//     console.log('onHeadersReceived', details)
//     const contentType = details.responseHeaders['Content-Type']
//     if (contentType !== 'application/json') {
//       data[details.tabId] = details.responseHeaders
//     }
//   },
//   { urls: ['<all_urls>'], types: ['main_frame'] },
//   ['responseHeaders']
// )
