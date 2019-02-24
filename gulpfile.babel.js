'use strict';

import gulp from 'gulp';
import fileInclude from 'gulp-file-include';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import csso from 'gulp-csso';
import plumber from 'gulp-plumber';
import autoprefixer from 'gulp-autoprefixer';
import del from 'del';
import imagemin from 'gulp-imagemin';

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

const imgPath = {
	src: `${dirs.src}/assets/img/**/*`,
	dest: `${dirs.dest}/img`
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
			.pipe(autoprefixer({
				browsers: ['last 2 versions'],
				cascade: false
			}))
			.pipe(csso({
				restructure: false,
				sourceMap: true,
				debug: true
			}))
			.pipe(plumber.stop())
		.pipe(sourcemaps.write())
    .pipe(gulp.dest((scssPath.dest)));
});

gulp.task('imageMin', () =>
	gulp.src(imgPath.src)
	.pipe(imagemin([
		imagemin.gifsicle({interlaced: true}),
		imagemin.jpegtran({progressive: true}),
		imagemin.optipng({optimizationLevel: 5}),
		imagemin.svgo({
			plugins: [
					{removeViewBox: true},
					{cleanupIDs: false}
			]
		})
	]))
	.pipe(gulp.dest(imgPath.dest))
);

gulp.task('clean', () => {
	return del(['build']);
});

gulp.task('default', gulp.series('clean', gulp.parallel('fileInclude', 'style'), 'imageMin'));

// what is it for

// gulp.task('sass:watch', () => {
//   gulp.watch(scssPath.src, ['sass']);
// });
