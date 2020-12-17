"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnumFormString = exports.rgbaToHex = exports.formatJSONString = void 0;
function formatJSONString(string) {
    var firstCode = string.charCodeAt(0);
    if (firstCode < 0x20 || firstCode > 0x7f) {
        string = string.substring(1); // 去除第一个字符  
    }
    return string;
}
exports.formatJSONString = formatJSONString;
function rgbaToHex(r, g, b, a) {
    var result = "";
    var s = Math.round(r).toString(16);
    if (s.length < 2)
        (s = "0" + s);
    result += s;
    s = Math.round(g).toString(16);
    if (s.length < 2)
        (s = "0" + s);
    result += s;
    s = Math.round(b).toString(16);
    if (s.length < 2)
        (s = "0" + s);
    result += s;
    s = Math.round(a).toString(16);
    if (s.length < 2)
        (s = "0" + s);
    result += s;
    return result;
}
exports.rgbaToHex = rgbaToHex;
if (!String.prototype.padStart) {
    String.prototype.padStart = function (maxLength, fillString) {
        if (fillString === void 0) { fillString = ' '; }
        var source = this;
        if (source.length >= maxLength)
            return String(source);
        var fillLength = maxLength - source.length;
        var times = Math.ceil(fillLength / fillString.length);
        while (times >>= 1) {
            fillString += fillString;
            if (times === 1) {
                fillString += fillString;
            }
        }
        return fillString.slice(0, fillLength) + source;
    };
}
function getEnumFormString(enumerator, type, defaultType) {
    if (defaultType === void 0) { defaultType = -1; }
    if (typeof type === "number") {
        return type;
    }
    for (var k in enumerator) {
        if (typeof k === "string") {
            if (k.toLowerCase() === type.toLowerCase()) {
                return enumerator[k];
            }
        }
    }
    return defaultType;
}
exports.getEnumFormString = getEnumFormString;
