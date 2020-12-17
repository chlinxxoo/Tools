"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyConfig = exports.AllFrame = exports.AnimationFrame = exports.TweenFrame = exports.Frame = exports.AllTimeline = exports.Animation = exports.Timeline = exports.ArmatureDisplay = exports.ImageDisplay = exports.Display = exports.Slot = exports.Skin = exports.Bone = exports.Armature = exports.DragonBones = void 0;
var utils = require("../common/utils");
var geom_1 = require("./geom");
var dbft = require("./dragonBonesFormat");
/**
 * DragonBones format v23.
 */
var DragonBones = /** @class */ (function () {
    function DragonBones() {
        this.isGlobal = true;
        this.frameRate = 0;
        this.name = "";
        this.version = "";
        this.armature = [];
    }
    return DragonBones;
}());
exports.DragonBones = DragonBones;
var Armature = /** @class */ (function () {
    function Armature() {
        this.name = "";
        this.bone = [];
        this.skin = [];
        this.animation = [];
    }
    Armature.prototype.getBone = function (name) {
        for (var _i = 0, _a = this.bone; _i < _a.length; _i++) {
            var bone = _a[_i];
            if (bone.name === name) {
                return bone;
            }
        }
        return null;
    };
    return Armature;
}());
exports.Armature = Armature;
var Bone = /** @class */ (function () {
    function Bone() {
        this.name = "";
        this.parent = "";
        this.transform = new geom_1.Transform();
    }
    return Bone;
}());
exports.Bone = Bone;
var Skin = /** @class */ (function () {
    function Skin() {
        this.name = "default";
        this.slot = [];
    }
    return Skin;
}());
exports.Skin = Skin;
var Slot = /** @class */ (function () {
    function Slot() {
        this.blendMode = dbft.BlendMode[dbft.BlendMode.Normal].toLowerCase();
        this.z = 0;
        this.displayIndex = 0;
        this.name = "";
        this.parent = "";
        this.colorTransform = new geom_1.ColorTransform();
        this.display = [];
    }
    return Slot;
}());
exports.Slot = Slot;
var Display = /** @class */ (function () {
    function Display() {
        this.type = dbft.DisplayType[dbft.DisplayType.Image].toLowerCase();
        this.name = "";
        this.transform = new geom_1.Transform();
    }
    return Display;
}());
exports.Display = Display;
var ImageDisplay = /** @class */ (function (_super_1) {
    __extends(ImageDisplay, _super_1);
    function ImageDisplay(isDefault) {
        if (isDefault === void 0) { isDefault = false; }
        var _this = _super_1.call(this) || this;
        if (!isDefault) {
            _this.type = dbft.DisplayType[dbft.DisplayType.Image].toLowerCase();
        }
        return _this;
    }
    return ImageDisplay;
}(Display));
exports.ImageDisplay = ImageDisplay;
var ArmatureDisplay = /** @class */ (function (_super_1) {
    __extends(ArmatureDisplay, _super_1);
    function ArmatureDisplay(isDefault) {
        if (isDefault === void 0) { isDefault = false; }
        var _this = _super_1.call(this) || this;
        if (!isDefault) {
            _this.type = dbft.DisplayType[dbft.DisplayType.Armature].toLowerCase();
        }
        return _this;
    }
    return ArmatureDisplay;
}(Display));
exports.ArmatureDisplay = ArmatureDisplay;
var Timeline = /** @class */ (function () {
    function Timeline() {
        this.scale = 1.0;
        this.offset = 0.0;
        this.name = "";
        this.frame = [];
    }
    return Timeline;
}());
exports.Timeline = Timeline;
var Animation = /** @class */ (function () {
    function Animation() {
        this.autoTween = true;
        this.tweenEasing = null;
        this.duration = 1;
        this.loop = 1;
        this.scale = 1.0;
        this.fadeInTime = 0.0;
        this.name = "default";
        this.frame = [];
        this.timeline = [];
    }
    return Animation;
}());
exports.Animation = Animation;
var AllTimeline = /** @class */ (function (_super_1) {
    __extends(AllTimeline, _super_1);
    function AllTimeline() {
        return _super_1 !== null && _super_1.apply(this, arguments) || this;
    }
    return AllTimeline;
}(Timeline));
exports.AllTimeline = AllTimeline;
var Frame = /** @class */ (function () {
    function Frame() {
        this.duration = 1;
    }
    return Frame;
}());
exports.Frame = Frame;
var TweenFrame = /** @class */ (function (_super_1) {
    __extends(TweenFrame, _super_1);
    function TweenFrame() {
        var _this = _super_1 !== null && _super_1.apply(this, arguments) || this;
        _this.tweenEasing = null;
        _this.curve = [];
        return _this;
    }
    return TweenFrame;
}(Frame));
exports.TweenFrame = TweenFrame;
var AnimationFrame = /** @class */ (function (_super_1) {
    __extends(AnimationFrame, _super_1);
    function AnimationFrame() {
        var _this = _super_1 !== null && _super_1.apply(this, arguments) || this;
        _this.action = "";
        _this.event = "";
        _this.sound = "";
        return _this;
    }
    return AnimationFrame;
}(Frame));
exports.AnimationFrame = AnimationFrame;
var AllFrame = /** @class */ (function (_super_1) {
    __extends(AllFrame, _super_1);
    function AllFrame() {
        var _this = _super_1 !== null && _super_1.apply(this, arguments) || this;
        _this.hide = false;
        _this.tweenRotate = 0;
        _this.displayIndex = 0;
        _this.action = "";
        _this.event = "";
        _this.sound = "";
        _this.transform = new geom_1.Transform();
        _this.colorTransform = new geom_1.ColorTransform();
        return _this;
    }
    return AllFrame;
}(TweenFrame));
exports.AllFrame = AllFrame;
exports.copyConfig = [
    DragonBones, {
        armature: Armature,
        textureAtlas: dbft.TextureAtlas
    },
    Armature, {
        bone: Bone,
        skin: Skin,
        animation: Animation
    },
    Bone, {
        transform: geom_1.Transform
    },
    Slot,
    {
        display: [
            function (display) {
                var type = display.type;
                if (type !== undefined) {
                    if (typeof type === "string") {
                        type = utils.getEnumFormString(dbft.DisplayType, type, dbft.DisplayType.Image);
                    }
                }
                else {
                    type = dbft.DisplayType.Image;
                }
                switch (type) {
                    case dbft.DisplayType.Image:
                        return ImageDisplay;
                    case dbft.DisplayType.Armature:
                        return ArmatureDisplay;
                }
                return null;
            },
            Function
        ]
    },
    Skin, {
        slot: Slot
    },
    Animation, {
        frame: AnimationFrame,
        timeline: AllTimeline
    },
    AllTimeline, {
        frame: AllFrame
    },
    AllFrame, {
        transform: geom_1.Transform,
        colorTransform: geom_1.ColorTransform
    },
    dbft.TextureAtlas, {
        SubTexture: dbft.Texture
    }
];
