"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var object = require("../common/object");
var geom = require("../format/geom");
var dbft = require("../format/dragonBonesFormat");
var dbftV23 = require("../format/dragonBonesFormatV23");
/**
 * Convert json string to DragonBones format.
 */
function default_1(jsonString, getTextureAtlases, scale) {
    if (scale === void 0) { scale = 1.0; }
    if (!dbft.isDragonBonesString(jsonString)) {
        return null;
    }
    try {
        var json = JSON.parse(jsonString);
        var version = json["version"];
        if (dbft.DATA_VERSIONS.indexOf(version) < dbft.DATA_VERSIONS.indexOf(dbft.DATA_VERSION_4_0)) {
            textureAtlases = getTextureAtlases();
            var data = new dbftV23.DragonBones();
            object.copyObjectFrom(json, data, dbftV23.copyConfig);
            return V23ToV45(data);
        }
        var result = new dbft.DragonBones();
        object.copyObjectFrom(json, result, dbft.copyConfig, scale);
        return result;
    }
    catch (error) {
    }
    return null;
}
exports.default = default_1;
var textureAtlases;
var helpMatrix = new geom.Matrix();
var helpTransform = new geom.Transform();
var helpPoint = new geom.Point();
/**
 * Convert v2 v3 to v4 v5.
 */
