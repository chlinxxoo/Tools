#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var nodeUtils = require("../common/nodeUtils");
var dbft = require("../format/dragonBonesFormat");
var resft = require("../format/resFormat");
var dbUtils = require("../format/utils");
var RESOURCE_PATH = "resource";
var RESOURCE_NAME = "base_test.res.json";
var PRELOAD_NAME = "baseTest";
var SEARCH_GROUP_NAME = "search";
function modifyResourcesPath(file) {
    var index = file.indexOf(RESOURCE_PATH);
    if (index > 0) {
        file = file.substr(index + RESOURCE_PATH.length + 1);
    }
    file = file.replace(/\\/g, "/");
    return file;
}
function execute() {
    var args = process.argv.slice(2);
    var root = process.cwd();
    var include = args[0];
    var resourcesJSON = new resft.ResourceJSON();
    var files = nodeUtils.filterFileList(root, /\.(json)$/i);
    for (var i = 0, l = files.length; i < l; ++i) {
        var file = files[i];
        if (include && file.indexOf(include) < 0) {
            continue;
        }
        var fileDir = path.dirname(file);
        var fileName = path.basename(file, ".json");
        var fileString = fs.readFileSync(file).toString();
        if (!dbft.isDragonBonesString(fileString)) {
            continue;
        }
        var dragonBonesJSON = JSON.parse(fs.readFileSync(file).toString());
        var dataName = dragonBonesJSON.name;
        resourcesJSON.addResource(dataName, resft.ResourceType.JSON, modifyResourcesPath(file), PRELOAD_NAME, SEARCH_GROUP_NAME);
        // Binary
        var binaryFile = path.join(fileDir, fileName + ".dbbin");
        if (fs.existsSync(binaryFile)) {
            console.log(binaryFile);
            resourcesJSON.addResource(dataName + "_binary", resft.ResourceType.BIN, modifyResourcesPath(binaryFile), PRELOAD_NAME);
        }
        // // Movie
        // const movieFile = dragonBonesFile.replace(".json", ".dbmv");
        // if (fs.existsSync(movieFile)) {
        //     console.log(movieFile);
        //     resourcesJSON.addResource(
        //         dataName + "_mov",
        //         resft.ResourceType.BIN,
        //         modifyResourcesPath(movieFile),
        //         PRELOAD_NAME
        //     );
        // }
        var textureAtlass = dragonBonesJSON.textureAtlas;
        if (textureAtlass) {
            for (var i_1 = 0, l_1 = textureAtlass.length; i_1 < l_1; ++i_1) {
                var textureAtlas = textureAtlass[i_1];
                var textureAtlasFile = path.join(fileDir, textureAtlas.imagePath);
                resourcesJSON.addResource(dataName + "_texture_" + i_1, resft.ResourceType.Image, modifyResourcesPath(textureAtlasFile), PRELOAD_NAME);
                console.log(textureAtlasFile);
            }
        }
        else {
            var textureAtlass_1 = dbUtils.getTextureAtlases(file); // TextureAtlas config and TextureAtlas.
            if (textureAtlass_1.length > 0) {
                for (var i_2 = 0, l_2 = textureAtlass_1.length; i_2 < l_2; ++i_2) {
                    var textureAtlasConfig = textureAtlass_1[i_2];
                    var textureAtlas = textureAtlasConfig.replace(".json", ".png");
                    resourcesJSON.addResource(dataName + "_texture_config_" + i_2, resft.ResourceType.JSON, modifyResourcesPath(textureAtlasConfig), PRELOAD_NAME);
                    resourcesJSON.addResource(dataName + "_texture_" + i_2, resft.ResourceType.Image, modifyResourcesPath(textureAtlas), PRELOAD_NAME);
                    console.log(textureAtlasConfig);
                    console.log(textureAtlas);
                }
            }
        }
    }
    if (resourcesJSON.resources.length > 0) {
        var file = root;
        if (file.indexOf(RESOURCE_PATH) >= 0) {
            file = path.join(file, RESOURCE_NAME);
        }
        else {
            file = path.join(file, RESOURCE_PATH, RESOURCE_NAME);
        }
        fs.writeFileSync(file, new Buffer(JSON.stringify(resourcesJSON)));
        console.log(file);
    }
    console.log("Complete.");
}
execute();
//# sourceMappingURL=testDemos.js.map