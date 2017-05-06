// Creating svg sprite

/* eslint no-multi-spaces: ["error", { exceptions: { "VariableDeclarator": true } }] */

const
  gulp         = require('gulp'),          // The streaming build system
  rename       = require('gulp-rename'),   // gulp-rename is a gulp plugin to rename files easily.
  svgstore     = require('gulp-svgstore'), // Combine svg files into one with <symbol> elements.
  svgmin       = require('gulp-svgmin'),   // Minify SVG with SVGO.

  PATH = require('../path');

gulp.task('symbols', () => {
  return gulp.src(PATH.src.img.svg)
    .pipe(svgmin())
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename('symbols.svg'))
    .pipe(gulp.dest(PATH.build.img.folder));
});
