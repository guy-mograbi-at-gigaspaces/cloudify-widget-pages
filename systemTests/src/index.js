// following example for selenium on nodejs
// https://code.google.com/p/selenium/wiki/WebDriverJs

'use strict';
var SECOND = 1000;
var MINUTE = 60 * SECOND;
/**
 *
 *
 * configuration looks like :
 *
 *
 * {
    "selenium": {
        "serverAddress" : "http://ip:4444/wd/hub"  // location for remote browser
    },
    "executionOptions": [
        {
            "name": "executionName", // Must match the name in fills
            "fields": {
                "required": {
                    "fieldNameInForm": "fieldType(select, input)",
                },
                "optional": {
                    "fieldNameInForm": "fieldType(select, input)",
                }
            }
        }
    ],
    "fills": {
        "description here" : {
            "name": "executionName", // Must match the name in executionOptions
            "data": {
                "fieldNameInExecutionOptions": "value",
            }
        }
    }
}
 *
 *
 * @type {exports}

 */

var lodash = require('lodash');
var assert = require('assert');
var path = require('path');
var meJson = process.env.ME_JSON && path.resolve(__dirname + '/../../', process.env.ME_JSON) || path.resolve(__dirname, '../conf/dev/me.json');
var async = require('async');
var conf = require(meJson);
var ec2 = require('./utils/terminateEc2Machines');
var globalSteps = require('./utils/globalTestSteps');
var globalFunctions = require('./utils/globalFunctions');
var log4js = require('log4js');
var logger = log4js.getLogger('index');
var http = require('http');
var fs = require('fs');

try {
    if (!!conf && !!conf.log4js) {
        log4js.configure(conf.log4js);
    }
} catch (e) {
    console.log('error while configuring log4js', e);
}

try {
    var overrideJSON = path.resolve(__dirname, '../conf/dev/me-override.json');
    var overrideConf = require(overrideJSON);
    lodash.merge(conf, overrideConf);
} catch (e) {
    logger.debug('There is no me-override.json file', e);
}


process.on('exit', function () {
    console.log('terminating');
    log4js.shutdown();
});


var webdriver = require('selenium-webdriver');
var By = webdriver.By;
var driver;
var seleniumServerAddress = conf.selenium.serverAddress;


/**
 * This is the main method to be called when running a test case
 * Should be used like:
 * it('test name', function(done) {
 *      //Some configurations
 *      runTest(done, fill, [array of functions that are added to the test flow])
 * }
 * @param done - the callback of the test
 * @param fill
 * @param validationFunctions - array of test functions to be added to the test flow - See steps object in this method
 */
