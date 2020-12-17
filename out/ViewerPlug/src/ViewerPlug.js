"use strict";
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var ViewerPlug = /** @class */ (function (_super_1) {
    __extends(ViewerPlug, _super_1);
    function ViewerPlug() {
        var _this = _super_1.call(this) || this;
        _this.BTN_CONFIG = [
            {
                clazz: eui.Button,
                text: '打印骨骼',
                func: function () {
                    _this._ead.armature.getBones().forEach((function (bone) {
                        _this.log(bone.name);
                    }));
                }
            },
            {
                clazz: eui.Label,
                text: '龙骨',
                func: undefined
            }
        ];
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        if (DEBUG) {
            (window._vp) = _this;
        }
        return _this;
    }
    ViewerPlug.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var assetAdapter;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assetAdapter = new AssetAdapter();
                        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
                        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
                        return [4 /*yield*/, RES.loadConfig("resource/default.res.json", "resource/")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.loadTheme()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPlug.prototype.rFindEad = function (root) {
        if (root.numChildren) {
            for (var i = 0; i < root.numChildren; i++) {
                var obj = root.getChildAt(i);
                if (obj instanceof dragonBones.EgretArmatureDisplay) {
                    if (obj.armature.name == this._armatureName) {
                        return obj;
                    }
                }
                else if (obj instanceof egret.DisplayObjectContainer) {
                    return this.rFindEad(obj);
                }
            }
        }
    };
    ViewerPlug.prototype.onChanged = function (armtureName) {
        var _this = this;
        this._armatureName = armtureName;
        egret.setTimeout(function () {
            _this._ead = _this.rFindEad(_this.stage);
            if (_this._ead) {
                _this.log("rfind 成功");
                _this.gp_root && (_this.gp_root.visible = true);
            }
        }, this, 500);
    };
    ViewerPlug.prototype.inject = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.log("注入");
                        return [4 /*yield*/, this.init()];
                    case 1:
                        _a.sent();
                        this._armatureList = document.getElementById("armatureList");
                        this._armatureList && (this._armatureList.onchange = function (t) {
                            _this.gp_root && (_this.gp_root.visible = false);
                            _this.onChanged(t.target.value);
                        });
                        this.onChanged(this._armatureList.item(this._armatureList.selectedIndex).textContent);
                        this.updateDebugPanel();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPlug.prototype.onAddToStage = function (event) {
        egret.lifecycle.addLifecycleListener(function (context) {
            // custom lifecycle plugin
            context.onUpdate = function () {
            };
        });
        egret.lifecycle.onPause = function () {
            egret.ticker.pause();
        };
        egret.lifecycle.onResume = function () {
            egret.ticker.resume();
        };
    };
    ViewerPlug.prototype.loadTheme = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            var theme = new eui.Theme("resource/default.thm.json", _this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, function () {
                resolve();
            }, _this);
        });
    };
    ViewerPlug.prototype.updateDebugPanel = function () {
        this.width = 400;
        this.height = egret.MainContext.instance.stage.stageHeight;
        if (!this.gp_root) {
            this.gp_root = new eui.Group();
            var layout = new eui.VerticalLayout();
            this.gp_root.layout = layout;
            this.gp_root.bottom = 0;
            this.gp_root.left = 0;
            this.addChild(this.gp_root);
            this.gp_root.visible = false;
            for (var _i = 0, _a = this.BTN_CONFIG; _i < _a.length; _i++) {
                var c = _a[_i];
                this.gp_root.addChild(this.genCompoment(c));
            }
        }
    };
    ViewerPlug.prototype.genCompoment = function (c) {
        var clazz;
        if (c.clazz == eui.Button) {
            clazz = new c.clazz();
            clazz.label = c.text;
            if (c.func) {
                clazz.addEventListener(egret.TouchEvent.TOUCH_TAP, c.func, clazz);
            }
        }
        else if (c.clazz == eui.Label) {
            clazz = new c.clazz();
            clazz.text = c.text;
        }
        return clazz;
    };
    ViewerPlug.prototype.log = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        egret.log.apply(egret, __spreadArrays(["【ViewerPlug】" + message], optionalParams));
    };
    return ViewerPlug;
}(eui.Group));
