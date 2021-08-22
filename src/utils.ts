export interface HeadersType {
  request: chrome.webRequest.HttpHeader[]
  response: chrome.webRequest.HttpHeader[]
}

export const logDebug: typeof console.log = (...args) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(...args)
  }
}
