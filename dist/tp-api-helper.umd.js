(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.tpApiHelper = global.tpApiHelper || {})));
}(this, (function (exports) { 'use strict';

var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var request = require("request");
var Results = (function () {
    function Results() {
    }
    return Results;
}());
var TargetProcess = (function () {
    function TargetProcess(domain, protocol, version, username, password) {
        this.domain = domain;
        this.protocol = protocol;
        this.version = version;
        this.username = username;
        this.password = password;
        this.options = {
            json: true,
            qs: { token: undefined },
            headers: { Authorization: undefined }
        };
        this.options.url =
            this.protocol + "://" + this.domain + "/api/v" + this.version;
        if (this.username && this.password) {
            this.options.qs.token = new Buffer(this.username + ":" + this.password).toString("base64");
        }
    }
    /**
    Fetch an entity
    */
    TargetProcess.prototype.get = function (entity, id) {
        return new GetEntity(this, entity, id);
    };
    /**
    Create or update an entity
    */
    TargetProcess.prototype.post = function (entity, id) {
        return new PostEntity(this, entity, id);
    };
    /**
    Delete an entity id required
    */
    TargetProcess.prototype.delete = function (entity, id) {
        return new DeleteEntity(this, entity, id);
    };
    TargetProcess.prototype.execute = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.options.callback = function (error, response, body) {
                if (error) {
                    reject(new Error(error));
                }
                else {
                    resolve(body);
                }
            };
            new request.Request(_this.options);
        });
    };
    return TargetProcess;
}());
var Operation = (function (_super) {
    __extends(Operation, _super);
    function Operation(targetProcess, entity, method, id) {
        var _this = _super.call(this, targetProcess.domain, targetProcess.protocol, targetProcess.version, targetProcess.username, targetProcess.password) || this;
        _this.options.entity = entity;
        _this.options.url = _this.options.url + "/" + _this.options.entity;
        if (id) {
            _this.options.entityid = id;
            _this.options.url = _this.options.url + "/" + _this.options.entityid;
        }
        _this.options.method = method;
        _this.autherization("Basic " + _this.options.qs.token);
        _this.token(_this.options.qs.token);
        return _this;
    }
    /**
  Token, which was generated at Personal Details page (Access Tokens tab). Other options: token or basic authentication
  */
    Operation.prototype.access_token = function (value) {
        this.options.qs.access_token = value;
        return this;
    };
    /**
    Token, which was generated at /api/v1/Authentication. Other options: access_token or basic authentication
    */
    Operation.prototype.token = function (value) {
        this.options.qs.token = value;
        return this;
    };
    /**
    Basic authentication as a a Base64 encoded values for login:password. Other options: access_token or token
    */
    Operation.prototype.autherization = function (value) {
        this.options.headers["Authorization"] = value;
        return this;
    };
    return Operation;
}(TargetProcess));
var GetEntity = (function (_super) {
    __extends(GetEntity, _super);
    function GetEntity(targetProcess, entity, id) {
        return _super.call(this, targetProcess, entity, "GET", id) || this;
    }
    /**
    Filtering by fields and nested fields. Example: EntityState.IsInitial eq 'true'
    */
    GetEntity.prototype.where = function (value) {
        this.options.qs.where = value;
        return this;
    };
    /**
    You can explicitly specify attributes that you want to have in the response. It is possible to include Fields, Collections and Nested Entities (with inner Fields). Example: [Name, Iteration[Name]]. Cannot be used together with 'exclude' param.
    */
    GetEntity.prototype.include = function () {
        var value = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            value[_i] = arguments[_i];
        }
        if (this.options.qs.exclude) {
            this.options.qs.exclude = undefined;
        }
        this.options.qs.include = "[" + value.toString() + "]";
        return this;
    };
    /**
    You can explicitly specify attributes that you do not want to have in the response. Cannot be used together with 'include' param.
    */
    GetEntity.prototype.exclude = function () {
        var value = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            value[_i] = arguments[_i];
        }
        if (this.options.qs.include) {
            this.options.qs.include = undefined;
        }
        this.options.qs.exclude = "[" + value.toString() + "]";
        return this;
    };
    /**
    Get more information about Entity in a single request. For example, you can retrieve Tasks and Bugs count: [Bugs-Count,Tasks-Count]
    */
    GetEntity.prototype.append = function (value) {
        this.options.qs.append = value;
        return this;
    };
    /**
    This parameter controls paging. Defines how many items will be skipped
    */
    GetEntity.prototype.skip = function (value) {
        this.options.qs.skip = value;
        return this;
    };
    /**
    This parameter controls paging. Defines how many items will be returned. Limit is 1000
    */
    GetEntity.prototype.take = function (value) {
        this.options.qs.take = value;
        return this;
    };
    /**
    This parameter controls paging for inner collections. Defines how many items will be returned. Limit is 1000 (in total, not per one item)
    */
    GetEntity.prototype.innertake = function (value) {
        this.options.qs.innertake = value;
        return this;
    };
    /**
    Ordering by fields and nested fields
    */
    GetEntity.prototype.ordreby = function (value) {
        this.options.qs.ordreby = value;
        return this;
    };
    /**
    Ordering by fields and nested fields
    */
    GetEntity.prototype.orderbydesc = function (value) {
        this.options.qs.qs.orderbydesc = value;
        return this;
    };
    /**
    Response format (JSON or XML)
    */
    GetEntity.prototype.format = function (value) {
        this.options.qs.format = value;
        return this;
    };
    return GetEntity;
}(Operation));
var PostEntity = (function (_super) {
    __extends(PostEntity, _super);
    function PostEntity(targetProcess, entity, id) {
        return _super.call(this, targetProcess, entity, "POST", id) || this;
    }
    PostEntity.prototype.withbody = function (value) {
        this.options.json = value;
        return this;
    };
    /**
    Response format (JSON or XML)
    */
    PostEntity.prototype.format = function (value) {
        this.options.qs.format = value;
        return this;
    };
    /**
  You can explicitly specify attributes of newly created or updated Story that you want to have in the response. It is possible to include Fields, Collections and Nested Entities (with inner Fields). Example: [Name, Iteration[Name]]. Cannot be used together with 'exclude' param.
  */
    PostEntity.prototype.include = function () {
        var value = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            value[_i] = arguments[_i];
        }
        if (this.options.qs.exclude) {
            this.options.qs.exclude = undefined;
        }
        this.options.qs.include = "[" + value.toString() + "]";
        return this;
    };
    /**
    You can explicitly specify attributes of newly created or updated Story that you do not want to have in the response. Cannot be used together with 'include' param.
    */
    PostEntity.prototype.exclude = function () {
        var value = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            value[_i] = arguments[_i];
        }
        if (this.options.qs.include) {
            this.options.qs.include = undefined;
        }
        this.options.qs.exclude = "[" + value.toString() + "]";
        return this;
    };
    /**
  Specify in which format (JSON or XML) and chartset (in case of not ASCII characters) you're sending the body. E.g.: application/xml or application/json; charset=UTF-8
  */
    PostEntity.prototype.content_type = function (value) {
        this.options.headers["Content-type"] = value;
        return this;
    };
    return PostEntity;
}(Operation));
var DeleteEntity = (function (_super) {
    __extends(DeleteEntity, _super);
    function DeleteEntity(targetProcess, entity, id) {
        return _super.call(this, targetProcess, entity, "DELETE", id) || this;
    }
    return DeleteEntity;
}(Operation));

exports.Results = Results;
exports.TargetProcess = TargetProcess;
exports.Operation = Operation;
exports.GetEntity = GetEntity;
exports.PostEntity = PostEntity;
exports.DeleteEntity = DeleteEntity;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=tp-api-helper.umd.js.map
