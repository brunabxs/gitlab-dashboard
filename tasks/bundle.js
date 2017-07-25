var gulp = require('gulp');
var sass = require('gulp-sass');
var stream = require('event-stream');
var tasksConfig = require('../tasks.config.js');
var webpack = require('gulp-webpack');
var webpackConfig = require('../webpack.config.js');


module.exports = function () {
    return stream.merge(
        gulp.src(['app/**/icons/*.png'])
            .pipe(gulp.dest(tasksConfig.dist_dir)),
        gulp.src('app/views/styles/*.scss')
            .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
            .pipe(gulp.dest(tasksConfig.dist_dir)),
        gulp.src('')
            .pipe(webpack(webpackConfig))
            .pipe(gulp.dest(tasksConfig.dist_dir))
    );
};