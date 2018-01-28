import React from 'react'
import ReactDOM from 'react-dom'
import 'devtools/client/jsonview/css/main.css'
import './reset.css'
import localeMap from 'devtools/client/locales/en-US/jsonview.properties'
import { themes } from './constants'
import Options from './options'

// Save as file
function save(href) {
  const link = document.createElement('a')
  link.href = href

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

function setTheme(theme = themes[0]) {
  document.documentElement.setAttribute('class', 'theme-' + theme)
}

function render(text, headers) {
  window.addEventListener('contentMessage', e => {
    console.log('contentMessage', e.detail)
    switch (e.detail.type) {
      case 'save':
        save(e.detail.value || '')
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
  chrome.storage.sync.get('theme', ({ theme }) => {
    setTheme(theme)
    document.body.innerHTML = '<div id="content"></div><div id="options"></div>'

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
      document.getElementById('options')
    )
  })
}

chrome.runtime.sendMessage({ type: 'headers' }, headers => {
  render(document.body.childNodes[0].innerText, headers)
})
