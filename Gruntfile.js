// Generated on 2013-10-15 using generator-angular 0.3.0
'use strict';
var LIVERELOAD_PORT = 35739;
var logger = require('log4js').getLogger('Gruntfile');
var path = require('path');
var lrSnippet = require('connect-livereload')({ port: LIVERELOAD_PORT });
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};
//var gsWhitelabel = require("./backend/gsWhitelabel");

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // configurable paths
    var yeomanConfig = {
        app: 'app',
        dist: 'dist'
    };

    var s3Config = {

    };

    try {
        yeomanConfig.app = require('./bower.json').appPath || yeomanConfig.app;
    } catch (e) {
    }

    try {
        s3Config = require(process.env.IBM_PAGES_S3 || path.resolve('./dev/s3.json'));
    } catch (e) {
        logger.error('s3 json is undefined, you will not be able to upload to s3');
    }


    grunt.initConfig({
        yeoman: yeomanConfig,
        s3: {
            all: {
                options: {
                    key: s3Config.accessKey,
                    secret: s3Config.secretKey,
                    gzip: true,
                    access: s3Config.access,
                    bucket: s3Config.bucket
                },
                upload: [
                    {
                        src: 'dist/**/*.*',
                        dest: '/',
                        rel: 'dist'
                    }
                ]
            }
        },
        watch: {
            coffee: {
                files: ['<%= yeoman.app %>/scripts/{,*/}*.coffee'],
                tasks: ['coffee:dist']
            },
            coffeeTest: {
                files: ['test/spec/{,*/}*.coffee'],
                tasks: ['coffee:test']
            },
            compass: {
                files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
                tasks: ['compass:server']
            },
            jshint: {
                files: [ '{.tmp,<%= yeoman.app %>}/scripts/**/*.js', 'test/**/*.js' ],
                tasks: ['jshint']
            },
            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                    '<%= yeoman.app %>/**/*.html',
                    '{.tmp,<%= yeoman.app %>}/styles/**/*.css',
                    '{.tmp,<%= yeoman.app %>}/scripts/**/*.js',
                    '<%= yeoman.app %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },
        connect: {
            options: {
                port: 9003,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost'
            },
            proxies: [
                {
                    context: '/backend',
                    host: 'localhost',
                    port: 9003,
                    https: false,
                    changeOrigin: false,
                    xforward: false
                }
            ],
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, yeomanConfig.app)
                        ];
                    }
                }
            },
            test: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, 'test')
                        ];
                    }
                }
            },
            dist: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, yeomanConfig.dist)
                        ];
                    }
                }
            }
        },
        open: {
            server: {
                url: 'http://localhost:<%= connect.options.port %>'
            }
        },
        clean: {
            dist: {
                files: [
                    {
                        dot: true,
                        src: [
                            '.tmp',
                            '<%= yeoman.dist %>/*',
                            '!<%= yeoman.dist %>/.git*'
                        ]
                    }
                ]
            },
            server: '.tmp'
        },

        jshint: {
            options: {
                reporter: require('jshint-stylish')
            },
            main: {
                options: {
                    jshintrc: '.jshintrc'
                },
                files: {
                    'src': [
                        'Gruntfile.js',
                        '<%= yeoman.app %>/scripts/**/*.js'
                    ]
                }
            },
            test: {
                options: {
                    jshintrc: 'test.jshintrc'
                },
                files: {
                    'src': [
                        'test/**/*.js'
                    ]
                }
            },
            systemTests: {
                options: {
                    jshintrc: 'systemTests.jshintrc'
                },
                files: {
                    'src': [
                        'systemTests/**/*.js'
                    ]
                }
            }

        },
        html2js: {
            options: {
                // custom options, see below
            },
            main: {
                src: ['app/views/**/*.html', 'app/views/*.html'],
                dest: '.tmp/html2js/directives.js',
                module: 'directives-templates',
                options: {
                    rename: function (moduleName) {
                        var indexOf = moduleName.indexOf('views');
                        return moduleName.substring(indexOf);
                    }
                }
            }
        },
        coffee: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/scripts',
                        src: '{,*/}*.coffee',
                        dest: '.tmp/scripts',
                        ext: '.js'
                    }
                ]
            },
            test: {
                files: [
                    {
                        expand: true,
                        cwd: 'test/spec',
                        src: '{,*/}*.coffee',
                        dest: '.tmp/spec',
                        ext: '.js'
                    }
                ]
            }
        },
        compass: {
            options: {
                sassDir: '<%= yeoman.app %>/styles',
                cssDir: '.tmp/styles',
                generatedImagesDir: '.tmp/images/generated',
                imagesDir: '<%= yeoman.app %>/images',
                javascriptsDir: '<%= yeoman.app %>/scripts',
                fontsDir: '<%= yeoman.app %>/styles/fonts',
                importPath: '<%= yeoman.app %>/bower_components',
                httpImagesPath: '/images',
                httpGeneratedImagesPath: '/images/generated',
                httpFontsPath: '/styles/fonts',
                relativeAssets: false
            },
            dist: {},
            server: {
                options: {
                    debugInfo: true
                }
            }
        },
        // not used since Uglify task does concat,
        // but still available if needed
        /*concat: {
         dist: {}
         },*/
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= yeoman.dist %>/scripts/{,*/}*.js',
                        '<%= yeoman.dist %>/styles/{,*/}*.css',
                        '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                        '<%= yeoman.dist %>/styles/fonts/*'
                    ]
                }
            }
        },
        useminPrepare: {
            html: '<%= yeoman.app %>/index.html',
            options: {
                dest: '<%= yeoman.dist %>'
            }
        },
        usemin: {
            html: ['<%= yeoman.dist %>/{,*/}*.html'],
            css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
            options: {
                dirs: ['<%= yeoman.dist %>']
            }
        },
        imagemin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/images',
                        src: '{,*/}*.{png,jpg,jpeg}',
                        dest: '<%= yeoman.dist %>/images'
                    }
                ]
            }
        },
        cssmin: {
            // By default, your `index.html` <!-- Usemin Block --> will take care of
            // minification. This option is pre-configured if you do not wish to use
            // Usemin blocks.
            dist: {
                files: {
                    '<%= yeoman.dist %>/styles/main.css': [
                        '.tmp/styles/{,*/}*.css',
                        '<%= yeoman.app %>/styles/{,*/}*.css'
                    ]
                }
            },
            options: {processImport: false}
        },
        htmlmin: {
            dist: {
                options: {
                    /*removeCommentsFromCDATA: true,
                     // https://github.com/yeoman/grunt-usemin/issues/44
                     //collapseWhitespace: true,
                     collapseBooleanAttributes: true,
                     removeAttributeQuotes: true,
                     removeRedundantAttributes: true,
                     useShortDoctype: true,
                     removeEmptyAttributes: true,
                     removeOptionalTags: true*/
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>',
                        src: ['*.html', 'views/{,*/}*.html'],
                        dest: '<%= yeoman.dist %>'
                    }
                ]
            }
        },
        // Put files not handled in other tasks here
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= yeoman.app %>',
                        dest: '<%= yeoman.dist %>',
                        src: [
                            '*.{ico,png,txt}',
                            '.htaccess',
                            'i18n/{,*/}*.json',
                            'fonts/**/*',
                            'images/{,*/}*.{gif,webp,svg,PNG}',
                            'styles/fonts/*',
                            'data_digested.js'
                        ]
                    },
                    {
                        expand: true,
                        dot: true,
                        cwd: '.',
                        dest: '<%= yeoman.dist %>',
                        src: [
                            '.npmignore',
                            'package.json',
                            'server.js',
                            'backend/**/*',
                            'cosmoui.js',
                            'cosmoui.1',
                            'LICENSE',
                            'logs/gsui.log'

                        ]
                    },
                    {
                        expand: true,
                        cwd: '.tmp/images',
                        dest: '<%= yeoman.dist %>/images',
                        src: [
                            'generated/*'
                        ]
                    }
                ]
            }
        },
        concurrent: {
            watchStuff: {
                'tasks': [ 'watch', 'watch:jshint' ],
                'options': { 'logConcurrentOutput': true}
            },
            server: [
                'coffee:dist',
                'compass:server'
            ],
            test: [
                'coffee',
                'compass'
            ],
            dist: [
                'coffee',
                'compass:dist',
                'imagemin',
                'htmlmin'
            ]
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                singleRun: true
            },
            debug: {
                configFile: 'karma.conf.js',
                singleRun: false,
                reporters: ['failed']
            }
        },
        ngmin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.dist %>/scripts',
                        src: '*.js',
                        dest: '<%= yeoman.dist %>/scripts'
                    }
                ]
            }
        },
        uglify: {
            dist: {
                files: {
                    '<%= yeoman.dist %>/scripts/scripts.js': [
                        '<%= yeoman.dist %>/scripts/scripts.js'
                    ]
                }
            }
        },
        mochaTest: {
            sanity: {
                options: {
                    timeout: 1800000,
                    reporter: 'spec',
                    captureFile: 'systemTests/output/sanity-test-results.txt', // Optionally capture the reporter output to a file
                    quiet: false, // Optionally suppress output to standard out (defaults to false)
                    clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false)
                },
                src: ['systemTests/src/suites/sanity/*.spec.js']
                //src: ['systemTests/src/index.js']
            },
            failures: {
                options: {
                    timeout: 1800000,
                    reporter: 'spec',
                    captureFile: 'systemTests/output/failure-test-results.txt', // Optionally capture the reporter output to a file
                    quiet: false, // Optionally suppress output to standard out (defaults to false)
                    clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false)
                },
                src: ['systemTests/src/suites/failure-checks/*.spec.js']
                //src: ['systemTests/src/index.js']
            }
        }
    });

    grunt.registerTask('server', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'concurrent:server',
            'configureProxies',
            'connect:livereload',
            'open',
            'concurrent:watchStuff'
        ]);
    });

    grunt.registerTask('test', [
        'clean:server',
        'html2js:main',
        'concurrent:test',
        'connect:test',
        'karma:unit'
    ]);

    grunt.registerTask('build', function () {

        var tasks = [
            'clean:dist',
            'useminPrepare',
            'concurrent:dist',
            'concat',
            'copy:dist',
            'ngmin',
            'cssmin',
            'uglify',
            'rev',
            'usemin',
            'writeBuildId'

        ];

        grunt.task.run(tasks);
    });

    grunt.registerTask('updateSoftlayerData', function () {
        var callback = this.async();
        process.env.SOFTLAYER_PACKAGE_URL = process.env.SOFTLAYER_PACKAGE_URL || s3Config.softlayerDataUrl;
        require('./build/digest_softlayer_package_items.js').execute(callback);
    });

    grunt.registerTask('writeBuildId',
        function () {
            grunt.file.write('dist/build.json', JSON.stringify({ 'host': require('os').hostname(), 'timestamp': new Date().getTime() }));
        }
    );

    grunt.registerTask('deploy', [ 'updateSoftlayerData', 'default', 's3:all']);


    grunt.registerTask('default', [
        'jshint',
        'test',
        'build'
    ]);


    grunt.registerTask('mocha', function () {
        grunt.task.run([
            'mochaTest:sanity'
        ]);
    });


    grunt.registerTask('mochaFails', function () {
        grunt.task.run([
            'mochaTest:failures'
        ]);
    });
};
