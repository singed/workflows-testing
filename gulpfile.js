var gulp = require('gulp'),
gulputil = require('gulp-util'),
coffee = require('gulp-coffee'),
browserify = require('gulp-browserify'),
compass = require('gulp-compass'),
connect = require('gulp-connect'),
concat = require('gulp-concat'),
gulpif = require('gulp-if'),
minifyHTML = require('gulp-minify-html'),
uglify = require('gulp-uglify');

var env,
coffeeSources,
jsSources,
sassSources,
htmlSources,
outputDir,
sassStyle;

env = process.env.NODE_ENV || 'development';

if (env === 'development')
{
	outputDir = 'builds/development';
	sassStyle = 'expanded';
}
else
{
	outputDir = 'builds/production';
	sassStyle = 'compressed';
}

coffeeSources = ['components/coffee/*.coffee'];
jsSources = [
	'components/scripts/rclick.js',
	'components/scripts/pixgrid.js',
	'components/scripts/tagline.js',
	'components/scripts/template.js'
];
sassSources = ['components/sass/style.scss'];
htmlSources = [outputDir+'*.html'];

gulp.task('coffee', function() {
	gulp.src(coffeeSources)
	.pipe(coffee({bare:true})
		.on('error', gulputil.log))
	.pipe(gulp.dest('components/scripts'))
});

gulp.task('js', function(){
	gulp.src(jsSources)
	.pipe(concat('script.js'))
	.pipe(browserify())
	.pipe(gulpif(env === 'production', uglify()))
	.pipe(gulp.dest(outputDir+'/js'))
	.pipe(connect.reload())
});

gulp.task('compass', function(){
	gulp.src(sassSources)
	.pipe(compass({
		sass:'components/sass',
		image:outputDir+'/images',
		style:sassStyle
	}))
	.on('error', gulputil.log)
	.pipe(gulp.dest(outputDir+'/css'))
	.pipe(connect.reload())
})

gulp.task('watch', function(){
	gulp.watch(coffeeSources, ['coffee']);
	gulp.watch(jsSources, ['js']);
	gulp.watch('builds/development/*.html', ['html']);
	gulp.watch('components/sass/*.scss', ['compass']);
});

gulp.task('connect', function(){
	connect.server({
		root:outputDir+'/',
		livereload:true
	});

});

gulp.task('html', function(){
	gulp.src('builds/development/*.html')
	.pipe(gulpif(env === 'production', minifyHTML()))
	.pipe(gulpif(env === 'production', gulp.dest(outputDir)))
	.pipe(connect.reload())

});

gulp.task('default', ['html', 'coffee', 'js', 'compass', 'connect', 'watch']);