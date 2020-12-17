"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceJSON = exports.ResourceType = void 0;
var ResourceType;
(function (ResourceType) {
    ResourceType[ResourceType["JSON"] = 0] = "JSON";
    ResourceType[ResourceType["BIN"] = 1] = "BIN";
    ResourceType[ResourceType["Image"] = 2] = "Image";
})(ResourceType = exports.ResourceType || (exports.ResourceType = {}));
var ResourceGroup = /** @class */ (function () {
    function ResourceGroup() {
        this.name = "";
        this.keys = "";
    }
    return ResourceGroup;
}());
var Resource = /** @class */ (function () {
    function Resource() {
        this.name = "";
        this.type = "";
        this.url = "";
    }
    return Resource;
}());
var ResourceJSON = /** @class */ (function () {
    function ResourceJSON() {
        this.resources = [];
        this.groups = [];
    }
    ResourceJSON.prototype.clear = function () {
        this.resources.length = 0;
        this.groups.length = 0;
    };
    ResourceJSON.prototype.getResource = function (name) {
        for (var i = 0, l = this.resources.length; i < l; ++i) {
            var resource = this.resources[i];
            if (resource.name === name) {
                return resource;
            }
        }
        return null;
    };
    ResourceJSON.prototype.getResourceGroup = function (name) {
        for (var i = 0, l = this.groups.length; i < l; ++i) {
            var group = this.groups[i];
            if (group.name === name) {
                return group;
            }
        }
        return null;
    };
    ResourceJSON.prototype.addResource = function (name, type, url) {
        var groupNames = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            groupNames[_i - 3] = arguments[_i];
        }
        var resource = this.getResource(name) || new Resource();
        resource.name = name;
        resource.type = ResourceType[type].toLowerCase();
        resource.url = url;
        if (this.resources.indexOf(resource) < 0) {
            this.resources.push(resource);
        }
        if (groupNames && groupNames.length) {
            for (var i = 0, l = groupNames.length; i < l; ++i) {
                var groupName = groupNames[i];
                var resourceGroup = this.getResourceGroup(groupName) || new ResourceGroup();
                resourceGroup.name = groupName;
                if (resourceGroup.keys) {
                    var keys = resourceGroup.keys.split(",");
                    if (keys.indexOf(name) < 0) {
                        keys.push(name);
                    }
                    resourceGroup.keys = keys.join(",");
                }
                else {
                    resourceGroup.keys = name;
                }
                if (this.groups.indexOf(resourceGroup) < 0) {
                    this.groups.push(resourceGroup);
                }
            }
        }
    };
    return ResourceJSON;
}());
exports.ResourceJSON = ResourceJSON;
//# sourceMappingURL=resFormat.js.map