const path = require("path");
const entries = require("./paths");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");

const configArray = [];
const devServer = {
    hot: true,
    inline: true,
    host: "10.9.0.37",
    publicPath: "/",
    contentBase: path.resolve(__dirname, "../static"),
    port: 9000
};

function factory(vendor) {
    return {
        mode: "development",
        devtool: "cheap-source-map",
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
                    loader: require.resolve("babel-loader")
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
                {
                    test: /\.html$/i,
                    loader: "html-loader"
                },
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
        plugins: [
            new MiniCssExtractPlugin({
                filename: "[name].css"
            }),
            new HtmlWebpackPlugin({
                filename: `${vendor}.html`,
                template: `src/${vendor}/index.html`,
                inject: true,
                minify: false
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