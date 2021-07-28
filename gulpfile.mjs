// @ts-check
import del from 'del'
import gulp from 'gulp'
import download from 'gulp-download-stream'
import unzip from 'gulp-unzip'
import rename from 'gulp-rename'
import gulpif from 'gulp-if'
import replace from 'gulp-replace'
import plumber from 'gulp-plumber'

// https://hg.mozilla.org/l10n-central
// [].map.call($('table').querySelectorAll('td:first-child'), (v) => v.innerText).slice(1)
const locales = [
  'ace',
  'ach',
  'af',
  'ak',
  'an',
  'ar',
  'as',
  'ast',
  'az',
  'be',
  'bg',
  'bn',
  'bn-BD',
  'bn-IN',
  'bo',
  'br',
  'brx',
  'bs',
  'ca',
  'ca-valencia',
  'cak',
  'ckb',
  'crh',
  'cs',
  'csb',
  'cy',
  'da',
  'de',
  'dsb',
  'el',
  'en-CA',
  'en-GB',
  'en-ZA',
  'eo',
  'es-AR',
  'es-CL',
  'es-ES',
  'es-MX',
  'et',
  'eu',
  'fa',
  'ff',
  'fi',
  'fr',
  'frp',
  'fur',
  'fy-NL',
  'ga-IE',
  'gd',
  'gl',
  'gn',
  'gu-IN',
  'gv',
  'he',
  'hi-IN',
  'hr',
  'hsb',
  'hto',
  'hu',
  'hy-AM',
  'hye',
  'ia',
  'id',
  'ilo',
  'is',
  'it',
  'ixl',
  'ja',
  'ja-JP-mac',
  'ka',
  'kab',
  'kk',
  'km',
  'kn',
  'ko',
  'kok',
  'ks',
  'ku',
  'lb',
  'lg',
  'lij',
  'lo',
  'lt',
  'ltg',
  'lv',
  'mai',
  'meh',
  'mix',
  'mk',
  'ml',
  'mn',
  'mr',
  'ms',
  'my',
  'nb-NO',
  'ne-NP',
  'nl',
  'nn-NO',
  'nr',
  'nso',
  'ny',
  'oc',
  'or',
  'pa-IN',
  'pai',
  'pbb',
  'pl',
  'ppl',
  'pt-BR',
  'pt-PT',
  'quy',
  'qvi',
  'rm',
  'ro',
  'ru',
  'rw',
  'sah',
  'sat',
  'sc',
  'scn',
  'sco',
  'si',
  'sk',
  'sl',
  'son',
  'sq',
  'sr',
  'ss',
  'st',
  'sv-SE',
  'sw',
  'szl',
  'ta',
  'ta-LK',
  'te',
  'tg',
  'th',
  'tl',
  'tn',
  'tr',
  'trs',
  'ts',
  'tsz',
  'uk',
  'ur',
  'uz',
  've',
  'vi',
  'wo',
  'xcl',
  'xh',
  'zam',
  'zh-CN',
  'zh-TW',
  'zu',
]

const color = 'rgba(135, 135, 137, 0.9)'

export const clean = () => {
  return del('./vendor')
}

export const downloadGeckoZip = () => {
  return download({
    file: 'gecko.zip',
    url: 'https://hg.mozilla.org/mozilla-central/archive/tip.zip/devtools/client/',
  }).pipe(gulp.dest('.'))
}

export const downloadL10n = gulp.series(
  locales.map((locale) => (cb) => {
    return download({
      file: `${locale}.properties`,
      url: `https://hg.mozilla.org/l10n-central/${locale}/raw-file/tip/devtools/client/jsonview.properties`,
    })
      .pipe(
        plumber(function errorHandler(err) {
          console.error(err)
          cb() // some of the locales are not available (404), just ignore the errors
        })
      )
      .pipe(gulp.dest('./vendor/l10n'))
  })
)

export function gecko() {
  return gulp
    .src('./gecko.zip')
    .pipe(unzip())
    .pipe(
      rename((obj) => {
        obj.dirname = obj.dirname.replace(/mozilla-central-.*?\//, 'gecko/')
      })
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

export default gulp.series(clean, gecko)
