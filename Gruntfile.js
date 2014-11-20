module.exports = function (grunt) {

	'use strict';

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		express: {

			options: {
				port: 9000,
				serverreload: true
			},

			dev: {
				options: {
					bases: [
						'public',
						'public/templates' /* [1] */
					]
				}
			},

			prod: {
				options: {
					bases: [
						'.public',
						'.public/templates' /* [1] */
					]
				}
			}
		},

		requirejs: {
			compile: {
				options: {
					baseUrl: 'public',
					mainConfigFile: 'public/js/main.js',
					dir: '.public',
					optimize: 'uglify',
					modules: [
						{ name: 'js/main' }
					]
				}
			}
		},

		karma: {

			options: {
				frameworks: ['mocha', 'requirejs', 'chai'],
				reporters: ['spec'],
				files: [
					{ pattern: 'public/components/**/*.js', included: false },
					{ pattern: 'public/js/**/*.js', included: false },
					{ pattern: 'test/browser/utils.js', included: false },
					{ pattern: 'test/browser/unit/**/*.js', included: false },
					'test/browser/main.js'
				]
			},

			unit: {
				options: {
					port: 9999,
					browsers: ['PhantomJS'],
					autoWatch: false,
					singleRun: true
				}
			}

			/*integration: {
				...
			}*/
		},

		jshint: {
			all: ['Gruntfile.js', 'public/js/controllers/**/*.js']
		},

		copy: {
			dist: {
				files: [
					{
						expand: true,
						cwd: "public",
						src: ["*.{js,css,map}"
							, "components/**/*.*"
							, "assets/**/*.*"
							, "src/**/*[^Gruntfile].js"
							, "src/**/dist/**/*.{js,css,map}"
						],
						dest: "dist"
					}
				]
			}
		},

		clean: ["dist"],


		dataUri: {
			dist: {
				src: ["assets/demo.css"],
				dest: "dist/css",

				options:{
					
					target: ['*/jpeg/*.*'],

					fixDirLevel: false,

					maxBytes: 0
				}
			}
		},


		concat: {
			options: {
			  separator: ';',
			  stripBanners: true,
			  banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
			  "<%= grunt.template.today(\"yyyy-mm-dd\") %> */ \n"
			},
			dist: {
			  src: ['public/js/controllers/*/*.[^\.min]*.js'],
			  dest: 'dist/js/controllers.js'
			},
			dist0: {
			  src: ['public/js/directives/*/*.[^\.min]*.js'],
			  dest: 'dist/js/directives.js'
			},
			dist1: {
			  src: ['public/js/modules/*/*[^\.min|^Gruntfile].js'],
			  dest: 'dist/js/modules.js'
			},
			distCss: {
			  src: ['public/css/**/*[^\.min].css'],
			  dest: 'dist/css/<%= pkg.name %>.css'
			}
		},

		uglify: {
		  options: {
			// the banner is inserted at the top of the output
			banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
		  },
		  dist: {
			files: {
			  'dist/js/controllers.min.js': ['dist/js/controllers.js'],
			  'dist/js/directives.min.js': ['dist/js/directives.js'],
			  //'dist/js/modules.min.js': ['dist/js/modules.js'],
			  'dist/<%= pkg.name %>.min.js': ['<%= concat.dist0.dest %>', '<%= concat.dist.dest %>']
			}
		  }
		}
		
	});

	grunt.loadNpmTasks('grunt-express');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-data-uri');
	
	grunt.loadNpmTasks('grunt-shell');

	// Default Production Build task(s).
	grunt.registerTask('default', ['clean', 'concat', 'copy', 'uglify', 'dataUri']);
};

// [1] Not using server-side controllers in order to simplify things