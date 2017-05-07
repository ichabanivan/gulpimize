// Deleting folder 'dist'

/* eslint no-multi-spaces: ["error", { exceptions: { "VariableDeclarator": true } }] */

const
  gulp = require('gulp'), // The streaming build system
  del  = require('del'),  // Delete files and folders

  PATH = require('../path');

gulp.task('clean', () => {
  return del(PATH.build.folder, {
    force: true
  })
});
