var fs = require('fs');
var gulp = require('gulp');
var rename = require('gulp-rename');
var tasksConfig = require('../tasks.config.js');
var zip = require('gulp-zip');

module.exports = function () {
    var package = JSON.parse(fs.readFileSync('./package.json'));

    return gulp.src(tasksConfig.dist_dir + '/**/*')
        .pipe(rename(function (path) {
            path.dirname = 'gitlab-dashboard/' + path.dirname;
        }))
        .pipe(zip('gitlab-dashboard-' + package.version + '.zip'))
        .pipe(gulp.dest(tasksConfig.dist_dir));
};
