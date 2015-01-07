'use strict';

describe('Service: Client', function () {

    // load the service's module
    beforeEach(module('cloudifyWidgetPagesApp'));

    // instantiate service
    var mClient;
    beforeEach(inject(function (Client) {
        mClient = Client;
    }));

    it('should do something', function () {
        expect(!!mClient).toBe(true);
    });

});
