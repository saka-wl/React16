const { resolve } = require('path');
// 会帮你创建一个html 直接引用入口文件
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        index: resolve(__dirname, './src/index.js')
    },
    output: {
        path: resolve(__dirname, 'dist'),
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [['@babel/preset-env', { targets: 'defaults' }]],
                    },
                    // options: {
                    //     // 开启cache缓存
                    //     cacheDirectory: true,
                    //     // 缓存压缩
                    //     cacheCompression: false,
                    //     // 减少代码体积
                    //     plugins: ['@babel/plugin-transform-runtime']
                    // }
                },
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'React code',
            template: resolve(__dirname, './public', 'index.html')
        }),
    ],
    optimization: {
        minimize: false,
    }
    // devServer: {
    //     host: 'localhost',
    //     port: '8080',
    //     open: true,
    //     hot: true, // 开启HMR
    // },
    // mode: 'development',
    // 开发模式下，行
    // devtool: 'cheap-module-source-map',
};