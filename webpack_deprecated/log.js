// const formatWebpackMessages = require("react-dev-utils/formatWebpackMessages");
const chalk = require("chalk");

function flatten(list, depth) {
    depth = typeof depth == "number" ? depth : Infinity;
    if (!depth) {
        if (Array.isArray(list)) {
            return list.map(function (i) {
                return i;
            });
        }
        return list;
    }

    return _flatten(list, 1);

    function _flatten(list, d) {
        return list.reduce(function (acc, item) {
            if (Array.isArray(item) && d < depth) {
                return acc.concat(_flatten(item, d + 1));
            } else {
                return acc.concat(item);
            }
        }, []);
    }
}

function clearConsole() {
    const isInteractive = process.stdout.isTTY;

    if (!isInteractive) {
        return;
    }
    process.stdout.write(
      process.platform === "win32" ? "\x1B[2J\x1B[0f" : "\x1B[2J\x1B[3J\x1B[H"
    );
}

module.exports = {
    flatten,
    clearConsole,
    // formatWebpackMessages,
    chalk
};
