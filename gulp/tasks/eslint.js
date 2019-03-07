// Gulp
import eslint from 'gulp-eslint';
import gulp from 'gulp';
// PATH
import PATH from '../PATH';

// Task eslint
export const lint = () => gulp.src(PATH.js.all)
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError())
  .pipe(eslint.formatEach('compact', process.stderr));

// Task eslint:fix
export const fix = () => gulp.src(PATH.js.all)
  .pipe(eslint({ fix: true }))
  .pipe(eslint.format())
  .pipe(gulp.dest(PATH.js.all));
