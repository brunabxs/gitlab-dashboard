var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var sass = require('gulp-sass');
var stream = require('event-stream');
var tasksConfig = require('../tasks.config.js');
var webpack = require('webpack-stream');
var webpackConfig = require('../webpack.config.js');

var path = require('path');

var htmlminConfig = {};
if (tasksConfig.environment.isProd()) {
    htmlminConfig = {
        collapseWhitespace: true,
        conservativeCollapse: true,
        html5: true,
        minifyCss: true,
        minifyJs: true,
        minifyURLs: true,
        useShortDoctype: true,
        sortAttributes: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
    };
}

module.exports = function () {
    return stream.merge(
        gulp.src(['app/**/icons/*.png'])
            .pipe(gulp.dest(tasksConfig.dist_dir)),
        gulp.src('app/views/styles/*.scss')
            .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
            .pipe(gulp.dest(tasksConfig.dist_dir)),
        gulp.src('app/views/templates/*.html')
            .pipe(htmlmin(htmlminConfig))
            .pipe(gulp.dest(tasksConfig.dist_dir)),
        gulp.src('app/views/fonts/**')
            .pipe(gulp.dest(tasksConfig.dist_dir + '/fonts')),
        gulp.src('app/views/styles/**/*.css')
            .pipe(gulp.dest(tasksConfig.dist_dir)),
        gulp.src('app/views/scripts/**/*.js')
            .pipe(gulp.dest(tasksConfig.dist_dir)),
        gulp.src('.')
            .pipe(webpack(webpackConfig))
            .pipe(gulp.dest(tasksConfig.dist_dir))
    );
};