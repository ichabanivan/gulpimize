import gulp from 'gulp';
import fileInclude from 'gulp-file-include';
import sass from 'gulp-sass';
import postcss from 'gulp-postcss';
import sourcemaps from 'gulp-sourcemaps';
import csso from 'gulp-csso';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import del from 'del';
import imagemin from 'gulp-imagemin';
import environments from 'gulp-environments';

import cssNext from 'postcss-cssnext';
import doIUse from 'doiuse';
import flexBugs from 'postcss-flexbugs-fixes';

import newer from 'gulp-newer';
import watch from 'gulp-watch'; 
import {create as bsCreate} from 'browser-sync';
const browserSync = bsCreate();

let
  development = environments.development,
  production  = environments.production;

const PATH = {
	src: {
		html: './src/*.html',
		scss: './src/scss/**/*.scss',
		img: './src/assets/img/**/*'
	},
	dirs: {
		html: './build/',
		scss: './build/css',
		img: './build/img'
	},
	build: {
		folder: './build'
	}
}

gulp.task('fileInclude', () => {
	return gulp.src(PATH.src.html, {since: gulp.lastRun('fileInclude')})
		.pipe(plumber({
			errorHandler: notify.onError((err) => {
				return {
					title: 'html',
					message: err.message
				}
			})
		}))
		.pipe(newer(PATH.dirs.html))
		.pipe(fileInclude({
			prefix: '@@',
				basepath: '@file'
			}))
		.pipe(gulp.dest(PATH.dirs.html));
});

gulp.task('style', () => {

	let postcssPlugins = [
		cssNext ({
			browsers: ['last 10 versions', '> 0.5%'],
			cascade: false
		}),
		doIUse ({
			browsers: [
				'ie >= 8',
				'> 1%'
			],
			ignore: ['rem'], // an optional array of features to ignore
			ignoreFiles: ['**/normalize.css'], // an optional array of file globs to match against original source file path, to ignore
			onFeatureUsage: function (usageInfo) {
				console.log(usageInfo.message)
			}
		}),
		flexBugs ({
			bug6: false 
		})
	]

	return gulp.src(PATH.src.scss, {since: gulp.lastRun('style')})
		.pipe(plumber({
			errorHandler: notify.onError((err) => {
				return {
					title: 'style',
					message: err.message
				}
			})
		}))
		.pipe(development(sourcemaps.init({loadMaps: true})))
			.pipe(newer(PATH.dirs.scss))
			.pipe(sass({
				outputStyle: 'expanded'
			}))
			.pipe(postcss(postcssPlugins))
			.pipe(production(csso({
				restructure: false,
				sourceMap: true,
				debug: true
			})))
			.pipe(plumber.stop())
		.pipe(development(sourcemaps.write()))
    .pipe(gulp.dest((PATH.dirs.scss)));
});

gulp.task('imageMin', () => {
	return gulp.src(PATH.src.img, {since: gulp.lastRun('imageMin')})
		.pipe(plumber({
			errorHandler: notify.onError((err) => {
				return {
					title: 'img',
					message: err.message
				}
			})
		}))
		.pipe(newer(PATH.dirs.img))
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
		.pipe(gulp.dest(PATH.dirs.img))
});

gulp.task('clean', () => {
	return del(PATH.build.folder, {
		force: true
  })
});

gulp.task('build', gulp.series('clean', gulp.parallel('fileInclude', 'style'), 'imageMin'));

gulp.task('watch', () => {
	gulp.watch(PATH.src.html, gulp.series('fileInclude'));
	gulp.watch(PATH.src.scss, gulp.series('style'));
	gulp.watch(PATH.src.img, gulp.series('imageMin'));
});

gulp.task('serve', () => {
	browserSync.init({
		server: {
			baseDir: PATH.build.folder
		},
    notify: false
	});
})

gulp.task('default', 
	gulp.series('build', gulp.parallel('watch', 'serve'))
);
