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
var log4js = require('log4js');

try {
    if (!!conf && !!conf.log4js) {
        log4js.configure(conf.log4js);
    }
} catch (e) {
    console.log('error while configuring log4js', e);
}

var logger = log4js.getLogger('index');
var http = require('http');
var fs = require('fs');


process.on('exit', function () {
    console.log('terminating');
    log4js.shutdown();
});


var webdriver = require('selenium-webdriver');
var By = webdriver.By;
var driver;
var seleniumServerAddress = process.env.SELENIUM_SERVER_ADDRESS || conf.selenium.serverAddress;
var forceMachinesShutdown = process.env.FORCE_MACHINES_SHUTDOWN || true;

function getConfiguration(fills) {
    for (var config in conf.executionOptions) {
        if (conf.executionOptions[config].name === fills.name) {
            return conf.executionOptions[config];
        }
    }
    throw new Error('Configuration with name [' + name + '] couldn\'t be found');
}
//cloudProviderSelectElement.findElement(By.css("option[value='" + value + "']")).click();
function getFill(fillName) {
    if (conf.fills[fillName].hasOwnProperty('fillWithBase')) {
        return lodash.merge({}, conf.fills[fillName], conf.fills[conf.fills[fillName].fillWithBase]);
    } else {
        return conf.fills[fillName];
    }

}

function fillSelect(ngModel, value) {
    logger.debug('SELECT [ng-model=\'' + ngModel + '\', value=\'' + value + '\']');
    var cloudProviderSelectElement = driver.findElement(By.css('select[ng-model=\'' + ngModel + '\']'));
    cloudProviderSelectElement.click();
    return cloudProviderSelectElement.findElement(By.xpath('//option[contains(., \'' + value + '\')]')).click();
}
function fillCheckbox(ngModel, value) {
    logger.debug('CHECKBOX [ng-model=\'' + ngModel + '\', status=\'' + value + '\']');
    if (value === 'checked') {
        return driver.findElement(By.css('input[ng-model=\'' + ngModel + '\']')).click();
    } else {
        return driver.findElement(By.css('input[ng-model=\'' + ngModel + '\']')).clear();
    }
}
function fillInput(ngModel, value) {
    driver.findElement(By.css('input[ng-model=\'' + ngModel + '\']')).getAttribute('type').then(function (type) {
        if (type !== 'password') {
            logger.debug('INPUT [ng-model=\'' + ngModel + '\', value=\'' + value + '\']');
        } else {
            logger.debug('INPUT [ng-model=\'' + ngModel + '\'] (value is hidden) ');
        }
    });
    return driver.findElement(By.css('input[ng-model=\'' + ngModel + '\']')).sendKeys(value);
}


function fillData(fills, callback) {
    var executionOption = getConfiguration(fills);
    logger.debug('Testing: ' + executionOption.name);
    var requiredOptions = executionOption.fields.required;
    var optionalOptions = executionOption.fields.optional;

    var options = fills.data;
    async.eachSeries(Object.keys(options), function (field, callbackDone) {
        if (requiredOptions.hasOwnProperty(field)) {
            if (requiredOptions[field] === 'select') {
                fillSelect(field, options[field]).then(callbackDone);
            } else if (requiredOptions[field] === 'input') {
                fillInput(field, options[field]).then(callbackDone);
            } else if (requiredOptions[field] === 'checkbox') {
                fillCheckbox(field, options[field]).then(callbackDone);
            } else {
                throw new Error('Required field [' + field + '] is not well configured in tests');
            }
        } else if (optionalOptions.hasOwnProperty(field)) {
            if (optionalOptions[field] === 'select') {
                fillSelect(field, options[field]).then(callbackDone);
            } else if (optionalOptions[field] === 'input') {
                fillInput(field, options[field]).then(callbackDone);
            } else if (optionalOptions[field] === 'checkbox') {
                fillCheckbox(field, options[field]).then(callbackDone);
            } else {
                throw new Error('Optional field [' + field + '] is not well configured in tests');
            }
        } else {
            throw new Error('Unable to find configuration for field [' + field + ']');
        }
    }, callback);
}

function stepTerminateInstances(fill, callback) {
    if (fill.name === 'AWS') {
        ec2.terminate();
    } else {
        throw new Error('Unknown fill [' + fill.name + ']');
    }
    callback();
}

