// @ts-check
import fs from 'fs-extra'
import del from 'del'
import gulp from 'gulp'
import download from 'gulp-download-stream'
import unzip from 'gulp-unzip'
import rename from 'gulp-rename'
import gulpif from 'gulp-if'
import replace from 'gulp-replace'
import fetch from 'node-fetch'
import * as cheerio from 'cheerio'

const color = 'rgba(135, 135, 137, 0.9)'

// https://hg.mozilla.org/mozilla-central/file/tip/devtools/client
export const downloadGeckoZip = () => {
  return download({
    file: 'gecko.zip',
    url: 'https://hg.mozilla.org/mozilla-central/archive/tip.zip/devtools/client/',
  }).pipe(gulp.dest('.'))
}

export const downloadL10nList = async (done) => {
  const html = await fetch('https://hg.mozilla.org/l10n-central').then((res) =>
    res.text()
  )
  const $ = cheerio.load(html)
  const locales = $('table')
    .first()
    .find('td:first-child')
    .slice(1)
    .map((i, el) => $(el).text().trim())
    .toArray()
  console.log(locales)

  fs.writeJsonSync('./vendor/l10n.json', locales)
  done()
}

export const downloadL10nContent = async (done) => {
  const locales = fs.readJsonSync('./vendor/l10n.json')
  for (const locale of locales) {
    const res = await fetch(
      `https://hg.mozilla.org/l10n-central/${locale}/raw-file/tip/devtools/client/jsonview.properties`
    )
    if (!res.ok) {
      console.log(locale, 'not found')
      continue
    }
    const text = await res.text()
    fs.writeFileSync(`./vendor/l10n/${locale}.properties`, text)
  }
  done()
}

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
          `require("resource://devtools/shared/flags.js")`,
          '{ testing: false }'
        )
      )
      .pipe(
        replace(
          new RegExp('resource://', 'g'),
          process.cwd() + '/vendor/gecko/'
        )
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
