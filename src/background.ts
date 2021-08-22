import { HeadersType, logDebug } from './utils'

const data: Record<string, Partial<HeadersType>> = {}

const filter: chrome.webRequest.RequestFilter = {
  urls: ['<all_urls>'],
  types: ['main_frame'],
}

// https://developer.chrome.com/docs/extensions/reference/webRequest/#life-cycle-of-requests
// use `onSendHeaders` and `onResponseStarted` here, which are the final steps
// note: these lifecycle events are not always fired
chrome.webRequest.onSendHeaders.addListener(
  (details) => {
    logDebug('onSendHeaders', details, data)

    if (!data[details.tabId]) data[details.tabId] = {}
    data[details.tabId].request = details.requestHeaders
  },
  filter,
  ['requestHeaders']
)

chrome.webRequest.onResponseStarted.addListener(
  (details) => {
    logDebug('onResponseStarted', details, data)

    if (!data[details.tabId]) data[details.tabId] = {}
    data[details.tabId].response = details.responseHeaders
    // TODO: Merge same key like `Vary`
  },
  filter,
  ['responseHeaders']
)

chrome.webRequest.onErrorOccurred.addListener((details) => {
  logDebug('onErrorOccurred', details, data)
  delete data[details.tabId]
}, filter)

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  logDebug('onMessage', message, data)

  const tabId = sender.tab?.id
  if (!tabId) return

  if (message === 'headers') {
    sendResponse(data[tabId])
  }

  delete data[tabId]
})
