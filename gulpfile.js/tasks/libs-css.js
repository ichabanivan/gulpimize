// Building all the libraries in one file and minify them

/* eslint no-multi-spaces: ["error", { exceptions: { "VariableDeclarator": true } }] */

const
  gulp         = require('gulp'),                 // The streaming build system
  browserSync  = require('browser-sync'),         // Live CSS Reload & Browser Syncing
  postcss      = require('gulp-postcss'),         // Pipe CSS through PostCSS processors with a single parse
  scss         = require('postcss-scss'),         // SCSS parser for PostCSS.
  shorthand    = require('gulp-shorthand'),       // Makes your CSS files lighter and more readable
  combine      = require('stream-combiner2').obj, // This is a sequel to [stream-combiner](https://npmjs.org/package/stream-combiner) for streams3.
  plumber      = require('gulp-plumber'),         // Prevent pipe breaking caused by errors from gulp plugins              // A cache proxy plugin for gulp
  notify       = require('gulp-notify'),          // Gulp plugin to send messages based on Vinyl Files or Errors to Mac OS X, Linux or Windows using the node-notifier module. Fallbacks to Growl or simply logging
  environments = require('gulp-environments'),    // A library for easily adding environments (development/production) to Gulp
  sourcemaps   = require('gulp-sourcemaps'),      // Source map support for Gulp.js
  // replace      = require('gulp-replace'),         // A string replace plugin for gulp
  // uncss        = require('gulp-uncss'),           // Remove unused CSS selectors.
  rename       = require('gulp-rename'),          // Rename files
  csso         = require('gulp-csso'),            // Minify CSS with CSSO.
  rev          = require('gulp-rev'),             // Static asset revisioning by appending content hash to filenames: unicorn.css => unicorn-d41d8cd98f.css

  PATH = require('../path');

let
  development = environments.development,
  production  = environments.production,

  postcssImport = require('postcss-import'),
  discardComments = require('postcss-discard-comments')({
    removeAll: true
  }),
  mqpacker = require('css-mqpacker'),
  cssnext = require('postcss-cssnext')({
    browsers: ['last 15 versions', '> 1%', 'ie 8', 'ie 7']
  }),
  sorting = require('postcss-sorting'),
  flexbugs = require('postcss-flexbugs-fixes');

const libs = [
  postcssImport, discardComments, mqpacker, cssnext, sorting, flexbugs
];

gulp.task('css:libs', () => {
  return gulp.src(PATH.src.postcss.files.libs)
    .pipe(plumber({
      errorHandler: notify.onError((err) => {
        return {
          title: 'css:libs',
          message: err.message
        }
      })
    }))
    // If it's development this plugin will start to write sourcemaps
    .pipe(development(sourcemaps.init('.')))
    .pipe(postcss(libs, {
      syntax: scss
    }))
    .pipe(shorthand())
    // If you want to remove font-face from libraries you need uncomment string number 17 and 61
    // .pipe(replace(/\@font-face[^}]+\}/g, ''))
    // If you want to remove unused CSS selectors from libraries you need uncomment string number 18 and 63-65
    // .pipe(uncss({
    //   html: [PATH.build.html.allFiles]
    // }))
    .pipe(rename('libs.css'))
    // If it's production this plugin will minify css and create manifest
    .pipe(production(combine(csso(), rev())))
    // If you want remove all the comments from CSS you need uncomment string number 17 and 70-75
    // .pipe(combine(
    //   // Remove css comments
    //   replace(/\/\*[\s\S]*?\*\//g, ''),
    //   // Remove empty lines
    //   replace(/^\s*\n/mg, '')
    // ))
    // If it's development this plugin will finish to write sourcemaps
    .pipe(development(sourcemaps.write()))
    .pipe(gulp.dest(PATH.build.css.folder))
    // If it's production this plugin will write manifest in css.json and unload it to manifest folder
    .pipe(production(combine(rev.manifest('libs-css.json'), gulp.dest(PATH.src.manifest.folder))))
    .pipe(browserSync.reload({stream: true}));
});
