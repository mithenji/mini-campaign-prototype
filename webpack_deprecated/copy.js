const fs = require("fs-extra");
const legacyAssets = require("./entries").legacyAssets;
(function copyLegacyAssets() {
    try {
        for (let paths of legacyAssets) {
            fs.copySync(paths.from, paths.to, {
                dereference: true
            });
        }
    } catch (error) {}
})()
