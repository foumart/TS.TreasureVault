const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
    mode: 'production',
    output: {
        filename: 'bundle.[contenthash].js',
        path: path.resolve(__dirname, 'public/dist'),
        publicPath: 'dist/',
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
    plugins: [
        new webpack.DefinePlugin({
            __ASSET_BASE_PATH__: JSON.stringify(process.env.ASSET_PATH_PROD),
        }),
    ],
});