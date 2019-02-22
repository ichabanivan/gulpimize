'use strict';

const	gulp			= require ('gulp'),
		fileInClude	= require('gulp-file-include');

gulp.task('fileinclude', function() {
	gulp.src(['index.html'])
		.pipe(fileInClude({
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe(gulp.dest('./build'));
});