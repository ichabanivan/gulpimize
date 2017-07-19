// Clear the cache

/* eslint no-multi-spaces: ["error", { exceptions: { "VariableDeclarator": true } }] */

const
  gulp  = require('gulp'),       // The streaming build system
  cache = require('gulp-cache'); // A cache proxy plugin for Gulp

gulp.task('cache', () => {
  return new Promise((resolve, reject) => {
    cache.clearAll();
    resolve()
  })
});
