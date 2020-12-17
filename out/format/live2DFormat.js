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
exports.BinaryReader = exports.Timeline = exports.Animation = exports.TimelineInfo = exports.AnimationInfo = exports.AvatarPartsItem = exports.AvatarTextureInfo = exports.Mesh = exports.Display = exports.Surface = exports.Bone = exports.BaseDisplay = exports.BaseBone = exports.Part = exports.Model = exports.UVInfo = exports.Color = exports.Rectangle = exports.Point = exports.Transform = exports.Matrix = exports.parseMotion = exports.parseModel = void 0;
function parseModel(buffer) {
    var reader = new BinaryReader(buffer);
    var num = reader.readByte();
    var num2 = reader.readByte();
    var num3 = reader.readByte();
    if (((num !== 0x6d) || (num2 !== 0x6f)) || (num3 !== 0x63)) {
        console.log("Invalid model data.");
        return null;
    }
    var version = reader.readByte();
    reader.version = version;
    if (version > 11) {
        console.log("Invalid model version:", version);
        return null;
    }
    var model = reader.readObject();
    return model;
}
exports.parseModel = parseModel;
function parseMotion(rawData) {
    var index = rawData.indexOf("# Live2D Animator Motion Data");
    if (index < 0) {
        console.log("Invalid motion data.");
        return null;
    }
    rawData = rawData.replace(/\n/g, "");
    rawData = rawData.replace(/\r\r/g, "\r");
    rawData = rawData.replace(/\r\r/g, "\r");
    var motion = { frameRate: 30, fade_in: 0, fade_out: 0, values: {}, alphas: {} };
    var lines = rawData.split("\r");
    for (var i = 1, l = lines.length; i < l; ++i) {
        var line = lines[i];
        if (line.indexOf("#") >= 0) {
        }
        else if (line.indexOf("$") >= 0) {
            line = line.replace("$", "");
            var kv = line.split("=");
            if (kv.length < 2) {
                continue;
            }
            if (kv[0] === "fps") {
                motion.frameRate = Number(kv[1]);
            }
            else if (kv[0] === "fadein") {
                motion.fade_in = Number(kv[1]);
            }
            else if (kv[0] === "fadeout") {
                motion.fade_out = Number(kv[1]);
            }
            else {
            }
        }
        else {
            var kv = line.split("=");
            if (kv.length < 2) {
                continue;
            }
            var key = kv[0];
            if (key.indexOf(":") < 0) {
                motion.values[key] = kv[1].split(",").map(function (value) { return Number(value); });
            }
            else if (key.indexOf("VISIBLE") >= 0) {
                key = key.split(":").pop();
                motion.alphas[key] = kv[1].split(",").map(function (value) { return Number(value); });
            }
            else {
            }
        }
    }
    return motion;
}
exports.parseMotion = parseMotion;
var Matrix = /** @class */ (function () {
    function Matrix(v1, v2, v3, v4, v5, v6) {
        this.m00 = 1.0;
        this.m11 = 1.0;
        this.m00 = v1;
        this.m10 = v2;
        this.m01 = v3;
        this.m11 = v4;
        this.m02 = v5;
        this.m12 = v6;
    }
    return Matrix;
}());
exports.Matrix = Matrix;
var Transform = /** @class */ (function () {
    function Transform() {
        this.reflectX = false;
        this.reflectY = false;
    }
    Transform.prototype.read = function (reader) {
        this.x = reader.readFloat();
        this.y = reader.readFloat();
        this.scaleX = reader.readFloat();
        this.scaleY = reader.readFloat();
        this.rotate = reader.readFloat();
        if (reader.version >= 10) { // TODO
            this.reflectX = reader.readBool();
            this.reflectY = reader.readBool();
        }
    };
    Transform.prototype.copyFrom = function (value) {
        this.x = value.x;
        this.y = value.y;
        this.scaleX = value.scaleX;
        this.scaleY = value.scaleY;
        this.rotate = value.rotate;
        this.reflectX = value.reflectX;
        this.reflectY = value.reflectY;
        return this;
    };
    Transform.prototype.add = function (value) {
        this.x += value.x;
        this.y += value.y;
        this.scaleX += value.scaleX;
        this.scaleY += value.scaleY;
        this.rotate += value.rotate;
        return this;
    };
    Transform.prototype.minus = function (value) {
        this.x -= value.x;
        this.y -= value.y;
        this.scaleX -= value.scaleX;
        this.scaleY -= value.scaleY;
        this.rotate -= value.rotate;
        return this;
    };
    Transform.prototype.interpolation = function (valueA, valueB, t) {
        Transform._helper.copyFrom(valueB).minus(valueA);
        Transform._helper.x *= t;
        Transform._helper.y *= t;
        Transform._helper.scaleX *= t;
        Transform._helper.scaleY *= t;
        Transform._helper.rotate *= t;
        this.copyFrom(valueA).add(Transform._helper); // 
        return this;
    };
    Transform._helper = new Transform();
    return Transform;
}());
exports.Transform = Transform;
var Point = /** @class */ (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    return Point;
}());
exports.Point = Point;
var Rectangle = /** @class */ (function () {
    function Rectangle(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    return Rectangle;
}());
exports.Rectangle = Rectangle;
var Color = /** @class */ (function () {
    function Color(color, useAlpha) {
        this.color = color;
        if (!useAlpha) {
            this.color |= -16777216;
        }
    }
    return Color;
}());
exports.Color = Color;
var UVInfo = /** @class */ (function () {
    function UVInfo() {
        this.convertedTextureIndex = -1;
        this.scaleX = 1.0;
        this.scaleY = 1.0;
    }
    return UVInfo;
}());
exports.UVInfo = UVInfo;
var Model = /** @class */ (function () {
    function Model() {
        //
        this.frameCount = 120;
        this.displays = [];
    }
    Model.prototype.read = function (reader) {
        this.animations = reader.readObject();
        this.parts = reader.readObject();
        this.stageWidth = reader.readInt();
        this.stageHeight = reader.readInt();
        var index = 0;
        for (var _i = 0, _a = this.parts; _i < _a.length; _i++) {
            var part = _a[_i];
            for (var _b = 0, _c = part.bones; _b < _c.length; _b++) {
                var bone = _c[_b];
                for (var _d = 0, _e = bone.animation.timelines; _d < _e.length; _d++) {
                    var timeline = _e[_d];
                    var timelineInfo = this.getTimelineInfo(timeline.name);
                    if (!timelineInfo) {
                        continue;
                    }
                    var internal = 999999.0;
                    for (var i = 0, l = timeline.frames.length; i < l; ++i) {
                        if (i !== 0) {
                            internal = Math.min(Math.abs(timeline.frames[i] - timeline.frames[i - 1]), internal);
                        }
                    }
                    this.frameCount = Math.max(Math.ceil((timelineInfo.maximum - timelineInfo.minimum) / internal) * 3, this.frameCount);
                }
            }
            for (var _f = 0, _g = part.displays; _f < _g.length; _f++) {
                var display = _g[_f];
                display.zOrder = index++;
                this.displays.push(display);
            }
        }
    };
    Model.prototype.getPart = function (name) {
        for (var _i = 0, _a = this.parts; _i < _a.length; _i++) {
            var part = _a[_i];
            if (part.name === name) {
                return part;
            }
        }
        return null;
    };
    Model.prototype.getBone = function (name) {
        for (var _i = 0, _a = this.parts; _i < _a.length; _i++) {
            var part = _a[_i];
            for (var _b = 0, _c = part.bones; _b < _c.length; _b++) {
                var bone = _c[_b];
                if (bone.name === name) {
                    return bone;
                }
            }
        }
        return null;
    };
    Model.prototype.getDisplay = function (name) {
        for (var _i = 0, _a = this.parts; _i < _a.length; _i++) {
            var part = _a[_i];
            for (var _b = 0, _c = part.displays; _b < _c.length; _b++) {
                var display = _c[_b];
                if (display.name === name) {
                    return display;
                }
            }
        }
        return null;
    };
    Model.prototype.getTimelineInfo = function (name) {
        for (var _i = 0, _a = this.animations.timelines; _i < _a.length; _i++) {
            var timelineInfo = _a[_i];
            if (timelineInfo.name === name) {
                return timelineInfo;
            }
        }
        return null;
    };
    return Model;
}());
exports.Model = Model;
var Part = /** @class */ (function () {
    function Part() {
    }
    Part.prototype.read = function (reader) {
        this.locked = reader.readBit();
        this.visible = reader.readBit();
        this.name = reader.readObject();
        this.bones = reader.readObject();
        this.displays = reader.readObject();
    };
    return Part;
}());
exports.Part = Part;
var BaseBone = /** @class */ (function () {
    function BaseBone() {
        this.alphaFrames = null;
    }
    BaseBone.prototype.read = function (reader) {
        this.name = reader.readObject();
        this.parent = reader.readObject();
    };
    BaseBone.prototype._readOpacity = function (reader) {
        if (reader.version >= 10) {
            this.alphaFrames = reader.readArrayFloat();
        }
    };
    BaseBone.BASE_INDEX_NOT_INIT = -2;
    BaseBone.TYPE_BD_AFFINE = 1;
    BaseBone.TYPE_BD_BOX_GRID = 2;
    return BaseBone;
}());
exports.BaseBone = BaseBone;
var BaseDisplay = /** @class */ (function () {
    function BaseDisplay() {
    }
    return BaseDisplay;
}());
exports.BaseDisplay = BaseDisplay;
var Bone = /** @class */ (function (_super_1) {
    __extends(Bone, _super_1);
    function Bone() {
        return _super_1 !== null && _super_1.apply(this, arguments) || this;
    }
    Bone.prototype.read = function (reader) {
        _super_1.prototype.read.call(this, reader);
        this.animation = reader.readObject();
        this.transformFrames = reader.readObject();
        this._readOpacity(reader);
    };
    return Bone;
}(BaseBone));
exports.Bone = Bone;
var Surface = /** @class */ (function (_super_1) {
    __extends(Surface, _super_1);
    function Surface() {
        return _super_1 !== null && _super_1.apply(this, arguments) || this;
    }
    Surface.prototype.read = function (reader) {
        _super_1.prototype.read.call(this, reader);
        this.segmentY = reader.readInt();
        this.segmentX = reader.readInt();
        this.animation = reader.readObject();
        this.deformFrames = reader.readObject();
        this._readOpacity(reader);
    };
    return Surface;
}(BaseBone));
exports.Surface = Surface;
var Display = /** @class */ (function (_super_1) {
    __extends(Display, _super_1);
    function Display() {
        var _this = _super_1 !== null && _super_1.apply(this, arguments) || this;
        _this.clipedNames = null;
        return _this;
    }
    Display.prototype.read = function (reader) {
        this.name = reader.readObject();
        this.parent = reader.readObject();
        this.animation = reader.readObject();
        this.zIndex = reader.readInt();
        this.zIndexFrames = reader.readArrayInt();
        this.alphaFrames = reader.readArrayFloat();
        if (reader.version >= 11) {
            this.clipedNames = reader.readObject();
        }
    };
    Display.BASE_INDEX_NOT_INIT = -2;
    Display.DEFAULT_ORDER = 500;
    Display.totalMaxOrder = 500;
    Display.totalMinOrder = 500;
    Display.TYPE_DD_TEXTURE = 2;
    Display.TYPE_DD_PATH = 3;
    Display.TYPE_DD_PATH_STROKE = 4;
    return Display;
}(BaseDisplay));
exports.Display = Display;
var Mesh = /** @class */ (function (_super_1) {
    __extends(Mesh, _super_1);
    function Mesh() {
        var _this = _super_1 !== null && _super_1.apply(this, arguments) || this;
        _this.culling = false;
        _this.colorCompositionType = 0;
        _this.colorGroupIndex = -1;
        _this.deformFrames = [];
        _this.uvs = [];
        _this.optionData = {};
        return _this;
    }
    // public readonly uvInfo = new UVInfo();// TODO
    Mesh.prototype.read = function (reader) {
        _super_1.prototype.read.call(this, reader);
        this.textureIndex = reader.readInt();
        this.vertexCount = reader.readInt();
        this.triangleCount = reader.readInt();
        this.indices = reader.readObject().reverse();
        this.deformFrames = reader.readObject();
        this.uvs = reader.readObject();
        if (reader.version >= 8) {
            this.optionFlag = reader.readInt();
            if (this.optionFlag !== 0) {
                if ((this.optionFlag & 1) !== 0) {
                    this.colorGroupIndex = reader.readInt();
                    this.optionData["BK_OPTION_COLOR"] = this.colorGroupIndex;
                }
                if ((this.optionFlag & 30) !== 0) {
                    this.colorCompositionType = (this.optionFlag & 30) >> 1;
                }
                else {
                    this.colorCompositionType = 0;
                }
                if ((this.optionFlag & 0x20) !== 0) {
                    this.culling = false;
                }
            }
        }
        else {
            this.optionFlag = 0;
        }
    };
    Mesh.COLOR_COMPOSITION_NORMAL = 0;
    Mesh.COLOR_COMPOSITION_SCREEN = 1;
    Mesh.COLOR_COMPOSITION_MULTIPLY = 2;
    Mesh.MASK_COLOR_COMPOSITION = 30;
    return Mesh;
}(Display));
exports.Mesh = Mesh;
var AvatarTextureInfo = /** @class */ (function () {
    function AvatarTextureInfo() {
        this.textureIndex = -1;
        this.colorGroupIndex = -1;
        this.scaleX = 1.0;
        this.scaleY = 1.0;
    }
    return AvatarTextureInfo;
}());
exports.AvatarTextureInfo = AvatarTextureInfo;
var AvatarPartsItem = /** @class */ (function () {
    function AvatarPartsItem() {
        this.textureInfoList = [];
    }
    AvatarPartsItem.prototype.read = function (reader) {
        this.name = reader.readObject();
        this.displays = reader.readObject();
        this.bones = reader.readObject();
    };
    return AvatarPartsItem;
}());
exports.AvatarPartsItem = AvatarPartsItem;
var AnimationInfo = /** @class */ (function () {
    function AnimationInfo() {
    }
    AnimationInfo.prototype.read = function (reader) {
        this.timelines = reader.readObject();
    };
    return AnimationInfo;
}());
exports.AnimationInfo = AnimationInfo;
var TimelineInfo = /** @class */ (function () {
    function TimelineInfo() {
    }
    TimelineInfo.prototype.read = function (reader) {
        this.minimum = reader.readFloat();
        this.maximum = reader.readFloat();
        this.default = reader.readFloat();
        this.name = reader.readObject();
    };
    return TimelineInfo;
}());
exports.TimelineInfo = TimelineInfo;
var Animation = /** @class */ (function () {
    function Animation() {
    }
    Animation.prototype.read = function (reader) {
        this.timelines = reader.readObject();
    };
    return Animation;
}());
exports.Animation = Animation;
var Timeline = /** @class */ (function () {
    function Timeline() {
    }
    Timeline.prototype.read = function (reader) {
        this.name = reader.readObject();
        this.frameCount = reader.readInt();
        this.frames = reader.readObject();
    };
    return Timeline;
}());
exports.Timeline = Timeline;
/**
 * Binary reader.
 */
var BinaryReader = /** @class */ (function () {
    function BinaryReader(buffer) {
        this.version = 0;
        this._offset = 0;
        this._bitCount = 0;
        this._bitBuffer = 0;
        this._readedObjects = new Array();
        /**
         * @private
         */
        this.EOF_byte = -1;
        /**
         * @private
         */
        this.EOF_code_point = -1;
        this._dataView = new DataView(buffer);
    }
    BinaryReader.prototype._bytesToNumber = function () {
        var num = this.readByte();
        var num2 = 0;
        var num3 = 0;
        var num4 = 0;
        if ((num & 0x80) === 0) {
            return (num & 0xff);
        }
        if (((num2 = this.readByte()) & 0x80) === 0) {
            return (((num & 0x7f) << 7) | (num2 & 0x7f));
        }
        if (((num3 = this.readByte()) & 0x80) === 0) {
            return ((((num & 0x7f) << 14) | ((num2 & 0x7f) << 7)) | (num3 & 0xff));
        }
        if (((num4 = this.readByte()) & 0x80) !== 0) {
            throw new Error();
        }
        return (((((num & 0x7f) << 0x15) | ((num2 & 0x7f) << 14)) | ((num3 & 0x7f) << 7)) | (num4 & 0xff));
    };
    BinaryReader.prototype._readObjectA = function (tag) {
        if (tag === 0) {
            return null;
        }
        if (tag === 50) {
            return this.readUTF8();
        }
        if (tag === 0x33) {
            return this.readUTF8();
        }
        if (tag === 0x86) {
            return this.readUTF8();
        }
        if (tag === 60) {
            return this.readUTF8();
        }
        if (tag >= 0x30) {
            var ev = this._readObjectB(tag);
            if (ev !== null) {
                ev.read(this);
                return ev;
            }
            return null;
        }
        switch (tag) {
            case 1:
                return this.readUTF8();
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 0x12:
            case 0x13:
            case 20:
            case 0x18:
            case 0x1c:
                throw new Error();
            case 10:
                return new Color(this.readInt(), true);
            case 11:
                return new Rectangle(this.readDouble(), this.readDouble(), this.readDouble(), this.readDouble());
            case 12:
                return new Rectangle(this.readFloat(), this.readFloat(), this.readFloat(), this.readFloat());
            case 13:
                return new Point(this.readDouble(), this.readDouble());
            case 14:
                return new Point(this.readFloat(), this.readFloat());
            case 15: {
                var count = this.readNumber();
                var result = new Array();
                for (var i = 0; i < count; i++) {
                    result[i] = this.readObject();
                }
                return result;
            }
            case 0x10:
            case 0x19:
                return this.readArrayInt();
            case 0x11:
                return new Matrix(this.readDouble(), this.readDouble(), this.readDouble(), this.readDouble(), this.readDouble(), this.readDouble());
            case 0x15:
                return new Rectangle(this.readInt(), this.readInt(), this.readInt(), this.readInt());
            case 0x16:
                return new Point(this.readInt(), this.readInt());
            case 0x17:
                throw new Error();
            case 0x1a:
                return this.readArrayDouble();
            case 0x1b:
                return this.readArrayFloat();
            default:
                throw new Error();
        }
    };
    BinaryReader.prototype._readObjectB = function (tag) {
        if (tag < 40) {
            return null;
        }
        if (tag < 50) {
            return null;
        }
        if (tag < 60) {
            return null;
        }
        if (tag < 100) {
            switch (tag) {
                case 0x41:
                    return new Surface();
                case 0x42:
                    return new Animation();
                case 0x43:
                    return new Timeline();
                case 0x44:
                    return new Bone();
                case 0x45:
                    return new Transform();
                case 70:
                    return new Mesh();
                default:
                    return null;
            }
        }
        if (tag < 150) {
            switch (tag) {
                case 0x83:
                    return new TimelineInfo();
                case 0x85:
                    return new Part();
                case 0x88:
                    return new Model();
                case 0x89:
                    return new AnimationInfo();
                case 0x8e:
                    return new AvatarPartsItem();
                default:
                    return null;
            }
        }
        return null;
    };
    BinaryReader.prototype.readBit = function () {
        if (this._bitCount === 0) {
            this._bitBuffer = this.readByte();
        }
        else if (this._bitCount === 8) {
            this._bitBuffer = this.readByte();
            this._bitCount = 0;
        }
        var bitCount = this._bitCount++;
        // this._bitCount = bitCount + 1;
        return (((this._bitBuffer >> (7 - bitCount)) & 1) === 1);
    };
    BinaryReader.prototype.readBool = function () {
        var result = this.readByte();
        return result > 0;
    };
    BinaryReader.prototype.readByte = function () {
        this._bitCount = 0;
        var result = this._dataView.getUint8(this._offset);
        this._offset += Uint8Array.BYTES_PER_ELEMENT;
        return result;
    };
    BinaryReader.prototype.readUint16 = function () {
        this._bitCount = 0;
        var result = this._dataView.getUint16(this._offset);
        this._offset += Uint16Array.BYTES_PER_ELEMENT;
        return result;
    };
    BinaryReader.prototype.readUint32 = function () {
        this._bitCount = 0;
        var result = this._dataView.getUint32(this._offset);
        this._offset += Uint32Array.BYTES_PER_ELEMENT;
        return result;
    };
    BinaryReader.prototype.readInt8 = function () {
        this._bitCount = 0;
        var result = this._dataView.getInt8(this._offset);
        this._offset += Int8Array.BYTES_PER_ELEMENT;
        return result;
    };
    BinaryReader.prototype.readInt16 = function () {
        this._bitCount = 0;
        var result = this._dataView.getInt16(this._offset);
        this._offset += Int16Array.BYTES_PER_ELEMENT;
        return result;
    };
    BinaryReader.prototype.readInt = function () {
        this._bitCount = 0;
        var result = this._dataView.getInt32(this._offset);
        this._offset += Int32Array.BYTES_PER_ELEMENT;
        return result;
    };
    BinaryReader.prototype.readFloat = function () {
        this._bitCount = 0;
        var result = this._dataView.getFloat32(this._offset);
        this._offset += Float32Array.BYTES_PER_ELEMENT;
        return result;
    };
    BinaryReader.prototype.readDouble = function () {
        this._bitCount = 0;
        var result = this._dataView.getFloat64(this._offset);
        this._offset += Float64Array.BYTES_PER_ELEMENT;
        return result;
    };
    BinaryReader.prototype.readNumber = function () {
        return this._bytesToNumber();
    };
    BinaryReader.prototype.readUTF8 = function () {
        this._bitCount = 0;
        var count = this.readNumber();
        var result = new Uint8Array(count);
        for (var i = 0; i < count; i++) {
            result[i] = this.readByte();
        }
        return this.decodeUTF8(result);
    };
    BinaryReader.prototype.readArrayInt = function () {
        this._bitCount = 0;
        var count = this.readNumber();
        var result = new Array();
        for (var i = 0; i < count; i++) {
            result[i] = this.readInt();
        }
        return result;
    };
    BinaryReader.prototype.readArrayFloat = function () {
        this._bitCount = 0;
        var count = this.readNumber();
        var result = new Array();
        for (var i = 0; i < count; i++) {
            result[i] = this.readFloat();
        }
        return result;
    };
    BinaryReader.prototype.readArrayDouble = function () {
        this._bitCount = 0;
        var count = this.readNumber();
        var result = new Array();
        for (var i = 0; i < count; i++) {
            result[i] = this.readDouble();
        }
        return result;
    };
    BinaryReader.prototype.readObject = function () {
        this._bitCount = 0;
        var tag = this._bytesToNumber();
        if (tag === 0x21) {
            var index = this.readInt();
            if (index < 0 || index >= this._readedObjects.length) {
                throw new Error();
            }
            return this._readedObjects[index];
        }
        var object = this._readObjectA(tag);
        this._readedObjects.push(object);
        return object;
    };
    // TODO
    BinaryReader.prototype.decoderError = function (fatal, opt_code_point) {
        if (fatal) {
        }
        return opt_code_point || 0xFFFD;
    };
    /**
     * @private
     * @param a
     * @param min
     * @param max
     */
    BinaryReader.prototype.inRange = function (a, min, max) {
        return min <= a && a <= max;
    };
    BinaryReader.prototype.decodeUTF8 = function (data) {
        var fatal = false;
        var pos = 0;
        var result = "";
        var code_point;
        var utf8_code_point = 0;
        var utf8_bytes_needed = 0;
        var utf8_bytes_seen = 0;
        var utf8_lower_boundary = 0;
        while (data.length > pos) {
            var _byte = data[pos++];
            if (_byte === this.EOF_byte) {
                if (utf8_bytes_needed !== 0) {
                    code_point = this.decoderError(fatal);
                }
                else {
                    code_point = this.EOF_code_point;
                }
            }
            else {
                if (utf8_bytes_needed === 0) {
                    if (this.inRange(_byte, 0x00, 0x7F)) {
                        code_point = _byte;
                    }
                    else {
                        if (this.inRange(_byte, 0xC2, 0xDF)) {
                            utf8_bytes_needed = 1;
                            utf8_lower_boundary = 0x80;
                            utf8_code_point = _byte - 0xC0;
                        }
                        else if (this.inRange(_byte, 0xE0, 0xEF)) {
                            utf8_bytes_needed = 2;
                            utf8_lower_boundary = 0x800;
                            utf8_code_point = _byte - 0xE0;
                        }
                        else if (this.inRange(_byte, 0xF0, 0xF4)) {
                            utf8_bytes_needed = 3;
                            utf8_lower_boundary = 0x10000;
                            utf8_code_point = _byte - 0xF0;
                        }
                        else {
                            this.decoderError(fatal);
                        }
                        utf8_code_point = utf8_code_point * Math.pow(64, utf8_bytes_needed);
                        code_point = null;
                    }
                }
                else if (!this.inRange(_byte, 0x80, 0xBF)) {
                    utf8_code_point = 0;
                    utf8_bytes_needed = 0;
                    utf8_bytes_seen = 0;
                    utf8_lower_boundary = 0;
                    pos--;
                    code_point = this.decoderError(fatal, _byte);
                }
                else {
                    utf8_bytes_seen += 1;
                    utf8_code_point = utf8_code_point + (_byte - 0x80) * Math.pow(64, utf8_bytes_needed - utf8_bytes_seen);
                    if (utf8_bytes_seen !== utf8_bytes_needed) {
                        code_point = null;
                    }
                    else {
                        var cp = utf8_code_point;
                        var lower_boundary = utf8_lower_boundary;
                        utf8_code_point = 0;
                        utf8_bytes_needed = 0;
                        utf8_bytes_seen = 0;
                        utf8_lower_boundary = 0;
                        if (this.inRange(cp, lower_boundary, 0x10FFFF) && !this.inRange(cp, 0xD800, 0xDFFF)) {
                            code_point = cp;
                        }
                        else {
                            code_point = this.decoderError(fatal, _byte);
                        }
                    }
                }
            }
            //Decode string
            if (code_point !== null && code_point !== this.EOF_code_point) {
                if (code_point <= 0xFFFF) {
                    if (code_point > 0)
                        result += String.fromCharCode(code_point);
                }
                else {
                    code_point -= 0x10000;
                    result += String.fromCharCode(0xD800 + ((code_point >> 10) & 0x3ff));
                    result += String.fromCharCode(0xDC00 + (code_point & 0x3ff));
                }
            }
        }
        return result;
    };
    return BinaryReader;
}());
exports.BinaryReader = BinaryReader;
