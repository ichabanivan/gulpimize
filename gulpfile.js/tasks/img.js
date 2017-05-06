// Minifying all the images

/* eslint no-multi-spaces: ["error", { exceptions: { "VariableDeclarator": true } }] */

const
  gulp        = require('gulp'),          // The streaming build system
  browserSync = require('browser-sync'),  // Live CSS Reload & Browser Syncing
  imagemin    = require('gulp-imagemin'), // Minify PNG, JPEG, GIF and SVG images
  newer       = require('gulp-newer'),    // Only pass through newer source files
  cache       = require('gulp-cache'),    // A cache proxy plugin for gulp
  plumber     = require('gulp-plumber'),  // Prevent pipe breaking caused by errors from gulp plugins              // A cache proxy plugin for gulp
  notify      = require('gulp-notify'),   // Gulp plugin to send messages based on Vinyl Files or Errors to Mac OS X, Linux or Windows using the node-notifier module. Fallbacks to Growl or simply logging

  PATH = require('../path');

gulp.task('img', () => {
  return gulp.src(PATH.src.img.allFiles, {since: gulp.lastRun('img')})
    .pipe(plumber({
      errorHandler: notify.onError((err) => {
        return {
          title: 'img',
          message: err.message
        }
      })
    }))
    .pipe(newer(PATH.build.img.folder))
    .pipe(cache(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.jpegtran({progressive: true}),
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.svgo({plugins: [{removeViewBox: true}]})
    ])))
    .pipe(gulp.dest(PATH.build.img.folder))
    .pipe(browserSync.reload({stream: true}));
});
