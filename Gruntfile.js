module.exports = function(grunt) {
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
    });

    grunt.loadNpmTasks('grunt-template');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadTasks('tasks');

    grunt.registerTask('build', ['template', 'compress']);
    grunt.registerTask('publish', ['publish_webstore']);
};