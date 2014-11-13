/**
 * Created by kinneretzin on 11/11/14.
 */

'use strict';

var components = require('../../components');
var logger = require('log4js').getLogger('testAws');
var q = require('q');
var globalFunctions = require('../../utils/globalFunctions');
var globalSteps = require('../../utils/globalTestSteps');
var config = require('../../components/config');
var driver = require('../../components/driver');
var By = require('selenium-webdriver').By;
var assert = require('assert');
var async = require('async');


var SECOND = 1000;
var MINUTE = 60 * SECOND;


describe('Sanity test for aws', function () {

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

    describe('Run with valid data', function () {

        var fill = globalFunctions.getFillByFillname(config, 'AWS Valid Data');

        //it('Run with valid data', function (done) {
        it('Fill form and submit', function (done) {
            components.ui.layout.runTest(done, fill, [
                function (callback) {
                    callback();
                }
            ]);
        });


        it('Validate output layout', function (done) {
            //Check that output div is displayed
            driver.get().wait(function () {
                return driver.get().findElement(By.css('div[widget-raw-output-display=\'genericWidgetModel\']')).isDisplayed().then(function (isDisplayed) {
                    return isDisplayed;
                });
            }, 5 * SECOND, 'output div is not displayed');

            //Check that the output message is displayed (inside the output-div)
            driver.get().findElement(By.xpath('//div[@class=\'widget-output-display\']/pre[@class=\'pre\']')).isDisplayed().then(function (isDisplayed) {
                assert.equal(isDisplayed, true, 'Widget output is not displayed!');
            });

            //Check that the 'We are working hard to get your instance up and running with BLU' message is displayed
            driver.get().findElement(By.xpath('//div[text()[contains(.,\'We are working hard to get your instance up and running with BLU\')]]')).isDisplayed().then(function (isDisplayed) {
                assert.equal(isDisplayed, true, 'The text [We are working hard to get your instance up and running with BLU] is not displayed');
            });

            //Check that the green progress bar is displayed
            driver.get().findElement(By.xpath('//div[text()[contains(.,\'We are working hard to get your instance up and running with BLU\')]]/../div[@class=\'progress\']/div[contains(@class, \'progress-bar\') and contains(@class, \'progress-bar-success\')]')).isDisplayed().then(function (isDisplayed) {
                assert.equal(isDisplayed, true, 'The green progress bar is not displayed');
            });

            //Check that the output message contains 'BLU Installation started. Please wait, this might take a while...'
            driver.get().findElement(By.xpath('//div[@class=\'widget-output-display\']/pre[@class=\'pre\' and contains(.,\'BLU Installation started. Please wait, this might take a while...\')]')).isDisplayed().then(function (isDisplayed) {
                assert.equal(isDisplayed, true, 'The message [BLU Installation started. Please wait, this might take a while...] is not displayed in the widget output');
            });

            done();
        });

        it('Wait and validate output', function (done) {

            //Check that the output message contains 'Service 'blustratus' successfully installed'
            driver.get().wait(function () {
                return driver.get().isElementPresent(By.xpath('//div[@class=\'widget-output-display\']/pre[@class=\'pre\' and contains(.,\'Service "blustratus" successfully installed\')]')).then(function (isDisplayed) {
                    return isDisplayed;
                });
            }, 20 * MINUTE, 'Unable to find [Service "blustratus" successfully installed] in the widget output').then(done);
        });

        xit('validate private key', function () {
            //Check the private key
            driver.get().wait(function () {
                return driver.get().findElement(By.xpath('//div[text()[contains(.,\'You have a new private key\')]]/..')).isDisplayed().then(function (isDisplayed) {
                    return isDisplayed;
                    //assert.equal(isDisplayed, true, 'Expecting the private key div to be visible');
                });
            }, 1 * MINUTE);


            //Save the innerHTML of the private key
            //Download the file
            //Compare it's content with the saved innerHTML

            driver.get().findElement(By.xpath('//div[text()[contains(.,\'You have a new private key\')]]/../descendant::button[text()[contains(.,\'View\')]]')).click().then(function () {
                //Check that the pem content is displayed
                driver.get().findElement(By.xpath('//div[contains(@class,\'pem-content\')]')).isDisplayed().then(function (isDisplayed) {
                    assert.equal(isDisplayed, true, 'Expecting the pem-content div to be displayed');
                });

                //Validating the pem content - Check that the downloadable pem file contains the same content as the pem-content div
                driver.get().findElement(By.xpath('//code[text()[contains(.,\'BEGIN RSA PRIVATE KEY\')]]')).getInnerHtml().then(function (innerHTML) {
                    assert.equal(0, innerHTML.indexOf('-----BEGIN RSA PRIVATE KEY-----'), 'Downloaded file doest not start with [-----BEGIN RSA PRIVATE KEY-----]');
                    async.waterfall([
                        function clickClose(callback) { // Click on close
                            driver.get().findElement(By.xpath('//div[contains(@class,\'pem-content\')]/descendant::div[@class=\'instructions\']/button[text()[contains(.,\'Close\')]]')).click()
                                .then(callback);
                        },
                        function extractHref(callback) {
                            driver.get().findElement(By.xpath('//div[text()[contains(.,\'You have a new private key\')]]/../descendant::a[text()[contains(.,\'Download\')]]')).getAttribute('href').then(function (href) {
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
            }).then(done);
        });

        it('validate widget output', function (done) {
            globalSteps.stepValidateWidgetOutput(config, fill, done);
        });

        it('validate installation buttons', function (done) {
            globalSteps.stepValidateInstallationButtons(done);
        });

    });

});
