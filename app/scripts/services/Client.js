'use strict';

angular.module('cloudifyWidgetPagesApp')
    .service('Client', function Client(CpuService, DataCenterService, BigInsightsEditionService, FilesystemTypesService, RamService, DisksService, ServerTypesService) {
        this.dataCenters = DataCenterService;
        this.biginsightsEditions = BigInsightsEditionService;
        this.filesystemTypes = FilesystemTypesService;
        this.serverTypes = ServerTypesService;
        this.cpu = CpuService;
        this.ram = RamService;
        this.disks = DisksService;
    });
