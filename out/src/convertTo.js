#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs-extra");
var path = require("path");
var commander = require("commander");
var object = require("./common/object");
var nodeUtils = require("./common/nodeUtils");
var dbft = require("./format/dragonBonesFormat");
var spft = require("./format/spineFormat");
var dbUtils = require("./format/utils");
var toFormat_1 = require("./action/toFormat");
var toNew_1 = require("./action/toNew");
var toBinary_1 = require("./action/toBinary");
var toWeb_1 = require("./action/toWeb");
var toSpine_1 = require("./action/toSpine");
var formatFormat_1 = require("./action/formatFormat");
function execute() {
    var commands = commander
        .version("0.1.0")
        .option("-i, --input [path]", "Input path")
        .option("-o, --output [path]", "Output path")
        .option("-t, --type [type]", "Convert to type [binary, new, v45, player, viewer, spine]", /^(binary|new|v45|player|viewer|spine|none)$/i, "none")
        .option("-f, --filter [keyword]", "Filter")
        .option("-d, --delete", "Delete raw files after convert complete")
        .option("-p, --parameter [parameter]", "Parameter")
        .parse(process.argv);
    var input = path.resolve(path.normalize(commands["input"] || process.cwd()));
    var output = "output" in commands ? path.resolve(path.normalize(commands["output"])) : input;
    var type = commands["type"] || "";
    var filter = commands["filter"] || "";
    var deleteRaw = commands["delete"] || false;
    var parameter = commands["parameter"] || "";
    var loadTextureAtlasToData = false;
    var megreTextureAtlasToData = false;
    switch (type) {
        case "binary":
            break;
        case "new":
            break;
        case "v45":
            break;
        case "player":
        case "viewer":
            loadTextureAtlasToData = true;
            megreTextureAtlasToData = true;
            break;
        case "spine":
            loadTextureAtlasToData = true;
            megreTextureAtlasToData = true;
            break;
        default:
            console.log("Unknown type: " + type);
            return;
    }
    var files = nodeUtils.filterFileList(input, /\.(json)$/i);
    var _loop_1 = function (file) {
        if (filter && file.indexOf(filter) < 0) {
            return "continue";
        }
        var dirURL = path.dirname(file);
        var fileName = path.basename(file, ".json");
        var fileString = fs.readFileSync(file, "utf-8");
        var textureAtlasFiles = null;
        var textureAtlasImages = null;
        var textureAtlases = null;
        var dragonBonesData = toFormat_1.default(fileString, function () {
            textureAtlasFiles = dbUtils.getTextureAtlases(file);
            textureAtlases = textureAtlasFiles.map(function (v) {
                return getTextureAtlas(v);
            });
            return textureAtlases;
        });
        if (!dragonBonesData) {
            return "continue";
        }
        if (dragonBonesData.textureAtlas.length > 0) {
            textureAtlasFiles = null;
            textureAtlasImages = dragonBonesData.textureAtlas.map(function (v) {
                return v.imagePath;
            });
            textureAtlases = dragonBonesData.textureAtlas;
        }
        else {
            if (!textureAtlasFiles) {
                textureAtlasFiles = dbUtils.getTextureAtlases(file);
            }
            textureAtlasImages = textureAtlasFiles.map(function (v) {
                return v.replace(".json", ".png");
            });
            if (loadTextureAtlasToData && textureAtlasFiles.length > 0) {
                textureAtlases = textureAtlasFiles.map(function (v) {
                    return getTextureAtlas(v);
                });
            }
        }
        if (megreTextureAtlasToData && textureAtlases && dragonBonesData.textureAtlas.length === 0) {
            for (var _i = 0, textureAtlases_1 = textureAtlases; _i < textureAtlases_1.length; _i++) {
                var textureAtals = textureAtlases_1[_i];
                dragonBonesData.textureAtlas.push(textureAtals);
            }
            textureAtlases = dragonBonesData.textureAtlas;
        }
        switch (type) {
            case "binary": {
                toNew_1.default(dragonBonesData, true);
                formatFormat_1.default(dragonBonesData);
                var outputDirURL = dirURL.replace(input, output);
                var outputURL = path.join(outputDirURL, fileName + ".dbbin");
                var result = toBinary_1.default(dragonBonesData);
                if (!fs.existsSync(outputDirURL)) {
                    fs.mkdirsSync(outputDirURL);
                }
                fs.writeFileSync(outputURL, new Buffer(result));
                console.log(outputURL);
                if (deleteRaw) {
                    fs.unlinkSync(file);
                }
                if (outputDirURL !== dirURL) {
                    if (textureAtlasFiles && !megreTextureAtlasToData) {
                        for (var _a = 0, textureAtlasFiles_1 = textureAtlasFiles; _a < textureAtlasFiles_1.length; _a++) {
                            var textureAtlasFile = textureAtlasFiles_1[_a];
                            var outputURL_1 = textureAtlasFile.replace(input, output);
                            if (deleteRaw) {
                                fs.moveSync(textureAtlasFile, outputURL_1);
                            }
                            else {
                                fs.copySync(textureAtlasFile, outputURL_1);
                            }
                            console.log(outputURL_1);
                        }
                    }
                    for (var _b = 0, textureAtlasImages_1 = textureAtlasImages; _b < textureAtlasImages_1.length; _b++) {
                        var textureAtlasImage = textureAtlasImages_1[_b];
                        var outputURL_2 = textureAtlasImage.replace(input, output);
                        if (deleteRaw) {
                            fs.moveSync(textureAtlasImage, outputURL_2);
                        }
                        else {
                            fs.copySync(textureAtlasImage, outputURL_2);
                        }
                        console.log(outputURL_2);
                    }
                }
                else if (textureAtlasFiles && megreTextureAtlasToData) {
                    for (var _c = 0, textureAtlasFiles_2 = textureAtlasFiles; _c < textureAtlasFiles_2.length; _c++) {
                        var textureAtlasFile = textureAtlasFiles_2[_c];
                        fs.removeSync(textureAtlasFile);
                    }
                }
                break;
            }
            case "new": {
                toNew_1.default(dragonBonesData, false);
                formatFormat_1.default(dragonBonesData);
                object.compress(dragonBonesData, dbft.compressConfig);
                var outputDirURL = dirURL.replace(input, output);
                var outputURL = path.join(outputDirURL, fileName + ".json");
                var result = JSON.stringify(dragonBonesData);
                if (!fs.existsSync(outputDirURL)) {
                    fs.mkdirsSync(outputDirURL);
                }
                fs.writeFileSync(outputURL, new Buffer(result));
                console.log(outputURL);
                if (outputDirURL !== dirURL) {
                    if (deleteRaw) {
                        fs.unlinkSync(file);
                    }
                    if (textureAtlasFiles && !megreTextureAtlasToData) {
                        for (var _d = 0, textureAtlasFiles_3 = textureAtlasFiles; _d < textureAtlasFiles_3.length; _d++) {
                            var textureAtlasFile = textureAtlasFiles_3[_d];
                            var outputURL_3 = textureAtlasFile.replace(input, output);
                            if (deleteRaw) {
                                fs.moveSync(textureAtlasFile, outputURL_3);
                            }
                            else {
                                fs.copySync(textureAtlasFile, outputURL_3);
                            }
                            console.log(outputURL_3);
                        }
                    }
                    for (var _e = 0, textureAtlasImages_2 = textureAtlasImages; _e < textureAtlasImages_2.length; _e++) {
                        var textureAtlasImage = textureAtlasImages_2[_e];
                        var outputURL_4 = textureAtlasImage.replace(input, output);
                        if (deleteRaw) {
                            fs.moveSync(textureAtlasImage, outputURL_4);
                        }
                        else {
                            fs.copySync(textureAtlasImage, outputURL_4);
                        }
                        console.log(outputURL_4);
                    }
                }
                else if (textureAtlasFiles && megreTextureAtlasToData) {
                    for (var _f = 0, textureAtlasFiles_4 = textureAtlasFiles; _f < textureAtlasFiles_4.length; _f++) {
                        var textureAtlasFile = textureAtlasFiles_4[_f];
                        fs.removeSync(textureAtlasFile);
                    }
                }
                break;
            }
            case "player":
            case "viewer": {
                toNew_1.default(dragonBonesData, true);
                formatFormat_1.default(dragonBonesData);
                var outputDirURL = dirURL.replace(input, output);
                var outputURL = path.join(outputDirURL, fileName + ".html");
                var result = toWeb_1.default({
                    data: new Buffer(toBinary_1.default(dragonBonesData)),
                    textureAtlases: textureAtlasImages.map(function (v) {
                        var imagePath = path.join(dirURL, v);
                        if (fs.existsSync(imagePath)) {
                            return fs.readFileSync(imagePath);
                        }
                        return null;
                    }),
                    config: {
                        isLocal: parameter !== "alone",
                        isAlone: parameter === "alone",
                    }
                }, type === "player");
                if (!fs.existsSync(outputDirURL)) {
                    fs.mkdirsSync(outputDirURL);
                }
                fs.writeFileSync(outputURL, new Buffer(result));
                console.log(outputURL);
                if (deleteRaw) {
                    fs.unlinkSync(file);
                    if (textureAtlasFiles) {
                        for (var _g = 0, textureAtlasFiles_5 = textureAtlasFiles; _g < textureAtlasFiles_5.length; _g++) {
                            var textureAtlasFile = textureAtlasFiles_5[_g];
                            fs.unlinkSync(textureAtlasFile);
                        }
                    }
                    for (var _h = 0, textureAtlasImages_3 = textureAtlasImages; _h < textureAtlasImages_3.length; _h++) {
                        var textureAtlasImage = textureAtlasImages_3[_h];
                        fs.unlinkSync(textureAtlasImage);
                    }
                }
                break;
            }
            case "spine": {
                toNew_1.default(dragonBonesData, true);
                formatFormat_1.default(dragonBonesData);
                var outputDirURL = dirURL.replace(input, output);
                var result = toSpine_1.default(dragonBonesData, "3.6.0", !output);
                var suffix = outputDirURL === dirURL ? "_spine" : "";
                dragonBonesData.name = fileName.replace("_ske", "");
                console.log(dragonBonesData.name);
                if (!fs.existsSync(outputDirURL)) {
                    fs.mkdirsSync(outputDirURL);
                }
                for (var _j = 0, _k = result.spines; _j < _k.length; _j++) {
                    var spine = _k[_j];
                    object.compress(spine, spft.compressConfig);
                    var outputURL_5 = path.join(outputDirURL, (result.spines.length > 1 ? dragonBonesData.name + "_" + spine.skeleton.name : dragonBonesData.name) + suffix + ".json");
                    delete spine.skeleton.name; // Delete keep name.
                    fs.writeFileSync(outputURL_5, JSON.stringify(spine));
                    console.log(outputURL_5);
                }
                var outputURL = path.join(outputDirURL, dragonBonesData.name + suffix + ".atlas");
                fs.writeFileSync(outputURL, result.textureAtlas);
                console.log(outputURL);
                if (deleteRaw) {
                    fs.unlinkSync(file);
                    if (textureAtlasFiles) {
                        for (var _l = 0, textureAtlasFiles_6 = textureAtlasFiles; _l < textureAtlasFiles_6.length; _l++) {
                            var textureAtlasFile = textureAtlasFiles_6[_l];
                            fs.unlinkSync(textureAtlasFile);
                        }
                    }
                }
                if (outputDirURL !== dirURL) {
                    var index = 0;
                    for (var _m = 0, textureAtlasImages_4 = textureAtlasImages; _m < textureAtlasImages_4.length; _m++) {
                        var textureAtlasImage = textureAtlasImages_4[_m];
                        var outputURL_6 = path.join(path.dirname(textureAtlasImage.replace(input, output)), dragonBonesData.name + suffix + (textureAtlasImages.length > 1 ? "_" + index : "") + ".png");
                        if (fs.existsSync(textureAtlasImage)) {
                            if (deleteRaw) {
                                fs.moveSync(textureAtlasImage, outputURL_6);
                            }
                            else {
                                fs.copySync(textureAtlasImage, outputURL_6);
                            }
                        }
                        console.log(outputURL_6);
                        index++;
                    }
                }
                break;
            }
            default:
                break;
        }
    };
    for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
        var file = files_1[_i];
        _loop_1(file);
    }
    console.log("Convert complete.");
}
function getTextureAtlas(textureAtlasFile) {
    var textureAtlas = new dbft.TextureAtlas();
    object.copyObjectFrom(JSON.parse(fs.readFileSync(textureAtlasFile, "utf-8")), textureAtlas, dbft.copyConfig);
    return textureAtlas;
}
execute();
