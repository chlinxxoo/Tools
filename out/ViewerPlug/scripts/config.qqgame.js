"use strict";
/// 阅读 api.d.ts 查看文档
///<reference path="api.d.ts"/>
var built_in_1 = require("built-in");
var qqgame_1 = require("./qqgame/qqgame");
var defaultConfig = require("./config");
//是否使用QQ小游戏引擎插件
var useQQPlugin = true;
var pluginList = [];
var config = {
    buildConfig: function (params) {
        var target = params.target, command = params.command, projectName = params.projectName, version = params.version;
        var outputDir = "../" + projectName + "_qqgame";
        if (command == 'build') {
            return {
                outputDir: outputDir,
                commands: [
                    new built_in_1.CleanPlugin({ matchers: ["js", "resource"] }),
                    new built_in_1.CompilePlugin({ libraryType: "debug", defines: { DEBUG: true, RELEASE: false } }),
                    new built_in_1.ExmlPlugin('commonjs'),
                    new qqgame_1.QQgamePlugin(useQQPlugin, pluginList),
                    new built_in_1.ManifestPlugin({ output: 'manifest.js', qqPlugin: { use: useQQPlugin, pluginList: pluginList } })
                ]
            };
        }
        else if (command == 'publish') {
            return {
                outputDir: outputDir,
                commands: [
                    new built_in_1.CleanPlugin({ matchers: ["js", "resource"] }),
                    new built_in_1.CompilePlugin({ libraryType: "release", defines: { DEBUG: false, RELEASE: true } }),
                    new built_in_1.ExmlPlugin('commonjs'),
                    new qqgame_1.QQgamePlugin(useQQPlugin, pluginList),
                    new built_in_1.UglifyPlugin([{
                            sources: ["resource/default.thm.js"],
                            target: "default.thm.min.js"
                        }, {
                            sources: ["main.js"],
                            target: "main.min.js"
                        }
                    ]),
                    new built_in_1.ManifestPlugin({ output: 'manifest.js', qqPlugin: { use: useQQPlugin, pluginList: pluginList } })
                ]
            };
        }
        else {
            throw "unknown command : " + params.command;
        }
    },
    mergeSelector: defaultConfig.mergeSelector,
    typeSelector: defaultConfig.typeSelector
};
module.exports = config;