function V23ToV45(data) {
    var result = new dbft.DragonBones();
    result.frameRate = data.frameRate;
    result.name = data.name;
    result.version = dbft.DATA_VERSION_4_5;
    result.compatibleVersion = dbft.DATA_VERSION_4_0;
    for (var _i = 0, _a = data.armature; _i < _a.length; _i++) {
        var armatureV23 = _a[_i];
        var armature = new dbft.Armature();
        armature.name = armatureV23.name;
        result.armature.push(armature);
        for (var _b = 0, _c = armatureV23.bone; _b < _c.length; _b++) {
            var boneV23 = _c[_b];
            var bone = new dbft.Bone();
            bone.inheritScale = false;
            // bone.inheritReflection = false;
            bone.name = boneV23.name;
            bone.parent = boneV23.parent;
            bone.transform.copyFrom(boneV23.transform);
            armature.bone.push(bone);
        }
        for (var _d = 0, _e = armatureV23.skin; _d < _e.length; _d++) {
            var skinV23 = _e[_d];
            var skin = new dbft.Skin();
            skin.name = skinV23.name;
            armature.skin.push(skin);
            skinV23.slot.sort(sortSkinSlot);
            for (var _f = 0, _g = skinV23.slot; _f < _g.length; _f++) {
                var slotV23 = _g[_f];
                var slot = armature.getSlot(slotV23.name);
                if (!slot) {
                    slot = new dbft.Slot();
                    slot.blendMode = slotV23.blendMode || dbft.BlendMode[dbft.BlendMode.Normal].toLowerCase();
                    slot.displayIndex = slotV23.displayIndex;
                    slot.name = slotV23.name;
                    slot.parent = slotV23.parent;
                    slot.color.copyFrom(slotV23.colorTransform);
                    armature.slot.push(slot);
                }
                var skinSlot = new dbft.SkinSlot();
                skinSlot.name = slotV23.name;
                skin.slot.push(skinSlot);
                for (var _h = 0, _j = slotV23.display; _h < _j.length; _h++) {
                    var displayV23 = _j[_h];
                    if (displayV23.type === dbft.DisplayType[dbft.DisplayType.Image].toLowerCase()) {
                        var display = new dbft.ImageDisplay();
                        display.name = displayV23.name;
                        display.transform.copyFrom(displayV23.transform);
                        display.transform.pX = 0.0;
                        display.transform.pY = 0.0;
                        var texture = dbft.getTextureFormTextureAtlases(display.name, textureAtlases);
                        if (texture) {
                            display.transform.x += 0.5 * texture.width - displayV23.transform.pX;
                            display.transform.y += 0.5 * texture.height - displayV23.transform.pY;
                        }
                        skinSlot.display.push(display);
                    }
                    else {
                        var display = new dbft.ArmatureDisplay();
                        display.name = displayV23.name;
                        display.transform.copyFrom(displayV23.transform);
                        skinSlot.display.push(display);
                    }
                }
            }
        }
        for (var _k = 0, _l = armatureV23.animation; _k < _l.length; _k++) {
            var animationV23 = _l[_k];
            var animation = new dbft.Animation();
            animation.duration = animationV23.duration;
            animation.playTimes = animationV23.loop;
            animation.scale = animationV23.scale;
            animation.fadeInTime = animationV23.fadeInTime;
            animation.name = animationV23.name;
            armature.animation.push(animation);
            for (var _m = 0, _o = animationV23.frame; _m < _o.length; _m++) {
                var frameV23 = _o[_m];
                var frame = new dbft.ActionFrame();
                frame.duration = frameV23.duration;
                frame.action = frameV23.action;
                frame.event = frameV23.event;
                frame.sound = frameV23.sound;
                animation.frame.push(frame);
            }
            for (var _p = 0, _q = animationV23.timeline; _p < _q.length; _p++) {
                var timelineV23 = _q[_p];
                var bone = armature.getBone(timelineV23.name);
                var slot = armature.getSlot(timelineV23.name);
                var boneAllTimeline = new dbft.BoneTimeline();
                var slotAllTimeline = new dbft.SlotTimeline();
                boneAllTimeline.scale = slotAllTimeline.scale = timelineV23.scale;
                boneAllTimeline.offset = slotAllTimeline.offset = timelineV23.offset;
                boneAllTimeline.name = slotAllTimeline.name = timelineV23.name;
                animation.bone.push(boneAllTimeline);
                animation.slot.push(slotAllTimeline);
                var position = 0;
                var prevBoneFrame = null;
                var prevSlotFrame = null;
                for (var _r = 0, _s = timelineV23.frame; _r < _s.length; _r++) {
                    var frameV23 = _s[_r];
                    var boneAllFrame = new dbft.BoneAllFrame();
                    var slotAllFrame = new dbft.SlotAllFrame();
                    boneAllFrame.duration = frameV23.duration;
                    if (frameV23.tweenEasing === null) {
                        if (animationV23.autoTween) {
                            if (animationV23.tweenEasing === null) {
                                boneAllFrame.tweenEasing = 0;
                                slotAllFrame.tweenEasing = 0;
                            }
                            else {
                                boneAllFrame.tweenEasing = animationV23.tweenEasing;
                                slotAllFrame.tweenEasing = animationV23.tweenEasing;
                            }
                        }
                        else {
                            boneAllFrame.tweenEasing = NaN;
                            slotAllFrame.tweenEasing = NaN;
                        }
                    }
                    else {
                        boneAllFrame.tweenEasing = frameV23.tweenEasing;
                        slotAllFrame.tweenEasing = frameV23.tweenEasing;
                    }
                    boneAllFrame.curve = frameV23.curve;
                    boneAllFrame.tweenRotate = frameV23.tweenRotate;
                    boneAllFrame.transform.copyFrom(frameV23.transform);
                    slotAllFrame.duration = frameV23.duration;
                    slotAllFrame.curve = frameV23.curve;
                    slotAllFrame.displayIndex = frameV23.displayIndex;
                    slotAllFrame.color.copyFrom(frameV23.colorTransform);
                    boneAllTimeline.frame.push(boneAllFrame);
                    slotAllTimeline.frame.push(slotAllFrame);
                    if (prevBoneFrame && prevSlotFrame && frameV23.displayIndex < 0) {
                        prevBoneFrame.removeTween();
                        prevSlotFrame.removeTween();
                    }
                    boneAllFrame.transform.toMatrix(helpMatrix);
                    helpMatrix.transformPoint(frameV23.transform.pX, frameV23.transform.pY, helpPoint, true);
                    boneAllFrame.transform.x += helpPoint.x;
                    boneAllFrame.transform.y += helpPoint.y;
                    if (frameV23.hide) {
                        slotAllFrame.displayIndex = -1;
                    }
                    if (frameV23.action) {
                        var action = new dbft.Action();
                        action.type = dbft.ActionType.Play;
                        action.name = frameV23.action;
                        slotAllFrame.actions.push(action);
                    }
                    if (frameV23.event || frameV23.sound) {
                        dbft.mergeActionToAnimation(animation, frameV23, position, bone, slot, true);
                    }
                    position += frameV23.duration;
                    prevBoneFrame = boneAllFrame;
                    prevSlotFrame = slotAllFrame;
                }
            }
            for (var _t = 0, _u = armature.slot; _t < _u.length; _t++) {
                var slot = _u[_t];
                var timeline = animation.getSlotTimeline(slot.name);
                if (!timeline) {
                    var frame = new dbft.SlotAllFrame();
                    frame.displayIndex = -1;
                    timeline = new dbft.SlotTimeline();
                    timeline.name = slot.name;
                    timeline.frame.push(frame);
                    animation.slot.push(timeline);
                }
            }
        }
        if (data.isGlobal) {
            armature.sortBones();
            globalToLocal(armature);
        }
    }
    return result;
}
function sortSkinSlot(a, b) {
    return a.z < b.z ? -1 : 1;
}
function globalToLocal(armature) {
    var bones = armature.bone.concat().reverse();
    for (var _i = 0, bones_1 = bones; _i < bones_1.length; _i++) {
        var bone = bones_1[_i];
        var parent_1 = armature.getBone(bone.parent);
        if (parent_1) {
            parent_1.transform.toMatrix(helpMatrix);
            helpMatrix.invert();
            helpMatrix.transformPoint(bone.transform.x, bone.transform.y, helpPoint);
            bone.transform.x = helpPoint.x;
            bone.transform.y = helpPoint.y;
            bone.transform.skX -= parent_1.transform.skY;
            bone.transform.skY -= parent_1.transform.skY;
        }
        else {
            bone.parent = "";
        }
        for (var _a = 0, _b = armature.animation; _a < _b.length; _a++) {
            var animation = _b[_a];
            var timeline = animation.getBoneTimeline(bone.name);
            if (!timeline) {
                continue;
            }
            var parentTimeline = parent_1 ? animation.getBoneTimeline(parent_1.name) : null;
            var position = 0;
            for (var _c = 0, _d = timeline.frame; _c < _d.length; _c++) {
                var frame = _d[_c];
                if (parentTimeline) {
                    getTimelineFrameMatrix(parentTimeline, position, helpTransform);
                    helpTransform.toMatrix(helpMatrix);
                    helpMatrix.invert();
                    helpMatrix.transformPoint(frame.transform.x, frame.transform.y, helpPoint);
                    frame.transform.x = helpPoint.x;
                    frame.transform.y = helpPoint.y;
                    frame.transform.skX -= helpTransform.skY;
                    frame.transform.skY -= helpTransform.skY;
                }
                frame.transform.x -= bone.transform.x;
                frame.transform.y -= bone.transform.y;
                frame.transform.skX = geom.normalizeDegree(frame.transform.skX - bone.transform.skY);
                frame.transform.skY = geom.normalizeDegree(frame.transform.skY - bone.transform.skY);
                frame.transform.scX /= bone.transform.scX;
                frame.transform.scY /= bone.transform.scY;
                position += frame.duration;
            }
        }
    }
}
function getTimelineFrameMatrix(timeline, framePosition, transform) {
    var position = 0;
    var currentFrame = null;
    var nextFrame = null;
    for (var _i = 0, _a = timeline.frame; _i < _a.length; _i++) {
        var frame = _a[_i];
        if (position <= framePosition && framePosition < position + frame.duration) {
            currentFrame = frame;
            break;
        }
        position += frame.duration;
    }
    if (!currentFrame) {
        currentFrame = timeline.frame[timeline.frame.length - 1];
    }
    if ((!isNaN(currentFrame.tweenEasing) || currentFrame.curve.length > 0) && timeline.frame.length > 1) {
        var nextIndex = timeline.frame.indexOf(currentFrame) + 1;
        if (nextIndex >= timeline.frame.length) {
            nextIndex = 0;
        }
        nextFrame = timeline.frame[nextIndex];
    }
    if (!nextFrame) {
        transform.copyFrom(currentFrame.transform);
    }
    else {
        var tweenProgress = currentFrame.getTweenProgress((framePosition - position) / currentFrame.duration);
        transform.x = nextFrame.transform.x - currentFrame.transform.x;
        transform.y = nextFrame.transform.y - currentFrame.transform.y;
        transform.skX = geom.normalizeRadian(nextFrame.transform.skX - currentFrame.transform.skX);
        transform.skY = geom.normalizeRadian(nextFrame.transform.skY - currentFrame.transform.skY);
        transform.scX = nextFrame.transform.scX - currentFrame.transform.scX;
        transform.scY = nextFrame.transform.scY - currentFrame.transform.scY;
        transform.x = currentFrame.transform.x + transform.x * tweenProgress;
        transform.y = currentFrame.transform.y + transform.y * tweenProgress;
        transform.skX = currentFrame.transform.skX + transform.skX * tweenProgress;
        transform.skY = currentFrame.transform.skY + transform.skY * tweenProgress;
        transform.scX = currentFrame.transform.scX + transform.scX * tweenProgress;
        transform.scY = currentFrame.transform.scY + transform.scY * tweenProgress;
    }
}
//# sourceMappingURL=toFormat.js.map