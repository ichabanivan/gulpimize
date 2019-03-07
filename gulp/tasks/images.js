// Gulp
import plumber from 'gulp-plumber';
import imagemin from 'gulp-imagemin';
import notify from 'gulp-notify';
import gulp from 'gulp';
// PATH
import PATH from '../PATH';

// Task image
export default () => gulp.src(PATH.img.input)
  .pipe(plumber({
    errorHandler: notify.onError(err => ({
      title: 'image',
      message: err.message
    }))
  }))
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
  .pipe(gulp.dest(PATH.img.output));
