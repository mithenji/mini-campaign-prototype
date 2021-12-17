const path = require("path");
const entries = require("./paths");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const HtmlWebpackSkipAssetsPlugin = require("html-webpack-skip-assets-plugin").HtmlWebpackSkipAssetsPlugin;
// const HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");

console.log('__dirname', __dirname);

const configArray = [];
const devServer = {
    hot: true,
    inline: true,
    host: "192.168.0.105",
    publicPath: "./",
    // contentBase: path.join(__dirname, "./static"),
    port: 9000
};

function factory(vendor) {
    return {
        mode: "development",
        devtool: "eval-source-map",
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
                    loader: "babel-loader",
                    options: {
                        "exclude": [
                            // \\ for Windows, \/ for Mac OS and Linux
                            /node_modules/
                        ],
                        "presets": [
                            "@babel/preset-env"
                        ],
                        "plugins": [
                            [
                                "@babel/plugin-proposal-class-properties",
                                {
                                    "loose": true
                                }
                            ]
                        ]
                    }
                },
                {
                    test: /\.ts$/,
                    use: "ts-loader",
                    exclude: /node_modules/
                },
                //css-loader
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                publicPath: "../"
                            }
                        },
                        "css-loader"
                    ]
                },
                //sass-loader
                {
                    test: /\.(scss|sass)$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                publicPath: "../"
                            }
                        },
                        "css-loader",
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
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                publicPath: "../"
                            }
                        },
                        "css-loader", // translates CSS into CommonJS
                        "less-loader" // compiles Less to CSS
                    ]
                },
                // {
                //     test: /\.html$/i,
                //     loader: "html-loader"
                // },
                {
                    test: /\.(png|jpg|gif|mp3|mp4)(\?.*)?$/,
                    use: [
                        {
                            loader: "file-loader",
                            options: {
                                outputPath: "images/",
                                useRelativePath: true,
                                name: `[name].[ext]`
                            }
                        }
                    ]
                },
                {
                    test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
                    exclude: /node_modules/,
                    loader: "file-loader",
                    options: {
                        outputPath: "iconfont/",
                        useRelativePath: true,
                        name: "[name].[ext]"
                    }
                }
            ]
        },
        performance: {
            hints: false,
            maxEntrypointSize: 5120000,
            maxAssetSize: 5120000
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: "[name].css"
            }),
            new HtmlWebpackPlugin({
                filename: `${vendor}.html`,
                template: `src/${vendor}/index.html`,
                minify: false,
                inject: true
            }),
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                "window.jQuery": "jquery",
                Popper: ["popper.js", "default"]
            })
        ]
    };
}

Object.keys(entries.appEntries).map((vendor, index) => {
    if(index === 0) {
        return configArray.push(Object.assign({}, factory(vendor), {devServer: devServer}));
    }
    return configArray.push(factory(vendor));
});

module.exports = configArray;