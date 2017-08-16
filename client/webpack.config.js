const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');

const pugPlugin = new HtmlWebPackPlugin({template: './src/index.pug', inject: true});

// This helper function is not strictly necessary.
// I just don't like repeating the path.join a dozen times.
function srcPath(subdir) {
    return path.join(__dirname, "src", subdir);
}

module.exports = {
    entry: './src/app.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/dist/'
    },

    plugins: [
        pugPlugin
    ],

    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
        alias: {
            "common-entity": srcPath('../../common-entity')
        }
    },

    module: {
        loaders: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            {
                test: /\.ts?$/,
                loader: 'ts-loader'
            },
            
            {
                test: /\.pug?$/,
                include: path.join(__dirname, 'src'),
                loader: ['pug-loader'],
            }
        ]
    }
}