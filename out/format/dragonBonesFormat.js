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
exports.ArmatureDisplay = exports.ImageDisplay = exports.BoundingBoxDisplay = exports.Display = exports.SkinSlot = exports.Skin = exports.PathConstraint = exports.IKConstraint = exports.Slot = exports.Surface = exports.Bone = exports.Armature = exports.Canvas = exports.Action = exports.OldAction = exports.UserData = exports.DragonBones = exports.BaseData = exports.modifyFramesByPosition = exports.mergeActionToAnimation = exports.oldActionToNewAction = exports.getTextureFormTextureAtlases = exports.getFrameByPosition = exports.getEdgeFormTriangles = exports.getEasingValue = exports.samplingEasingCurve = exports.getCurveEasingValue = exports.getCurvePoint = exports.isDragonBonesString = exports.TweenType = exports.TimelineType = exports.AnimationBlendType = exports.AnimationType = exports.BlendMode = exports.ActionType = exports.BoundingBoxType = exports.DisplayType = exports.BoneType = exports.ArmatureType = exports.BinaryOffset = exports.OffsetOrder = exports.DATA_VERSIONS = exports.DATA_VERSION = exports.DATA_VERSION_5_6 = exports.DATA_VERSION_5_5 = exports.DATA_VERSION_5_0 = exports.DATA_VERSION_4_5 = exports.DATA_VERSION_4_0 = exports.DATA_VERSION_3_0 = exports.DATA_VERSION_2_3 = void 0;
exports.compressConfig = exports.copyConfig = exports.Texture = exports.TextureAtlas = exports.IKConstraintFrame = exports.SlotColorFrame = exports.SlotDisplayFrame = exports.SlotAllFrame = exports.BoneRotateFrame = exports.BoneAllFrame = exports.ActionFrame = exports.MutilpleValueFrame = exports.DoubleValueFrame1 = exports.DoubleValueFrame0 = exports.SingleValueFrame1 = exports.SingleValueFrame0 = exports.TweenFrame = exports.Frame = exports.AnimationTimeline = exports.SlotDeformTimeline = exports.IKConstraintTimeline = exports.ZOrderTimeline = exports.SlotTimeline = exports.BoneTimeline = exports.TypeTimeline = exports.Timeline = exports.AnimationBinary = exports.Animation = exports.PolygonBoundingBoxDisplay = exports.EllipseBoundingBoxDisplay = exports.RectangleBoundingBoxDisplay = exports.PathDisplay = exports.SharedMeshDisplay = exports.MeshDisplay = void 0;
var utils = require("../common/utils");
var geom_1 = require("./geom");
var dbftV23 = require("./dragonBonesFormatV23");
/**
 * DragonBones format.
 */
