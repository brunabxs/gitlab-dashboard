var browserify = require('browserify');
var buffer = require('gulp-buffer');
var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var stream = require('event-stream');
var tap = require('gulp-tap');
var tasksConfig = require('../tasks.config.js');
var uglify = require('gulp-uglify');

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
        gulp.src('node_modules/bootstrap-validator/dist/validator.min.js')
            .pipe(gulp.dest(tasksConfig.dist_dir + '/scripts')),
        gulp.src('app/views/scripts/*.js')
            .pipe(tap(function (file) {
                file.contents = browserify(file.path, {
                    debug: true,
                    insertGlobalVars: {
                        GA_ID: function (file, dir) { return JSON.stringify('UA-112412081-1'); },
                        VERSION: function (file, dir) { return JSON.stringify(tasksConfig.package.version()); },
                        BROWSER: function (file, dir) { return JSON.stringify(tasksConfig.browser); },
                        LOG_TYPE: function (file, dir) { return JSON.stringify(tasksConfig.log.type()); },
                    },
                }).bundle();
            }))
            .pipe(buffer())
            // .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(uglify({ mangle: false }))
            // .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(tasksConfig.dist_dir + '/scripts'))
    );
};