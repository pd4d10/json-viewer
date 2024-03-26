import { render } from './render'
import { logDebug } from './utils'

const el =
  // https://github.com/pd4d10/json-viewer/issues/28
  // Since Chrome 117
  document.querySelector('body > pre') ??
  // Edge Browser
  // https://learn.microsoft.com/en-us/microsoft-edge/devtools-guide-chromium/json-viewer/json-viewer
  document.querySelector('body > div[hidden=true]')

if (el instanceof HTMLElement) {
  try {
    JSON.parse(el.innerText) // check if it's valid JSON
    render(el.innerText)
  } catch (err) {
    logDebug(err)
  }
}
