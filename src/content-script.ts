import { render } from './render'
import { logDebug } from './utils'

const el = document.body.children[0]

if (el.tagName === 'PRE') {
  try {
    JSON.parse(el.innerHTML)
    chrome.runtime.sendMessage('headers', (headers) => {
      render(headers)
    })
  } catch (err) {
    logDebug(err)
    chrome.runtime.sendMessage('clear')
  }
} else {
  chrome.runtime.sendMessage('clear')
}
