import { render } from './render'
import { logDebug } from './utils'

const el = document.body.firstElementChild

if (el instanceof HTMLElement && el?.tagName === 'PRE') {
  try {
    JSON.parse(el.innerText) // check if it's valid JSON
    chrome.runtime.sendMessage('headers', (headers) => {
      render(headers, el.innerText)
    })
  } catch (err) {
    logDebug(err)
    chrome.runtime.sendMessage('clear')
  }
} else {
  chrome.runtime.sendMessage('clear')
}
