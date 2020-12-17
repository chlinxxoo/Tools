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
exports.Gate = exports.Code = exports.Server = void 0;
var fs = require("fs");
var path = require("path");
var url = require("url");
var http = require("http");
var types = require("./types");
var Server = /** @class */ (function () {
    function Server() {
        this.httpServer = http.createServer(this._requestHandler.bind(this));
    }
    Server.prototype._requestHandler = function (request, response) {
        // tslint:disable-next-line:no-unused-expression
        response;
        if (!request.url) {
            return false;
        }
        return true;
    };
    Server.prototype.start = function (host, port, local) {
        if (this.port) {
            return;
        }
        this.host = host;
        this.port = port;
        this.local = local;
        this.httpServer.listen(this.port, function () {
            // console.log("Listening on: " + this.host + ":" + this.port);
        });
        // this.server.addListener("error", () => {
        //     // process.exit(1501);
        // });
    };
    Server.prototype.stop = function () {
        process.exit(0);
    };
    return Server;
}());
exports.Server = Server;
var Code;
(function (Code) {
    Code[Code["Success"] = 200] = "Success";
    Code[Code["UnknownAction"] = 2000] = "UnknownAction";
    Code[Code["DataError"] = 2001] = "DataError";
    Code[Code["JSONError"] = 2002] = "JSONError";
    Code[Code["ActionError"] = 2003] = "ActionError";
})(Code = exports.Code || (exports.Code = {}));
var Gate = /** @class */ (function (_super_1) {
    __extends(Gate, _super_1);
    function Gate() {
        var _this = _super_1 !== null && _super_1.apply(this, arguments) || this;
        _this.actions = {};
        return _this;
    }
    Gate.prototype._requestHandler = function (request, response) {
        if (!_super_1.prototype._requestHandler.call(this, request, response)) {
            return false;
        }
        var pathName = url.parse(request.url).pathname.replace(this.local, "");
        if (pathName in this.actions) {
            var action = this.actions[pathName];
            action(request, response);
        }
        else {
            var localPath = path.join(__dirname, "../", pathName);
            var extName = path.extname(pathName);
            extName = extName ? extName.slice(1) : "unknown";
            if (fs.existsSync(localPath) && !fs.statSync(localPath).isDirectory()) {
                var fileResult = fs.readFileSync(localPath, "binary");
                response.writeHead(200, { "Content-Type": types.MineContentTypes[extName] || "text/plain" });
                response.write(fileResult, "binary");
                response.end();
            }
            else {
                this.responseEnd(response, Code.UnknownAction, Code[Code.UnknownAction]);
            }
        }
        return true;
    };
    Gate.prototype.responseEnd = function (response, code, message, data) {
        if (data === void 0) { data = null; }
        var result = { code: code, message: message, data: data };
        response.writeHead(200, { "Content-Type": "application/json" });
        response.write(JSON.stringify(result));
        response.end();
    };
    return Gate;
}(Server));
exports.Gate = Gate;
