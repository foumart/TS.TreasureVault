const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
    mode: 'development',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public/dist'),
        publicPath: '/dist/',
    },
    devtool: 'source-map',
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        compress: true,
        port: 9000,
        open: true,
        liveReload: true,
        watchFiles: ['src/**/*', 'index.html'],
        hot: true,
    },
    plugins: [
        new webpack.DefinePlugin({
            __ASSET_BASE_PATH__: JSON.stringify(process.env.ASSET_PATH_DEV),
        }),
    ],
});