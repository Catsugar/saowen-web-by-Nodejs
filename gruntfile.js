module.exports = function(grunt) {
  grunt.initConfig({
    watch: {
      ejs: {
        files: ['views/**'],
        options: {
          livereload: true
        }
      },
      js: {
        files: ['public/js/**', 'models/**/*.js'],
        options: {
          livereload: true
        }
      },
    },

    nodemon: {
      dev: {
        options: {
          file: 'app.js',
          args: [],
          ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
          watchedExtensions: ['js'],
          watchedFolders: ['./'],
          debug: true,
          delayTime: 1,
          env: {
            PORT: 3000
          },
          cwd: __dirname
        }
      }
    },
    concurrent: {
      tasks: ['nodemon', 'watch'],
      options: {
        logConcurrentOutput: true
      }
    }
  })
	grunt.loadNpmTasks('grunt-contrib-watch') //文件添加修改时重新执行
	grunt.loadNpmTasks('grunt-concurrent')  //优化慢任务
	grunt.loadNpmTasks('grunt-nodemon')  //监听入口文件
   /* grunt.loadNpmTasks('grunt-mocha-test')
    grunt.loadNpmTasks('grunt-contrib-less')
    grunt.loadNpmTasks('grunt-contrib-uglify')
    grunt.loadNpmTasks('grunt-contrib-jshint')*/
	
	grunt.option('force',true)
	grunt.registerTask('default',['concurrent'])
	//grunt.registerTask('test', ['mochaTest'])

}