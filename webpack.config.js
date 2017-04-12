'use strict';

const NODE_ENV = process.env.NODE_ENV || 'development';
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: './src/main.js',
    output: {
		path: __dirname + '/public',
        filename: 'bundle.js'
    },
    devtool: NODE_ENV == 'development' ? 'source-map' : null,
    module: {
        loaders: [
            {
				test: /.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				query: {
				presets: ['es2015', 'stage-2']
				}
			},
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({fallback:'style-loader', use:'css-loader!resolve-url-loader!sass-loader?sourceMap'})
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({fallback:'style-loader', use:'css-loader'})
            },
            {
                test: /\.woff2?$|\.ttf$|\.eot$|\.svg$|\.png|\.jpe?g|\.gif$/,
                loader: 'file-loader'
            }
        ]
    },
	devServer: {
        host: 'localhost',
        port: 8080,
        contentBase: __dirname + '/public'
	},
    plugins: [
        new ExtractTextPlugin({filename:'styles.css', 
            allChunks: true
        })
    ]
};