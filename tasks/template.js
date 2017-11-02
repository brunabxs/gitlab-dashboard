var gulp = require('gulp');
var rename = require('gulp-rename');
var tasksConfig = require('../tasks.config.js');
var template = require('gulp-template');

module.exports = function () {
    return gulp.src('app/manifest.template.json')
        .pipe(template({ version: tasksConfig.package.version(), description: tasksConfig.package.description(), manifest_browser_style: tasksConfig.manifest.browser_style }))
        .pipe(rename('manifest.json'))
        .pipe(gulp.dest(tasksConfig.dist_dir));
};
