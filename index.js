


var Download = require('download');

var download = new Download({ extract: true, strip: 1, mode: '755' })
    .get('https://www.dropbox.com/s/p5xwgjg6tjt56z1/ec2.zip?dl=0')
    .rename('ec2.zip')
    .dest('dest');

download.run(function (err, files, stream) {
    if (err) {
        throw err;
    }

    console.log('File downloaded successfully!');
});