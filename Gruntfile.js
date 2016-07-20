'use strict'

module.exports = function (grunt) {
  var localConfig
  try {
    localConfig = require('./server/config/local.env')
  } catch(e) {
    localConfig = {}
  }

  // Load grunt tasks automatically, when needed
  require('jit-grunt')(grunt, {
    express: 'grunt-express-server'}
  )

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt)

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    pkg: grunt.file.readJSON('package.json'),
    yeoman: {
      // configurable paths
      root:'',
      client: 'assets',
      dist: 'dist'
    },
    express: {
      options: {
        port: process.env.PORT || 9000
      },
      dev: {
        options: {
          script: 'server/app.js',
          debug: true
        }
      },
      prod: {
        options: {
          script: 'dist/server/app.js'
        }
      }
    },
    open: {
      server: {
        url: 'http://localhost:<%= express.options.port %>'
      }
    },
    watch: {
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        files: [
          '{.tmp,<%= yeoman.client %>}/{app,components}/**/*.css',
          '{.tmp,<%= yeoman.client %>}/{app,components}/**/*.html',
          '{.tmp,<%= yeoman.client %>}/{app,components}/**/*.js',
          '<%= yeoman.client %>/images/{,*//*}*.{png,jpg,jpeg,gif,webp,svg}'
        ],
        options: {
          livereload: true
        }
      },
      express: {
        files: [
          'server/**/*.{js,json}'
        ],
        tasks: ['express:dev', 'wait'],
        options: {
          livereload: true,
          nospawn: true // without this option specified express won't be reloaded
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '<%= yeoman.root %>.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        '<%= yeoman.client %>/{,*/}*.js'
      ]
    },

    env: {
      test: {
        NODE_ENV: 'development'
      },
      prod: {
        NODE_ENV: 'production'
      },
      all: localConfig
    },
    sass: {
      dist: {
        files: {
           'assets/css/main.css': 'assets/css/main.scss',
        }
      }
    },
    ts: {
        default : {
            src: ["assets/js/*.ts", "!node_modules/**/*.ts"]
        }
    }    
  })

  // Used for delaying livereload until after server has restarted
  grunt.registerTask('wait', function () {

    grunt.log.ok('Waiting for server reload...')

    var done = this.async()

    setTimeout(function () {
      grunt.log.writeln('Done waiting!')
      done()
    }, 1500)

  })

  grunt.registerTask('express-keepalive', 'Keep grunt running', function () {
    this.async()
  })

  grunt.registerTask('serve', function (target) {

    if (target === 'dist') {
      return grunt.task.run(['build', 'env:all', 'env:prod', 'express:prod', 'wait', 'open', 'express-keepalive'])
    }

    grunt.task.run([
      'ts',
      'jshint',
      'sass',
      'express:dev',
      'wait',
      'open',
      'watch'
    ])

  })

  grunt.registerTask('build', [
    'ts',
    'jshint',
    'sass'
  ])

  grunt.registerTask('default', [
    'build'
  ])

}