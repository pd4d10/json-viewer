// @ts-check
import del from 'del'
import gulp from 'gulp'
import download from 'gulp-download-stream'
import unzip from 'gulp-unzip'
import rename from 'gulp-rename'
import gulpif from 'gulp-if'
import replace from 'gulp-replace'
import plumber from 'gulp-plumber'
import fetch from 'node-fetch'
import cheerio from 'cheerio'

const color = 'rgba(135, 135, 137, 0.9)'

export const downloadGeckoZip = () => {
  return download({
    file: 'gecko.zip',
    url: 'https://hg.mozilla.org/mozilla-central/archive/tip.zip/devtools/client/',
  }).pipe(gulp.dest('.'))
}

let locales = []

export const downloadL10n = gulp.series(
  async (cb) => {
    const html = await fetch('https://hg.mozilla.org/l10n-central').then(
      (res) => res.text()
    )
    const $ = cheerio.load(html)
    locales = $('table')
      .first()
      .find('td:first-child')
      .map((i, el) => $(el).text().trim())
      .toArray()
    // console.log(locales)
    cb()
  },
  ...locales.map((locale) => (cb) => {
    return download({
      file: `${locale}.properties`,
      url: `https://hg.mozilla.org/l10n-central/${locale}/raw-file/tip/devtools/client/jsonview.properties`,
    })
      .pipe(
        plumber((err) => {
          console.error(err)
          cb() // some of the locales are not available (404), just ignore the errors
        })
      )
      .pipe(gulp.dest('./vendor/l10n'))
  })
)

export const gecko = gulp.series(
  () => {
    return del('./vendor/gecko')
  },
  () => {
    return gulp
      .src('./gecko.zip')
      .pipe(unzip())
      .pipe(
        rename((obj) => {
          obj.dirname = obj.dirname.replace(/mozilla-central-.*?\//, 'gecko/')
        })
      )
      .pipe(
        replace(
          new RegExp('chrome://devtools/skin', 'g'),
          'devtools/client/themes'
        )
      )
      .pipe(
        replace(new RegExp('chrome://devtools/content', 'g'), 'devtools/client')
      )
      .pipe(
        gulpif(
          (file) => file.path.endsWith('arrow.svg'),
          replace(/fill="(.*?)"/, `fill="${color}"`)
        )
      )
      .pipe(
        gulpif(
          (file) => file.path.endsWith('filter-small.svg'),
          replace(/<svg/, `<svg fill="${color}"`)
        )
      )
      .pipe(gulp.dest('./vendor'))
  }
)
