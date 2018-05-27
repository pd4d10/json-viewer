import React from 'react'
import ReactDOM from 'react-dom'
import localeMap from 'devtools/client/locales/en-US/jsonview.properties'
import { themes } from './constants'
import Options from './options'

const text = document.body.childNodes[0].innerText

function setTheme(theme) {
  document.documentElement.setAttribute('class', 'theme-' + theme)
}

function render(text, headers, theme) {
  // Save button click event
  window.addEventListener('contentMessage', e => {
    console.log('contentMessage', e.detail)
    switch (e.detail.type) {
      case 'save':
        const link = document.createElement('a')
        link.href = e.detail.value || ''

        // /a -> a.json
        // /a.json -> a.json
        // /a.txt -> a.txt.json
        // / -> download
        let filename = location.href.split('/').slice(-1)[0] || 'download'
        if (!/\.json$/.test(filename)) {
          filename += '.json'
        }

        link.download = filename
        link.click()
    }
  })

  window.JSONView = {
    json: new Text(text),
    debug: true, // TODO:
    Locale: {
      $STR: key => localeMap[key],
    },
    headers,
  }
  console.log('JSONView', window.JSONView)

  // Set <html> attributes
  let os
  if (navigator.platform.startsWith('Win')) {
    os = 'win'
  } else if (navigator.platform.startsWith('Mac')) {
    os = 'mac'
  } else {
    os = 'linux'
  }
  document.documentElement.setAttribute('platform', os)
  // TODO: Set dir to ltr or rtl by browser default locale
  // document.documentElement.setAttribute('dir', 'ltr')
  setTheme(theme)

  document.body.innerHTML = '<div id="content"></div><div id="options"></div>'

  // Inject CSS
  require('devtools/client/jsonview/css/main.css')
  require('./reset.css')

  // Render JSONView component
  require('devtools/client/jsonview/json-viewer')

  // Render options
  ReactDOM.render(
    <Options
      theme={theme}
      changeTheme={theme => {
        setTheme(theme)
        chrome.storage.sync.set({ theme })
      }}
    />,
    document.getElementById('options'),
  )
}

Promise.all([
  new Promise(r => chrome.runtime.sendMessage({ type: 'headers' }, r)),
  new Promise(r => chrome.storage.sync.get('theme', r)),
]).then(([headers, { theme = themes[0] }]) => {
  if (!headers) {
    headers = {
      request: [],
      response: [],
    }
  }
  render(text, headers, theme)
})
