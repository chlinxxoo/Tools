"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compress = exports.copyObjectFrom = void 0;
function copyObjectFrom(from, to, config, scale) {
    if (scale === void 0) { scale = 1.0; }
    var dataConfig = null;
    if (config !== null) {
        var index = config.indexOf(to.constructor);
        if (index >= 0 && index < config.length - 1) {
            dataConfig = config[index + 1];
        }
    }
    for (var k in to) {
        if (!(k in from)) {
            continue;
        }
        _copyObjectFrom(to, k, to[k], from[k], dataConfig ? dataConfig[k] : null, config, scale);
    }
}
exports.copyObjectFrom = copyObjectFrom;
function _copyObjectFrom(parent, key, data, object, creater, config, scale) {
    if (scale === void 0) { scale = 1.0; }
    var dataType = typeof data;
    var objectType = typeof object;
    if (objectType === "function") { //
        return;
    }
    if (object === null || object === undefined || objectType !== "object") {
        if (creater instanceof Function) {
            object = creater(key, object, scale);
        }
        if (dataType === objectType) {
            parent[key] = object;
        }
        else if (dataType === "boolean") {
            // console.warn(`${key}: ${objectType} is not a boolean.`);
            switch (object) {
                case "0":
                case "NaN":
                case "":
                case "false":
                case "null":
                case "undefined":
                    parent[key] = false;
                    break;
                default:
                    parent[key] = Boolean(object);
                    break;
            }
        }
        else if (dataType === "number") {
            // console.warn(`${key}: ${objectType} is not a number.`);
            if (object === "NaN" || object === null) {
                parent[key] = NaN;
            }
            else {
                parent[key] = Number(object);
            }
        }
        else if (dataType === "string") {
            // console.warn(`${key}: ${objectType} is not a string.`);
            if (object || object === object) {
                parent[key] = String(object);
            }
            else {
                parent[key] = "";
            }
        }
        else {
            parent[key] = object;
        }
    }
    else if (object instanceof Array) {
        if (!(data instanceof Array)) {
            // console.warn(`${key}: ${dataType} is not an array.`);
            parent[key] = data = [];
        }
        if (data instanceof Array) {
            data.length = object.length;
            for (var i = 0, l = data.length; i < l; ++i) {
                _copyObjectFrom(data, i, data[i], object[i], creater, config, scale);
            }
        }
    }
    else {
        // object instanceof Object
        if (data !== null && data !== undefined && dataType === "object") {
            // exist object
            if (creater instanceof Array) {
                for (var k in object) {
                    _copyObjectFrom(data, k, data[k], object[k], creater[0], config, scale);
                }
            }
            else {
                copyObjectFrom(object, data, config, scale);
            }
        }
        else if (creater) {
            // object is null
            if (creater instanceof Array) {
                if (creater[1] === Function) {
                    var clazz = creater[0](object);
                    parent[key] = data = new clazz();
                    copyObjectFrom(object, data, config, scale);
                }
                else {
                    parent[key] = data = creater[1] === Array ? [] : {};
                    for (var k in object) {
                        _copyObjectFrom(data, k, data[k], object[k], creater[0], config, scale);
                    }
                }
            }
            else if (creater) {
                parent[key] = data = new creater();
                copyObjectFrom(object, data, config, scale);
            }
            else {
                // console.warn(`${key}: shallow copy.`);
                parent[key] = object;
            }
        }
        else {
            // console.warn(`${key}: shallow copy.`);
            parent[key] = object;
        }
    }
}
function compress(data, config) {
    if ((typeof data) !== "object") {
        return false;
    }
    if (data instanceof Array) {
        var array = data;
        for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
            var item = array_1[_i];
            if (item !== null) {
                compress(item, config);
            }
        }
        if (array.length === 0) {
            return true;
        }
    }
    else {
        var defaultData = null;
        for (var _a = 0, config_1 = config; _a < config_1.length; _a++) {
            defaultData = config_1[_a];
            if (data.constructor === defaultData.constructor) {
                break;
            }
            defaultData = null;
        }
        if (defaultData !== null || typeof data === "object") {
            var count = 0;
            for (var k in data) {
                if (k.charAt(0) === "_") { // Pass private value.
                    delete data[k];
                    continue;
                }
                var value = data[k];
                var valueType = typeof value;
                if (defaultData !== null && (value === null || valueType === "undefined" || valueType === "boolean" || valueType === "number" || valueType === "string")) {
                    var defaultValue = defaultData[k];
                    if (value === defaultValue || (valueType === "number" && isNaN(value) && isNaN(defaultValue))) {
                        delete data[k];
                        continue;
                    }
                }
                else if (valueType === "object") {
                    if (compress(value, config)) {
                        if ((value instanceof Array) ? !(data["_" + k]) : true) {
                            delete data[k];
                        }
                        continue;
                    }
                }
                else {
                    continue;
                }
                count++;
            }
            return count === 0;
        }
    }
    return false;
}
exports.compress = compress;
//# sourceMappingURL=object.js.map