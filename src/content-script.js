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
      // TODO: Get attributes from environment
      document.documentElement.setAttribute('platform', 'mac')
      document.documentElement.setAttribute('class', 'theme-light')
      document.documentElement.setAttribute('dir', 'ltr')
      document.body.innerHTML = '<div id="content"></div>'
      require('devtools/client/jsonview/css/main.css')
      require('devtools/client/jsonview/json-viewer')
    } catch (err) {
      console.error(err)
    }
  })()
}
