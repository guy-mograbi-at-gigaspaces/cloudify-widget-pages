// following example for selenium on nodejs
// https://code.google.com/p/selenium/wiki/WebDriverJs

'use strict';
var SECOND=1000;
var MINUTE=60*SECOND;
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

var assert = require('assert');
var path = require('path');
var meJson = path.resolve(__dirname+"/../../", process.env['ME_JSON']) || path.resolve(__dirname, '../conf/dev/me.json');
var async = require('async');
var conf = require(meJson);

var logger = require('log4js').getLogger('index');


var webdriver = require('selenium-webdriver');
var By = webdriver.By;
var driver;

function getConfiguration(fills) {
    for (var config in conf.executionOptions) {
        if (conf.executionOptions[config].name == fills.name) {
            return conf.executionOptions[config];
        }
    }
    throw new Error("Configuration with name [" + name + "] couldn't be found");
}

function fillSelect(ngModel, value) {
    logger.debug("SELECT [ng-model='" + ngModel + "', value='"+value+"']");
    var cloudProviderSelectElement = driver.findElement(By.css("select[ng-model='" + ngModel + "']"));
    cloudProviderSelectElement.click();
    //cloudProviderSelectElement.findElement(By.css("option[value='" + value + "']")).click();
    return cloudProviderSelectElement.findElement(By.xpath("//option[contains(., '" + value + "')]")).click();
}

function fillInput(ngModel, value) {
    driver.findElement(By.css("input[ng-model='" + ngModel + "']")).getAttribute("type").then(function (type) {
        if (type != 'password') {
            logger.debug("INPUT [ng-model='" + ngModel + "', value='"+value+"']");
        } else {
            logger.debug("INPUT [ng-model='" + ngModel + "'] (value is hidden) ");
        }
    });
    return driver.findElement(By.css("input[ng-model='" + ngModel + "']")).sendKeys(value);
}

function fillData(fills, callback) {
    var executionOption = getConfiguration(fills);
    logger.debug("Testing: " + executionOption["name"]);
    var requiredOptions = executionOption.fields.required;
    var optionalOptions = executionOption.fields.optional;

    var options = fills.data;
    async.eachSeries(Object.keys(options), function (field, callbackDone) {
            if (requiredOptions.hasOwnProperty(field)) {
                if (requiredOptions[field] == 'select') {
                    fillSelect(field, options[field]).then(callbackDone);
                } else if (requiredOptions[field] == 'input') {
                    fillInput(field, options[field]).then(callbackDone);
                } else {
                    throw new Error("Required field [" + field + "] is not well configured in tests");
                }
            } else if (optionalOptions.hasOwnProperty(field)) {
                if (optionalOptions[field] == 'select') {
                    fillSelect(field, options[field]).then(callbackDone);
                } else if (optionalOptions[field] == 'input') {
                    fillInput(field, options[field]).then(callbackDone);
                } else {
                    throw new Error("Optional field [" + field + "] is not well configured in tests");
                }
            } else {
                throw new Error("Unable to find configuration for field [" + field + "]");
            }
        }, callback);
}


function runTest(done, fills, validationFunction) {
    async.waterfall([
        function waitForProgressBar(callback) {
            driver.wait(function () {
                return driver.isElementPresent(By.className("progress"));
            }, 3000, "Unable to find initial loading progress bar").then(function () {
                logger.debug("Found");
                callback();
            });
        },
        function waitForProgressBarToDisappear(callback) {
            driver.wait(function () {
                return driver.findElement(By.xpath("//div[@class='progress']/parent::*")).isDisplayed().then(function (isDisplayed) {
                    return !isDisplayed;
                });
            }, 5000, "Initial loading progress bar did not disappeared").then(function () {
                logger.debug("Done!");
                callback();
            });
        },
        function fillForm(callback) {
            logger.info("Fill form")
            fillData(fills, callback);
        },
        function validateWidgetFields(callback) {
            logger.info("Validating that the Key and Secret Key are passed to the widget");
            driver.switchTo().frame(0);

            //eval(getConfiguration(fills).validate.join("\n"));

            if (fills.name == 'AWS') {
                driver.findElement(By.css("input[ng-model='advancedParams.AWS_EC2.params.key']")).getAttribute("value").then(function (text) {
                    assert.equal(text, fills.data["awsLoginDetails.params.key"]);
                });
                driver.findElement(By.css("input[ng-model='advancedParams.AWS_EC2.params.secretKey']")).getAttribute("value").then(function (text) {
                    assert.equal(text, fills.data["awsLoginDetails.params.secretKey"]);
                });
            } else if (fills.name == 'Softlayer') {
                driver.findElement(By.css("input[ng-model='advancedParams.SOFTLAYER.params.username']")).getAttribute("value").then(function (text) {
                    assert.equal(text, fills.data["softlayerLoginDetails.params.username"]);
                });
                driver.findElement(By.css("input[ng-model='advancedParams.SOFTLAYER.params.apiKey']")).getAttribute("value").then(function (text) {
                    assert.equal(text, fills.data["softlayerLoginDetails.params.apiKey"]);
                });
            } else {
                throw new Error("Unknown widget ["+fills.name+"]");
            }

            driver.switchTo().defaultContent().then(callback);

        },
        function clickSubmit(callback) {
            logger.info("Click on submit");
            driver.findElement(By.tagName("button")).click();
            callback();
        },
        validationFunction,
        function finishTest(callback) {
            logger.info("Finishing test");
            done();
            callback();
        }
    ]);
}


