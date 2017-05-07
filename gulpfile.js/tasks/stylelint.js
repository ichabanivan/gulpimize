// A mighty, modern CSS linter that helps you enforce consistent conventions and avoid errors in your stylesheets.

/* eslint no-multi-spaces: ["error", { exceptions: { "VariableDeclarator": true } }] */

const
  gulp        = require('gulp'),         // The streaming build system
  plumber     = require('gulp-plumber'), // Prevent pipe breaking caused by errors from gulp plugins
  notify      = require('gulp-notify'),  // Notification plugin for gulp
  stylelint   = require('stylelint'),    // A mighty, modern CSS linter
  postcss     = require('gulp-postcss'), // Pipe CSS through PostCSS processors with a single parse
  scss        = require('postcss-scss'), // SCSS parser for PostCSS
  fs          = require('fs-extra'),

  PATH = require('../path');

let stylelintrc = fs.readJson('./.stylelintrc', 'utf8');

gulp.task('stylelint', () => {
  return gulp.src(PATH.src.postcss.allFiles)
    .pipe(plumber({
      errorHandler: notify.onError((err) => {
        return {
          title: 'css:stylelint',
          message: err.message
        }
      })
    }))
    .pipe(postcss([stylelint(stylelintrc)], {
      syntax: scss
    }))
});
