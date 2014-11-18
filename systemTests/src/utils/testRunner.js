'use strict';

var q= require('q');
var sDriver = require('../components/driver');
var logger = require('log4js').getLogger('Layout');
var css = require('selenium-webdriver').By.css;
var By = require('selenium-webdriver').By;

var async = require('async');
var assert = require('assert');

var globalSteps = require('./globalTestSteps');
var globalFunctions = require('./globalFunctions');

var conf = require('../components/config');

var components = require('../components');

var SECOND = 1000;
var MINUTE = 60 * SECOND;

/**
 *
 * @returns promise - function( href value )
 */


exports.runTest = function(done, fill, validationFunctions) {
    var driver = sDriver.get();

    /**
     * Steps/flow of the test
     * 1. waitForProgressBar - waits for the loading bar in the start
     * 2. waitForProgressBarToDisappear - waits for the above progress bar to be not displayed
     * 3. fillForm - fills the form
     * 4. validateWidgetFields - checks that the widget fields got the same values from the form. The widget is located in the iframe
     * 5. validateRecipeProperties - checks that the "Recipe Properties" box contains the right values
     * 6. submitForm - clicks on submit
     *
     * 7. validationFunctions - This is the parameter that is passed to runTest function. It is an array of functions with signature: someFunction(callback)
     *
     * 8. finishTest - finishes the test by calling done()
     * @type {Array}
     */
    var steps = [
        function waitForProgressBar(callback) {
            logger.info('Locating the initial loading progress bar');
            driver.wait(function () {
                return components.ui.layout.getElementIsDisplayed('#blu-solo-snippet > div:nth-child(3) > div > div.progress').then(function(isDisplayed){
                    return isDisplayed;
                });
            }, 2 * MINUTE, 'Unable to find initial loading progress bar').then(function () {
                logger.debug('Found');
                callback();
            });
        },
        function waitForProgressBarToDisappear(callback) {
            logger.info('Waiting for the loading progress bar to disappear');
            driver.wait(function () {
                return components.ui.layout.getElementIsDisplayed('#blu-solo-snippet > div:nth-child(3) > div').then(function (isDisplayed){
                    return !isDisplayed;
                });
            }, 2 * MINUTE, 'Initial loading progress bar did not disappeared').then(function () {
                logger.debug('Done!');
                callback();
            });
        },
        function fillForm(callback) {
            logger.info('Filling form');
            globalSteps.fillData(conf, fill, callback);
        },
        function validateWidgetFields(callback) { // Check that the credentials passed to the widget (iframe) fields
            logger.info('Validating that the Key and Secret Key are passed to the widget');
            driver.switchTo().frame(0);

            if (fill.name === 'AWS') {

                components.ui.layout.getElementAttribute('input[ng-model=\'advancedParams.AWS_EC2.params.key\']','value').then(function (text) {
                    assert.equal(text, fill.data['awsLoginDetails.params.key']);
                });
                components.ui.layout.getElementAttribute('input[ng-model=\'advancedParams.AWS_EC2.params.secretKey\']','value').then(function(text){
                    assert.equal(text, fill.data['awsLoginDetails.params.secretKey']);
                });
            } else if (fill.name === 'Softlayer') {
                components.ui.layout.getElementAttribute('input[ng-model=\'advancedParams.SOFTLAYER.params.username\']','value').then(function(text){
                    assert.equal(text, fill.data['softlayerLoginDetails.params.username']);
                });
                components.ui.layout.getElementAttribute('input[ng-model=\'advancedParams.SOFTLAYER.params.apiKey\']','value').then(function(text){
                    assert.equal(text, fill.data['softlayerLoginDetails.params.apiKey']);
                });
            } else {
                throw new Error('Unknown widget [' + fill.name + ']');
            }

            driver.switchTo().defaultContent().then(callback);

        },

        function validateRecipeProperties(callback) {
            logger.info('Validating recipe properties');

            driver.wait(function () {
                return components.ui.layout.getElementIsDisplayed('#blu-solo-snippet > div:nth-child(2) > div > div > button').then(function (isDisplayed) {
                    return isDisplayed;
                });
            }, 1 * SECOND, 'Unable to find displayed \'Show Properties\' button');

            components.ui.layout.getElementIsDisplayed('#blu-solo-snippet > div:nth-child(2) > div > div > button').then(function (isDisplayed) {
                assert.equal(isDisplayed, true, 'Unable to find the orange box of the recipe properties');
            });

            components.ui.layout.clickElement('#blu-solo-snippet > div:nth-child(2) > div > div > button').then(function() {
                components.ui.layout.getElementIsDisplayed('#blu-solo-snippet > div:nth-child(2) > div > div > button').then(function (isDisplayed) {
                    assert.equal(false, isDisplayed, 'The \'Show Properties\' button still displayed!');
                }).then(function () {
                    components.ui.layout.getElementIsDisplayed('div.recipe-properties').then(function (isDisplayed) {
                        assert.equal(true, isDisplayed, 'The properties box is not displayed');
                    });
                    components.ui.layout.getElementIsDisplayed('#blu-solo-snippet > div:nth-child(2) > div > div > span > button').then(function (isDisplayed) {
                        assert.equal(true, isDisplayed, 'The \'Hide\' button is not displayed');
                    });
                });
            }).then(function () {
                var recipeProperties = globalFunctions.getConfigurationByFill(conf, fill).RecipeProperties;
                var keyValue = null;
                if (fill.name === 'AWS') {
                    keyValue = {
                        'Key': 'Value',
                        'EC2_REGION': recipeProperties.Region,
                        'BLU_EC2_HARDWARE_ID': recipeProperties.HardwareId
                    };

                    components.ui.layout.findElements('div.recipe-properties table tbody tr').then(function(rows){
                        async.eachSeries(rows,function(row,callbackDone) {
                            components.ui.layout.getElementInnerHtml('td:nth-child(1)',row).then(function(key){
                                components.ui.layout.getElementInnerHtml('td:nth-child(2)',row).then(function(value){
                                    var valueOfKey = keyValue[key];
                                    if (valueOfKey) {
                                        assert.equal(value, valueOfKey, 'Unexpected value for recipe property [' + key + ']');
                                    };
                                }).then(callbackDone);
                            });
                        });
                    });
                } else if (fill.name === 'Softlayer') {
                    keyValue = {
                        'Key': 'Value',
                        'locationId': recipeProperties.DataCenter[fill.data['execution.softlayer.dataCenter']],
                        'hardwareId': recipeProperties.CPU[fill.data['execution.softlayer.core']] + ',' + recipeProperties.RAM[fill.data['execution.softlayer.ram']] + ',' + recipeProperties.Disk[fill.data['execution.softlayer.disk']]
                    };

                    components.ui.layout.findElements('div.recipe-properties table tbody tr').then(function(rows){
                        async.eachSeries(rows,function(row,callbackDone) {
                            components.ui.layout.getElementInnerHtml('td:nth-child(1)',row).then(function(key){
                                components.ui.layout.getElementInnerHtml('td:nth-child(2)',row).then(function(value){
                                    var valueOfKey = keyValue[key];
                                    if (valueOfKey) {
                                        assert.equal(value, valueOfKey, 'Unexpected value for recipe property [' + key + ']');
                                    };
                                }).then(callbackDone);
                            });
                        });
                    });
                } else {
                    throw new Error('Unknown option [' + fill.name + '] for recipe properties');
                }
            }).then(function () {
                driver.findElement(By.xpath('//button[contains(., \'Hide\')]')).click();
                //TODO nice to have - add verifications for Show/Hide click results
            }).then(callback);

        },
        function submitForm(callback) {
            logger.info('Click on submit');
            components.ui.layout.clickElement('#blu-solo-snippet > div:nth-child(4) > div > div.form > div > div:nth-child(9) > div > div.form-actions > button');
            callback();
        }
    ].concat(validationFunctions)
        .concat(
        [
            function finishTest(callback) {
                logger.info('Finishing test');
                done();
                callback();
            }
        ]
    );

    async.waterfall(steps, function (err) {
        if (!!err) {
            logger.error('Error occurred on runTest', err);
            return;
        }
        logger.info('Test finishes successfully');
    });
};
