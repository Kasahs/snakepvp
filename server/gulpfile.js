var gulp = require('gulp');
var ts = require('gulp-typescript');
var gutil = require('gulp-util');


var tsProject = ts.createProject('./tsconfig.json');

gulp.task('ts', function () {
    return tsProject.src()
        .pipe(tsProject()).js
        .pipe(gulp.dest('./dist'));
});