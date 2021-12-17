const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpack = require('webpack');
const path = require('path');
// const glob = require('glob');
const fs = require('fs');

const pwd = fs.realpathSync(process.cwd()); //console.log('pwd =>', pwd);
const resolveApp = (...args) => path.resolve(pwd, ...args);

function readSync(pathlike) {
    try {
        const res = fs.readdirSync(pathlike);
        if (res.length <= 0) return false;
    } catch (error) {
        return false;
    }
    return true;
}

function factory(options, entryNames) {

    const isEnvDevelopment = options.mode === 'development';
    const isEnvProduction = options.mode === 'production';

    const resolveOutput = (...args) => {
        return resolveApp(`./apps`, ...args);
    };

    const assets = [entryNames].reduce((acc, entry) => {
        // const name = entry.replace('apps', options.name);
        const fromDir = resolveApp('src', entryNames, 'assets');  //console.log('name =>', name, 'assets =>', assets);
        if (readSync(fromDir)) {
            isEnvDevelopment
                ? acc.push({from: fromDir, to: resolveOutput('assets')})
                : acc.push({from: fromDir, to: resolveOutput(entryNames, 'assets')});
        }
        return acc;
    }, []);

    console.log('entryNames =>', entryNames, 'isEnvDevelopment =>', isEnvDevelopment, 'assets =>', assets);
    console.log('resolveOutput =>', resolveOutput());

    const statics = [
        {
            from: resolveApp('static/fonts'),
            to: resolveOutput('fonts')
        },
        {
            from: resolveApp('static/vendors'),
            to: resolveOutput('vendors')
        },
        {
            from: resolveApp('static/robots.txt'),
            to: resolveOutput()
        },

        {
            from: resolveApp('static/semantic'),
            to: resolveOutput('vendors/semantic')
        },
        {
            from: resolveApp('static/favicon.ico'),
            to: resolveOutput()
        }
    ];

    return {
        name: options.name,
        mode: options.mode,
        entry: {[`${entryNames}`]: resolveApp(options.name, entryNames, 'index.js')},
        devtool: isEnvDevelopment && 'cheap-source-map',
        resolve: {
            extensions: ['.js', '.json', '.ts', '.vue', '.tsx', '.jsx'],
            alias: {
                vue: 'vue/dist/vue.esm.js'
            },
            fallback: {
                fs: false,
                tls: false,
                net: false,
                path: false,
                zlib: false,
                http: false,
                https: false,
                stream: false,
                crypto: false,
                assert: false,
                util: false
            }
        },
        output: {
            publicPath: '/',
            filename: `javascript/${entryNames}.js`,
            path: resolveOutput()
        },
        optimization: {
            minimize: isEnvProduction,
            minimizer: []
        },
        performance: {
            maxAssetSize: 3500000,
            maxEntrypointSize: 2500000
        },
        devServer: {
            hot: true,
            port: 9000,
            static: './apps'
        },
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    use: ['vue-loader']
                },
                {
                    test: /\.js/,
                    exclude: /node_modules/,
                    use: ['babel-loader']
                },
                {
                    test: /\.jsx/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['babel-preset-react-app', {runtime: 'automatic'}]
                            ],
                            babelrc: false,
                            configFile: false
                        }
                    }
                },
                {
                    test: /\.css$/,
                    use: [MiniCssExtractPlugin.loader, 'css-loader']
                },
                {
                    test: /\.(scss|sass)$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                publicPath: '../'
                            }
                        },
                        'css-loader',
                        'postcss-loader',
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: isEnvDevelopment
                            }
                        }
                    ]
                },
                {
                    test: /\.less$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                publicPath: '../'
                            }
                        },
                        'css-loader',
                        {
                            loader: 'less-loader',
                            options: {
                                implementation: require('less'),
                                javascriptEnabled: true
                            }
                        }
                    ]
                },
                {
                    test: /\.(ttf|otf|eot|woff)/,
                    type: 'asset/resource',
                    generator: {
                        filename: 'fonts/[name].[ext]'
                    }
                },
                {
                    test: /\.(png|jpg|jpeg|gif|bmp|svg|webp|mp3|wav|mp4|pdf|doc|docx)$/,
                    type: 'asset/resource',
                    generator: {
                        filename: ({filename}) => {
                            let dir = [entryNames].find((entry) => filename.includes(entry));
                            return `${dir}/assets/images/[contenthash][ext]`;
                        }
                    }
                }
            ]
        },
        plugins: [
            new VueLoaderPlugin(),
            new HtmlWebpackPlugin({
                filename: (entryName) => entryName + '.html',
                template: `src/${entryNames}/index.html`,
                publicPath: `./`,
                title: entryNames
            }),
            new MiniCssExtractPlugin({filename: `styles/${entryNames}.css`, runtime: false}),
            new CopyWebpackPlugin({patterns: [...assets, ...statics]}),
            new webpack.ProvidePlugin({process: 'process/browser'})
        ],
        stats: {
            all: false,
            hash: true,
            errors: true,
            assets: true,
            timings: true,
            publicPath: true,
            cachedAssets: true,
            errorDetails: true,
            performance: isEnvDevelopment
        }
    };
}


module.exports = (_webpackEnv, options) => {
    // let entryList = require('./package.json').campaigns.reduce((acc, app) => {
    //     acc.push({[app.split('/').pop()]: resolveApp(options.name, app, 'index.js')});
    //     return acc;
    // }, []);

    return require('./package.json').campaigns.map(item => {
        return factory(options, item);
    });
};