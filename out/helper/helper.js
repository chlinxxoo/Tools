"use strict";
var internalID = -1;
var actions = {};
var canvasA = document.getElementById("helpCanvasA");
var canvasB = document.getElementById("helpCanvasB");
var contextA = canvasA.getContext("2d");
var contextB = canvasB.getContext("2d");
function load(url, data, callback) {
    if (data === void 0) { data = null; }
    if (callback === void 0) { callback = null; }
    var xhr = new XMLHttpRequest();
    if (callback) {
        xhr.addEventListener("load", function () {
            callback(JSON.parse(xhr.response));
        });
        xhr.addEventListener("error", stopHelper);
        xhr.addEventListener("timeout", stopHelper);
    }
    if (data) {
        xhr.open("POST", url + "?v=" + Math.random(), true);
        xhr.send(JSON.stringify(data));
    }
    else {
        xhr.open("GET", url + "?v=" + Math.random(), true);
        xhr.send();
    }
}
function startHelper() {
    var actionKey = "modify_spine_textureatlas";
    actions[actionKey] = function (input) {
        var image = document.createElement("img");
        image.src = "data:image/png;base64," + input.data.texture;
        image.onload = function () {
            canvasA.width = image.width;
            canvasA.height = image.height;
            contextA.drawImage(image, 0, 0);
            for (var _i = 0, _a = input.data.config.SubTexture; _i < _a.length; _i++) {
                var subTexture = _a[_i];
                if (!subTexture.rotated) {
                    continue;
                }
                subTexture.x = subTexture.x || 0.0;
                subTexture.y = subTexture.y || 0.0;
                subTexture.width = subTexture.width || 0.0;
                subTexture.height = subTexture.height || 0.0;
                canvasB.width = subTexture.width;
                canvasB.height = subTexture.height;
                contextB.save();
                contextB.translate(subTexture.x + subTexture.width, subTexture.y + subTexture.height);
                contextB.rotate(Math.PI);
                contextB.drawImage(image, 0, 0);
                contextB.restore();
                var imageData = contextB.getImageData(0, 0, subTexture.width, subTexture.height);
                contextA.putImageData(imageData, subTexture.x, subTexture.y);
            }
            input.data.texture = canvasA.toDataURL("image/png").replace("data:image/png;base64,", "");
            load("../" + actionKey, input);
        };
    };
    internalID = setInterval(function () {
        load("../get_input", null, function (result) {
            var input = result.data;
            if (input) {
                var action = actions[input.type];
                if (action) {
                    action(input);
                }
                else {
                    console.log("Unknown action:", input.type);
                }
            }
            else {
                console.log(result.code, result.message);
            }
        });
    }, 1000);
}
function stopHelper() {
    clearInterval(internalID);
    window.close();
}
//# sourceMappingURL=helper.js.map