const fs = require('fs');
const path = require('path');
const configResource = require('../package.json');
// const chalk = require("chalk");

function genWebpackEntries(appDirectory, entries) {
    return Object.keys(entries).reduce((acc, appType) => {
        entries.forEach(item => {
            acc[item] = path.resolve(appDirectory, item, 'index.js');
        });
        return acc;
    }, {});
}

//the pwd
const workingDirectory = fs.realpathSync(process.cwd());
//the static/apps
const appDirectory = path.resolve(workingDirectory, configResource.paths.apps);
//the output path
const appBuild = path.resolve(workingDirectory, configResource.paths.build);
//the entries
const appEntries = genWebpackEntries(appDirectory, configResource.entries);
//the entries name
const appEntriesName = Object.keys(appEntries);
//the public path
const appPublicPath = "./";

console.table({
    'workingDirectory':workingDirectory,
    'appBuild': appBuild,
    ...appEntries
});

//the images/ libraries
// const legacyAssets = [
//     {
//         from: path.resolve(workingDirectory, configResource.paths.library.source),
//         to: path.resolve(appBuild, configResource.paths.library.target)
//     }
// ];

//CopyPlugin options
// function appAssetsToCopy() {
    // const patterns = utils.flatten(Object.values(appEntries)).map(item => {
    //     for (let name of appEntriesName) {
    //         if(item.indexOf(name) >= 0) {
    //             return {
    //                 from: item.replace('index.js', 'images/'),
    //                 to: `${appBuild}/images/${name}/`,
    //                 toType: 'dir'
    //             };
    //         }
    //     }
    // });
    // utils.flatten(Object.values(appEntries)).map(item => {
    //     for (let name of appEntriesName) {
    //         if(item.indexOf(name) >= 0) {
    //             patterns.push({
    //                 from: item.replace('index.js', 'fonts/'),
    //                 to: `${appBuild}/fonts/${name}/`,
    //                 toType: 'dir'
    //             });
    //         }
    //     }
    // });

    //static/app/library
    // patterns.unshift({
    //     from: path.resolve(workingDirectory, configResource.paths.library.source),
    //     to: path.resolve(appBuild, configResource.paths.library.target),
    //     globOptions: {ignore: ['**/src/**/*.*', '**/external/**/*.*']},
    //     transformPath(targetPath, absolutePath) {
    //         //flatten paths
    //         return targetPath
    //             .replace('dist', '')
    //             .replace('/js', '')
    //             .replace('/css', '');
    //     }
    // });
    // patterns.unshift({
    //     from: path.resolve(workingDirectory, 'static/favicon.ico'),
    //     to: path.resolve(appBuild, 'favicon.ico'),
    //     globOptions: {ignore: ['**/src/**/*.*', '**/external/**/*.*']},
    //     transformPath(targetPath, absolutePath) {
    //         //flatten paths
    //         return targetPath
    //             .replace('dist', '')
    //             .replace('/js', '')
    //             .replace('/css', '');
    //     }
    // });
    // return patterns;
// }

// file-loader => options[name]

function appAssetsName(name) {
    let suffix = '[name].[ext]';
    for (let entry of appEntriesName) {
        if(name.indexOf(entry) >= 0) {
            return `images/${entry}/${suffix}`;
        }
    }
    return 'images/' + suffix;
}

module.exports = {
    appEntries,
    appEntriesName,
    appBuild,
    appPublicPath,
    workingDirectory,
    // legacyAssets,
    appDirectory,
    // appAssetsToCopy: appAssetsToCopy(),
    appAssetsName: appAssetsName,
    extensions: ['.ts', '.js']
};
