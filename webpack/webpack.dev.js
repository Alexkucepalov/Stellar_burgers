const path = require('path'); //для того чтобы превратить отнсительный путь в абсолютный мы будем использовать пакет path
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
	mode: 'development',
	devtool: 'eval-source-map',
	devServer: {
		historyApiFallback: true,
		static: path.resolve(__dirname, './dist'),
		port: 3000,
		open: true,
		hot: true,
		proxy: {
			'/api': {
				target: 'https://norma.nomoreparties.space',
				secure: false,
				changeOrigin: true,
				pathRewrite: {
					'^/api': '/api'
				}
			}
		}
	},
	plugins: [new ReactRefreshWebpackPlugin()],
};