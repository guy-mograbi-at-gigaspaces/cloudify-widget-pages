'use strict';


var config = require('../config');
var driver = require('../driver');

var logger = require('log4js').getLogger('page');

/**
 *
 * @param relative
 * @returns {string}
 */
function getPath(relative){

    logger.info("Navigating to url: "+'http://' + config.pageUrl + '/'+ relative);
    return 'http://' + config.pageUrl + '/'+ relative;
}

function get( relative ){
    return driver.get().get(getPath(relative));
}


exports.loadWidgetPage  = function(){
    return get('#/snippet/bluSolo?lang=');
};


