const path = require('path');

module.exports = {
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname)
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
				}
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: 'style-loader'
					},
					{
						loader: 'css-loader',
						options: {
							modules: true,
							localIdentName: "[name]_[local]_[hash:base64]"
						}
					}
				]
			}
		],
	}
};
