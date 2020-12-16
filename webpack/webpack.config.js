const path = require('path');
const entries = require('./paths');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

function factory(vendor) {
    console.log(path.join(__dirname, 'dist'));
    return {
        mode: 'development',
        devtool: 'cheap-source-map',
        entry: entries.appEntries[vendor],
        resolve: {
            extensions: entries.extensions
        },
        output: {
            path: entries.appBuild,
            publicPath: entries.appPublicPath,
            filename: `javascript/${vendor}.js`
        },
        module: {
            rules: [
                {
                    test: /\.js/,
                    exclude: /node_modules/,
                    loader: require.resolve('babel-loader')
                },
                {
                    test: /\.ts$/,
                    use: 'ts-loader',
                    exclude: /node_modules/
                },
                //css-loader
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                publicPath: '../',
                            },
                        },
                        'css-loader',
                    ]
                },
                //sass-loader
                {
                    test: /\.(scss|sass)$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        'postcss-loader',
                        {
                            loader: 'sass-loader',
                            options: {
                                implementation: require('sass'),
                                sourceMap: true
                            }
                        }
                    ]
                },
                //Less-loader
                {
                    test: /\.less$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader', // translates CSS into CommonJS
                        'less-loader' // compiles Less to CSS
                    ]
                },
                {
                    test: /\.html$/i,
                    loader: 'html-loader',
                    options: {
                        attributes: true,
                    }
                },
                {
                    test: /\.(png|jpg|gif)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                outputPath: 'images/',
                                useRelativePath: true,
                                name: `/[name].[ext]`
                            }
                        }
                    ]
                },
                {
                    test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
                    exclude: /node_modules/,
                    loader: 'file-loader',
                    options: {
                        outputPath: 'iconfont/',
                        useRelativePath: true,
                        name: '[name].[ext]'
                    }
                }
            ]
        },
        devServer: {
            hot: true,
            inline: true,
            publicPath:  '/',
            contentBase: path.resolve(__dirname, './static'),
            compress: true,
            port: 9000
        },
        stats: {
            all: false,
            assets: true,
            cachedAssets: true,
            errors: true,
            errorDetails: true,
            hash: true,
            performance: true,
            publicPath: true,
            timings: true
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: '[name].css'
            }),
            new HtmlWebpackPlugin({
                filename: `${vendor}.html`,
                template: `apps/${vendor}/index.html`,
                inject: true,
                minify: false
            }),
        ]
    };

}

module.exports = Object.keys(entries.appEntries).map(vendor => factory(vendor));
