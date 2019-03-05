import gulp from 'gulp';
import fileInclude from 'gulp-file-include';
import sass from 'gulp-sass';
import postcss from 'gulp-postcss';
import sourcemaps from 'gulp-sourcemaps';
import csso from 'gulp-csso';
import plumber from 'gulp-plumber';
import rename from 'gulp-rename';
import notify from 'gulp-notify';
import del from 'del';
import imagemin from 'gulp-imagemin';
import environments from 'gulp-environments';
import eslint from 'gulp-eslint';

import cssNext from 'postcss-cssnext';
// import doIUse from 'doiuse';
import flexBugs from 'postcss-flexbugs-fixes';

import newer from 'gulp-newer';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import watch from 'gulp-watch';
import { create } from 'browser-sync';

const browserSync = create();

const { development, production } = environments;

const PATH = {
  src: {
    html: './src/*.html',
    scss: './src/scss/**/*.scss',
    img: './src/assets/img/**/*',
    js: './src/js/**/*.js'
  },
  dirs: {
    html: './build/',
    scss: './build/css',
    img: './build/img',
    js: './build/js'
  },
  build: {
    folder: './build'
  }
};

gulp.task('fileInclude', () => {
  return gulp.src(PATH.src.html, {since: gulp.lastRun('fileInclude')})
    .pipe(plumber({
      errorHandler: notify.onError(err => ({
        title: 'html',
        message: err.message
      }))
    }))
    .pipe(fileInclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest(PATH.dirs.html))
});

gulp.task('style', () => {
  const postcssPlugins = [
    cssNext({
      browsers: ['last 10 versions', '> 0.5%'],
      cascade: false
    }),
    // doIUse ({
    // 	browsers: [
    // 		'ie >= 8',
    // 		'> 1%'
    // 	],
    // 	ignore: ['rem'], // an optional array of features to ignore
    // 	ignoreFiles: ['**/normalize.css'], // an optional array of file globs to match against original source file path, to ignore
    // 	onFeatureUsage: function (usageInfo) {
    // 		console.log(usageInfo.message)
    // 	}
    // }),
    flexBugs({
      bug6: false
    })
  ];

  return gulp.src(PATH.src.scss, {since: gulp.lastRun('style')})
    .pipe(plumber({
      errorHandler: notify.onError(err => ({
        title: 'style',
        message: err.message
      }))
    }))
    .pipe(development(sourcemaps.init({ loadMaps: true })))
    .pipe(sass({
      outputStyle: 'expanded'
    }))
    .pipe(postcss(postcssPlugins))
    .pipe(rename({ suffix: '.min' }))
    .pipe(production(csso({
      restructure: false,
      sourceMap: true,
      debug: true
    })))
    .pipe(plumber.stop())
    .pipe(development(sourcemaps.write()))
    .pipe(gulp.dest((PATH.dirs.scss)))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('scripts', () => {
  return gulp.src(PATH.src.js, {since: gulp.lastRun('scripts')})
    .pipe(plumber({
      errorHandler: notify.onError(err => ({
        title: 'scripts',
        message: err.message
      }))
    }))
    .pipe(development(sourcemaps.init({ loadMaps: true })))
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(concat('all.js'))
    .pipe(production(uglify()))
    .pipe(rename({ suffix: '.min' }))
    .pipe(plumber.stop())
    .pipe(development(sourcemaps.write()))
    .pipe(gulp.dest((PATH.dirs.js)))
    .pipe(browserSync.reload({ stream: true }))
});

gulp.task('imageMin', () => {
  return gulp.src(PATH.src.img, {since: gulp.lastRun('imageMin')})
    .pipe(plumber({
      errorHandler: notify.onError(err => ({
        title: 'img',
        message: err.message
      }))
    }))
    .pipe(newer(PATH.dirs.img))
    .pipe(imagemin([
      imagemin.gifsicle({ interlaced: true }),
      imagemin.jpegtran({ progressive: true }),
      imagemin.optipng({ optimizationLevel: 5 }),
      imagemin.svgo({
        plugins: [
          { removeViewBox: true },
          { cleanupIDs: false }
        ]
      })
    ]))
    .pipe(gulp.dest(PATH.dirs.img))
});

gulp.task('clean', () => del(PATH.build.folder, {
  force: true
}));

gulp.task('eslint', () => {
  return gulp.src(['**/*.js', '!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(eslint.formatEach('compact', process.stderr))
});

gulp.task('eslintFix', () => {
  return gulp.src(['**/*.js', '!node_modules/**'])
    .pipe(eslint({ fix: true }))
    .pipe(eslint.format())
    .pipe(gulp.dest('./'))
});

gulp.task('build', gulp.series('clean', gulp.parallel('fileInclude', 'style', 'scripts'), 'imageMin'));

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
});

gulp.task('default',
  gulp.series('build', gulp.parallel('watch', 'serve')));
