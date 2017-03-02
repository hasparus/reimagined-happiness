'use strict';
/*jslint node: true */

var gulp = require('gulp');
var concat = require("gulp-concat");

// CSS
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');

// JS
var uglify = require('gulp-uglify');
var pump = require('pump');
var babel = require("gulp-babel");
 
var sassfiles = './.sass/**/*.scss';

//gulp.task('sass', function () {
//  return gulp.src(sassfiles)
//    .pipe(sass.sync().on('error', sass.logError))
//    .pipe(gulp.dest('./css'));
//});
//
//gulp.task('autoprefixer', ['sass'], () =>
//  gulp.src('css/main.css').pipe(
//    autoprefixer({
//      browsers: ['last 2 versions'],
//      cascade: false
//    }))
//    .pipe(gulp.dest('./css'))
// );

// gulp.task('uglify-js', function (cb) {
//   pump([
//         gulp.src('js/*.js'),
//         // sourcemaps.init(),
//         // babel(),
//         // uglify(),
//         // concat('main.min.js'),
//         // sourcemaps.write(),
//         gulp.dest('js')
//     ],
//     cb
//   );
// });

gulp.task('process-css', () => {
  return gulp.src(sassfiles)
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compact'})/*sync()*/.on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./css'));
}); // use pump instead of pipes?

gulp.task('watch', () => {
  gulp.watch(sassfiles, ['process-css']);
  // gulp.watch('js/main.js', ['uglify-js']);
});
