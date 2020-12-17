"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
var object = require("./common/object");
var nodeUtils = require("./common/nodeUtils");
var server_1 = require("./common/server");
var dbft = require("./format/dragonBonesFormat");
var spft = require("./format/spineFormat");
var fromSpine_1 = require("./action/fromSpine");
var toFormat_1 = require("./action/toFormat");
var toNew_1 = require("./action/toNew");
var toBinary_1 = require("./action/toBinary");
var toWeb_1 = require("./action/toWeb");
// import toSpine from "./action/toSpine";
var formatFormat_1 = require("./action/formatFormat");
var Output = /** @class */ (function () {
    function Output(data, name, suffix, format) {
        if (name === void 0) { name = ""; }
        if (suffix === void 0) { suffix = ""; }
        if (format === void 0) { format = "string"; }
        this.data = data;
        this.format = format;
        this.name = name;
        this.suffix = suffix;
    }
    return Output;
}());
var gate = new server_1.Gate();
gate.actions["/convert"] = function (request, response) {
    var jsonString = "";
    request.addListener("data", function (data) {
        jsonString += data;
    });
    request.addListener("end", function () {
        request.removeAllListeners();
        var input;
        try {
            input = JSON.parse(jsonString);
        }
        catch (error) {
            gate.responseEnd(response, server_1.Code.JSONError, server_1.Code[server_1.Code.JSONError], jsonString);
            return;
        }
        try {
            if (input.from) {
                switch (input.from) {
                    case "spine": {
                        var spineInput = null;
                        try {
                            spineInput = JSON.parse(input.data);
                        }
                        catch (error) {
                        }
                        if (!spineInput) {
                            gate.responseEnd(response, server_1.Code.DataError, server_1.Code[server_1.Code.DataError]);
                            return;
                        }
                        var spine = new spft.Spine();
                        object.copyObjectFrom(JSON.parse(spineInput.data), spine, spft.copyConfig);
                        var result = fromSpine_1.default({ name: spineInput.name, data: spine, textureAtlas: spineInput.textureAtlas }, true);
                        formatFormat_1.default(result);
                        object.compress(result, dbft.compressConfig);
                        gate.responseEnd(response, server_1.Code.Success, server_1.Code[server_1.Code.Success], result);
                        // TODO
                        break;
                    }
                    case "cocos": {
                        break;
                    }
                }
            }
            else if (input.to) {
                var dragonBonesData = null;
                try {
                    dragonBonesData = toFormat_1.default(input.data, function () {
                        return [];
                    });
                }
                catch (error) {
                }
                if (!dragonBonesData) {
                    gate.responseEnd(response, server_1.Code.DataError, server_1.Code[server_1.Code.DataError], input.data);
                    return;
                }
                var toOutput = [];
                switch (input.to) {
                    case "binary": {
                        toNew_1.default(dragonBonesData, true);
                        formatFormat_1.default(dragonBonesData);
                        var result = new Buffer(toBinary_1.default(dragonBonesData)).toString("base64");
                        toOutput.push(new Output(result, dragonBonesData.name, "_ske.dbbin", "base64"));
                        break;
                    }
                    case "new": {
                        toNew_1.default(dragonBonesData, false);
                        formatFormat_1.default(dragonBonesData);
                        if (input.compress !== false) {
                            object.compress(dragonBonesData, dbft.compressConfig);
                        }
                        var result = JSON.stringify(dragonBonesData);
                        toOutput.push(new Output(result, dragonBonesData.name, "_ske.json", "string"));
                        break;
                    }
                    case "player":
                    case "viewer": {
                        toNew_1.default(dragonBonesData, true);
                        formatFormat_1.default(dragonBonesData);
                        var result = toWeb_1.default({
                            data: new Buffer(toBinary_1.default(dragonBonesData)),
                            textureAtlases: input.textureAtlases ? input.textureAtlases.map(function (v) {
                                return new Buffer(v, "base64");
                            }) : [],
                            config: input.config
                        }, input.to === "player");
                        toOutput.push(new Output(result, dragonBonesData.name, ".html", "string"));
                        break;
                    }
                    case "spine": {
                        // toNew(dragonBonesData, true);
                        // format(dragonBonesData);
                        // const result = toSpine(dragonBonesData, input.config, false);
                        // for (const spine of result.spines) {
                        //     if (input.compress !== false) {
                        //         object.compress(spine, spft.compressConfig);
                        //     }
                        //     toOutput.push(
                        //         new Output(
                        //             JSON.stringify(spine),
                        //             result.spines.length > 1 ? `${dragonBonesData.name}_${spine.skeleton.name}` : dragonBonesData.name,
                        //             ".json",
                        //             "string"
                        //         )
                        //     );
                        // }
                        // if (result.textureAtlas) {
                        //     toOutput.push(
                        //         new Output(
                        //             result.textureAtlas,
                        //             dragonBonesData.name,
                        //             ".atlas",
                        //             "string"
                        //         )
                        //     );
                        // }
                        break;
                    }
                    default:
                        gate.responseEnd(response, server_1.Code.DataError, server_1.Code[server_1.Code.DataError], input.to);
                        return;
                }
                gate.responseEnd(response, server_1.Code.Success, server_1.Code[server_1.Code.Success], toOutput);
            }
        }
        catch (error) {
            gate.responseEnd(response, server_1.Code.ActionError, server_1.Code[server_1.Code.ActionError]);
            return;
        }
    });
};
function execute() {
    if (process.argv.length > 1) {
        var port = Number(process.argv[2]);
        if (port === port && port >= 0 && port <= 65535) {
            var url_1 = "http://" + nodeUtils.findIP() + ":" + port + "/dragonbones";
            gate.actions["/working_directory"] = function (request, response) {
                // let jsonString = "";
                request.addListener("data", function () {
                    // jsonString += data;
                });
                request.addListener("end", function () {
                    request.removeAllListeners();
                    gate.responseEnd(response, server_1.Code.Success, server_1.Code[server_1.Code.Success], { url: url_1, workingDirectory: __dirname });
                });
            };
            gate.start("dragonbones", port, "/dragonbones");
            console.log(url_1);
            return;
        }
    }
    var portServer = http.createServer();
    portServer.listen(0, function () {
        var port = portServer.address().port;
        portServer.close();
        gate.start("dragonbones", port, "/dragonbones");
        console.log("http://" + nodeUtils.findIP() + ":" + port + "/dragonbones");
    });
}
execute();
