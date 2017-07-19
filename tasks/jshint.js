var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jshintStylish = require('jshint-stylish');

module.exports = function () {
    return gulp.src(['**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter(jshintStylish));
};
