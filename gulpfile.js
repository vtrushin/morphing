'use strict';
require('es6-promise').polyfill();

let del = require('del');
let gulp = require('gulp');
let jade = require('gulp-jade');
let sass = require('gulp-sass');
let rollup = require('gulp-rollup');
let babel = require('gulp-babel');
let postcss = require('gulp-postcss');
let autoprefixer = require('autoprefixer');
let handleErrors = require("./utils/handleErrors");
let runSequence = require('run-sequence');

const src = './src';
const dist = './dist';
const jadePath = src + '/**/*.jade';
const sassPath = src + '/**/*.sass';
const es6Path = [
	src + '/js/morph.js'
	//src + '/js/index.js',
	//src + '/js/calculate-matrix.js'
];
const distCssPath = dist + '/';
const distJsPath = dist + '/js';

gulp.task('default', [
	'watch'
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
		.on('error', handleErrors)
		.pipe(gulp.dest(dist + '/'));
});

gulp.task('styles', function () {
	let processors = [
		autoprefixer(/*{ cascade: true }*/)
	];
	gulp.src(sassPath)
		.pipe(sass()
			.on('error', handleErrors)
		)
		.pipe(postcss(processors))
		.pipe(gulp.dest(distCssPath));
});

gulp.task('es6', function(){
	gulp.src(es6Path)
		.pipe(rollup(/*{
			format: 'iife'
		}*/))
		.pipe(babel())
		.on('error', handleErrors)
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

gulp.task('watch', function (done) {
	return runSequence('build', function () {
		gulp.watch(jadePath, ['jade']);
		gulp.watch(sassPath, ['styles']);
		gulp.watch(src + '/js/**/*.js', ['es6']);
		done();
	});
});

// build task
gulp.task("build", function (done) {
	return runSequence("clean", ["jade", "styles", "es6"], done);
});