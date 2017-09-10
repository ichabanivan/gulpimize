// gulpfile.js

'use strict';

/* eslint no-multi-spaces: ["error", { exceptions: { "VariableDeclarator": true } }] */

const
  gulp         = require('gulp'), // The streaming build system
  HubRegistry  = require('gulp-hub'), // A gulp plugin to run tasks from multiple gulpfiles

  PATH = require('./gulp/path.js'); // Path config structure

// Load some files into the registry

let hub = new HubRegistry(['gulp/tasks/*.js']);

// Tell gulp to use the tasks just loaded

gulp.registry(hub);

// File watcher that uses super-fast chokidar and emits vinyl objects.
// Rerun the task when a file changes

gulp.task('watch', () => {
  gulp.watch(PATH.src.img.svg, gulp.series('symbols'));
  gulp.watch(PATH.src.pug.allFiles, gulp.series('pug'));
  gulp.watch(PATH.src.sass.allFiles, gulp.series('sass'));
  gulp.watch(PATH.src.sass.files.libs, gulp.series('libs-css'));
  gulp.watch(PATH.src.img.allFiles, gulp.series('img'));
  gulp.watch(PATH.src.js.allFiles, gulp.series('webpack'));
  gulp.watch(PATH.src.assets.allFiles, gulp.series('files'));
  gulp.watch(PATH.src.favicon.allFiles, gulp.series('favicon'));
});

// The build task

gulp.task(
  'build',
  gulp.series(
    'clean',
    gulp.parallel(
      'symbols', 'assets', 'sass', 'libs-css', 'img', 'webpack'
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
      'symbols', 'assets', 'sass', 'libs-css', 'img', 'webpack'
    ),
    gulp.series('pug'),
    gulp.parallel('server', 'watch')
  )
);
