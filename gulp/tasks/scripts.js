// Gulp
import environments from 'gulp-environments';
import sourcemaps from 'gulp-sourcemaps';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import rename from 'gulp-rename';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
import gulp from 'gulp';
// PATH
import PATH from '../PATH';
// Babel config
import babelrc from '../../.babelrc';
// Server
import { browserSync } from './server';
// Environments
const { development, production } = environments;

// Task js:libs
export const libs = () => gulp.src(PATH.js.libs.input)
  .pipe(plumber({
    errorHandler: notify.onError(err => ({
      title: 'js:libs',
      message: err.message
    }))
  }))
  .pipe(babel(babelrc))
  .pipe(production(uglify()))
  .pipe(rename({ suffix: '.min' }))
  .pipe(gulp.dest((PATH.js.libs.output)))
  .pipe(plumber.stop())
  .pipe(browserSync.reload({ stream: true }));

// Task js:main
export const main = () => gulp.src(PATH.js.main.input)
  .pipe(plumber({
    errorHandler: notify.onError(err => ({
      title: 'js:main',
      message: err.message
    }))
  }))
  .pipe(development(sourcemaps.init({ loadMaps: true })))
  .pipe(babel(babelrc))
  .pipe(production(uglify()))
  .pipe(rename({ suffix: '.min' }))
  .pipe(development(sourcemaps.write()))
  .pipe(plumber.stop())
  .pipe(gulp.dest((PATH.js.main.output)))
  .pipe(browserSync.reload({ stream: true }));
