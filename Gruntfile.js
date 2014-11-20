module.exports = function (grunt) {

	'use strict';

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),
		

		jshint: {
			all: ['Gruntfile.js', 'src/**/*.js']
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
					
					target: ['*/jpeg/*'],

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
			  src: ['src/[^\.min]*.js'],
			  dest: 'dist/js/<%= pkg.name %>.js'
			}
		},

		uglify: {
		  options: {
			// the banner is inserted at the top of the output
			banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
		  },
		  dist: {
			files: {
			  'dist/js/<%= pkg.name %>.min.js': ['dist/js/<%= pkg.name %>.js']
			}
		  }
		}
		
	});

	grunt.loadNpmTasks('grunt-contrib-requirejs');
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