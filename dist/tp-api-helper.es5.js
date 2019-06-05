import request from 'request';
import fs from 'fs';

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var tpApiHelper = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });


class TargetProcess {
    constructor(domain, protocol, version, auth) {
        this.domain = domain;
        this.protocol = protocol;
        this.version = version;
        this.auth = auth;
        this.options = {
            json: true,
            qs: { token: undefined, access_token: undefined },
            headers: { authorization: undefined },
            url: undefined
        };
        this.options.url = () => {
            if (!this.options.isAPI) {
                return this.protocol + "://" + this.domain;
            }
            return this.protocol + "://" + this.domain + "/api/v" + this.version;
        };
        if (auth &&
            this.auth.username &&
            this.auth.password) {
            this.options.headers.authorization = new Buffer(this.auth.username +
                ":" +
                this.auth.password).toString("base64");
        }
        else if (auth &&
            (auth.access_token || auth.token)) {
            this.options.qs.token = auth.token;
            this.options.qs.access_token = auth.access_token;
        }
    }
    /**
     * Fetch an entity
     */
    get(entity, id) {
        return new GetEntity(this, entity, id);
    }
    /**
     * Create or update an entity
     */
    post(entity, id) {
        return new PostEntity(this, entity, id);
    }
    /**
     * Create or update an entity
     */
    postFile() {
        return new PostFile(this);
    }
    /**
     * Delete an entity id required
     */
    delete(entity, id) {
        return new DeleteEntity(this, entity, id);
    }
    execute() {
        return new Promise((resolve, reject) => {
            this.options.callback = (error, response, body) => {
                if (error) {
                    reject(new Error(error));
                }
                else {
                    resolve(body);
                }
            };
            return new request.Request(this.options);
        });
    }
}
exports.TargetProcess = TargetProcess;
class Operation extends TargetProcess {
    constructor(targetProcess, entity, method, id) {
        super(targetProcess.domain, targetProcess.protocol, targetProcess.version, targetProcess.auth);
        this.options.entity = entity;
        this.options.url = this.options.url() + "/" + this.options.entity;
        if (id) {
            this.options.entityId = id;
            this.options.url = this.options.url() + "/" + this.options.entityId;
        }
        this.options.method = method;
        if (this.options.headers.authorization) {
            this.basicAuthorization("Basic " + this.options.headers.authorization);
        }
        else if (this.options.qs.token) {
            this.token(this.options.qs.token);
        }
        else if (this.options.qs.access_token) {
            this.access_token(this.options.qs.access_token);
        }
    }
    /**
     * Token, which was generated at Personal Details page (Access Tokens tab). Other options: token or basic authentication
     */
    access_token(value) {
        this.options.qs.access_token = value;
        return this;
    }
    /**
     * Token, which was generated at /api/v1/Authentication. Other options: access_token or basic authentication
     */
    token(value) {
        this.options.qs.token = value;
        return this;
    }
    /**
     * Basic authentication as a a Base64 encoded values for login:password. Other options: access_token or token
     */
    basicAuthorization(value) {
        this.options.headers["Authorization"] = value;
        return this;
    }
}
exports.Operation = Operation;
class GetEntity extends Operation {
    constructor(targetProcess, entity, id) {
        super(targetProcess, entity, "GET", id);
    }
    /**
     * Filtering by fields and nested fields. Example: EntityState.IsInitial eq 'true'
     */
    where(value) {
        this.options.qs.where = value;
        return this;
    }
    /**
     * You can explicitly specify attributes that you want to have in the response. It is possible to include Fields, Collections and Nested Entities (with inner Fields). Example: [Name, Iteration[Name]]. Cannot be used together with 'exclude' param.
     */
    include(...value) {
        if (this.options.qs.exclude) {
            this.options.qs.exclude = undefined;
        }
        this.options.qs.include = "[" + value.toString() + "]";
        return this;
    }
    /**
     * You can explicitly specify attributes that you do not want to have in the response. Cannot be used together with 'include' param.
     */
    exclude(...value) {
        if (this.options.qs.include) {
            this.options.qs.include = undefined;
        }
        this.options.qs.exclude = "[" + value.toString() + "]";
        return this;
    }
    /**
     * Get more information about Entity in a single request. For example, you can retrieve Tasks and Bugs count: [Bugs-Count,Tasks-Count]
     */
    append(value) {
        this.options.qs.append = value;
        return this;
    }
    /**
     * This parameter controls paging. Defines how many items will be skipped
     */
    skip(value) {
        this.options.qs.skip = value;
        return this;
    }
    /**
     * This parameter controls paging. Defines how many items will be returned. Limit is 1000
     */
    take(value) {
        this.options.qs.take = value;
        return this;
    }
    /**
     * This parameter controls paging for inner collections. Defines how many items will be returned. Limit is 1000 (in total, not per one item)
     */
    innerTake(value) {
        this.options.qs.innerTake = value;
        return this;
    }
    /**
     * Ordering by fields and nested fields
     */
    orderBy(value) {
        this.options.qs.orderBy = value;
        return this;
    }
    /**
     * Ordering by fields and nested fields
     */
    orderByDesc(value) {
        this.options.qs.orderByDesc = value;
        return this;
    }
    /**
     * Response format (JSON or XML)
     */
    format(value) {
        this.options.qs.format = value;
        return this;
    }
}
exports.GetEntity = GetEntity;
class PostEntity extends Operation {
    constructor(targetProcess, entity, id) {
        super(targetProcess, entity, "POST", id);
    }
    withBody(value) {
        this.options.json = value;
        return this;
    }
    /**
     * Response format (JSON or XML)
     */
    format(value) {
        this.options.qs.format = value;
        return this;
    }
    /**
     * You can explicitly specify attributes of newly created or updated Story that you want to have in the response. It is possible to include Fields, Collections and Nested Entities (with inner Fields). Example: [Name, Iteration[Name]]. Cannot be used together with 'exclude' param.
     */
    include(...value) {
        if (this.options.qs.exclude) {
            this.options.qs.exclude = undefined;
        }
        this.options.qs.include = "[" + value.toString() + "]";
        return this;
    }
    /**
     * You can explicitly specify attributes of newly created or updated Story that you do not want to have in the response. Cannot be used together with 'include' param.
     */
    exclude(...value) {
        if (this.options.qs.include) {
            this.options.qs.include = undefined;
        }
        this.options.qs.exclude = "[" + value.toString() + "]";
        return this;
    }
    /**
     * Specify in which format (JSON or XML) and charset (in case of not ASCII characters) you're sending the body. E.g.: application/xml or application/json; charset=UTF-8
     */
    content_type(value) {
        this.options.headers["Content-type"] = value;
        return this;
    }
}
exports.PostEntity = PostEntity;
class PostFile extends Operation {
    constructor(targetProcess) {
        super(targetProcess, "UploadFile.ashx", "POST");
        this.options.isAPI = false;
    }
    withFiles(...paths) {
        if (!this.options.formData) {
            this.options.formData = {};
        }
        this.options.formData["attachments"] = paths.map((path) => {
            return fs.createReadStream(path);
        });
        return this;
    }
    withTicketID(id) {
        if (!this.options.formData) {
            this.options.formData = {};
        }
        this.options.formData["generalId"] = id;
        return this;
    }
}
exports.PostFile = PostFile;
class DeleteEntity extends Operation {
    constructor(targetProcess, entity, id) {
        super(targetProcess, entity, "DELETE", id);
    }
}
exports.DeleteEntity = DeleteEntity;

});

var tpApiHelper$1 = unwrapExports(tpApiHelper);
var tpApiHelper_1 = tpApiHelper.TargetProcess;
var tpApiHelper_2 = tpApiHelper.Operation;
var tpApiHelper_3 = tpApiHelper.GetEntity;
var tpApiHelper_4 = tpApiHelper.PostEntity;
var tpApiHelper_5 = tpApiHelper.PostFile;
var tpApiHelper_6 = tpApiHelper.DeleteEntity;

export default tpApiHelper$1;
export { tpApiHelper_6 as DeleteEntity, tpApiHelper_3 as GetEntity, tpApiHelper_2 as Operation, tpApiHelper_4 as PostEntity, tpApiHelper_5 as PostFile, tpApiHelper_1 as TargetProcess };
