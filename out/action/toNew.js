"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var geom = require("../format/geom");
var dbft = require("../format/dragonBonesFormat");
function default_1(data, forRuntime) {
    data.version = dbft.DATA_VERSION_5_5;
    data.compatibleVersion = dbft.DATA_VERSION_5_5;
    for (var _i = 0, _a = data.armature; _i < _a.length; _i++) {
        var armature = _a[_i];
        if (armature.type.toString().toLowerCase() === dbft.ArmatureType[dbft.ArmatureType.Stage]) {
            armature.type = dbft.ArmatureType[dbft.ArmatureType.MovieClip];
            armature.canvas = new dbft.Canvas();
            armature.canvas.x = armature.aabb.x;
            armature.canvas.y = armature.aabb.y;
            armature.canvas.width = armature.aabb.width;
            armature.canvas.height = armature.aabb.height;
        }
        for (var _b = 0, _c = armature.skin; _b < _c.length; _b++) {
            var skin = _c[_b];
            skin.name = skin.name || "default";
        }
        if (forRuntime) { // Old action to new action.
            if (armature.defaultActions.length > 0) {
                for (var i = 0, l = armature.defaultActions.length; i < l; ++i) {
                    var action = armature.defaultActions[i];
                    if (action instanceof dbft.OldAction) {
                        armature.defaultActions[i] = dbft.oldActionToNewAction(action);
                    }
                }
            }
        }
        if (forRuntime) { // Old action to new action and move action to display.
            for (var _d = 0, _e = armature.slot; _d < _e.length; _d++) {
                var slot = _e[_d];
                if (slot.actions.length > 0) {
                    var defaultSkin = armature.getSkin("default");
                    if (defaultSkin) {
                        var skinSlot = defaultSkin.getSlot(slot.name);
                        if (skinSlot !== null && skinSlot instanceof dbft.SkinSlot) {
                            for (var _f = 0, _g = slot.actions; _f < _g.length; _f++) {
                                var action = _g[_f];
                                if (action instanceof dbft.OldAction) {
                                    var display = skinSlot.display[slot.displayIndex];
                                    if (display instanceof dbft.ArmatureDisplay) {
                                        display.actions.push(dbft.oldActionToNewAction(action));
                                    }
                                }
                            }
                        }
                    }
                    slot.actions.length = 0;
                }
            }
        }
        for (var _h = 0, _j = armature.animation; _h < _j.length; _h++) {
            var animation = _j[_h];
            if (forRuntime) { // Old animation frame to new animation frame.
                for (var _k = 0, _l = animation.frame; _k < _l.length; _k++) {
                    var frame = _l[_k];
                    if (frame.event) {
                        var action = new dbft.Action();
                        action.type = dbft.ActionType.Frame;
                        action.name = frame.event;
                        frame.actions.push(action);
                        frame.event = "";
                    }
                    if (frame.sound) {
                        var action = new dbft.Action();
                        action.type = dbft.ActionType.Sound;
                        action.name = frame.sound;
                        frame.actions.push(action);
                        frame.sound = "";
                    }
                    if (frame.action) {
                        var action = new dbft.Action();
                        action.type = dbft.ActionType.Play;
                        action.name = frame.action;
                        frame.actions.push(action);
                        frame.action = "";
                    }
                    for (var _m = 0, _o = frame.events; _m < _o.length; _m++) {
                        var event_1 = _o[_m];
                        event_1.type = dbft.ActionType.Frame;
                        frame.actions.push(event_1);
                    }
                    frame.events.length = 0;
                }
            }
            // Modify bone timelines.
            for (var _p = 0, _q = animation.bone; _p < _q.length; _p++) {
                var timeline = _q[_p];
                if (timeline instanceof dbft.TypeTimeline) {
                    continue;
                }
                var bone = armature.getBone(timeline.name);
                if (!bone) {
                    continue;
                }
                var position = 0;
                var slot = armature.getSlot(timeline.name);
                // Bone frame to transform frame.
                for (var i = 0, l = timeline.frame.length; i < l; ++i) {
                    var frame = timeline.frame[i];
                    var translateFrame = new dbft.DoubleValueFrame0();
                    var rotateFrame = new dbft.BoneRotateFrame();
                    var scaleFrame = new dbft.DoubleValueFrame1();
                    timeline.translateFrame.push(translateFrame);
                    timeline.rotateFrame.push(rotateFrame);
                    timeline.scaleFrame.push(scaleFrame);
                    translateFrame.duration = frame.duration;
                    rotateFrame.duration = frame.duration;
                    scaleFrame.duration = frame.duration;
                    translateFrame.tweenEasing = frame.tweenEasing;
                    translateFrame.curve = frame.curve.concat();
                    rotateFrame.tweenEasing = frame.tweenEasing;
                    rotateFrame.curve = frame.curve.concat();
                    scaleFrame.tweenEasing = frame.tweenEasing;
                    scaleFrame.curve = frame.curve.concat();
                    translateFrame.x = frame.transform.x;
                    translateFrame.y = frame.transform.y;
                    rotateFrame.clockwise = frame.tweenRotate;
                    rotateFrame.rotate = geom.normalizeDegree(frame.transform.skY);
                    rotateFrame.skew = geom.normalizeDegree(frame.transform.skX - frame.transform.skY);
                    scaleFrame.x = frame.transform.scX;
                    scaleFrame.y = frame.transform.scY;
                    if (frame.action && !slot) { // Error data.
                        frame.action = "";
                    }
                    if (frame.event || frame.sound || frame.action) { // Merge bone action frame to action timeline.
                        dbft.mergeActionToAnimation(animation, frame, position, bone, slot, forRuntime);
                        frame.event = "";
                        frame.sound = "";
                        frame.action = "";
                    }
                    position += frame.duration;
                }
                timeline.frame.length = 0;
            }
            // Modify slot timelines.
            for (var _r = 0, _s = animation.slot; _r < _s.length; _r++) {
                var timeline = _s[_r];
                var slot = armature.getSlot(timeline.name);
                if (!slot) {
                    continue;
                }
                var position = 0;
                // Slot frame to display frame and color frame.
                for (var i = 0, l = timeline.frame.length; i < l; ++i) {
                    var frame = timeline.frame[i];
                    var displayFrame = new dbft.SlotDisplayFrame();
                    var colorFrame = new dbft.SlotColorFrame();
                    timeline.displayFrame.push(displayFrame);
                    timeline.colorFrame.push(colorFrame);
                    displayFrame.duration = frame.duration;
                    colorFrame.duration = frame.duration;
                    colorFrame.tweenEasing = frame.tweenEasing;
                    colorFrame.curve = frame.curve.concat();
                    displayFrame.value = frame.displayIndex;
                    colorFrame.value.copyFrom(frame.color);
                    if (frame.actions.length > 0) {
                        if (forRuntime) {
                            dbft.mergeActionToAnimation(animation, frame, position, null, slot, true);
                        }
                        else {
                            for (var _t = 0, _u = frame.actions; _t < _u.length; _t++) {
                                var action = _u[_t];
                                displayFrame.actions.push(action);
                            }
                        }
                    }
                    position += frame.duration;
                }
                timeline.frame.length = 0;
                // Merge slot action to action timeline.
                if (forRuntime) {
                    position = 0;
                    for (var i = 0, l = timeline.displayFrame.length; i < l; ++i) {
                        var frame = timeline.displayFrame[i];
                        if (frame.actions.length > 0) {
                            dbft.mergeActionToAnimation(animation, frame, position, null, slot, true);
                            frame.actions.length = 0;
                            position += frame.duration;
                        }
                    }
                }
            }
        }
    }
    return data;
}
exports.default = default_1;
