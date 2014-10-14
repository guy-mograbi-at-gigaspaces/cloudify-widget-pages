var _ = require('lodash');
exports.execute = function execute( callback ) {
    var http = require('https');

    if (!process.env.SOFTLAYER_PACKAGE_URL) {
        console.error('please specify SOFTLAYER_PACKAGE_URL in environment variables. something in format: https://<user>:<apiKey>@api.softlayer.com/rest/v3/SoftLayer_Account/ActivePackages.json');
        return;
    }

    function digest(data) {

        var result = [];

        var ids = {};

        var counter = 0;

        data.forEach(function (section) {
            section.itemPrices.forEach(
                function (price) {
                    counter++;
                    if (ids.hasOwnProperty('' + price.itemId)) {
                        return;
                    }

                    ids['' + price.itemId] = price;

                    result.push({
                        'itemId': price.itemId,
                        'categoryName': price.categories[0].name,
                        'categoryCode': price.categories[0].categoryCode,
                        'description': price.item.description
                    });
                });
        });
        console.log('digested ' + counter + ' elements');

        result.sort(function (a, b) {
            if (a.categoryCode < b.categoryCode) {
                return -1;
            }

            if (a.categoryCode > b.categoryCode) {
                return 1;
            }

            if (a.itemId < b.itemId) {
                return -1;
            }

            if (a.itemId > b.itemId) {
                return 1;
            }
            return 0;
        });

        result = _.sortBy(result,'itemId');

        require('fs').writeFile(require('path').resolve(__dirname, '../app/data_digested.js'), 'var softlayerItems = ' + JSON.stringify(result, {}, 4) + ';', function (err) {
            if (!!err) {
                console.log(err);
            } else {
                console.log('completed successfully. wrote ' + result.length + ' items ');
                callback();
            }
        });
    }

    http.get(process.env.SOFTLAYER_PACKAGE_URL, function (res) {
        var datas = [];

        res.on('data', function (data) {
            if (datas.length % 100 === 0) {
                console.log('downloading from softlayer api : ', datas.length + '/' + 637);
            }
            datas.push(data.toString());
        });

        res.on('end', function () {
            var dataObj = JSON.parse(datas.join(''));
            console.log( 'got object of length ', dataObj.length);
            digest(dataObj)
        })
    }).on('error', function (e) {
        console.log("Got error: " + e.message);
        callback(e);
        return;
    });

};


if ( module === require.main ){
    exports.execute( function(err){
        if ( !!err ){
            console.log('error :: ',err);
            process.exit(1);
            return;
        }
        process.exit(0);
    });
}