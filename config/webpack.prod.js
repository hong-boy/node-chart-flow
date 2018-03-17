'use strict';
const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const rootdir = path.join(__dirname, '../');

module.exports = {
    mode: 'production',
    entry: {
        "bundle": [path.join(rootdir, 'src/build.js')]
    },
    output: {
        path: path.join(rootdir, 'dist/'),
        publicPath: '',
        filename: '[name].js',
    },
    module: {
        rules: [
            {test: /\.vue$/, use: ['vue-loader']},
            {test: /\.js$/, use: ['babel-loader'], exclude: /node_modules/},
            {
                test: /\.(css|less)$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        "css-loader",
                        {
                            loader: 'postcss-loader'
                        },
                        {
                            loader: 'less-loader'
                        }
                    ]
                })
            },
            {test: /\.(jpg|png|svg|eot|ttf|woff|woff2)$/, use: ['file-loader']}
        ]
    },
    plugins: [
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false
        //     }
        // }),
        new ExtractTextPlugin('bundle.css'),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            }
        })
    ]
};
