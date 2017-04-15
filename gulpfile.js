'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var gulpCopy = require('gulp-copy');
var rimraf = require('rimraf');
var runSequence = require('run-sequence');

var SASS = {
  ORIGINAL: './public/sass/**/*.sass',
  COMPILED: './dist/css'
}

var JS = {
  ORIGINAL: './public/js/**/*.js',
  COMPILED: './dist/js'
}

var IMAGES = {
  ORIGINAL: './public/img/**/*.{png,jpeg,ico,jpg,gif}',
  COMPILED: './dist/img'
}

gulp.task('sass:dev', function () {
  return gulp.src(SASS.ORIGINAL)
  .pipe(sourcemaps.init())
  .pipe(sass({
      outputStyle: 'compressed',
     includePaths: [
     './node_modules/susy/sass/susy/language',
     './node_modules/breakpoint-sass/stylesheets'
     ]
 }).on('error', sass.logError))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(SASS.COMPILED));
});

gulp.task('sass:prod', function () {
  return gulp.src(SASS.ORIGINAL)
  .pipe(sass({
    outputStyle: 'compressed',
    includePaths: [
    './node_modules/susy/sass/susy/language',
    './node_modules/breakpoint-sass/stylesheets'
    ]      
  }).on('error', sass.logError))
  .pipe(gulp.dest(SASS.COMPILED));
});

gulp.task('js:dev', function() {
  return gulp.src(JS.ORIGINAL)
  .pipe(uglify({
    mangle: false,
    compress: false,
    preserveComments: 'all',
    beautify: true,
    indent_level: 2
  }))
  .pipe(gulp.dest(JS.COMPILED));
});

gulp.task('js:prod', function() {
  return gulp.src(JS.ORIGINAL)
  .pipe(uglify())
  .pipe(gulp.dest(JS.COMPILED));
});

gulp.task('watch', ['clean', 'sass:dev', 'js:dev', 'images', 'copy'], function () {
  gulp.watch(SASS.ORIGINAL, ['sass:dev']);
  // gulp.watch(JS.ORIGINAL, ['js:dev']);
  // gulp.watch(IMAGES.ORIGINAL, ['images']);
});

gulp.task('images', function () {
  return gulp.src(IMAGES.ORIGINAL)
  .pipe(imagemin({
    progressive: true,
    svgoPlugins: [{removeViewBox: false}],
    use: [pngquant()]
  }))
  .pipe(gulp.dest(IMAGES.COMPILED));
});

gulp.task('copy', function() {
  gulp.src('./public/font/*')
  .pipe(gulpCopy('./dist/font', {prefix:3}));

  gulp.src('./public/swf/**/*')
  .pipe(gulpCopy('./dist/swf', {prefix:2}));    

  return gulp.src('./public/img/*.pdf')
  .pipe(gulpCopy(IMAGES.COMPILED, {prefix:3}));    
});

gulp.task('clean', function (cb) {
  rimraf('./dist', { force: true }, cb);
});

gulp.task('build', function() {
  runSequence(
    'clean', 
    ['sass:prod', 'js:prod', 'images', 'copy']
  );
});

