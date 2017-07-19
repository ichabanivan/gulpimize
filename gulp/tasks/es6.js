// Gulp + ES6 = ♡

/* eslint no-multi-spaces: ["error", { exceptions: { "VariableDeclarator": true } }] */

const
  gulp          = require('gulp'),                 // The streaming build system
  combine       = require('stream-combiner2').obj, // This is a sequel to [stream-combiner](https://npmjs.org/package/stream-combiner) for streams3.
  environments  = require('gulp-environments'),    // A library for easily adding environments (development/production) to Gulp
  plumber       = require('gulp-plumber'),         // Prevent pipe breaking caused by errors from gulp plugins
  notify        = require('gulp-notify'),          // Gulp plugin to send messages based on Vinyl Files or Errors to Mac OS X, Linux or Windows using the node-notifier module. Fallbacks to Growl or simply logging
  uglify        = require('gulp-uglify'),          // Minify files with UglifyJS
  babel         = require('gulp-babel'),           // Use next generation JavaScript, today, with Babel
  rev           = require('gulp-rev'),             // Static asset revisioning by appending content hash to filenames: unicorn.css => unicorn-d41d8cd98f.css
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
    .pipe(production(combine(
      rev.manifest('es6.json'),
      gulp.dest(PATH.src.manifest.folder)
    )))
    .pipe(gulp.dest(PATH.build.js.folder))
});
