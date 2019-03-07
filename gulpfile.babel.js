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
import w3cjs from 'gulp-w3cjs';
import flexBugs from 'postcss-flexbugs-fixes';
import postcssPresetEnv from 'postcss-preset-env';
import newer from 'gulp-newer';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
// import watch from 'gulp-watch';
import { create } from 'browser-sync';
import babelrc from './.babelrc';

const browserSync = create();

const { development, production } = environments;

const src = './src';
const build = './build';

const PATH = {
  html: {
    input: [`${src}/*.html`],
    output: [build],
    watch: [`${src}/*.html`, `${src}/html/*.html`]
  },
  scss: {
    style: {
      input: [`${src}/scss/pages/*.scss`],
      output: [`${build}/css`],
      watch: [`${src}/scss/**/*.scss`, `!${src}/scss/libs.scss`]
    },
    libs: {
      input: [`${src}/scss/libs.scss`],
      output: [`${build}/css`],
      watch: [`${src}/scss/libs.scss`]
    }
  },
  img: {
    input: [`${src}/assets/img/**/*`],
    output: [`${build}/img`],
    watch: [`${src}/assets/img/**/*`],
    folder: [`${src}/assets/img`]
  },
  js: {
    all: [`${src}/js/**/*.js`],
    main: {
      input: [`${src}/js/pages/*.js`],
      output: [`${build}/js`],
      watch: [`${src}/js/**/*.js`, `!${src}/js/libs.js`]
    },
    libs: {
      input: [`${src}/js/libs.js`],
      output: [`${build}/js`],
      watch: [`${src}/js/libs.js`]
    }
  }
};

gulp.task('html', () => gulp.src(PATH.html.input)
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
  .pipe(w3cjs())
  .pipe(gulp.dest(PATH.html.output))
  .pipe(browserSync.reload({ stream: true })));

gulp.task('scss:libs', () => gulp.src(PATH.scss.libs.input)
  .pipe(plumber({
    errorHandler: notify.onError(err => ({
      title: 'scss:libs',
      message: err.message
    }))
  }))
  .pipe(sass({
    outputStyle: 'expanded'
  }))
  .pipe(rename({ suffix: '.min' }))
  .pipe(production(csso({
    restructure: false,
    sourceMap: true,
    debug: true
  })))
  .pipe(plumber.stop())
  .pipe(gulp.dest((PATH.scss.libs.output)))
  .pipe(browserSync.reload({ stream: true })));

gulp.task('scss:style', () => {
  const plugins = [
    postcssPresetEnv({
      // stage: 3,
      // features: {
      //   'nesting-rules': true
      // },
      // autoprefixer: { grid: true }
      browsers: [
        '>0.05%',
        'not dead',
        'not ie <= 11',
        'not op_mini all'
      ]
    }),
    flexBugs({
      bug6: false
    })
  ];

  return gulp.src(PATH.scss.style.input)
    .pipe(plumber({
      errorHandler: notify.onError(err => ({
        title: 'scss:style',
        message: err.message
      }))
    }))
    .pipe(development(sourcemaps.init({ loadMaps: true })))
    .pipe(sass({
      outputStyle: 'expanded'
    }))
    .pipe(postcss(plugins))
    .pipe(rename({ suffix: '.min' }))
    .pipe(production(csso({
      restructure: false,
      sourceMap: true,
      debug: true
    })))
    .pipe(development(sourcemaps.write()))
    .pipe(plumber.stop())
    .pipe(gulp.dest((PATH.scss.style.output)))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('js:libs', () => gulp.src(PATH.js.libs.input)
  .pipe(plumber({
    errorHandler: notify.onError(err => ({
      title: 'js:libs',
      message: err.message
    }))
  }))
  .pipe(babel(babelrc))
  .pipe(production(uglify()))
  .pipe(rename({ suffix: '.min' }))
  .pipe(gulp.dest((PATH.js.libs.output)))
  .pipe(plumber.stop())
  .pipe(browserSync.reload({ stream: true })));

gulp.task('js:main', () => gulp.src(PATH.js.main.input)
  .pipe(plumber({
    errorHandler: notify.onError(err => ({
      title: 'js:main',
      message: err.message
    }))
  }))
  .pipe(development(sourcemaps.init({ loadMaps: true })))
  .pipe(babel(babelrc))
  .pipe(production(uglify()))
  .pipe(rename({ suffix: '.min' }))
  .pipe(development(sourcemaps.write()))
  .pipe(plumber.stop())
  .pipe(gulp.dest((PATH.js.main.output)))
  .pipe(browserSync.reload({ stream: true })));

gulp.task('image', () => gulp.src(PATH.img.input, { since: gulp.lastRun('image') })
  .pipe(plumber({
    errorHandler: notify.onError(err => ({
      title: 'image',
      message: err.message
    }))
  }))
  // .pipe(newer(PATH.img.folder)) // todo | Check
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
  .pipe(gulp.dest(PATH.img.output)));

gulp.task('clean', () => del(build, {
  force: true
}));

gulp.task('eslint', () => gulp.src(PATH.js.all)
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError())
  .pipe(eslint.formatEach('compact', process.stderr)));

gulp.task('eslint:fix', () => gulp.src(PATH.js.all)
  .pipe(eslint({ fix: true }))
  .pipe(eslint.format())
  .pipe(gulp.dest(PATH.js.all)));

gulp.task('build',
  gulp.series(
    'clean',
    gulp.parallel('html', 'scss:style', 'scss:libs', 'js:main', 'js:libs'),
    'image'
  ));

gulp.task('watch', () => {
  gulp.watch(PATH.html.watch, gulp.series('html'));
  gulp.watch(PATH.scss.style.watch, gulp.series('scss:style'));
  gulp.watch(PATH.scss.libs.watch, gulp.series('scss:libs'));
  gulp.watch(PATH.js.main.watch, gulp.series('js:main'));
  gulp.watch(PATH.js.libs.watch, gulp.series('js:libs'));
  gulp.watch(PATH.img.watch, gulp.series('image'));
});

gulp.task('serve', () => {
  browserSync.init({
    server: {
      baseDir: build
    },
    notify: false
  });
});

gulp.task('default',
  gulp.series('build', gulp.parallel('watch', 'serve')));