function runTest(done, fills, validationFunction) {
    var steps = [
        function waitForProgressBar(callback) {
            driver.wait(function () {
                return driver.isElementPresent(By.xpath('//div[@class=\'progress\']/..'));
            }, 2 * MINUTE, 'Unable to find initial loading progress bar').then(function () {
                logger.debug('Found');
                callback();
            });
        },
        function waitForProgressBarToDisappear(callback) {
            driver.wait(function () {
                return driver.findElement(By.xpath('//div[@class=\'progress\']/parent::*')).isDisplayed().then(function (isDisplayed) {
                    return !isDisplayed;
                });
            }, 5000, 'Initial loading progress bar did not disappeared').then(function () {
                logger.debug('Done!');
                callback();
            });
        },
        function fillForm(callback) {
            logger.info('Fill form');
            fillData(fills, callback);
        },
        function validateWidgetFields(callback) { // Check that the credentials passed to the widget (iframe) fields
            logger.info('Validating that the Key and Secret Key are passed to the widget');
            driver.switchTo().frame(0);


            if (fills.name === 'AWS') {
                driver.findElement(By.css('input[ng-model=\'advancedParams.AWS_EC2.params.key\']')).getAttribute('value').then(function (text) {
                    assert.equal(text, fills.data['awsLoginDetails.params.key']);
                });
                driver.findElement(By.css('input[ng-model=\'advancedParams.AWS_EC2.params.secretKey\']')).getAttribute('value').then(function (text) {
                    assert.equal(text, fills.data['awsLoginDetails.params.secretKey']);
                });
            } else if (fills.name === 'Softlayer') {
                driver.findElement(By.css('input[ng-model=\'advancedParams.SOFTLAYER.params.username\']')).getAttribute('value').then(function (text) {
                    assert.equal(text, fills.data['softlayerLoginDetails.params.username']);
                });
                driver.findElement(By.css('input[ng-model=\'advancedParams.SOFTLAYER.params.apiKey\']')).getAttribute('value').then(function (text) {
                    assert.equal(text, fills.data['softlayerLoginDetails.params.apiKey']);
                });
            } else {
                throw new Error('Unknown widget [' + fills.name + ']');
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
                var recipeProperties = getConfiguration(fills).RecipeProperties;
                var keyValue = null;
                if (fills.name === 'AWS') {
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
                } else if (fills.name === 'Softlayer') {
                    keyValue = {
                        'Key': 'Value',
                        'locationId': recipeProperties.DataCenter[fills.data['execution.softlayer.dataCenter']],
                        'hardwareId': recipeProperties.CPU[fills.data['execution.softlayer.core']] + ',' + recipeProperties.RAM[fills.data['execution.softlayer.ram']] + ',' + recipeProperties.Disk[fills.data['execution.softlayer.disk']]
                    };
                    async.eachSeries(Object.keys(keyValue), function (key, callbackDone) {
                        driver.findElement(By.xpath('//div[@class=\'recipe-properties\']/table/tbody/tr/td[contains(.,\'' + key + '\')]/../td[last()]')).getInnerHtml().then(function (value) {
                            assert.equal(value, keyValue[key], 'Unexpected value for recipe property [' + key + ']');
                        }).then(callbackDone);
                    });
                } else {
                    throw new Error('Unknown option [' + fills.name + '] for recipe properties');
                }
            }).then(function () {
                driver.findElement(By.xpath('//button[contains(., \'Hide\')]')).click();
                //TODO nice to have - add verifications for Show/Hide click results
            }).then(callback);
        },
        function clickSubmit(callback) {
            logger.info('Click on submit');
            driver.findElement(By.xpath('//button[contains(., \'Submit\')]')).click();
            callback();
        }
    ].concat(validationFunction)
        .concat(
        [
            function finishTest(callback) {
                logger.info('Finishing test');
                done();
                callback();
            }
        ]
    );
    async.waterfall(steps);
}