describe('snippet tests', function () {

    // AWS tests

    describe("AWS tests", function () {
        beforeEach(function (done) {
            driver = new webdriver.Builder().
                usingServer(conf.selenium.serverAddress).
                withCapabilities(webdriver.Capabilities.chrome()).//todo : support other browsers with configuration
                build();
            driver.get('http://ibmpages.gsdev.info/#/snippet/bluSolo?lang=');
            done();
        })

        afterEach(function (done) {
            setTimeout(function () {
                logger.info("Closing1");
                driver.close().then(function () {
                    logger.info("Closing2");
                    done();
                });
            }, 3000);
        })

        it("Run with missing security group", function (done) {
            var fills = conf.fills["AWS Missing Security Group"];

            runTest(done, fills, function(callback) {
                logger.info("Validating run");


                driver.wait(function() {
                    //return driver.findElement(By.xpath("//input[@ng-model='execution.aws.securityGroup']/parent::*/parent::*/child::div[@class='error-message ng-binding']")).isDisplayed().then(function (isDisplayed) {
                    return driver.findElement(By.xpath("//input[@ng-model='execution.aws.securityGroup']/../../div[@class='error-message ng-binding']")).isDisplayed().then(function (isDisplayed) {
                        return isDisplayed;
                    });
                }, 2 * SECOND);

                driver.findElement(By.xpath("//input[@ng-model='execution.aws.securityGroup']/parent::*/parent::*/child::div[@class='error-message ng-binding']")).getInnerHtml().then(function (innerHTML) {
                    assert.equal(innerHTML.trim(), "Value is missing");
                }).then(callback);
            });
        })

        xit("Run with valid data", function (done) {
            var fills = conf.fills["AWS Valid Data"];

            runTest(done, fills, function(callback) {
                logger.info("Validating run");
                driver.wait(function () {
                    /*return driver.findElement(By.xpath("//div[@widget-raw-output-display='genericWidgetModel.widgetStatus.rawOutput']/parent::*")).isDisplayed().then(function (isDisplayed) {*/
                    return driver.findElement(By.css("div[widget-raw-output-display='genericWidgetModel.widgetStatus.rawOutput']")).isDisplayed().then(function (isDisplayed) {
                        return isDisplayed;
                    });
                }, 5000, "output div is not displayed");

                driver.wait(function() {
                    return driver.findElement(By.css("div.widget-message")).isDisplayed().then(function (isDisplayed) {
                        return isDisplayed;
                    });

                }, 15*MINUTE, "Widget message is not shown, installation might not be completed.");

                driver.findElement(By.css("div.widget-message")).getInnerHtml().then(function (innerHTML) {
                    assert.equal(innerHTML.trim(), "Good Bye!");
                }).then(callback);
            });

        })
    });

    // Softlayer tests

    xdescribe("Softlayer tests", function () {

        beforeEach(function (done) {
            driver = new webdriver.Builder().
                usingServer(conf.selenium.serverAddress).
                withCapabilities(webdriver.Capabilities.chrome()).//todo : support other browsers with configuration
                build();
            driver.get('http://ibmpages.gsdev.info/#/snippet/bluSolo?lang=');
            done();
        })

        afterEach(function (done) {
            setTimeout(function () {
                logger.info("Closing1");
                driver.close().then(function () {
                    logger.info("Closing2");
                    done();
                });
            }, 3000);
        })

        it("Run with valid data", function (done) {
            var fills = conf.fills["Softlayer Valid Data"];
            runTest(done, fills, function(callback) {
                logger.info("Validating run");
                driver.wait(function () {
                    /*return driver.findElement(By.xpath("//div[@widget-raw-output-display='genericWidgetModel.widgetStatus.rawOutput']/parent::*")).isDisplayed().then(function (isDisplayed) {*/
                    return driver.findElement(By.css("div[widget-raw-output-display='genericWidgetModel.widgetStatus.rawOutput']")).isDisplayed().then(function (isDisplayed) {
                        return isDisplayed;
                    });
                }, 5000, "output div is not displayed");

                driver.wait(function() {
                    return driver.findElement(By.css("div.widget-message")).isDisplayed().then(function (isDisplayed) {
                        return isDisplayed;
                    });

                }, 15*MINUTE, "Widget message is not shown, installation might not be completed.");

                driver.findElement(By.css("div.widget-message")).getInnerHtml().then(function (innerHTML) {
                    assert.equal(innerHTML.trim(), "Good Bye!");
                }).then(callback);
            });

        })

        it("Run with invalid credentials", function (done) {
            var fills = conf.fills["Softlayer Invalid Credentials"];

            runTest(done, fills, function(callback) {
                logger.info("Validating run");
                driver.wait(function () {
                    /*return driver.findElement(By.xpath("//div[@widget-raw-output-display='genericWidgetModel.widgetStatus.rawOutput']/parent::*")).isDisplayed().then(function (isDisplayed) {*/
                    return driver.findElement(By.css("div[widget-raw-output-display='genericWidgetModel.widgetStatus.rawOutput']")).isDisplayed().then(function (isDisplayed) {
                        return isDisplayed;
                    });
                }, 5000, "output div is not displayed");

                driver.wait(function() {
                    return driver.findElement(By.css("div.widget-message")).isDisplayed().then(function (isDisplayed) {
                        return isDisplayed;
                    });

                }, 15*MINUTE, "Widget message is not shown, installation might not be completed.");

                driver.findElement(By.css("div.widget-message")).getInnerHtml().then(function (innerHTML) {
                    assert.equal(innerHTML.trim(), "Operation failed.");
                }).then(callback);
            });

        })
    });

});


//todo : test click play


// todo : test click play again (on environment that was already installed)


// todo : test click "stop".


// todo : nice to have:  add emails automated test. (use yopmail?)

