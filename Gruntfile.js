var path = require("path");
var FEATURED = require("./featured.json");

module.exports = function (grunt) {
    // Load NPM tasks
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-swig');
    grunt.loadNpmTasks('grunt-gh-pages');

    // Init GRUNT configuraton
    grunt.initConfig({
        'pkg': grunt.file.readJSON('package.json'),
        'less': {
            development: {
                options: {
                    compress: true,
                    yuicompress: true,
                    optimization: 2
                },
                files: {
                    "www/static/style.css": "stylesheets/main.less"
                }
            }
        },
        'swig': {
            development: {
                init: {
                    autoescape: true
                },
                dest: "www/",
                src: ['templates/*.swig'],
                generateSitemap: true,
                generateRobotstxt: true,
                siteUrl: 'http://www.gitbook.io',
                production: true,
                ga_account_id: 'UA-xxxxxxxx-1',
                
                featured: FEATURED
            }
        },
        'gh-pages': {
            options: {
                base: 'www'
            },
            src: ['**']
        }
    });

    // Build
    grunt.registerTask('build', [
        'less',
        'swig'
    ]);

    grunt.registerTask('publish', [
        'gh-pages'
    ]);

    grunt.registerTask('default', [
        'build'
    ]);
};