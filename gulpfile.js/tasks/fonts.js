// Encode base64 data from font-files (woff and woff2) and store the result in a css file.

/* eslint no-multi-spaces: ["error", { exceptions: { "VariableDeclarator": true } }] */

const
  gulp          = require('gulp'),           // The streaming build system
  replace       = require('gulp-replace'),   // A string replace plugin for gulp
  rename        = require('gulp-rename'),    // Gulp-rename is a gulp plugin to rename files easily.
  cssfont64     = require('gulp-cssfont64'), // Encode base64 data from font-files and store the result in a css file.

  PATH = require('../path');

/**
 * Encode base64 data from font-files (woff) and store the result in a css file.
 */

gulp.task('woff', () => {
  return new Promise((resolve, reject) => {
    gulp.src(PATH.src.fonts.woff)
      .pipe(cssfont64())
      .pipe(rename({
        suffix: '.woff'
      }))
      .pipe(replace(/x-font-woff;/g, 'x-font-woff;charset=utf-8;'))
      .pipe(replace(/\);}/g, ') format(\'woff\'); font-weight:normal; font-style:normal}'))
      .pipe(gulp.dest(PATH.build.css.folder));
    resolve()
  });
});

/**
 * Encode base64 data from font-files (woff2) and store the result in a css file.
 */

gulp.task('woff2', () => {
  return new Promise((resolve, reject) => {
    gulp.src(PATH.src.fonts.woff2)
      .pipe(cssfont64())
      .pipe(rename({
        suffix: '.woff2'
      }))
      .pipe(replace(/octet-stream/g, 'x-font-woff2;charset=utf-8'))
      .pipe(replace(/\);}/g, ') format(\'woff2\'); font-weight:normal; font-style:normal}'))
      .pipe(gulp.dest(PATH.build.css.folder));
    resolve()
  });
});

gulp.task('fonts', gulp.parallel('woff', 'woff2'));
