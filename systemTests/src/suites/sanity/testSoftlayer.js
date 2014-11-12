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

var SECOND = 1000;
var MINUTE = 60 * SECOND;


describe('Sanity test for softlayer', function() {
    xit('Run with valid data', function (done) {
        var fill = globalFunctions.getFillByFillname(conf, 'Softlayer Valid Data');

        components.ui.layout.runTest(done, fill, [
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
                }, 90 * MINUTE, 'Unable to find [Service "blustratus" successfully installed] in the widget output');

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
            }, function (callback) {
                globalSteps.stepValidateWidgetOutput(conf, fill, callback);
            },
            function (callback) {
                globalSteps.stepValidateInstallationButtons(callback);
            }/*,
            function (callback) {
                globalSteps.stepTerminateInstances(fill, callback);
            }*/
        ]);
    });

});
