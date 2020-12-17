"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var object = require("../common/object");
var geom = require("../format/geom");
var dbft = require("../format/dragonBonesFormat");
var intArray = [];
var floatArray = [];
var timelineArray = [];
var frameArray = [];
var frameIntArray = [];
var frameFloatArray = [];
var colorArray = [];
var colors = {};
var currentArmature;
var currentAnimationBinary;
/**
 * Convert DragonBones format to binary.
 */
function default_1(data) {
    // Clean helper.
    intArray.length = 0;
    floatArray.length = 0;
    timelineArray.length = 0;
    frameArray.length = 0;
    frameIntArray.length = 0;
    frameFloatArray.length = 0;
    colorArray.length = 0;
    for (var k in colors) {
        delete colors[k];
    }
    var binaryDatas = new Array();
    for (var _i = 0, _a = data.armature; _i < _a.length; _i++) {
        currentArmature = _a[_i];
        for (var _b = 0, _c = currentArmature.bone; _b < _c.length; _b++) {
            var bone = _c[_b];
            if (bone instanceof dbft.Surface) {
                bone.offset = createVertices(bone);
                binaryDatas.push(bone);
            }
        }
        for (var _d = 0, _e = currentArmature.skin; _d < _e.length; _d++) {
            var skin = _e[_d];
            for (var _f = 0, _g = skin.slot; _f < _g.length; _f++) {
                var slot = _g[_f];
                for (var _h = 0, _j = slot.display; _h < _j.length; _h++) {
                    var display = _j[_h];
                    if (display instanceof dbft.MeshDisplay) {
                        display.offset = createMesh(display);
                        binaryDatas.push(display);
                    }
                    else if (display instanceof dbft.PathDisplay) {
                        display.offset = createVertices(display);
                        binaryDatas.push(display);
                    }
                    else if (display instanceof dbft.PolygonBoundingBoxDisplay) {
                        display.offset = createVertices(display);
                        binaryDatas.push(display);
                    }
                }
            }
        }
        var animationBinarys = new Array();
        for (var _k = 0, _l = currentArmature.animation; _k < _l.length; _k++) {
            var animation = _l[_k];
            currentAnimationBinary = new dbft.AnimationBinary();
            currentAnimationBinary.type = animation.type;
            currentAnimationBinary.blendType = animation.blendType;
            currentAnimationBinary.duration = animation.duration;
            currentAnimationBinary.playTimes = animation.playTimes;
            currentAnimationBinary.scale = animation.scale;
            currentAnimationBinary.fadeInTime = animation.fadeInTime;
            currentAnimationBinary.name = animation.name;
            currentAnimationBinary.offset[dbft.OffsetOrder.FrameInt] = frameIntArray.length;
            currentAnimationBinary.offset[dbft.OffsetOrder.FrameFloat] = frameFloatArray.length;
            currentAnimationBinary.offset[dbft.OffsetOrder.Frame] = frameArray.length;
            animationBinarys.push(currentAnimationBinary);
            if (animation.frame.length > 0) {
                currentAnimationBinary.action = createTimeline(animation, animation.frame, 0 /* Step */, 0, createActionFrame);
            }
            if (animation.zOrder) {
                currentAnimationBinary.zOrder = createTimeline(animation.zOrder, animation.zOrder.frame, 0 /* Step */, 0, createZOrderFrame);
            }
            for (var _m = 0, _o = animation.bone; _m < _o.length; _m++) {
                var timeline = _o[_m];
                currentAnimationBinary.bone[timeline.name] = createBoneTimeline(timeline);
            }
            for (var _p = 0, _q = animation.slot; _p < _q.length; _p++) {
                var timeline = _q[_p];
                if (!(timeline.name in currentAnimationBinary.slot)) {
                    currentAnimationBinary.slot[timeline.name] = [];
                }
                var timelines = currentAnimationBinary.slot[timeline.name];
                if (timeline.displayFrame.length > 0) {
                    timelines.push(dbft.TimelineType.SlotDisplay);
                    timelines.push(createTimeline(timeline, timeline.displayFrame, 0 /* Step */, 0, function (frame, frameStart) {
                        var offset = createFrame(frame, frameStart);
                        frameArray.push(frame.value);
                        return offset;
                    }));
                }
                if (timeline.colorFrame.length > 0) {
                    timelines.push(dbft.TimelineType.SlotColor);
                    timelines.push(createTimeline(timeline, timeline.colorFrame, 1 /* Int */, 1, function (frame, frameStart) {
                        var offset = createTweenFrame(frame, frameStart);
                        // Color.
                        var colorString = frame.value.toString();
                        if (!(colorString in colors)) {
                            colors[colorString] = createColor(frame.value);
                        }
                        frameIntArray.push(colors[colorString]);
                        return offset;
                    }));
                }
            }
            for (var _r = 0, _s = animation.ffd; _r < _s.length; _r++) {
                var timeline = _s[_r];
                if (!(timeline.slot in currentAnimationBinary.slot)) {
                    currentAnimationBinary.slot[timeline.slot] = [];
                }
                var timelines = currentAnimationBinary.slot[timeline.slot];
                timelines.push(createDeformTimeline(timeline));
            }
            for (var _t = 0, _u = animation.ik; _t < _u.length; _t++) {
                var timeline = _u[_t];
                if (!(timeline.name in currentAnimationBinary.constraint)) {
                    currentAnimationBinary.constraint[timeline.name] = [];
                }
                var timelines = currentAnimationBinary.constraint[timeline.name];
                if (timeline.frame.length > 0) {
                    timelines.push(dbft.TimelineType.IKConstraint);
                    timelines.push(createTimeline(timeline, timeline.frame, 1 /* Int */, 2, function (frame, frameStart) {
                        var offset = createTweenFrame(frame, frameStart);
                        frameIntArray.push(frame.bendPositive ? 1 : 0); // TODO 100
                        frameIntArray.push(Math.round(frame.weight * 100.0));
                        return offset;
                    }));
                }
                currentAnimationBinary.constraint[timeline.name] = timelines;
            }
            for (var _v = 0, _w = animation.timeline; _v < _w.length; _v++) {
                var timeline = _w[_v];
                timeline.offset = createTypeTimeline(timeline);
                if (timeline.offset >= 0) {
                    currentAnimationBinary.timeline.push(timeline);
                    timeline.clearToBinary();
                }
            }
        }
        currentArmature.animation.length = 0;
        for (var _x = 0, animationBinarys_1 = animationBinarys; _x < animationBinarys_1.length; _x++) {
            var animation = animationBinarys_1[_x];
            currentArmature.animation.push(animation);
        }
    }
    // Clear binary data. 
    for (var _y = 0, binaryDatas_1 = binaryDatas; _y < binaryDatas_1.length; _y++) {
        var data_1 = binaryDatas_1[_y];
        data_1.clearToBinary();
    }
    // Align.
    if ((intArray.length % Int16Array.BYTES_PER_ELEMENT) !== 0) {
        intArray.push(0);
    }
    if ((frameIntArray.length % Int16Array.BYTES_PER_ELEMENT) !== 0) {
        frameIntArray.push(0);
    }
    if ((frameArray.length % Int16Array.BYTES_PER_ELEMENT) !== 0) {
        frameArray.push(0);
    }
    if ((timelineArray.length % Uint16Array.BYTES_PER_ELEMENT) !== 0) {
        timelineArray.push(0);
    }
    if ((colorArray.length % Int16Array.BYTES_PER_ELEMENT) !== 0) {
        colorArray.push(0);
    }
    // Offset.
    var byteLength = 0;
    var byteOffset = 0;
    data.offset[0] = 0;
    byteLength += data.offset[1] = intArray.length * Int16Array.BYTES_PER_ELEMENT;
    data.offset[2] = data.offset[0] + data.offset[1];
    byteLength += data.offset[3] = floatArray.length * Float32Array.BYTES_PER_ELEMENT;
    data.offset[4] = data.offset[2] + data.offset[3];
    byteLength += data.offset[5] = frameIntArray.length * Int16Array.BYTES_PER_ELEMENT;
    data.offset[6] = data.offset[4] + data.offset[5];
    byteLength += data.offset[7] = frameFloatArray.length * Float32Array.BYTES_PER_ELEMENT;
    data.offset[8] = data.offset[6] + data.offset[7];
    byteLength += data.offset[9] = frameArray.length * Int16Array.BYTES_PER_ELEMENT;
    data.offset[10] = data.offset[8] + data.offset[9];
    byteLength += data.offset[11] = timelineArray.length * Uint16Array.BYTES_PER_ELEMENT;
    data.offset[12] = data.offset[10] + data.offset[11];
    byteLength += data.offset[13] = colorArray.length * Int16Array.BYTES_PER_ELEMENT;
    object.compress(data, dbft.compressConfig);
    //
    var jsonString = JSON.stringify(data);
    var jsonArray = stringToUTF8Array(jsonString);
    modifyBytesPosition(jsonArray, " ".charCodeAt(0));
    //
    var buffer = new ArrayBuffer(4 + 4 + 4 + jsonArray.length + byteLength);
    var dataView = new DataView(buffer);
    // Write DragonBones format tag.
    dataView.setUint8(byteOffset++, "D".charCodeAt(0));
    dataView.setUint8(byteOffset++, "B".charCodeAt(0));
    dataView.setUint8(byteOffset++, "D".charCodeAt(0));
    dataView.setUint8(byteOffset++, "T".charCodeAt(0));
    // Write version.
    dataView.setUint8(byteOffset++, 0);
    dataView.setUint8(byteOffset++, 0);
    dataView.setUint8(byteOffset++, 0);
    dataView.setUint8(byteOffset++, 3);
    // Write json length.
    dataView.setUint32(byteOffset, jsonArray.length, true);
    byteOffset += 4;
    for (var _z = 0, jsonArray_1 = jsonArray; _z < jsonArray_1.length; _z++) {
        var value = jsonArray_1[_z];
        dataView.setUint8(byteOffset, value);
        byteOffset++;
    }
    for (var _0 = 0, intArray_1 = intArray; _0 < intArray_1.length; _0++) {
        var value = intArray_1[_0];
        dataView.setInt16(byteOffset, value, true);
        byteOffset += 2;
    }
    for (var _1 = 0, floatArray_1 = floatArray; _1 < floatArray_1.length; _1++) {
        var value = floatArray_1[_1];
        dataView.setFloat32(byteOffset, value, true);
        byteOffset += 4;
    }
    for (var _2 = 0, frameIntArray_1 = frameIntArray; _2 < frameIntArray_1.length; _2++) {
        var value = frameIntArray_1[_2];
        dataView.setInt16(byteOffset, value, true);
        byteOffset += 2;
    }
    for (var _3 = 0, frameFloatArray_1 = frameFloatArray; _3 < frameFloatArray_1.length; _3++) {
        var value = frameFloatArray_1[_3];
        dataView.setFloat32(byteOffset, value, true);
        byteOffset += 4;
    }
    for (var _4 = 0, frameArray_1 = frameArray; _4 < frameArray_1.length; _4++) {
        var value = frameArray_1[_4];
        dataView.setInt16(byteOffset, value, true);
        byteOffset += 2;
    }
    for (var _5 = 0, timelineArray_1 = timelineArray; _5 < timelineArray_1.length; _5++) {
        var value = timelineArray_1[_5];
        dataView.setUint16(byteOffset, value, true);
        byteOffset += 2;
    }
    for (var _6 = 0, colorArray_1 = colorArray; _6 < colorArray_1.length; _6++) {
        var value = colorArray_1[_6];
        dataView.setInt16(byteOffset, value, true);
        byteOffset += 2;
    }
    return buffer;
}
exports.default = default_1;
function createColor(value) {
    var offset = intArray.length;
    intArray.length += 8;
    intArray[offset + 0] = value.aM;
    intArray[offset + 1] = value.rM;
    intArray[offset + 2] = value.gM;
    intArray[offset + 3] = value.bM;
    intArray[offset + 4] = value.aO;
    intArray[offset + 5] = value.rO;
    intArray[offset + 6] = value.gO;
    intArray[offset + 7] = value.bO;
    if (offset >= 65536) {
        // TODO
    }
    return offset;
}
function createVertices(value) {
    var vertexCount = value.vertexCount;
    var offset = intArray.length;
    var vertexOffset = floatArray.length;
    intArray.length += 1 + 1 + 1 + 1;
    intArray[offset + dbft.BinaryOffset.GeometryVertexCount] = vertexCount;
    intArray[offset + dbft.BinaryOffset.GeometryTriangleCount] = 0;
    intArray[offset + dbft.BinaryOffset.GeometryFloatOffset] = vertexOffset;
    if (value.weights.length === 0) {
        floatArray.length += value.vertices.length;
        for (var i = 0, l = value.vertices.length; i < l; i++) {
            floatArray[vertexOffset + i] = value.vertices[i];
        }
        intArray[offset + dbft.BinaryOffset.GeometryWeightOffset] = -1;
    }
    else {
        var weightBoneCount = value.bones.length;
        var weightCount = Math.floor(value.weights.length - vertexCount) / 2; // uint
        var weightOffset = intArray.length;
        var floatOffset = floatArray.length;
        intArray.length += 1 + 1 + weightBoneCount;
        intArray[weightOffset + dbft.BinaryOffset.WeigthBoneCount] = weightBoneCount;
        intArray[weightOffset + dbft.BinaryOffset.WeigthFloatOffset] = floatOffset;
        for (var i = 0; i < weightBoneCount; i++) {
            intArray[weightOffset + dbft.BinaryOffset.WeigthBoneIndices + i] = value.bones[i];
        }
        floatArray.length += weightCount * 3;
        for (var i = 0, iV = 0, iW = 0, iB = weightOffset + dbft.BinaryOffset.WeigthBoneIndices + weightBoneCount, iF = floatOffset; i < weightCount; i++) {
            var boneCount = value.weights[iW++];
            intArray[iB++] = boneCount;
            for (var j = 0; j < boneCount; j++) {
                var boneIndex = value.weights[iW++];
                var boneWeight = value.weights[iW++];
                intArray[iB++] = value.bones.indexOf(boneIndex);
                floatArray[iF++] = boneWeight;
                floatArray[iF++] = value.vertices[iV++];
                floatArray[iF++] = value.vertices[iV++];
            }
        }
        intArray[offset + dbft.BinaryOffset.GeometryWeightOffset] = weightOffset;
    }
    return offset;
}
function createMesh(value) {
    var vertexCount = Math.floor(value.vertices.length / 2); // uint
    var triangleCount = Math.floor(value.triangles.length / 3); // uint
    var offset = intArray.length;
    var vertexOffset = floatArray.length;
    var uvOffset = vertexOffset + vertexCount * 2;
    intArray.length += 1 + 1 + 1 + 1 + triangleCount * 3;
    intArray[offset + dbft.BinaryOffset.GeometryVertexCount] = vertexCount;
    intArray[offset + dbft.BinaryOffset.GeometryTriangleCount] = triangleCount;
    intArray[offset + dbft.BinaryOffset.GeometryFloatOffset] = vertexOffset;
    for (var i = 0, l = triangleCount * 3; i < l; ++i) {
        intArray[offset + dbft.BinaryOffset.GeometryVertexIndices + i] = value.triangles[i];
    }
    floatArray.length += vertexCount * 2 + vertexCount * 2;
    for (var i = 0, l = vertexCount * 2; i < l; ++i) {
        floatArray[vertexOffset + i] = value.vertices[i];
        floatArray[uvOffset + i] = value.uvs[i];
    }
    if (value.weights.length > 0) {
        var weightOffset = intArray.length;
        var floatOffset = floatArray.length;
        value._boneCount = Math.floor(value.bonePose.length / 7);
        value._weightCount = Math.floor((value.weights.length - vertexCount) / 2);
        intArray.length += 1 + 1 + value._boneCount + vertexCount + value._weightCount;
        intArray[weightOffset + dbft.BinaryOffset.WeigthBoneCount] = value._boneCount;
        intArray[weightOffset + dbft.BinaryOffset.WeigthFloatOffset] = floatOffset;
        for (var i = 0; i < value._boneCount; ++i) {
            intArray[weightOffset + dbft.BinaryOffset.WeigthBoneIndices + i] = value.bonePose[i * 7];
        }
        floatArray.length += value._weightCount * 3;
        geom.helpMatrixA.copyFromArray(value.slotPose, 0);
        for (var i = 0, iW = 0, iB = weightOffset + dbft.BinaryOffset.WeigthBoneIndices + value._boneCount, iV = floatOffset; i < vertexCount; ++i) {
            var iD = i * 2;
            var vertexBoneCount = intArray[iB++] = value.weights[iW++]; // uint
            var x = floatArray[vertexOffset + iD];
            var y = floatArray[vertexOffset + iD + 1];
            geom.helpMatrixA.transformPoint(x, y, geom.helpPointA);
            x = geom.helpPointA.x;
            y = geom.helpPointA.y;
            for (var j = 0; j < vertexBoneCount; ++j) {
                var rawBoneIndex = value.weights[iW++]; // uint
                var bonePoseOffset = value.getBonePoseOffset(rawBoneIndex);
                geom.helpMatrixB.copyFromArray(value.bonePose, bonePoseOffset + 1);
                geom.helpMatrixB.invert();
                geom.helpMatrixB.transformPoint(x, y, geom.helpPointA);
                intArray[iB++] = bonePoseOffset / 7; // 
                floatArray[iV++] = value.weights[iW++];
                floatArray[iV++] = geom.helpPointA.x;
                floatArray[iV++] = geom.helpPointA.y;
            }
        }
        intArray[offset + dbft.BinaryOffset.GeometryWeightOffset] = weightOffset;
    }
    else {
        intArray[offset + dbft.BinaryOffset.GeometryWeightOffset] = -1;
    }
    return offset;
}
function createTimeline(value, frames, frameValueType, frameValueCount, createFrame) {
    var offset = timelineArray.length;
    timelineArray.length += 1 + 1 + 1 + 1 + 1;
    if (value instanceof dbft.Animation) {
        timelineArray[offset + dbft.BinaryOffset.TimelineScale] = 100;
        timelineArray[offset + dbft.BinaryOffset.TimelineOffset] = 0;
    }
    else {
        timelineArray[offset + dbft.BinaryOffset.TimelineScale] = Math.round(value.scale * 100.0);
        timelineArray[offset + dbft.BinaryOffset.TimelineOffset] = Math.round(value.offset * 100.0);
    }
    timelineArray[offset + dbft.BinaryOffset.TimelineFrameValueCount] = frameValueCount;
    switch (frameValueType) {
        case 0 /* Step */:
            timelineArray[offset + dbft.BinaryOffset.TimelineFrameValueOffset] = 0;
            break;
        case 1 /* Int */:
            timelineArray[offset + dbft.BinaryOffset.TimelineFrameValueOffset] = frameIntArray.length - currentAnimationBinary.offset[dbft.OffsetOrder.FrameInt];
            break;
        case 2 /* Float */:
            timelineArray[offset + dbft.BinaryOffset.TimelineFrameValueOffset] = frameFloatArray.length - currentAnimationBinary.offset[dbft.OffsetOrder.FrameFloat];
            break;
    }
    var frameStart = 0;
    var keyFrameCount = 0;
    for (var i = 0, l = frames.length; i < l; ++i) { // Frame offsets.
        var frame = frames[i];
        var frameOffset = createFrame(frame, frameStart);
        frameStart += frame.duration;
        if (frameOffset >= 0) {
            timelineArray.push(frameOffset - currentAnimationBinary.offset[dbft.OffsetOrder.Frame]);
            keyFrameCount++;
        }
    }
    timelineArray[offset + dbft.BinaryOffset.TimelineKeyFrameCount] = keyFrameCount;
    return offset;
}
function createTypeTimeline(timeline) {
    var valueScale = 1.0;
    switch (timeline.type) {
        case dbft.TimelineType.SlotDisplay:
        // TODO
        case dbft.TimelineType.SlotZIndex:
            return createTimeline(timeline, timeline.frame, 1 /* Int */, 1, function (frame, frameStart) {
                var offset = createTweenFrame(frame, frameStart);
                frameIntArray.push(frame.value);
                return offset;
            });
        case dbft.TimelineType.BoneAlpha:
        case dbft.TimelineType.SlotAlpha:
        case dbft.TimelineType.AnimationProgress:
        case dbft.TimelineType.AnimationWeight:
            valueScale = timeline.type === dbft.TimelineType.BoneAlpha || timeline.type === dbft.TimelineType.SlotAlpha ? 100.0 : 10000.0;
            return createTimeline(timeline, timeline.frame, 1 /* Int */, 1, function (frame, frameStart) {
                var offset = createTweenFrame(frame, frameStart);
                frameIntArray.push(Math.round(frame.value * valueScale));
                return offset;
            });
        case dbft.TimelineType.BoneTranslate:
        case dbft.TimelineType.BoneRotate:
        case dbft.TimelineType.BoneScale:
            valueScale = timeline.type === dbft.TimelineType.BoneRotate ? geom.DEG_RAD : 1.0;
            return createTimeline(timeline, timeline.frame, 2 /* Float */, 2, function (frame, frameStart) {
                var offset = createTweenFrame(frame, frameStart);
                frameFloatArray.push(frame.x * valueScale);
                frameFloatArray.push(frame.y * valueScale);
                return offset;
            });
        case dbft.TimelineType.IKConstraint:
        case dbft.TimelineType.AnimationParameter:
            valueScale = timeline.type === dbft.TimelineType.IKConstraint ? 100.0 : 10000.0;
            return createTimeline(timeline, timeline.frame, 1 /* Int */, 2, function (frame, frameStart) {
                var offset = createTweenFrame(frame, frameStart);
                frameIntArray.push(Math.round(frame.x * valueScale));
                frameIntArray.push(Math.round(frame.y * valueScale));
                return offset;
            });
        case dbft.TimelineType.ZOrder:
            // TODO
            break;
        case dbft.TimelineType.Surface:
            return createSurfaceTimeline(timeline);
        case dbft.TimelineType.SlotDeform:
            return createDeformTimeline(timeline);
        case dbft.TimelineType.SlotColor:
            return createTimeline(timeline, timeline.frame, 1 /* Int */, 1, function (frame, frameStart) {
                var offset = createTweenFrame(frame, frameStart);
                // Color.
                var colorString = frame.value.toString();
                if (!(colorString in colors)) {
                    colors[colorString] = createColor(frame.value);
                }
                frameIntArray.push(colors[colorString]);
                return offset;
            });
    }
    return -1;
}
function createFrame(value, frameStart) {
    // tslint:disable-next-line:no-unused-expression
    value;
    var offset = frameArray.length;
    frameArray.push(frameStart);
    return offset;
}
function createTweenFrame(frame, frameStart) {
    var frameOffset = createFrame(frame, frameStart);
    if (frame.duration > 0) {
        if (frame.curve.length > 0) {
            var isOmited = (frame.curve.length % 3) === 1;
            var sampleCount = frame.duration + (isOmited ? 1 : 3);
            var samples = new Array(sampleCount);
            dbft.samplingEasingCurve(frame.curve, samples, isOmited);
            frameArray.length += 1 + 1 + samples.length;
            frameArray[frameOffset + dbft.BinaryOffset.FrameTweenType] = dbft.TweenType.Curve;
            frameArray[frameOffset + dbft.BinaryOffset.FrameTweenEasingOrCurveSampleCount] = isOmited ? sampleCount : -sampleCount; // Notice: If not omit data, the count is negative number.
            for (var i = 0; i < sampleCount; ++i) {
                frameArray[frameOffset + dbft.BinaryOffset.FrameCurveSamples + i] = Math.round(samples[i] * 10000.0); // Min ~ Max [-3.00~3.00]
            }
        }
        else {
            if (isNaN(frame.tweenEasing)) {
                frameArray.length += 1;
                frameArray[frameOffset + dbft.BinaryOffset.FrameTweenType] = dbft.TweenType.None;
            }
            else if (frame.tweenEasing === 0.0) {
                frameArray.length += 1;
                frameArray[frameOffset + dbft.BinaryOffset.FrameTweenType] = dbft.TweenType.Line;
            }
            else if (frame.tweenEasing < 0.0) {
                frameArray.length += 1 + 1;
                frameArray[frameOffset + dbft.BinaryOffset.FrameTweenType] = dbft.TweenType.QuadIn;
                frameArray[frameOffset + dbft.BinaryOffset.FrameTweenEasingOrCurveSampleCount] = Math.round(-frame.tweenEasing * 100.0);
            }
            else if (frame.tweenEasing <= 1.0) {
                frameArray.length += 1 + 1;
                frameArray[frameOffset + dbft.BinaryOffset.FrameTweenType] = dbft.TweenType.QuadOut;
                frameArray[frameOffset + dbft.BinaryOffset.FrameTweenEasingOrCurveSampleCount] = Math.round(frame.tweenEasing * 100.0);
            }
            else {
                frameArray.length += 1 + 1;
                frameArray[frameOffset + dbft.BinaryOffset.FrameTweenType] = dbft.TweenType.QuadInOut;
                frameArray[frameOffset + dbft.BinaryOffset.FrameTweenEasingOrCurveSampleCount] = Math.round(frame.tweenEasing * 100.0 - 100.0);
            }
        }
    }
    else {
        frameArray.length += 1;
        frameArray[frameOffset + dbft.BinaryOffset.FrameTweenType] = dbft.TweenType.None;
    }
    return frameOffset;
}
function createActionFrame(frame, frameStart) {
    var frameOffset = createFrame(frame, frameStart);
    var actionCount = frame.actions.length;
    frameArray.length += 1 + 1 + actionCount;
    frameArray[frameOffset + dbft.BinaryOffset.FramePosition] = frameStart;
    frameArray[frameOffset + dbft.BinaryOffset.ActionFrameActionCount] = actionCount; // Action count.
    for (var i = 0; i < actionCount; ++i) { // Action offsets.
        var action = frame.actions[i];
        frameArray[frameOffset + dbft.BinaryOffset.ActionFrameActionIndices + i] = currentArmature.actions.length;
        currentArmature.actions.push(action);
    }
    frame.actions.length = 0;
    return frameOffset;
}
function createZOrderFrame(frame, frameStart) {
    var frameOffset = createFrame(frame, frameStart);
    if (frame.zOrder.length > 0) {
        var slotCount = currentArmature.slot.length;
        var unchanged = new Array(slotCount - frame.zOrder.length / 2);
        var zOrders = new Array(slotCount);
        for (var i_1 = 0; i_1 < unchanged.length; ++i_1) {
            unchanged[i_1] = 0;
        }
        for (var i_2 = 0; i_2 < slotCount; ++i_2) {
            zOrders[i_2] = -1;
        }
        var originalIndex = 0;
        var unchangedIndex = 0;
        for (var i_3 = 0, l = frame.zOrder.length; i_3 < l; i_3 += 2) {
            var slotIndex = frame.zOrder[i_3];
            var zOrderOffset = frame.zOrder[i_3 + 1];
            while (originalIndex !== slotIndex) {
                unchanged[unchangedIndex++] = originalIndex++;
            }
            zOrders[originalIndex + zOrderOffset] = originalIndex++;
        }
        while (originalIndex < slotCount) {
            unchanged[unchangedIndex++] = originalIndex++;
        }
        frameArray.length += 1 + slotCount;
        frameArray[frameOffset + 1] = slotCount;
        var i = slotCount;
        while (i--) {
            if (zOrders[i] === -1) {
                frameArray[frameOffset + 2 + i] = unchanged[--unchangedIndex] || 0;
            }
            else {
                frameArray[frameOffset + 2 + i] = zOrders[i] || 0;
            }
        }
    }
    else {
        frameArray.length += 1;
        frameArray[frameOffset + 1] = 0;
    }
    return frameOffset;
}
function createBoneTimeline(timeline) {
    var timelines = new Array();
    if (timeline.translateFrame.length > 0) {
        timelines.push(dbft.TimelineType.BoneTranslate);
        timelines.push(createTimeline(timeline, timeline.translateFrame, 2 /* Float */, 2, function (frame, frameStart) {
            var offset = createTweenFrame(frame, frameStart);
            frameFloatArray.push(frame.x);
            frameFloatArray.push(frame.y);
            return offset;
        }));
    }
    if (timeline.rotateFrame.length > 0) {
        var clockwise_1 = 0;
        var prevRotate_1 = 0.0;
        timelines.push(dbft.TimelineType.BoneRotate);
        timelines.push(createTimeline(timeline, timeline.rotateFrame, 2 /* Float */, 2, function (frame, frameStart) {
            var offset = createTweenFrame(frame, frameStart);
            var rotate = frame.rotate;
            if (frameStart !== 0) {
                if (clockwise_1 === 0) {
                    rotate = prevRotate_1 + geom.normalizeDegree(rotate - prevRotate_1);
                }
                else {
                    if (clockwise_1 > 0 ? rotate >= prevRotate_1 : rotate <= prevRotate_1) {
                        clockwise_1 = clockwise_1 > 0 ? clockwise_1 - 1 : clockwise_1 + 1;
                    }
                    rotate = prevRotate_1 + rotate - prevRotate_1 + geom.PI_D * clockwise_1 * geom.RAD_DEG;
                }
            }
            clockwise_1 = frame.clockwise;
            prevRotate_1 = rotate;
            frameFloatArray.push(rotate * geom.DEG_RAD);
            frameFloatArray.push(geom.normalizeDegree(frame.skew) * geom.DEG_RAD);
            return offset;
        }));
    }
    if (timeline.scaleFrame.length > 0) {
        timelines.push(dbft.TimelineType.BoneScale);
        timelines.push(createTimeline(timeline, timeline.scaleFrame, 2 /* Float */, 2, function (frame, frameStart) {
            var offset = createTweenFrame(frame, frameStart);
            frameFloatArray.push(frame.x);
            frameFloatArray.push(frame.y);
            return offset;
        }));
    }
    return timelines;
}
function createSurfaceTimeline(timeline) {
    var surface = currentArmature.getBone(timeline.name);
    var vertexCount = surface.vertices.length / 2;
    var frames = timeline.frame;
    for (var _i = 0, frames_1 = frames; _i < frames_1.length; _i++) {
        var frame = frames_1[_i];
        var x = 0.0;
        var y = 0.0;
        var vertices = new Array();
        for (var i = 0; i < vertexCount * 2; i += 2) {
            if (frame.value.length === 0) {
                x = 0.0;
                y = 0.0;
            }
            else {
                if (i < frame.offset || i - frame.offset >= frame.value.length) {
                    x = 0.0;
                }
                else {
                    x = frame.value[i - frame.offset];
                }
                if (i + 1 < frame.offset || i + 1 - frame.offset >= frame.value.length) {
                    y = 0.0;
                }
                else {
                    y = frame.value[i + 1 - frame.offset];
                }
            }
            vertices.push(x, y);
        }
        frame.value.length = 0;
        for (var _a = 0, vertices_1 = vertices; _a < vertices_1.length; _a++) {
            var value = vertices_1[_a];
            frame.value.push(value);
        }
    }
    var firstValues = frames[0].value;
    var count = firstValues.length;
    var completedBegin = false;
    var completedEnd = false;
    var begin = 0;
    var end = count - 1;
    while (!completedBegin || !completedEnd) {
        if (!completedBegin) {
            for (var _b = 0, frames_2 = frames; _b < frames_2.length; _b++) {
                var frame = frames_2[_b];
                if (frame.value[begin] !== firstValues[begin]) {
                    completedBegin = true;
                    break;
                }
            }
            if (begin === count - 1) {
                completedBegin = true;
            }
            else if (!completedBegin) {
                begin++;
            }
        }
        if (completedBegin && !completedEnd) {
            for (var _c = 0, frames_3 = frames; _c < frames_3.length; _c++) {
                var frame = frames_3[_c];
                if (frame.value[end] !== firstValues[end]) {
                    completedEnd = true;
                    break;
                }
            }
            if (end === begin) {
                completedEnd = true;
            }
            else if (!completedEnd) {
                end--;
            }
        }
    }
    var frameIntOffset = frameIntArray.length;
    var valueCount = end - begin + 1;
    frameIntArray.length += 5;
    frameIntArray[frameIntOffset + dbft.BinaryOffset.DeformMeshOffset] = surface.offset; // Surface offset.
    frameIntArray[frameIntOffset + dbft.BinaryOffset.DeformCount] = count; // Deform count.
    frameIntArray[frameIntOffset + dbft.BinaryOffset.DeformValueCount] = valueCount; // Value count.
    frameIntArray[frameIntOffset + dbft.BinaryOffset.DeformValueOffset] = begin; // Value offset.
    frameIntArray[frameIntOffset + dbft.BinaryOffset.DeformFloatOffset] = frameFloatArray.length - currentAnimationBinary.offset[dbft.OffsetOrder.FrameFloat]; // Float offset.
    for (var i = 0; i < begin; ++i) {
        frameFloatArray.push(firstValues[i]);
    }
    for (var i = end + 1; i < count; ++i) {
        frameFloatArray.push(firstValues[i]);
    }
    var timelineOffset = createTimeline(timeline, frames, 2 /* Float */, valueCount, function (frame, frameStart) {
        var offset = createTweenFrame(frame, frameStart);
        for (var i = 0; i < valueCount; ++i) {
            frameFloatArray.push(frame.value[begin + i]);
        }
        return offset;
    });
    // Get more infomation form value count offset.
    timelineArray[timelineOffset + dbft.BinaryOffset.TimelineFrameValueCount] = frameIntOffset - currentAnimationBinary.offset[dbft.OffsetOrder.FrameInt];
    return timelineOffset;
}
function createDeformTimeline(timeline) {
    var mesh = (timeline instanceof dbft.SlotDeformTimeline ?
        currentArmature.getDisplay(timeline.skin, timeline.slot, timeline.name) :
        currentArmature.getDisplay("", "", timeline.name)); // TODO
    if (!mesh) {
        return -1;
    }
    var vertexCount = mesh.vertices.length / 2;
    var frames = timeline.frame;
    for (var _i = 0, frames_4 = frames; _i < frames_4.length; _i++) {
        var frame = frames_4[_i];
        var x = 0.0;
        var y = 0.0;
        var iB = 0;
        if (mesh.weights.length > 0) {
            geom.helpMatrixA.copyFromArray(mesh.slotPose, 0);
            // frameFloatArray.length += mesh._weightCount * 2; // TODO CK
        }
        else {
            // frameFloatArray.length += vertexCount * 2;
        }
        if (frame.vertices.length > 0) { // 
            frame.value.length = 0;
            for (var _a = 0, _b = frame.vertices; _a < _b.length; _a++) {
                var value = _b[_a];
                frame.value.push(value);
            }
            frame.vertices.length = 0;
        }
        var vertices = new Array();
        for (var i = 0; i < vertexCount * 2; i += 2) {
            if (frame.value.length === 0) {
                x = 0.0;
                y = 0.0;
            }
            else {
                if (i < frame.offset || i - frame.offset >= frame.value.length) {
                    x = 0.0;
                }
                else {
                    x = frame.value[i - frame.offset];
                }
                if (i + 1 < frame.offset || i + 1 - frame.offset >= frame.value.length) {
                    y = 0.0;
                }
                else {
                    y = frame.value[i + 1 - frame.offset];
                }
            }
            if (mesh.weights.length > 0) { // If mesh is skinned, transform point by bone bind pose.
                var vertexBoneCount = mesh.weights[iB++];
                geom.helpMatrixA.transformPoint(x, y, geom.helpPointA, true);
                x = geom.helpPointA.x;
                y = geom.helpPointA.y;
                for (var j = 0; j < vertexBoneCount; ++j) {
                    var rawBoneIndex = mesh.weights[iB];
                    geom.helpMatrixB.copyFromArray(mesh.bonePose, mesh.getBonePoseOffset(rawBoneIndex) + 1);
                    geom.helpMatrixB.invert();
                    geom.helpMatrixB.transformPoint(x, y, geom.helpPointA, true);
                    vertices.push(geom.helpPointA.x, geom.helpPointA.y);
                    iB += 2;
                }
            }
            else {
                vertices.push(x, y);
            }
        }
        frame.value.length = 0;
        for (var _c = 0, vertices_2 = vertices; _c < vertices_2.length; _c++) {
            var value = vertices_2[_c];
            frame.value.push(value);
        }
    }
    var firstValues = frames[0].value;
    var count = firstValues.length;
    var completedBegin = false;
    var completedEnd = false;
    var begin = 0;
    var end = count - 1;
    while (!completedBegin || !completedEnd) {
        if (!completedBegin) {
            for (var _d = 0, frames_5 = frames; _d < frames_5.length; _d++) {
                var frame = frames_5[_d];
                if (frame.value[begin] !== firstValues[begin]) {
                    completedBegin = true;
                    break;
                }
            }
            if (begin === count - 1) {
                completedBegin = true;
            }
            else if (!completedBegin) {
                begin++;
            }
        }
        if (completedBegin && !completedEnd) {
            for (var _e = 0, frames_6 = frames; _e < frames_6.length; _e++) {
                var frame = frames_6[_e];
                if (frame.value[end] !== firstValues[end]) {
                    completedEnd = true;
                    break;
                }
            }
            if (end === begin) {
                completedEnd = true;
            }
            else if (!completedEnd) {
                end--;
            }
        }
    }
    var frameIntOffset = frameIntArray.length;
    var valueCount = end - begin + 1;
    frameIntArray.length += 5;
    frameIntArray[frameIntOffset + dbft.BinaryOffset.DeformMeshOffset] = mesh.offset; // Mesh offset.
    frameIntArray[frameIntOffset + dbft.BinaryOffset.DeformCount] = count; // Deform count.
    frameIntArray[frameIntOffset + dbft.BinaryOffset.DeformValueCount] = valueCount; // Value count.
    frameIntArray[frameIntOffset + dbft.BinaryOffset.DeformValueOffset] = begin; // Value offset.
    frameIntArray[frameIntOffset + dbft.BinaryOffset.DeformFloatOffset] = frameFloatArray.length - currentAnimationBinary.offset[dbft.OffsetOrder.FrameFloat]; // Float offset.
    for (var i = 0; i < begin; ++i) {
        frameFloatArray.push(firstValues[i]);
    }
    for (var i = end + 1; i < count; ++i) {
        frameFloatArray.push(firstValues[i]);
    }
    var timelineOffset = createTimeline(timeline, frames, 2 /* Float */, valueCount, function (frame, frameStart) {
        var offset = createTweenFrame(frame, frameStart);
        for (var i = 0; i < valueCount; ++i) {
            frameFloatArray.push(frame.value[begin + i]);
        }
        return offset;
    });
    // Get more infomation form value count offset.
    timelineArray[timelineOffset + dbft.BinaryOffset.TimelineFrameValueCount] = frameIntOffset - currentAnimationBinary.offset[dbft.OffsetOrder.FrameInt];
    return timelineOffset;
}
function modifyBytesPosition(bytes, byte) {
    if (byte === void 0) { byte = 0; }
    while ((bytes.length % 4) !== 0) {
        bytes.push(byte);
    }
}
function stringToUTF8Array(string) {
    var result = [];
    for (var i = 0; i < string.length; i++) {
        var c = string.charAt(i);
        var cc = c.charCodeAt(0);
        if (cc > 0xFFFF) {
            throw new Error("InvalidCharacterError");
        }
        if (cc > 0x80) {
            if (cc < 0x07FF) {
                var c1 = (cc >>> 6) | 0xC0;
                var c2 = (cc & 0x3F) | 0x80;
                result.push(c1, c2);
            }
            else {
                var c1 = (cc >>> 12) | 0xE0;
                var c2 = ((cc >>> 6) & 0x3F) | 0x80;
                var c3 = (cc & 0x3F) | 0x80;
                result.push(c1, c2, c3);
            }
        }
        else {
            result.push(cc);
        }
    }
    return result;
}
