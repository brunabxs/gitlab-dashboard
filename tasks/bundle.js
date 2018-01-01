var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var sass = require('gulp-sass');
var stream = require('event-stream');
var tasksConfig = require('../tasks.config.js');
var webpack = require('webpack-stream');
var webpackConfig = require('../webpack.config.js');

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
            .pipe(gulp.dest(tasksConfig.dist_dir + '/styles')),
        gulp.src('app/views/templates/*.html')
            .pipe(htmlmin(htmlminConfig))
            .pipe(gulp.dest(tasksConfig.dist_dir)),
        gulp.src('node_modules/bootstrap-sass/assets/fonts/**/*.*')
            .pipe(gulp.dest(tasksConfig.dist_dir + '/fonts')),
        gulp.src('node_modules/jquery/dist/jquery.min.js')
            .pipe(gulp.dest(tasksConfig.dist_dir + '/scripts')),
        gulp.src('node_modules/bootstrap-sass/assets/javascripts/bootstrap.min.js')
            .pipe(gulp.dest(tasksConfig.dist_dir + '/scripts')),
        gulp.src('node_modules/bootstrap-select-sass/dist/js/bootstrap-select.min.js')
            .pipe(gulp.dest(tasksConfig.dist_dir + '/scripts')),
        gulp.src('.')
            .pipe(webpack(webpackConfig))
            .pipe(gulp.dest(tasksConfig.dist_dir))
    );
};