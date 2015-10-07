var gulp = require('gulp'),
	gulputil = require('gulp-util'),
	coffee = require('gulp-coffee');

var coffeeSources = ['components/coffee/*.coffee'];

gulp.task('coffee', function() {
	gulp.src(coffeeSources)
	  .pipe(coffee({bare:true})
	  	.on('error', gulputil.log))
	  .pipe(gulp.dest('components/scripts'))
});