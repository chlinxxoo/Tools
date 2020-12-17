"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var geom = require("../format/geom");
var dbft = require("../format/dragonBonesFormat");
var l2ft = require("../format/live2DFormat");
var rotateMatrixA = geom.helpMatrixA;
var rotateMatrixB = geom.helpMatrixB;
var modelConfig;
var result;
var armature;
var defaultSkin;
/**
 * Convert Live2D format to DragonBones format.
 */
function default_1(data) {
    modelConfig = data;
    var l2Displays = modelConfig.modelImpl.displays;
    // Create dragonBones.
    result = new dbft.DragonBones();
    result.frameRate = 30; //
    result.name = modelConfig.name;
    result.version = dbft.DATA_VERSION_5_6;
    result.compatibleVersion = dbft.DATA_VERSION_5_5;
    // Create textureAtlas.
    var textureIndex = 0;
    for (var _i = 0, _a = modelConfig.textures; _i < _a.length; _i++) {
        var l2Texture = _a[_i];
        if (typeof l2Texture === "string") {
            continue;
        }
        var textureAtlas = new dbft.TextureAtlas();
        textureAtlas.name = result.name;
        textureAtlas.width = l2Texture.width;
        textureAtlas.height = l2Texture.height;
        textureAtlas.imagePath = l2Texture.file;
        result.textureAtlas.push(textureAtlas);
        var subTexture = new dbft.Texture();
        subTexture.name = result.name + "_" + textureIndex.toString().padStart(2, "0");
        subTexture.x = 0;
        subTexture.y = 0;
        subTexture.width = textureAtlas.width;
        subTexture.height = textureAtlas.height;
        textureAtlas.SubTexture.push(subTexture);
        textureIndex++;
    }
    // Create armature.
    armature = new dbft.Armature();
    armature.name = data.name;
    armature.aabb.x = -modelConfig.modelImpl.stageWidth * 0.5;
    armature.aabb.y = -modelConfig.modelImpl.stageHeight;
    armature.aabb.width = modelConfig.modelImpl.stageWidth;
    armature.aabb.height = modelConfig.modelImpl.stageHeight;
    armature.canvas = new dbft.Canvas();
    armature.canvas.x = 0.0;
    armature.canvas.y = -modelConfig.modelImpl.stageHeight * 0.5;
    armature.canvas.width = modelConfig.modelImpl.stageWidth;
    armature.canvas.height = modelConfig.modelImpl.stageHeight;
    result.armature.push(armature);
    // Create root bone.
    var rootBone = new dbft.Bone();
    rootBone.name = "DST_BASE";
    rootBone.length = 150.0;
    armature.bone.push(rootBone);
    // Modify bone rotate.
    rotateMatrixA.identity();
    rotateMatrixA.rotate(Math.PI * 0.5);
    rotateMatrixB.identity();
    rotateMatrixB.rotate(-Math.PI * 0.5);
    for (var _c = 0, _d = modelConfig.modelImpl.parts; _c < _d.length; _c++) {
        var l2Part = _d[_c];
        for (var _e = 0, _f = l2Part.bones; _e < _f.length; _e++) {
            var l2Bone = _f[_e];
            var l2Parent = modelConfig.modelImpl.getBone(l2Bone.parent);
            var isSurfaceParent = l2Parent && l2Parent instanceof l2ft.Surface;
            var l2Timelines = l2Bone.animation.timelines;
            if (l2Bone instanceof l2ft.Bone) {
                var bone = new dbft.Bone();
                bone.length = 150.0;
                if (l2Bone.alphaFrames) {
                    bone.alpha = getPose(l2Timelines, l2Bone.alphaFrames, function (a, b, t) {
                        if (b) {
                            return a + (b - a) * t;
                        }
                        return a;
                    });
                }
                bone.name = l2Bone.name;
                bone.parent = l2Parent ? (l2Parent.name === rootBone.name ? "" : l2Parent.name) : "";
                armature.bone.push(bone);
                //
                var poseTransform = getPose(l2Timelines, l2Bone.transformFrames, function (a, b, t) {
                    var result = new l2ft.Transform();
                    if (b) {
                        result.interpolation(a, b, t);
                    }
                    else {
                        result.copyFrom(a);
                    }
                    return result;
                });
                if (isSurfaceParent) { // Scale and rotate.
                    bone.transform.x = (poseTransform.x - 0.5) * 400.0;
                    bone.transform.y = (poseTransform.y - 0.5) * 400.0;
                    if (poseTransform.reflectX !== poseTransform.reflectY) {
                        bone.transform.skY = poseTransform.rotate + 90.0;
                        bone.transform.skX = poseTransform.rotate + 90.0;
                    }
                    else {
                        bone.transform.skY = poseTransform.rotate - 90.0;
                        bone.transform.skX = poseTransform.rotate - 90.0;
                    }
                    bone.transform.scX = poseTransform.scaleX * (poseTransform.reflectX ? -1.0 : 1.0);
                    bone.transform.scY = poseTransform.scaleY * (poseTransform.reflectY ? -1.0 : 1.0);
                }
                else if (bone.parent) { // Rotate.
                    rotateMatrixA.transformPoint(poseTransform.x, poseTransform.y, bone.transform);
                    //
                    var parentTransform = l2Parent.transformFrames[0];
                    if (parentTransform.reflectX !== parentTransform.reflectY) {
                        bone.transform.skY = poseTransform.rotate;
                        bone.transform.skX = poseTransform.rotate;
                        if (poseTransform.reflectX !== poseTransform.reflectY) {
                        }
                        else {
                            bone.transform.scX = poseTransform.scaleX * (parentTransform.reflectY ? -1.0 : 1.0);
                            bone.transform.scY = poseTransform.scaleY * (parentTransform.reflectX ? -1.0 : 1.0);
                        }
                    }
                    else {
                        if (poseTransform.reflectX !== poseTransform.reflectY) {
                            bone.transform.skY = poseTransform.rotate + 180.0;
                            bone.transform.skX = poseTransform.rotate + 180.0;
                        }
                        else {
                            bone.transform.skY = poseTransform.rotate;
                            bone.transform.skX = poseTransform.rotate;
                        }
                        bone.transform.scX = poseTransform.scaleX * (poseTransform.reflectX ? -1.0 : 1.0);
                        bone.transform.scY = poseTransform.scaleY * (poseTransform.reflectY ? -1.0 : 1.0);
                    }
                }
                else { // Rotate and offset.
                    bone.transform.x = poseTransform.x + armature.aabb.x;
                    bone.transform.y = poseTransform.y + armature.aabb.y;
                    if (poseTransform.reflectX !== poseTransform.reflectY) {
                        bone.transform.skY = poseTransform.rotate + 90.0;
                        bone.transform.skX = poseTransform.rotate + 90.0;
                    }
                    else {
                        bone.transform.skY = poseTransform.rotate - 90.0;
                        bone.transform.skX = poseTransform.rotate - 90.0;
                    }
                    bone.transform.scX = poseTransform.scaleX * (poseTransform.reflectX ? -1.0 : 1.0);
                    bone.transform.scY = poseTransform.scaleY * (poseTransform.reflectY ? -1.0 : 1.0);
                }
                if (!bone.transform.scX) {
                    bone.transform.scX = 0.000001;
                }
                if (!bone.transform.scY) {
                    bone.transform.scY = 0.000001;
                }
            }
            else if (l2Bone instanceof l2ft.Surface) {
                var surface = new dbft.Surface();
                surface.segmentX = l2Bone.segmentX;
                surface.segmentY = l2Bone.segmentY;
                surface.name = l2Bone.name;
                surface.parent = l2Parent ? (l2Parent.name === rootBone.name ? "" : l2Parent.name) : "";
                armature.bone.push(surface);
                //
                var poseVertices = getPose(l2Timelines, l2Bone.deformFrames, function (a, b, t) {
                    var result = new Array();
                    if (b) {
                        vertivesInterpolation(result, a, b, t);
                    }
                    else {
                        vertivesCopyFrom(result, a);
                    }
                    return result;
                });
                for (var i = 0, l = poseVertices.length; i < l; i += 2) {
                    if (isSurfaceParent) { // Scale.
                        surface.vertices[i] = (poseVertices[i] - 0.5) * 400.0;
                        surface.vertices[i + 1] = (poseVertices[i + 1] - 0.5) * 400.0;
                    }
                    else if (surface.parent) { // Rotate.
                        rotateMatrixA.transformPoint(poseVertices[i], poseVertices[i + 1], geom.helpPointA);
                        surface.vertices[i] = geom.helpPointA.x;
                        surface.vertices[i + 1] = geom.helpPointA.y;
                    }
                    else { // Offset.
                        surface.vertices[i] = poseVertices[i] + armature.aabb.x;
                        surface.vertices[i + 1] = poseVertices[i + 1] + armature.aabb.y;
                    }
                }
            }
        }
    }
    // Sort bones.
    armature.sortBones();
    // armature.localToGlobal();
    // Create slots and skins.
    defaultSkin = new dbft.Skin();
    armature.skin.push(defaultSkin);
    for (var _g = 0, l2Displays_1 = l2Displays; _g < l2Displays_1.length; _g++) {
        var l2Display = l2Displays_1[_g];
        var l2Parent = modelConfig.modelImpl.getBone(l2Display.parent);
        var isSurfaceParent = l2Parent !== null && l2Parent instanceof l2ft.Surface;
        var l2Timelines = l2Display.animation.timelines;
        if (l2Display instanceof l2ft.Mesh) {
            // Create slot.
            var slot = new dbft.Slot();
            slot.name = l2Display.name;
            slot.parent = l2Parent ? l2Parent.name : rootBone.name;
            slot.alpha = getPose(l2Timelines, l2Display.alphaFrames, function (a, b, t) {
                if (b) {
                    return a + (b - a) * t;
                }
                return a;
            });
            slot.zIndex = getPose(l2Timelines, l2Display.zIndexFrames, function (a, _b, _t) {
                return a;
            });
            slot._zOrder = slot.zIndex * 1000 + l2Display.zOrder;
            // slot.color;
            armature.slot.push(slot);
            // Create displays.
            var display = new dbft.MeshDisplay();
            display.name = l2Display.name;
            display.path = result.name + "_" + (l2Display.textureIndex >= 0 ? l2Display.textureIndex : 0).toString().padStart(2, "0");
            // UVs.
            for (var _h = 0, _j = l2Display.uvs; _h < _j.length; _h++) {
                var value = _j[_h];
                display.uvs.push(value);
            }
            // Triangles.
            for (var _k = 0, _l = l2Display.indices; _k < _l.length; _k++) {
                var index = _l[_k];
                display.triangles.push(index);
            }
            // Vertices.
            var poseVertices = getPose(l2Timelines, l2Display.deformFrames, function (a, b, t) {
                var result = new Array();
                if (b) {
                    vertivesInterpolation(result, a, b, t);
                }
                else {
                    vertivesCopyFrom(result, a);
                }
                return result;
            });
            for (var i = 0, l = poseVertices.length; i < l; i += 2) {
                if (isSurfaceParent) { // Scale.
                    display.vertices[i] = (poseVertices[i] - 0.5) * 400.0;
                    display.vertices[i + 1] = (poseVertices[i + 1] - 0.5) * 400.0;
                }
                else if (slot.parent !== rootBone.name) { // Rotate.
                    rotateMatrixA.transformPoint(poseVertices[i], poseVertices[i + 1], geom.helpPointA);
                    display.vertices[i] = geom.helpPointA.x;
                    display.vertices[i + 1] = geom.helpPointA.y;
                }
                else { // Offset.
                    display.vertices[i] = poseVertices[i] + armature.aabb.x;
                    display.vertices[i + 1] = poseVertices[i + 1] + armature.aabb.y;
                }
            }
            // const edges = dbft.getEdgeFormTriangles(display.triangles);
            // for (const value of edges) {
            //     display.edges.push(value);
            // }
            // Create skinSlot.
            var skinSlot = new dbft.SkinSlot();
            skinSlot.name = l2Display.name;
            skinSlot.display.push(display);
            defaultSkin.slot.push(skinSlot);
        }
    }
    armature.sortSlots();
    // Create animations.
    if (modelConfig.modelImpl.animations.timelines.length > 0) {
        for (var _m = 0, _o = modelConfig.modelImpl.parts; _m < _o.length; _m++) {
            var l2Part = _o[_m];
            var _loop_1 = function (l2Bone) {
                var l2Timelines = l2Bone.animation.timelines;
                var bone = armature.getBone(l2Bone.name);
                if (l2Timelines.length === 0 || !bone) {
                    return "continue";
                }
                var l2Parent = modelConfig.modelImpl.getBone(l2Bone.parent);
                var isSurfaceParent = l2Parent !== null && l2Parent instanceof l2ft.Surface;
                if (l2Bone.alphaFrames) {
                    var hasAlpha = false;
                    for (var _i = 0, _a = l2Bone.alphaFrames; _i < _a.length; _i++) {
                        var alpha = _a[_i];
                        if (alpha !== bone.alpha) {
                            hasAlpha = true;
                            break;
                        }
                    }
                    if (hasAlpha) {
                        createAnimation(l2Timelines, l2Bone.alphaFrames, bone, function (l2Timeline, l2Frames, target, offset, blendAnimation) {
                            var l2TimelineInfo = modelConfig.modelImpl.getTimelineInfo(l2Timeline.name);
                            var totalValue = l2TimelineInfo.maximum - l2TimelineInfo.minimum;
                            var timeline = new dbft.TypeTimeline();
                            timeline.type = dbft.TimelineType.BoneAlpha;
                            timeline.name = target.name;
                            for (var i = 0; i < l2Timeline.frameCount; ++i) {
                                var progress = (l2Timeline.frames[i] - l2TimelineInfo.minimum) / totalValue;
                                var l2Frame = l2Frames[offset + i];
                                var frame = new dbft.SingleValueFrame1();
                                frame._position = Math.floor(progress * blendAnimation.duration);
                                frame.tweenEasing = i === l2Timeline.frameCount - 1 ? NaN : 0.0;
                                frame.value = l2Frame;
                                timeline.frame.push(frame);
                            }
                            dbft.modifyFramesByPosition(timeline.frame);
                            blendAnimation.timeline.push(timeline);
                        });
                    }
                }
                if (l2Bone instanceof l2ft.Bone) {
                    createAnimation(l2Timelines, l2Bone.transformFrames, bone, function (l2Timeline, l2Frames, target, offset, blendAnimation) {
                        var l2TimelineInfo = modelConfig.modelImpl.getTimelineInfo(l2Timeline.name);
                        var totalValue = l2TimelineInfo.maximum - l2TimelineInfo.minimum;
                        var translateTimeline = new dbft.TypeTimeline();
                        var rotateTimeline = new dbft.TypeTimeline();
                        var scaleTimeline = new dbft.TypeTimeline();
                        translateTimeline.type = dbft.TimelineType.BoneTranslate;
                        rotateTimeline.type = dbft.TimelineType.BoneRotate;
                        scaleTimeline.type = dbft.TimelineType.BoneScale;
                        translateTimeline.name = target.name;
                        rotateTimeline.name = target.name;
                        scaleTimeline.name = target.name;
                        for (var i = 0; i < l2Timeline.frameCount; ++i) {
                            var progress = (l2Timeline.frames[i] - l2TimelineInfo.minimum) / totalValue;
                            var l2Frame = l2Frames[offset + i];
                            var translateFrame = new dbft.DoubleValueFrame0();
                            var rotateFrame = new dbft.DoubleValueFrame0();
                            var scaleFrame = new dbft.DoubleValueFrame1();
                            var x = 0.0;
                            var y = 0.0;
                            translateFrame._position = rotateFrame._position = scaleFrame._position = Math.floor(progress * blendAnimation.duration);
                            translateFrame.tweenEasing = rotateFrame.tweenEasing = scaleFrame.tweenEasing = i === l2Timeline.frameCount - 1 ? NaN : 0.0;
                            if (isSurfaceParent) {
                                x = (l2Frame.x - 0.5) * 400.0;
                                y = (l2Frame.y - 0.5) * 400.0;
                            }
                            else {
                                x = l2Frame.x;
                                y = l2Frame.y;
                            }
                            if (!target.parent || isSurfaceParent) {
                                if (target.parent) {
                                    translateFrame.x = x - target.transform.x;
                                    translateFrame.y = y - target.transform.y;
                                    if (l2Frame.reflectX !== l2Frame.reflectY) {
                                        rotateFrame.x = l2Frame.rotate + 90.0 - target.transform.skY;
                                    }
                                    else {
                                        rotateFrame.x = l2Frame.rotate - 90.0 - target.transform.skY;
                                    }
                                }
                                else {
                                    translateFrame.x = x - target.transform.x + armature.aabb.x;
                                    translateFrame.y = y - target.transform.y + armature.aabb.y;
                                    if (l2Frame.reflectX !== l2Frame.reflectY) {
                                        rotateFrame.x = l2Frame.rotate + 90.0 - target.transform.skY;
                                    }
                                    else {
                                        rotateFrame.x = l2Frame.rotate - 90.0 - target.transform.skY;
                                    }
                                }
                                scaleFrame.x = l2Frame.scaleX * (l2Frame.reflectX ? -1.0 : 1.0) / target.transform.scX;
                                scaleFrame.y = l2Frame.scaleY * (l2Frame.reflectY ? -1.0 : 1.0) / target.transform.scY;
                            }
                            else {
                                rotateMatrixA.transformPoint(x, y, translateFrame);
                                translateFrame.x -= target.transform.x;
                                translateFrame.y -= target.transform.y;
                                //
                                var parentTransform = l2Parent.transformFrames[0];
                                if (parentTransform.reflectX !== parentTransform.reflectY) {
                                    rotateFrame.x = l2Frame.rotate - target.transform.skY;
                                    if (l2Frame.reflectX !== l2Frame.reflectY) {
                                    }
                                    else {
                                        scaleFrame.x = l2Frame.scaleX * (parentTransform.reflectY ? -1.0 : 1.0) / target.transform.scX;
                                        scaleFrame.y = l2Frame.scaleY * (parentTransform.reflectX ? -1.0 : 1.0) / target.transform.scY;
                                    }
                                }
                                else {
                                    if (l2Frame.reflectX !== l2Frame.reflectY) {
                                        rotateFrame.x = l2Frame.rotate + 180 - target.transform.skY;
                                    }
                                    else {
                                        rotateFrame.x = l2Frame.rotate - target.transform.skY;
                                    }
                                    scaleFrame.x = l2Frame.scaleX * (l2Frame.reflectX ? -1.0 : 1.0) / target.transform.scX;
                                    scaleFrame.y = l2Frame.scaleY * (l2Frame.reflectY ? -1.0 : 1.0) / target.transform.scY;
                                }
                            }
                            translateTimeline.frame.push(translateFrame);
                            rotateTimeline.frame.push(rotateFrame);
                            scaleTimeline.frame.push(scaleFrame);
                        }
                        dbft.modifyFramesByPosition(translateTimeline.frame);
                        dbft.modifyFramesByPosition(rotateTimeline.frame);
                        dbft.modifyFramesByPosition(scaleTimeline.frame);
                        blendAnimation.timeline.push(translateTimeline);
                        blendAnimation.timeline.push(rotateTimeline);
                        blendAnimation.timeline.push(scaleTimeline);
                    });
                }
                else if (l2Bone instanceof l2ft.Surface) {
                    createAnimation(l2Timelines, l2Bone.deformFrames, bone, function (l2Timeline, l2Frames, target, offset, blendAnimation) {
                        var l2TimelineInfo = modelConfig.modelImpl.getTimelineInfo(l2Timeline.name);
                        var totalValue = l2TimelineInfo.maximum - l2TimelineInfo.minimum;
                        var timeline = new dbft.TypeTimeline();
                        timeline.type = dbft.TimelineType.Surface;
                        timeline.name = target.name;
                        for (var i = 0; i < l2Timeline.frameCount; ++i) {
                            var progress = (l2Timeline.frames[i] - l2TimelineInfo.minimum) / totalValue;
                            var l2Frame = l2Frames[offset + i];
                            var frame = new dbft.MutilpleValueFrame();
                            frame._position = Math.floor(progress * blendAnimation.duration);
                            frame.tweenEasing = i === l2Timeline.frameCount - 1 ? NaN : 0.0;
                            createDeformFrame(frame, l2Frame, target.vertices, isSurfaceParent, target.parent.length > 0);
                            timeline.frame.push(frame);
                        }
                        dbft.modifyFramesByPosition(timeline.frame);
                        blendAnimation.timeline.push(timeline);
                    });
                }
            };
            // Create bone timelines.
            for (var _p = 0, _q = l2Part.bones; _p < _q.length; _p++) {
                var l2Bone = _q[_p];
                _loop_1(l2Bone);
            }
            var _loop_2 = function (l2Display) {
                var l2Timelines = l2Display.animation.timelines;
                var slot = armature.getSlot(l2Display.name);
                if (l2Timelines.length === 0 || !slot) {
                    return "continue";
                }
                var l2Parent = modelConfig.modelImpl.getBone(l2Display.parent);
                var isSurfaceParent = l2Parent !== null && l2Parent instanceof l2ft.Surface;
                if (l2Display instanceof l2ft.Mesh) {
                    var meshDisplay = armature.getDisplay(defaultSkin.name, l2Display.name, l2Display.name);
                    if (!meshDisplay) {
                        return "continue";
                    }
                    var hasZIndex = false;
                    var prevZIndex = NaN;
                    for (var _i = 0, _a = l2Display.zIndexFrames; _i < _a.length; _i++) {
                        var zIndex = _a[_i];
                        if (prevZIndex === prevZIndex && zIndex !== prevZIndex) {
                            hasZIndex = true;
                            break;
                        }
                        prevZIndex = zIndex;
                    }
                    if (hasZIndex) {
                        createAnimation(l2Timelines, l2Display.zIndexFrames, meshDisplay, function (l2Timeline, l2Frames, target, offset, blendAnimation) {
                            var l2TimelineInfo = modelConfig.modelImpl.getTimelineInfo(l2Timeline.name);
                            var totalValue = l2TimelineInfo.maximum - l2TimelineInfo.minimum;
                            var timeline = new dbft.TypeTimeline();
                            timeline.type = dbft.TimelineType.SlotZIndex;
                            timeline.name = target.name;
                            for (var i = 0; i < l2Timeline.frameCount; ++i) {
                                var progress = (l2Timeline.frames[i] - l2TimelineInfo.minimum) / totalValue;
                                var l2Frame = l2Frames[offset + i];
                                var frame = new dbft.SingleValueFrame0();
                                frame._position = Math.floor(progress * blendAnimation.duration);
                                frame.value = l2Frame;
                                timeline.frame.push(frame);
                            }
                            dbft.modifyFramesByPosition(timeline.frame);
                            blendAnimation.timeline.push(timeline);
                        });
                    }
                    var hasAlpha = false;
                    for (var _c = 0, _d = l2Display.alphaFrames; _c < _d.length; _c++) {
                        var alpha = _d[_c];
                        if (alpha !== slot.alpha) {
                            hasAlpha = true;
                            break;
                        }
                    }
                    if (hasAlpha) {
                        createAnimation(l2Timelines, l2Display.alphaFrames, meshDisplay, function (l2Timeline, l2Frames, target, offset, blendAnimation) {
                            var l2TimelineInfo = modelConfig.modelImpl.getTimelineInfo(l2Timeline.name);
                            var totalValue = l2TimelineInfo.maximum - l2TimelineInfo.minimum;
                            var timeline = new dbft.TypeTimeline();
                            timeline.type = dbft.TimelineType.SlotAlpha;
                            timeline.name = target.name;
                            for (var i = 0; i < l2Timeline.frameCount; ++i) {
                                var progress = (l2Timeline.frames[i] - l2TimelineInfo.minimum) / totalValue;
                                var l2Frame = l2Frames[offset + i];
                                var frame = new dbft.SingleValueFrame1();
                                frame._position = Math.floor(progress * blendAnimation.duration);
                                frame.tweenEasing = i === l2Timeline.frameCount - 1 ? NaN : 0.0;
                                frame.value = l2Frame;
                                timeline.frame.push(frame);
                            }
                            dbft.modifyFramesByPosition(timeline.frame);
                            blendAnimation.timeline.push(timeline);
                        });
                    }
                    //
                    createAnimation(l2Timelines, l2Display.deformFrames, meshDisplay, function (l2Timeline, l2Frames, target, offset, blendAnimation) {
                        var l2TimelineInfo = modelConfig.modelImpl.getTimelineInfo(l2Timeline.name);
                        var totalValue = l2TimelineInfo.maximum - l2TimelineInfo.minimum;
                        var timeline = new dbft.TypeTimeline();
                        timeline.type = dbft.TimelineType.SlotDeform;
                        timeline.name = target.name;
                        for (var i = 0; i < l2Timeline.frameCount; ++i) {
                            var progress = (l2Timeline.frames[i] - l2TimelineInfo.minimum) / totalValue;
                            var l2Frame = l2Frames[offset + i];
                            var frame = new dbft.MutilpleValueFrame();
                            frame._position = Math.floor(progress * blendAnimation.duration);
                            frame.tweenEasing = i === l2Timeline.frameCount - 1 ? NaN : 0.0;
                            createDeformFrame(frame, l2Frame, target.vertices, isSurfaceParent, slot.parent !== rootBone.name);
                            timeline.frame.push(frame);
                        }
                        dbft.modifyFramesByPosition(timeline.frame);
                        blendAnimation.timeline.push(timeline);
                    });
                }
            };
            // Create slot timeines.
            for (var _r = 0, _s = l2Part.displays; _r < _s.length; _r++) {
                var l2Display = _s[_r];
                _loop_2(l2Display);
            }
        }
    }
    var paramBackupAnimations = armature.animation.map(function (animation) { return animation.name; });
    if (modelConfig.motions) { // Create motion animations.
        for (var motionName in modelConfig.motions) {
            var index = 0;
            var motionConfigs = modelConfig.motions[motionName];
            for (var _u = 0, motionConfigs_1 = motionConfigs; _u < motionConfigs_1.length; _u++) {
                var motionConfig = motionConfigs_1[_u];
                if (!motionConfig.motion) {
                    continue;
                }
                var paramAnimations = paramBackupAnimations.concat();
                var animationName = motionConfigs.length > 1 ? (motionName + "_" + index.toString().padStart(2, "0")) : motionName;
                var animation = new dbft.Animation();
                animation.playTimes = 0;
                animation.fadeInTime = motionConfig.fade_in ? motionConfig.fade_in * 0.001 : (motionConfig.motion.fade_in ? motionConfig.motion.fade_in * 0.001 : 0.3);
                animation.name = animationName;
                animation.type = dbft.AnimationType.Tree;
                for (var timelineName in motionConfig.motion.values) {
                    var l2TimelineInfo = modelConfig.modelImpl.getTimelineInfo(timelineName);
                    if (!l2TimelineInfo) {
                        continue;
                    }
                    if (!paramAnimations.includes(timelineName)) {
                        continue;
                    }
                    paramAnimations.splice(paramAnimations.indexOf(timelineName), 1);
                    var duration = 0;
                    var values = motionConfig.motion.values[timelineName];
                    var _v = getMinAndMax(values), min = _v[0], max = _v[1];
                    var timeline = new dbft.TypeTimeline();
                    var prevFrame = null;
                    timeline.type = dbft.TimelineType.AnimationProgress;
                    timeline.name = timelineName;
                    min = (min - l2TimelineInfo.minimum) / (l2TimelineInfo.maximum - l2TimelineInfo.minimum);
                    max = (max - l2TimelineInfo.minimum) / (l2TimelineInfo.maximum - l2TimelineInfo.minimum);
                    for (var i = 0, l = values.length; i < l; ++i) {
                        var value = values[i];
                        var frame = new dbft.SingleValueFrame0();
                        frame.tweenEasing = 0.0;
                        frame.value = (value - l2TimelineInfo.minimum) / (l2TimelineInfo.maximum - l2TimelineInfo.minimum);
                        timeline.frame.push(frame);
                        duration += frame.duration;
                        if (i > 1 && prevFrame &&
                            ((Math.abs(prevFrame.value - min) < 0.1 || Math.abs(prevFrame.value - max) < 0.1) &&
                                (Math.abs(frame.value - min) < 0.1 || Math.abs(frame.value - max) < 0.1)) &&
                            Math.abs(prevFrame.value - frame.value) > Math.abs(max - min) * 0.7) {
                            prevFrame.tweenEasing = NaN;
                        }
                        prevFrame = frame;
                    }
                    var firstVaule = timeline.frame[0].value;
                    if (prevFrame &&
                        ((Math.abs(prevFrame.value - min) < 0.1 || Math.abs(prevFrame.value - max) < 0.1) &&
                            (Math.abs(firstVaule - min) < 0.1 || Math.abs(firstVaule - max) < 0.1)) &&
                        Math.abs(prevFrame.value - firstVaule) > Math.abs(max - min) * 0.7) {
                        prevFrame.tweenEasing = NaN;
                    }
                    animation.duration = Math.max(duration, animation.duration);
                    animation.timeline.push(timeline);
                }
                // for (const timelineName of paramAnimations) {
                //     const l2TimelineInfo = modelConfig.modelImpl.getTimelineInfo(timelineName);
                //     if (!l2TimelineInfo) {
                //         continue;
                //     }
                //     const timeline = new dbft.TypeTimeline();
                //     timeline.type = dbft.TimelineType.AnimationProgress;
                //     timeline.name = timelineName;
                //     //
                //     const frame = new dbft.SingleValueFrame0();
                //     frame.value = l2TimelineInfo.default;
                //     timeline.frame.push(frame);
                //     animation.timeline.push(timeline);
                // }
                for (var timelineName in motionConfig.motion.alphas) {
                    var part = modelConfig.modelImpl.getPart(timelineName);
                    if (!part) {
                        continue;
                    }
                    var duration = 0;
                    var alphas = motionConfig.motion.alphas[timelineName];
                    for (var _w = 0, _x = part.displays; _w < _x.length; _w++) {
                        var l2Display = _x[_w];
                        if (l2Display instanceof l2ft.Mesh) {
                            var timeline = new dbft.TypeTimeline();
                            timeline.type = dbft.TimelineType.SlotColor;
                            timeline.name = l2Display.name;
                            for (var i = 0, l = alphas.length; i < l; ++i) {
                                var alpha = alphas[i];
                                var frame = new dbft.SlotColorFrame();
                                if (i !== l - 1) {
                                    frame.tweenEasing = 0;
                                    duration += frame.duration;
                                }
                                frame.value.aM = alpha * 100.0;
                                timeline.frame.push(frame);
                            }
                            animation.timeline.push(timeline);
                        }
                    }
                    animation.duration = Math.max(duration, animation.duration);
                }
                armature.animation.unshift(animation);
                index++;
            }
        }
    }
    if (modelConfig.expressions) { // Create expression animations.
        for (var _y = 0, _z = modelConfig.expressions; _y < _z.length; _y++) {
            var expressionConfig = _z[_y];
            var expression = expressionConfig.expression;
            if (!expression || !expression.params || expression.params.length === 0) {
                continue;
            }
            var animation = new dbft.Animation();
            animation.playTimes = 1;
            animation.fadeInTime = expression.fade_in ? expression.fade_in * 0.001 : 0.3;
            animation.name = expressionConfig.name;
            animation.type = dbft.AnimationType.Tree;
            for (var _0 = 0, _1 = expression.params; _0 < _1.length; _0++) {
                var timelineConfig = _1[_0];
                var l2TimelineInfo = modelConfig.modelImpl.getTimelineInfo(timelineConfig.id);
                if (!l2TimelineInfo) {
                    continue;
                }
                var timeline = new dbft.TypeTimeline();
                timeline.type = dbft.TimelineType.AnimationProgress;
                timeline.name = l2TimelineInfo.name;
                //
                var frame = new dbft.SingleValueFrame0();
                frame.value = (timelineConfig.val - l2TimelineInfo.minimum) / (l2TimelineInfo.maximum - l2TimelineInfo.minimum);
                timeline.frame.push(frame);
                if (timelineConfig.def) {
                    // TODO
                }
                animation.duration = 0;
                animation.timeline.push(timeline);
            }
            armature.animation.unshift(animation);
        }
    }
    return result;
}
exports.default = default_1;
function getPose(l2Timelines, frames, action, level, offset) {
    if (level === void 0) { level = -1; }
    if (offset === void 0) { offset = -1; }
    if (level < 0) {
        if (l2Timelines.length > 0) {
            level = l2Timelines.length - 1;
            offset = 0;
        }
        else {
            return frames[0];
        }
    }
    var l2Timeline = l2Timelines[level];
    var l2TimelineInfo = modelConfig.modelImpl.getTimelineInfo(l2Timeline.name);
    var index = l2Timeline.frames.indexOf(l2TimelineInfo.default);
    var count = 1;
    if (index < 0) {
        if (l2TimelineInfo.default <= l2Timeline.frames[0]) {
            index = 0;
        }
        else if (l2TimelineInfo.default >= l2Timeline.frames[l2Timeline.frames.length - 1]) {
            index = l2Timeline.frames.length - 1;
        }
    }
    for (var i = 0; i < level; ++i) {
        count *= l2Timelines[i].frameCount;
    }
    if (index < 0) {
        for (var _i = 0, _a = l2Timeline.frames; _i < _a.length; _i++) {
            var value = _a[_i];
            index++;
            if (value > l2TimelineInfo.default) {
                var prevValue = l2Timeline.frames[index - 1];
                var progress = (l2TimelineInfo.default - prevValue) / (value - prevValue);
                if (level === 0) {
                    return action(frames[offset + index - 1], frames[offset + index], progress);
                }
                return action(getPose(l2Timelines, frames, action, level - 1, offset + (index - 1) * count), getPose(l2Timelines, frames, action, level - 1, offset + index * count), progress);
            }
        }
        throw new Error();
    }
    else {
        if (level === 0) {
            return frames[offset + index];
        }
        offset += index * count;
        return getPose(l2Timelines, frames, action, level - 1, offset);
    }
}
function createAnimation(l2Timelines, frames, target, action, indices, parentAnimation) {
    if (indices === void 0) { indices = [0]; }
    if (parentAnimation === void 0) { parentAnimation = null; }
    var level = l2Timelines.length - indices.length;
    var index = indices[indices.length - 1];
    var l2Timeline = l2Timelines[level];
    var blendName = target.name;
    var animation = armature.getAnimation(l2Timeline.name);
    if (!animation) {
        animation = new dbft.Animation();
        animation.playTimes = 0;
        animation.duration = modelConfig.modelImpl.frameCount;
        animation.name = l2Timeline.name;
        animation.type = dbft.AnimationType.Tree;
        armature.animation.unshift(animation);
    }
    if (l2Timelines.length === 1) {
        action(l2Timeline, frames, target, 0, animation);
        return;
    }
    else if (level === 0 && !animation.getAnimationTimeline(blendName, dbft.TimelineType.AnimationProgress)) {
        var blendTimeline = new dbft.TypeTimeline();
        var frameBegin = new dbft.SingleValueFrame0();
        var frameEnd = new dbft.SingleValueFrame0();
        frameBegin._position = 0;
        frameBegin.value = 0.0;
        frameBegin.tweenEasing = 0.0;
        frameEnd._position = animation.duration;
        frameEnd.value = 1.0;
        blendTimeline.type = dbft.TimelineType.AnimationProgress;
        blendTimeline.name = blendName;
        blendTimeline.frame.push(frameBegin, frameEnd);
        dbft.modifyFramesByPosition(blendTimeline.frame);
        animation.timeline.push(blendTimeline);
    }
    if (parentAnimation) {
        var i = 0;
        for (var _i = 0, indices_1 = indices; _i < indices_1.length; _i++) {
            var value = indices_1[_i];
            if (i > 0) {
                blendName += "_" + (value).toString().padStart(2, "0");
            }
            i++;
        }
        if (!parentAnimation.getAnimationTimeline(blendName, dbft.TimelineType.AnimationProgress)) {
            var parentL2Timleine = l2Timelines[level + 1];
            var parentL2TimelineInfo = modelConfig.modelImpl.getTimelineInfo(parentL2Timleine.name);
            var totalValue = parentL2TimelineInfo.maximum - parentL2TimelineInfo.minimum;
            var childTimeline = new dbft.AnimationTimeline();
            var frameBegin = new dbft.SingleValueFrame0();
            var frameEnd = new dbft.SingleValueFrame0();
            childTimeline.type = dbft.TimelineType.AnimationProgress;
            childTimeline.x = (parentL2Timleine.frames[index] - parentL2TimelineInfo.minimum) / totalValue * 2.0 - 1.0;
            childTimeline.name = blendName;
            frameBegin._position = 0;
            frameBegin.value = 0;
            frameBegin.tweenEasing = 0.0;
            frameEnd._position = parentAnimation.duration;
            frameEnd.value = 1.0;
            childTimeline.frame.push(frameBegin, frameEnd);
            dbft.modifyFramesByPosition(childTimeline.frame);
            parentAnimation.timeline.push(childTimeline);
        }
    }
    var blendAnimation = armature.getAnimation(blendName);
    if (!blendAnimation) {
        blendAnimation = new dbft.Animation();
        blendAnimation.playTimes = 0;
        blendAnimation.duration = animation.duration;
        blendAnimation.type = dbft.AnimationType.Node;
        blendAnimation.blendType = level !== 0 ? dbft.AnimationBlendType.E1D : dbft.AnimationBlendType.None;
        blendAnimation.name = blendName;
        armature.animation.push(blendAnimation);
        if (level !== 0) {
            var blendTimeline = new dbft.TypeTimeline();
            var frameBegin = new dbft.DoubleValueFrame0();
            var frameEnd = new dbft.DoubleValueFrame0();
            frameBegin._position = 0;
            frameBegin.x = -1.0;
            frameBegin.tweenEasing = 0.0;
            frameEnd._position = blendAnimation.duration;
            frameEnd.x = 1.0;
            blendTimeline.type = dbft.TimelineType.AnimationParameter;
            blendTimeline.name = blendAnimation.name;
            blendTimeline.frame.push(frameBegin, frameEnd);
            dbft.modifyFramesByPosition(blendTimeline.frame);
            animation.timeline.push(blendTimeline);
        }
    }
    if (level === 0) {
        var offset = 0;
        for (var i = 0, l = indices.length; i < l; ++i) {
            var value = indices[i];
            var count = 1;
            for (var j = 0; j < l2Timelines.length - i; ++j) {
                count *= l2Timelines[j].frameCount;
            }
            offset += value * count;
        }
        action(l2Timeline, frames, target, offset, blendAnimation);
    }
    else {
        for (var i = 0, l = l2Timeline.frameCount; i < l; ++i) {
            var childIndices = indices.concat();
            childIndices.push(i);
            createAnimation(l2Timelines, frames, target, action, childIndices, blendAnimation);
        }
    }
}
function createDeformFrame(deformFrame, l2DeformFrame, pose, isSurfaceParent, isRotatedParent) {
    for (var j = 0, lJ = l2DeformFrame.length; j < lJ; j += 2) {
        if (isSurfaceParent) { // Scale.
            deformFrame.value[j] = (l2DeformFrame[j] - 0.5) * 400.0 - pose[j];
            deformFrame.value[j + 1] = (l2DeformFrame[j + 1] - 0.5) * 400.0 - pose[j + 1];
        }
        else if (isRotatedParent) { // Rotate.
            rotateMatrixA.transformPoint(l2DeformFrame[j], l2DeformFrame[j + 1], geom.helpPointA);
            deformFrame.value[j] = geom.helpPointA.x - pose[j];
            deformFrame.value[j + 1] = geom.helpPointA.y - pose[j + 1];
        }
        else { // Offset.
            deformFrame.value[j] = l2DeformFrame[j] - pose[j] + armature.aabb.x;
            deformFrame.value[j + 1] = l2DeformFrame[j + 1] - pose[j + 1] + armature.aabb.y;
        }
    }
}
function vertivesCopyFrom(result, target) {
    result.length = target.length;
    for (var i = 0, l = target.length; i < l; ++i) {
        result[i] = target[i];
    }
}
function vertivesAdd(result, target) {
    result.length = target.length;
    for (var i = 0, l = target.length; i < l; ++i) {
        result[i] += target[i];
    }
}
function vertivesMinus(result, target) {
    result.length = target.length;
    for (var i = 0, l = target.length; i < l; ++i) {
        result[i] -= target[i];
    }
}
function vertivesInterpolation(result, a, b, t) {
    result.length = a.length;
    var helper = [];
    vertivesCopyFrom(helper, b);
    vertivesMinus(helper, a);
    for (var i = 0, l = helper.length; i < l; ++i) {
        helper[i] *= t;
    }
    vertivesCopyFrom(result, a);
    vertivesAdd(result, helper);
}
function getMinAndMax(values) {
    var min = 999999.0;
    var max = -999999.0;
    for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
        var value = values_1[_i];
        if (value < min) {
            min = value;
        }
        if (value > max) {
            max = value;
        }
    }
    return [min, max];
}
//# sourceMappingURL=fromLive2D.js.map