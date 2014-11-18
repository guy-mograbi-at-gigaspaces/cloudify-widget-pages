/**
 * Created by kinneretzin on 11/11/14.
 */


'use strict';

var components = require('../../components');
var logger = require('log4js').getLogger('testSoftlayer');
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


describe('Sanity test for softlayer', function() {

    before(function () {
        logger.info('initializing');
        components.init().then(function () {
            globalSteps.setDriver(driver.get());
            components.ui.page.loadWidgetPage().then(done);
        });
    });

    after(function () {
        components.driver.quit();
    });

    xit('Run with invalid credentials', function (done) {
        var fills = globalFunctions.getFillByFillname(config, 'Softlayer Invalid Credentials');

        testRunner.runTest(done, fills, [
            function (callback) {
                logger.info('Validating run');

                logger.debug('Will wait 5 seconds for the widget output');
                driver.wait(function () {
                    return driver.findElement(By.css('div[widget-raw-output-display=\'genericWidgetModel\']')).isDisplayed().then(function (isDisplayed) {
                        return isDisplayed;
                    });
                }, 5 * SECOND, 'output div is not displayed').then(function () {
                    logger.debug('will wait 5 minutes for the error message box');
                });


                driver.wait(function () {
                    return driver.findElement(By.xpath('//div[contains(@class, \'widget-message\')]')).isDisplayed();
                }, 5 * MINUTE, 'Widget message box is not displayed').then(function () {
                    logger.debug('Checking error message box content');
                }).then(callback);
            },
            function (callback) {
                globalSteps.stepCheckErrorBox('Invalid Credentials', callback);
            }
        ]);
    });

});
