// A fully pluggable tool for identifying and reporting on patterns in JavaScript.

/* eslint no-multi-spaces: ["error", { exceptions: { "VariableDeclarator": true } }] */

const
  gulp     = require('gulp'),                 // The streaming build system
  eslint   = require('gulp-eslint'),          // A fully pluggable tool for identifying and reporting on patterns in JavaScript.
  combine  = require('stream-combiner2').obj, // This is a sequel to [stream-combiner](https://npmjs.org/package/stream-combiner) for streams3.
  gulpIf   = require('gulp-if'),              // Conditionally run a task
  through2 = require('through2').obj,         // A tiny wrapper around Node streams2 Transform to avoid explicit subclassing noise
  fs       = require('fs'),                   // File System

  PATH     = require('../path');

gulp.task('eslint', function () {
  let eslintResults = {};

  // Use '/' instead '\\' on Unix system
  let cacheFilePath = process.cwd() + '\\temp\\lint-cache.json';

  try {
    eslintResults = JSON.parse(fs.readFileSync(cacheFilePath))
  } catch (e) {}

  return gulp.src(PATH.src.js.allFiles, {read: false})
    .pipe(gulpIf(
      function (file) {
        return eslintResults[file.path] && eslintResults[file.path].mtime === file.stat.mtime.toJSON()
      },
      through2(function (file, enc, callback) {
        file.eslint = eslintResults[file.path].eslint;
        callback(null, file)
      }),
      combine(
        through2(function (file, enc, callback) {
          file.contents = fs.readFileSync(file.path);
          callback(null, file)
        }),
        eslint(),
        through2(function (file, enc, callback) {
          eslintResults[file.path] = {
            eslint: file.eslint,
            mtime: file.stat.mtime
          };
          callback(null, file)
        })
      )
    ))
    .pipe(eslint.format())
    .on('end', function () {
      fs.writeFile(cacheFilePath, JSON.stringify((eslintResults)))
    })
});
