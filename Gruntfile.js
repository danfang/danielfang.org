module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      dist: {
        options: {
          style: 'expanded'
        },
        files: { 
          'dist/css/index.css': 'lib/public/css/index.scss',
          'lib/public/css/index.css': 'lib/public/css/index.scss'
        }
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
    react: {
      single_file_output: {
        files: {
          'dist/js/index.js': 'lib/public/js/index.jsx',
          'lib/public/js/index.js': 'lib/public/js/index.jsx'
        }
      }
    },
    watch: {
      css: {
        files: ['lib/public/css/*.scss'],
        tasks: ['sass']
      },
      jade: {
        files: ['lib/views/*.jade'],
        tasks: ['jade']
      },
      react: {
        files: ['lib/public/js/*.jsx'],
        tasks: ['react']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-react');

  grunt.registerTask('default', ['sass', 'jade', 'react']);

};
