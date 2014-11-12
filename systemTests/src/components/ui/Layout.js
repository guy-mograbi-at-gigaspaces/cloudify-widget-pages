'use strict';

var q= require('q');
var sDriver = require('../driver');
var logger = require('log4js').getLogger('Layout');
var css = require('selenium-webdriver').By.css;
var By = require('selenium-webdriver').By;

var async = require('async');
var assert = require('assert');

var globalSteps = require('../../utils/globalTestSteps');
var globalFunctions = require('../../utils/globalFunctions');

var conf = require('../config');


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
                return driver.isElementPresent(By.xpath('//div[@class=\'progress\']/..'));
            }, 2 * MINUTE, 'Unable to find initial loading progress bar').then(function () {
                logger.debug('Found');
                callback();
            });
        },
        function waitForProgressBarToDisappear(callback) {
            logger.info('Waiting for the loading progress bar to disappear');
            driver.wait(function () {
                return driver.findElement(By.xpath('//div[@class=\'progress\']/..')).isDisplayed().then(function (isDisplayed) {
                    return !isDisplayed;
                });
            }, 5000, 'Initial loading progress bar did not disappeared').then(function () {
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
                driver.findElement(By.css('input[ng-model=\'advancedParams.AWS_EC2.params.key\']')).getAttribute('value').then(function (text) {
                    assert.equal(text, fill.data['awsLoginDetails.params.key']);
                });
                driver.findElement(By.css('input[ng-model=\'advancedParams.AWS_EC2.params.secretKey\']')).getAttribute('value').then(function (text) {
                    assert.equal(text, fill.data['awsLoginDetails.params.secretKey']);
                });
            } else if (fill.name === 'Softlayer') {
                driver.findElement(By.css('input[ng-model=\'advancedParams.SOFTLAYER.params.username\']')).getAttribute('value').then(function (text) {
                    assert.equal(text, fill.data['softlayerLoginDetails.params.username']);
                });
                driver.findElement(By.css('input[ng-model=\'advancedParams.SOFTLAYER.params.apiKey\']')).getAttribute('value').then(function (text) {
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
                return driver.findElement(By.xpath('//button[contains(., \'Show Properties\')]')).isDisplayed().then(function (isDisplayed) {
                    return isDisplayed;
                });
            }, 1 * SECOND, 'Unable to find displayed \'Show Properties\' button');

            driver.findElement(By.xpath('//div[contains(@style, \'background-color:orange\')]/button[contains(., \'Show Properties\')]/..')).isDisplayed().then(function (isDisplayed) {
                assert.equal(isDisplayed, true, 'Unable to find the orange box of the recipe properties');
            });

            //driver.findElement(By.xpath('//button[contains(., \'Show Properties\')]')).click().then(function () {
            driver.findElement(By.css('button:contains(\'Show Properties\')')).click().then(function(){
                //driver.findElement(By.xpath('//button[contains(., \'Show Properties\')]')).isDisplayed().then(function (isDisplayed) {
                driver.findElement(By.css('button:contains(\'Show Properties\')')).isDisplayed().then(function (isDisplayed) {
                    assert.equal(false, isDisplayed, 'The \'Show Properties\' button still displayed!');
                }).then(function () {
                    driver.findElement(By.css('div.recipe-properties')).isDisplayed().then(function (isDisplayed) {
                        assert.equal(true, isDisplayed, 'The properties box is not displayed');
                    });
                    driver.findElement(By.xpath('//button[contains(., \'Hide\')]')).isDisplayed().then(function (isDisplayed) {
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
                    async.eachSeries(Object.keys(keyValue), function (key, callbackDone) {
                        driver.findElement(By.xpath('//div[@class=\'recipe-properties\']/table/tbody/tr/td[contains(.,\'' + key + '\')]/../td[last()]')).getInnerHtml().then(function (value) {
                            assert.equal(value, keyValue[key], 'Unexpected value for recipe property [' + key + ']');
                        }).then(callbackDone);
                    });
                } else if (fill.name === 'Softlayer') {
                    keyValue = {
                        'Key': 'Value',
                        'locationId': recipeProperties.DataCenter[fill.data['execution.softlayer.dataCenter']],
                        'hardwareId': recipeProperties.CPU[fill.data['execution.softlayer.core']] + ',' + recipeProperties.RAM[fill.data['execution.softlayer.ram']] + ',' + recipeProperties.Disk[fill.data['execution.softlayer.disk']]
                    };
                    async.eachSeries(Object.keys(keyValue), function (key, callbackDone) {
                        driver.findElement(By.xpath('//div[@class=\'recipe-properties\']/table/tbody/tr/td[contains(.,\'' + key + '\')]/../td[last()]')).getInnerHtml().then(function (value) {
                            assert.equal(value, keyValue[key], 'Unexpected value for recipe property [' + key + ']');
                        }).then(callbackDone);
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
            driver.findElement(By.xpath('//button[contains(., \'Submit\')]')).click();
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

exports.getElementInnerHtml = function(elementPath) {
    var deferred = q.defer();

    sDriver.get().findElement(elementPath).getInnerHtml().then(function (innerHTML) {
        deferred.resolve(innerHTML);
    });

    return deferred.promise;
};

exports.getElementIsDisplayed = function(elementPath) {
    var deferred = q.defer();

    sDriver.get().findElement(elementPath).isDisplayed().then(function (isDisplayed) {
        deferred.resolve(isDisplayed);
    });

    return deferred.promise;
};



