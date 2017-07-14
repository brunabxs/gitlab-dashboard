module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        template: grunt.file.readJSON('tasks-config/template.json'),

        compress: grunt.file.readJSON('tasks-config/compress.json'),

        publish_webstore_clientid: process.env.CLIENT_ID,
        publish_webstore_clientsecret: process.env.CLIENT_SECRET,
        publish_webstore_code: process.env.CODE,
        publish_webstore_appid: process.env.APP_ID,
        publish_webstore_accesstoken: process.env.ACCESS_TOKEN,
        publish_webstore_refreshtoken: process.env.REFRESH_TOKEN,
        publish_webstore: grunt.file.readJSON('tasks-config/publish_webstore.json'),

        jshint: {
            all: ['**/*.js', '!node_modules/**', '!app/libs/**']
        },

        bump: grunt.file.readJSON('tasks-config/bump.json'),

        // TODO: apply minify
        // TODO: apply uglify
        // TODO: analyze package.json to create libs folder
    });

    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-template');
    grunt.loadTasks('tasks');

    grunt.registerTask('build', ['jshint', 'template', 'compress']);
    grunt.registerTask('publish', ['publish_webstore']);

    grunt.registerTask('release', 'Build, bump and publish to Webstore', function (type) {
        grunt.task.run([
            'bump:' + (type || 'patch') + ':bump-only',
            'build',
            'bump-commit',
            //'publish',
        ]);
    });
};