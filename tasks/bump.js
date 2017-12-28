var bump = require('gulp-bump');
var gulp = require('gulp');
var tasksConfig = require('../tasks.config.js');

module.exports = function () {
    return gulp.src('./package.json')
        .pipe(bump({ type: tasksConfig.release.type }))
        .pipe(gulp.dest('.'));
};
