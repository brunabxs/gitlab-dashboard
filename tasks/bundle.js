var cleanCSS = require('gulp-clean-css');
var stream = require('event-stream');
var gulp = require('gulp');
var tasksConfig = require('../tasks.config.js');
var webpack = require('gulp-webpack');
var webpackConfig = require('../webpack.config.js');


module.exports = function () {
    return stream.merge(
        gulp.src(['app/**/icons/*.png'])
            .pipe(gulp.dest(tasksConfig.dist_dir)),
        gulp.src('app/views/styles/*.css')
            .pipe(cleanCSS({compatibility: 'ie8'}))
            .pipe(gulp.dest(tasksConfig.dist_dir)),
        gulp.src('')
            .pipe(webpack(webpackConfig))
            .pipe(gulp.dest(tasksConfig.dist_dir))
    );
};