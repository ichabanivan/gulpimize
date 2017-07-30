// Gulp + ES6 = ♡

/* eslint no-multi-spaces: ["error", { exceptions: { "VariableDeclarator": true } }] */

const
  gulp          = require('gulp'),              // The streaming build system
  environments  = require('gulp-environments'), // A library for easily adding environments (development/production) to Gulp
  plumber       = require('gulp-plumber'),      // Prevent pipe breaking caused by errors from gulp plugins
  notify        = require('gulp-notify'),       // Gulp plugin to send messages based on Vinyl Files or Errors to Mac OS X, Linux or Windows using the node-notifier module. Fallbacks to Growl or simply logging
  uglify        = require('gulp-uglify'),       // Minify files with UglifyJS
  babel         = require('gulp-babel'),        // Use next generation JavaScript, today, with Babel

  PATH          = require('../path');

let production  = environments.production;

gulp.task('es6', () => {
  return gulp.src(PATH.src.js.allFiles)
    .pipe(plumber({
      errorHandler: notify.onError((err) => {
        return {
          title: 'es6',
          message: err.message
        }
      })
    }))
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(production(uglify()))
    .pipe(gulp.dest(PATH.build.js.folder))
});