function stepCheckErrorBox(expectedErrorMessage, callback) {
    /**
     * Define Some functions that is called from the following waterfall.
     */
    function checkFormIsDisplayedAndOutputIsNot(innerCallback) {
        //Check Error message
        logger.debug('Checking the error message');
        driver.findElement(By.xpath('//div[contains(@class, \'widget-message\')]')).isDisplayed().then(function (isDisplayed) {
            assert.equal(isDisplayed, true, 'Error message box should be displayed');
        }).then(function () {
            logger.debug('Checking the error message');
        });

        driver.findElement(By.xpath('//div[contains(@class, \'widget-message\')]/div')).getInnerHtml().then(function (innerHTML) {
            assert.equal(innerHTML.trim(), expectedErrorMessage, 'Unexpected error message');
        }).then(function () {
            logger.debug('Checking that widget output is hidden');
        });

        //Check that the widget output div is not displayed
        driver.findElement(By.xpath('//div[@class=\'widget-output-display\']')).isDisplayed().then(function (isDisplayed) {
            assert.equal(isDisplayed, false, 'Expecting the widget output to be hidden');
        }).then(function () {
            logger.debug('Checking that the form is displayed');
        });

        //Check that the initial form is displayed
        driver.findElement(By.xpath('//div[contains(@class,\'form\')]')).isDisplayed().then(function (isDisplayed) {
            assert.equal(isDisplayed, true, 'Expecting the form to be visible');
        }).then(function () {
            logger.debug('Checking that the \'Show complete log\' button is visible');
        });

        //Check that the 'Show complete log' button is displayed
        driver.findElement(By.xpath('//div[contains(@class, \'widget-message\')]/button[contains(.,\'Show complete log\')]')).isDisplayed().then(function (isDisplayed) {
            assert.equal(isDisplayed, true, 'Expecting the \'Show complete log\' button to be visible');
        }).then(function () {
            logger.debug('Checking that the \'Back to form\' button is invisible');
        });

        //Check that 'Back to form' button is not displayed
        driver.findElement(By.xpath('//div[contains(@class, \'widget-message\')]/button[contains(.,\'Back to form\')]')).isDisplayed().then(function (isDisplayed) {
            assert.equal(isDisplayed, false, 'Expecting the \'Back to form\' button to be invisible');
        }).then(function () {
            logger.debug('Checking that the Green progress bar is not displayed');
        });

        //Check that the green progress bar is not displayed
        driver.findElement(By.xpath('//div[@class=\'messages\']//div[@class=\'progress\']/div[contains(@class, \'progress-bar\') and contains(@class, \'progress-bar-success\')]')).isDisplayed().then(function (isDisplayed) {
            assert.equal(isDisplayed, false, 'Expecting the green progress bar to be invisible');
        }).then(function () {
            logger.debug('Checking that the progress message is not displayed');
        });

        //Check that the progress message is not displayed
        driver.findElement(By.xpath('//div[@class=\'messages\']/descendant::div[text()[contains(.,\'We are working hard to get your instance up and running with BLU\')]]')).isDisplayed().then(function (isDisplayed) {
            assert.equal(isDisplayed, false, 'Expecting the installationInProgressMessage[We are working hard to get your instance up and running with BLU] message to be invisible');
        }).then(innerCallback);
    }

    function checkOutputIsDisplayedAndFormIsNot(innerCallback) {
        //Check that the widget output div is displayed
        logger.debug('Checking that widget output is visible');
        driver.findElement(By.xpath('//div[@class=\'widget-output-display\']')).isDisplayed().then(function (isDisplayed) {
            assert.equal(isDisplayed, true, 'Expecting the widget output to be visible');
        }).then(function () {
            logger.debug('Checking that the form is hidden');
        });

        //Check that the initial form is not displayed
        driver.findElement(By.xpath('//div[contains(@class,\'form\')]')).isDisplayed().then(function (isDisplayed) {
            assert.equal(isDisplayed, false, 'Expecting the form to be hidden');
        }).then(function () {
            logger.debug('Checking that the \'Show complete log\' button is invisible');
        });

        //Check that the 'Show complete log' button is not displayed
        driver.findElement(By.xpath('//div[contains(@class, \'widget-message\')]/button[contains(.,\'Show complete log\')]')).isDisplayed().then(function (isDisplayed) {
            assert.equal(isDisplayed, false, 'Expecting the \'Show complete log\' button to be invisible');
        }).then(function () {
            logger.debug('Checking that the \'Back to form\' button is visible');
        });

        //Check that the 'Back to form' button is displayed
        driver.findElement(By.xpath('//div[contains(@class, \'widget-message\')]/button[contains(.,\'Back to form\')]')).isDisplayed().then(function (isDisplayed) {
            assert.equal(isDisplayed, true, 'Expecting the \'Back to form\' button to be visible');
        }).then(function () {
            logger.debug('Checking that the Green progress bar is not displayed');
        });

        //Check that the green progress bar is not displayed
        driver.findElement(By.xpath('//div[@class=\'messages\']//div[@class=\'progress\']/div[contains(@class, \'progress-bar\') and contains(@class, \'progress-bar-success\')]')).isDisplayed().then(function (isDisplayed) {
            assert.equal(isDisplayed, false, 'Expecting the green progress bar to be invisible');
        }).then(function () {
            logger.debug('Checking that the progress message is not displayed');
        });

        //Check that the progress message is not displayed
        driver.findElement(By.xpath('//div[@class=\'messages\']/descendant::div[text()[contains(.,\'We are working hard to get your instance up and running with BLU\')]]')).isDisplayed().then(function (isDisplayed) {
            assert.equal(isDisplayed, false, 'Expecting the [We are working hard to get your instance up and running with BLU] message to be invisible');
        }).then(innerCallback);
    }

    function clickOnShowCompleteLogButton(innerCallback) {
        //Click on 'Show complete log' button in the error-message-box
        logger.debug('Clicking on the \'Show complete log\' button');
        driver.findElement(By.xpath('//div[contains(@class, \'widget-message\')]/button[contains(.,\'Show complete log\')]')).click()
            .then(innerCallback);
    }

    function clickOnBackToFormButton(innerCallback) {
        //Click on 'Back to form' button in the error-message-box
        logger.debug('Clicking on the \'Back to form\' button');
        driver.findElement(By.xpath('//div[contains(@class, \'widget-message\')]/button[contains(.,\'Back to form\')]')).click()
            .then(innerCallback);
    }

    async.waterfall([
        checkFormIsDisplayedAndOutputIsNot,
        clickOnShowCompleteLogButton,
        checkOutputIsDisplayedAndFormIsNot,
        clickOnBackToFormButton,
        checkFormIsDisplayedAndOutputIsNot,
        function (cb) {
            callback();
            cb();
        }
    ]);
}

