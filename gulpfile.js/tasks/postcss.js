// Сompile your PostCSS templates into CSS

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
  replace      = require('gulp-replace'),         // A string replace plugin for gulp
  rename       = require('gulp-rename'),          // Rename files
  csso         = require('gulp-csso'),            // Minify CSS with CSSO.
  rev          = require('gulp-rev'),             // Static asset revisioning by appending content hash to filenames: unicorn.css => unicorn-d41d8cd98f.css

  PATH = require('../path');

let
  development = environments.development,
  production  = environments.production;

let
  postcssImport   = require('postcss-import'),
  precss          = require('precss'),
  pxtorem         = require('postcss-pxtorem')({
    rootValue: 16,               // (Number) The root element font size.
    unitPrecision: 5,            // (Number) The decimal numbers to allow the REM units to grow to.
    propWhiteList: [],           // (Array) The properties that can change from px to rem.
    selectorBlackList: ['html'], // (Array) The selectors to ignore and leave as px.
    replace: true,               // (Boolean) replaces rules containing rems instead of adding fallbacks.
    mediaQuery: true,            // false // (Boolean) Allow px to be converted in media queries.
    minPixelValue: 4             // (Number) Set the minimum pixel value to replace.
  }),
  discardComments = require('postcss-discard-comments')({
    removeAll: true
  }),
  mqpacker        = require('css-mqpacker'),
  cssnext         = require('postcss-cssnext')({
    browsers: ['last 15 versions', '> 1%', 'ie 8', 'ie 7']
  }),
  assets          = require('postcss-assets')({
    loadPaths: ['./app/img/'],
    relativeTo: './app/scss/'
  }),
  extend          = require('postcss-extend'),
  short           = require('postcss-short'),
  sorting         = require('postcss-sorting'),
  flexbugs        = require('postcss-flexbugs-fixes');

const processors = [
  postcssImport, precss, cssnext, pxtorem, assets, extend, short, mqpacker, sorting, flexbugs, discardComments
];

gulp.task('postcss', () => {
  return gulp.src(PATH.src.postcss.pages.files)
    .pipe(plumber({
      errorHandler: notify.onError((err) => {
        return {
          title: 'css:main',
          message: err.message
        }
      })
    }))
    // If it's development this plugin will start to write sourcemaps
    .pipe(development(sourcemaps.init('.')))
    .pipe(postcss(processors, {
      syntax: scss
    }))
    // Makes your CSS files lighter and more readable
    .pipe(shorthand())
    // Remove empty lines
    .pipe(replace(/^\s*\n/mg, '\n'))
    .pipe(rename({
      extname: '.css'
    }))
    // If it's production this plugin will minify css and create manifest
    .pipe(production(combine(csso(), rev())))
    // If it's development this plugin will finish to write sourcemaps
    .pipe(development(sourcemaps.write()))
    .pipe(gulp.dest(PATH.build.css.folder))
    // If it's production this plugin will write manifest in css.json and unload into manifest folder
    .pipe(production(combine(rev.manifest('css.json'), gulp.dest(PATH.src.manifest.folder))))
    .pipe(browserSync.reload({stream: true}));
});
