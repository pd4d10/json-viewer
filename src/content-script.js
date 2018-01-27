if (
  document.body &&
  document.body.childNodes[0] &&
  document.body.childNodes[0].tagName == 'PRE'
) {
  ;(async () => {
    try {
      const text = document.body.childNodes[0].innerText
      JSON.parse(text)

      const localeMap = require('properties-parser').parse(
        require('devtools/client/locales/en-US/jsonview.properties')
      )
      window.JSONView = {
        json: document.body.childNodes[0],
        debug: true,
        Locale: {
          $STR: key => localeMap[key],
        },
        headers: {
          request: [],
          response: [],
        },
      }
      require('./reset.css')
      window.addEventListener('contentMessage', e => {
        console.log('contentMessage', e.detail)

        const save = href => {
          const link = document.createElement('a')
          link.href = href

          // /a -> a.json
          // /a.json -> a.json
          // /a.txt -> a.txt.json
          let filename = location.href.split('/').slice(-1)[0]
          if (!/\.json$/.test(filename)) {
            filename += '.json'
          }

          link.download = filename
          link.click()
        }
        switch (e.detail.type) {
          case 'save':
            save(e.detail.value || '')
        }
      })
      let os
      if (navigator.platform.startsWith('Win')) {
        os = 'win'
      } else if (navigator.platform.startsWith('Mac')) {
        os = 'mac'
      } else {
        os = 'linux'
      }
      document.documentElement.setAttribute('platform', os)
      document.documentElement.setAttribute('class', 'theme-light') // TODO: Add options
      // TODO: Set dir to ltr or rtl by browser default locale
      // document.documentElement.setAttribute('dir', 'ltr')

      document.body.innerHTML = '<div id="content"></div>'
      require('devtools/client/jsonview/css/main.css')
      require('devtools/client/jsonview/json-viewer')
    } catch (err) {
      console.error(err)
    }
  })()
}
