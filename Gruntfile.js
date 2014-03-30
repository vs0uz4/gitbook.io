module.exports = function (grunt) {
    var path = require("path");

    // Load NPM tasks
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Init GRUNT configuraton
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        less: {
            development: {
                options: {
                    compress: true,
                    yuicompress: true,
                    optimization: 2
                },
                files: {
                    "public/static/style.css": "public/stylesheets/main.less"
                }
            }
        },
        watch: {
            styles: {
                files: [
                    'public/stylesheets/**/*.less'
                ],
                tasks: ['build'],
                options: {
                    nospawn: true
                }
            }
        }
    });

    // Build
    grunt.registerTask('build', [
        'less'
    ]);

    grunt.registerTask('default', [
        'build',
        'watch'
    ]);
};