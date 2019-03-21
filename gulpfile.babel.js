// Tasks
import gulp from 'gulp';
import html from './gulp/tasks/html';
import { libs as scssLibs, style as scssStyle } from './gulp/tasks/scss';
import webpack from './gulp/tasks/webpack';
import images from './gulp/tasks/images';
import clean from './gulp/tasks/clean';
import { lint, fix } from './gulp/tasks/eslint';
import PATH from './gulp/PATH';
import server from './gulp/tasks/server';

// html
gulp.task('html', html);
// scss
gulp.task('scss:libs', scssLibs);
gulp.task('scss:style', scssStyle);
// js
gulp.task('webpack', webpack);
// images
gulp.task('images', images);
// clean
gulp.task('clean', clean);
// eslint
gulp.task('eslint', lint);
gulp.task('eslint:fix', fix);

// build
// without js:libs'
gulp.task('build',
  gulp.series(
    'clean',
    gulp.parallel('html', 'scss:style', 'scss:libs', 'webpack'),
    'images'
  ));

// watch
gulp.task('watch', () => {
  gulp.watch(PATH.html.watch, gulp.series('html'));
  gulp.watch(PATH.scss.style.watch, gulp.series('scss:style'));
  gulp.watch(PATH.scss.libs.watch, gulp.series('scss:libs'));
  gulp.watch(PATH.js.watch, gulp.series('webpack'));
  gulp.watch(PATH.img.watch, gulp.series('images'));
});

// server
gulp.task('serve', server);

// default
gulp.task('default',
  gulp.series('build', gulp.parallel('watch', 'serve')));
