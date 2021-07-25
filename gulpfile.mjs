// @ts-check
import del from 'del'
import gulp from 'gulp'
import download from 'gulp-downloader'
import unzip from 'gulp-unzip'
import rename from 'gulp-rename'
import gulpif from 'gulp-if'
import replace from 'gulp-replace'

const color = 'rgba(135, 135, 137, 0.9)'

export function clean() {
  return del('./vendor')
}

export function mozilla() {
  return download(
    'https://hg.mozilla.org/mozilla-central/archive/tip.zip/devtools/client/'
  )
    .pipe(unzip())
    .pipe(
      rename((obj) => {
        obj.dirname = obj.dirname.replace(
          /mozilla-central-.*?\//,
          'mozilla-central/'
        )
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
        (file) => file.path.endsWith('filter.svg'),
        replace(/^<svg/, `<svg fill="${color}"`)
      )
    )
    .pipe(gulp.dest('./vendor'))
}

export default gulp.series(clean, mozilla)
