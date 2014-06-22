"use strict";

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        less: {
            compile: {
                options: {
                    compress: true
                },
                files: {
                    'public/css/main.css': ['less/main.less']
                }
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-less');

    // Default task.
    grunt.registerTask('default', ['less']);
    grunt.registerTask('styles', ['less']);

};