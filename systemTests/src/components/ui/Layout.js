'use strict';

var q= require('q');
var sDriver = require('../driver');
var logger = require('log4js').getLogger('Layout');
var css = require('selenium-webdriver').By.css;


exports.getElementInnerHtml = function(cssSelector,parentElement) {
    var deferred = q.defer();

    if (parentElement) {
        parentElement.findElement(css(cssSelector)).getInnerHtml().then(function (innerHTML) {
            deferred.resolve(innerHTML);
        });
    } else {
        sDriver.get().findElement(css(cssSelector)).getInnerHtml().then(function (innerHTML) {
            deferred.resolve(innerHTML);
        });
    }

    return deferred.promise;
};

exports.getElementAttribute = function(cssSelector,attribute) {
    var deferred = q.defer();

    sDriver.get().findElement(css(cssSelector)).getAttribute(attribute).then(function (value) {
        deferred.resolve(value);
    });

    return deferred.promise;
};

exports.getElementIsDisplayed = function(cssSelector) {
    var deferred = q.defer();

    sDriver.get().findElement(css(cssSelector)).isDisplayed().then(function (isDisplayed) {
        deferred.resolve(isDisplayed);
    });

    return deferred.promise;
};

exports.isElementPresent = function(cssSelector) {
    var deferred = q.defer();

    sDriver.get().isElementPresent(css(cssSelector)).then(function () {
        deferred.resolve(true);
    }, function () {
        deferred.resolve(false);
    });

    return deferred.promise;
};

exports.clickElement = function( cssSelector) {
    var deferred = q.defer();

    sDriver.get().findElement(css(cssSelector)).click().then(function () {
        deferred.resolve();
    });

    return deferred.promise;
}

exports.findElements = function(cssSelector) {
    var deferred = q.defer();

    sDriver.get().findElements(css(cssSelector)).then(function (elements) {
        deferred.resolve(elements);
    });

    return deferred.promise;

}


