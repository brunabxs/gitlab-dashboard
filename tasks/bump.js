var bump = require('gulp-bump');
var gulp = require('gulp');

module.exports = function () {
    return gulp.src('./package.json')
        .pipe(bump())
        .pipe(gulp.dest('.'));
};
