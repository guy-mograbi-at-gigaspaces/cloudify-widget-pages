/**
 * Created by kinneretzin on 11/11/14.
 */

'use strict';

var components = require('../../components');
var logger = require('log4js').getLogger('testAws');
var q= require('q');
var globalFunctions = require('../../utils/globalFunctions');
var globalSteps = require('../../utils/globalTestSteps');
var config = require('../../components/config');
var driver = require('../../components/driver');
var By = require('selenium-webdriver').By;
var assert = require('assert');
var async = require('async');

var testRunner = require('../../utils/testRunner');


var SECOND = 1000;
var MINUTE = 60 * SECOND;


describe('failure-checks test for aws', function() {
//
//    beforeEach(function () {
//        logger.info('initializing');
//        components.init().then(function () {
//            globalSteps.setDriver(driver.get());
//            components.ui.page.loadWidgetPage().then(done);
//        });
//    });
//
//    afterEach(function () {
//        components.driver.quit();
//    });


    beforeEach(function () {
        logger.info('initializing');
        components.init().then(function () {
            globalSteps.setDriver(driver.get());
            components.ui.page.loadWidgetPage().then(done);
        });
    });

    after(function () {
        components.driver.quit();
    });

    describe('Run with missing values', function() {

       it('Run with missing security group', function (done) {
            var fill = globalFunctions.getFillByFillname(config, 'AWS Missing Security Group');

            testRunner.runTest(done, fill, [
                function (callback) {

                    driver.get().wait(function () {
                        return components.ui.layout.getElementIsDisplayed('#blu-solo-snippet > div:nth-child(4) > div > div.form > div > span:nth-child(3) > div > div:nth-child(3) > div.section > div.error-message.ng-binding').then(function (isDisplayed) {
                            return isDisplayed;
                        });
                    }, 5 * SECOND, 'Unable to find error message box for securityGroups');

                    components.ui.layout.getElementInnerHtml('#blu-solo-snippet > div:nth-child(4) > div > div.form > div > span:nth-child(3) > div > div:nth-child(3) > div.section > div.error-message.ng-binding').then(function (innerHTML) {
                        assert.equal(innerHTML.trim(), 'Value is missing');
                    }).then(callback);

                }
            ]);
        });

        //AWS Missing Name
        it('Run with missing user name', function (done) {
            components.ui.page.loadWidgetPage().then(function(){


                var fill = globalFunctions.getFillByFillname(config, 'AWS Missing Name');

                testRunner.runTest(done, fill, [
                    function (callback) {
                        logger.info('Validating -Value is missing- msg for userName');

                        driver.get().wait(function () {
                            return components.ui.layout.getElementIsDisplayed('#blu-solo-snippet > div:nth-child(4) > div > div.form > div > div.controller.visitor-name.ng-isolate-scope.has-error > div > div.error-message.ng-binding').then(function (isDisplayed) {
                                return isDisplayed;
                            });

                        } , 10 * SECOND, "Unable to find error message box for securityGroups");

                        components.ui.layout.getElementInnerHtml('#blu-solo-snippet > div:nth-child(4) > div > div.form > div > div.controller.visitor-name.ng-isolate-scope.has-error > div > div.error-message.ng-binding').then(function (innerHTML) {
                            assert.equal(innerHTML.trim(), 'Value is missing');
                        }).then(callback);
                    }
                ]);
            });

        });

        it('Run with missing Email', function (done) {
            components.ui.page.loadWidgetPage().then(function() {
                var fill = globalFunctions.getFillByFillname(config, 'AWS Missing Email');

                testRunner.runTest(done, fill, [
                    function (callback) {

                        driver.get().wait(function () {
                            return components.ui.layout.getElementIsDisplayed('#blu-solo-snippet > div:nth-child(4) > div > div.form > div > div.controller.ng-isolate-scope.has-error > div > div.error-message.ng-binding').then(function (isDisplayed) {
                                return isDisplayed;
                            });
                        }, 5 * SECOND, 'Unable to find error message box for missing email');

                        components.ui.layout.getElementInnerHtml('#blu-solo-snippet > div:nth-child(4) > div > div.form > div > div.controller.ng-isolate-scope.has-error > div > div.error-message.ng-binding').then(function (innerHTML) {
                            assert.equal(innerHTML.trim(), 'Value is missing');
                        }).then(callback);

                    }
                ]);
            });
        });

    });

});
