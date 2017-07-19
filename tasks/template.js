var fs = require('fs');
var gulp = require('gulp');
var rename = require('gulp-rename');
var tasksConfig = require('../tasks.config.js');
var template = require('gulp-template');

module.exports = function () {
    var package = JSON.parse(fs.readFileSync('./package.json'));

    return gulp.src('app/manifest.template.json')
        .pipe(template({ version: package.version, description: package.description }))
        .pipe(rename('manifest.json'))
        .pipe(gulp.dest(tasksConfig.dist_dir));
};
