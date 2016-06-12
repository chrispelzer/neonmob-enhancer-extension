var path = require('path');
var webpack = require('webpack');

module.exports = {
    context: __dirname + '/../src/js',

    entry: {
        background: './background.js',
        client: './client.js',
        common: [
            'lodash',
            'jquery'
        ],
        scss: '../scss/main.scss',
    },

    output: {
        path: path.resolve(__dirname, '../build'),
        pathinfo: true,
        filename: '[name].js',
        sourceMapFilename: '[name].map'
    },
    devtool: "source-map",
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /\/node_modules/,
                loader: 'babel'
            },
            {
                test: /\.scss$/,
                loaders: ["style", "css?sourceMap", "sass?sourceMap"]
            },
            {
                test: /\.html$/,
                loader: 'raw'
            },
            {
                test: /\.png$/,
                loader: 'url?limit=10000&name=assets/[name].[ext]'
            }
        ],
    },

    resolve: {
        modulesDirectories: [
            '../node_modules',
        ]
    },

    plugins: [
        new webpack.ProvidePlugin({
            _: 'lodash',
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new webpack.optimize.CommonsChunkPlugin('common', 'common.js')
    ]
};
