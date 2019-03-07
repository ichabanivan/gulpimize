// Gulp
import gulp from 'gulp';
import sass from 'gulp-sass';
import postcss from 'gulp-postcss';
import sourcemaps from 'gulp-sourcemaps';
import csso from 'gulp-csso';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import rename from 'gulp-rename';
import flexBugs from 'postcss-flexbugs-fixes';
import postcssPresetEnv from 'postcss-preset-env';
import environments from 'gulp-environments';
// PATH
import PATH from '../PATH';
// Server
import { browserSync } from './server';
// Environments
const { development, production } = environments;

// Task scss:libs
export const libs = () => gulp.src(PATH.scss.libs.input)
  .pipe(plumber({
    errorHandler: notify.onError(err => ({
      title: 'scss:libs',
      message: err.message
    }))
  }))
  .pipe(sass({
    outputStyle: 'expanded'
  }))
  .pipe(rename({ suffix: '.min' }))
  .pipe(production(csso({
    restructure: false,
    sourceMap: true,
    debug: true
  })))
  .pipe(plumber.stop())
  .pipe(gulp.dest((PATH.scss.libs.output)))
  .pipe(browserSync.reload({ stream: true }));

export const style = () => {
  const plugins = [
    postcssPresetEnv({
      browsers: [
        '>0.05%',
        'not dead',
        'not ie <= 11',
        'not op_mini all'
      ]
    }),
    flexBugs({
      bug6: false
    })
  ];

  return gulp.src(PATH.scss.style.input)
    .pipe(plumber({
      errorHandler: notify.onError(err => ({
        title: 'scss:style',
        message: err.message
      }))
    }))
    .pipe(development(sourcemaps.init({ loadMaps: true })))
    .pipe(sass({
      outputStyle: 'expanded'
    }))
    .pipe(postcss(plugins))
    .pipe(rename({ suffix: '.min' }))
    .pipe(production(csso({
      restructure: false,
      sourceMap: true,
      debug: true
    })))
    .pipe(development(sourcemaps.write()))
    .pipe(plumber.stop())
    .pipe(gulp.dest((PATH.scss.style.output)))
    .pipe(browserSync.reload({ stream: true }));
};
