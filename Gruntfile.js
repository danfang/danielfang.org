module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      dist: {
        options: {
          style: 'expanded'
        },
        files: { 'dist/css/index.css': 'lib/css/index.scss' }
      }
    },
    jade: {
      compile: {
        options: {
          pretty: true,
        },
        files: {
          'dist/index.html': ['lib/views/*.jade']
        }
      }
    },
    watch: {
      css: {
        files: ['lib/css/*.scss'],
        tasks: ['sass']
      },
      jade: {
        files: ['lib/views/*.jade'],
        tasks: ['jade']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-jade');

  grunt.registerTask('default', ['sass', 'jade']);

};
