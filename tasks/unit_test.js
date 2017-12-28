var gulp = require('gulp');
var jasmineNode = require('gulp-jasmine-node');

module.exports = function () {
    return gulp.src(['specs/**/*spec.js'])
        .pipe(jasmineNode({
            timeout: 10000
        }));
};