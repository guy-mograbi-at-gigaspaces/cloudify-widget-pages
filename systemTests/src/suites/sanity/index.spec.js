'use strict';


var components = require('../../components');
var logger = require('log4js').getLogger('index.spec');
var driver = require('../../components/driver');
var globalSteps = require('../../utils/globalTestSteps');


beforeEach(function(done){
    logger.info('initializing');
   components.init().then(function(){
       globalSteps.setDriver(driver.get());
       components.ui.page.loadWidgetPage().then(function(){done()});
   });
}, components.config.timeout );

afterEach(function( done ){
    components.driver.quit().then(function(){done()});
}, components.config.timeout);


describe('sanity suite', function(){
    require('./testAws');
    require('./testSoftlayer');
});


