var git = require('gulp-git');
var gulp = require('gulp');

module.exports = function () {
    var branch = 'tags/' + process.env.TRAVIS_TAG;

    return git.checkout(branch, function (error) {
        if (error) throw error;
    });
};
