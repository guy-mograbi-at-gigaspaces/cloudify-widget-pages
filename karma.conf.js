module.exports = function (config) {


    var configuration = {
        frameworks: ['jasmine'
        ],
        browsers: ['Chrome'],
        customLaunchers: {
            Chrome_travis_ci: {
                base: 'Chrome',
                flags: ['--no-sandbox']
            }
        },
        port: 8080,


        // base path, that will be used to resolve files and exclude
        basePath: '',

// list of files / patterns to load in the browser
        files: [
            'app/bower_components/jquery/dist/jquery.js',
            'app/bower_components/lodash/dist/lodash.js',
            'app/bower_components/angular/angular.js',
            'app/bower_components/i18next/release/i18next-1.7.1.js',
            'app/bower_components/angular-mocks/angular-mocks.js',
            'app/bower_components/angular-route/angular-route.js',
            'app/bower_components/gs-ui-infra/app/scripts/**/*.js',
            'app/bower_components/cloudify-widget-angular-controller/index.js',
            'app/scripts/*.js',
            'app/scripts/**/*.js',
            'test/mock/**/*.js',
            'test/spec/**/*.js',
            '.tmp/html2js/*.js'
        ],
        preprocessors: {
            'app/scripts/**/*.js': ['coverage']
        },
        exclude: [],
        reporters: [ 'failed', 'coverage'],
        colors: true,
        runnerPort: 9100,
        logLevel: 'info',
        autoWatch: true,
        captureTimeout: 15000,
        singleRun: false,
        coverageReporter: {
            type: 'html',
            dir: 'coverage/',
            subdir: function (browser) {
                var result = browser.toLowerCase().split(/[ /-]/)[0];
                console.log('this is browser', result);
                return result;
            }
        }


    };

    config.set(configuration);


};