function runTest(done, fill, validationFunctions) {

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

            driver.findElement(By.xpath('//button[contains(., \'Show Properties\')]')).click().then(function () {
                driver.findElement(By.xpath('//button[contains(., \'Show Properties\')]')).isDisplayed().then(function (isDisplayed) {
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
}

/*
 xdescribe('test', function () {

 it('test', function (done) {
 driver = globalSteps.getChromeDriver(seleniumServerAddress);
 driver.get('http://ibmpages.gsdev.info/#/snippet/bluSolo?lang=');

 driver.wait(function () {
 return driver.isElementPresent(By.xpath('//*[text()[contains(.,\'Looking for previous installations...\')]]')).then(function (isPresent) {
 logger.info('Present1!!' + isPresent);
 return isPresent;
 });
 }, 10 * SECOND);

 driver.wait(function () {
 return driver.findElement(By.xpath('//*[text()[contains(.,\'Looking for previous installations...\')]]')).isDisplayed().then(function (isPresent) {
 logger.info('Present2!!' + isPresent);
 return isPresent;
 });
 }, 10 * SECOND);


 driver.wait(function () {
 return driver.findElement(By.xpath('//*[text()[contains(.,\'Looking for previous installations...\')]]')).isDisplayed().then(function (isPresent) {
 logger.info('Present4!!' + isPresent);
 return !isPresent;
 });
 }, 10 * SECOND);

 driver.wait(function () {
 return driver.findElement(By.xpath('//*[text()[contains(.,\'Looking for previous installations...\')]]')).isDisplayed().then(function (isPresent) {
 logger.info('Present3!!' + isPresent);
 return isPresent;
 });
 }, 10 * SECOND).then(function () {
 done();
 });
 });
 });
 */

describe('snippet tests', function () {
    // AWS tests
/*

    afterEach(function (done) {
        logger.info('Terminating EC2 machines');
        ec2.terminate(function (numOfTerminatedInstances) {
            if (numOfTerminatedInstances > 0) {
                logger.warning('There were un-terminated instances [' + numOfTerminatedInstances + ']');
            }
            done();
        });
    });
*/


    describe('AWS tests', function () {

        beforeEach(function (done) {
            driver = globalSteps.getChromeDriver(seleniumServerAddress);
            driver.get('http://ibmpages.gsdev.info/#/snippet/bluSolo?lang=').then(done);
        });

      /*  afterEach(function (done) {
            setTimeout(function () {
                driver.close().then(function () {
                    logger.info('Closing web browser');
                    done();
                });
            }, 3000);
        });
*/
        xit('Run with missing security group', function (done) {
            var fill = globalFunctions.getFillByFillname(conf, 'AWS Missing Security Group');

            runTest(done, fill, [
                function (callback) {
                    logger.info('Validating run');

                    driver.wait(function () {
                        return driver.findElement(By.xpath('//input[@ng-model=\'execution.aws.securityGroup\']/../../div[@class=\'error-message ng-binding\']')).isDisplayed().then(function (isDisplayed) {
                            return isDisplayed;
                        });
                    }, 2 * SECOND, 'Unable to find error message box for securityGroups');

                    driver.findElement(By.xpath('//input[@ng-model=\'execution.aws.securityGroup\']/parent::*/parent::*/child::div[@class=\'error-message ng-binding\']')).getInnerHtml().then(function (innerHTML) {
                        assert.equal(innerHTML.trim(), 'Value is missing');
                    }).then(callback);
                }
            ]);
        });

        it('Run with valid data', function (done) {
            var fill = globalFunctions.getFillByFillname(conf, 'AWS Valid Data');

            runTest(done, fill, [
                function (callback) {
                    logger.info('Validating run');

                    //Check that output div is displayed
                    driver.wait(function () {
                        return driver.findElement(By.css('div[widget-raw-output-display=\'genericWidgetModel\']')).isDisplayed().then(function (isDisplayed) {
                            return isDisplayed;
                        });
                    }, 5 * SECOND, 'output div is not displayed');

                    //Check that the output message is displayed (inside the output-div)
                    driver.findElement(By.xpath('//div[@class=\'widget-output-display\']/pre[@class=\'pre\']')).isDisplayed().then(function (isDisplayed) {
                        assert.equal(isDisplayed, true, 'Widget output is not displayed!');
                    });

                    //Check that the 'We are working hard to get your instance up and running with BLU' message is displayed
                    driver.findElement(By.xpath('//div[text()[contains(.,\'We are working hard to get your instance up and running with BLU\')]]')).isDisplayed().then(function (isDisplayed) {
                        assert.equal(isDisplayed, true, 'The text [We are working hard to get your instance up and running with BLU] is not displayed');
                    });

                    //Check that the green progress bar is displayed
                    driver.findElement(By.xpath('//div[text()[contains(.,\'We are working hard to get your instance up and running with BLU\')]]/../div[@class=\'progress\']/div[contains(@class, \'progress-bar\') and contains(@class, \'progress-bar-success\')]')).isDisplayed().then(function (isDisplayed) {
                        assert.equal(isDisplayed, true, 'The green progress bar is not displayed');
                    });

                    //Check that the output message contains 'BLU Installation started. Please wait, this might take a while...'
                    driver.findElement(By.xpath('//div[@class=\'widget-output-display\']/pre[@class=\'pre\' and contains(.,\'BLU Installation started. Please wait, this might take a while...\')]')).isDisplayed().then(function (isDisplayed) {
                        assert.equal(isDisplayed, true, 'The message [BLU Installation started. Please wait, this might take a while...] is not displayed in the widget output');
                    });

                    //Check that the output message contains 'Service 'blustratus' successfully installed'
                    driver.wait(function () {
                        return driver.isElementPresent(By.xpath('//div[@class=\'widget-output-display\']/pre[@class=\'pre\' and contains(.,\'Service "blustratus" successfully installed\')]')).then(function (isDisplayed) {
                            return isDisplayed;
                        });
                    }, 15 * MINUTE, 'Unable to find [Service "blustratus" successfully installed] in the widget output');

                    //Check the private key
                    driver.wait(function () {
                        return driver.findElement(By.xpath('//div[text()[contains(.,\'You have a new private key\')]]/..')).isDisplayed().then(function (isDisplayed) {
                            return isDisplayed;
                            //assert.equal(isDisplayed, true, 'Expecting the private key div to be visible');
                        });
                    }, 1 * MINUTE);


                    //Save the innerHTML of the private key
                    //Download the file
                    //Compare it's content with the saved innerHTML
                    driver.findElement(By.xpath('//div[text()[contains(.,\'You have a new private key\')]]/../descendant::button[text()[contains(.,\'View\')]]')).click().then(function () {
                        //Check that the pem content is displayed
                        driver.findElement(By.xpath('//div[contains(@class,\'pem-content\')]')).isDisplayed().then(function (isDisplayed) {
                            assert.equal(isDisplayed, true, 'Expecting the pem-content div to be displayed');
                        });

                        //Validating the pem content - Check that the downloadable pem file contains the same content as the pem-content div
                        driver.findElement(By.xpath('//code[text()[contains(.,\'BEGIN RSA PRIVATE KEY\')]]')).getInnerHtml().then(function (innerHTML) {
                            assert.equal(0, innerHTML.indexOf('-----BEGIN RSA PRIVATE KEY-----'), 'Downloaded file doest not start with [-----BEGIN RSA PRIVATE KEY-----]');
                            async.waterfall([
                                function clickClose(callback) { // Click on close
                                    driver.findElement(By.xpath('//div[contains(@class,\'pem-content\')]/descendant::div[@class=\'instructions\']/button[text()[contains(.,\'Close\')]]')).click()
                                        .then(callback);
                                },
                                function extractHref(callback) {
                                    driver.findElement(By.xpath('//div[text()[contains(.,\'You have a new private key\')]]/../descendant::a[text()[contains(.,\'Download\')]]')).getAttribute('href').then(function (href) {
                                        callback(null, href);
                                    });
                                },
                                function downloadKeyFile(link, callback) {
                                    http.get(link, function (response) {
                                        var file = fs.createWriteStream('file.pem');
                                        response.pipe(file);
                                        file.on('finish', function () {
                                            file.close(callback);
                                        });
                                    });
                                },
                                function readsKeyFileAndCompare(callback) {
                                    fs.readFile('file.pem', 'utf8', function (err, data) {
                                        if (err) {
                                            logger.error(err);
                                            callback(err);
                                            return;
                                        }
                                        assert.equal(0, data.indexOf('-----BEGIN RSA PRIVATE KEY-----'), 'Downloaded file doest not start with [-----BEGIN RSA PRIVATE KEY-----]');
                                        assert.equal(data, innerHTML, 'Expecting the downloaded file\'s content to match the pem-content div');
                                    });
                                }
                            ]);
                        });
                    }).then(callback);
                },
                function (callback) {
                    globalSteps.stepValidateWidgetOutput(conf, fill, callback);
                },
                function (callback) {
                    globalSteps.stepValidateInstallationButtons(callback);
                },
                function (callback) {
                    globalSteps.stepTerminateInstances(fill, callback);
                }
            ]);
        });
    });

    // Softlayer tests

    xdescribe('Softlayer tests', function () {

        beforeEach(function (done) {
            driver = globalSteps.getChromeDriver(seleniumServerAddress);
            driver.get('http://ibmpages.gsdev.info/#/snippet/bluSolo?lang=').then(done);
        });

        afterEach(function (done) {
            setTimeout(function () {
                ec2.terminate();
                driver.close().then(function () {
                    logger.info('Closing web browser');
                    done();
                });
            }, 10000);
        });

        xit('Run with valid data', function (done) { //TODO fix me - still not updated!
            var fills = globalFunctions.getFillByFillname(conf, 'Softlayer Valid Data');
            runTest(done, fills, function (callback) {
                logger.info('Validating run');
                driver.wait(function () {
                    /*return driver.findElement(By.xpath('//div[@widget-raw-output-display='genericWidgetModel.widgetStatus.rawOutput']/parent::*')).isDisplayed().then(function (isDisplayed) {*/
                    return driver.findElement(By.css('div[widget-raw-output-display=\'genericWidgetModel\']')).isDisplayed().then(function (isDisplayed) {
                        return isDisplayed;
                    });
                }, 5000, 'output div is not displayed');

                driver.wait(function () {
                    //TODO Change to good bye...
                    return driver.isElementPresent(By.xpath('//div[contains(@class, \'widget-message\')]/div[text()[contains(.,\'Invalid Credentials\')]]')).then(function (isDisplayed) {
                        return isDisplayed;
                    });
                }, 5 * MINUTE, 'Widget message is not shown, installation might not be completed.');

                driver.findElement(By.css('div.widget-message')).getInnerHtml().then(function (innerHTML) {
                    assert.equal(innerHTML.trim(), 'Good Bye!');
                }).then(callback);
            });

        });

        it('Run with valid data', function (done) {
            var fill = globalFunctions.getFillByFillname(conf, 'Softlayer Valid Data');

            runTest(done, fill, [
                function (callback) {
                    logger.info('Validating run');

                    //Check that output div is displayed
                    driver.wait(function () {
                        return driver.findElement(By.css('div[widget-raw-output-display=\'genericWidgetModel\']')).isDisplayed().then(function (isDisplayed) {
                            return isDisplayed;
                        });
                    }, 5 * SECOND, 'output div is not displayed');

                    //Check that the output message is displayed (inside the output-div)
                    driver.findElement(By.xpath('//div[@class=\'widget-output-display\']/pre[@class=\'pre\']')).isDisplayed().then(function (isDisplayed) {
                        assert.equal(isDisplayed, true, 'Widget output is not displayed!');
                    });

                    //Check that the 'We are working hard to get your instance up and running with BLU' message is displayed
                    driver.findElement(By.xpath('//div[text()[contains(.,\'We are working hard to get your instance up and running with BLU\')]]')).isDisplayed().then(function (isDisplayed) {
                        assert.equal(isDisplayed, true, 'The text [We are working hard to get your instance up and running with BLU] is not displayed');
                    });

                    //Check that the green progress bar is displayed
                    driver.findElement(By.xpath('//div[text()[contains(.,\'We are working hard to get your instance up and running with BLU\')]]/../div[@class=\'progress\']/div[contains(@class, \'progress-bar\') and contains(@class, \'progress-bar-success\')]')).isDisplayed().then(function (isDisplayed) {
                        assert.equal(isDisplayed, true, 'The green progress bar is not displayed');
                    });

                    //Check that the output message contains 'BLU Installation started. Please wait, this might take a while...'
                    driver.findElement(By.xpath('//div[@class=\'widget-output-display\']/pre[@class=\'pre\' and contains(.,\'BLU Installation started. Please wait, this might take a while...\')]')).isDisplayed().then(function (isDisplayed) {
                        assert.equal(isDisplayed, true, 'The message [BLU Installation started. Please wait, this might take a while...] is not displayed in the widget output');
                    });

                    //Check that the output message contains 'Service 'blustratus' successfully installed'
                    driver.wait(function () {
                        return driver.isElementPresent(By.xpath('//div[@class=\'widget-output-display\']/pre[@class=\'pre\' and contains(.,\'Service "blustratus" successfully installed\')]')).then(function (isDisplayed) {
                            return isDisplayed;
                        });
                    }, 15 * MINUTE, 'Unable to find [Service "blustratus" successfully installed] in the widget output');

                    //Check the private key
                    driver.wait(function () {
                        return driver.findElement(By.xpath('//div[text()[contains(.,\'You have a new private key\')]]/..')).isDisplayed().then(function (isDisplayed) {
                            return isDisplayed;
                            //assert.equal(isDisplayed, true, 'Expecting the private key div to be visible');
                        });
                    }, 1 * MINUTE);


                    //Save the innerHTML of the private key
                    //Download the file
                    //Compare it's content with the saved innerHTML
                    driver.findElement(By.xpath('//div[text()[contains(.,\'You have a new private key\')]]/../descendant::button[text()[contains(.,\'View\')]]')).click().then(function () {
                        //Check that the pem content is displayed
                        driver.findElement(By.xpath('//div[contains(@class,\'pem-content\')]')).isDisplayed().then(function (isDisplayed) {
                            assert.equal(isDisplayed, true, 'Expecting the pem-content div to be displayed');
                        });

                        //Validating the pem content - Check that the downloadable pem file contains the same content as the pem-content div
                        driver.findElement(By.xpath('//code[text()[contains(.,\'BEGIN RSA PRIVATE KEY\')]]')).getInnerHtml().then(function (innerHTML) {
                            assert.equal(0, innerHTML.indexOf('-----BEGIN RSA PRIVATE KEY-----'), 'Downloaded file doest not start with [-----BEGIN RSA PRIVATE KEY-----]');
                            async.waterfall([
                                function clickClose(callback) { // Click on close
                                    driver.findElement(By.xpath('//div[contains(@class,\'pem-content\')]/descendant::div[@class=\'instructions\']/button[text()[contains(.,\'Close\')]]')).click()
                                        .then(callback);
                                },
                                function extractHref(callback) {
                                    driver.findElement(By.xpath('//div[text()[contains(.,\'You have a new private key\')]]/../descendant::a[text()[contains(.,\'Download\')]]')).getAttribute('href').then(function (href) {
                                        callback(null, href);
                                    });
                                },
                                function downloadKeyFile(link, callback) {
                                    http.get(link, function (response) {
                                        var file = fs.createWriteStream('file.pem');
                                        response.pipe(file);
                                        file.on('finish', function () {
                                            file.close(callback);
                                        });
                                    });
                                },
                                function readsKeyFileAndCompare(callback) {
                                    fs.readFile('file.pem', 'utf8', function (err, data) {
                                        if (err) {
                                            logger.error(err);
                                            callback(err);
                                            return;
                                        }
                                        assert.equal(0, data.indexOf('-----BEGIN RSA PRIVATE KEY-----'), 'Downloaded file doest not start with [-----BEGIN RSA PRIVATE KEY-----]');
                                        assert.equal(data, innerHTML, 'Expecting the downloaded file\'s content to match the pem-content div');
                                    });
                                }
                            ]);
                        });
                    }).then(callback);
                },function (callback) {
                    globalSteps.stepValidateWidgetOutput(conf, fill, callback);
                },
                function (callback) {
                    globalSteps.stepValidateInstallationButtons(callback);
                },
                function (callback) {
                    globalSteps.stepTerminateInstances(fill, callback);
                }
            ]);
        });


        it('Run with invalid credentials', function (done) {
            var fills = globalFunctions.getFillByFillname(conf, 'Softlayer Invalid Credentials');

            runTest(done, fills, [
                function (callback) {
                    logger.info('Validating run');

                    logger.debug('Will wait 5 seconds for the widget output');
                    driver.wait(function () {
                        /*return driver.findElement(By.xpath('//div[@widget-raw-output-display='genericWidgetModel.widgetStatus.rawOutput']/parent::*')).isDisplayed().then(function (isDisplayed) {*/
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

});


//todo : test click play


// todo : test click play again (on environment that was already installed)


// todo : test click 'stop'.


// todo : nice to have:  add emails automated test. (use yopmail?)

//TODO add check for the green loading bar (should not appear with the widget output when someone clicks on "Show full log"