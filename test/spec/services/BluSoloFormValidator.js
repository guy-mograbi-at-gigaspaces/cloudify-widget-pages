'use strict';

describe('Service: BluSoloFormValidator', function () {

    // load the service's module
    beforeEach(module('ibmBiginsightsUiApp'));

    // instantiate service
    var mBluSoloFormValidator;
    beforeEach(inject(function (BluSoloFormValidator) {
        mBluSoloFormValidator = BluSoloFormValidator;
    }));

    it('should do something', function () {
        expect(!!mBluSoloFormValidator).toBe(true);
    });

    it('should validate softlayer details', function(){
        var data = { 'softlayerLoginDetails' : { 'params' : {} }};
        var result = mBluSoloFormValidator.validateSoftlayerDetails( data );
        expect(result.username).toBe('invalid');
        expect(result.apiKey).toBe('invalid');

        expect(_.keys(result).length).toBe(2);

        data.softlayerLoginDetails.params.username = 'my username';
        result = mBluSoloFormValidator.validateSoftlayerDetails(data);
        expect(result.username).toBe(undefined);
        expect(result.apiKey).toBe('invalid');

        data.softlayerLoginDetails.params.apiKey = 'this is an api key';
        result = mBluSoloFormValidator.validateSoftlayerDetails(data);
        expect(result).toBe(null);
    });

    it('should validate aws details', function(){
        var data = { 'awsLoginDetails' : { 'params' : {} }, 'execution' : { 'aws' : {} } };

        var result = mBluSoloFormValidator.validateAwsEc2Details( data );
        expect(result.key).toBe('invalid');
        expect(result.secretKey).toBe('invalid');
        expect(result.securityGroup).toBe('invalid');


        expect(_.keys(result).length).toBe(3);

        data.awsLoginDetails.params.key = 'this is the key';
        result = mBluSoloFormValidator.validateAwsEc2Details(data);
        expect(result.key).toBe(undefined);
        expect(result.secretKey).toBe('invalid');
        expect(result.securityGroup).toBe('invalid');

        data.awsLoginDetails.params.secretKey = 'this is the key';
        result = mBluSoloFormValidator.validateAwsEc2Details(data);
        expect(result.key).toBe(undefined);
        expect(result.secretKey).toBe(undefined);
        expect(result.securityGroup).toBe('invalid');

        data.execution.aws.securityGroup = ' this is security group ';
        result = mBluSoloFormValidator.validateAwsEc2Details(data);
        expect(result).toBe(null);
    });

    it('should validate common errors', function(){
        var data = { 'genericWidgetModel' : { 'leadDetails' : {} }, 'execution' : {} };
        var result = mBluSoloFormValidator.validateCommonErrors(data);
        expect(_.keys(result).length).toBe(4);
        expect(result.email).toBe('invalid');
        expect(result.name).toBe('invalid');
        expect(result.company).toBe('invalid');
        expect(result.agreed).toBe('invalid');

        data.genericWidgetModel.leadDetails.email = 'this is not an email';
        result = mBluSoloFormValidator.validateCommonErrors(data);
        expect(result.email).toBe('invalid');

        data.genericWidgetModel.leadDetails.email = 'this@might.com';
        result = mBluSoloFormValidator.validateCommonErrors(data);
        expect(result.email).toBe(undefined);

        data.genericWidgetModel.leadDetails.firstName = 'first name';
        result = mBluSoloFormValidator.validateCommonErrors(data);
        expect(result.name).toBe('invalid'); // need last name too.

        data.genericWidgetModel.leadDetails.lastName = 'last name';
        result = mBluSoloFormValidator.validateCommonErrors(data);
        expect(result.name).toBe(undefined);

        data.genericWidgetModel.leadDetails.companyName = 'the company';
        result = mBluSoloFormValidator.validateCommonErrors(data);
        expect(result.company).toBe(undefined);

        data.execution.agreed = false;
        result = mBluSoloFormValidator.validateCommonErrors(data);
        expect(result.agreed).toBe('invalid');

        data.execution.agreed = true;
        result = mBluSoloFormValidator.validateCommonErrors(data);
        expect(result).toBe(null);

    });



});
