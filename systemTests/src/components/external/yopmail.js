/**
 * Created by liron on 11/18/14.
 */

'use strict';

var logger = require('log4js').getLogger('yopmail api');
var By = require('selenium-webdriver').By;


exports.loginToYopMailInbox = function (webdriver, callback) {

    logger.info('loginToYopmail');
    var retval = false;

    webdriver.get('http://www.yopmail.com/en/?login=cloudifywidgettest123').then(function () {
        logger.info('waiting for frame to load');
        var x = false;
        webdriver.wait(function () {
            setTimeout(function () {
                x = true;
            }, 5000);
            return x;
        }, 7000);

        logger.info('switching to frame');
        webdriver.switchTo().frame('ifmail');
        retval = true;

        callback('err', retval);

    });

};


exports.getLatestMessageDayAsString = function (webdriver, callback) {

    var mailReceivedInDay;

    webdriver.findElement(By.css('#mailhaut > div:nth-child(4)')).getText().then(function (text) {

        var currDate = new Date();
        var currDayOfMonth = currDate.getDate();
        if (currDayOfMonth.length < 2) {
            mailReceivedInDay = text.substr(14, 1);
        }
        else {
            mailReceivedInDay = text.substr(14, 2);
        }

        logger.info(mailReceivedInDay);

        callback(mailReceivedInDay, 'err');
    });

};


exports.getLatestMessageHourAsString = function (webdriver, callback) {

    var mailReceivedHour;

    webdriver.findElement(By.css('#mailhaut > div:nth-child(4)')).getText().then(function (text) {

        var currDate = new Date();
        var currhour = currDate.getHours();
        if (currhour.length < 2) {
            mailReceivedHour = text.substr(17, 1);
        }
        else {
            mailReceivedHour = text.substr(17, 2);
        }
        logger.info(mailReceivedHour);

        callback(mailReceivedHour, 'err');


    });

};



