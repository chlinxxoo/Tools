"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils = require("../common/utils");
var geom = require("../format/geom");
var dbft = require("../format/dragonBonesFormat");
var spft = require("../format/spineFormat");
/**
 * Convert DragonBones format to Spine format.
 */
function default_1(data, version, addTextureAtlasSuffix) {
    var result = { spines: [], textureAtlas: "" };
    for (var _i = 0, _a = data.armature; _i < _a.length; _i++) {
        var armature = _a[_i];
        var frameRate = armature.frameRate > 0 ? armature.frameRate : data.frameRate;
        var spine = new spft.Spine();
        spine.skeleton.width = armature.aabb.width;
        spine.skeleton.height = armature.aabb.height;
        spine.skeleton.fps = frameRate;
        spine.skeleton.spine = version;
        spine.skeleton.hash = " ";
        spine.skeleton.name = armature.name;
        result.spines.push(spine);
        for (var _b = 0, _c = armature.bone; _b < _c.length; _b++) {
            var bone = _c[_b];
            var spBone = new spft.Bone();
            spBone.inheritRotation = bone.inheritRotation;
            spBone.inheritScale = bone.inheritScale;
            spBone.length = bone.length;
            spBone.x = bone.transform.x;
            spBone.y = -bone.transform.y;
            spBone.rotation = -bone.transform.skY;
            spBone.shearX = 0.0;
            spBone.shearY = -(bone.transform.skX - bone.transform.skY);
            spBone.scaleX = bone.transform.scX;
            spBone.scaleY = bone.transform.scY;
            spBone.name = bone.name;
            spBone.parent = bone.parent;
            if (spBone.inheritRotation && spBone.inheritScale) {
                spBone.transform = "normal";
            }
            else if (spBone.inheritRotation && !spBone.inheritScale) {
                spBone.transform = "noScale";
            }
            else if (!spBone.inheritRotation && spBone.inheritScale) {
                spBone.transform = "noRotationOrReflection";
            }
            else {
                spBone.transform = "onlyTranslation";
            }
            spine.bones.push(spBone);
        }
        var defaultSkin = armature.skin.length > 0 ? armature.skin[0] : null;
        for (var _d = 0, _e = armature.slot; _d < _e.length; _d++) {
            var slot = _e[_d];
            var spSlot = new spft.Slot();
            spSlot.name = slot.name;
            spSlot.bone = slot.parent;
            spSlot.color = utils.rgbaToHex(Math.round(slot.color.rM * 2.55), Math.round(slot.color.gM * 2.55), Math.round(slot.color.bM * 2.55), Math.round(slot.color.aM * 2.55)).toUpperCase();
            switch (utils.getEnumFormString(dbft.BlendMode, slot.blendMode)) {
                case dbft.BlendMode.Normal:
                    spSlot.blend = "normal";
                    break;
                case dbft.BlendMode.Add:
                    spSlot.blend = "additive";
                    break;
                case dbft.BlendMode.Multiply:
                    spSlot.blend = "multiply";
                    break;
                case dbft.BlendMode.Screen:
                    spSlot.blend = "screen";
                    break;
            }
            if (slot.displayIndex >= 0) {
                if (defaultSkin !== null) {
                    var skinSlot = defaultSkin.getSlot(slot.name);
                    if (skinSlot !== null) {
                        var display = skinSlot.display[slot.displayIndex];
                        if (display) {
                            spSlot.attachment = display.name;
                        }
                    }
                }
            }
            spine.slots.push(spSlot);
        }
        for (var _f = 0, _g = armature.ik; _f < _g.length; _f++) {
            var ikConstraint = _g[_f];
            var spIKConstraint = new spft.IKConstraint();
            spIKConstraint.bendPositive = !ikConstraint.bendPositive;
            spIKConstraint.mix = ikConstraint.weight;
            spIKConstraint.name = ikConstraint.name;
            spIKConstraint.target = ikConstraint.target;
            if (ikConstraint.chain > 0) {
                spIKConstraint.bones.push(armature.getBone(ikConstraint.bone).parent);
            }
            spIKConstraint.bones.push(ikConstraint.bone);
            spine.ik.push(spIKConstraint);
        }
        for (var _h = 0, _j = armature.skin; _h < _j.length; _h++) {
            var skin = _j[_h];
            var skinName = skin.name;
            var spSkins = {};
            for (var _k = 0, _l = skin.slot; _k < _l.length; _k++) {
                var slot = _l[_k];
                var spSlots = {};
                for (var _m = 0, _o = slot.display; _m < _o.length; _m++) {
                    var display = _o[_m];
                    if (display instanceof dbft.ImageDisplay) {
                        var spAttachment = new spft.RegionAttachment();
                        spAttachment.x = display.transform.x;
                        spAttachment.y = -display.transform.y;
                        spAttachment.rotation = -display.transform.skY;
                        spAttachment.scaleX = display.transform.scX;
                        spAttachment.scaleY = display.transform.scY;
                        spAttachment.name = display.name;
                        spAttachment.path = display.path;
                        var texture = dbft.getTextureFormTextureAtlases(display.path || display.name, data.textureAtlas);
                        if (texture) {
                            spAttachment.width = texture.width;
                            spAttachment.height = texture.height;
                        }
                        spSlots[spAttachment.name] = spAttachment;
                    }
                    else if (display instanceof dbft.MeshDisplay) {
                        var spAttachment = new spft.MeshAttachment();
                        spAttachment.name = display.name;
                        spAttachment.path = display.path;
                        spAttachment.uvs = display.uvs;
                        spAttachment.triangles = display.triangles;
                        var texture = dbft.getTextureFormTextureAtlases(display.path || display.name, data.textureAtlas);
                        if (texture) {
                            spAttachment.width = texture.width;
                            spAttachment.height = texture.height;
                        }
                        for (var _p = 0, _q = dbft.getEdgeFormTriangles(display.triangles); _p < _q.length; _p++) {
                            var index_1 = _q[_p];
                            spAttachment.edges.push(index_1 * 2);
                        }
                        spAttachment.hull = spAttachment.edges.length / 2;
                        if (display.userEdges.length > 0) {
                            for (var _r = 0, _s = display.userEdges; _r < _s.length; _r++) {
                                var index_2 = _s[_r];
                                spAttachment.edges.push(index_2 * 2);
                            }
                        }
                        if (display.weights.length > 0) {
                            for (var i = 0, iW = 0, l = display.vertices.length; i < l; i += 2) {
                                var x = display.vertices[i];
                                var y = display.vertices[i + 1];
                                var boneCount = display.weights[iW++];
                                spAttachment.vertices.push(boneCount);
                                for (var j = 0; j < boneCount; ++j) {
                                    var boneIndex = display.weights[iW++];
                                    var boneWeight = display.weights[iW++];
                                    geom.helpMatrixA.copyFromArray(display.bonePose, display.getBonePoseOffset(boneIndex) + 1);
                                    geom.helpMatrixA.invert();
                                    geom.helpMatrixA.transformPoint(x, y, geom.helpPointA);
                                    spAttachment.vertices.push(boneIndex, Number(geom.helpPointA.x.toFixed(2)), -Number((geom.helpPointA.y).toFixed(2)), boneWeight);
                                }
                            }
                        }
                        else {
                            for (var i = 0, l = display.vertices.length; i < l; i += 2) {
                                spAttachment.vertices.push(Number(display.vertices[i].toFixed(2)), -Number(display.vertices[i + 1].toFixed(2)));
                            }
                        }
                        spSlots[spAttachment.name] = spAttachment;
                    }
                    else if (display instanceof dbft.SharedMeshDisplay) {
                        var spAttachment = new spft.LinkedMeshAttachment();
                        spAttachment.deform = display.inheritDeform;
                        spAttachment.name = display.name;
                        spAttachment.parent = display.share;
                        spAttachment.skin = skinName;
                        spSlots[spAttachment.name] = spAttachment;
                    }
                    else if (display instanceof dbft.PolygonBoundingBoxDisplay) {
                        var spAttachment = new spft.BoundingBoxAttachment();
                        spAttachment.vertexCount = display.vertices.length / 2;
                        spAttachment.name = display.name;
                        for (var i = 0, l = display.vertices.length; i < l; i += 2) {
                            spAttachment.vertices[i] = display.vertices[i];
                            spAttachment.vertices[i + 1] = -display.vertices[i + 1];
                        }
                        spSlots[spAttachment.name] = spAttachment;
                    }
                }
                spSkins[slot.name] = spSlots;
            }
            spine.skins[skinName] = spSkins;
        }
        for (var _t = 0, _u = armature.animation; _t < _u.length; _t++) {
            var animation = _u[_t];
            if (animation instanceof dbft.AnimationBinary) {
                continue;
            }
            var iF = 0;
            var position = 0.0;
            var spAnimation = new spft.Animation();
            if (animation.frame.length > 0) {
                var position_1 = 0.0;
                for (var _v = 0, _w = animation.frame; _v < _w.length; _v++) {
                    var frame = _w[_v];
                    for (var _x = 0, _y = frame.actions; _x < _y.length; _x++) {
                        var action = _y[_x];
                        var eventName = action.name;
                        switch (action.type) {
                            case dbft.ActionType.Frame:
                                eventName = action.name;
                                break;
                            case dbft.ActionType.Sound:
                                eventName = "soundEvent";
                                break;
                            case dbft.ActionType.Play:
                                eventName = "playEvent";
                                break;
                        }
                        var spFrame = new spft.EventFrame();
                        spFrame.time = position_1;
                        spFrame.name = eventName;
                        spAnimation.events.push(spFrame);
                        var event_1 = spine.events[eventName];
                        if (!event_1) {
                            event_1 = new spft.Event();
                            event_1.name = eventName;
                            spine.events[eventName] = event_1;
                            switch (action.type) {
                                case dbft.ActionType.Frame:
                                    event_1.string = action.bone;
                                    break;
                                case dbft.ActionType.Sound:
                                    event_1.string = action.name;
                                    break;
                                case dbft.ActionType.Play:
                                    event_1.string = action.name;
                                    break;
                            }
                            if (action.ints.length > 0) {
                                event_1.int = action.ints[0];
                            }
                            if (action.floats.length > 0) {
                                event_1.float = action.floats[0];
                            }
                            if (action.strings.length > 0) {
                                event_1.string = action.strings[0];
                            }
                        }
                        else {
                            switch (action.type) {
                                case dbft.ActionType.Frame:
                                    spFrame.string = action.bone;
                                    break;
                                case dbft.ActionType.Sound:
                                    spFrame.string = action.name;
                                    break;
                                case dbft.ActionType.Play:
                                    spFrame.string = action.name;
                                    break;
                            }
                            if (action.ints.length > 0) {
                                spFrame.int = action.ints[0];
                            }
                            if (action.floats.length > 0) {
                                spFrame.float = action.floats[0];
                            }
                            if (action.strings.length > 0) {
                                spFrame.string = action.strings[0];
                            }
                        }
                    }
                    position_1 += frame.duration / frameRate;
                    position_1 = Number(position_1.toFixed(4));
                }
            }
            if (animation.zOrder) {
                var position_2 = 0.0;
                for (var _z = 0, _0 = animation.zOrder.frame; _z < _0.length; _z++) {
                    var frame = _0[_z];
                    var spFrame = new spft.DrawOrderFrame();
                    spFrame.time = position_2;
                    for (var i = 0, l = frame.zOrder.length; i < l; i += 2) {
                        spFrame.offsets.push({
                            slot: armature.slot[frame.zOrder[i]].name,
                            offset: frame.zOrder[i + 1]
                        });
                    }
                    spAnimation.drawOrder.push(spFrame);
                    position_2 += frame.duration / frameRate;
                    position_2 = Number(position_2.toFixed(4));
                }
            }
            for (var _1 = 0, _2 = animation.bone; _1 < _2.length; _1++) {
                var timeline = _2[_1];
                var spTimelines = new spft.BoneTimelines();
                spAnimation.bones[timeline.name] = spTimelines;
                iF = 0;
                position = 0.0;
                for (var _3 = 0, _4 = timeline.translateFrame; _3 < _4.length; _3++) {
                    var frame = _4[_3];
                    var spFrame = new spft.TranslateFrame();
                    spFrame.time = position;
                    spFrame.x = frame.x;
                    spFrame.y = -frame.y;
                    setCurveFormDB(spFrame, frame, iF++ === timeline.translateFrame.length - 1);
                    spTimelines.translate.push(spFrame);
                    position += frame.duration / frameRate;
                    position = Number(position.toFixed(4));
                }
                iF = 0;
                position = 0.0;
                for (var _5 = 0, _6 = timeline.rotateFrame; _5 < _6.length; _5++) {
                    var frame = _6[_5];
                    var spRotateFrame = new spft.RotateFrame();
                    spRotateFrame.time = position;
                    spRotateFrame.angle = -frame.rotate;
                    setCurveFormDB(spRotateFrame, frame, iF === timeline.rotateFrame.length - 1);
                    spTimelines.rotate.push(spRotateFrame);
                    var spShearFrame = new spft.ShearFrame();
                    spShearFrame.time = position;
                    spShearFrame.x = 0.0;
                    spShearFrame.y = -frame.skew;
                    setCurveFormDB(spShearFrame, frame, iF === timeline.rotateFrame.length - 1);
                    spTimelines.shear.push(spShearFrame);
                    iF++;
                    position += frame.duration / frameRate;
                    position = Number(position.toFixed(4));
                }
                iF = 0;
                position = 0.0;
                for (var _7 = 0, _8 = timeline.scaleFrame; _7 < _8.length; _7++) {
                    var frame = _8[_7];
                    var spFrame = new spft.ScaleFrame();
                    spFrame.time = position;
                    spFrame.x = frame.x;
                    spFrame.y = frame.y;
                    setCurveFormDB(spFrame, frame, iF++ === timeline.scaleFrame.length - 1);
                    spTimelines.scale.push(spFrame);
                    position += frame.duration / frameRate;
                    position = Number(position.toFixed(4));
                }
            }
            for (var _9 = 0, _10 = animation.slot; _9 < _10.length; _9++) {
                var timeline = _10[_9];
                var skinSlot = defaultSkin === null ? null : defaultSkin.getSlot(timeline.name);
                var spTimelines = new spft.SlotTimelines();
                spAnimation.slots[timeline.name] = spTimelines;
                position = 0.0;
                for (var _11 = 0, _12 = timeline.displayFrame; _11 < _12.length; _11++) {
                    var frame = _12[_11];
                    var spFrame = new spft.AttachmentFrame();
                    spFrame.time = position;
                    spTimelines.attachment.push(spFrame);
                    if (frame.value < 0 || skinSlot === null) {
                        spFrame.name = "";
                    }
                    else {
                        var display = skinSlot.display[frame.value];
                        if (display) {
                            spFrame.name = display.name;
                        }
                    }
                    position += frame.duration / frameRate;
                    position = Number(position.toFixed(4));
                }
                iF = 0;
                position = 0.0;
                for (var _13 = 0, _14 = timeline.colorFrame; _13 < _14.length; _13++) {
                    var frame = _14[_13];
                    var spFrame = new spft.ColorFrame();
                    spFrame.time = position;
                    setCurveFormDB(spFrame, frame, iF++ === timeline.colorFrame.length - 1);
                    spTimelines.color.push(spFrame);
                    spFrame.color = utils.rgbaToHex(Math.round(frame.value.rM * 2.55), Math.round(frame.value.gM * 2.55), Math.round(frame.value.bM * 2.55), Math.round(frame.value.aM * 2.55)).toUpperCase();
                    position += frame.duration / frameRate;
                    position = Number(position.toFixed(4));
                }
            }
            for (var _15 = 0, _16 = animation.ffd; _15 < _16.length; _15++) {
                var timeline = _16[_15];
                var deformFrames = new Array();
                var skins_1 = spAnimation.deform[timeline.skin] = spAnimation.deform[timeline.skin] || {};
                var slots = skins_1[timeline.slot] = skins_1[timeline.slot] || {};
                var meshDisplay = armature.getDisplay(timeline.skin, timeline.slot, timeline.name);
                if (!meshDisplay) {
                    continue;
                }
                slots[timeline.name] = deformFrames;
                iF = 0;
                position = 0.0;
                for (var _17 = 0, _18 = timeline.frame; _17 < _18.length; _17++) {
                    var frame = _18[_17];
                    var spFrame = new spft.DeformFrame();
                    deformFrames.push(spFrame);
                    spFrame.time = position;
                    setCurveFormDB(spFrame, frame, iF++ === timeline.frame.length - 1);
                    for (var j = 0; j < frame.offset; ++j) {
                        spFrame.vertices.push(0.0);
                    }
                    for (var _19 = 0, _20 = frame.vertices; _19 < _20.length; _19++) {
                        var value = _20[_19];
                        spFrame.vertices.push(value);
                    }
                    while (spFrame.vertices.length < meshDisplay.vertices.length) {
                        spFrame.vertices.push(0.0);
                    }
                    for (var i = 0, l = spFrame.vertices.length; i < l; i += 2) {
                        spFrame.vertices[i + 1] = -spFrame.vertices[i + 1];
                    }
                    var begin = 0;
                    while (spFrame.vertices[begin] === 0.0) {
                        begin++;
                        if (begin === spFrame.vertices.length - 1) {
                            break;
                        }
                    }
                    var end = spFrame.vertices.length;
                    while (end > begin && spFrame.vertices[end - 1] === 0.0) {
                        end--;
                    }
                    var index_3 = 0;
                    for (var i = begin; i < end; ++i) {
                        spFrame.vertices[index_3++] = spFrame.vertices[i];
                    }
                    spFrame.offset = begin;
                    spFrame.vertices.length = end - begin + 1;
                    position += frame.duration / frameRate;
                    position = Number(position.toFixed(4));
                }
            }
            for (var _21 = 0, _22 = animation.ik; _21 < _22.length; _21++) {
                var timeline = _22[_21];
                iF = 0;
                position = 0.0;
                for (var _23 = 0, _24 = timeline.frame; _23 < _24.length; _23++) {
                    var frame = _24[_23];
                    var spFrame = new spft.IKConstraintFrame();
                    spFrame.time = position;
                    setCurveFormDB(spFrame, frame, iF++ === timeline.frame.length - 1);
                    spFrame.bendPositive = !frame.bendPositive;
                    spFrame.mix = frame.weight;
                    position += frame.duration / frameRate;
                    position = Number(position.toFixed(4));
                }
            }
            spine.animations[animation.name] = spAnimation;
        }
    }
    var index = data.textureAtlas.length > 1 ? 0 : -1;
    for (var _25 = 0, _26 = data.textureAtlas; _25 < _26.length; _25++) {
        var textureAtlas = _26[_25];
        result.textureAtlas += "\n";
        result.textureAtlas += "" + data.name + (addTextureAtlasSuffix ? "_spine" : "") + (data.textureAtlas.length > 1 ? "_" + index : "") + ".png\n";
        result.textureAtlas += "size: " + textureAtlas.width + "," + textureAtlas.height + "\n";
        result.textureAtlas += "format: RGBA8888\n";
        result.textureAtlas += "filter: Linear,Linear\n";
        result.textureAtlas += "repeat: none\n";
        for (var _27 = 0, _28 = textureAtlas.SubTexture; _27 < _28.length; _27++) {
            var texture = _28[_27];
            result.textureAtlas += texture.name + "\n";
            result.textureAtlas += "  rotate: " + texture.rotated + "\n"; // TODO db rotate is reverse to spine 
            result.textureAtlas += "  xy: " + texture.x + ", " + texture.y + "\n";
            result.textureAtlas += "  size: " + texture.width + ", " + texture.height + "\n";
            result.textureAtlas += "  orig: " + (texture.frameWidth || texture.width) + ", " + (texture.frameHeight || texture.height) + "\n";
            result.textureAtlas += "  offset: " + -(texture.frameX || 0) + ", " + (texture.frameHeight > 0 ? texture.frameHeight + texture.frameY - (texture.rotated ? texture.width : texture.height) : 0) + "\n";
            result.textureAtlas += "  index: " + index + "\n";
        }
        index++;
    }
    return result;
}
exports.default = default_1;
function setCurveFormDB(spFrame, dbFrame, isLastFrame) {
    if (isLastFrame) {
        return;
    }
    if (dbFrame.curve.length > 0) {
        spFrame.curve = [];
        spFrame.curve.push(dbFrame.curve[0] || 0, dbFrame.curve[1] || 0, dbFrame.curve[dbFrame.curve.length - 2] || 0, dbFrame.curve[dbFrame.curve.length - 1] || 1);
    }
    else if (isNaN(dbFrame.tweenEasing)) {
        spFrame.curve = "stepped";
    }
    else {
        spFrame.curve = "linear";
    }
}
