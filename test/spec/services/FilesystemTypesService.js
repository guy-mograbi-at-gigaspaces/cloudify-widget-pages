'use strict';

describe('Service: FilesystemTypesService', function () {

    // load the service's module
    beforeEach(module('cloudifyWidgetPagesApp'));

    // instantiate service
    var mFilesystemTypesService;
    beforeEach(inject(function (FilesystemTypesService) {
        mFilesystemTypesService = FilesystemTypesService;
    }));

    it('should do something', function () {
        expect(!!mFilesystemTypesService).toBe(true);
    });

});
