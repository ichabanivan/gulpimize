// Сompile your PostCSS templates into CSS

/* eslint-disable quotes */
/* eslint no-multi-spaces: ["error", { exceptions: { "VariableDeclarator": true } }] */

const
  gulp         = require('gulp'),                 // The streaming build system
  browserSync  = require('browser-sync'),         // Live CSS Reload & Browser Syncing
  postcss      = require('gulp-postcss'),         // Pipe CSS through PostCSS processors with a single parse
  sass         = require('gulp-sass'),            // Sass plugin for Gulp.
  scss         = require('postcss-scss'),         // SCSS parser for PostCSS.
  plumber      = require('gulp-plumber'),         // Prevent pipe breaking caused by errors from gulp plugins
  notify       = require('gulp-notify'),          // Gulp plugin to send messages based on Vinyl Files or Errors to Mac OS X, Linux or Windows using the node-notifier module. Fallbacks to Growl or simply logging
  environments = require('gulp-environments'),    // A library for easily adding environments (development/production) to Gulp
  sourcemaps   = require('gulp-sourcemaps'),      // Source map support for Gulp.js
  replace      = require('gulp-replace'),         // A string replace plugin for gulp
  rename       = require('gulp-rename'),          // Rename files
  csso         = require('gulp-csso'),            // Minify CSS with CSSO.

  PATH = require('../path');

let
  development = environments.development,
  production  = environments.production;

let
  postcssImport   = require('postcss-import'),
  pxtorem         = require('postcss-pxtorem')({
    rootValue: 16,               // (Number) The root element font size.
    unitPrecision: 5,            // (Number) The decimal numbers to allow the REM units to grow to.
    propWhiteList: [],           // (Array) The properties that can change from px to rem.
    selectorBlackList: ['html'], // (Array) The selectors to ignore and leave as px.
    replace: true,               // (Boolean) replaces rules containing rems instead of adding fallbacks.
    mediaQuery: true,            // false // (Boolean) Allow px to be converted in media queries.
    minPixelValue: 4             // (Number) Set the minimum pixel value to replace.
  }),
  mqpacker        = require('css-mqpacker'),
  assets          = require('postcss-assets')({
    loadPaths: ['./src/img/'],
    relativeTo: './src/sass/'
  }),
  cssnext         = require('postcss-cssnext')({
    browsers: ['last 15 versions', '> 1%', 'ie 8', 'ie 7']
  }),
  short           = require('postcss-short'),
  sorting         = require('postcss-sorting'),
  flexbugs        = require('postcss-flexbugs-fixes');

const preProcessors = [
  postcssImport, cssnext, pxtorem, assets, short
];

const postProcessors = [
  mqpacker, sorting, flexbugs
];

gulp.task('sass', () => {
  return gulp.src(PATH.src.sass.pages.files)
    .pipe(plumber({
      errorHandler: notify.onError((err) => {
        return {
          title: 'sass',
          message: err.message
        }
      })
    }))
    // If it's development this plugin will start to write sourcemaps
    .pipe(development(sourcemaps.init()))
    .pipe(postcss(preProcessors, {
      syntax: scss
    }))
    .pipe(sass({
      outputStyle: 'expanded'
    }))
    .pipe(postcss(postProcessors, {
      syntax: scss
    }))
    // Remove empty lines
    .pipe(replace(/^\s*\n/mg, '\n'))
    .pipe(rename({
      extname: '.css'
    }))
    // If it's production this plugin will minify css and create manifest
    .pipe(production(csso()))
    // If it's development this plugin will finish to write sourcemaps
    .pipe(development(sourcemaps.write()))
    .pipe(gulp.dest(PATH.build.css.folder))
    .pipe(browserSync.reload({stream: true}));
});
