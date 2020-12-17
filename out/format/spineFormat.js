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
exports.compressConfig = exports.copyConfig = exports.DrawOrderFrame = exports.EventFrame = exports.DeformFrame = exports.TransformConstraintFrame = exports.IKConstraintFrame = exports.ColorFrame = exports.AttachmentFrame = exports.ScaleFrame = exports.ShearFrame = exports.RotateFrame = exports.TranslateFrame = exports.TweenFrame = exports.Frame = exports.SlotTimelines = exports.BoneTimelines = exports.Animation = exports.Event = exports.ClippingAttachment = exports.PointAttachment = exports.PathAttachment = exports.BoundingBoxAttachment = exports.LinkedMeshAttachment = exports.MeshAttachment = exports.RegionAttachment = exports.Attachment = exports.PathConstraint = exports.TransformConstraint = exports.IKConstraint = exports.Slot = exports.Bone = exports.Skeleton = exports.Spine = exports.isSpineString = void 0;
function isSpineString(string) {
    return string.indexOf("skeleton") > 0 && string.indexOf("spine") > 0;
}
exports.isSpineString = isSpineString;
var Spine = /** @class */ (function () {
    function Spine() {
        this.skeleton = new Skeleton();
        this.bones = [];
        this.slots = [];
        this.ik = [];
        this.transform = [];
        this.path = [];
        this.skins = {};
        this.animations = {};
        this.events = {};
    }
    return Spine;
}());
exports.Spine = Spine;
var Skeleton = /** @class */ (function () {
    function Skeleton() {
        this.width = 0.00;
        this.height = 0.00;
        this.fps = 30; // Nonessential.
        this.spine = "";
        this.hash = ""; // Nonessential.
        this.images = "./images/"; // Nonessential.
        this.name = ""; // Keep DragonBones armature name.
    }
    return Skeleton;
}());
exports.Skeleton = Skeleton;
var Bone = /** @class */ (function () {
    function Bone() {
        this.inheritRotation = true;
        this.inheritScale = true;
        this.length = 0;
        this.color = 0x989898FF; // Nonessential.
        this.x = 0.00;
        this.y = 0.00;
        this.rotation = 0.00;
        this.shearX = 0.00;
        this.shearY = 0.00;
        this.scaleX = 1.00;
        this.scaleY = 1.00;
        this.name = "";
        this.parent = "";
        this.transform = "normal";
    }
    return Bone;
}());
exports.Bone = Bone;
var Slot = /** @class */ (function () {
    function Slot() {
        this.name = "";
        this.bone = "";
        this.color = "FFFFFFFF";
        this.dark = "FFFFFF";
        this.blend = "normal";
        this.attachment = "";
    }
    return Slot;
}());
exports.Slot = Slot;
var IKConstraint = /** @class */ (function () {
    function IKConstraint() {
        this.bendPositive = true;
        this.order = 0;
        this.mix = 1.00;
        this.name = "";
        this.target = "";
        this.bones = [];
    }
    return IKConstraint;
}());
exports.IKConstraint = IKConstraint;
var TransformConstraint = /** @class */ (function () {
    function TransformConstraint() {
        this.local = false;
        this.relative = false;
        this.order = 0;
        this.x = 0.00;
        this.y = 0.00;
        this.rotation = 0.00;
        this.shearX = 0.00;
        this.shearY = 0.00;
        this.scaleX = 0.00;
        this.scaleY = 0.00;
        this.translateMix = 1.00;
        this.rotateMix = 1.00;
        this.scaleMix = 1.00;
        this.shearMix = 1.00;
        this.name = "";
        this.bone = "";
        this.target = "";
    }
    return TransformConstraint;
}());
exports.TransformConstraint = TransformConstraint;
var PathConstraint = /** @class */ (function () {
    function PathConstraint() {
        this.positionMode = "percent";
        this.spacingMode = "length";
        this.rotateMode = "tangent";
        this.order = 0;
        this.rotation = 0.00;
        this.position = 0.00;
        this.spacing = 0.00;
        this.translateMix = 1.00;
        this.rotateMix = 1.00;
        this.name = "";
        this.target = "";
        this.bones = [];
    }
    return PathConstraint;
}());
exports.PathConstraint = PathConstraint;
var Attachment = /** @class */ (function () {
    function Attachment() {
        this.color = "FFFFFFFF";
        this.name = "";
    }
    return Attachment;
}());
exports.Attachment = Attachment;
var RegionAttachment = /** @class */ (function (_super) {
    __extends(RegionAttachment, _super);
    function RegionAttachment(isDefault) {
        if (isDefault === void 0) { isDefault = false; }
        var _this = _super.call(this) || this;
        _this.width = 0;
        _this.height = 0;
        _this.x = 0.00;
        _this.y = 0.00;
        _this.rotation = 0.00;
        _this.scaleX = 1.00;
        _this.scaleY = 1.00;
        _this.path = "";
        if (!isDefault) {
            // this.type = "region";
        }
        return _this;
    }
    return RegionAttachment;
}(Attachment));
exports.RegionAttachment = RegionAttachment;
var MeshAttachment = /** @class */ (function (_super) {
    __extends(MeshAttachment, _super);
    function MeshAttachment(isDefault) {
        if (isDefault === void 0) { isDefault = false; }
        var _this = _super.call(this) || this;
        _this.width = 0; // Nonessential.
        _this.height = 0; // Nonessential.
        _this.hull = 0;
        _this.path = "";
        _this.triangles = [];
        _this.uvs = [];
        _this.edges = []; // Nonessential.
        _this.vertices = [];
        if (!isDefault) {
            _this.type = "mesh";
        }
        return _this;
    }
    return MeshAttachment;
}(Attachment));
exports.MeshAttachment = MeshAttachment;
var LinkedMeshAttachment = /** @class */ (function (_super) {
    __extends(LinkedMeshAttachment, _super);
    function LinkedMeshAttachment(isDefault) {
        if (isDefault === void 0) { isDefault = false; }
        var _this = _super.call(this) || this;
        _this.deform = true;
        _this.width = 0; // Nonessential.
        _this.height = 0; // Nonessential.
        _this.path = "";
        _this.skin = "";
        _this.parent = "";
        if (!isDefault) {
            _this.type = "linkedmesh";
        }
        return _this;
    }
    return LinkedMeshAttachment;
}(Attachment));
exports.LinkedMeshAttachment = LinkedMeshAttachment;
var BoundingBoxAttachment = /** @class */ (function (_super) {
    __extends(BoundingBoxAttachment, _super);
    function BoundingBoxAttachment(isDefault) {
        if (isDefault === void 0) { isDefault = false; }
        var _this = _super.call(this) || this;
        _this.vertexCount = 0;
        _this.color = "60F000FF";
        _this.vertices = [];
        if (!isDefault) {
            _this.type = "boundingbox";
        }
        return _this;
    }
    return BoundingBoxAttachment;
}(Attachment));
exports.BoundingBoxAttachment = BoundingBoxAttachment;
var PathAttachment = /** @class */ (function (_super) {
    __extends(PathAttachment, _super);
    function PathAttachment(isDefault) {
        if (isDefault === void 0) { isDefault = false; }
        var _this = _super.call(this) || this;
        _this.color = "FF7F00FF";
        _this.closed = false;
        _this.constantSpeed = true;
        _this.vertexCount = 0;
        _this.lengths = [];
        _this.vertices = [];
        if (!isDefault) {
            _this.type = "path";
        }
        return _this;
    }
    return PathAttachment;
}(Attachment));
exports.PathAttachment = PathAttachment;
var PointAttachment = /** @class */ (function (_super) {
    __extends(PointAttachment, _super);
    function PointAttachment(isDefault) {
        if (isDefault === void 0) { isDefault = false; }
        var _this = _super.call(this) || this;
        _this.x = 0.0;
        _this.y = 0.0;
        _this.color = "F1F100FF";
        _this.rotation = 0.0;
        if (!isDefault) {
            _this.type = "point";
        }
        return _this;
    }
    return PointAttachment;
}(Attachment));
exports.PointAttachment = PointAttachment;
var ClippingAttachment = /** @class */ (function (_super) {
    __extends(ClippingAttachment, _super);
    function ClippingAttachment(isDefault) {
        if (isDefault === void 0) { isDefault = false; }
        var _this = _super.call(this) || this;
        _this.vertexCount = 0.0;
        _this.end = "";
        _this.color = "CE3A3AFF";
        _this.vertices = [];
        if (!isDefault) {
            _this.type = "clipping";
        }
        return _this;
    }
    return ClippingAttachment;
}(Attachment));
exports.ClippingAttachment = ClippingAttachment;
var Event = /** @class */ (function () {
    function Event() {
        this.int = 0;
        this.float = 0.0;
        this.string = "";
        this.name = ""; // Keep to alive.
    }
    return Event;
}());
exports.Event = Event;
var Animation = /** @class */ (function () {
    function Animation() {
        this.bones = {};
        this.slots = {};
        this.ik = {};
        this.transform = {};
        this.deform = {};
        this.ffd = {}; // Deprecated.
        this.events = [];
        this.drawOrder = [];
    }
    return Animation;
}());
exports.Animation = Animation;
var BoneTimelines = /** @class */ (function () {
    function BoneTimelines() {
        this.translate = [];
        this.rotate = [];
        this.scale = [];
        this.shear = [];
    }
    return BoneTimelines;
}());
exports.BoneTimelines = BoneTimelines;
var SlotTimelines = /** @class */ (function () {
    function SlotTimelines() {
        this.attachment = [];
        this.color = [];
    }
    return SlotTimelines;
}());
exports.SlotTimelines = SlotTimelines;
var Frame = /** @class */ (function () {
    function Frame(isDefault) {
        if (isDefault === void 0) { isDefault = false; }
        this.time = 0.0;
        if (isDefault) {
            this.time = NaN; // spine import data bug
        }
    }
    return Frame;
}());
exports.Frame = Frame;
var TweenFrame = /** @class */ (function (_super) {
    __extends(TweenFrame, _super);
    function TweenFrame() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.curve = "linear";
        return _this;
    }
    return TweenFrame;
}(Frame));
exports.TweenFrame = TweenFrame;
var TranslateFrame = /** @class */ (function (_super) {
    __extends(TranslateFrame, _super);
    function TranslateFrame() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.x = 0.0;
        _this.y = 0.0;
        return _this;
    }
    return TranslateFrame;
}(TweenFrame));
exports.TranslateFrame = TranslateFrame;
var RotateFrame = /** @class */ (function (_super) {
    __extends(RotateFrame, _super);
    function RotateFrame(isDefault) {
        if (isDefault === void 0) { isDefault = false; }
        var _this = _super.call(this, isDefault) || this;
        _this.angle = 0.0;
        if (isDefault) {
            _this.angle = NaN; // Spine import data bug.
        }
        return _this;
    }
    return RotateFrame;
}(TweenFrame));
exports.RotateFrame = RotateFrame;
var ShearFrame = /** @class */ (function (_super) {
    __extends(ShearFrame, _super);
    function ShearFrame() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.x = 0.0;
        _this.y = 0.0;
        return _this;
    }
    return ShearFrame;
}(TweenFrame));
exports.ShearFrame = ShearFrame;
var ScaleFrame = /** @class */ (function (_super) {
    __extends(ScaleFrame, _super);
    function ScaleFrame(isDefault) {
        if (isDefault === void 0) { isDefault = false; }
        var _this = _super.call(this, isDefault) || this;
        _this.x = 1.0;
        _this.y = 1.0;
        if (isDefault) {
            _this.x = NaN; // spine import data bug
            _this.y = NaN; // spine import data bug
        }
        return _this;
    }
    return ScaleFrame;
}(TweenFrame));
exports.ScaleFrame = ScaleFrame;
var AttachmentFrame = /** @class */ (function (_super) {
    __extends(AttachmentFrame, _super);
    function AttachmentFrame(isDefault) {
        if (isDefault === void 0) { isDefault = false; }
        var _this = _super.call(this, isDefault) || this;
        _this.name = "";
        if (isDefault) {
            _this.name = null; // Spine import data bug.
        }
        return _this;
    }
    return AttachmentFrame;
}(Frame));
exports.AttachmentFrame = AttachmentFrame;
var ColorFrame = /** @class */ (function (_super) {
    __extends(ColorFrame, _super);
    function ColorFrame(isDefault) {
        if (isDefault === void 0) { isDefault = false; }
        var _this = _super.call(this, isDefault) || this;
        _this.color = "FFFFFFFF";
        if (isDefault) {
            _this.color = null; // Spine import data bug.
        }
        return _this;
    }
    return ColorFrame;
}(TweenFrame));
exports.ColorFrame = ColorFrame;
var IKConstraintFrame = /** @class */ (function (_super) {
    __extends(IKConstraintFrame, _super);
    function IKConstraintFrame() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.bendPositive = true;
        _this.mix = 1.0;
        return _this;
    }
    return IKConstraintFrame;
}(TweenFrame));
exports.IKConstraintFrame = IKConstraintFrame;
var TransformConstraintFrame = /** @class */ (function (_super) {
    __extends(TransformConstraintFrame, _super);
    function TransformConstraintFrame() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.rotateMix = 1.0;
        _this.translateMix = 1.0;
        _this.scaleMix = 1.0;
        _this.shearMix = 1.0;
        return _this;
    }
    return TransformConstraintFrame;
}(TweenFrame));
exports.TransformConstraintFrame = TransformConstraintFrame;
var DeformFrame = /** @class */ (function (_super) {
    __extends(DeformFrame, _super);
    function DeformFrame() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.offset = 0;
        _this.vertices = [];
        return _this;
    }
    return DeformFrame;
}(TweenFrame));
exports.DeformFrame = DeformFrame;
var EventFrame = /** @class */ (function (_super) {
    __extends(EventFrame, _super);
    function EventFrame() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.int = 0;
        _this.float = 0.0;
        _this.string = "";
        _this.name = "";
        return _this;
    }
    return EventFrame;
}(Frame));
exports.EventFrame = EventFrame;
var DrawOrderFrame = /** @class */ (function (_super) {
    __extends(DrawOrderFrame, _super);
    function DrawOrderFrame() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.offsets = [];
        return _this;
    }
    return DrawOrderFrame;
}(Frame));
exports.DrawOrderFrame = DrawOrderFrame;
exports.copyConfig = [
    Spine,
    {
        bones: Bone,
        slots: Slot,
        ik: IKConstraint,
        transform: TransformConstraint,
        path: PathConstraint,
        skins: [[[[
                        function (attachment) {
                            var type = attachment.type || "region";
                            switch (type) {
                                case "region":
                                    return RegionAttachment;
                                case "mesh":
                                case "skinnedmesh":
                                    return MeshAttachment;
                                case "linkedmesh":
                                    return LinkedMeshAttachment;
                                case "boundingbox":
                                    return BoundingBoxAttachment;
                                case "path":
                                    return PathAttachment;
                                case "point":
                                    return PointAttachment;
                                case "clipping":
                                    return ClippingAttachment;
                                default:
                                    return null;
                            }
                        },
                        Function
                    ]]]],
        animations: [Animation],
        events: [Event],
    },
    Animation, {
        bones: [BoneTimelines],
        slots: [SlotTimelines],
        ik: [
            IKConstraintFrame,
            Array
        ],
        transform: [
            TransformConstraintFrame,
            Array
        ],
        deform: [[[
                    DeformFrame,
                    Array
                ]]],
        ffd: [[[
                    DeformFrame,
                    Array
                ]]],
        events: EventFrame,
        drawOrder: DrawOrderFrame,
    },
    BoneTimelines, {
        rotate: RotateFrame,
        translate: TranslateFrame,
        scale: ScaleFrame,
        shear: ShearFrame
    },
    SlotTimelines, {
        attachment: AttachmentFrame,
        color: ColorFrame
    }
];
exports.compressConfig = [
    new Spine(),
    new Skeleton(),
    new Bone(),
    new Slot(),
    new IKConstraint(),
    new TransformConstraint(),
    new PathConstraint(),
    new RegionAttachment(true),
    new MeshAttachment(true),
    new LinkedMeshAttachment(true),
    new BoundingBoxAttachment(true),
    new PathAttachment(true),
    new PointAttachment(true),
    new ClippingAttachment(true),
    new Event(),
    new Animation(),
    new BoneTimelines(),
    new SlotTimelines(),
    new TranslateFrame(true),
    new RotateFrame(true),
    new ShearFrame(true),
    new ScaleFrame(true),
    new AttachmentFrame(true),
    new ColorFrame(true),
    new IKConstraintFrame(true),
    new TransformConstraintFrame(true),
    new DeformFrame(true),
    new EventFrame(true),
    new DrawOrderFrame(true),
];
//# sourceMappingURL=spineFormat.js.map