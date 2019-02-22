'use strict';

import gulp from 'gulp';
import fileInclude from 'gulp-file-include';
import sass from 'gulp-sass';

const dirs = {
	src: 'src',
	dest: 'build'
 };

const htmlPath = {
	src: `${dirs.src}/*.html`,
	dest: `${dirs.dest}/`
};

const scssPath = {
	src: `${dirs.src}/scss/**/*.scss`,
	dest: `${dirs.dest}/css`
};

gulp.task('fileInclude', () => {
  return gulp.src(htmlPath.src)
    .pipe(fileInclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest(htmlPath.dest));
});
 
gulp.task('scss', () => {
  return gulp.src(scssPath.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest((scssPath.dest)));
});
 
gulp.task('sass:watch', () => {
  gulp.watch(scssPath.src, ['sass']);
});