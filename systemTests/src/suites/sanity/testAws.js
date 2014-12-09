/**
 * Created by kinneretzin on 11/11/14.
 */

'use strict';

var components = require('../../components');
var logger = require('log4js').getLogger('testAws');
var yopmail = require('../../components/external/yopmail');
//var q = require('q');
var globalFunctions = require('../../utils/globalFunctions');
var globalSteps = require('../../utils/globalTestSteps');
var config = require('../../components/config');
var driver = require('../../components/driver');
//var By = require('selenium-webdriver').By;
var assert = require('assert');
var async = require('async');
var fs = require('fs');
var http = require('http');
var before = require('mocha').before;
var after = require('mocha').after;

var testRunner = require('../../utils/testRunner');

var SECOND = 1000;
var MINUTE = 60 * SECOND;


describe('Sanity test for aws', function () {

    before(function () {
        logger.info('initializing');
        components.init().then(function () {
            globalSteps.setDriver(driver.get());
            components.ui.page.loadWidgetPage().then();
        });
    });

    after(function () {
        components.driver.quit();

    });

    describe('Run with valid data', function () {

        var fill = globalFunctions.getFillByFillname(config, 'AWS Valid Data');

        //it('Run with valid data', function (done) {
        it('Fill form and submit', function (done) {
            testRunner.runTest(done, fill, [
                function (callback) {
                    callback();
                }
            ]);
        });


        it('Validate output layout', function (done) {
            //Check that output div is displayed
            driver.get().wait(function () {
                return components.ui.layout.getElementIsDisplayed('div[widget-raw-output-display=\'genericWidgetModel\']').then(function (isDisplayed) {
                    return isDisplayed;
                });
            }, 5 * SECOND, 'output div is not displayed');

            //Check that the output message is displayed (inside the output-div)
            components.ui.layout.getElementIsDisplayed('.widget-output-display pre.pre').then(function (isDisplayed) {
                assert.equal(isDisplayed, true, 'Widget output is not displayed!');
            });

            //Check that the 'We are working hard to get your instance up and running with BLU' message is displayed
            components.ui.layout.getElementInnerHtml('.message-items .message-item:nth-child(2) > div > div >div:nth-child(2)').then(function (innerHTML) {
                assert.equal(innerHTML.trim(), 'We are working hard to get your instance up and running with BLU', 'The text [We are working hard to get your instance up and running with BLU] isnt in the right place');
                components.ui.layout.getElementIsDisplayed('.message-items .message-item:nth-child(2) > div > div >div:nth-child(2)').then(function (isDisplayed) {
                    assert.equal(isDisplayed, true, 'The text [We are working hard to get your instance up and running with BLU] is not displayed');
                });
            });

            //Check that the green progress bar is displayed
            components.ui.layout.getElementIsDisplayed('.message-items .message-item:nth-child(2) > div > div >div:nth-child(1)').then(function (isDisplayed) {
                assert.equal(isDisplayed, true, 'The green progress bar is not displayed');
            });

            //Check that the output message contains 'BLU Installation started. Please wait, this might take a while...'
            components.ui.layout.getElementInnerHtml('.widget-output-display pre.pre').then(function (innerHTML) {
                assert.contains(innerHTML, 'BLU Installation started. Please wait, this might take a while...', 'The message [BLU Installation started. Please wait, this might take a while...] is not displayed in the widget output');
            });

            done();
        });

        it('Wait and validate output', function (done) {

            //Check that the output message contains finished successfully message
            driver.get().wait(function () {
                return components.ui.layout.getElementIsDisplayed('.message-items .message-item:nth-child(2) .finished-successfully .message').then(function (isDisplayed) {
                    return isDisplayed;
                });
            }, 30 * MINUTE, 'Unable to find [Service "blustratus" successfully installed] in the widget output');

            done();
        });

        // TODO there is a problem with the popup window, need to enlarge screen to see close button
        xit('validate private key', function (done) {
            //Check the private key
            driver.get().wait(function () {
                return components.ui.layout.getElementIsDisplayed('.message-items .message-item.pem-cell > div > .message').then(function (isDisplayed) {
                    return isDisplayed;
                });
            }, 1 * MINUTE, 'Expecting the private key div to be visible');


            //Save the innerHTML of the private key
            //Download the file
            //Compare it's content with the saved innerHTML

            components.ui.layout.clickElement('.message-items .message-item.pem-cell > div > .actions button').click().then(function () {
                //Check that the pem content is displayed
                components.ui.layout.getElementIsDisplayed('.pem-content').then(function (isDisplayed) {
                    assert.equal(isDisplayed, true, 'Expecting the pem-content div to be displayed');
                });

                //Validating the pem content - Check that the downloadable pem file contains the same content as the pem-content div
                components.ui.layout.getElementInnerHtml('code').then(function (innerHTML) {
                    assert.equal(0, innerHTML.indexOf('-----BEGIN RSA PRIVATE KEY-----'), 'Downloaded file doest not start with [-----BEGIN RSA PRIVATE KEY-----]');
                    async.waterfall([
                        function clickClose(callback) { // Click on close
                            components.ui.layout.clickElement('.pem-content .instructions button').then(callback);
                        },
                        function extractHref(callback) {
                            components.ui.layout.getElementAttribute('.message-items .message-item.pem-cell > div > .actions a', 'href').then(function (href) {
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


        it('verify mail was received ', function (done) {

            var webdriver;

            components.init().then(function () {
                webdriver = driver.get();
                globalSteps.setDriver(webdriver);
                yopmail.loginToYopMailInbox(webdriver, function () {
                    logger.info('next step: ');
                    yopmail.getLatestMessageDayAsString(webdriver, function (day) {
                        logger.info('Mail Day: ' + day);
                        var currDate = new Date();
                        var currDayOfMonth = currDate.getDate();

                        assert.equal(currDayOfMonth, day);

                    });
                    yopmail.getLatestMessageHourAsString(webdriver, function (hour) {

                        logger.info('Mail hour: ' + hour);
                        var currDate = new Date();
                        var currhour = currDate.getHours();

                        assert.equal(currhour, hour);

                        done();

                    });

                });
            });


        });

    });

});






