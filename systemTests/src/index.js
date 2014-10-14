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
var meJson = process.env['ME_JSON'] && path.resolve(__dirname + "/../../", process.env['ME_JSON']) || path.resolve(__dirname, '../conf/dev/me.json');
var async = require('async');
var conf = require(meJson);
var ec2 = require("./utils/terminateEc2Machines");
var logger = require('log4js').getLogger('index');


var webdriver = require('selenium-webdriver');
var By = webdriver.By;
var driver;
var seleniumServerAddress = process.env['SELENIUM_SERVER_ADDRESS'] || conf.selenium.serverAddress;

function getConfiguration(fills) {
    for (var config in conf.executionOptions) {
        if (conf.executionOptions[config].name == fills.name) {
            return conf.executionOptions[config];
        }
    }
    throw new Error("Configuration with name [" + name + "] couldn't be found");
}
//cloudProviderSelectElement.findElement(By.css("option[value='" + value + "']")).click();
function getFill(fillName) {
    if (conf.fills[fillName].hasOwnProperty("fillWithBase")) {
        return lodash.merge({}, conf.fills[fillName], conf.fills[conf.fills[fillName].fillWithBase]);
    } else {
        return conf.fills[fillName];
    }

}

function fillSelect(ngModel, value) {
    logger.debug("SELECT [ng-model='" + ngModel + "', value='" + value + "']");
    var cloudProviderSelectElement = driver.findElement(By.css("select[ng-model='" + ngModel + "']"));
    cloudProviderSelectElement.click();
    return cloudProviderSelectElement.findElement(By.xpath("//option[contains(., '" + value + "')]")).click();
}
function fillCheckbox(ngModel, value) {
    logger.debug("CHECKBOX [ng-model='" + ngModel + "', status='" + value + "']");
    if (value == "checked") {
        return driver.findElement(By.css("input[ng-model='" + ngModel + "']")).click();
    } else {
        return driver.findElement(By.css("input[ng-model='" + ngModel + "']")).clear();
    }
}
function fillInput(ngModel, value) {
    driver.findElement(By.css("input[ng-model='" + ngModel + "']")).getAttribute("type").then(function (type) {
        if (type != 'password') {
            logger.debug("INPUT [ng-model='" + ngModel + "', value='" + value + "']");
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
            } else if (requiredOptions[field] == 'checkbox') {
                fillCheckbox(field, options[field]).then(callbackDone);
            } else {
                throw new Error("Required field [" + field + "] is not well configured in tests");
            }
        } else if (optionalOptions.hasOwnProperty(field)) {
            if (optionalOptions[field] == 'select') {
                fillSelect(field, options[field]).then(callbackDone);
            } else if (optionalOptions[field] == 'input') {
                fillInput(field, options[field]).then(callbackDone);
            } else if (optionalOptions[field] == 'checkbox') {
                fillCheckbox(field, options[field]).then(callbackDone);
            } else {
                throw new Error("Optional field [" + field + "] is not well configured in tests");
            }
        } else {
            throw new Error("Unable to find configuration for field [" + field + "]");
        }
    }, callback);
}

function stepTerminateInstances(fill, callback) {
    if (fill.name == 'AWS') {
        ec2.terminate();
    } else {
        throw new Error("Unknown fill [" + fill.name + "]");
    }
    callback();
}

