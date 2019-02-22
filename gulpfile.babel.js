'use strict';

import gulp from 'gulp';
import fileInclude from 'gulp-file-include';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import csso from 'gulp-csso';
import plumber from 'gulp-plumber';

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
 
gulp.task('style', () => {
  return gulp.src(scssPath.src)
		.pipe(sourcemaps.init({loadMaps: true}))
			.pipe(plumber())
			.pipe(sass().on('error', sass.logError))
			.pipe(csso({
				restructure: false,
				sourceMap: true,
				debug: true
			}))
			.pipe(plumber.stop())
		.pipe(sourcemaps.write())
    .pipe(gulp.dest((scssPath.dest)));
});
 

// what is it for

// gulp.task('sass:watch', () => {
//   gulp.watch(scssPath.src, ['sass']);
// });