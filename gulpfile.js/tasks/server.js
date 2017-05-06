// Local server

/* eslint no-multi-spaces: ["error", { exceptions: { "VariableDeclarator": true } }] */

const
  gulp        = require('gulp'),         // The streaming build system
  browserSync = require('browser-sync'), // Live CSS Reload & Browser Syncing

  PATH = require('../path');

gulp.task('server', () => {
  browserSync({
    server: {
      baseDir: PATH.build.folder // Run server from this folder
    },
    notify: false // Disable notify in browser
  });
});