exports.DATA_VERSION_2_3 = "2.3";
exports.DATA_VERSION_3_0 = "3.0";
exports.DATA_VERSION_4_0 = "4.0";
exports.DATA_VERSION_4_5 = "4.5";
exports.DATA_VERSION_5_0 = "5.0";
exports.DATA_VERSION_5_5 = "5.5";
exports.DATA_VERSION_5_6 = "5.6";
exports.DATA_VERSION = exports.DATA_VERSION_5_6;
exports.DATA_VERSIONS = [
    exports.DATA_VERSION_2_3,
    exports.DATA_VERSION_3_0,
    exports.DATA_VERSION_4_0,
    exports.DATA_VERSION_4_5,
    exports.DATA_VERSION_5_0,
    exports.DATA_VERSION_5_5,
    exports.DATA_VERSION_5_6,
];
var OffsetOrder;
(function (OffsetOrder) {
    OffsetOrder[OffsetOrder["FrameInt"] = 0] = "FrameInt";
    OffsetOrder[OffsetOrder["FrameFloat"] = 1] = "FrameFloat";
    OffsetOrder[OffsetOrder["Frame"] = 2] = "Frame";
})(OffsetOrder = exports.OffsetOrder || (exports.OffsetOrder = {}));
var BinaryOffset;
(function (BinaryOffset) {
    BinaryOffset[BinaryOffset["WeigthBoneCount"] = 0] = "WeigthBoneCount";
    BinaryOffset[BinaryOffset["WeigthFloatOffset"] = 1] = "WeigthFloatOffset";
    BinaryOffset[BinaryOffset["WeigthBoneIndices"] = 2] = "WeigthBoneIndices";
    BinaryOffset[BinaryOffset["GeometryVertexCount"] = 0] = "GeometryVertexCount";
    BinaryOffset[BinaryOffset["GeometryTriangleCount"] = 1] = "GeometryTriangleCount";
    BinaryOffset[BinaryOffset["GeometryFloatOffset"] = 2] = "GeometryFloatOffset";
    BinaryOffset[BinaryOffset["GeometryWeightOffset"] = 3] = "GeometryWeightOffset";
    BinaryOffset[BinaryOffset["GeometryVertexIndices"] = 4] = "GeometryVertexIndices";
    BinaryOffset[BinaryOffset["TimelineScale"] = 0] = "TimelineScale";
    BinaryOffset[BinaryOffset["TimelineOffset"] = 1] = "TimelineOffset";
    BinaryOffset[BinaryOffset["TimelineKeyFrameCount"] = 2] = "TimelineKeyFrameCount";
    BinaryOffset[BinaryOffset["TimelineFrameValueCount"] = 3] = "TimelineFrameValueCount";
    BinaryOffset[BinaryOffset["TimelineFrameValueOffset"] = 4] = "TimelineFrameValueOffset";
    BinaryOffset[BinaryOffset["TimelineFrameOffset"] = 5] = "TimelineFrameOffset";
    BinaryOffset[BinaryOffset["FramePosition"] = 0] = "FramePosition";
    BinaryOffset[BinaryOffset["FrameTweenType"] = 1] = "FrameTweenType";
    BinaryOffset[BinaryOffset["FrameTweenEasingOrCurveSampleCount"] = 2] = "FrameTweenEasingOrCurveSampleCount";
    BinaryOffset[BinaryOffset["FrameCurveSamples"] = 3] = "FrameCurveSamples";
    BinaryOffset[BinaryOffset["ActionFrameActionCount"] = 1] = "ActionFrameActionCount";
    BinaryOffset[BinaryOffset["ActionFrameActionIndices"] = 2] = "ActionFrameActionIndices";
    BinaryOffset[BinaryOffset["DeformMeshOffset"] = 0] = "DeformMeshOffset";
    BinaryOffset[BinaryOffset["DeformCount"] = 1] = "DeformCount";
    BinaryOffset[BinaryOffset["DeformValueCount"] = 2] = "DeformValueCount";
    BinaryOffset[BinaryOffset["DeformValueOffset"] = 3] = "DeformValueOffset";
    BinaryOffset[BinaryOffset["DeformFloatOffset"] = 4] = "DeformFloatOffset";
})(BinaryOffset = exports.BinaryOffset || (exports.BinaryOffset = {}));
var ArmatureType;
(function (ArmatureType) {
    ArmatureType[ArmatureType["Armature"] = 0] = "Armature";
    ArmatureType[ArmatureType["MovieClip"] = 1] = "MovieClip";
    ArmatureType[ArmatureType["Stage"] = 2] = "Stage";
    ArmatureType[ArmatureType["ImageSequences"] = 3] = "ImageSequences";
})(ArmatureType = exports.ArmatureType || (exports.ArmatureType = {}));
var BoneType;
(function (BoneType) {
    BoneType[BoneType["Bone"] = 0] = "Bone";
    BoneType[BoneType["Surface"] = 1] = "Surface";
})(BoneType = exports.BoneType || (exports.BoneType = {}));
var DisplayType;
(function (DisplayType) {
    DisplayType[DisplayType["Image"] = 0] = "Image";
    DisplayType[DisplayType["Armature"] = 1] = "Armature";
    DisplayType[DisplayType["Mesh"] = 2] = "Mesh";
    DisplayType[DisplayType["BoundingBox"] = 3] = "BoundingBox";
    DisplayType[DisplayType["Path"] = 4] = "Path";
})(DisplayType = exports.DisplayType || (exports.DisplayType = {}));
var BoundingBoxType;
(function (BoundingBoxType) {
    BoundingBoxType[BoundingBoxType["Rectangle"] = 0] = "Rectangle";
    BoundingBoxType[BoundingBoxType["Ellipse"] = 1] = "Ellipse";
    BoundingBoxType[BoundingBoxType["Polygon"] = 2] = "Polygon";
})(BoundingBoxType = exports.BoundingBoxType || (exports.BoundingBoxType = {}));
var ActionType;
(function (ActionType) {
    ActionType[ActionType["Play"] = 0] = "Play";
    ActionType[ActionType["Frame"] = 10] = "Frame";
    ActionType[ActionType["Sound"] = 11] = "Sound";
})(ActionType = exports.ActionType || (exports.ActionType = {}));
var BlendMode;
(function (BlendMode) {
    BlendMode[BlendMode["Normal"] = 0] = "Normal";
    BlendMode[BlendMode["Add"] = 1] = "Add";
    BlendMode[BlendMode["Alpha"] = 2] = "Alpha";
    BlendMode[BlendMode["Darken"] = 3] = "Darken";
    BlendMode[BlendMode["Difference"] = 4] = "Difference";
    BlendMode[BlendMode["Erase"] = 5] = "Erase";
    BlendMode[BlendMode["HardLight"] = 6] = "HardLight";
    BlendMode[BlendMode["Invert"] = 7] = "Invert";
    BlendMode[BlendMode["Layer"] = 8] = "Layer";
    BlendMode[BlendMode["Lighten"] = 9] = "Lighten";
    BlendMode[BlendMode["Multiply"] = 10] = "Multiply";
    BlendMode[BlendMode["Overlay"] = 11] = "Overlay";
    BlendMode[BlendMode["Screen"] = 12] = "Screen";
    BlendMode[BlendMode["Subtract"] = 13] = "Subtract";
})(BlendMode = exports.BlendMode || (exports.BlendMode = {}));
var AnimationType;
(function (AnimationType) {
    AnimationType["Normal"] = "normal";
    AnimationType["Tree"] = "tree";
    AnimationType["Node"] = "node";
})(AnimationType = exports.AnimationType || (exports.AnimationType = {}));
var AnimationBlendType;
(function (AnimationBlendType) {
    AnimationBlendType["None"] = "none";
    AnimationBlendType["E1D"] = "1d";
})(AnimationBlendType = exports.AnimationBlendType || (exports.AnimationBlendType = {}));
var TimelineType;
(function (TimelineType) {
    TimelineType[TimelineType["Action"] = 0] = "Action";
    TimelineType[TimelineType["ZOrder"] = 1] = "ZOrder";
    TimelineType[TimelineType["BoneAll"] = 10] = "BoneAll";
    TimelineType[TimelineType["BoneTranslate"] = 11] = "BoneTranslate";
    TimelineType[TimelineType["BoneRotate"] = 12] = "BoneRotate";
    TimelineType[TimelineType["BoneScale"] = 13] = "BoneScale";
    TimelineType[TimelineType["Surface"] = 50] = "Surface";
    TimelineType[TimelineType["BoneAlpha"] = 60] = "BoneAlpha";
    TimelineType[TimelineType["SlotDisplay"] = 20] = "SlotDisplay";
    TimelineType[TimelineType["SlotColor"] = 21] = "SlotColor";
    TimelineType[TimelineType["SlotDeform"] = 22] = "SlotDeform";
    TimelineType[TimelineType["SlotZIndex"] = 23] = "SlotZIndex";
    TimelineType[TimelineType["SlotAlpha"] = 24] = "SlotAlpha";
    TimelineType[TimelineType["IKConstraint"] = 30] = "IKConstraint";
    TimelineType[TimelineType["AnimationProgress"] = 40] = "AnimationProgress";
    TimelineType[TimelineType["AnimationWeight"] = 41] = "AnimationWeight";
    TimelineType[TimelineType["AnimationParameter"] = 42] = "AnimationParameter";
})(TimelineType = exports.TimelineType || (exports.TimelineType = {}));
var TweenType;
(function (TweenType) {
    TweenType[TweenType["None"] = 0] = "None";
    TweenType[TweenType["Line"] = 1] = "Line";
    TweenType[TweenType["Curve"] = 2] = "Curve";
    TweenType[TweenType["QuadIn"] = 3] = "QuadIn";
    TweenType[TweenType["QuadOut"] = 4] = "QuadOut";
    TweenType[TweenType["QuadInOut"] = 5] = "QuadInOut";
})(TweenType = exports.TweenType || (exports.TweenType = {}));
function isDragonBonesString(string) {
    var testString = string.substr(0, Math.min(200, string.length));
    return testString.indexOf("armature") > 0 || testString.indexOf("textureAtlas") > 0;
}
exports.isDragonBonesString = isDragonBonesString;
function getCurvePoint(x1, y1, x2, y2, x3, y3, x4, y4, t, result) {
    var l_t = 1 - t;
    var powA = l_t * l_t;
    var powB = t * t;
    var kA = l_t * powA;
    var kB = 3.0 * t * powA;
    var kC = 3.0 * l_t * powB;
    var kD = t * powB;
    result.x = kA * x1 + kB * x2 + kC * x3 + kD * x4;
    result.y = kA * y1 + kB * y2 + kC * y3 + kD * y4;
}
exports.getCurvePoint = getCurvePoint;
function getCurveEasingValue(t, curve) {
    var curveCount = curve.length;
    if (curveCount % 3 === 1) {
        var stepIndex = -2;
        while ((stepIndex + 6 < curveCount ? curve[stepIndex + 6] : 1) < t) { // stepIndex + 3 * 2
            stepIndex += 6;
        }
        var isInCurve = stepIndex >= 0 && stepIndex + 6 < curveCount;
        var x1 = isInCurve ? curve[stepIndex] : 0.0;
        var y1 = isInCurve ? curve[stepIndex + 1] : 0.0;
        var x2 = curve[stepIndex + 2];
        var y2 = curve[stepIndex + 3];
        var x3 = curve[stepIndex + 4];
        var y3 = curve[stepIndex + 5];
        var x4 = isInCurve ? curve[stepIndex + 6] : 1.0;
        var y4 = isInCurve ? curve[stepIndex + 7] : 1.0;
        var lower = 0.0;
        var higher = 1.0;
        while (higher - lower > 0.01) {
            var percentage = (higher + lower) / 2.0;
            getCurvePoint(x1, y1, x2, y2, x3, y3, x4, y4, percentage, geom_1.helpPointA);
            if (t - geom_1.helpPointA.x > 0.0) {
                lower = percentage;
            }
            else {
                higher = percentage;
            }
        }
        return geom_1.helpPointA.y;
    }
    else {
        var stepIndex = 0;
        while (curve[stepIndex + 6] < t) { // stepIndex + 3 * 2
            stepIndex += 6;
        }
        var x1 = curve[stepIndex];
        var y1 = curve[stepIndex + 1];
        var x2 = curve[stepIndex + 2];
        var y2 = curve[stepIndex + 3];
        var x3 = curve[stepIndex + 4];
        var y3 = curve[stepIndex + 5];
        var x4 = curve[stepIndex + 6];
        var y4 = curve[stepIndex + 7];
        var lower = 0.0;
        var higher = 1.0;
        while (higher - lower > 0.01) {
            var percentage = (higher + lower) / 2.0;
            getCurvePoint(x1, y1, x2, y2, x3, y3, x4, y4, percentage, geom_1.helpPointA);
            if (t - geom_1.helpPointA.x > 0.0) {
                lower = percentage;
            }
            else {
                higher = percentage;
            }
        }
        return geom_1.helpPointA.y;
    }
}
exports.getCurveEasingValue = getCurveEasingValue;
function samplingEasingCurve(curve, samples, isOmited) {
    var curveCount = curve.length;
    if (isOmited) { // The beginning and end vertices are omitted. (0.0, 0.0, ..., 1.0, 1.0)
        var stepIndex = -2;
        for (var i = 0, l = samples.length; i < l; ++i) {
            var t = (i + 1) / (l + 1);
            while ((stepIndex + 6 < curveCount ? curve[stepIndex + 6] : 1) < t) { // stepIndex + 3 * 2
                stepIndex += 6;
            }
            var isInCurve = stepIndex >= 0 && stepIndex + 6 < curveCount;
            var x1 = isInCurve ? curve[stepIndex] : 0.0;
            var y1 = isInCurve ? curve[stepIndex + 1] : 0.0;
            var x2 = curve[stepIndex + 2];
            var y2 = curve[stepIndex + 3];
            var x3 = curve[stepIndex + 4];
            var y3 = curve[stepIndex + 5];
            var x4 = isInCurve ? curve[stepIndex + 6] : 1.0;
            var y4 = isInCurve ? curve[stepIndex + 7] : 1.0;
            var lower = 0.0;
            var higher = 1.0;
            while (higher - lower > 0.0001) {
                var percentage = (higher + lower) / 2.0;
                getCurvePoint(x1, y1, x2, y2, x3, y3, x4, y4, percentage, geom_1.helpPointA);
                if (t - geom_1.helpPointA.x > 0.0) {
                    lower = percentage;
                }
                else {
                    higher = percentage;
                }
            }
            samples[i] = geom_1.helpPointA.y;
        }
    }
    else { // Full vertices.
        var stepIndex = 0;
        for (var i = 0, l = samples.length; i < l; ++i) {
            if (i === 0) {
                samples[i] = curve[1];
                continue;
            }
            else if (i === l - 1) {
                samples[i] = curve[curveCount - 1];
                continue;
            }
            var t = i / (l - 1);
            while (curve[stepIndex + 6] < t) { // stepIndex + 3 * 2
                stepIndex += 6;
            }
            var x1 = curve[stepIndex];
            var y1 = curve[stepIndex + 1];
            var x2 = curve[stepIndex + 2];
            var y2 = curve[stepIndex + 3];
            var x3 = curve[stepIndex + 4];
            var y3 = curve[stepIndex + 5];
            var x4 = curve[stepIndex + 6];
            var y4 = curve[stepIndex + 7];
            var lower = 0.0;
            var higher = 1.0;
            while (higher - lower > 0.0001) {
                var percentage = (higher + lower) / 2.0;
                getCurvePoint(x1, y1, x2, y2, x3, y3, x4, y4, percentage, geom_1.helpPointA);
                if (t - geom_1.helpPointA.x > 0.0) {
                    lower = percentage;
                }
                else {
                    higher = percentage;
                }
            }
            samples[i] = geom_1.helpPointA.y;
        }
    }
}
exports.samplingEasingCurve = samplingEasingCurve;
function getEasingValue(tweenType, progress, easing) {
    var value = progress;
    switch (tweenType) {
        case TweenType.QuadIn:
            value = Math.pow(progress, 2.0);
            break;
        case TweenType.QuadOut:
            value = 1.0 - Math.pow(1.0 - progress, 2.0);
            break;
        case TweenType.QuadInOut:
            value = 0.5 * (1.0 - Math.cos(progress * Math.PI));
            break;
    }
    return (value - progress) * easing + progress;
}
exports.getEasingValue = getEasingValue;
function getEdgeFormTriangles(triangles) {
    var edges = [];
    var lines = {};
    var addLine = function (a, b) {
        if (a > b) {
            var c_1 = a;
            a = b;
            b = c_1;
        }
        var k = a + "_" + b;
        if (k in lines) {
            lines[k] = null;
        }
        else {
            lines[k] = [a, b];
        }
    };
    for (var i = 0, l = triangles.length; i < l; i += 3) {
        addLine(triangles[i + 0], triangles[i + 1]);
        addLine(triangles[i + 1], triangles[i + 2]);
        addLine(triangles[i + 2], triangles[i + 0]);
    }
    for (var k in lines) {
        var line = lines[k];
        if (line) {
            edges.push(line);
        }
    }
    edges.sort(function (a, b) {
        if (a[0] === b[0]) {
            return a[1] < b[1] ? -1 : 1;
        }
        return a[0] < b[0] ? -1 : 1;
    });
    var last = edges.splice(1, 1)[0];
    edges.push(last);
    var c = last[0];
    last[0] = last[1];
    last[1] = c;
    var result = new Array();
    for (var _i = 0, edges_1 = edges; _i < edges_1.length; _i++) {
        var line = edges_1[_i];
        result.push(line[0], line[1]);
    }
    return result;
}
exports.getEdgeFormTriangles = getEdgeFormTriangles;
function getFrameByPosition(frames, position) {
    var index = 0;
    var currentPosition = 0;
    for (var _i = 0, frames_1 = frames; _i < frames_1.length; _i++) {
        var frame = frames_1[_i];
        if (frame._position >= 0) {
            if (frame._position === position) {
                return frame;
            }
            else if (frame._position > position) {
                return frames[index - 1];
            }
        }
        else {
            if (currentPosition === position) {
                return frame;
            }
            else if (currentPosition > position) {
                return frames[index - 1];
            }
            currentPosition += frame.duration;
        }
        index++;
    }
    return frames[0];
}
exports.getFrameByPosition = getFrameByPosition;
function getTextureFormTextureAtlases(name, textureAtlases) {
    for (var _i = 0, textureAtlases_1 = textureAtlases; _i < textureAtlases_1.length; _i++) {
        var textureAtlas = textureAtlases_1[_i];
        var texture = textureAtlas.getTexture(name);
        if (texture) {
            return texture;
        }
    }
    return null;
}
exports.getTextureFormTextureAtlases = getTextureFormTextureAtlases;
function oldActionToNewAction(oldAction) {
    var newAction = new Action();
    newAction.type = ActionType.Play;
    newAction.name = oldAction.gotoAndPlay;
    return newAction;
}
exports.oldActionToNewAction = oldActionToNewAction;
function mergeActionToAnimation(animation, frame, framePosition, bone, slot, forRuntime) {
    var frames = animation.frame;
    var boneName = bone ? bone.name : "";
    var slotName = slot ? slot.name : "";
    if (frames.length === 0) {
        var beginFrame = new ActionFrame();
        beginFrame.duration = animation.duration;
        frames.push(beginFrame);
    }
    var position = 0;
    var frameIndex = 0;
    var insertFrame = null;
    var prevFrame = null;
    for (var i = 0, l = frames.length; i < l; ++i) {
        var eachFrame = frames[i];
        if (framePosition === position) {
            insertFrame = eachFrame;
            break;
        }
        else if (framePosition < position && prevFrame) {
            prevFrame.duration = framePosition - (position - prevFrame.duration);
            insertFrame = new ActionFrame();
            insertFrame.duration = position - framePosition;
            frames.splice(i + 1, 0, insertFrame);
            break;
        }
        position += eachFrame.duration;
        prevFrame = eachFrame;
        frameIndex++;
    }
    if (!insertFrame && prevFrame) {
        prevFrame.duration = framePosition;
        insertFrame = new ActionFrame();
        insertFrame.duration = position - framePosition;
        frames.splice(frameIndex, 0, insertFrame);
    }
    if (insertFrame) {
        if (frame instanceof dbftV23.AllFrame || frame instanceof BoneAllFrame) {
            if (frame.event) {
                var action = new Action();
                action.name = frame.event;
                action.bone = boneName;
                if (forRuntime) {
                    action.type = ActionType.Frame;
                    insertFrame.actions.push(action);
                }
                else {
                    insertFrame.events.push(action);
                }
            }
            if (frame.sound) {
                if (forRuntime) {
                    var action = new Action();
                    action.type = ActionType.Sound;
                    action.name = frame.sound;
                    action.bone = boneName;
                    insertFrame.actions.push(action);
                }
                else {
                    insertFrame.sound = frame.sound;
                }
            }
            if (frame.action) {
                if (forRuntime) {
                    var action = new Action();
                    action.type = ActionType.Play;
                    action.name = frame.action;
                    action.slot = slotName;
                    insertFrame.actions.push(action);
                }
            }
        }
        else if (forRuntime) {
            for (var _i = 0, _a = frame.actions; _i < _a.length; _i++) {
                var action = _a[_i];
                if (action instanceof OldAction) {
                    var newAction = new Action();
                    newAction.type = ActionType.Play;
                    newAction.name = action.gotoAndPlay;
                    newAction.slot = slotName;
                    insertFrame.actions.push(newAction);
                }
                else {
                    action.slot = slotName;
                    insertFrame.actions.push(action);
                }
            }
        }
    }
}
exports.mergeActionToAnimation = mergeActionToAnimation;
function modifyFramesByPosition(frames) {
    if (frames.length === 0) {
        return;
    }
    if (frames[0]._position !== 0) {
        var frame = new frames[0].constructor();
        frame.copy(frames[0]);
        frame._position = 0;
        if (frame instanceof TweenFrame) {
            frame.tweenEasing = 0.0;
        }
        frames.unshift(frame);
    }
    for (var i = 0, l = frames.length; i < l; ++i) {
        var frame = frames[i];
        if (i < l - 1) {
            frame.duration = frames[i + 1]._position - frame._position;
        }
    }
}
exports.modifyFramesByPosition = modifyFramesByPosition;
var BaseData = /** @class */ (function () {
    function BaseData() {
        this.extra = null;
    }
    BaseData.prototype.clearToBinary = function () { };
    return BaseData;
}());
exports.BaseData = BaseData;
var DragonBones = /** @class */ (function (_super_1) {
    __extends(DragonBones, _super_1);
    function DragonBones() {
        var _this = _super_1 !== null && _super_1.apply(this, arguments) || this;
        _this.frameRate = 0;
        _this.name = "";
        _this.stage = "";
        _this.version = "";
        _this.compatibleVersion = "";
        _this.armature = [];
        _this.offset = []; // Binary.
        _this.tag = []; // Binary.
        _this.textureAtlas = [];
        _this.userData = null;
        return _this;
    }
    return DragonBones;
}(BaseData));
exports.DragonBones = DragonBones;
var UserData = /** @class */ (function (_super_1) {
    __extends(UserData, _super_1);
    function UserData() {
        var _this = _super_1 !== null && _super_1.apply(this, arguments) || this;
        _this.ints = [];
        _this.floats = [];
        _this.strings = [];
        return _this;
    }
    return UserData;
}(BaseData));
exports.UserData = UserData;
var OldAction = /** @class */ (function (_super_1) {
    __extends(OldAction, _super_1);
    function OldAction() {
        var _this = _super_1 !== null && _super_1.apply(this, arguments) || this;
        _this.gotoAndPlay = "";
        return _this;
    }
    return OldAction;
}(BaseData));
exports.OldAction = OldAction;
var Action = /** @class */ (function (_super_1) {
    __extends(Action, _super_1);
    function Action() {
        var _this = _super_1 !== null && _super_1.apply(this, arguments) || this;
        _this.type = ActionType.Play;
        _this.name = "";
        _this.bone = "";
        _this.slot = "";
        return _this;
    }
    return Action;
}(UserData));
exports.Action = Action;
var Canvas = /** @class */ (function (_super_1) {
    __extends(Canvas, _super_1);
    function Canvas() {
        var _this = _super_1 !== null && _super_1.apply(this, arguments) || this;
        _this.hasBackground = false;
        _this.color = -1;
        _this.x = 0;
        _this.y = 0;
        _this.width = 0;
        _this.height = 0;
        return _this;
    }
    return Canvas;
}(BaseData));
exports.Canvas = Canvas;
var Armature = /** @class */ (function (_super_1) {
    __extends(Armature, _super_1);
    function Armature() {
        var _this = _super_1 !== null && _super_1.apply(this, arguments) || this;
        _this.type = ArmatureType[ArmatureType.Armature].toLowerCase();
        _this.frameRate = 0;
        _this.name = "";
        _this.aabb = new geom_1.Rectangle();
        _this.bone = [];
        _this.slot = [];
        _this.ik = [];
        _this.path = [];
        _this.skin = [];
        _this.animation = []; // Binary.
        _this.defaultActions = [];
        _this.actions = [];
        _this.canvas = null;
        _this.userData = null;
        return _this;
    }
    Armature.prototype.sortBones = function () {
        var total = this.bone.length;
        if (total <= 0) {
            return;
        }
        var sortHelper = this.bone.concat();
        var index = 0;
        var count = 0;
        this.bone.length = 0;
        while (count < total) {
            var bone = sortHelper[index++];
            if (index >= total) {
                index = 0;
            }
            if (this.bone.indexOf(bone) >= 0) {
                continue;
            }
            // TODO constraint.
            if (bone.parent) {
                var parent_1 = this.getBone(bone.parent);
                if (!parent_1 || this.bone.indexOf(parent_1) < 0) {
                    continue;
                }
            }
            this.bone.push(bone);
            count++;
        }
    };
    Armature.prototype.sortSlots = function () {
        this.slot.sort(function (a, b) { return a._zOrder > b._zOrder ? 1 : -1; });
    };
    Armature.prototype.getBone = function (name) {
        for (var _i = 0, _a = this.bone; _i < _a.length; _i++) {
            var bone = _a[_i];
            if (bone.name === name) {
                return bone;
            }
        }
        return null;
    };
    Armature.prototype.getSlot = function (name) {
        for (var _i = 0, _a = this.slot; _i < _a.length; _i++) {
            var slot = _a[_i];
            if (slot.name === name) {
                return slot;
            }
        }
        return null;
    };
    Armature.prototype.getSkin = function (name) {
        for (var _i = 0, _a = this.skin; _i < _a.length; _i++) {
            var skin = _a[_i];
            if (skin.name === name) {
                return skin;
            }
        }
        return null;
    };
    Armature.prototype.getDisplay = function (skinName, slotName, displayName) {
        var skin = this.getSkin(skinName);
        if (skin) {
            var slot = skin.getSlot(slotName);
            if (slot) {
                return slot.getDisplay(displayName);
            }
        }
        for (var _i = 0, _a = this.skin; _i < _a.length; _i++) {
            var skin_1 = _a[_i];
            var slot = skin_1.getSlot(slotName);
            if (slot) {
                return slot.getDisplay(displayName);
            }
            for (var _b = 0, _c = skin_1.slot; _b < _c.length; _b++) {
                var slot_1 = _c[_b];
                for (var _d = 0, _e = slot_1.display; _d < _e.length; _d++) {
                    var display = _e[_d];
                    if (display && display.name === displayName) {
                        return display;
                    }
                }
            }
        }
        return null;
    };
    Armature.prototype.getAnimation = function (animationName) {
        for (var _i = 0, _a = this.animation; _i < _a.length; _i++) {
            var animation = _a[_i];
            if (animation.name === animationName) {
                return animation;
            }
        }
        return null;
    };
    Armature.prototype.localToGlobal = function () {
        for (var _i = 0, _a = this.bone; _i < _a.length; _i++) {
            var bone = _a[_i];
            if (!bone._global) {
                bone._global = new geom_1.Transform();
            }
            bone._global.copyFrom(bone.transform);
            if (bone.parent) {
                var parent_2 = this.getBone(bone.parent);
                if (parent_2 && parent_2._global) {
                    parent_2._global.toMatrix(geom_1.helpMatrixA);
                    if (bone.inheritScale) {
                        if (!bone.inheritRotation) {
                            bone._global.skX -= parent_2._global.skY;
                            bone._global.skY -= parent_2._global.skY;
                        }
                        bone._global.toMatrix(geom_1.helpMatrixB);
                        geom_1.helpMatrixB.concat(geom_1.helpMatrixA);
                        bone._global.fromMatrix(geom_1.helpMatrixB);
                        if (!bone.inheritTranslation) {
                            bone._global.x = bone.transform.x;
                            bone._global.y = bone.transform.y;
                        }
                    }
                    else {
                        if (bone.inheritTranslation) {
                            geom_1.helpMatrixA.transformPoint(bone._global.x, bone._global.y, bone._global, true);
                        }
                        if (bone.inheritRotation) {
                            var dR = parent_2._global.skY;
                            if (parent_2._global.scX < 0.0) {
                                dR += Math.PI;
                            }
                            if (geom_1.helpMatrixA.a * geom_1.helpMatrixA.d - geom_1.helpMatrixA.b * geom_1.helpMatrixA.c < 0.0) {
                                dR -= bone._global.skY * 2.0;
                                if (bone.inheritReflection) {
                                    bone._global.skX += Math.PI;
                                }
                            }
                            bone._global.skX += dR;
                            bone._global.skY += dR;
                        }
                    }
                }
            }
        }
    };
    return Armature;
}(BaseData));
exports.Armature = Armature;
var Bone = /** @class */ (function (_super_1) {
    __extends(Bone, _super_1);
    function Bone() {
        var _this = _super_1 !== null && _super_1.apply(this, arguments) || this;
        _this.type = BoneType[BoneType.Bone].toLowerCase();
        _this.inheritTranslation = true;
        _this.inheritRotation = true;
        _this.inheritScale = true;
        _this.inheritReflection = true;
        _this.length = 0.0;
        _this.alpha = 1.0;
        _this.name = "";
        _this.parent = "";
        _this.transform = new geom_1.Transform();
        _this.userData = null;
        _this._global = null;
        return _this;
    }
    return Bone;
}(BaseData));
exports.Bone = Bone;
var Surface = /** @class */ (function (_super_1) {
    __extends(Surface, _super_1);
    function Surface(isDefault) {
        if (isDefault === void 0) { isDefault = false; }
        var _this = _super_1.call(this) || this;
        _this.type = BoneType[BoneType.Surface].toLowerCase();
        _this.offset = -1; // Binary.
        _this.segmentX = 0;
        _this.segmentY = 0;
        _this.vertices = [];
        _this.weights = []; //
        _this.bones = []; //
        if (isDefault) {
            _this.type = "";
        }
        return _this;
    }
    Surface.prototype.clearToBinary = function () {
        this.vertices.length = 0;
    };
    Object.defineProperty(Surface.prototype, "vertexCount", {
        get: function () {
            return (this.segmentX + 1) * (this.segmentY + 1);
        },
        enumerable: false,
        configurable: true
    });
    return Surface;
}(Bone));
exports.Surface = Surface;
var Slot = /** @class */ (function (_super_1) {
    __extends(Slot, _super_1);
    function Slot() {
        var _this = _super_1 !== null && _super_1.apply(this, arguments) || this;
        _this.blendMode = BlendMode[BlendMode.Normal].toLowerCase();
        _this.displayIndex = 0;
        _this.zIndex = 0;
        _this.alpha = 1.0;
        _this.name = "";
        _this.parent = "";
        _this.color = new geom_1.ColorTransform();
        _this.actions = []; // Deprecated.
        _this.userData = null;
        //
        _this._zOrder = -1;
        return _this;
    }
    return Slot;
}(BaseData));
exports.Slot = Slot;
var IKConstraint = /** @class */ (function (_super_1) {
    __extends(IKConstraint, _super_1);
    function IKConstraint() {
        var _this = _super_1 !== null && _super_1.apply(this, arguments) || this;
        _this.bendPositive = true;
        _this.chain = 0;
        _this.weight = 1.00;
        _this.name = "";
        _this.bone = "";
        _this.target = "";
        return _this;
    }
    return IKConstraint;
}(BaseData));
exports.IKConstraint = IKConstraint;
var PathConstraint = /** @class */ (function (_super_1) {
    __extends(PathConstraint, _super_1);
    function PathConstraint() {
        var _this = _super_1 !== null && _super_1.apply(this, arguments) || this;
        _this.name = "";
        _this.target = "";
        _this.bones = [];
        _this.positionMode = "percent";
        _this.spacingMode = "length";
        _this.rotateMode = "tangent";
        _this.position = 0;
        _this.spacing = 0;
        _this.rotateOffset = 0;
        _this.rotateMix = 0;
        _this.translateMix = 0;
        return _this;
    }
    return PathConstraint;
}(BaseData));
exports.PathConstraint = PathConstraint;
var Skin = /** @class */ (function (_super_1) {
    __extends(Skin, _super_1);
    function Skin() {
        var _this = _super_1 !== null && _super_1.apply(this, arguments) || this;
        _this.name = "default";
        _this.slot = [];
        _this.userData = null;
        return _this;
    }
    Skin.prototype.getSlot = function (name) {
        for (var _i = 0, _a = this.slot; _i < _a.length; _i++) {
            var slot = _a[_i];
            if (slot.name === name) {
                return slot;
            }
        }
        return null;
    };
    return Skin;
}(BaseData));
exports.Skin = Skin;
var SkinSlot = /** @class */ (function (_super_1) {
    __extends(SkinSlot, _super_1);
    function SkinSlot() {
        var _this = _super_1 !== null && _super_1.apply(this, arguments) || this;
        _this.name = "";
        _this.display = [];
        _this.actions = []; // Deprecated.
        return _this;
    }
    SkinSlot.prototype.getDisplay = function (name) {
        for (var _i = 0, _a = this.display; _i < _a.length; _i++) {
            var display = _a[_i];
            if (display && display.name === name) {
                return display;
            }
        }
        return null;
    };
    return SkinSlot;
}(BaseData));
exports.SkinSlot = SkinSlot;
var Display = /** @class */ (function (_super_1) {
    __extends(Display, _super_1);
    function Display() {
        var _this = _super_1 !== null && _super_1.apply(this, arguments) || this;
        _this.type = DisplayType[DisplayType.Image].toLowerCase();
        _this.name = "";
        _this.transform = new geom_1.Transform();
        return _this;
    }
    return Display;
}(BaseData));
exports.Display = Display;
var BoundingBoxDisplay = /** @class */ (function (_super_1) {
    __extends(BoundingBoxDisplay, _super_1);
    function BoundingBoxDisplay() {
        var _this = _super_1 !== null && _super_1.apply(this, arguments) || this;
        _this.subType = BoundingBoxType[BoundingBoxType.Rectangle].toLowerCase();
        _this.color = 0x000000;
        return _this;
    }
    return BoundingBoxDisplay;
}(Display));
exports.BoundingBoxDisplay = BoundingBoxDisplay;
var ImageDisplay = /** @class */ (function (_super_1) {
    __extends(ImageDisplay, _super_1);
    function ImageDisplay(isDefault) {
        if (isDefault === void 0) { isDefault = false; }
        var _this = _super_1.call(this) || this;
        _this.path = "";
        _this.pivot = new geom_1.Point(0.5, 0.5);
        if (!isDefault) {
            _this.type = DisplayType[DisplayType.Image].toLowerCase();
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
        _this.inheritAnimation = true;
        _this.path = "";
        _this.actions = [];
        if (!isDefault) {
            _this.type = DisplayType[DisplayType.Armature].toLowerCase();
        }
        return _this;
    }
    return ArmatureDisplay;
}(Display));
exports.ArmatureDisplay = ArmatureDisplay;
var MeshDisplay = /** @class */ (function (_super_1) {
    __extends(MeshDisplay, _super_1);
    function MeshDisplay(isDefault) {
        if (isDefault === void 0) { isDefault = false; }
        var _this = _super_1.call(this) || this;
        _this.offset = -1; // Binary.
        _this.width = 0;
        _this.height = 0;
        _this.path = "";
        _this.vertices = [];
        _this.uvs = [];
        _this.triangles = [];
        _this.weights = [];
        _this.slotPose = [];
        _this.bonePose = [];
        _this.glueWeights = [];
        _this.glueMeshes = [];
        _this.edges = []; // Nonessential.
        _this.userEdges = []; // Nonessential.
        _this._userEdges = true; // TODO
        _this._boneCount = 0;
        _this._weightCount = 0;
        _this._matrix = new geom_1.Matrix();
        if (!isDefault) {
            _this.type = DisplayType[DisplayType.Mesh].toLowerCase();
        }
        return _this;
    }
    MeshDisplay.prototype.clearToBinary = function () {
        this.width = 0;
        this.height = 0;
        this.vertices.length = 0;
        this.uvs.length = 0;
        this.triangles.length = 0;
        this.weights.length = 0;
        this.slotPose.length = 0;
        this.bonePose.length = 0;
        this.edges.length = 0;
        this.userEdges.length = 0;
    };
    MeshDisplay.prototype.getBonePoseOffset = function (boneIndex) {
        for (var i = 0, l = this.bonePose.length; i < l; i += 7) {
            if (boneIndex === this.bonePose[i]) {
                return i;
            }
        }
        throw new Error();
    };
    return MeshDisplay;
}(Display));
exports.MeshDisplay = MeshDisplay;
var SharedMeshDisplay = /** @class */ (function (_super_1) {
    __extends(SharedMeshDisplay, _super_1);
    function SharedMeshDisplay(isDefault) {
        if (isDefault === void 0) { isDefault = false; }
        var _this = _super_1.call(this) || this;
        _this.inheritDeform = true;
        _this.path = "";
        _this.share = "";
        _this.skin = "default";
        if (!isDefault) {
            _this.type = DisplayType[DisplayType.Mesh].toLowerCase();
        }
        return _this;
    }
    return SharedMeshDisplay;
}(Display));
exports.SharedMeshDisplay = SharedMeshDisplay;
var PathDisplay = /** @class */ (function (_super_1) {
    __extends(PathDisplay, _super_1);
    function PathDisplay(isDefault) {
        if (isDefault === void 0) { isDefault = false; }
        var _this = _super_1.call(this) || this;
        _this.offset = -1; // Binary.
        _this.closed = false;
        _this.constantSpeed = false;
        _this.vertexCount = 0;
        _this.vertices = [];
        _this.lengths = [];
        _this.weights = [];
        _this.bones = [];
        if (!isDefault) {
            _this.type = DisplayType[DisplayType.Path].toLowerCase();
        }
        return _this;
    }
    PathDisplay.prototype.clearToBinary = function () {
        this.vertexCount = 0;
        this.vertices.length = 0;
        this.weights.length = 0;
        this.bones.length = 0;
    };
    return PathDisplay;
}(Display));
exports.PathDisplay = PathDisplay;
var RectangleBoundingBoxDisplay = /** @class */ (function (_super_1) {
    __extends(RectangleBoundingBoxDisplay, _super_1);
    function RectangleBoundingBoxDisplay(isDefault) {
        if (isDefault === void 0) { isDefault = false; }
        var _this = _super_1.call(this) || this;
        _this.width = 0.00;
        _this.height = 0.00;
        if (!isDefault) {
            _this.type = DisplayType[DisplayType.BoundingBox].toLowerCase();
            _this.subType = BoundingBoxType[BoundingBoxType.Rectangle].toLowerCase();
        }
        return _this;
    }
    return RectangleBoundingBoxDisplay;
}(BoundingBoxDisplay));
exports.RectangleBoundingBoxDisplay = RectangleBoundingBoxDisplay;
var EllipseBoundingBoxDisplay = /** @class */ (function (_super_1) {
    __extends(EllipseBoundingBoxDisplay, _super_1);
    function EllipseBoundingBoxDisplay(isDefault) {
        if (isDefault === void 0) { isDefault = false; }
        var _this = _super_1.call(this) || this;
        _this.width = 0.00;
        _this.height = 0.00;
        if (!isDefault) {
            _this.type = DisplayType[DisplayType.BoundingBox].toLowerCase();
            _this.subType = BoundingBoxType[BoundingBoxType.Ellipse].toLowerCase();
        }
        return _this;
    }
    return EllipseBoundingBoxDisplay;
}(BoundingBoxDisplay));
exports.EllipseBoundingBoxDisplay = EllipseBoundingBoxDisplay;
var PolygonBoundingBoxDisplay = /** @class */ (function (_super_1) {
    __extends(PolygonBoundingBoxDisplay, _super_1);
    function PolygonBoundingBoxDisplay(isDefault) {
        if (isDefault === void 0) { isDefault = false; }
        var _this = _super_1.call(this) || this;
        _this.offset = -1; // Binary.
        _this.vertexCount = 0;
        _this.vertices = [];
        _this.weights = [];
        _this.bones = [];
        if (!isDefault) {
            _this.type = DisplayType[DisplayType.BoundingBox].toLowerCase();
            _this.subType = BoundingBoxType[BoundingBoxType.Polygon].toLowerCase();
        }
        return _this;
    }
    PolygonBoundingBoxDisplay.prototype.clearToBinary = function () {
        this.vertexCount = 0;
        // this.vertices.length = 0;
        this.weights.length = 0;
        this.bones.length = 0;
    };
    return PolygonBoundingBoxDisplay;
}(BoundingBoxDisplay));
exports.PolygonBoundingBoxDisplay = PolygonBoundingBoxDisplay;
var Animation = /** @class */ (function (_super_1) {
    __extends(Animation, _super_1);
    function Animation() {
        var _this = _super_1 !== null && _super_1.apply(this, arguments) || this;
        _this.type = AnimationType.Normal;
        _this.blendType = AnimationBlendType.None;
        _this.duration = 1;
        _this.playTimes = 1;
        _this.scale = 1.0;
        _this.fadeInTime = 0.0;
        _this.name = "default";
        _this.frame = []; // Deprecated.
        _this.bone = []; // Deprecated.
        _this.slot = []; // Deprecated.
        _this.ffd = []; // Deprecated.
        _this.ik = []; // Deprecated.
        _this.timeline = [];
        _this.zOrder = null;
        return _this;
    }
    // Deprecated.
    Animation.prototype.getSlotTimeline = function (name) {
        for (var _i = 0, _a = this.slot; _i < _a.length; _i++) {
            var timeline = _a[_i];
            if (timeline.name === name) {
                return timeline;
            }
        }
        return null;
    };
    // Deprecated.
    Animation.prototype.getBoneTimeline = function (name) {
        for (var _i = 0, _a = this.bone; _i < _a.length; _i++) {
            var timeline = _a[_i];
            if (timeline.name === name) {
                return timeline;
            }
        }
        return null;
    };
    Animation.prototype.getAnimationTimeline = function (name, type) {
        for (var _i = 0, _a = this.timeline; _i < _a.length; _i++) {
            var timeline = _a[_i];
            if (timeline.type === type && timeline.name === name) {
                return timeline;
            }
        }
        return null;
    };
    return Animation;
}(BaseData));
exports.Animation = Animation;
var AnimationBinary = /** @class */ (function (_super_1) {
    __extends(AnimationBinary, _super_1);
    function AnimationBinary() {
        var _this = _super_1 !== null && _super_1.apply(this, arguments) || this;
        _this.type = AnimationType.Normal;
        _this.blendType = AnimationBlendType.None;
        _this.duration = 0;
        _this.playTimes = 1;
        _this.scale = 1.0;
        _this.fadeInTime = 0.0;
        _this.name = "";
        _this.action = -1; // Deprecated.
        _this.zOrder = -1; // Deprecated.
        _this.offset = [];
        _this.bone = {}; // Deprecated.
        _this.surface = {}; // Deprecated.
        _this.slot = {}; // Deprecated.
        _this.constraint = {}; // Deprecated.
        _this.timeline = [];
        return _this;
    }
    return AnimationBinary;
}(BaseData));
exports.AnimationBinary = AnimationBinary;
var Timeline = /** @class */ (function (_super_1) {
    __extends(Timeline, _super_1);
    function Timeline() {
        var _this = _super_1 !== null && _super_1.apply(this, arguments) || this;
        _this.scale = 1.0;
        _this.offset = 0.0;
        _this.name = "";
        return _this;
    }
    return Timeline;
}(BaseData));
exports.Timeline = Timeline;
var TypeTimeline = /** @class */ (function (_super_1) {
    __extends(TypeTimeline, _super_1);
    function TypeTimeline() {
        var _this = _super_1 !== null && _super_1.apply(this, arguments) || this;
        _this.type = TimelineType.Action;
        _this.frame = [];
        return _this;
    }
    TypeTimeline.prototype.clearToBinary = function () {
        this.scale = 1.0;
        this.frame.length = 0;
    };
    return TypeTimeline;
}(Timeline));
exports.TypeTimeline = TypeTimeline;
/**
 * @deprecated
 */
var BoneTimeline = /** @class */ (function (_super_1) {
    __extends(BoneTimeline, _super_1);
    function BoneTimeline() {
        var _this = _super_1 !== null && _super_1.apply(this, arguments) || this;
        _this.frame = []; // Deprecated.
        _this.translateFrame = [];
        _this.rotateFrame = [];
        _this.scaleFrame = [];
        return _this;
    }
    BoneTimeline.prototype.insertFrame = function (frames, position) {
        var index = 0;
        var fromPosition = 0;
        var progress = 0.0;
        var from = null;
        var insert;
        var to = null;
        for (var _i = 0, frames_2 = frames; _i < frames_2.length; _i++) {
            var frame = frames_2[_i];
            if (fromPosition === position) {
                return index;
            }
            else if (fromPosition < position && position <= fromPosition + frame.duration) {
                if (index === frames.length - 1) {
                }
                else if (position === fromPosition + frame.duration) {
                    return index + 1;
                }
                else {
                    to = frames[index + 1];
                }
                progress = (position - fromPosition) / frame.duration;
                from = frame;
                index++;
                break;
            }
            index++;
            fromPosition += frame.duration;
        }
        if (frames === this.frame) {
            if (!from) {
                from = new BoneAllFrame();
                frames.push(from);
            }
            insert = new BoneAllFrame();
        }
        else if (frames === this.translateFrame) {
            if (!from) {
                from = new DoubleValueFrame0();
                frames.push(from);
            }
            insert = new DoubleValueFrame0();
        }
        else if (frames === this.rotateFrame) {
            if (!from) {
                from = new BoneRotateFrame();
                frames.push(from);
            }
            insert = new BoneRotateFrame();
        }
        else if (frames === this.scaleFrame) {
            if (!from) {
                from = new DoubleValueFrame1();
                frames.push(from);
            }
            insert = new DoubleValueFrame1();
        }
        else {
            return -1;
        }
        insert.duration = from.duration - (position - fromPosition);
        from.duration -= insert.duration;
        frames.splice(index, 0, insert);
        if (from instanceof TweenFrame && insert instanceof TweenFrame) {
            // TODO
            insert.tweenEasing = from.tweenEasing;
            //to.curve; 
            progress = from.getTweenProgress(progress);
        }
        if (from instanceof BoneAllFrame && insert instanceof BoneAllFrame) {
            if (to instanceof BoneAllFrame) {
                insert.transform.x = from.transform.x + (to.transform.x - from.transform.x) * progress;
                insert.transform.y = from.transform.y + (to.transform.y - from.transform.y) * progress;
                insert.transform.scX = from.transform.scX + (to.transform.scX - from.transform.scX) * progress;
                insert.transform.scY = from.transform.scY + (to.transform.scY - from.transform.scY) * progress;
                if (from.tweenRotate === 0) {
                    insert.tweenRotate = 0;
                    insert.transform.skX = from.transform.skX + geom_1.normalizeDegree(to.transform.skX - from.transform.skX) * progress;
                    insert.transform.skY = from.transform.skY + geom_1.normalizeDegree(to.transform.skY - from.transform.skY) * progress;
                }
                else {
                    var tweenRotate = from.tweenRotate;
                    if (tweenRotate > 0 && tweenRotate < 2) {
                        insert.tweenRotate = 1;
                    }
                    else if (tweenRotate < 0 && tweenRotate > -2) {
                        insert.tweenRotate = -1;
                    }
                    else {
                        insert.tweenRotate = Math.floor(tweenRotate * progress);
                    }
                    if (tweenRotate > 0 ? to.transform.skY >= from.transform.skY : to.transform.skY <= from.transform.skY) {
                        tweenRotate = tweenRotate > 0 ? tweenRotate - 1 : tweenRotate + 1;
                    }
                    insert.transform.skX = from.transform.skX + geom_1.normalizeDegree(to.transform.skX - from.transform.skX + 360.0 * tweenRotate) * progress;
                    insert.transform.skY = from.transform.skY + geom_1.normalizeDegree(to.transform.skY - from.transform.skY + 360.0 * tweenRotate) * progress;
                }
            }
            else {
                insert.transform.copyFrom(from.transform);
            }
        }
        else if (from instanceof DoubleValueFrame0 && insert instanceof DoubleValueFrame0) {
            if (to instanceof DoubleValueFrame0) {
                insert.x = from.x + (to.x - from.x) * progress;
                insert.y = from.y + (to.y - from.y) * progress;
            }
            else {
                insert.x = from.x;
                insert.y = from.y;
            }
        }
        else if (from instanceof BoneRotateFrame && insert instanceof BoneRotateFrame && to instanceof BoneRotateFrame) {
            if (to instanceof BoneRotateFrame) {
                if (from.clockwise === 0) {
                    insert.clockwise = 0;
                    insert.rotate = from.rotate + geom_1.normalizeDegree(to.rotate - from.rotate) * progress;
                }
                else {
                    var clockwise = from.clockwise;
                    if (clockwise > 0 && clockwise < 2) {
                        insert.clockwise = 1;
                    }
                    else if (clockwise < 0 && clockwise > -2) {
                        insert.clockwise = -1;
                    }
                    else {
                        insert.clockwise = Math.floor(clockwise * progress);
                    }
                    if (clockwise > 0 ? to.rotate >= from.rotate : to.rotate <= from.rotate) {
                        clockwise = clockwise > 0 ? clockwise - 1 : clockwise + 1;
                    }
                    insert.rotate = from.rotate + (to.rotate - from.rotate + 360.0 * clockwise) * progress;
                }
                insert.skew = from.skew + (to.skew - from.skew) * progress;
            }
            else {
                insert.rotate = from.rotate;
                insert.skew = from.skew;
            }
        }
        else if (from instanceof DoubleValueFrame1 && insert instanceof DoubleValueFrame1) {
            if (to instanceof DoubleValueFrame1) {
                insert.x = from.x + (to.x - from.x) * progress;
                insert.y = from.y + (to.y - from.y) * progress;
            }
            else {
                insert.x = from.x;
                insert.y = from.y;
            }
        }
        else {
            return -1;
        }
        return index;
    };
    return BoneTimeline;
}(Timeline));
exports.BoneTimeline = BoneTimeline;
/**
 * @deprecated
 */
var SlotTimeline = /** @class */ (function (_super_1) {
    __extends(SlotTimeline, _super_1);
    function SlotTimeline() {
        var _this = _super_1 !== null && _super_1.apply(this, arguments) || this;
        _this.frame = []; // Deprecated.
        _this.displayFrame = [];
        _this.colorFrame = [];
        return _this;
    }
    SlotTimeline.prototype.insertFrame = function (frames, position) {
        var index = 0;
        var fromPosition = 0;
        var progress = 0.0;
        var from = null;
        var insert;
        var to = null;
        for (var _i = 0, frames_3 = frames; _i < frames_3.length; _i++) {
            var frame = frames_3[_i];
            if (fromPosition === position) {
                return index;
            }
            else if (fromPosition < position && position <= fromPosition + frame.duration) {
                if (index === frames.length - 1) {
                }
                else if (position === fromPosition + frame.duration) {
                    return index + 1;
                }
                else {
                    to = frames[index + 1];
                }
                progress = (position - fromPosition) / frame.duration;
                from = frame;
                index++;
                break;
            }
            index++;
            fromPosition += frame.duration;
        }
        if (frames === this.frame) {
            if (!from) {
                from = new SlotAllFrame();
                frames.push(from);
            }
            insert = new SlotAllFrame();
        }
        else if (frames === this.displayFrame) {
            if (!from) {
                from = new SlotDisplayFrame();
                frames.push(from);
            }
            insert = new SlotDisplayFrame();
        }
        else if (frames === this.colorFrame) {
            if (!from) {
                from = new SlotColorFrame();
                frames.push(from);
            }
            insert = new SlotColorFrame();
        }
        else {
            return -1;
        }
        insert.duration = from.duration - (position - fromPosition);
        from.duration -= insert.duration;
        frames.splice(index, 0, insert);
        if (from instanceof TweenFrame && insert instanceof TweenFrame) {
            // TODO
            insert.tweenEasing = from.tweenEasing;
            //insert.curve; 
            progress = from.getTweenProgress(progress);
        }
        if (from instanceof SlotAllFrame && insert instanceof SlotAllFrame) {
            insert.displayIndex = from.displayIndex;
            if (to instanceof SlotAllFrame) {
                insert.color.aM = from.color.aM + (to.color.aM - from.color.aM) * progress;
                insert.color.rM = from.color.rM + (to.color.rM - from.color.rM) * progress;
                insert.color.gM = from.color.gM + (to.color.gM - from.color.gM) * progress;
                insert.color.bM = from.color.bM + (to.color.bM - from.color.bM) * progress;
                insert.color.aO = from.color.aO + (to.color.aO - from.color.aO) * progress;
                insert.color.rO = from.color.rO + (to.color.rO - from.color.rO) * progress;
                insert.color.gO = from.color.gO + (to.color.gO - from.color.gO) * progress;
                insert.color.bO = from.color.bO + (to.color.bO - from.color.bO) * progress;
            }
            else {
                insert.color.copyFrom(insert.color);
            }
        }
        else if (from instanceof SlotDisplayFrame && insert instanceof SlotDisplayFrame) {
            insert.value = from.value;
        }
        else if (from instanceof SlotColorFrame && insert instanceof SlotColorFrame) {
            if (to instanceof SlotColorFrame) {
                insert.value.aM = from.value.aM + (to.value.aM - from.value.aM) * progress;
                insert.value.rM = from.value.rM + (to.value.rM - from.value.rM) * progress;
                insert.value.gM = from.value.gM + (to.value.gM - from.value.gM) * progress;
                insert.value.bM = from.value.bM + (to.value.bM - from.value.bM) * progress;
                insert.value.aO = from.value.aO + (to.value.aO - from.value.aO) * progress;
                insert.value.rO = from.value.rO + (to.value.rO - from.value.rO) * progress;
                insert.value.gO = from.value.gO + (to.value.gO - from.value.gO) * progress;
                insert.value.bO = from.value.bO + (to.value.bO - from.value.bO) * progress;
            }
            else {
                insert.value.copyFrom(insert.value);
            }
        }
        else {
            return -1;
        }
        return index;
    };
    return SlotTimeline;
}(Timeline));
exports.SlotTimeline = SlotTimeline;
/**
 * @deprecated
 */
var ZOrderTimeline = /** @class */ (function (_super_1) {
    __extends(ZOrderTimeline, _super_1);
    function ZOrderTimeline() {
        return _super_1 !== null && _super_1.apply(this, arguments) || this;
    }
    return ZOrderTimeline;
}(TypeTimeline));
exports.ZOrderTimeline = ZOrderTimeline;
/**
 * @deprecated
 */
var IKConstraintTimeline = /** @class */ (function (_super_1) {
    __extends(IKConstraintTimeline, _super_1);
    function IKConstraintTimeline() {
        return _super_1 !== null && _super_1.apply(this, arguments) || this;
    }
    return IKConstraintTimeline;
}(TypeTimeline));
exports.IKConstraintTimeline = IKConstraintTimeline;
/**
 * @deprecated
 */
var SlotDeformTimeline = /** @class */ (function (_super_1) {
    __extends(SlotDeformTimeline, _super_1);
    function SlotDeformTimeline() {
        var _this = _super_1 !== null && _super_1.apply(this, arguments) || this;
        _this.skin = "default"; // Deprecated.
        _this.slot = ""; // Deprecated.
        return _this;
    }
    return SlotDeformTimeline;
}(TypeTimeline));
exports.SlotDeformTimeline = SlotDeformTimeline;
var AnimationTimeline = /** @class */ (function (_super_1) {
    __extends(AnimationTimeline, _super_1);
    function AnimationTimeline() {
        var _this = _super_1 !== null && _super_1.apply(this, arguments) || this;
        _this.x = 0.0;
        _this.y = 0.0;
        return _this;
    }
    return AnimationTimeline;
}(TypeTimeline));
exports.AnimationTimeline = AnimationTimeline;
var Frame = /** @class */ (function (_super_1) {
    __extends(Frame, _super_1);
    function Frame() {
        var _this = _super_1 !== null && _super_1.apply(this, arguments) || this;
        _this.duration = 1;
        _this._position = -1;
        return _this;
    }
    return Frame;
}(BaseData));
exports.Frame = Frame;
var TweenFrame = /** @class */ (function (_super_1) {
    __extends(TweenFrame, _super_1);
    function TweenFrame() {
        var _this = _super_1 !== null && _super_1.apply(this, arguments) || this;
        _this.tweenEasing = NaN;
        _this.curve = [];
        return _this;
    }
    TweenFrame.prototype.getTweenEnabled = function () {
        return this.curve.length > 0 || !isNaN(this.tweenEasing);
    };
    TweenFrame.prototype.removeTween = function () {
        this.tweenEasing = NaN;
        this.curve.length = 0;
    };
    TweenFrame.prototype.getTweenProgress = function (value) {
        if (this.getTweenEnabled()) {
            if (this.curve.length > 0) {
                return getCurveEasingValue(value, this.curve);
            }
            else {
                if (this.tweenEasing === 0.0) {
                }
                else if (this.tweenEasing <= 0.0) {
                    return getEasingValue(TweenType.QuadOut, value, this.tweenEasing);
                }
                else if (this.tweenEasing <= 1.0) {
                    return getEasingValue(TweenType.QuadIn, value, this.tweenEasing);
                }
                else if (this.tweenEasing <= 2.0) {
                    return getEasingValue(TweenType.QuadInOut, value, this.tweenEasing);
                }
                return value;
            }
        }
        return 0.0;
    };
    return TweenFrame;
}(Frame));
exports.TweenFrame = TweenFrame;
var SingleValueFrame0 = /** @class */ (function (_super_1) {
    __extends(SingleValueFrame0, _super_1);
    function SingleValueFrame0() {
        var _this = _super_1 !== null && _super_1.apply(this, arguments) || this;
        _this.value = 0.0;
        return _this;
    }
    SingleValueFrame0.prototype.equal = function (value) {
        return this.value === value.value;
    };
    SingleValueFrame0.prototype.copy = function (value) {
        this.value = value.value;
    };
    return SingleValueFrame0;
}(TweenFrame));
exports.SingleValueFrame0 = SingleValueFrame0;
var SingleValueFrame1 = /** @class */ (function (_super_1) {
    __extends(SingleValueFrame1, _super_1);
    function SingleValueFrame1() {
        var _this = _super_1 !== null && _super_1.apply(this, arguments) || this;
        _this.value = 1.0;
        return _this;
    }
    SingleValueFrame1.prototype.equal = function (value) {
        return this.value === value.value;
    };
    SingleValueFrame1.prototype.copy = function (value) {
        this.value = value.value;
    };
    return SingleValueFrame1;
}(TweenFrame));
exports.SingleValueFrame1 = SingleValueFrame1;
var DoubleValueFrame0 = /** @class */ (function (_super_1) {
    __extends(DoubleValueFrame0, _super_1);
    function DoubleValueFrame0() {
        var _this = _super_1 !== null && _super_1.apply(this, arguments) || this;
        _this.x = 0.0;
        _this.y = 0.0;
        return _this;
    }
    DoubleValueFrame0.prototype.equal = function (value) {
        return this.x === value.x && this.y === value.y;
    };
    DoubleValueFrame0.prototype.copy = function (value) {
        this.x = value.x;
        this.y = value.y;
    };
    return DoubleValueFrame0;
}(TweenFrame));
exports.DoubleValueFrame0 = DoubleValueFrame0;
var DoubleValueFrame1 = /** @class */ (function (_super_1) {
    __extends(DoubleValueFrame1, _super_1);
    function DoubleValueFrame1() {
        var _this = _super_1 !== null && _super_1.apply(this, arguments) || this;
        _this.x = 1.0;
        _this.y = 1.0;
        return _this;
    }
    DoubleValueFrame1.prototype.equal = function (value) {
        return this.x === value.x && this.y === value.y;
    };
    DoubleValueFrame1.prototype.copy = function (value) {
        this.x = value.x;
        this.y = value.y;
    };
    return DoubleValueFrame1;
}(TweenFrame));
exports.DoubleValueFrame1 = DoubleValueFrame1;
var MutilpleValueFrame = /** @class */ (function (_super_1) {
    __extends(MutilpleValueFrame, _super_1);
    function MutilpleValueFrame() {
        var _this = _super_1 !== null && _super_1.apply(this, arguments) || this;
        _this.offset = 0;
        _this.value = [];
        _this.vertices = []; // Deprecated.
        _this.zOrder = []; // Deprecated.
        return _this;
    }
    MutilpleValueFrame.prototype.equal = function (value) {
        if (this.offset === value.offset) {
            if (this.zOrder.length > 0) {
                if (this.zOrder.length === value.zOrder.length) {
                    for (var i = 0, l = this.value.length; i < l; ++i) {
                        if (this.value[i] !== value.value[i]) {
                            return false;
                        }
                    }
                    return true;
                }
            }
            else if (this.vertices.length > 0) {
                if (this.vertices.length === value.vertices.length) {
                    for (var i = 0, l = this.vertices.length; i < l; ++i) {
                        if (this.vertices[i] !== value.vertices[i]) {
                            return false;
                        }
                    }
                    return true;
                }
            }
            else if (this.value.length === value.value.length) {
                for (var i = 0, l = this.value.length; i < l; ++i) {
                    if (this.value[i] !== value.value[i]) {
                        return false;
                    }
                }
                return true;
            }
        }
        return false;
    };
    MutilpleValueFrame.prototype.copy = function (value) {
        this.offset = value.offset;
        this.value.length = 0;
        this.zOrder.length = 0;
        this.vertices.length = 0;
        for (var _i = 0, _a = value.value; _i < _a.length; _i++) {
            var v = _a[_i];
            this.value.push(v);
        }
        for (var _b = 0, _c = value.zOrder; _b < _c.length; _b++) {
            var v = _c[_b];
            this.zOrder.push(v);
        }
        for (var _d = 0, _e = value.vertices; _d < _e.length; _d++) {
            var v = _e[_d];
            this.vertices.push(v);
        }
    };
    return MutilpleValueFrame;
}(TweenFrame));
exports.MutilpleValueFrame = MutilpleValueFrame;
/**
 * @deprecated
 */
var ActionFrame = /** @class */ (function (_super_1) {
    __extends(ActionFrame, _super_1);
    function ActionFrame() {
        var _this = _super_1 !== null && _super_1.apply(this, arguments) || this;
        _this.action = ""; // Deprecated.
        _this.event = ""; // Deprecated.
        _this.sound = ""; // Deprecated.
        _this.events = []; // Deprecated.
        _this.actions = [];
        return _this;
    }
    ActionFrame.prototype.equal = function (value) {
        return !value;
    };
    ActionFrame.prototype.copy = function (_value) {
    };
    return ActionFrame;
}(Frame));
exports.ActionFrame = ActionFrame;
/**
 * @deprecated
 */
var BoneAllFrame = /** @class */ (function (_super_1) {
    __extends(BoneAllFrame, _super_1);
    function BoneAllFrame() {
        var _this = _super_1 !== null && _super_1.apply(this, arguments) || this;
        _this.tweenRotate = 0;
        _this.action = "";
        _this.event = "";
        _this.sound = "";
        _this.transform = new geom_1.Transform();
        return _this;
    }
    BoneAllFrame.prototype.equal = function (value) {
        return this.tweenRotate === 0 && !this.action && !this.event && !this.sound && this.transform.equal(value.transform);
    };
    BoneAllFrame.prototype.copy = function (value) {
        this.transform.copyFrom(value.transform);
    };
    return BoneAllFrame;
}(TweenFrame));
exports.BoneAllFrame = BoneAllFrame;
/**
 * @deprecated
 */
var BoneRotateFrame = /** @class */ (function (_super_1) {
    __extends(BoneRotateFrame, _super_1);
    function BoneRotateFrame() {
        var _this = _super_1 !== null && _super_1.apply(this, arguments) || this;
        _this.clockwise = 0;
        _this.rotate = 0.0;
        _this.skew = 0.0;
        return _this;
    }
    BoneRotateFrame.prototype.equal = function (value) {
        return this.clockwise === 0 && this.rotate === value.rotate && this.skew === value.skew;
    };
    BoneRotateFrame.prototype.copy = function (value) {
        this.rotate = value.rotate;
        this.skew = value.skew;
    };
    BoneRotateFrame.prototype.getTweenFrame = function (to, progress) {
        if (progress === 0.0 || this.getTweenEnabled()) {
            return this;
        }
        if (progress >= 1.0) {
            return to;
        }
        progress = this.getTweenProgress(progress);
        var frame = new BoneRotateFrame();
        if (this.clockwise === 0) {
            frame.rotate = this.rotate + geom_1.normalizeDegree(to.rotate - this.rotate) * progress;
        }
        else {
            var clockwise = this.clockwise;
            if (clockwise > 0 ? to.rotate >= this.rotate : to.rotate <= this.rotate) {
                clockwise = clockwise > 0 ? clockwise - 1 : clockwise + 1;
            }
            frame.rotate = this.rotate + (to.rotate - this.rotate + 360.0 * clockwise) * progress;
        }
        frame.skew = this.skew + (to.skew - this.skew) * progress;
        return frame;
    };
    return BoneRotateFrame;
}(TweenFrame));
exports.BoneRotateFrame = BoneRotateFrame;
/**
 * @deprecated
 */
var SlotAllFrame = /** @class */ (function (_super_1) {
    __extends(SlotAllFrame, _super_1);
    function SlotAllFrame() {
        var _this = _super_1 !== null && _super_1.apply(this, arguments) || this;
        _this.displayIndex = 0;
        _this.color = new geom_1.ColorTransform();
        _this.actions = [];
        return _this;
    }
    SlotAllFrame.prototype.equal = function (value) {
        return this.actions.length === 0 && value.actions.length === 0 && this.displayIndex === value.displayIndex && this.color.equal(value.color);
    };
    SlotAllFrame.prototype.copy = function (value) {
        this.displayIndex = value.displayIndex;
        this.color.copyFrom(value.color);
    };
    return SlotAllFrame;
}(TweenFrame));
exports.SlotAllFrame = SlotAllFrame;
/**
 * @deprecated
 */
var SlotDisplayFrame = /** @class */ (function (_super_1) {
    __extends(SlotDisplayFrame, _super_1);
    function SlotDisplayFrame() {
        var _this = _super_1 !== null && _super_1.apply(this, arguments) || this;
        _this.value = 0;
        _this.actions = [];
        return _this;
    }
    SlotDisplayFrame.prototype.equal = function (value) {
        return this.actions.length === 0 && value.actions.length === 0 && this.value === value.value;
    };
    SlotDisplayFrame.prototype.copy = function (value) {
        this.value = value.value;
    };
    return SlotDisplayFrame;
}(Frame));
exports.SlotDisplayFrame = SlotDisplayFrame;
var SlotColorFrame = /** @class */ (function (_super_1) {
    __extends(SlotColorFrame, _super_1);
    function SlotColorFrame() {
        var _this = _super_1 !== null && _super_1.apply(this, arguments) || this;
        _this.value = new geom_1.ColorTransform();
        return _this;
    }
    SlotColorFrame.prototype.equal = function (value) {
        return this.value.equal(value.value);
    };
    SlotColorFrame.prototype.copy = function (value) {
        this.value.copyFrom(value.value);
    };
    return SlotColorFrame;
}(TweenFrame));
exports.SlotColorFrame = SlotColorFrame;
/**
 * @deprecated
 */
var IKConstraintFrame = /** @class */ (function (_super_1) {
    __extends(IKConstraintFrame, _super_1);
    function IKConstraintFrame() {
        var _this = _super_1 !== null && _super_1.apply(this, arguments) || this;
        _this.bendPositive = true;
        _this.weight = 1.0;
        return _this;
    }
    IKConstraintFrame.prototype.equal = function (value) {
        return this.bendPositive === value.bendPositive && this.weight === value.weight;
    };
    IKConstraintFrame.prototype.copy = function (value) {
        this.bendPositive = value.bendPositive;
        this.weight = value.weight;
    };
    return IKConstraintFrame;
}(TweenFrame));
exports.IKConstraintFrame = IKConstraintFrame;
var TextureAtlas = /** @class */ (function (_super_1) {
    __extends(TextureAtlas, _super_1);
    function TextureAtlas() {
        var _this = _super_1 !== null && _super_1.apply(this, arguments) || this;
        _this.width = 0;
        _this.height = 0;
        _this.scale = 1.00;
        _this.name = "";
        _this.imagePath = "";
        _this.SubTexture = [];
        return _this;
    }
    TextureAtlas.prototype.getTexture = function (name) {
        for (var _i = 0, _a = this.SubTexture; _i < _a.length; _i++) {
            var texture = _a[_i];
            if (texture.name === name) {
                return texture;
            }
        }
        return null;
    };
    return TextureAtlas;
}(BaseData));
exports.TextureAtlas = TextureAtlas;
var Texture = /** @class */ (function (_super_1) {
    __extends(Texture, _super_1);
    function Texture() {
        var _this = _super_1 !== null && _super_1.apply(this, arguments) || this;
        _this.rotated = false;
        _this.x = 0;
        _this.y = 0;
        _this.width = 0;
        _this.height = 0;
        _this.frameX = 0;
        _this.frameY = 0;
        _this.frameWidth = 0;
        _this.frameHeight = 0;
        _this.name = "";
        return _this;
    }
    return Texture;
}(BaseData));
exports.Texture = Texture;
var timelineType = TimelineType.Action;
function createTypeTimelineFrame() {
    switch (timelineType) {
        case TimelineType.Action:
            return SingleValueFrame0;
        case TimelineType.SlotDisplay:
        case TimelineType.SlotZIndex:
        case TimelineType.AnimationProgress:
            return SingleValueFrame0;
        case TimelineType.BoneAlpha:
        case TimelineType.SlotAlpha:
        case TimelineType.AnimationWeight:
            return SingleValueFrame1;
        case TimelineType.BoneTranslate:
        case TimelineType.BoneRotate:
        case TimelineType.AnimationParameter:
            return DoubleValueFrame0;
        case TimelineType.BoneScale:
        case TimelineType.IKConstraint:
            return DoubleValueFrame1;
        case TimelineType.ZOrder:
        case TimelineType.Surface:
        case TimelineType.SlotDeform:
            return MutilpleValueFrame;
        case TimelineType.SlotColor:
            return SlotColorFrame;
    }
    throw new Error();
}
exports.copyConfig = [
    DragonBones, {
        armature: Armature,
        textureAtlas: TextureAtlas,
        userData: UserData
    },
    Armature,
    {
        bone: [
            function (bone) {
                var type = bone.type;
                if (type !== undefined) {
                    if (typeof type === "string") {
                        type = utils.getEnumFormString(BoneType, type, BoneType.Bone);
                    }
                }
                else {
                    type = BoneType.Bone;
                }
                switch (type) {
                    case BoneType.Bone:
                        return Bone;
                    case BoneType.Surface:
                        return Surface;
                }
                return null;
            },
            Function
        ],
        slot: Slot,
        ik: IKConstraint,
        path: PathConstraint,
        skin: Skin,
        animation: Animation,
        defaultActions: OldAction,
        canvas: Canvas,
        userData: UserData
    },
    Bone, {
        userData: UserData
    },
    Slot, {
        actions: OldAction,
        userData: UserData
    },
    Skin, {
        slot: SkinSlot,
        userData: UserData
    },
    SkinSlot,
    {
        display: [
            function (display) {
                var type = display.type;
                if (type !== undefined) {
                    if (typeof type === "string") {
                        type = utils.getEnumFormString(DisplayType, type, DisplayType.Image);
                    }
                }
                else {
                    type = DisplayType.Image;
                }
                switch (type) {
                    case DisplayType.Image:
                        return ImageDisplay;
                    case DisplayType.Armature:
                        return ArmatureDisplay;
                    case DisplayType.Mesh:
                        if (display.share) {
                            return SharedMeshDisplay;
                        }
                        else {
                            return MeshDisplay;
                        }
                    case DisplayType.Path:
                        return PathDisplay;
                    case DisplayType.BoundingBox:
                        {
                            var subType = display.subType;
                            if (subType !== undefined) {
                                if (typeof subType === "string") {
                                    subType = utils.getEnumFormString(BoundingBoxType, subType, BoundingBoxType.Rectangle);
                                }
                            }
                            else {
                                subType = BoundingBoxType.Rectangle;
                            }
                            switch (subType) {
                                case BoundingBoxType.Rectangle:
                                    return RectangleBoundingBoxDisplay;
                                case BoundingBoxType.Ellipse:
                                    return EllipseBoundingBoxDisplay;
                                case BoundingBoxType.Polygon:
                                    return PolygonBoundingBoxDisplay;
                            }
                        }
                        break;
                }
                throw new Error();
            },
            Function
        ]
    },
    ArmatureDisplay, {
        actions: Action
    },
    Animation,
    {
        frame: ActionFrame,
        zOrder: ZOrderTimeline,
        bone: BoneTimeline,
        slot: SlotTimeline,
        ffd: SlotDeformTimeline,
        ik: IKConstraintTimeline,
        timeline: [
            function (timeline) {
                timelineType = "type" in timeline ? timeline["type"] : TimelineType.Action;
                switch (timelineType) {
                    case TimelineType.AnimationProgress:
                        if ("x" in timeline || "y" in timeline) {
                            return AnimationTimeline;
                        }
                    default:
                        return TypeTimeline;
                }
            },
            Function
        ],
    },
    TypeTimeline, {
        frame: [
            createTypeTimelineFrame,
            Function,
        ],
    },
    AnimationTimeline, {
        frame: [
            createTypeTimelineFrame,
            Function,
        ],
    },
    ZOrderTimeline, {
        frame: MutilpleValueFrame,
    },
    BoneTimeline, {
        frame: BoneAllFrame,
        translateFrame: DoubleValueFrame0,
        rotateFrame: BoneRotateFrame,
        scaleFrame: DoubleValueFrame1,
    },
    SlotTimeline, {
        frame: SlotAllFrame,
        displayFrame: SlotDisplayFrame,
        colorFrame: SlotColorFrame,
    },
    SlotDeformTimeline, {
        frame: MutilpleValueFrame,
    },
    IKConstraintTimeline, {
        frame: IKConstraintFrame,
    },
    ActionFrame, {
        actions: Action,
        events: Action,
    },
    SlotAllFrame, {
        actions: OldAction,
    },
    SlotDisplayFrame, {
        actions: OldAction,
    },
    TextureAtlas, {
        SubTexture: Texture,
    }
];
exports.compressConfig = [
    new geom_1.Point(0.5, 0.5),
    new geom_1.Rectangle(),
    new geom_1.Transform(),
    new geom_1.ColorTransform(),
    new DragonBones(),
    new UserData(),
    new OldAction(),
    new Action(),
    new Canvas(),
    new Armature(),
    new Bone(),
    new Surface(true),
    new Slot(),
    new IKConstraint(),
    new PathConstraint(),
    new Skin(),
    new SkinSlot(),
    new ImageDisplay(true),
    new ArmatureDisplay(true),
    new MeshDisplay(true),
    new SharedMeshDisplay(true),
    new PathDisplay(true),
    new RectangleBoundingBoxDisplay(true),
    new EllipseBoundingBoxDisplay(true),
    new PolygonBoundingBoxDisplay(true),
    new Animation(),
    new AnimationBinary(),
    new TypeTimeline(),
    new ZOrderTimeline(),
    new BoneTimeline(),
    new SlotTimeline(),
    new SlotDeformTimeline(),
    new IKConstraintTimeline(),
    new AnimationTimeline(),
    new SingleValueFrame0(),
    new SingleValueFrame1(),
    new DoubleValueFrame0(),
    new DoubleValueFrame1(),
    new MutilpleValueFrame(),
    new ActionFrame(),
    new BoneAllFrame(),
    new BoneRotateFrame(),
    new SlotAllFrame(),
    new SlotDisplayFrame(),
    new SlotColorFrame(),
    new IKConstraintFrame(),
    new TextureAtlas(),
    new Texture(),
];
