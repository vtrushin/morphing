'use strict';

let del = require('del');
let gulp = require('gulp');
let jade = require('gulp-jade');
let sass = require('gulp-sass');
let rollup = require('gulp-rollup');
let babel = require('gulp-babel');
let postcss = require('gulp-postcss');
let autoprefixer = require('autoprefixer');

const src = './src';
const dist = './dist';
const jadePath = src + '/**/*.jade';
const sassPath = src + '/**/*.sass';
const es6Path = [
	src + '/js/morph.js',
	//src + '/js/index.js',
	//src + '/js/calculate-matrix.js'
];
const distCssPath = dist + '/';
const distJsPath = dist + '/js';

gulp.task('default', [
	'clean',
	'jade',
	'styles',
	'es6',
	'jade:watch',
	'styles:watch',
	'es6:watch'
]);

// Delete the dist directory
gulp.task('clean', function(){
	return del([dist + '/*']);
});

gulp.task('jade', function(){
	gulp.src(jadePath)
		.pipe(jade({
			pretty: '\t'
		}))
		.pipe(gulp.dest(dist + '/'));
});

gulp.task('styles', function () {
	gulp.src(sassPath)
		.pipe(sass().on('error', sass.logError))
		.pipe(postcss([autoprefixer]))
		.pipe(gulp.dest(distCssPath));
});

gulp.task('es6', function(){
	console.log(src + '/js/dist.js');
	gulp.src(es6Path)
		.pipe(rollup({
			format: 'iife'
		}))
		.pipe(babel())
		.pipe(gulp.dest(distJsPath))
});

gulp.task('jade:watch', function () {
	gulp.watch(jadePath, ['jade']);
});

gulp.task('styles:watch', function () {
	gulp.watch(sassPath, ['styles']);
});

gulp.task('es6:watch', function () {
	gulp.watch(src + '/js/**/*.js', ['es6']);
});