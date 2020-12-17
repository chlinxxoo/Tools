"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VivogamePlugin = void 0;
var fs = require("fs");
var path = require("path");
var VivogamePlugin = /** @class */ (function () {
    function VivogamePlugin() {
        this.jsFileList = [];
    }
    VivogamePlugin.prototype.onFile = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var filename, content, content;
            return __generator(this, function (_a) {
                if (file.extname == '.js') {
                    filename = file.origin;
                    if (filename == "libs/modules/promise/promise.js" || filename == 'libs/modules/promise/promise.min.js') {
                        return [2 /*return*/, null];
                    }
                    this.jsFileList.push(file.basename);
                    if (filename == 'libs/modules/egret/egret.js' || filename == 'libs/modules/egret/egret.min.js') {
                        content = file.contents.toString();
                        content += ";window.egret = egret;";
                        content = content.replace(/definition = __global/, "definition = window");
                        file.contents = new Buffer(content);
                    }
                    else {
                        content = file.contents.toString();
                        if (filename == "libs/modules/res/res.js" ||
                            filename == 'libs/modules/res/res.min.js' ||
                            filename == 'libs/modules/assetsmanager/assetsmanager.min.js' ||
                            filename == 'libs/modules/assetsmanager/assetsmanager.js') {
                            content += ";window.RES = RES;";
                        }
                        if (filename == "libs/modules/eui/eui.js" || filename == 'libs/modules/eui/eui.min.js') {
                            content += ";window.eui = eui;";
                            if (filename == "libs/modules/eui/eui.js") {
                                content = content.replace("function getRepeatedIds", "window.getRepeatedIds=function getRepeatedIds");
                                content = content.replace("function getIds", "window.getIds=function getIds");
                                content = content.replace("function toXMLString", "window.toXMLString=function toXMLString");
                                content = content.replace("function checkDeclarations", "window.checkDeclarations=function checkDeclarations");
                                content = content.replace("function getPropertyStr", "window.getPropertyStr=function getPropertyStr");
                            }
                        }
                        if (filename == 'libs/modules/dragonBones/dragonBones.js' || filename == 'libs/modules/dragonBones/dragonBones.min.js') {
                            content += ';window.dragonBones = dragonBones';
                        }
                        content = "var egret = window.egret;" + content;
                        if (filename == 'main.js') {
                            content += "\n;window.Main = Main;";
                        }
                        file.contents = new Buffer(content);
                    }
                }
                return [2 /*return*/, file];
            });
        });
    };
    VivogamePlugin.prototype.onFinish = function (pluginContext) {
        return __awaiter(this, void 0, void 0, function () {
            var gameJSPath, gameJSContent, projectConfig, optionStr, reg, replaceStr, orientation, gameJSONPath, gameJSONContent, engineVersion, isPublish, configArr, i, len, jsFile, replaceConfigStr, minigameConfigPath, configJSContent;
            return __generator(this, function (_a) {
                gameJSPath = path.join(pluginContext.outputDir, "game.js");
                if (!fs.existsSync(gameJSPath)) {
                    console.log(gameJSPath + "\u4E0D\u5B58\u5728\uFF0C\u8BF7\u5148\u4F7F\u7528 Launcher \u53D1\u5E03 Vivo \u5C0F\u6E38\u620F");
                    return [2 /*return*/];
                }
                gameJSContent = fs.readFileSync(gameJSPath, { encoding: "utf8" });
                projectConfig = pluginContext.buildConfig.projectConfig;
                optionStr = "entryClassName: " + projectConfig.entryClassName + ",\n\t\t" +
                    ("orientation: " + projectConfig.orientation + ",\n\t\t") +
                    ("frameRate: " + projectConfig.frameRate + ",\n\t\t") +
                    ("scaleMode: " + projectConfig.scaleMode + ",\n\t\t") +
                    ("contentWidth: " + projectConfig.contentWidth + ",\n\t\t") +
                    ("contentHeight: " + projectConfig.contentHeight + ",\n\t\t") +
                    ("showFPS: " + projectConfig.showFPS + ",\n\t\t") +
                    ("fpsStyles: " + projectConfig.fpsStyles + ",\n\t\t") +
                    ("showLog: " + projectConfig.showLog + ",\n\t\t") +
                    ("maxTouches: " + projectConfig.maxTouches + ",");
                reg = /\/\/----auto option start----[\s\S]*\/\/----auto option end----/;
                replaceStr = '\/\/----auto option start----\n\t\t' + optionStr + '\n\t\t\/\/----auto option end----';
                gameJSContent = gameJSContent.replace(reg, replaceStr);
                fs.writeFileSync(gameJSPath, gameJSContent);
                if (projectConfig.orientation == '"landscape"') {
                    orientation = "landscape";
                }
                else {
                    orientation = "portrait";
                }
                gameJSONPath = path.join(pluginContext.outputDir, "manifest.json");
                gameJSONContent = JSON.parse(fs.readFileSync(gameJSONPath, { encoding: "utf8" }));
                gameJSONContent.deviceOrientation = orientation;
                engineVersion = this.readData(path.join(pluginContext.projectRoot, "egretProperties.json")).engineVersion;
                if (!gameJSONContent.thirdEngine)
                    gameJSONContent.thirdEngine = {};
                gameJSONContent.thirdEngine.egret = engineVersion;
                fs.writeFileSync(gameJSONPath, JSON.stringify(gameJSONContent, null, "\t"));
                isPublish = pluginContext.buildConfig.command == "publish" ? true : false;
                configArr = [];
                for (i = 0, len = this.jsFileList.length; i < len; i++) {
                    jsFile = this.jsFileList[i];
                    if (isPublish) {
                        if (jsFile == "main.js") {
                            jsFile = 'main.min.js';
                        }
                        else if (jsFile == "default.thm.js") {
                            jsFile = "default.thm.min.js";
                        }
                    }
                    configArr.push(JSON.stringify({
                        module_name: "./js/" + jsFile,
                        module_path: "./js/" + jsFile,
                        module_from: "engine/js/" + jsFile,
                    }, null, "\t"));
                }
                replaceConfigStr = '\/\/----auto option start----\n\t\t' + configArr.toString() + '\n\t\t\/\/----auto option end----';
                minigameConfigPath = path.join(pluginContext.outputDir, "../", "minigame.config.js");
                if (!fs.existsSync(minigameConfigPath)) {
                    //5.2.28版本，vivo更新了项目结构，老项目需要升级
                    fs.writeFileSync(path.join(pluginContext.outputDir, "../", "vivo更新了项目结构，请重新创建vivo小游戏项目.js"), "vivo更新了项目结构，请重新创建vivo小游戏项目");
                }
                else {
                    configJSContent = fs.readFileSync(minigameConfigPath, { encoding: "utf8" });
                    configJSContent = configJSContent.replace(reg, replaceConfigStr);
                    fs.writeFileSync(minigameConfigPath, configJSContent);
                }
                return [2 /*return*/];
            });
        });
    };
    VivogamePlugin.prototype.readData = function (filePath) {
        return JSON.parse(fs.readFileSync(filePath, { encoding: "utf8" }));
    };
    return VivogamePlugin;
}());
exports.VivogamePlugin = VivogamePlugin;
