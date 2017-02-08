var path = require('path');

module.exports = {
	entry: [
		'./src/polyfills/array-from.js',
		'./src/polyfills/object-assign.js',
		'./src/index.js'
	],
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	module: {
		loaders: [
			{
				test: [/\.js$/],
				exclude: 'node_modules',
				loader: 'babel-loader'
			}
		],
	}
};
