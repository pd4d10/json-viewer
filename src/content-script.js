if (
  document.body &&
  document.body.childNodes[0] &&
  document.body.childNodes[0].tagName == 'PRE'
) {
  ;(async () => {
    try {
      const text = document.body.childNodes[0].innerText
      JSON.parse(text)

      // const jsonViewStrings = require('devtools-modules/src/Services').strings.createBundle(
      //   'chrome://devtools/locale/jsonview.properties'
      // )
      const map = require('properties-parser').parse(
        require('devtools/client/locales/en-US/jsonview.properties')
      )
      window.JSONView = {
        json: text,
        debug: true,
        Locale: {
          $STR: key => {
            try {
              // return jsonViewStrings.GetStringFromName(key)
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
      document.write(`
      <html platform="mac" class="theme-light" dir="ltr">
<body>
  <div id="content"></div>
</body>
</html>
`)
      require('devtools/client/jsonview/css/main.css')
      require('devtools/client/jsonview/json-viewer')
    } catch (err) {
      console.error(err)
    }
  })()
}
