var gulp = require('gulp');
var conventionalChangelog = require('gulp-conventional-changelog');

module.exports = function () {
    return gulp.src('CHANGELOG.md')
        .pipe(conventionalChangelog({ preset: 'angular' }))
        .pipe(gulp.dest('.'));
};
