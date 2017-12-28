var argv = require('yargs').argv;
var fs = require('fs');

var getPackageVersion = function () {
    var package = JSON.parse(fs.readFileSync('./package.json'));
    return package.version;
};

var getZipFileName = function () {
    return 'gitlab-dashboard-' + getPackageVersion() + '_' + argv.browser + '.zip';
};

module.exports = {
    dist_dir: 'dist',

    package: {
        version: getPackageVersion,
        description: function () {
            var package = JSON.parse(fs.readFileSync('./package.json'));
            return package.description;
        },
    },

    release: {
        type: argv.release || 'patch',
    },

    manifest: {
        browser_style: argv.browser == 'chrome' ? 'chrome_style' : 'browser_style',
    },

    zip: {
        filename: getZipFileName,
        file_path: function () {
            return 'dist/' + getZipFileName();
        },
    },

    environment: {
        isProd: function () {
            return (argv.production === undefined) ? false : true;
        },
    },

    browser: argv.browser,

    log: {
        type: function () {
            return (argv.debug === undefined) ? 'error' : 'debug';
        },
    }
};