const gulp = require('gulp');
const del = require('del');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const typescript = require('gulp-typescript');
const tscConfig = require('./tsconfig.json');

// Clean the contents of the distribution directory
gulp.task('clean', function() {
	return del('dist/**/*');
});

// TypeScript compile
gulp.task('compile', function() {
	return gulp
		.src(['app/**/*.ts', 'typings/**/*.ts'])
		.pipe(sourcemaps.init())
		.pipe(typescript(tscConfig.compilerOptions))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist/app'));
});

// Copy dependencies
gulp.task('copy:libs', function() {
	return gulp.src([
		'node_modules/core-js/client/shim.min.js',
		'node_modules/zone.js/dist/zone.js',
		'node_modules/reflect-metadata/Reflect.js',
		'node_modules/systemjs/dist/system.src.js'
	])
	.pipe(gulp.dest('dist/lib'));
});

// Copy static assets - i.e. non TypeScript compiled source
gulp.task('copy:assets', function() {
	return gulp.src(['app/**/*', 'index.html', '!app/**/*.ts', '!app/**/*.scss'], { base: './' })
		.pipe(gulp.dest('dist'));
});

// Compile Sass
gulp.task('sass', function() {
	return gulp.src('app/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('dist/app'));
});

gulp.task('build', ['compile', 'sass', 'copy:libs', 'copy:assets']);
gulp.task('default', ['clean'], function() {
	gulp.run('build');
});
