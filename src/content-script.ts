import { render } from './render'
import { logDebug } from './utils'

// https://github.com/pd4d10/json-viewer/issues/28
// Since Chrome 117
const el = document.body.lastElementChild

if (el instanceof HTMLElement && el?.tagName === 'PRE') {
  try {
    JSON.parse(el.innerText) // check if it's valid JSON
    render(el.innerText)
  } catch (err) {
    logDebug(err)
  }
}
