var path = require('path');

module.exports = {
    context: path.resolve(__dirname),
    entry: './app.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'pack.js',
        library: 'app',
        libraryTarget: 'var'
    },
    devtool: 'eval',
    resolve: {
        modules: [
            'node_modules'
        ]
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }, {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            }, {
                test: /\.scss$/,
                loaders: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    }
};