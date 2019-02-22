'use strict';

const	gulp			= require ('gulp'),
		fileInclude	= require('gulp-file-include');

gulp.task('fileInclude', function() {
	gulp.src(['./src/*.html'])
		.pipe(fileInclude({
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe(gulp.dest('./build'));
});