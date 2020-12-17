"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findIP = exports.open = exports.filterFileList = void 0;
var fs = require("fs");
var path = require("path");
var os = require("os");
var child_process_1 = require("child_process");
function filterFileList(folderPath, filter, maxDepth, currentDepth) {
    if (maxDepth === void 0) { maxDepth = 0; }
    if (currentDepth === void 0) { currentDepth = 0; }
    var fileFilteredList = [];
    if (folderPath && fs.existsSync(folderPath)) {
        for (var _i = 0, _a = fs.readdirSync(folderPath); _i < _a.length; _i++) {
            var file = _a[_i];
            var filePath = path.resolve(folderPath, file);
            var fileStatus = fs.lstatSync(filePath);
            if (fileStatus.isDirectory()) {
                if (maxDepth === 0 || currentDepth <= maxDepth) {
                    fileFilteredList = fileFilteredList.concat(filterFileList(filePath, filter, currentDepth + 1));
                }
            }
            else if (!filter || filter.test(filePath)) {
                fileFilteredList.push(filePath);
            }
        }
    }
    return fileFilteredList;
}
exports.filterFileList = filterFileList;
function open(target, appName, callback) {
    if (appName === void 0) { appName = null; }
    if (callback === void 0) { callback = null; }
    var command = "";
    switch (process.platform) {
        case "darwin":
            if (appName) {
                command = "open -a \"" + escape(appName) + "\"";
            }
            else {
                command = "open";
            }
            break;
        case "win32":
            // if the first parameter to start is quoted, it uses that as the title
            // so we pass a blank title so we can quote the file we are opening
            if (appName) {
                command = "start \"\" \"" + escape(appName) + "\"";
            }
            else {
                command = "start \"\"";
            }
            break;
        default:
            if (appName) {
                command = escape(appName);
            }
            else {
                // use Portlands xdg-open everywhere else
                command = path.join(__dirname, "xdg-open");
            }
            break;
    }
    var sudoUser = process.env["SUDO_USER"];
    if (sudoUser) {
        command = "sudo -u " + sudoUser + " " + command;
    }
    command = command + " \"" + escape(target) + "\"";
    return child_process_1.exec(command, callback || undefined);
}
exports.open = open;
function findIP() {
    var ipConfig = os.networkInterfaces();
    var ip = "localhost";
    for (var k in ipConfig) {
        var arr = ipConfig[k];
        for (var i = 0; i < arr.length; ++i) {
            var ipData = arr[i];
            if (!ipData.internal && ipData.family === "IPv4") {
                ip = ipData.address;
                return ip;
            }
        }
    }
    return ip;
}
exports.findIP = findIP;
function escape(string) {
    return string.replace(/"/g, '\\\"');
}
//# sourceMappingURL=nodeUtils.js.map