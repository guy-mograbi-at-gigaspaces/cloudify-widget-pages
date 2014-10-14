var AWS = require('aws-sdk');
var _ = require('lodash');
var async = require('async');
var path = require('path');
var logger = require('log4js').getLogger('terminateMachines');

var awsJsonEnv = process.env['AWS_JSON'];
var awsJson =  ( awsJsonEnv && path.resolve(__dirname+'/../../', awsJsonEnv) ) || path.resolve(__dirname, '../conf/dev/aws.json');

/**
 * {
 *  'accessKeyId': __accessKeyId__,
  *  'secretAccessKey' : __secretAccessKey__,
  *  'region' : 'us-east-1',
 *
 * }
 */


AWS.config.update(require(awsJson));
var ec2 = new AWS.EC2();

function terminate( instanceIds, callback ){
    logger.info('terminating', instanceIds);
    var params = {
        InstanceIds: instanceIds,
        DryRun: false
    };
    ec2.terminateInstances(params, callback);
}


function listAll( callback ){
    var params = {
        DryRun:false
    };
    ec2.describeInstances(params, callback );
}

function processList( data, callback ){

    var instances = [];
    // filter those who have tag Name with Value ec2blu*
    _.each(data.Reservations, function(item){
        instances = instances.concat(item.Instances);
    });

    var toRemove = _.filter(instances, function( inst ){

        var name = _.find(inst.Tags, {'Key' : 'Name'});
        return name.Value.indexOf('ec2blu') === 0;
    });

    var toRemoveIds = _.map(toRemove,'InstanceId');



    callback( null,  toRemoveIds );
}

if (require.main === module) {
    async.waterfall([
        listAll,
        processList,
        terminate
    ], function(err){
        if ( !!err ){
            logger.error('unable to terminate',err);
            return;
        }
        logger.info('terminated successfully!!');
    });

}

