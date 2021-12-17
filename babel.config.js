const path = require('path');
module.exports = {
    presets: [
        [
            '@babel/preset-env', {'loose': false}
        ],
        [
            '@vue/babel-preset-app',
            {
                'targets': {
                    'browsers': ['iOS >= 8', 'Android >=5']
                },
                'corejs': 3,
                'useBuiltIns': 'entry'
            }
        ]
    ],
    plugins: [
        ['@babel/plugin-proposal-private-property-in-object', {'loose': true}],
        ["@babel/plugin-proposal-private-methods", { "loose": true }],
        ['@babel/plugin-proposal-class-properties', {'loose': true}],
        [
            '@babel/plugin-transform-runtime',
            {
                'corejs': false,
                'helpers': true,
                'version': require('@babel/runtime/package.json').version,
                'regenerator': true,
                'useESModules': true,
                'absoluteRuntime': path.dirname(require.resolve('@babel/runtime/package.json'))
            }
        ]
    ]
};
