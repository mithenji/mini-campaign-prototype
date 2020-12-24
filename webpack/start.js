const chalk = require('chalk');
const webpack = require('webpack');
const Config = require('./webpack.config');

// process.env.NODE_ENV = 'development';
// process.env.BABEL_ENV = 'development';
// process.on('unhandledRejection', err => {
//     throw err;
// });

console.log(chalk.greenBright('Starting webpack watcher... '));

webpack(Config, (err, stats) => {
    
    if (err) {
        console.error(chalk.magentaBright(err));
        return;
    }
    
    console.log(stats.toString({
        chunks: false,  // 使构建过程更静默无输出  false
        colors: true    // 在控制台展示颜色 true
    }));
});


// const afterCompilation = require('./webpack.afterCompilation');
// compiler.watch({aggregateTimeout: 200, poll: 1000}, (e) => {
//     console.log('watch -->', e);
// });

// compiler.run(afterCompilation(true));

