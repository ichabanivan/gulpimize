// Transferring files

/* eslint no-multi-spaces: ["error", { exceptions: { "VariableDeclarator": true } }] */

const
  gulp        = require('gulp'),         // The streaming build system
  browserSync = require('browser-sync'), // Live CSS Reload & Browser Syncing
  gulpIf      = require('gulp-if'),           // Conditionally run a task

  PATH = require('../path');

gulp.task('assets', () => {
  return gulp.src(PATH.src.files)
    .pipe(gulpIf('*.htaccess', gulp.dest(PATH.build.folder), gulp.dest(PATH.build.fonts.folder)))
    .pipe(browserSync.reload({stream: true}))
});
