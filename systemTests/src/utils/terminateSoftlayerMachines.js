//http://sldn.softlayer.com/article/rest

var http = require('https');
var _ = require('lodash');
var async = require('async');
var path = require('path');
var logger = require('log4js').getLogger('terminateMachines');

var softlayerJsonEnv = process.env['SOFTLAYER_JSON'];
var confPath =  ( softlayerJsonEnv && path.resolve(__dirname+'/../../', softlayerJsonEnv) ) || path.resolve(__dirname, '../conf/dev/softlayer.json');
var conf = require(confPath);

/**
 * {
 *  'apiKey': __accessKeyId__,
  *  'apiSecretKey' : __secretAccessKey__,
 *
 * }
 */


// First, checks if it isn't implemented yet.
if (!String.prototype.format) {
    logger.info('defining format');
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}


//http://sldn.softlayer.com/reference/services/SoftLayer_Virtual_Guest/deleteObject


// DELETE    api.softlayer.com/rest/v3/SoftLayer_Virtual_Guest/Object/:id.json
function terminate( instanceIds, callback ){
   logger.info('terminating');
}


function toApiCall( route ){
    return ('https://{0}:{1}@' + route).format(conf.apiKey,conf.apiSecretKey);
}
function listAll( callback ){

    var key = toApiCall('api.softlayer.com/rest/v3/SoftLayer_Account/VirtualGuests.json');

    http.get(key, function (res) {
        var datas = [];

        res.on('data', function (data) {
            datas.push(data.toString());
        });

        res.on('end', function () {
            var dataObj = JSON.parse(datas.join(''));
            console.log( 'got object of length ', dataObj.length);
            callback(null, dataObj)
        })
    }).on('error', function (e) {
        console.log("Got error: " + e.message);
        callback(e);
        return;
    });

}

function processList( data, callback ){
    debugger;
    var result = _.map(data, function(item){
        return { 'id' : item.id, 'hostname' : item.hostname };
    });
    callback(null, result);
}

if (require.main === module) {
    listAll(function(err, result){

        processList(result, function(err, processed){
            logger.info(processed);
        });
    });
//    async.waterfall([
//        listAll,
//        processList,
//        terminate
//    ], function(err){
//        if ( !!err ){
//            logger.error('unable to terminate',err);
//            return;
//        }
//        logger.info('terminated successfully!!');
//    });

}

