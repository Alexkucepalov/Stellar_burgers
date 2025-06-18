const path = require('path');
const { merge } = require('webpack-merge');

module.exports = {
	mode: 'production',
	devtool: false,
	output: {
		path: path.resolve(__dirname, '..', 'dist'),
		publicPath: '/Stellar_burgers/',
	},
	optimization: {
		splitChunks: {
			chunks: 'all',
			minSize: 20000,
			minRemainingSize: 0,
			minChunks: 1,
			maxAsyncRequests: 30,
			maxInitialRequests: 30,
			enforceSizeThreshold: 50000,
			cacheGroups: {
				defaultVendors: {
					test: /[\\/]node_modules[\\/]/,
					priority: -10,
					reuseExistingChunk: true,
				},
				default: {
					minChunks: 2,
					priority: -20,
					reuseExistingChunk: true,
				},
			},
		},
	},
};
