var HtmlWebpackPlugin = require('html-webpack-plugin');
var NgAnnotatePlugin = require('ng-annotate-webpack-plugin');
var path = require('path');
var tasksConfig = require('./tasks.config.js');
var webpack = require('webpack');

var getPlugins = function () {
    var plugins = [];
    var minify = {};

    if (tasksConfig.environment.isProd()) {
        plugins.push(new NgAnnotatePlugin({ add: true }));
        plugins.push(new webpack.optimize.UglifyJsPlugin({ compress: true, comments: false }));
        minify = {
            collapseWhitespace: true,
            conservativeCollapse: true,
            html5: true,
            minifyCss: true,
            minifyJs: true,
            minifyURLs: true,
            useShortDoctype: true,
            sortAttributes: true,
            removeEmptyAttributes: true,
            removeRedundantAttributes: true,
        };
    }

    plugins.push(new webpack.DefinePlugin({ BROWSER: JSON.stringify(tasksConfig.browser) }));

    plugins.push(new HtmlWebpackPlugin({
        filename: 'dashboard.html',
        template: 'app/views/templates/dashboard.ejs',
        title: 'GitLab Dashboard',
        inject: false,
        minify: minify,
    }));

    plugins.push(new HtmlWebpackPlugin({
        filename: 'options.html',
        template: 'app/views/templates/options.ejs',
        title: 'GitLab Dashboard Options',
        inject: false,
        minify: minify,
    }));

    return plugins;
};

module.exports = {
    entry: {
        dashboard: './app/views/scripts/dashboard.js',
        options: './app/views/scripts/options.js',
        start: './app/views/scripts/start.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, tasksConfig.dist_dir)
    },
    plugins: getPlugins(),
};