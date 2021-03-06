'use strict';

angular.module('cloudifyWidgetPagesApp')
    .service('DataCenterService', function DataCenterService() {

//        use the following format to retrieve
//        https://user:apiKey@api.softlayer.com/rest/v3/SoftLayer_Location_Datacenter/Datacenters.json
        this.data = [
//            {'id': 265592, 'longName': 'Amsterdam 1', 'name': 'ams01'},
//            {'id': 3, 'longName': 'Dallas 1', 'name': 'dal01'},
//            {'id': 154770, 'longName': 'Dallas 2', 'name': 'dal02'},
//            {'id': 167092, 'longName': 'Dallas 4', 'name': 'dal04'},
//            {'id': 138124, 'longName': 'Dallas 5', 'name': 'dal05'},
//            {'id': 154820, 'longName': 'Dallas 6', 'name': 'dal06'},
//            {'id': 142776, 'longName': 'Dallas 7', 'name': 'dal07'},
            {'id': 448994, 'longName': 'Toronto 1', 'name': 'tor01'},
            {'id': 352494, 'longName': 'Hong Kong 2', 'name': 'hkg02'},
            {'id': 358694, 'longName': 'London 2', 'name': 'lon02'},
            {'id': 37473, 'longName': 'Washington 1', 'name': 'wdc01'},
//            {'id': 142775, 'longName': 'Houston 2', 'name': 'hou02'},
//            {'id': 168642, 'longName': 'San Jose 1', 'name': 'sjc01'},
//            {'id': 18171, 'longName': 'Seattle', 'name': 'sea01'},
//            {'id': 224092, 'longName': 'Singapore 1', 'name': 'sng01'}
        ];

    });
