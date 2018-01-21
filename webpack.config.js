var path = require('path');
var tasksConfig = require('./tasks.config.js');
var webpack = require('webpack');

module.exports = {
    entry: {
        dashboard: './app/views/scripts/dashboard.js',
        settings: './app/views/scripts/settings.js',
        start: './app/views/scripts/start.js'
    },
    output: {
        filename: 'scripts/[name].js',
        path: path.resolve(__dirname, tasksConfig.dist_dir)
    },
    plugins: [
        new webpack.DefinePlugin({
            GA_ID: JSON.stringify('UA-112412081-1'),
            VERSION: JSON.stringify(tasksConfig.package.version()),
            BROWSER: JSON.stringify(tasksConfig.browser),
            LOG_TYPE: JSON.stringify(tasksConfig.log.type()),
        })
    ],
    module: {
        loaders: [
            { test: /\.json$/, loader: 'json-loader' }
        ]
    },
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.js']
    },
    node: {
        // console: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    }
};