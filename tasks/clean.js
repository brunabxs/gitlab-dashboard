var clean = require('gulp-clean');
var gulp = require('gulp');
var tasksConfig = require('../tasks.config.js');

module.exports = function () {
    return gulp.src(tasksConfig.dist_dir)
        .pipe(clean());
};
