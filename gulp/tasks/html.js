// Gulp
import fileInclude from 'gulp-file-include';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import w3cjs from 'gulp-w3cjs';
import gulp from 'gulp';
// PATH
import PATH from '../PATH';
// Server
import { browserSync } from './server';

// Task html
export default () => gulp.src(PATH.html.input)
  .pipe(plumber({
    errorHandler: notify.onError(err => ({
      title: 'html',
      message: err.message
    }))
  }))
  .pipe(fileInclude({
    prefix: '@@',
    basepath: '@file'
  }))
  .pipe(w3cjs())
  .pipe(gulp.dest(PATH.html.output))
  .pipe(browserSync.reload({ stream: true }));
