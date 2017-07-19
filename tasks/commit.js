var fs = require('fs');
var git = require('gulp-git');
var gulp = require('gulp');

module.exports = function () {
    var package = JSON.parse(fs.readFileSync('./package.json'));

    return gulp.src('.')
        .pipe(git.commit('Release v' + package.version));
};
