const paths = require('./paths');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const entryNamesObj = paths.entryNames;

module.exports = function (webpackEnv) {
    const isEnvProduction = webpackEnv === 'production';
    return Object.keys(entryNamesObj).map(entry => {
        return new HtmlWebpackPlugin(
            Object.assign(
                {},
                {
                    inject: true,
                    chunks: [entry],
                    filename: `${entry}.html`,
                    template: entryNamesObj[entry].replace('.js', '.html')
                },
                isEnvProduction
                    ? {
                        minify: {
                            removeComments: true,
                            collapseWhitespace: false,
                            removeRedundantAttributes: true,
                            useShortDoctype: true,
                            removeEmptyAttributes: true,
                            removeStyleLinkTypeAttributes: true,
                            keepClosingSlash: true,
                            minifyJS: true,
                            minifyCSS: true,
                            minifyURLs: true
                        }
                    }
                    : undefined
            )
        );

    });
};