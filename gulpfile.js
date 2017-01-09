var gulp = require('gulp');
var concat = require('gulp-concat');
var watch = require('gulp-watch');

gulp.task('default', function(){
  gulp.src(['js/main.js', 'js/**/*.js'])
  .pipe(concat('bundle.js'))
  .pipe(gulp.dest('./'));
});

gulp.task('watch', function() {
  gulp.start('default');

	watch([
		'js/**/*.js'
	], function() {
		gulp.start('default');
	});
});
