if (
  document.body &&
  document.body.childNodes[0] &&
  document.body.childNodes[0].tagName == 'PRE'
) {
  ;(async () => {
    try {
      const text = document.body.childNodes[0].innerText
      JSON.parse(text)

      const map = require('properties-parser').parse(
        require('devtools/client/locales/en-US/jsonview.properties')
      )
      window.JSONView = {
        json: document.body.childNodes[0],
        debug: true,
        Locale: {
          $STR: key => {
            try {
              return map[key]
            } catch (err) {
              console.error(err)
              return undefined
            }
          },
        },
        headers: {
          request: [],
          response: [],
        },
      }
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
