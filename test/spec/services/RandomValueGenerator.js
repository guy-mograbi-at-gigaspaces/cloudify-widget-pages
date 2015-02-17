/**
 * Created by sefi on 15/02/15.
 */
'use strict';

describe('Service: RandomValueGenerator', function () {

    // load the service's module
    beforeEach(module('cloudifyWidgetPagesApp'));

    // instantiate service
    var service;
    beforeEach(inject(function (RandomValueGenerator) {
        service = RandomValueGenerator;
    }));

    it('should generate random value', function () {
        var randomValue = service.generate(16);
        console.log('randomValue = ' + randomValue);
        expect(randomValue.length).toEqual(16);
    });

});
