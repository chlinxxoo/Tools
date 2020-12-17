"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTextureAtlases = void 0;
var fs = require("fs");
var path = require("path");
function getTextureAtlases(filePath, rawName, suffix, fileType) {
    if (rawName === void 0) { rawName = null; }
    if (suffix === void 0) { suffix = "texture"; }
    if (fileType === void 0) { fileType = ".json"; }
    var folder = path.dirname(filePath);
    var name = rawName !== null ? rawName : path.basename(filePath, path.extname(filePath));
    var index = 0;
    var textureAtlasName = "";
    var textureAtlas = "";
    var textureAtlases = new Array();
    textureAtlasName = name ? name + (suffix ? "_" + suffix : suffix) : suffix;
    textureAtlas = path.join(folder, textureAtlasName + fileType);
    if (fs.existsSync(textureAtlas)) {
        textureAtlases.push(textureAtlas);
        return textureAtlases;
    }
    while (true) {
        textureAtlasName = (name ? name + (suffix ? "_" + suffix : suffix) : suffix) + "_" + (index++);
        textureAtlas = path.join(folder, textureAtlasName + fileType);
        if (fs.existsSync(textureAtlas)) {
            textureAtlases.push(textureAtlas);
        }
        else if (index > 1) {
            break;
        }
    }
    if (textureAtlases.length > 0 || rawName !== null) {
        return textureAtlases;
    }
    textureAtlases = getTextureAtlases(filePath, "", suffix);
    if (textureAtlases.length > 0) {
        return textureAtlases;
    }
    index = name.lastIndexOf("_");
    if (index >= 0) {
        name = name.substring(0, index);
        textureAtlases = getTextureAtlases(filePath, name, suffix);
        if (textureAtlases.length > 0) {
            return textureAtlases;
        }
        textureAtlases = getTextureAtlases(filePath, name, "");
        if (textureAtlases.length > 0) {
            return textureAtlases;
        }
    }
    if (suffix === "atlas") {
        return textureAtlases;
    }
    if (suffix !== "tex") {
        textureAtlases = getTextureAtlases(filePath, null, "tex");
    }
    else if (suffix !== "atlas") {
        textureAtlases = getTextureAtlases(filePath, null, "atlas");
    }
    return textureAtlases;
}
exports.getTextureAtlases = getTextureAtlases;
//# sourceMappingURL=utils.js.map