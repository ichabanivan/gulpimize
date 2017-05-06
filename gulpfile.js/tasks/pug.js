// Сompile your Pug templates into HTML

/* eslint no-multi-spaces: ["error", { exceptions: { "VariableDeclarator": true } }] */

const
  gulp         = require('gulp'),              // The streaming build system
  browserSync  = require('browser-sync'),      // Live CSS Reload & Browser Syncing
  plumber      = require('gulp-plumber'),      // Prevent pipe breaking caused by errors from gulp plugins
  notify       = require('gulp-notify'),       // Notification plugin for gulp
  pug          = require('gulp-pug'),          // Gulp plugin for compiling Pug templates
  fs           = require('fs-extra'),                // File System
  revReplace   = require('gulp-rev-replace'),  // Rewrite occurences of filenames which have been renamed by gulp-rev
  environments = require('gulp-environments'), // A library for easily adding environments (development/production) to Gulp

  PATH = require('../path');

let production  = environments.production;

gulp.task('pug', () => {
  // Include JSON with data for pug
  const YOUR_LOCALS = PATH.src.pug.data;

  return gulp.src(PATH.src.pug.pages)
    .pipe(plumber({
      errorHandler: notify.onError((err) => {
        return {
          title: 'pug',
          message: err.message
        }
      })
    }))
    .pipe(pug({
      // It's parse JSON with data for pug(pug)
      locals: fs.readJson(YOUR_LOCALS, 'utf-8'),
      pretty: '  '
    }))
    // If it's production then includes all the file with their new names from manifest file and create critical.css
    .pipe(production(revReplace({
      manifest: gulp.src(PATH.src.manifest.allFiles, {allowEmpty: true})
    })))
    .pipe(gulp.dest(PATH.build.folder))
    .pipe(browserSync.reload({stream: true}));
});
