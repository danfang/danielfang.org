module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['Gruntfile.js', 'lib/public/js/*.js'],
      options: {
        globals: { jQuery: true }
      }
    },
    uglify: {
      options: {
        // the banner is inserted at the top of the output
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: { 
          'dist/js/index.min.js': ['lib/public/js/index.js'],
          'lib/public/js/index.min.js': ['lib/public/js/index.js'],
        }
      }
    },
    sass: {
      dist: {
        options: { style: 'compressed' },
        files: { 
          'dist/css/index.min.css': 'lib/public/css/index.scss',
          'lib/public/css/index.min.css': 'lib/public/css/index.scss'
        }
      }
    },
    jade: {
      compile: {
        options: { pretty: false, },
        files: { 'dist/index.html': ['lib/views/*.jade'] }
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
        tasks: ['react', 'jshint', 'uglify']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-react');

  grunt.registerTask('default', ['sass', 'jade', 'react', 'jshint', 'uglify']);

};
