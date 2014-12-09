'use strict';
var SECOND = 1000;
var log4js = require('log4js');
var logger = log4js.getLogger('globalTestSteps');
var async = require('async');
var globalFunctions = require('./globalFunctions');
var webdriver = require('selenium-webdriver');
var By = webdriver.By;
var assert = require('assert');
var ec2 = require('./terminateEc2Machines');

var driver = null;

function getChromeDriver(seleniumServerAddress) {
    driver = new webdriver.Builder().
        usingServer(seleniumServerAddress).
        withCapabilities(webdriver.Capabilities.chrome()).//todo : support other browsers with configuration
        build();
    return driver;
}

exports.getChromeDriver = getChromeDriver;

exports.setDriver = function (d) {
    driver = d;
};
/**
 * Gets a fill/permutation and fills it's values to the proper html elements
 * @param fill
 * @param callback - callback of waterfall
 */
function fillData(conf, fill, callback) {

    /**
     * Gets ngModel value of a <select ngModel="..."> element and choose/clicks on <option> with text "value"
     * @param ngModel - value of a <select> element
     * @param value - value of the <option> element of the <select>.
     * @returns {!webdriver.promise.Promise.<void>}
     */
    function fillSelect(ngModel, value) {
        logger.debug('SELECT [ng-model=\'' + ngModel + '\', value=\'' + value + '\']');
        var cloudProviderSelectElement = driver.findElement(By.css('select[ng-model=\'' + ngModel + '\']'));
        cloudProviderSelectElement.click();
        return cloudProviderSelectElement.findElement(By.xpath('//option[contains(., \'' + value + '\')]')).click();
    }

    /**
     * Gets ngModel value of a <input type="checkbox" ngModel="..."> element and check/uncheck it
     * @param ngModel
     * @param value - checked/unchecked
     * @returns {!webdriver.promise.Promise.<void>}
     */
    function fillCheckbox(ngModel, value) {
        logger.debug('CHECKBOX [ng-model=\'' + ngModel + '\', status=\'' + value + '\']');
        if (value === 'checked') {
            return driver.findElement(By.css('input[ng-model=\'' + ngModel + '\']')).click();
        } else {
            return driver.findElement(By.css('input[ng-model=\'' + ngModel + '\']')).clear();
        }
    }

    /**
     * Gets ngModel value of a <input ngModel="...">  and fills it with value
     * @param ngModel
     * @param value - text to be written to the <input>
     * @returns {!webdriver.promise.Promise.<void>}
     */
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

    var executionOption = globalFunctions.getConfigurationByFill(conf, fill);
    logger.debug('Test type: ' + executionOption.name);
    var requiredOptions = executionOption.fields.required;
    var optionalOptions = executionOption.fields.optional;

    var options = fill.data;
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

exports.fillData = fillData;

/**
 * Gets the fill from the fills and terminates the instance.
 * //TODO Currently it has support for AWS only, the library is ready but we need to call the right method
 * @param fill
 * @param callback - callback of runTest (Which is the same callback for a function in the waterfall)
 */
function stepTerminateInstances(fill, callback) {
    if (fill.name === 'AWS') {
        ec2.terminate();
    } else {
        throw new Error('Unable to terminate instances of type [' + fill.name + ']: Unknown type!');
    }
    callback();
}
exports.stepTerminateInstances = stepTerminateInstances;

// Liron: the following is irrelevant for the latest changes of the widget ui - removed redundant code.
/**
 * Validate the installation buttons - the BLU and Cloudify links/buttons
 * Check that a new tab is opened when clicking on each button.
 * Check that the websites (BLU and Cloudify) are available
 * @param callback - callback of runTest (Which is the same callback for a function in the waterfall)
 */
function stepValidateInstallationButtons(callback) {
    logger.debug('Looking for [Installation completed successfully.] message');

    driver.wait(function () {
        return driver.findElement(By.css('#blu-solo-snippet > div:nth-child(3) > div > div:nth-child(2) > div > div.messages.with-pem > div.message-items > div:nth-child(2) > div.finished-successfully > div.message.ng-binding')).isDisplayed();
    }, 20 * SECOND, 'Unable to find [Installation complete successfully.] message');


    /*  driver.close().then(function () {
     logger.debug('Switching back to the widget page');
     });

     driver.wait(function () {
     return driver.findElement(By.css('#blu-solo-snippet > div:nth-child(3) > div > div:nth-child(2) > div > div.messages.with-pem > div.message-items > div:nth-child(3) > div > button')).isDisplayed();
     }, 20 * SECOND, 'Unable to find [stop and try again.] button');
     */
//
    driver.getAllWindowHandles().then(function (handles) {
        driver.switchTo().window(handles[0]);
    }).then(function () {
        logger.debug('Buttons are working! Moving on...');
        callback();
    });
}

exports.stepValidateInstallationButtons = stepValidateInstallationButtons;

/**
 * Validate the widget output for AWS run
 * Checks that the recipe properties are shown as expected
 * @param fill
 * @param callback - callback of runTest (Which is the same callback for a function in the waterfall)
 */
function stepValidateWidgetOutput(conf, fill, callback) {

    function checkTextExistenceInWidgetOutput(text) {
        logger.debug('Looking for [' + text + '] in the widget output');
        return driver.wait(function () {
            return driver.isElementPresent(By.xpath('//div[@class=\'widget-output-display\']/pre[@class=\'pre\' and contains(.,\'' + text + '\')]'));
        }, 15 * SECOND, 'Unable to find [' + text + '] in the widget output');
    }


    var recipeProperties = globalFunctions.getConfigurationByFill(conf, fill).RecipeProperties;
    var props = null;

    if (fill.name === 'AWS') {
        props = {
            'image': recipeProperties.ImageID,
            'location': recipeProperties.Region,
            'hardware': recipeProperties.HardwareId,
            'providerName': 'aws-ec2',
            'template': 'BLU_EC2',
            'securityGroup': fill.data['execution.aws.securityGroup']
        };


        checkTextExistenceInWidgetOutput('Validating provider name "' + props.providerName + '" [OK]');
        checkTextExistenceInWidgetOutput('Validating image "' + props.image + '" and hardware "' + props.hardware + '" for location "' + props.location + '" [OK]');
        checkTextExistenceInWidgetOutput('Starting validation of template "' + props.template + '"');
        checkTextExistenceInWidgetOutput('Validating security group "' + props.securityGroup + '" [OK]').then(function () {
            logger.info('All strings exit');
            callback();
        });
    } else if (fill.name === 'Softlayer') { //TODO check with the real output
        props = {
            'image': recipeProperties.ImageID,
            'location': recipeProperties.DataCenter[fill.data['execution.softlayer.dataCenter']],
            'hardware': recipeProperties.CPU[fill.data['execution.softlayer.core']] + ',' + recipeProperties.RAM[fill.data['execution.softlayer.ram']] + ',' + recipeProperties.Disk[fill.data['execution.softlayer.disk']],
            'providerName': 'softlayer',
            'template': 'BLU_FOR_CLOUD'
        };


        checkTextExistenceInWidgetOutput('Validating provider name "' + props.providerName + '" [OK]');
        checkTextExistenceInWidgetOutput('Validating image "' + props.image + '" and hardware "' + props.hardware + '" for location "' + props.location + '" [OK]');
        checkTextExistenceInWidgetOutput('Starting validation of template "' + props.template + '"').then(function () {
            logger.info('All strings exit');
            callback();
        });
    } else {
        throw new Error('stepValidateWidgetOutput: Unknown fill [' + fill.name + ']');
    }
}

exports.stepValidateWidgetOutput = stepValidateWidgetOutput;

/**
 * Check the error box content, 'Show complete log' and 'Back to form' buttons
 * @param expectedErrorMessage - the expected error message that should be displayed in the error box
 * @param callback - callback of runTest (Which is the same callback for a function in the waterfall)
 */
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

exports.stepCheckErrorBox = stepCheckErrorBox;