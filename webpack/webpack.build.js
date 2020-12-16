const entries = require("./paths");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");


function factory(vendor) {
    return {
        mode: "production",
        entry: entries.appEntries[vendor],
        resolve: {
            extensions: entries.extensions
        },
        output: {
            publicPath: entries.appPublicPath,
            path: entries.appBuild,
            filename: `javascript/${vendor}.js`
        },
        externals: {},
        module: {
            rules: [
                {
                    test: /\.js/,
                    exclude: /node_modules/,
                    loader: require.resolve("babel-loader")
                },
                //css-loader
                {
                    test: /\.css$/,
                    // use: [MiniCssExtractPlugin.loader, "css-loader"]
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                publicPath: '../',
                            },
                        },
                        'css-loader'
                    ]
                },
                //sass-loader
                {
                    test: /\.(scss|sass)$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                publicPath: '../',
                            },
                        },
                        'css-loader',
                        "postcss-loader",
                        {
                            loader: "sass-loader",
                            options: {
                                implementation: require("sass"),
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
                        "css-loader", // translates CSS into CommonJS
                        "less-loader" // compiles Less to CSS
                    ]
                },
                {
                    test: /\.html$/i,
                    loader: "html-loader",
                    options: {
                        attributes: true,
                    }
                },
                {
                    test: /\.(glb|gltf)$/,
                    loader: "file-loader",
                    options: {
                        outputPath: "models/",
                        useRelativePath: true,
                        name: `${vendor}/[name].[ext]`
                    }
                },
                {
                    test: /\.glsl$/,
                    loader: "webpack-glsl-loader"
                },
                {
                    test: /\.(png|jpg|gif)$/,
                    loader: "file-loader",
                    options: {
                        outputPath: "images/",
                        useRelativePath: true,
                        name: `${vendor}/[name].[ext]`
                    }
                },
                {
                    test: /\.(woff2?|eot|ttf|otf|svg)$/,
                    // exclude: /node_modules/,
                    loader: "file-loader",
                    options: {
                        outputPath: "fonts/",
                        useRelativePath: true,
                        name: `${vendor}.[ext]`
                    }
                }
            ]
        },
        performance: {
            hints: false
        },
        stats: "minimal",
        plugins: [
            new MiniCssExtractPlugin({
                filename: `css/${vendor}.css`
            }),
            new HtmlWebpackPlugin({
                filename: `${vendor}.html`,
                template: `apps/${vendor}/index.html`,
                inject: true,
                minify: false
            }),
            // new CopyPlugin({
            //     patterns: entries.appAssetsToCopy
            // })
        ]
    };

}

module.exports = Object.keys(entries.appEntries).map(vendor => factory(vendor))
