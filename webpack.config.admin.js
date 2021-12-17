const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpack = require('webpack');
const path = require('path');
const glob = require('glob');
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

module.exports = (_webpackEnv, options) => {
    switch (options.name) {
        case 'admin': {
            return factory(
                options,
                glob
                    .sync(`./admin/*/index.js`)
                    .filter((file) => !file.includes('/components/'))
                    .reduce((acc, app) => {
                        const name = app.replace('index.js', '').trim();
                        acc[`apps/${path.basename(name)}`] = [
                            resolveApp('admin/global.js'),
                            resolveApp('admin/global.scss'),
                            resolveApp(app)
                        ];
                        return acc;
                    }, {})
            );
        }
        case 'web': {

            let entryList = require('./package.json').campaigns.reduce((acc, app) => {
                acc.push({[`apps/${app}`]: resolveApp(options.name, app, 'index.js')});
                return acc;
            }, []);

            return entryList.map(item => {
                return factory(options, item);
            });
        }
        default:
            throw Error('无效入口:' + options.name);
    }
};

function factory(options, entry) {
    console.log(entry);
    const resolveOutput = (...args) => {
        return resolveApp('../apps/{name}/static', ...args).replace(
            '{name}',
            options.name
        );
    };
    const entryNames = Object.keys(entry);
    const isEnvDevelopment = options.mode === 'development';
    const isEnvProduction = options.mode === 'production';

    const assets = entryNames.reduce((acc, entry) => {
        const name = entry.replace('apps', options.name);
        const assets = resolveApp(name, 'assets');  //console.log('name =>', name, 'assets =>', assets);
        if (readSync(assets)) acc.push({from: assets, to: resolveOutput(entry)});
        return acc;
    }, []);

    // console.log('entryNames =>', entryNames, 'isEnvDevelopment =>', isEnvDevelopment, 'assets =>', assets);
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
        entry,
        name: options.name,
        mode: options.mode,
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
            filename: '[name]/app.js',
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
            static: {
                directory: path.join(__dirname, entryNames[0]),
            },
            compress: false,
            port: 9000,
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
                        MiniCssExtractPlugin.loader,
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
                        MiniCssExtractPlugin.loader,
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
                            // /img/bg.jpg
                            // /binding/summer/bg.jpg
                            let dir = entryNames.find((entry) => filename.includes(entry.split('/').pop()[0]));
                            return dir ? `${dir}/[name][contenthash][ext]` : `${dir}/img/[name][contenthash][ext]`;
                        }
                    }
                }
            ]
        },
        plugins: [
            new VueLoaderPlugin(),
            new HtmlWebpackPlugin({
                filename: (entryName) => entryName + '.html',
                template: `./web/${entryNames[0].replace('apps', '')}/index.html`
            }),
            new MiniCssExtractPlugin({filename: '[name]/app.css', runtime: false}),
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
