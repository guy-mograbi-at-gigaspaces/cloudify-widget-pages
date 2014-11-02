'use strict';
var lodash = require('lodash');
var log4js = require('log4js');
var logger = log4js.getLogger('globalFunctions');
/**
 * Gets the fill from the fills and returns the executionOption that matches.
 * @param fill
 * @returns {*}
 */
function getConfigurationByFill(conf, fill) {
    for (var config in conf.executionOptions) {
        if (conf.executionOptions[config].name === fill.name) {
            return conf.executionOptions[config];
        }
    }
    throw new Error('Configuration with name [' + name + '] couldn\'t be found');
}
exports.getConfigurationByFill = getConfigurationByFill;

/**
 * Gets the name of the permutation like "AWS Valid Data" and returns the permutation merged with the one specified in property "fillWithBase"
 * fillWithBase property should contain the name of the base permutation. Usually it contains the credentials.
 * @param fillName - permutation name
 * @returns {*}
 */
function getFillByFillname(conf, fillName) {
    if (conf.fills[fillName].hasOwnProperty('fillWithBase')) {
        return lodash.merge({}, conf.fills[fillName], conf.fills[conf.fills[fillName].fillWithBase]);
    } else {
        return conf.fills[fillName];
    }
}

exports.getFillByFillname = getFillByFillname;