"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var geom = require("../format/geom");
var dbft = require("../format/dragonBonesFormat");
function default_1(data, textureAtlases) {
    if (textureAtlases === void 0) { textureAtlases = null; }
    if (data) {
        for (var _i = 0, _a = data.armature; _i < _a.length; _i++) {
            var armature = _a[_i];
            if (armature.canvas) {
                if (armature.canvas.hasBackground) {
                    armature.canvas.hasBackground = false; // { color:0xxxxxxx }
                }
                else {
                    armature.canvas.color = -1; // { }
                }
            }
            if (armature.bone.length === 0) {
                armature.slot.length = 0;
                armature.ik.length = 0;
                armature.path.length = 0;
                armature.skin.length = 0;
                armature.animation.length = 0;
                armature.defaultActions.length = 0;
                armature.actions.length = 0;
                return;
            }
            // if (typeof this.type === "string") { // LowerCase bug. (If fix the bug, some third-party plugins may go wrong)
            //     this.type = this.type.toLowerCase();
            // }
            armature.aabb.toFixed();
            for (var _b = 0, _c = armature.bone; _b < _c.length; _b++) {
                var bone = _c[_b];
                if (bone.parent && !armature.getBone(bone.parent)) {
                    bone.parent = "";
                }
                bone.alpha = Number(bone.alpha.toFixed(2));
                if (bone instanceof dbft.Surface) {
                    var vertices = bone.vertices;
                    for (var i = 0, l = vertices.length; i < l; ++i) {
                        vertices[i] = Number(vertices[i].toFixed(2));
                    }
                }
                else {
                    bone.transform.skX = geom.normalizeDegree(bone.transform.skX);
                    bone.transform.skY = geom.normalizeDegree(bone.transform.skY);
                    if (bone.transform.scX === 0.0) {
                        bone.transform.scX = 0.000001;
                    }
                    if (bone.transform.scY === 0.0) {
                        bone.transform.scY = 0.000001;
                    }
                    bone.transform.toFixed();
                }
            }
            for (var _d = 0, _e = armature.slot; _d < _e.length; _d++) {
                var slot = _e[_d];
                if (!slot.parent || !armature.getBone(slot.parent)) {
                    slot.parent = armature.bone[0].name;
                }
                slot.alpha = Number(slot.alpha.toFixed(2));
                slot.color.toFixed();
            }
            for (var _f = 0, _g = armature.ik; _f < _g.length; _f++) {
                var ikConstraint = _g[_f];
                if (!ikConstraint.target || !ikConstraint.bone) {
                    // TODO
                }
                // TODO check recurrence
                ikConstraint.weight = Number(ikConstraint.weight.toFixed(2));
            }
            for (var _h = 0, _j = armature.path; _h < _j.length; _h++) {
                var pathConstraint = _j[_h];
                if (!pathConstraint.target || !pathConstraint.bones) {
                    // TODO
                }
                // TODO check recurrence
                pathConstraint.position = Number(pathConstraint.position.toFixed(2));
                pathConstraint.spacing = Number(pathConstraint.spacing.toFixed(2));
                pathConstraint.rotateOffset = Number(pathConstraint.rotateOffset.toFixed(2));
                pathConstraint.rotateMix = Number(pathConstraint.rotateMix.toFixed(2));
                pathConstraint.translateMix = Number(pathConstraint.translateMix.toFixed(2));
            }
            armature.sortBones();
            for (var _k = 0, _l = armature.skin; _k < _l.length; _k++) {
                var skin = _l[_k];
                for (var _m = 0, _o = skin.slot; _m < _o.length; _m++) {
                    var skinSlot = _o[_m];
                    if (!armature.getSlot(skinSlot.name)) {
                        skinSlot.display.length = 0;
                        continue;
                    }
                    skinSlot.actions.length = 0; // Fix data bug.
                    for (var _p = 0, _q = skinSlot.display; _p < _q.length; _p++) {
                        var display = _q[_p];
                        if (!display) {
                            continue;
                        }
                        if (display instanceof dbft.ImageDisplay ||
                            display instanceof dbft.MeshDisplay ||
                            display instanceof dbft.SharedMeshDisplay ||
                            display instanceof dbft.ArmatureDisplay) {
                            if (display.path === display.name) {
                                display.path = "";
                            }
                        }
                        if (display instanceof dbft.MeshDisplay) {
                            if (display.weights.length > 0) {
                                for (var i = 0, l = display.weights.length; i < l; ++i) {
                                    display.weights[i] = Number(display.weights[i].toFixed(6));
                                }
                                for (var i = 0, l = display.bonePose.length; i < l; ++i) {
                                    display.bonePose[i] = Number(display.bonePose[i].toFixed(6)); // TODO
                                }
                                display._matrix.copyFromArray(display.slotPose, 0);
                                display.transform.identity();
                                display.slotPose[0] = 1.0;
                                display.slotPose[1] = 0.0;
                                display.slotPose[2] = 0.0;
                                display.slotPose[3] = 1.0;
                                display.slotPose[4] = 0.0;
                                display.slotPose[5] = 0.0;
                            }
                            else {
                                display.transform.toMatrix(display._matrix);
                                display.transform.identity();
                            }
                            for (var i = 0, l = display.uvs.length; i < l; ++i) {
                                display.uvs[i] = Number(display.uvs[i].toFixed(6));
                            }
                            for (var i = 0, l = display.vertices.length; i < l; i += 2) {
                                display._matrix.transformPoint(display.vertices[i], display.vertices[i + 1], geom.helpPointA);
                                display.vertices[i] = Number(geom.helpPointA.x.toFixed(2));
                                display.vertices[i + 1] = Number(geom.helpPointA.y.toFixed(2));
                            }
                        }
                        if (display instanceof dbft.PathDisplay) {
                            for (var i = 0, l = display.lengths.length; i < l; ++i) {
                                display.lengths[i] = Number(display.lengths[i].toFixed(2));
                            }
                            for (var i = 0, l = display.vertices.length; i < l; ++i) {
                                display.vertices[i] = Number(display.vertices[i].toFixed(2));
                            }
                            for (var i = 0, l = display.weights.length; i < l; ++i) {
                                display.weights[i] = Number(display.weights[i].toFixed(6));
                            }
                        }
                        if (display instanceof dbft.RectangleBoundingBoxDisplay ||
                            display instanceof dbft.EllipseBoundingBoxDisplay) {
                            display.width = Number(display.width.toFixed(2));
                            display.height = Number(display.height.toFixed(2));
                        }
                        if (display instanceof dbft.PolygonBoundingBoxDisplay) {
                            display.transform.toMatrix(geom.helpMatrixA);
                            display.transform.identity();
                            for (var i = 0, l = display.vertices.length; i < l; i += 2) {
                                geom.helpMatrixA.transformPoint(display.vertices[i], display.vertices[i + 1], geom.helpPointA);
                                display.vertices[i] = Number(geom.helpPointA.x.toFixed(2));
                                display.vertices[i + 1] = Number(geom.helpPointA.y.toFixed(2));
                            }
                        }
                        display.transform.skX = geom.normalizeDegree(display.transform.skX);
                        display.transform.skY = geom.normalizeDegree(display.transform.skY);
                        display.transform.toFixed();
                    }
                }
            }
            for (var _r = 0, _s = armature.animation; _r < _s.length; _r++) {
                var animation = _s[_r];
                if (!(animation instanceof dbft.Animation)) {
                    continue;
                }
                if (animation.zOrder) {
                    for (var _t = 0, _u = animation.zOrder.frame; _t < _u.length; _t++) { // Fix zOrder bug.
                        var frame = _u[_t];
                        for (var i = 0, l = frame.zOrder.length; i < l; i += 2) {
                            var index = frame.zOrder[i] + frame.zOrder[i + 1];
                            if (index < 0) {
                                frame.zOrder[i + 1] = armature.slot.length + index;
                            }
                        }
                    }
                    cleanFrame(animation.zOrder.frame);
                    if (animation.zOrder.frame.length === 0) {
                        animation.zOrder = null;
                    }
                }
                for (var i = 0, l = animation.bone.length; i < l; ++i) {
                    var timeline = animation.bone[i];
                    var bone = armature.getBone(timeline.name);
                    if (bone) {
                        for (var _v = 0, _w = timeline.frame; _v < _w.length; _v++) {
                            var frame = _w[_v];
                            frame.transform.skX = geom.normalizeDegree(frame.transform.skX);
                            frame.transform.skY = geom.normalizeDegree(frame.transform.skY);
                            frame.transform.toFixed();
                        }
                        for (var _x = 0, _y = timeline.translateFrame; _x < _y.length; _x++) {
                            var frame = _y[_x];
                            frame.x = Number(frame.x.toFixed(2));
                            frame.y = Number(frame.y.toFixed(2));
                        }
                        for (var _z = 0, _0 = timeline.rotateFrame; _z < _0.length; _z++) {
                            var frame = _0[_z];
                            frame.rotate = Number(geom.normalizeDegree(frame.rotate).toFixed(2));
                            frame.skew = Number(geom.normalizeDegree(frame.skew).toFixed(2));
                        }
                        for (var _1 = 0, _2 = timeline.scaleFrame; _1 < _2.length; _1++) {
                            var frame = _2[_1];
                            frame.x = Number(frame.x.toFixed(4));
                            frame.y = Number(frame.y.toFixed(4));
                        }
                        cleanFrame(timeline.frame);
                        cleanFrame(timeline.translateFrame);
                        cleanFrame(timeline.rotateFrame);
                        cleanFrame(timeline.scaleFrame);
                        if (timeline.frame.length === 1) {
                            var frame = timeline.frame[0];
                            if (frame.transform.x === 0.0 &&
                                frame.transform.y === 0.0 &&
                                frame.transform.skX === 0.0 &&
                                frame.transform.skY === 0.0 &&
                                frame.transform.scX === 0.0 &&
                                frame.transform.scY === 0.0) {
                                timeline.frame.length = 0;
                            }
                        }
                        if (timeline.translateFrame.length === 1) {
                            var frame = timeline.translateFrame[0];
                            if (frame.x === 0.0 && frame.y === 0.0) {
                                timeline.translateFrame.length = 0;
                            }
                        }
                        if (timeline.rotateFrame.length === 1) {
                            var frame = timeline.rotateFrame[0];
                            if (frame.rotate === 0.0 && frame.skew === 0.0) {
                                timeline.rotateFrame.length = 0;
                            }
                        }
                        if (timeline.scaleFrame.length === 1) {
                            var frame = timeline.scaleFrame[0];
                            if (frame.x === 0.0 && frame.y === 0.0) {
                                timeline.scaleFrame.length = 0;
                            }
                        }
                        if (timeline.frame.length > 0 || timeline.translateFrame.length > 0 || timeline.rotateFrame.length > 0 || timeline.scaleFrame.length > 0) {
                            continue;
                        }
                    }
                    animation.bone.splice(i, 1);
                    i--;
                    l--;
                }
                for (var i = 0, l = animation.slot.length; i < l; ++i) {
                    var timeline = animation.slot[i];
                    var slot = armature.getSlot(timeline.name);
                    if (slot) {
                        for (var _3 = 0, _4 = timeline.frame; _3 < _4.length; _3++) {
                            var frame = _4[_3];
                            frame.color.toFixed();
                        }
                        for (var _5 = 0, _6 = timeline.colorFrame; _5 < _6.length; _5++) {
                            var frame = _6[_5];
                            frame.value.toFixed();
                        }
                        cleanFrame(timeline.frame);
                        cleanFrame(timeline.displayFrame);
                        cleanFrame(timeline.colorFrame);
                        if (timeline.frame.length === 1) {
                            var frame = timeline.frame[0];
                            if (frame.displayIndex === slot.displayIndex &&
                                frame.color.equal(slot.color)) {
                                timeline.frame.length = 0;
                            }
                        }
                        if (timeline.displayFrame.length === 1) {
                            var frame = timeline.displayFrame[0];
                            if (frame.actions.length === 0 && frame.value === slot.displayIndex) {
                                timeline.displayFrame.length = 0;
                            }
                        }
                        if (timeline.colorFrame.length === 1) {
                            var frame = timeline.colorFrame[0];
                            if (frame.value.equal(slot.color)) {
                                timeline.colorFrame.length = 0;
                            }
                        }
                        if (timeline.frame.length > 0 || timeline.displayFrame.length > 0 || timeline.colorFrame.length > 0) {
                            continue;
                        }
                    }
                    animation.slot.splice(i, 1);
                    i--;
                    l--;
                }
                for (var i = 0, l = animation.ffd.length; i < l; ++i) {
                    var timeline = animation.ffd[i];
                    var slot = armature.getSlot(timeline.slot);
                    var display = armature.getDisplay(timeline.skin, timeline.slot, timeline.name);
                    if (slot && display) {
                        var vertices = display.vertices;
                        // display.path = display.path || display.name;
                        // display.name = (timeline.skin ? timeline.skin + "_" : "") + (timeline.slot ? timeline.slot + "_" : "") + display.name;
                        // timeline.skin = ""; TODO
                        // timeline.slot = ""; TODO
                        for (var _7 = 0, _8 = timeline.frame; _7 < _8.length; _7++) {
                            var frame = _8[_7];
                            var inSide = 0;
                            var x = 0.0;
                            var y = 0.0;
                            for (var i_1 = 0, l_1 = vertices.length; i_1 < l_1; i_1 += 2) {
                                inSide = 0;
                                if (i_1 < frame.offset || i_1 - frame.offset >= frame.vertices.length) {
                                    x = 0.0;
                                }
                                else {
                                    inSide = 1;
                                    x = frame.vertices[i_1 - frame.offset];
                                }
                                if (i_1 + 1 < frame.offset || i_1 + 1 - frame.offset >= frame.vertices.length) {
                                    y = 0.0;
                                }
                                else {
                                    if (inSide === 0) {
                                        inSide = -1;
                                    }
                                    y = frame.vertices[i_1 + 1 - frame.offset];
                                }
                                if (inSide !== 0) {
                                    display._matrix.transformPoint(x, y, geom.helpPointA, true);
                                    if (inSide === 1) {
                                        frame.vertices[i_1 - frame.offset] = geom.helpPointA.x;
                                    }
                                    frame.vertices[i_1 + 1 - frame.offset] = geom.helpPointA.y;
                                }
                            }
                            frame.offset += formatDeform(frame.vertices);
                        }
                        cleanFrame(timeline.frame);
                        if (timeline.frame.length === 1) {
                            var frame = timeline.frame[0];
                            if (frame.vertices.length === 0) {
                                timeline.frame.length = 0;
                            }
                        }
                        if (timeline.frame.length > 0) {
                            continue;
                        }
                    }
                    animation.ffd.splice(i, 1);
                    i--;
                    l--;
                }
                for (var i = 0, l = animation.timeline.length; i < l; ++i) {
                    var timeline = animation.timeline[i];
                    switch (timeline.type) {
                        case dbft.TimelineType.Action:
                        case dbft.TimelineType.ZOrder: {
                            cleanFrame(timeline.frame);
                            break;
                        }
                        case dbft.TimelineType.SlotDisplay: {
                            var slot = armature.getSlot(timeline.name);
                            if (slot) {
                                cleanFrame(timeline.frame);
                                if (timeline.frame.length === 1) {
                                    var frame = timeline.frame[0];
                                    if (frame.value === slot.displayIndex) {
                                        timeline.frame.length = 0;
                                    }
                                }
                            }
                            else {
                                timeline.frame.length = 0;
                            }
                            break;
                        }
                        case dbft.TimelineType.SlotZIndex: {
                            var slot = armature.getSlot(timeline.name);
                            if (slot) {
                                cleanFrame(timeline.frame);
                                // if (timeline.frame.length === 1) {
                                //     const frame = timeline.frame[0] as dbft.SingleValueFrame0;
                                //     if (frame.value === slot.zIndex) {
                                //         timeline.frame.length = 0;
                                //     }
                                // }
                            }
                            else {
                                timeline.frame.length = 0;
                            }
                            break;
                        }
                        case dbft.TimelineType.BoneAlpha:
                        case dbft.TimelineType.SlotAlpha: {
                            var frames_8 = timeline.frame;
                            for (var _9 = 0, frames_1 = frames_8; _9 < frames_1.length; _9++) {
                                var frame = frames_1[_9];
                                frame.value = Number(frame.value.toFixed(2));
                            }
                            cleanFrame(frames_8);
                            // if (frames.length === 1) { // TODO
                            //     const frame = frames[0];
                            //     if (frame.value === 1.0) {
                            //         frames.length = 0;
                            //     }
                            // }
                            break;
                        }
                        case dbft.TimelineType.BoneTranslate:
                        case dbft.TimelineType.BoneRotate: {
                            var frames_9 = timeline.frame;
                            for (var _10 = 0, frames_2 = frames_9; _10 < frames_2.length; _10++) {
                                var frame = frames_2[_10];
                                frame.x = Number(frame.x.toFixed(2));
                                frame.y = Number(frame.y.toFixed(2));
                            }
                            cleanFrame(frames_9);
                            if (frames_9.length === 1) {
                                var frame = frames_9[0];
                                if (frame.x === 0.0 && frame.y === 0.0) {
                                    frames_9.length = 0;
                                }
                            }
                            break;
                        }
                        case dbft.TimelineType.IKConstraint:
                        case dbft.TimelineType.BoneScale: {
                            var frames_10 = timeline.frame;
                            for (var _11 = 0, frames_3 = frames_10; _11 < frames_3.length; _11++) {
                                var frame = frames_3[_11];
                                frame.x = Number(frame.x.toFixed(4));
                                frame.y = Number(frame.y.toFixed(4));
                            }
                            cleanFrame(frames_10);
                            if (frames_10.length === 1) {
                                var frame = frames_10[0];
                                if (frame.x === 1.0 && frame.y === 1.0) {
                                    frames_10.length = 0;
                                }
                            }
                            break;
                        }
                        case dbft.TimelineType.Surface:
                        case dbft.TimelineType.SlotDeform: {
                            var frames_11 = timeline.frame;
                            for (var _12 = 0, frames_4 = frames_11; _12 < frames_4.length; _12++) {
                                var frame = frames_4[_12];
                                frame.offset += formatDeform(frame.value);
                            }
                            cleanFrame(frames_11);
                            if (frames_11.length === 1) {
                                var frame = frames_11[0];
                                if (frame.value.length === 0) {
                                    frames_11.length = 0;
                                }
                            }
                            break;
                        }
                        case dbft.TimelineType.AnimationProgress:
                        case dbft.TimelineType.AnimationWeight:
                        case dbft.TimelineType.AnimationParameter: {
                            if (timeline instanceof dbft.AnimationTimeline) {
                                timeline.x = Number(timeline.x.toFixed(4));
                                timeline.y = Number(timeline.y.toFixed(4));
                            }
                            if (timeline.type === dbft.TimelineType.AnimationParameter) {
                                var frames_12 = timeline.frame;
                                for (var _13 = 0, frames_5 = frames_12; _13 < frames_5.length; _13++) {
                                    var frame = frames_5[_13];
                                    frame.x = Number(frame.x.toFixed(4));
                                    frame.y = Number(frame.y.toFixed(4));
                                }
                                cleanFrame(frames_12);
                            }
                            else {
                                var frames_13 = timeline.frame;
                                for (var _14 = 0, frames_6 = frames_13; _14 < frames_6.length; _14++) {
                                    var frame = frames_6[_14];
                                    frame.value = Number(frame.value.toFixed(4));
                                }
                                cleanFrame(frames_13);
                                cleanFrameB(frames_13);
                            }
                            break;
                        }
                        case dbft.TimelineType.SlotColor: {
                            var slot = armature.getSlot(timeline.name);
                            var frames_14 = timeline.frame;
                            if (slot) {
                                for (var _15 = 0, frames_7 = frames_14; _15 < frames_7.length; _15++) {
                                    var frame = frames_7[_15];
                                    frame.value.toFixed();
                                }
                                cleanFrame(frames_14);
                                if (frames_14.length === 1) {
                                    var frame = frames_14[0];
                                    if (frame.value.equal(slot.color)) {
                                        frames_14.length = 0;
                                    }
                                }
                            }
                            else {
                                frames_14.length = 0;
                            }
                            break;
                        }
                    }
                    if (timeline.frame.length > 0) {
                        continue;
                    }
                    animation.timeline.splice(i, 1);
                    i--;
                    l--;
                }
            }
        }
        for (var _16 = 0, _17 = data.textureAtlas; _16 < _17.length; _16++) {
            var textureAtlas = _17[_16];
            formatTextureAtlas(textureAtlas);
        }
    }
    if (textureAtlases) {
        for (var _18 = 0, textureAtlases_1 = textureAtlases; _18 < textureAtlases_1.length; _18++) {
            var textureAtlas = textureAtlases_1[_18];
            formatTextureAtlas(textureAtlas);
        }
    }
}
exports.default = default_1;
function formatDeform(deform) {
    for (var i = 0, l = deform.length; i < l; ++i) {
        deform[i] = Number(deform[i].toFixed(2));
    }
    var begin = 0;
    while (deform[begin] === 0.0) {
        begin++;
        if (begin === deform.length - 1) {
            break;
        }
    }
    var end = deform.length;
    while (end > begin && deform[end - 1] === 0.0) {
        end--;
    }
    var index = 0;
    for (var i = begin; i < end; ++i) {
        deform[index++] = deform[i];
    }
    deform.length = end - begin;
    return begin;
}
function formatTextureAtlas(textureAtlas) {
    for (var _i = 0, _a = textureAtlas.SubTexture; _i < _a.length; _i++) {
        var subTexture = _a[_i];
        if (textureAtlas.width > 0 && subTexture.x + subTexture.width > textureAtlas.width) {
            subTexture.width = textureAtlas.width - subTexture.x;
        }
        if (textureAtlas.height > 0 && subTexture.y + subTexture.height > textureAtlas.height) {
            subTexture.height = textureAtlas.height - subTexture.x;
        }
        if (subTexture.x < 0) {
            subTexture.x = 0;
        }
        if (subTexture.y < 0) {
            subTexture.y = 0;
        }
        if (subTexture.width < 0) {
            subTexture.width = 0;
        }
        if (subTexture.height < 0) {
            subTexture.height = 0;
        }
        if ((subTexture.frameWidth === subTexture.width && subTexture.frameHeight === subTexture.height) ||
            (subTexture.frameWidth === subTexture.height && subTexture.frameHeight === subTexture.width)) {
            subTexture.frameWidth = 0;
            subTexture.frameHeight = 0;
        }
        if (subTexture.frameWidth < 0) {
            subTexture.frameWidth = 0;
        }
        if (subTexture.frameHeight < 0) {
            subTexture.frameHeight = 0;
        }
    }
}
function cleanFrame(frames) {
    var prevFrame = null;
    for (var i = 0, l = frames.length; i < l; ++i) {
        var frame = frames[i];
        if (prevFrame && prevFrame.equal(frame) &&
            (i === l - 1 || !(frame instanceof dbft.TweenFrame) || frame.equal(frames[i + 1]))) {
            prevFrame.duration += frame.duration;
            if (i === l - 1 && prevFrame instanceof dbft.TweenFrame) {
                prevFrame.removeTween();
            }
            frames.splice(i, 1);
            i--;
            l--;
        }
        else {
            prevFrame = frame;
        }
    }
}
function cleanFrameB(frames) {
    var prevFrameA = null;
    var prevFrameB = null;
    for (var i = 0, l = frames.length; i < l; ++i) {
        var frame = frames[i];
        if (i !== l - 1 &&
            prevFrameA && prevFrameB &&
            prevFrameA.getTweenEnabled() && prevFrameB.getTweenEnabled() &&
            equalB(prevFrameA, prevFrameB, frame)) {
            prevFrameA.duration += prevFrameB.duration;
            frames.splice(i - 1, 1);
            i--;
            l--;
            prevFrameB = frame;
        }
        else {
            prevFrameA = prevFrameB;
            prevFrameB = frame;
        }
    }
}
function equalB(a, b, c) {
    return Math.abs((b.value - a.value) / a.duration - (c.value - b.value) / b.duration) < 0.01;
}
