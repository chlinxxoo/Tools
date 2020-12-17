"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addInput = exports.hasInput = exports.stop = exports.start = void 0;
var fs = require("fs-extra");
var http = require("http");
var nodeUtils = require("../common/nodeUtils");
var server_1 = require("../common/server");
var inputCount = 0;
var inputs = [];
var inputeds = [];
var gate = new server_1.Gate();
gate.actions["/modify_spine_textureatlas"] = function (request, response) {
    var jsonString = "";
    request.addListener("data", function (data) {
        jsonString += data;
    });
    request.addListener("end", function () {
        request.removeAllListeners();
        var result;
        try {
            result = JSON.parse(jsonString);
        }
        catch (error) {
            gate.responseEnd(response, server_1.Code.JSONError, server_1.Code[server_1.Code.JSONError]);
            return;
        }
        var input = getAndRemoveInputs(result.id);
        var textureData = new Buffer(result.data.texture, "base64");
        fs.writeFileSync(input.data.file, textureData);
        gate.responseEnd(response, server_1.Code.Success, server_1.Code[server_1.Code.Success], false);
        console.log("Modify texture atlas.", input.data.file);
        if (inputs.length === 0 && inputeds.length === 0) {
            stop();
        }
    });
};
gate.actions["/get_input"] = function (request, response) {
    // let jsonString = "";
    request.addListener("data", function () {
        // jsonString += data;
    });
    request.addListener("end", function () {
        request.removeAllListeners();
        // let result: Input;
        // try {
        //     result = JSON.parse(jsonString);
        // }
        // catch (error) {
        //     gate.responseEnd(response, Code.JSONError, Code[Code.JSONError]);
        //     return;
        // }
        if (inputs.length > 0) {
            var input = inputs.shift();
            inputeds.push(input);
            gate.responseEnd(response, server_1.Code.Success, server_1.Code[server_1.Code.Success], input);
        }
        else {
            gate.responseEnd(response, server_1.Code.Success, server_1.Code[server_1.Code.Success], false);
        }
    });
};
function start() {
    console.log("Helper start.");
    var portServer = http.createServer();
    portServer.listen(0, function () {
        var port = portServer.address().port;
        portServer.close();
        gate.start("dragonbones", port, "/dragonbones_helper");
        nodeUtils.open("http://" + nodeUtils.findIP() + ":" + port + "/dragonbones_helper/resource/helper.html");
    });
}
exports.start = start;
function stop() {
    console.log("Helper stop.");
    gate.stop();
}
exports.stop = stop;
function hasInput() {
    return inputs.length > 0 || inputeds.length > 0;
}
exports.hasInput = hasInput;
function addInput(input) {
    input.id = inputCount++;
    inputs.push(input);
}
exports.addInput = addInput;
function getAndRemoveInputs(id) {
    for (var i = 0, l = inputeds.length; i < l; ++i) {
        var input = inputeds[i];
        if (input.id === id) {
            inputeds.splice(i, 1);
            return input;
        }
    }
    throw new Error("Never");
}
