module.exports = (api) => {
    return {
        parser: 'postcss-scss',
        plugins: [
            ['postcss-url'],
            ['postcss-import'],
            ['postcss-svg'],
            ['postcss-svgo'],
            ['postcss-inline-svg'],
            ['postcss-preset-env'],
            ['postcss-aspect-ratio-mini'],
            ['postcss-write-svg', {utf8: false}],
            ['postcss-px-to-viewport', {
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
                exclude: [/x5-video/],
                include: [],
                landscape: false,
                landscapeUnit: 'vw',
                landscapeWidth: 568,
            }]
        ]
    };

}