module.exports = {
    parser: 'postcss-scss',
    plugins: {
        'postcss-preset-env': {},
        'postcss-px-to-viewport': {
            unitToConvert: 'px',
            viewportWidth: 750,
            unitPrecision: 5,
            propList: ['*'],
            viewportUnit: 'vw',
            fontViewportUnit: 'vw',
            selectorBlackList: [],
            minPixelValue: 1,
            mediaQuery: true,
            replace: true,
            exclude: [/webapp\/admin/],
            landscape: false,
            landscapeUnit: 'vw',
            landscapeWidth: 568
        }
    }
};