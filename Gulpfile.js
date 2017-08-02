var bump = require('./tasks/bump.js');
var bundle = require('./tasks/bundle.js');
var changelog = require('./tasks/changelog.js');
var checkout = require('./tasks/checkout.js');
var checkoutTag = require('./tasks/checkout-tag.js');
var clean = require('./tasks/clean.js');
var commit = require('./tasks/commit.js');
var gulp = require('gulp');
var jshint = require('./tasks/jshint.js');
var publishWebstore = require('./tasks/publish_webstore.js');
var push = require('./tasks/push.js');
var runSequence = require('run-sequence').use(gulp);
var tag = require('./tasks/tag.js');
var template = require('./tasks/template.js');
var zip = require('./tasks/zip.js');

gulp.task('bump', bump);
gulp.task('bundle', bundle);
gulp.task('changelog', changelog);
gulp.task('checkout', checkout);
gulp.task('checkout-tag', checkoutTag);
gulp.task('clean', clean);
gulp.task('commit', commit);
gulp.task('lint', jshint);
gulp.task('publish-webstore', publishWebstore);
gulp.task('push', push);
gulp.task('tag', tag);
gulp.task('template', template);
gulp.task('zip', zip);

gulp.task('build', function (callback) {
    runSequence('clean', 'lint', 'template', 'bundle', callback);
});

gulp.task('package', function (callback) {
    runSequence('build', 'zip', callback);
});

gulp.task('release-ci', function (callback) {
    runSequence('bump', 'package', 'changelog', 'checkout', 'commit', 'tag', 'push', callback);
});

gulp.task('release', function (callback) {
    runSequence('bump', 'package', 'changelog', 'commit', 'tag', callback);
});

gulp.task('publish-ci', function (callback) {
    runSequence('checkout-tag', 'package', 'publish-webstore', callback);
});

gulp.task('publish', function (callback) {
    runSequence('package', 'publish-webstore', callback);
});