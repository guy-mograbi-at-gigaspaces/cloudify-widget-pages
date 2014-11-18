'use strict';

var q= require('q');
var sDriver = require('../driver');
var logger = require('log4js').getLogger('Layout');
var css = require('selenium-webdriver').By.css;


exports.getElementInnerHtml = function(elementPath) {
    var deferred = q.defer();

    sDriver.get().findElement(elementPath).getInnerHtml().then(function (innerHTML) {
        deferred.resolve(innerHTML);
    });

    return deferred.promise;
};

exports.getElementIsDisplayed = function(elementPath) {
    var deferred = q.defer();

    sDriver.get().findElement(elementPath).isDisplayed().then(function (isDisplayed) {
        deferred.resolve(isDisplayed);
    });

    return deferred.promise;
};



