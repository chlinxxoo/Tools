"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var geom = require("../format/geom");
var dbft = require("../format/dragonBonesFormat");
var spft = require("../format/spineFormat");
/**
 * Convert Spine format to DragonBones format.
 */
function default_1(data, forPro) {
    if (forPro === void 0) { forPro = false; }
    var textureAtlasScale = -1.0;
    var result = new dbft.DragonBones();
    { // Convert texture atlas.
        var lines = data.textureAtlas.split(/\r\n|\r|\n/);
        var tuple = new Array(4);
        var textureAtlas = null;
        while (true) {
            var line = lines.shift();
            if (line === null || line === undefined) {
                break;
            }
            if (line.length === 0) {
                textureAtlas = null;
            }
            else if (!textureAtlas) {
                textureAtlas = new dbft.TextureAtlas();
                textureAtlas.name = data.name;
                textureAtlas.imagePath = line;
                if (readTuple(tuple, lines.shift()) === 2) {
                    textureAtlas.width = parseInt(tuple[0]);
                    textureAtlas.height = parseInt(tuple[1]);
                    readTuple(tuple, lines.shift());
                }
                readTuple(tuple, lines.shift());
                readValue(lines.shift());
                result.textureAtlas.push(textureAtlas);
            }
            else {
                var texture = new dbft.Texture();
                texture.name = line;
                texture.rotated = readValue(lines.shift()) === "true" ? (forPro ? 1 : true) : false;
                readTuple(tuple, lines.shift());
                texture.x = parseInt(tuple[0]);
                texture.y = parseInt(tuple[1]);
                readTuple(tuple, lines.shift());
                if (texture.rotated) {
                    texture.height = parseInt(tuple[0]);
                    texture.width = parseInt(tuple[1]);
                }
                else {
                    texture.width = parseInt(tuple[0]);
                    texture.height = parseInt(tuple[1]);
                }
                if (readTuple(tuple, lines.shift()) === 4) {
                    if (readTuple(tuple, lines.shift()) === 4) {
                        readTuple(tuple, lines.shift());
                    }
                }
                texture.frameWidth = parseInt(tuple[0]);
                texture.frameHeight = parseInt(tuple[1]);
                readTuple(tuple, lines.shift());
                texture.frameX = -parseInt(tuple[0]);
                texture.frameY = -(texture.frameHeight - (texture.rotated ? texture.width : texture.height) - parseInt(tuple[1]));
                readTuple(tuple, lines.shift());
                textureAtlas.SubTexture.push(texture);
            }
        }
    }
    var armature = new dbft.Armature();
    armature.name = data.name;
    result.frameRate = data.data.skeleton.fps;
    result.name = data.name;
    result.version = dbft.DATA_VERSION_5_5;
    result.compatibleVersion = dbft.DATA_VERSION_5_5;
    result.armature.push(armature);
    for (var _i = 0, _a = data.data.bones; _i < _a.length; _i++) {
        var sfBone = _a[_i];
        var bone = new dbft.Bone();
        bone.length = sfBone.length;
        bone.transform.x = sfBone.x;
        bone.transform.y = -sfBone.y;
        bone.transform.skY = -(sfBone.rotation + sfBone.shearX);
        bone.transform.skX = bone.transform.skY - sfBone.shearY;
        bone.transform.scX = sfBone.scaleX;
        bone.transform.scY = sfBone.scaleY;
        bone.name = sfBone.name;
        bone.parent = sfBone.parent;
        switch (sfBone.transform) {
            case "onlyTranslation":
                bone.inheritRotation = false;
                bone.inheritScale = false;
                bone.inheritReflection = false;
                break;
            case "noRotationOrReflection":
                bone.inheritRotation = false;
                bone.inheritScale = true;
                bone.inheritReflection = false;
                break;
            case "noScaleOrReflection":
                bone.inheritRotation = true;
                bone.inheritScale = false;
                bone.inheritReflection = false;
                break;
            case "noScale":
                bone.inheritRotation = true;
                bone.inheritScale = false;
                bone.inheritReflection = true;
                break;
            case "normal":
            default:
                bone.inheritRotation = sfBone.inheritRotation;
                bone.inheritScale = sfBone.inheritScale;
                bone.inheritReflection = true;
                break;
        }
        armature.bone.push(bone);
    }
    armature.sortBones();
    armature.localToGlobal();
    var slotDisplays = {}; // Create attachments sort.
    var addDisplayToSlot = function (rawDisplays, display, displays) {
        // tslint:disable-next-line:no-unused-expression
        rawDisplays;
        // const index = rawDisplays.indexOf(display.name); TODO
        // while (displays.length < index) {
        //     displays.push(null);
        // }
        displays.push(display);
    };
    for (var skinName in data.data.skins) {
        var spSkin = data.data.skins[skinName];
        var skin = new dbft.Skin();
        skin.name = skinName;
        for (var slotName in spSkin) {
            var spSlot = spSkin[slotName];
            var slot = new dbft.SkinSlot();
            var displays = slotDisplays[slotName] = slotDisplays[slotName] || [];
            slot.name = slotName;
            for (var attachmentName in spSlot) {
                var attachment = spSlot[attachmentName];
                if (displays.indexOf(attachmentName) < 0) {
                    displays.push(attachmentName);
                }
                if (attachment instanceof spft.RegionAttachment) {
                    var display = new dbft.ImageDisplay();
                    display.name = attachmentName;
                    display.path = attachment.path || attachment.name;
                    display.transform.x = attachment.x;
                    display.transform.y = -attachment.y;
                    display.transform.skX = -attachment.rotation;
                    display.transform.skY = -attachment.rotation;
                    display.transform.scX = attachment.scaleX;
                    display.transform.scY = attachment.scaleY;
                    addDisplayToSlot(displays, display, slot.display);
                    if (textureAtlasScale < 0.0) {
                        textureAtlasScale = modifyTextureAtlasScale(display.path || display.name, attachment, result.textureAtlas);
                    }
                }
                else if (attachment instanceof spft.MeshAttachment) {
                    var display = new dbft.MeshDisplay();
                    display.name = attachmentName;
                    display.width = attachment.width;
                    display.height = attachment.height;
                    display.path = attachment.path || attachment.name;
                    for (var _b = 0, _c = attachment.uvs; _b < _c.length; _b++) {
                        var v = _c[_b];
                        display.uvs.push(v);
                    }
                    for (var _d = 0, _e = attachment.triangles; _d < _e.length; _d++) {
                        var v = _e[_d];
                        display.triangles.push(v);
                    }
                    if (attachment.uvs.length === attachment.vertices.length) {
                        for (var i = 0; i < attachment.vertices.length; ++i) {
                            var v = attachment.vertices[i];
                            if (i % 2) {
                                display.vertices[i] = -v;
                            }
                            else {
                                display.vertices[i] = v;
                            }
                        }
                    }
                    else {
                        var bones = new Array();
                        for (var i = 0, iW = 0; i < attachment.uvs.length / 2; ++i) {
                            var boneCount = attachment.vertices[iW++];
                            var xG = 0.0;
                            var yG = 0.0;
                            display.weights.push(boneCount);
                            for (var j = 0; j < boneCount; j++) {
                                var boneIndex = attachment.vertices[iW++];
                                var xL = attachment.vertices[iW++];
                                var yL = -attachment.vertices[iW++];
                                var weight = attachment.vertices[iW++];
                                var bone = armature.getBone(data.data.bones[boneIndex].name);
                                if (bone && bone._global) {
                                    var boneIndex_1 = armature.bone.indexOf(bone);
                                    bone._global.toMatrix(geom.helpMatrixA);
                                    geom.helpMatrixA.transformPoint(xL, yL, geom.helpPointA);
                                    xG += geom.helpPointA.x * weight;
                                    yG += geom.helpPointA.y * weight;
                                    display.weights.push(boneIndex_1, weight);
                                    if (bones.indexOf(boneIndex_1) < 0) {
                                        bones.push(boneIndex_1);
                                        display.bonePose.push(boneIndex_1, geom.helpMatrixA.a, geom.helpMatrixA.b, geom.helpMatrixA.c, geom.helpMatrixA.d, geom.helpMatrixA.tx, geom.helpMatrixA.ty);
                                    }
                                }
                            }
                            display.vertices.push(xG, yG);
                        }
                        display.slotPose.push(1.0, 0.0, 0.0, 1.0, 0.0, 0.0);
                    }
                    var edges = dbft.getEdgeFormTriangles(display.triangles);
                    display.edges.length = edges.length;
                    for (var _f = 0, edges_1 = edges; _f < edges_1.length; _f++) {
                        var value = edges_1[_f];
                        display.edges.push(value);
                    }
                    if (attachment.edges.length !== attachment.hull * 2) {
                        for (var i = attachment.hull * 2; i < attachment.edges.length; ++i) {
                            display.userEdges.push(attachment.edges[i] / 2);
                        }
                    }
                    addDisplayToSlot(displays, display, slot.display);
                    if (textureAtlasScale < 0.0) {
                        textureAtlasScale = modifyTextureAtlasScale(display.path || display.name, attachment, result.textureAtlas);
                    }
                }
                else if (attachment instanceof spft.LinkedMeshAttachment) {
                    var display = new dbft.SharedMeshDisplay();
                    display.inheritDeform = attachment.deform;
                    display.name = attachmentName;
                    display.share = attachment.parent;
                    display.skin = attachment.skin;
                    display.path = attachment.path || attachment.name;
                    addDisplayToSlot(displays, display, slot.display);
                    if (textureAtlasScale < 0.0) {
                        textureAtlasScale = modifyTextureAtlasScale(display.path || display.name, attachment, result.textureAtlas);
                    }
                }
                else if (attachment instanceof spft.PathAttachment) {
                    var display = new dbft.PathDisplay();
                    display.name = attachment.name || attachmentName;
                    display.closed = attachment.closed;
                    display.constantSpeed = attachment.constantSpeed;
                    display.vertexCount = attachment.vertexCount;
                    display.lengths.length = attachment.lengths.length;
                    for (var i = 0, l = attachment.lengths.length; i < l; i++) {
                        display.lengths[i] = attachment.lengths[i];
                    }
                    //
                    // const bones = new Array<number>();
                    // // weight
                    // for (let iW = 0; iW < attachment.vertices.length;) {
                    //     const boneCount = attachment.vertices[iW++];
                    //     display.weights.push(boneCount);
                    //     let xG: number = 0.0;
                    //     let yG: number = 0.0;
                    //     for (let j = 0; j < boneCount; j++) {
                    //         const boneIndex = attachment.vertices[iW++];
                    //         const xL = attachment.vertices[iW++];
                    //         const yL = -attachment.vertices[iW++];
                    //         const weight = attachment.vertices[iW++];
                    //         const bone = armature.getBone(data.data.bones[boneIndex].name);
                    //         if (bone && bone._global) {
                    //             const boneIndex = armature.bone.indexOf(bone);
                    //             bone._global.toMatrix(geom.helpMatrixA);
                    //             geom.helpMatrixA.transformPoint(xL, yL, geom.helpPointA);
                    //             xG += geom.helpPointA.x * weight;
                    //             yG += geom.helpPointA.y * weight;
                    //             display.weights.push(boneIndex);
                    //             display.weights.push(weight);
                    //             if (bones.indexOf(boneIndex) < 0) {
                    //                 bones.push(boneIndex);
                    //                 display.bonePose.push(boneIndex, geom.helpMatrixA.a, geom.helpMatrixA.b, geom.helpMatrixA.c, geom.helpMatrixA.d, geom.helpMatrixA.tx, geom.helpMatrixA.ty);
                    //             }
                    //         }
                    //     }
                    //     display.vertices.push(xG, yG);
                    // }
                    // display.slotPose.push(1.0, 0.0, 0.0, 1.0, 0.0, 0.0);
                    //没有权重数据，这么这些就是曲线顶点数据
                    if (attachment.vertexCount * 2 === attachment.vertices.length) {
                        display.vertices.length = attachment.vertices.length;
                        for (var i = 0, l = attachment.vertices.length; i < l; i++) {
                            display.vertices[i] = attachment.vertices[i];
                        }
                    }
                    else { //有权重数据(boneCount:boneIndex:boneX:boneY:weight...)
                        for (var iW = 0; iW < attachment.vertices.length;) {
                            var boneCount = attachment.vertices[iW++];
                            display.weights.push(boneCount);
                            for (var j = 0; j < boneCount; j++) {
                                var boneIndex = attachment.vertices[iW++];
                                var xL = attachment.vertices[iW++];
                                var yL = -attachment.vertices[iW++];
                                var weight = attachment.vertices[iW++];
                                display.weights.push(boneIndex);
                                display.weights.push(weight);
                                display.vertices.push(xL, yL);
                                if (display.bones.indexOf(boneIndex) < 0) {
                                    display.bones.push(boneIndex);
                                }
                            }
                        }
                    }
                    slot.display.push(display);
                }
                else if (attachment instanceof spft.BoundingBoxAttachment) {
                    var display = new dbft.PolygonBoundingBoxDisplay();
                    display.name = attachmentName;
                    if (attachment.vertexCount < attachment.vertices.length / 2) { // Check
                        for (var i = 0, iW = 0; i < attachment.vertexCount; ++i) {
                            var boneCount = attachment.vertices[iW++];
                            var xG = 0.0;
                            var yG = 0.0;
                            for (var j = 0; j < boneCount; j++) {
                                var boneIndex = attachment.vertices[iW++];
                                var xL = attachment.vertices[iW++];
                                var yL = -attachment.vertices[iW++];
                                var weight = attachment.vertices[iW++];
                                var bone = armature.getBone(data.data.bones[boneIndex].name);
                                if (bone && bone._global) {
                                    bone._global.toMatrix(geom.helpMatrixA);
                                    geom.helpMatrixA.transformPoint(xL, yL, geom.helpPointA);
                                    xG += geom.helpPointA.x * weight;
                                    yG += geom.helpPointA.y * weight;
                                }
                            }
                            display.vertices.push(xG, yG);
                        }
                    }
                    else {
                        for (var i = 0; i < attachment.vertices.length; ++i) {
                            var v = attachment.vertices[i];
                            if (i % 2) {
                                display.vertices[i] = -v;
                            }
                            else {
                                display.vertices[i] = v;
                            }
                        }
                    }
                    addDisplayToSlot(displays, display, slot.display);
                }
                else {
                    var display = new dbft.ImageDisplay();
                    addDisplayToSlot(displays, display, slot.display);
                }
            }
            skin.slot.push(slot);
        }
        armature.skin.push(skin);
    }
    // for (const skin of armature.skin) { TODO
    //     for (const slot of skin.slot) {
    //         const displays = slotDisplays[slot.name];
    //         while (slot.display.length !== displays.length) {
    //             slot.display.push(null);
    //         }
    //     }
    // }
    for (var _g = 0, _h = data.data.slots; _g < _h.length; _g++) {
        var spSlot = _h[_g];
        var slot = new dbft.Slot();
        slot.name = spSlot.name;
        slot.parent = spSlot.bone;
        var displays = slotDisplays[slot.name];
        slot.displayIndex = displays ? displays.indexOf(spSlot.attachment) : -1;
        slot.color.copyFromRGBA(Number("0x" + spSlot.color));
        switch (spSlot.blend) {
            case "normal":
                slot.blendMode = dbft.BlendMode[dbft.BlendMode.Normal].toLowerCase();
                break;
            case "additive":
                slot.blendMode = dbft.BlendMode[dbft.BlendMode.Add].toLowerCase();
                break;
            case "multiply":
                // slot.blendMode = dbft.BlendMode[dbft.BlendMode.Multiply].toLowerCase();
                break;
            case "screen":
                // slot.blendMode = dbft.BlendMode[dbft.BlendMode.Screen].toLowerCase();
                break;
        }
        armature.slot.push(slot);
    }
    for (var _j = 0, _k = data.data.ik; _j < _k.length; _j++) {
        var spIK = _k[_j];
        var ik = new dbft.IKConstraint();
        ik.bendPositive = !spIK.bendPositive;
        ik.chain = spIK.bones.length > 1 ? 1 : 0;
        ik.weight = spIK.mix;
        ik.name = spIK.name;
        ik.bone = spIK.bones[spIK.bones.length - 1];
        ik.target = spIK.target;
        armature.ik.push(ik);
    }
    for (var _l = 0, _m = data.data.path; _l < _m.length; _l++) {
        var spPath = _m[_l];
        var path = new dbft.PathConstraint();
        path.name = spPath.name;
        path.positionMode = spPath.positionMode;
        path.spacingMode = spPath.spacingMode;
        path.rotateMode = spPath.rotateMode;
        path.position = spPath.position;
        path.spacing = spPath.spacing;
        path.rotateOffset = spPath.rotation;
        path.rotateMix = spPath.rotateMix;
        path.translateMix = spPath.translateMix;
        path.target = spPath.target;
        path.bones = spPath.bones;
        armature.path.push(path);
    }
    for (var animationName in data.data.animations) {
        var spAnimation = data.data.animations[animationName];
        var animation = new dbft.Animation();
        var lastFramePosition = 0;
        var iF = 0;
        animation.playTimes = 0;
        animation.name = animationName;
        for (var timelineName in spAnimation.bones) {
            var spTimeline = spAnimation.bones[timelineName];
            var timeline = new dbft.BoneTimeline();
            timeline.name = timelineName;
            iF = 0;
            for (var _o = 0, _p = spTimeline.translate; _o < _p.length; _o++) {
                var spFrame = _p[_o];
                var frame = new dbft.DoubleValueFrame0();
                frame._position = Math.floor(spFrame.time * result.frameRate);
                frame.x = spFrame.x;
                frame.y = -spFrame.y;
                setTweenFormSP(frame, spFrame, iF++ === spTimeline.translate.length - 1);
                timeline.translateFrame.push(frame);
                lastFramePosition = Math.max(frame._position, lastFramePosition);
            }
            iF = 0;
            for (var _q = 0, _r = spTimeline.rotate; _q < _r.length; _q++) {
                var spFrame = _r[_q];
                var frame = new dbft.BoneRotateFrame();
                frame._position = Math.floor(spFrame.time * result.frameRate);
                frame.rotate = -spFrame.angle;
                setTweenFormSP(frame, spFrame, iF++ === spTimeline.rotate.length - 1);
                timeline.rotateFrame.push(frame);
                lastFramePosition = Math.max(frame._position, lastFramePosition);
            }
            iF = 0;
            for (var _s = 0, _t = spTimeline.shear; _s < _t.length; _s++) {
                var spFrame = _t[_s];
                var position = Math.floor(spFrame.time * result.frameRate);
                var index = timeline.insertFrame(timeline.rotateFrame, position);
                if (index < 0) {
                    continue;
                }
                var frame = timeline.rotateFrame[index];
                frame.rotate += -spFrame.x;
                frame.skew = spFrame.x - spFrame.y;
                lastFramePosition = Math.max(position, lastFramePosition);
            }
            iF = 0;
            for (var _u = 0, _v = spTimeline.scale; _u < _v.length; _u++) {
                var spFrame = _v[_u];
                var frame = new dbft.DoubleValueFrame1();
                frame._position = Math.floor(spFrame.time * result.frameRate);
                frame.x = spFrame.x;
                frame.y = spFrame.y;
                setTweenFormSP(frame, spFrame, iF++ === spTimeline.scale.length - 1);
                timeline.scaleFrame.push(frame);
                lastFramePosition = Math.max(frame._position, lastFramePosition);
            }
            modifyFrames(timeline.translateFrame);
            modifyFrames(timeline.rotateFrame);
            modifyFrames(timeline.scaleFrame);
            animation.bone.push(timeline);
        }
        for (var timelineName in spAnimation.slots) {
            var spTimeline = spAnimation.slots[timelineName];
            var timeline = new dbft.SlotTimeline();
            timeline.name = timelineName;
            for (var _w = 0, _x = spTimeline.attachment; _w < _x.length; _w++) {
                var spFrame = _x[_w];
                var frame = new dbft.SlotDisplayFrame();
                var displays = slotDisplays[timelineName];
                frame._position = Math.floor(spFrame.time * result.frameRate);
                frame.value = displays ? displays.indexOf(spFrame.name) : -1;
                timeline.displayFrame.push(frame);
                lastFramePosition = Math.max(frame._position, lastFramePosition);
            }
            iF = 0;
            for (var _y = 0, _z = spTimeline.color; _y < _z.length; _y++) {
                var spFrame = _z[_y];
                var frame = new dbft.SlotColorFrame();
                frame._position = Math.floor(spFrame.time * result.frameRate);
                frame.value.copyFromRGBA(Number("0x" + spFrame.color));
                setTweenFormSP(frame, spFrame, iF++ === spTimeline.color.length - 1);
                timeline.colorFrame.push(frame);
                lastFramePosition = Math.max(frame._position, lastFramePosition);
            }
            modifyFrames(timeline.displayFrame);
            modifyFrames(timeline.colorFrame);
            animation.slot.push(timeline);
        }
        var deformKey = "";
        for (deformKey in spAnimation.deform) {
            break;
        }
        var spTimelines = deformKey ? spAnimation.deform : spAnimation.ffd;
        for (var skinName in spTimelines) {
            var slots = spTimelines[skinName];
            for (var slotName in slots) {
                var timelines = slots[slotName];
                for (var timelineName in timelines) {
                    var meshName = timelineName;
                    var meshDisplay = armature.getDisplay(skinName, slotName, meshName);
                    if (!meshDisplay) {
                        continue;
                    }
                    var timeline = new dbft.SlotDeformTimeline();
                    var spFrames = timelines[timelineName];
                    timeline.name = meshName;
                    timeline.skin = skinName;
                    timeline.slot = slotName;
                    iF = 0;
                    for (var _0 = 0, spFrames_1 = spFrames; _0 < spFrames_1.length; _0++) {
                        var spFrame = spFrames_1[_0];
                        var frame = new dbft.MutilpleValueFrame();
                        frame._position = Math.floor(spFrame.time * result.frameRate);
                        setTweenFormSP(frame, spFrame, iF++ === spFrames.length - 1);
                        timeline.frame.push(frame);
                        if (meshDisplay.weights.length > 0) {
                            for (var i = 0; i < spFrame.offset; ++i) {
                                spFrame.vertices.unshift(0.0);
                            }
                            for (var i = 0, iW = 0, iV = 0; i < meshDisplay.vertices.length; i += 2) {
                                var boneCount = meshDisplay.weights[iW++];
                                var xG = 0.0;
                                var yG = 0.0;
                                for (var j = 0; j < boneCount; j++) {
                                    var boneIndex = meshDisplay.weights[iW++];
                                    var weight = meshDisplay.weights[iW++];
                                    var bone = armature.bone[boneIndex];
                                    if (bone && bone._global) {
                                        var xL = spFrame.vertices[iV++] || 0.0;
                                        var yL = -spFrame.vertices[iV++] || 0.0;
                                        bone._global.toMatrix(geom.helpMatrixA);
                                        geom.helpMatrixA.transformPoint(xL, yL, geom.helpPointA, true);
                                        if (xL !== 0.0) {
                                            xG += geom.helpPointA.x * weight;
                                        }
                                        if (yL !== 0.0) {
                                            yG += geom.helpPointA.y * weight;
                                        }
                                    }
                                }
                                frame.vertices[i] = xG;
                                frame.vertices[i + 1] = yG;
                            }
                        }
                        else {
                            frame.offset = spFrame.offset;
                            for (var i = 0, l = spFrame.vertices.length; i < l; ++i) {
                                if ((frame.offset + i) % 2) {
                                    frame.vertices.push(-spFrame.vertices[i]);
                                }
                                else {
                                    frame.vertices.push(spFrame.vertices[i]);
                                }
                            }
                        }
                        lastFramePosition = Math.max(frame._position, lastFramePosition);
                    }
                    modifyFrames(timeline.frame);
                    animation.ffd.push(timeline);
                }
            }
        }
        for (var ikConstraintName in spAnimation.ik) {
            var spFrames = spAnimation.ik[ikConstraintName];
            var timeline = new dbft.IKConstraintTimeline();
            timeline.name = ikConstraintName;
            iF = 0;
            for (var _1 = 0, spFrames_2 = spFrames; _1 < spFrames_2.length; _1++) {
                var spFrame = spFrames_2[_1];
                var frame = new dbft.IKConstraintFrame();
                frame._position = Math.floor(spFrame.time * result.frameRate);
                frame.bendPositive = !spFrame.bendPositive;
                frame.weight = spFrame.mix;
                setTweenFormSP(frame, spFrame, iF++ === spFrames.length - 1);
                timeline.frame.push(frame);
                lastFramePosition = Math.max(frame._position, lastFramePosition);
            }
            modifyFrames(timeline.frame);
        }
        if (spAnimation.events.length > 0) {
            spAnimation.events.sort(function (a, b) {
                return a.time > b.time ? 1 : -1;
            });
            var prevFrame = null;
            for (var _2 = 0, _3 = spAnimation.events; _2 < _3.length; _2++) {
                var spFrame = _3[_2];
                var position = Math.floor(spFrame.time * result.frameRate);
                var frame = void 0;
                if (prevFrame && prevFrame._position === position) {
                    frame = prevFrame;
                }
                else {
                    frame = new dbft.ActionFrame();
                    frame._position = position;
                    animation.frame.push(frame);
                    prevFrame = frame;
                }
                var spEvent = data.data.events[spFrame.name];
                var action = new dbft.Action();
                action.type = dbft.ActionType.Frame;
                action.name = spFrame.name;
                if (spFrame.int || spEvent.int) {
                    action.ints.push(spFrame.int || spEvent.int);
                }
                if (spFrame.float || spEvent.float) {
                    action.floats.push(spFrame.float || spEvent.float);
                }
                if (spFrame.string || spEvent.string) {
                    action.strings.push(spFrame.string || spEvent.string);
                }
                frame.actions.push(action);
                lastFramePosition = Math.max(frame._position, lastFramePosition);
            }
            modifyFrames(animation.frame);
        }
        if (spAnimation.drawOrder.length > 0) {
            animation.zOrder = new dbft.ZOrderTimeline();
            for (var _4 = 0, _5 = spAnimation.drawOrder; _4 < _5.length; _4++) {
                var spFrame = _5[_4];
                var frame = new dbft.MutilpleValueFrame();
                frame._position = Math.floor(spFrame.time * result.frameRate);
                for (var _6 = 0, _7 = spFrame.offsets; _6 < _7.length; _6++) {
                    var v = _7[_6];
                    var slot = armature.getSlot(v.slot);
                    frame.zOrder.push(slot ? armature.slot.indexOf(slot) : -1, v.offset);
                }
                animation.zOrder.frame.push(frame);
                lastFramePosition = Math.max(frame._position, lastFramePosition);
            }
            modifyFrames(animation.zOrder.frame);
        }
        animation.duration = lastFramePosition + 1;
        armature.animation.push(animation);
    }
    if (textureAtlasScale > 0.0) {
        for (var _8 = 0, _9 = result.textureAtlas; _8 < _9.length; _8++) {
            var textureAtlas = _9[_8];
            textureAtlas.scale = textureAtlasScale;
        }
    }
    return result;
}
exports.default = default_1;
function modifyTextureAtlasScale(textureName, attachment, textureAtlases) {
    var texture = dbft.getTextureFormTextureAtlases(textureName, textureAtlases);
    if (texture) {
        if (texture.frameWidth) {
            return texture.frameWidth / attachment.width;
        }
        if (texture.rotated) {
            return texture.width / attachment.height;
        }
        return texture.width / attachment.width;
    }
    return -1;
}
function setTweenFormSP(dbFrame, spFrame, isLastFrame) {
    if (isLastFrame) {
        return;
    }
    if (spFrame.curve instanceof Array) {
        dbFrame.curve = spFrame.curve;
    }
    else if (spFrame.curve === "linear") {
        dbFrame.tweenEasing = 0.0;
    }
    else {
        dbFrame.tweenEasing = NaN;
    }
}
function modifyFrames(frames) {
    if (frames.length === 0) {
        return;
    }
    if (frames[0]._position !== 0) {
        var frame = new frames[0].constructor();
        if (frame instanceof dbft.TweenFrame) {
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
function readValue(line) {
    if (line === undefined || line === null) {
        throw new Error("Invalid line: " + line);
    }
    var colon = line.indexOf(":");
    if (colon === -1)
        throw new Error("Invalid line: " + line);
    return line.substring(colon + 1).trim();
}
function readTuple(tuple, line) {
    if (line === undefined || line === null) {
        throw new Error("Invalid line: " + line);
    }
    var colon = line.indexOf(":");
    if (colon === -1)
        throw new Error("Invalid line: " + line);
    var i = 0, lastMatch = colon + 1;
    for (; i < 3; i++) {
        var comma = line.indexOf(",", lastMatch);
        if (comma === -1)
            break;
        tuple[i] = line.substr(lastMatch, comma - lastMatch).trim();
        lastMatch = comma + 1;
    }
    tuple[i] = line.substring(lastMatch).trim();
    return i + 1;
}
