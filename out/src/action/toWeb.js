"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
// import * as zlib from "zlib";
var DATA_TAG = "data";
function default_1(data, isPlayer) {
    var isLocal = data.config ? data.config.isLocal : false;
    var isAlone = data.config ? data.config.isAlone : false;
    var zipData = [{
            data: data.data instanceof Buffer ? data.data.toString("base64") : data.data,
            textureAtlases: data.textureAtlases.map(function (v) {
                return v ? v.toString("base64") : "";
            })
        }];
    // const compressed = zlib.gzipSync(new Buffer(JSON.stringify(zipData))).toString("base64");
    // let htmlString = fs.readFileSync(path.join(__dirname, isPlayer ? "../resource/player.html" : "../resource/viewer.html"), "utf-8");
    // htmlString = replaceHTMLCommentTag(htmlString, DATA_TAG, `<b id="data">${compressed}</b>`, false);
    var htmlString = fs.readFileSync(path.join(__dirname, "../resource/" + (isPlayer ? "player" : "viewer") + "/" + (isLocal ? "local" : (isAlone ? "alone" : "index")) + ".html"), "utf-8");
    htmlString = replaceHTMLCommentTag(htmlString, DATA_TAG, "<b id=\"data\">" + JSON.stringify(zipData) + "</b>", false);
    if (data.config) {
        if (data.config.showFPS) {
            htmlString = htmlString.replace("data-show-fps=\"false\"", "data-show-fps=\"" + data.config.showFPS + "\"");
        }
        if (data.config.frameRate) {
            htmlString = htmlString.replace("data-frame-rate=\"60\"", "data-frame-rate=\"" + data.config.frameRate + "\"");
        }
        if (data.config.backgroundColor || data.config.backgroundColor === 0) {
            if (data.config.backgroundColor >= 0) {
                htmlString = htmlString.replace("background: #333333;", "background: #" + data.config.backgroundColor.toString(16) + ";");
            }
            else {
                htmlString = htmlString.replace("background: #333333;", "");
            }
        }
        if (data.config.orientation) {
            htmlString = htmlString.replace("data-orientation=\"auto\"", "data-orientation=\"" + data.config.orientation + "\"");
        }
        if (data.config.scaleMode) {
            htmlString = htmlString.replace("data-scale-mode=\"fixedNarrow\"", "data-scale-mode=\"" + data.config.scaleMode + "\"");
        }
    }
    return htmlString;
}
exports.default = default_1;
function replaceHTMLCommentTag(htmlString, tag, string, keepTag) {
    var startTag = "<!--" + tag + "_begin-->";
    var endTag = "<!--" + tag + "_end-->";
    var startIndex = htmlString.indexOf(startTag);
    var endIndex = htmlString.indexOf(endTag);
    if (startIndex >= 0 && endIndex >= 0) {
        var replaceString = void 0;
        if (keepTag) {
            replaceString = htmlString.substring(startIndex + startTag.length, endIndex);
        }
        else {
            replaceString = htmlString.substring(startIndex, endIndex + endTag.length);
        }
        return htmlString.replace(replaceString, string);
    }
    return htmlString;
}
