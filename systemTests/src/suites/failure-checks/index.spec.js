'use strict';


var components = require('../../components');
var logger = require('log4js').getLogger('index.spec');
var driver = require('../../components/driver');
var globalSteps = require('../../utils/globalTestSteps');


describe('failure suite', function(){
    require('./testAws');
    require('./testSoftlayer');
});


