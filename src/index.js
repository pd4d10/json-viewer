import '../gecko-dev/devtools/client/jsonview/css/main.css'

window.JSONView = {
  json: {},
  debug: true,
  Locale: {
    $STR: () => {},
  },
  headers: {},
}

require('../gecko-dev/devtools/client/jsonview/json-viewer')
