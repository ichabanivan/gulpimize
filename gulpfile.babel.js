'use strict';
// TODO: Please, Remove line above
import gulp from 'gulp';
import fileInclude from 'gulp-file-include';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import csso from 'gulp-csso';
import plumber from 'gulp-plumber';
import autoprefixer from 'gulp-autoprefixer';
import del from 'del';
import imagemin from 'gulp-imagemin';

// TODO: Please use gulp-plumber
/*
.pipe(plumber({
	errorHandler: notify.onError((err) => {
		return {
			title: 'sass',
			message: err.message
		}
	})
}))
*/

// TODO: Please make 1 object with nested properties
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

// TODO: Please add postcss after sass
// TODO: Please use autoprefixer like postcss plugin

gulp.task('style', () => {
  return gulp.src(scssPath.src)
		.pipe(sourcemaps.init({loadMaps: true})) // TODO: Please add environments and use this line only if it is development
			.pipe(plumber())
			.pipe(sass().on('error', sass.logError)) // Todo: Change to gulp plumber, you've forgotten about settings for sass outputStyle: 'expanded'
			.pipe(autoprefixer({ // please use
				browsers: ['last 2 versions'], // ['last 10 versions', '> 0.5%']
				cascade: false
			}))
			.pipe(csso({ // TODO: Please add environments and use this line only if it is production
				restructure: false,
				sourceMap: true,
				debug: true
			}))
			.pipe(plumber.stop())
		.pipe(sourcemaps.write())
    .pipe(gulp.dest((scssPath.dest)));
});

// TODO: Please, read about gulp-newer
// TODO: You forgot about browserSync
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

/* TODO:
  return del(PATH.build.folder, {
    force: true
  })
*/
gulp.task('clean', () => {
	return del(['build']);
});

gulp.task('default', gulp.series('clean', gulp.parallel('fileInclude', 'style'), 'imageMin'));

// what is it for

// gulp.task('sass:watch', () => {
//   gulp.watch(scssPath.src, ['sass']);
// });
