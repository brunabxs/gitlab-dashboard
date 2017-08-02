var git = require('gulp-git');
var gulp = require('gulp');

module.exports = function () {
    var token = process.env.GH_TOKEN;
    var branch = process.env.TRAVIS_BRANCH;

    git.addRemote('origin-ci', 'https://' + token + '@github.com/brunabxs/gitlab-dashboard.git', function (error) {
        if (error)
            throw error;

        git.push('origin-ci', branch, { args: '--tags' }, function (error) {
            if (error)
                throw error;
        });
    });

};
