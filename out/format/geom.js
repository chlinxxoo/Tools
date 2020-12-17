"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.helpPointB = exports.helpPointA = exports.helpTransformB = exports.helpTransformA = exports.helpMatrixB = exports.helpMatrixA = exports.Rectangle = exports.Point = exports.ColorTransform = exports.Transform = exports.Matrix = exports.multiply = exports.distance = exports.normalizeDegree = exports.normalizeRadian = exports.DEG_RAD = exports.RAD_DEG = exports.PI_Q = exports.PI_H = exports.PI_D = void 0;
exports.PI_D = Math.PI * 2.0;
exports.PI_H = Math.PI / 2.0;
exports.PI_Q = Math.PI / 4.0;
exports.RAD_DEG = 180.0 / Math.PI;
exports.DEG_RAD = Math.PI / 180.0;
function normalizeRadian(value) {
    value = (value + Math.PI) % (exports.PI_D);
    value += value > 0.0 ? -Math.PI : Math.PI;
    return value;
}
exports.normalizeRadian = normalizeRadian;
function normalizeDegree(value) {
    value = (value + 180.0) % (180.0 * 2.0);
    value += value > 0.0 ? -180.0 : 180.0;
    return value;
}
exports.normalizeDegree = normalizeDegree;
function distance(pA, pB) {
    var dX = pB.x - pA.x;
    var dY = pB.y - pA.y;
    return Math.sqrt(dX * dX + dY * dY);
}
exports.distance = distance;
function multiply(pA, pB, pC) {
    return ((pA.x - pC.x) * (pB.y - pC.y) - (pB.x - pC.x) * (pA.y - pC.y));
}
exports.multiply = multiply;
var Matrix = /** @class */ (function () {
    function Matrix(a, b, c, d, tx, ty) {
        if (a === void 0) { a = 1.0; }
        if (b === void 0) { b = 0.0; }
        if (c === void 0) { c = 0.0; }
        if (d === void 0) { d = 1.0; }
        if (tx === void 0) { tx = 0.0; }
        if (ty === void 0) { ty = 0.0; }
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.tx = tx;
        this.ty = ty;
    }
    Matrix.prototype.copyFrom = function (value) {
        this.a = value.a;
        this.b = value.b;
        this.c = value.c;
        this.d = value.d;
        this.tx = value.tx;
        this.ty = value.ty;
        return this;
    };
    Matrix.prototype.copyFromArray = function (value, offset) {
        if (offset === void 0) { offset = 0; }
        this.a = value[offset];
        this.b = value[offset + 1];
        this.c = value[offset + 2];
        this.d = value[offset + 3];
        this.tx = value[offset + 4];
        this.ty = value[offset + 5];
        return this;
    };
    Matrix.prototype.identity = function () {
        this.a = this.d = 1.0;
        this.b = this.c = 0.0;
        this.tx = this.ty = 0.0;
        return this;
    };
    Matrix.prototype.rotate = function (radian) {
        var u = Math.cos(radian);
        var v = Math.sin(radian);
        var ta = this.a;
        var tb = this.b;
        var tc = this.c;
        var td = this.d;
        var ttx = this.tx;
        var tty = this.ty;
        this.a = ta * u - tb * v;
        this.b = ta * v + tb * u;
        this.c = tc * u - td * v;
        this.d = tc * v + td * u;
        this.tx = ttx * u - tty * v;
        this.ty = ttx * v + tty * u;
        return this;
    };
    Matrix.prototype.concat = function (value) {
        var aA = this.a * value.a;
        var bA = 0.0;
        var cA = 0.0;
        var dA = this.d * value.d;
        var txA = this.tx * value.a + value.tx;
        var tyA = this.ty * value.d + value.ty;
        if (this.b !== 0.0 || this.c !== 0.0) {
            aA += this.b * value.c;
            bA += this.b * value.d;
            cA += this.c * value.a;
            dA += this.c * value.b;
        }
        if (value.b !== 0.0 || value.c !== 0.0) {
            bA += this.a * value.b;
            cA += this.d * value.c;
            txA += this.ty * value.c;
            tyA += this.tx * value.b;
        }
        this.a = aA;
        this.b = bA;
        this.c = cA;
        this.d = dA;
        this.tx = txA;
        this.ty = tyA;
        return this;
    };
    Matrix.prototype.invert = function () {
        var aA = this.a;
        var bA = this.b;
        var cA = this.c;
        var dA = this.d;
        var txA = this.tx;
        var tyA = this.ty;
        if (bA === 0.0 && cA === 0.0) {
            this.b = this.c = 0.0;
            if (aA === 0.0 || dA === 0.0) {
                this.a = this.b = this.tx = this.ty = 0.0;
            }
            else {
                aA = this.a = 1.0 / aA;
                dA = this.d = 1.0 / dA;
                this.tx = -aA * txA;
                this.ty = -dA * tyA;
            }
            return this;
        }
        var determinant = aA * dA - bA * cA;
        if (determinant === 0.0) {
            this.a = this.d = 1.0;
            this.b = this.c = 0.0;
            this.tx = this.ty = 0.0;
            return this;
        }
        determinant = 1.0 / determinant;
        var k = this.a = dA * determinant;
        bA = this.b = -bA * determinant;
        cA = this.c = -cA * determinant;
        dA = this.d = aA * determinant;
        this.tx = -(k * txA + cA * tyA);
        this.ty = -(bA * txA + dA * tyA);
        return this;
    };
    Matrix.prototype.transformPoint = function (x, y, result, delta) {
        if (delta === void 0) { delta = false; }
        result.x = this.a * x + this.c * y;
        result.y = this.b * x + this.d * y;
        if (!delta) {
            result.x += this.tx;
            result.y += this.ty;
        }
    };
    return Matrix;
}());
exports.Matrix = Matrix;
var Transform = /** @class */ (function () {
    function Transform(x, y, skX, skY, scX, scY, pX, // Deprecated.
    pY // Deprecated.
    ) {
        if (x === void 0) { x = 0.0; }
        if (y === void 0) { y = 0.0; }
        if (skX === void 0) { skX = 0.0; }
        if (skY === void 0) { skY = 0.0; }
        if (scX === void 0) { scX = 1.0; }
        if (scY === void 0) { scY = 1.0; }
        if (pX === void 0) { pX = 0.0; }
        if (pY === void 0) { pY = 0.0; }
        this.x = x;
        this.y = y;
        this.skX = skX;
        this.skY = skY;
        this.scX = scX;
        this.scY = scY;
        this.pX = pX;
        this.pY = pY;
    }
    Transform.prototype.toString = function () {
        return this.x + "_" + this.y + "_" + this.skX + "_" + this.skY + "_" + this.scX + "_" + this.scY;
    };
    Transform.prototype.toFixed = function () {
        this.x = Number(this.x.toFixed(2));
        this.y = Number(this.y.toFixed(2));
        this.skX = Number(this.skX.toFixed(2));
        this.skY = Number(this.skY.toFixed(2));
        this.scX = Number(this.scX.toFixed(4));
        this.scY = Number(this.scY.toFixed(4));
    };
    Transform.prototype.copyFrom = function (value) {
        this.x = value.x;
        this.y = value.y;
        this.skX = value.skX;
        this.skY = value.skY;
        this.scX = value.scX;
        this.scY = value.scY;
        return this;
    };
    Transform.prototype.equal = function (value) {
        return this.x === value.x && this.y === value.y &&
            this.skX === value.skY && this.skY === value.skY &&
            this.scX === value.scX && this.scY === value.scY;
    };
    Transform.prototype.identity = function () {
        this.x = this.y = this.skX = this.skY = 0.0;
        this.scX = this.scY = 1.0;
        return this;
    };
    Transform.prototype.fromMatrix = function (matrix) {
        this.x = matrix.tx;
        this.y = matrix.ty;
        var backupScaleX = this.scX, backupScaleY = this.scY;
        var skX = Math.atan(-matrix.c / matrix.d);
        var skY = Math.atan(matrix.b / matrix.a);
        this.scX = (skY > -exports.PI_Q && skY < exports.PI_Q) ? matrix.a / Math.cos(skY) : matrix.b / Math.sin(skY);
        this.scY = (skX > -exports.PI_Q && skX < exports.PI_Q) ? matrix.d / Math.cos(skX) : -matrix.c / Math.sin(skX);
        if (backupScaleX >= 0.0 && this.scX < 0.0) {
            this.scX = -this.scX;
            skY = normalizeRadian(skY - Math.PI);
        }
        if (backupScaleY >= 0.0 && this.scY < 0.0) {
            this.scY = -this.scY;
            skX = normalizeRadian(skX - Math.PI);
        }
        this.skX = skX * exports.RAD_DEG;
        this.skY = skY * exports.RAD_DEG;
        return this;
    };
    Transform.prototype.toMatrix = function (matrix) {
        var skX = this.skX * exports.DEG_RAD;
        var skY = this.skY * exports.DEG_RAD;
        matrix.a = Math.cos(skY) * this.scX;
        matrix.b = Math.sin(skY) * this.scX;
        matrix.c = -Math.sin(skX) * this.scY;
        matrix.d = Math.cos(skX) * this.scY;
        matrix.tx = this.x;
        matrix.ty = this.y;
        return this;
    };
    return Transform;
}());
exports.Transform = Transform;
var ColorTransform = /** @class */ (function () {
    function ColorTransform(aM, rM, gM, bM, aO, rO, gO, bO) {
        if (aM === void 0) { aM = 100; }
        if (rM === void 0) { rM = 100; }
        if (gM === void 0) { gM = 100; }
        if (bM === void 0) { bM = 100; }
        if (aO === void 0) { aO = 0; }
        if (rO === void 0) { rO = 0; }
        if (gO === void 0) { gO = 0; }
        if (bO === void 0) { bO = 0; }
        this.aM = aM;
        this.rM = rM;
        this.gM = gM;
        this.bM = bM;
        this.aO = aO;
        this.rO = rO;
        this.gO = gO;
        this.bO = bO;
    }
    ColorTransform.prototype.toString = function () {
        return this.aM + "_" + this.rM + "_" + this.gM + "_" + this.bM + "_" + this.aO + "_" + this.rO + "_" + this.gO + "_" + this.bO;
    };
    ColorTransform.prototype.toFixed = function () {
        this.aM = Math.round(this.aM);
        this.rM = Math.round(this.rM);
        this.gM = Math.round(this.gM);
        this.bM = Math.round(this.bM);
        this.aO = Math.round(this.aO);
        this.rO = Math.round(this.rO);
        this.gO = Math.round(this.gO);
        this.bO = Math.round(this.bO);
    };
    ColorTransform.prototype.copyFrom = function (value) {
        this.aM = value.aM;
        this.rM = value.rM;
        this.gM = value.gM;
        this.bM = value.bM;
        this.aO = value.aO;
        this.rO = value.rO;
        this.gO = value.gO;
        this.bO = value.bO;
    };
    ColorTransform.prototype.copyFromRGBA = function (value) {
        this.rM = Math.round(((0xFF000000 & value) >>> 24) / 255 * 100);
        this.gM = Math.round(((0x00FF0000 & value) >>> 16) / 255 * 100);
        this.bM = Math.round(((0x0000FF00 & value) >>> 8) / 255 * 100);
        this.aM = Math.round((0x000000FF & value) / 255 * 100);
    };
    ColorTransform.prototype.identity = function () {
        this.aM = this.rM = this.gM = this.bM = 100;
        this.aO = this.rO = this.gO = this.bO = 0;
    };
    ColorTransform.prototype.equal = function (value) {
        return this.aM === value.aM && this.rM === value.rM && this.gM === value.gM && this.bM === value.bM &&
            this.aO === value.aO && this.rO === value.rO && this.gO === value.gO && this.bO === value.bO;
    };
    return ColorTransform;
}());
exports.ColorTransform = ColorTransform;
var Point = /** @class */ (function () {
    function Point(x, y) {
        if (x === void 0) { x = 0.0; }
        if (y === void 0) { y = 0.0; }
        this.x = x;
        this.y = y;
    }
    Point.prototype.toString = function () {
        return "[object Point x: " + this.x + " y: " + this.y + " ]";
    };
    Point.prototype.clear = function () {
        this.x = this.y = 0.0;
    };
    Point.prototype.copyFrom = function (value) {
        this.x = value.x;
        this.y = value.y;
        return this;
    };
    Point.prototype.setTo = function (x, y) {
        this.x = x;
        this.y = y;
        return this;
    };
    Point.prototype.polar = function (length, radian) {
        this.x = length * Math.cos(radian);
        this.y = length * Math.sin(radian);
        return this;
    };
    return Point;
}());
exports.Point = Point;
var Rectangle = /** @class */ (function () {
    function Rectangle(x, y, width, height) {
        if (x === void 0) { x = 0.0; }
        if (y === void 0) { y = 0.0; }
        if (width === void 0) { width = 0.0; }
        if (height === void 0) { height = 0.0; }
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    Rectangle.prototype.toString = function () {
        return "[object Rectangle x: " + this.x + " y: " + this.y + " width: " + this.width + " height: " + this.height + " ]";
    };
    Rectangle.prototype.toFixed = function () {
        this.x = Number(this.x.toFixed(2));
        this.y = Number(this.y.toFixed(2));
        this.width = Number(this.width.toFixed(2));
        this.height = Number(this.height.toFixed(2));
    };
    Rectangle.prototype.clear = function () {
        this.x = this.y = this.width = this.height = 0.0;
    };
    Rectangle.prototype.copyFrom = function (value) {
        this.x = value.x;
        this.y = value.y;
        this.width = value.width;
        this.height = value.height;
        return this;
    };
    Rectangle.prototype.setTo = function (x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        return this;
    };
    return Rectangle;
}());
exports.Rectangle = Rectangle;
exports.helpMatrixA = new Matrix();
exports.helpMatrixB = new Matrix();
exports.helpTransformA = new Transform();
exports.helpTransformB = new Transform();
exports.helpPointA = new Point();
exports.helpPointB = new Point();
//# sourceMappingURL=geom.js.map