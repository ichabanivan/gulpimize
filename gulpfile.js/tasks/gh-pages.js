// A fully pluggable tool for identifying and reporting on patterns in JavaScript.

/* eslint no-multi-spaces: ["error", { exceptions: { "VariableDeclarator": true } }] */

const
  gulp    = require('gulp'),          // The streaming build system
  ghPages = require('gulp-gh-pages'), // Gulp plugin to publish contents to Github pages

  PATH = require('../path');

gulp.task('gh-pages', function () {
  return gulp.src(PATH.build.allFiles)
    .pipe(ghPages());
});
