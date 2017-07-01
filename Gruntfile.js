module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        template: grunt.file.readJSON('tasks-config/template.json'),

        compress: grunt.file.readJSON('tasks-config/compress.json'),

        webstore_upload_clientid: process.env.CLIENT_ID,
        webstore_upload_clientsecret: "",
        webstore_upload_appid: process.env.APP_ID,
        webstore_upload: grunt.file.readJSON('tasks-config/webstore_upload.json'),
    });

    grunt.loadNpmTasks('grunt-template');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-webstore-upload');

    grunt.registerTask('build', ['template', 'compress']);
    grunt.registerTask('publish', ['webstore_upload']);
};


