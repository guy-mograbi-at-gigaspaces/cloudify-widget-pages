//http://sldn.softlayer.com/article/rest

var http = require('https');
var _ = require('lodash');
var async = require('async');
var path = require('path');
var logger = require('log4js').getLogger('terminateMachines');

var softlayerJsonEnv = process.env['SOFTLAYER_JSON'];
var confPath =  ( softlayerJsonEnv && path.resolve(__dirname+'/../../../', softlayerJsonEnv) ) || path.resolve(__dirname, '../../conf/dev/softlayer.json');
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

function fillInRequestOpts( opts ){
    return _.merge(
        {
            hostname: 'api.softlayer.com',
            auth : conf.apiKey + ':' + conf.apiSecretKey,
            port: 443,
            method: 'GET'
        }, opts
    );
}

// DELETE    api.softlayer.com/rest/v3/SoftLayer_Virtual_Guest/Object/:id.json
function terminate( instanceIds, callback ){
    _.each(instanceIds, function( instance ){
        logger.info('terminating ', instance );
        var myPath = '/rest/v3/SoftLayer_Virtual_Guest/{0}.json'.format(instance.id);
        console.log('running', myPath);
        var req = http.request(
            fillInRequestOpts({
                path: myPath,
                method :'DELETE'
            }), function (res) {
            var datas = [];

            res.on('data', function (data) {
                datas.push(data.toString());
            });

            res.on('end', function () {
                console.log('response ended',res.statusCode);
                var dataObj = JSON.parse(datas.join(''));
                console.log( 'got object of length ',arguments,  dataObj.length);
                if ( res.statusCode !== 200 ){
                    callback( dataObj );
                    return;
                }

                callback(null, dataObj)
            })
        }).on('error', function (e) {
            console.log("Got error: " + e.message);
            callback(e);
            return;
        });
        req.write('');
        req.end();
    });
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

    result = _.filter(result,function( item ){
        return item.hostname.indexOf('widget-cloudify-manager1') === 0;
    });
    callback(null, result);
}

if (require.main === module) {

    async.waterfall([
        listAll,
        processList,
        terminate
    ], function(err){
        console.log(arguments);
        if ( !!err ){
            logger.error('unable to terminate',err);
            return;
        }
        logger.info('terminated successfully!!');
    });

}