xdescribe('snippet tests', function () {
    // AWS tests

    describe('AWS tests', function () {


        beforeEach(function (done) {
            driver = new webdriver.Builder().
                usingServer(seleniumServerAddress).
                withCapabilities(webdriver.Capabilities.chrome()).//todo : support other browsers with configuration
                build();
            driver.get('http://ibmpages.gsdev.info/#/snippet/bluSolo?lang=').then(done);
        });

        afterEach(function (done) {
            setTimeout(function () {
                driver.close().then(function () {
                    logger.info('Closing web browser');
                    done();
                });
            }, 3000);
        });

        afterEach(function (done) {
            if (forceMachinesShutdown) {
                logger.info('Terminating EC2 machines');
                ec2.terminate(function (numOfTerminatedInstances) {
                    if (numOfTerminatedInstances > 0) {
                        logger.error('There were un-terminated instances [' + numOfTerminatedInstances + ']');
                    }
                    done();
                });
            } else {
                done();
            }
        });

        it('Run with missing security group', function (done) {
            var fill = getFill('AWS Missing Security Group');

            runTest(done, fill, [
                function (callback) {
                    logger.info('Validating run');

                    driver.wait(function () {
                        //return driver.findElement(By.xpath('//input[@ng-model='execution.aws.securityGroup']/parent::*/parent::*/child::div[@class='error-message ng-binding']')).isDisplayed().then(function (isDisplayed) {
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
            var fill = getFill('AWS Valid Data');

            runTest(done, fill, [
                function (callback) {
                    logger.info('Validating run');

                    //Check that output div is displayed
                    driver.wait(function () {
                        /*return driver.findElement(By.xpath('//div[@widget-raw-output-display='genericWidgetModel.widgetStatus.rawOutput']/parent::*')).isDisplayed().then(function (isDisplayed) {*/
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
                        return driver.isElementPresent(By.xpath('//div[@class=\'widget-output-display\']/pre[@class=\'pre\' and contains(.,\'Service \'blustratus\' successfully installed\')]')).then(function (isDisplayed) {
                            return isDisplayed;
                        });
                    }, 15 * MINUTE, 'Unable to find [Service \'blustratus\' successfully installed] in the widget output');


                    //Check the private key
                    driver.findElement(By.xpath('//div[text()[contains(.,\'You have a new private key\')]]/..')).isDisplayed().then(function (isDisplayed) {
                        assert.equal(isDisplayed, true, 'Expecting the private key div to be visible');
                    });

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
                                function (callback) { // Click on close
                                    driver.findElement(By.xpath('//div[contains(@class,\'pem-content\')]/descendant::div[@class=\'instructions\']/button[text()[contains(.,\'Close\')]]')).click()
                                        .then(callback);
                                },
                                function (callback) {
                                    driver.findElement(By.xpath('//div[text()[contains(.,\'You have a new private key\')]]/../descendant::a[text()[contains(.,\'Download\')]]')).getAttribute('href').then(function (href) {
                                        callback(null, href);
                                    });
                                },
                                function (link, callback) {
                                    http.get(link, function (response) {
                                        var file = fs.createWriteStream('file.pem');
                                        response.pipe(file);
                                        file.on('finish', function () {
                                            file.close(callback);
                                        });
                                    });
                                },
                                function (callback) {
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
                    stepTerminateInstances(fill, callback);
                }
            ]);
        });
    });

    // Softlayer tests

    xdescribe('Softlayer tests', function () {

        beforeEach(function (done) {
            driver = new webdriver.Builder().
                usingServer(seleniumServerAddress).
                withCapabilities(webdriver.Capabilities.chrome()).//todo : support other browsers with configuration
                build();
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
            var fills = getFill('Softlayer Valid Data');
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

        it('Run with invalid credentials', function (done) {
            var fills = getFill('Softlayer Invalid Credentials');

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
                    stepCheckErrorBox('Invalid Credentials', callback);
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