function runTest(done, fills, validationFunction) {
    var steps = [
        function waitForProgressBar(callback) {
            driver.wait(function () {
                return driver.isElementPresent(By.xpath("//div[@class='progress']/.."));
            }, 15000, "Unable to find initial loading progress bar").then(function () {
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
                throw new Error("Unknown widget [" + fills.name + "]");
            }

            driver.switchTo().defaultContent().then(callback);

        },
        function validateRecipeProperties(callback) {
            logger.info("Validating recipe properties");

            driver.wait(function () {
                return driver.findElement(By.xpath("//button[contains(., 'Show Properties')]")).isDisplayed().then(function (isDisplayed) {
                    return isDisplayed;
                })
            }, 1 * SECOND, "Unable to find displayed 'Show Properties' button");

            driver.findElement(By.xpath("//div[contains(@style, 'background-color:orange')]/button[contains(., 'Show Properties')]/..")).isDisplayed().then(function (isDisplayed) {
                assert.equal(isDisplayed, true, "Unable to find the orange box of the recipe properties");
            })

            driver.findElement(By.xpath("//button[contains(., 'Show Properties')]")).click().then(function () {
                driver.findElement(By.xpath("//button[contains(., 'Show Properties')]")).isDisplayed().then(function (isDisplayed) {
                    assert.equal(false, isDisplayed, "The 'Show Properties' button still displayed!");
                }).then(function () {
                    driver.findElement(By.css("div.recipe-properties")).isDisplayed().then(function (isDisplayed) {
                        assert.equal(true, isDisplayed, "The properties box is not displayed");
                    })
                    driver.findElement(By.xpath("//button[contains(., 'Hide')]")).isDisplayed().then(function (isDisplayed) {
                        assert.equal(true, isDisplayed, "The 'Hide' button is not displayed");
                    })
                })
            }).then(function () {
                if (fills.name == 'AWS') {
                    var keyValue = {
                        "EC2_REGION": getConfiguration(fills)["RecipeProperties"]["Region"],
                        "BLU_EC2_HARDWARE_ID": getConfiguration(fills)["RecipeProperties"]["HardwareId"]
                    }
                    async.eachSeries(Object.keys(keyValue), function (key, callbackDone) {
                        driver.findElement(By.xpath("//div[@class='recipe-properties']/table/tbody/tr/td[contains(.,'"+key+"')]/../td[last()]")).getInnerHtml().then(function (value) {
                            assert.equal(value,keyValue[key], "Unexpected value for recipe property ["+key+"]");
                        }).then(callbackDone);
                    })
                }
            }).then(callback)
        },
        function clickSubmit(callback) {
            logger.info("Click on submit");
            driver.findElement(By.xpath("//button[contains(., 'Submit')]")).click();
            callback();
        }]
        .concat(validationFunction)
        .concat(
        [
            function finishTest(callback) {
                logger.info("Finishing test");
                done();
                callback();
            }
        ]
    );
    async.waterfall(steps);
}


describe('snippet tests', function () {

    // AWS tests

    describe("AWS tests", function () {


        beforeEach(function (done) {
            driver = new webdriver.Builder().
                usingServer(seleniumServerAddress).
                withCapabilities(webdriver.Capabilities.chrome()).//todo : support other browsers with configuration
                build();
            driver.get('http://ibmpages.gsdev.info/#/snippet/bluSolo?lang=');
            done();
        })

        afterEach(function (done) {
            setTimeout(function () {
                driver.close().then(function () {
                    logger.info("Closing web browser");
                    done();
                });
            }, 3000);
        })

        it("Run with missing security group", function (done) {
            var fill = getFill("AWS Missing Security Group");

            runTest(done, fill, [
                function (callback) {
                    logger.info("Validating run");


                    driver.wait(function () {
                        //return driver.findElement(By.xpath("//input[@ng-model='execution.aws.securityGroup']/parent::*/parent::*/child::div[@class='error-message ng-binding']")).isDisplayed().then(function (isDisplayed) {
                        return driver.findElement(By.xpath("//input[@ng-model='execution.aws.securityGroup']/../../div[@class='error-message ng-binding']")).isDisplayed().then(function (isDisplayed) {
                            return isDisplayed;
                        });
                    }, 2 * SECOND, "Unable to find error message box for securityGroups");

                    driver.findElement(By.xpath("//input[@ng-model='execution.aws.securityGroup']/parent::*/parent::*/child::div[@class='error-message ng-binding']")).getInnerHtml().then(function (innerHTML) {
                        assert.equal(innerHTML.trim(), "Value is missing");
                    }).then(callback);
                }
            ]);
        })

        it("Run with valid data", function (done) {
            var fill = getFill("AWS Valid Data");

            runTest(done, fill, [
                function (callback) {
                    logger.info("Validating run");
                    driver.wait(function () {
                        /*return driver.findElement(By.xpath("//div[@widget-raw-output-display='genericWidgetModel.widgetStatus.rawOutput']/parent::*")).isDisplayed().then(function (isDisplayed) {*/
                        return driver.findElement(By.css("div[widget-raw-output-display='genericWidgetModel']")).isDisplayed().then(function (isDisplayed) {
                            return isDisplayed;
                        });
                    }, 5000, "output div is not displayed");

                    driver.wait(function () {
                        return driver.findElement(By.xpath("//div[@class='widget-output-display']/pre[@class='pre']")).isDisplayed().then(function (isDisplayed) {
                            return isDisplayed;
                        });

                    }, 15 * MINUTE, "Widget message is not shown, installation might not be completed.");

                    driver.findElement(By.css("div.widget-message")).getInnerHtml().then(function (innerHTML) {
                        assert.equal(innerHTML.trim(), "Good Bye!");
                    }).then(callback);
                },
                function (callback) {
                    stepTerminateInstances(fill, callback);
                }
            ]);
        })
    });

    // Softlayer tests

    xdescribe("Softlayer tests", function () {

        beforeEach(function (done) {
            driver = new webdriver.Builder().
                usingServer(seleniumServerAddress).
                withCapabilities(webdriver.Capabilities.chrome()).//todo : support other browsers with configuration
                build();
            driver.get('http://ibmpages.gsdev.info/#/snippet/bluSolo?lang=');
            done();
        })

        afterEach(function (done) {
            setTimeout(function () {
                driver.close().then(function () {
                    logger.info("Closing web browser");
                    done();
                });
            }, 10000);
        })

        it("Run with valid data", function (done) {
            var fills = getFill("Softlayer Valid Data");
            runTest(done, fills, function (callback) {
                logger.info("Validating run");
                driver.wait(function () {
                    /*return driver.findElement(By.xpath("//div[@widget-raw-output-display='genericWidgetModel.widgetStatus.rawOutput']/parent::*")).isDisplayed().then(function (isDisplayed) {*/
                    return driver.findElement(By.css("div[widget-raw-output-display='genericWidgetModel']")).isDisplayed().then(function (isDisplayed) {
                        return isDisplayed;
                    });
                }, 5000, "output div is not displayed");

                driver.wait(function () {
                    return driver.findElement(By.css("div.widget-message")).isDisplayed().then(function (isDisplayed) {
                        return isDisplayed;
                    });

                }, 15 * MINUTE, "Widget message is not shown, installation might not be completed.");

                driver.findElement(By.css("div.widget-message")).getInnerHtml().then(function (innerHTML) {
                    assert.equal(innerHTML.trim(), "Good Bye!");
                }).then(callback);
            });

        })

        it("Run with invalid credentials", function (done) {
            var fills = getFill("Softlayer Invalid Credentials");

            runTest(done, fills, function (callback) {
                logger.info("Validating run");
                driver.wait(function () {
                    /*return driver.findElement(By.xpath("//div[@widget-raw-output-display='genericWidgetModel.widgetStatus.rawOutput']/parent::*")).isDisplayed().then(function (isDisplayed) {*/
                    return driver.findElement(By.css("div[widget-raw-output-display='genericWidgetModel']")).isDisplayed().then(function (isDisplayed) {
                        return isDisplayed;
                    });
                }, 5000, "output div is not displayed");

                driver.wait(function () {
                    return driver.findElement(By.css("div.widget-message")).isDisplayed().then(function (isDisplayed) {
                        return isDisplayed;
                    });

                }, 15 * MINUTE, "Widget message is not shown, installation might not be completed.");

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

