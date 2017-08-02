var git = require('gulp-git');
var gulp = require('gulp');

module.exports = function () {
    var branch = process.env.TRAVIS_BRANCH;

    return git.checkout(branch, function (error) {
        if (error) throw error;
    });
};
