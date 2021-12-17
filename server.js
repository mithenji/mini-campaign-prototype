const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./webpack.config.js');

console.log(webpackConfig('development', {'name': 'web', 'mode': 'development'}))
const webpackConfigObject =  webpackConfig('development', {'name': 'web', 'mode': 'development'})
const WebpackCompiler = Webpack(webpackConfigObject);
const devServerOptions = { ...webpackConfigObject.devServer, open: true };
const server = new WebpackDevServer(devServerOptions, WebpackCompiler);

//
const runServer = async () => {
    console.log('Starting server...');
    await server.start();
};
//
runServer().then();