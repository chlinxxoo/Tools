#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs-extra");
var path = require("path");
var commander = require("commander");
var object = require("./common/object");
var utils = require("./common/utils");
var nodeUtils = require("./common/nodeUtils");
var dbft = require("./format/dragonBonesFormat");
var spft = require("./format/spineFormat");
var l2ft = require("./format/live2DFormat");
var fromSpine_1 = require("./action/fromSpine");
var fromLive2D_1 = require("./action/fromLive2D");
var formatFormat_1 = require("./action/formatFormat");
var helper = require("./helper/helperRemote");
function execute() {
    var commands = commander
        .version("0.1.0")
        .option("-i, --input [path]", "Input path")
        .option("-o, --output [path]", "Output path")
        .option("-t, --type [type]", "Convert from type [spine, live2d]", /^(spine|live2d)$/i, "none")
        .option("-f, --filter [keyword]", "Filter")
        .option("-d, --delete", "Delete raw files after convert complete.")
        .parse(process.argv);
    var input = path.resolve(path.normalize(commands["input"] || process.cwd()));
    var output = "output" in commands ? path.resolve(path.normalize(commands["output"])) : input;
    var type = commands["type"] || "";
    var filter = commands["filter"] || "";
    var deleteRaw = commands["delete"] || false;
    // let loadTextureAtlasToData = false;
    // let megreTextureAtlasToData = false;
    switch (type) {
        case "spine": {
            var files = nodeUtils.filterFileList(input, /\.(json)$/i);
            for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
                var file = files_1[_i];
                if (filter && file.indexOf(filter) < 0) {
                    continue;
                }
                var fileString = fs.readFileSync(file, "utf-8");
                if (!spft.isSpineString(fileString)) {
                    continue;
                }
                var fileName = path.basename(file, ".json");
                var textureAtlasFile = path.join(path.dirname(file), fileName + ".atlas");
                var textureAtlasString = "";
                if (fs.existsSync(textureAtlasFile)) {
                    textureAtlasString = fs.readFileSync(textureAtlasFile, "utf-8");
                }
                var spine = new spft.Spine();
                object.copyObjectFrom(JSON.parse(fileString), spine, spft.copyConfig);
                var result = fromSpine_1.default({ name: fileName, data: spine, textureAtlas: textureAtlasString });
                var outputFile = (output ? file.replace(input, output) : file).replace(".json", "_ske.json");
                formatFormat_1.default(result);
                var textureAtlases = result.textureAtlas.concat(); // TODO
                result.textureAtlas.length = 0;
                object.compress(result, dbft.compressConfig);
                if (!fs.existsSync(path.dirname(outputFile))) {
                    fs.mkdirsSync(path.dirname(outputFile));
                }
                fs.writeFileSync(outputFile, JSON.stringify(result));
                console.log(outputFile);
                if (deleteRaw) {
                    fs.removeSync(file);
                    fs.removeSync(textureAtlasFile);
                }
                var index = 0;
                for (var _a = 0, textureAtlases_1 = textureAtlases; _a < textureAtlases_1.length; _a++) {
                    var textureAtlas = textureAtlases_1[_a];
                    var pageName = "_tex" + (textureAtlases.length > 1 ? "_" + index++ : "");
                    var outputFile_1 = (output ? file.replace(input, output) : file).replace(".json", pageName + ".json");
                    var textureAtlasImage = path.join(path.dirname(file), textureAtlas.imagePath);
                    textureAtlas.imagePath = path.basename(outputFile_1).replace(".json", ".png");
                    var imageOutputFile = path.join(path.dirname(outputFile_1), textureAtlas.imagePath);
                    if (!fs.existsSync(path.dirname(imageOutputFile))) {
                        fs.mkdirsSync(path.dirname(imageOutputFile));
                    }
                    object.compress(textureAtlas, dbft.compressConfig);
                    if (!fs.existsSync(path.dirname(outputFile_1))) {
                        fs.mkdirsSync(path.dirname(outputFile_1));
                    }
                    fs.writeFileSync(outputFile_1, JSON.stringify(textureAtlas));
                    if (deleteRaw) {
                        fs.moveSync(textureAtlasImage, imageOutputFile);
                    }
                    else {
                        fs.copySync(textureAtlasImage, imageOutputFile);
                    }
                    var hasRotated = false;
                    for (var _b = 0, _c = textureAtlas.SubTexture; _b < _c.length; _b++) {
                        var texture = _c[_b];
                        if (texture.rotated) {
                            hasRotated = true;
                        }
                    }
                    if (hasRotated) {
                        var helperInput = {
                            type: "modify_spine_textureatlas",
                            data: {
                                file: imageOutputFile,
                                config: textureAtlas,
                                texture: fs.readFileSync(imageOutputFile, "base64")
                            }
                        };
                        helper.addInput(helperInput);
                    }
                    console.log(outputFile_1);
                    console.log(imageOutputFile);
                }
            }
            break;
        }
        case "live2d": {
            var files = nodeUtils.filterFileList(input, /\.(model.json)$/i);
            for (var _d = 0, files_2 = files; _d < files_2.length; _d++) {
                var file = files_2[_d];
                if (filter && file.indexOf(filter) < 0) {
                    continue;
                }
                // Parse config.
                var dirURL = path.dirname(file);
                var fileName = path.basename(file, ".model.json");
                var fileString = fs.readFileSync(file, "utf-8");
                var modelConfig = JSON.parse(fileString);
                var modelURL = path.join(dirURL, modelConfig.model);
                var deleteFiles = [file];
                modelConfig.name = modelConfig.name || fileName;
                // Parse model.
                if (fs.existsSync(modelURL)) {
                    var fileBuffer = fs.readFileSync(modelURL);
                    var model = l2ft.parseModel(fileBuffer.buffer);
                    if (!model) {
                        console.log("Model parse error.", modelURL);
                        continue;
                    }
                    modelConfig.modelImpl = model;
                    deleteFiles.push(modelURL);
                }
                else {
                    console.log("File does not exist.", modelURL);
                    continue;
                }
                for (var i = 0, l = modelConfig.textures.length; i < l; ++i) { // Parse textures.
                    var textureURI = modelConfig.textures[i];
                    var textureURL = path.join(dirURL, textureURI);
                    if (fs.existsSync(textureURL)) {
                        var texture = { file: textureURI, width: 0, height: 0 };
                        var textureAtlasBuffer = fs.readFileSync(textureURL);
                        modelConfig.textures[i] = texture;
                        if (textureAtlasBuffer.toString('ascii', 12, 16) === "CgBI") {
                            texture.width = textureAtlasBuffer.readUInt32BE(32);
                            texture.height = textureAtlasBuffer.readUInt32BE(36);
                        }
                        else {
                            texture.width = textureAtlasBuffer.readUInt32BE(16);
                            texture.height = textureAtlasBuffer.readUInt32BE(20);
                        }
                    }
                    else {
                        console.log("File does not exist.", textureURL);
                    }
                }
                if (modelConfig.motions) { // Parse animation.
                    for (var k in modelConfig.motions) {
                        var motionConfigs = modelConfig.motions[k];
                        for (var _e = 0, motionConfigs_1 = motionConfigs; _e < motionConfigs_1.length; _e++) {
                            var motionConfig = motionConfigs_1[_e];
                            var motionURL = path.join(dirURL, motionConfig.file);
                            if (fs.existsSync(motionURL)) {
                                motionConfig.motion = l2ft.parseMotion(fs.readFileSync(motionURL, "utf-8"));
                                deleteFiles.push(motionURL);
                            }
                            else {
                                console.log("File does not exist.", motionURL);
                            }
                        }
                    }
                }
                if (modelConfig.expressions) {
                    for (var k in modelConfig.expressions) {
                        var expressionConfig = modelConfig.expressions[k];
                        var expressionURL = path.join(dirURL, expressionConfig.file);
                        if (fs.existsSync(expressionURL)) {
                            expressionConfig.expression = JSON.parse(utils.formatJSONString(fs.readFileSync(expressionURL, "utf-8")));
                            deleteFiles.push(expressionURL);
                        }
                        else {
                            console.log("File does not exist.", expressionURL);
                        }
                    }
                }
                var result = fromLive2D_1.default(modelConfig);
                if (result === null) {
                    continue;
                }
                var outputDirURL = dirURL.replace(input, output);
                var outputURL = path.join(outputDirURL, fileName + "_ske.json");
                formatFormat_1.default(result);
                console.log(outputURL);
                if (!fs.existsSync(outputDirURL)) {
                    fs.mkdirsSync(outputDirURL);
                }
                if (outputDirURL !== dirURL) {
                    for (var _f = 0, _g = result.textureAtlas; _f < _g.length; _f++) {
                        var textureAtlas = _g[_f];
                        var rawImageURL = path.join(dirURL, textureAtlas.imagePath);
                        var outputImageURL = path.join(outputDirURL, textureAtlas.imagePath);
                        console.log(outputImageURL);
                        if (!fs.existsSync(path.dirname(outputImageURL))) {
                            fs.mkdirsSync(path.dirname(outputImageURL));
                        }
                        if (deleteRaw) {
                            fs.moveSync(rawImageURL, outputImageURL);
                        }
                        else {
                            fs.copySync(rawImageURL, outputImageURL);
                        }
                    }
                }
                object.compress(result, dbft.compressConfig);
                fs.writeFileSync(outputURL, JSON.stringify(result));
                if (deleteRaw) {
                    for (var _h = 0, deleteFiles_1 = deleteFiles; _h < deleteFiles_1.length; _h++) {
                        var file_1 = deleteFiles_1[_h];
                        fs.unlinkSync(file_1);
                    }
                }
            }
            break;
        }
        case "cocos":
        // loadTextureAtlasToData = true;
        // megreTextureAtlasToData = true;
        // break;
        default:
            console.log("Unknown type: " + type);
            return;
    }
    console.log("Convert complete.");
    if (helper.hasInput()) {
        helper.start();
        console.log("Waitting for helper.");
    }
}
execute();
