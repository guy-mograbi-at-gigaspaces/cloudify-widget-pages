// following example for selenium on nodejs
// https://code.google.com/p/selenium/wiki/WebDriverJs

'use strict';

/**
 *
 *
 * configuration looks like :
 *
 *
 * {
 *
 *      "selenium" : {
 *          "serverAddress" : "http://ip:4444/wd/hub"  // location for remote browser
 *      }
 *
 * }
 *
 *
 * @type {exports}
 */

var path = require('path');
var meJson = process.env['ME_JSON'] || path.resolve(__dirname, '../conf/dev/me.json');

var conf = require(meJson);

var logger = require('log4js').getLogger('index');
logger.info(conf);


var webdriver = require('selenium-webdriver');


var driver = new webdriver.Builder().
    usingServer(conf.selenium.serverAddress).
    withCapabilities(webdriver.Capabilities.chrome()).//todo : support other browsers with configuration
    build();


driver.get('http://ibmpages.gsdev.info/#/snippet/bluSolo?lang=');



//todo : test click play



// todo : test click play again (on environment that was already installed)


// todo : test click "stop".


// todo : nice to have:  add emails automated test. (use yopmail?)



setTimeout(function(){
      driver.quit();
}, 15000);


