var path = require('path');
var tasksConfig = require('./tasks.config.js');
var webpack = require('webpack');

module.exports = {
    entry: {
        dashboard: './app/dashboard.js',
        options: './app/options.js',
        start: './app/start.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, tasksConfig.dist_dir)
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({ compress: true, comments: false })
    ],
};