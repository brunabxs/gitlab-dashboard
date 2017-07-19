var gulp = require('gulp');
var tagVersion = require('gulp-tag-version');

module.exports = function (options) {
    return gulp.src(['./package.json'])
        .pipe(tagVersion());
};
