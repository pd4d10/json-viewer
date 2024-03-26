import { render } from './render'
import { logDebug } from './utils'

// https://github.com/pd4d10/json-viewer/issues/28
// Since Chrome 117
const elPre = document.querySelector('body > pre')

// Edge Browser
// https://learn.microsoft.com/en-us/microsoft-edge/devtools-guide-chromium/json-viewer/json-viewer
const elDiv = document.querySelector('body > div[hidden=true]')

if (elDiv instanceof HTMLElement) {
  try {
    JSON.parse(elDiv.innerText) // check if it's valid JSON
    render(elDiv.innerText)
  } catch (err) {
    logDebug(err)
  }
} else if (elPre instanceof HTMLElement) {
  try {
    JSON.parse(elPre.innerText) // check if it's valid JSON
    render(elPre.innerText)
  } catch (err) {
    logDebug(err)
  }
}
