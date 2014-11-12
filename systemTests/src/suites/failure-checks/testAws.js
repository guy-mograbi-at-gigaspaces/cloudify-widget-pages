/**
 * Created by kinneretzin on 11/11/14.
 */

'use strict';

var components = require('../../components');
var logger = require('log4js').getLogger('testAws');
var q= require('q');
var globalFunctions = require('../../utils/globalFunctions');
var globalSteps = require('../../utils/globalTestSteps');
var config = require('../../components/config');
var driver = require('../../components/driver');
var By = require('selenium-webdriver').By;

var SECOND = 1000;
var MINUTE = 60 * SECOND;


describe('Sanity test for aws', function() {

    xit('Run with missing security group', function (done) {
        var fill = globalFunctions.getFillByFillname(config, 'AWS Missing Security Group');

        components.ui.layout.runTest(done, fill, [
            function (callback) {
                logger.info('Validating run');

//                driver.get().wait(function() {
//                    components.ui.layout.getElementIsDisplayed(By.xpath('//input[@ng-model=\'execution.aws.securityGroup\']/../../div[@class=\'error-message ng-binding\']')).then(function(value){
//                        assert.equal(value,true, 'Unable to find error message box for securityGroups');
//
//                        components.ui.layout.getElementInnerHtml(By.xpath('//input[@ng-model=\'execution.aws.securityGroup\']/parent::*/parent::*/child::div[@class=\'error-message ng-binding\']')).then(function(value){
//                            assert.equal(value, 'Value is missing');
//                        }).then(callback);
//                    });
//                },2 * SECOND);

                driver.get().wait(function () {
                    return driver.findElement(By.xpath('//input[@ng-model=\'execution.aws.securityGroup\']/../../div[@class=\'error-message ng-binding\']')).isDisplayed().then(function (isDisplayed) {
                        return isDisplayed;
                    });
                }, 2 * SECOND, 'Unable to find error message box for securityGroups');


                driver.get().findElement(By.xpath('//input[@ng-model=\'execution.aws.securityGroup\']/parent::*/parent::*/child::div[@class=\'error-message ng-binding\']')).getInnerHtml().then(function (innerHTML) {
                    assert.equal(innerHTML.trim(), 'Value is missing');
                }).then(callback);

            }
        ]);
    });
});
