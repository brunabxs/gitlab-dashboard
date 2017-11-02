var gulp = require('gulp');
var rename = require('gulp-rename');
var tasksConfig = require('../tasks.config.js');
var zip = require('gulp-zip');

module.exports = function () {
    var src = gulp.src(tasksConfig.dist_dir + '/**/*');

    if (tasksConfig.browser == 'chrome') {
        src = src.pipe(rename(function (path) {
            path.dirname = 'gitlab-dashboard/' + path.dirname;
        }));
    }

    return src
        .pipe(zip(tasksConfig.zip.filename()))
        .pipe(gulp.dest(tasksConfig.dist_dir));
};
