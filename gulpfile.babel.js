'use strict';

import gulp from 'gulp';
import fileInclude from 'gulp-file-include';

const dirs = {
	src: 'src',
	dest: 'build'
 };

 const path = {
	src: `${dirs.src}/*.html`,
	dest: `${dirs.dest}/`
 };

gulp.task('fileInclude', () => {
  return gulp.src(path.src)
    .pipe(fileInclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest(path.dest));
});