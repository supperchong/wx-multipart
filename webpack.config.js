const path = require('path')
const MinifyPlugin = require('babel-minify-webpack-plugin')
console.log(process.argv)
console.log(process.execArgv)
module.exports = {
	entry: './index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'Multipart.min.js',
		library: 'library',
		libraryTarget: 'umd'
	},
	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['babel-preset-env']
					}
				}
			}
		]
	},
	mode: 'production',
	plugins: [new MinifyPlugin()],
	target: 'web',
	optimization: {
		minimize: false
	}
}
