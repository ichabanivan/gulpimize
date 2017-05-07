// gulpfile.js

'use strict';

/* eslint no-multi-spaces: ["error", { exceptions: { "VariableDeclarator": true } }] */

const
  gulp         = require('gulp'),         // The streaming build system
  HubRegistry  = require('gulp-hub'),     // A gulp plugin to run tasks from multiple gulpfiles
  browsersync  = require('browser-sync'), // Live CSS Reload & Browser Syncing

  PATH = require('./path.js'); // Path config structure

// Load some files into the registry

let hub = new HubRegistry(['tasks/*.js']);

// Tell gulp to use the tasks just loaded

gulp.registry(hub);

// File watcher that uses super-fast chokidar and emits vinyl objects.
// Rerun the task when a file changes

gulp.task('watch', () => {
  gulp.watch(PATH.src.pug.allFiles, gulp.series('pug'));
  gulp.watch(PATH.src.postcss.allFiles, gulp.series('postcss'));
  gulp.watch(PATH.src.postcss.files.libs, gulp.series('css:libs'));
  gulp.watch(PATH.src.img.allFiles, gulp.series('img'));
  gulp.watch(PATH.build.js.allFiles).on('change', browsersync.reload);
});

// The build task

gulp.task(
  'build',
  gulp.series(
    'clean',
    gulp.parallel(
      'symbols', 'assets', 'css:libs', 'postcss', 'img', 'webpack', 'fonts'
    ),
    gulp.series('pug')
  )
);

// The default task (called when you run `gulp` from cli)

gulp.task(
  'default',
  gulp.series(
    'clean',
    gulp.parallel(
      'symbols', 'assets', 'css:libs', 'postcss', 'img', 'webpack'
    ),
    gulp.series('pug'),
    gulp.parallel('server', 'watch')
  )
);
