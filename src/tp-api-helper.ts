//import * as request from 'request';
let request = require("request")

//require('request-debug')(request);
import * as $ from "jquery"
import { URL } from "url"

export type Entity =
  | "UserStories"
  | "Bugs"
  | "Epics"
  | "Features"
  | "Tasks"
  | "Requesters"
  | "Users"
  | "Assignables"
  | "Generals"
  | "Projects"
  | "EntityStates"
export class Results {
  Next?: string
  Prev?: string
  Items: Array<any>
}

export class TargetProcess {
  options: any = {
    json: true,
    qs: { token: undefined },
    headers: { Authorization: undefined }
  }
  headers: Headers
  private url: string
  constructor(
    public domain: string,
    public protocol: "http" | "https",
    public version: number,
    public username?: string,
    public password?: string
  ) {
    this.options.url =
      this.protocol + "://" + this.domain + "/api/v" + this.version
    if (this.username && this.password) {
      this.options.qs.token = new Buffer(
        this.username + ":" + this.password
      ).toString("base64")
    }
  }

  /**
  Fetch an entity
  */
  get(entity: Entity, id?: number) {
    return new GetEntity(this, entity, id)
  }
  /**
  Create or update an entity
  */
  post(entity: Entity, id?: number) {
    return new PostEntity(this, entity, id)
  }
  /**
  Delete an entity id required
  */
  delete(entity: Entity, id: number) {
    return new DeleteEntity(this, entity, id)
  }

  execute(): Promise<Results> {
    return new Promise((resolve, reject) => {
      this.options.callback = (error: any, response: any, body: any) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(body)
        }
      }
      new request.Request(this.options)
    })
  }
}

export class Operation extends TargetProcess {
  constructor(
    targetProcess: TargetProcess,
    entity: Entity,
    method: string,
    id?: number
  ) {
    super(
      targetProcess.domain,
      targetProcess.protocol,
      targetProcess.version,
      targetProcess.username,
      targetProcess.password
    )
    this.options.entity = entity
    this.options.url = this.options.url + "/" + this.options.entity
    if (id) {
      this.options.entityid = id
      this.options.url = this.options.url + "/" + this.options.entityid
    }
    this.options.method = method
    this.autherization("Basic " + this.options.qs.token)
    this.token(this.options.qs.token)
  }
  /**
Token, which was generated at Personal Details page (Access Tokens tab). Other options: token or basic authentication
*/
  access_token(value: string): Operation {
    this.options.qs.access_token = value
    return this
  }
  /**
  Token, which was generated at /api/v1/Authentication. Other options: access_token or basic authentication
  */
  token(value: string): Operation {
    this.options.qs.token = value
    return this
  }
  /**
  Basic authentication as a a Base64 encoded values for login:password. Other options: access_token or token
  */
  autherization(value: string): Operation {
    this.options.headers["Authorization"] = value
    return this
  }
}
export class GetEntity extends Operation {
  constructor(targetProcess: TargetProcess, entity: Entity, id?: number) {
    super(targetProcess, entity, "GET", id)
  }
  /**
  Filtering by fields and nested fields. Example: EntityState.IsInitial eq 'true'
  */
  where(value: string): GetEntity {
    this.options.qs.where = value
    return this
  }
  /**
  You can explicitly specify attributes that you want to have in the response. It is possible to include Fields, Collections and Nested Entities (with inner Fields). Example: [Name, Iteration[Name]]. Cannot be used together with 'exclude' param.
  */
  include(...value: string[]): GetEntity {
    if (this.options.qs.exclude) {
      this.options.qs.exclude = undefined
    }
    this.options.qs.include = "[" + value.toString() + "]"
    return this
  }
  /**
  You can explicitly specify attributes that you do not want to have in the response. Cannot be used together with 'include' param.
  */
  exclude(...value: string[]): GetEntity {
    if (this.options.qs.include) {
      this.options.qs.include = undefined
    }
    this.options.qs.exclude = "[" + value.toString() + "]"
    return this
  }
  /**
  Get more information about Entity in a single request. For example, you can retrieve Tasks and Bugs count: [Bugs-Count,Tasks-Count]
  */
  append(value: string): GetEntity {
    this.options.qs.append = value
    return this
  }
  /**
  This parameter controls paging. Defines how many items will be skipped
  */
  skip(value: number): GetEntity {
    this.options.qs.skip = value
    return this
  }
  /**
  This parameter controls paging. Defines how many items will be returned. Limit is 1000
  */
  take(value: number): GetEntity {
    this.options.qs.take = value
    return this
  }
  /**
  This parameter controls paging for inner collections. Defines how many items will be returned. Limit is 1000 (in total, not per one item)
  */
  innertake(value: number): GetEntity {
    this.options.qs.innertake = value
    return this
  }
  /**
  Ordering by fields and nested fields
  */
  ordreby(value: string): GetEntity {
    this.options.qs.ordreby = value
    return this
  }
  /**
  Ordering by fields and nested fields
  */
  orderbydesc(value: string): GetEntity {
    this.options.qs.qs.orderbydesc = value
    return this
  }
  /**
  Response format (JSON or XML)
  */
  format(value: "JSON" | "XML"): GetEntity {
    this.options.qs.format = value
    return this
  }
}

export class PostEntity extends Operation {
  constructor(targetProcess: TargetProcess, entity: Entity, id?: number) {
    super(targetProcess, entity, "POST", id)
  }

  withbody<T>(value: T) {
    this.options.json = value
    return this
  }
  /**
  Response format (JSON or XML)
  */
  format(value: string): PostEntity {
    this.options.qs.format = value
    return this
  }

  /**
You can explicitly specify attributes of newly created or updated Story that you want to have in the response. It is possible to include Fields, Collections and Nested Entities (with inner Fields). Example: [Name, Iteration[Name]]. Cannot be used together with 'exclude' param.
*/
  include(...value: string[]): PostEntity {
    if (this.options.qs.exclude) {
      this.options.qs.exclude = undefined
    }
    this.options.qs.include = "[" + value.toString() + "]"
    return this
  }
  /**
  You can explicitly specify attributes of newly created or updated Story that you do not want to have in the response. Cannot be used together with 'include' param.
  */
  exclude(...value: string[]): PostEntity {
    if (this.options.qs.include) {
      this.options.qs.include = undefined
    }
    this.options.qs.exclude = "[" + value.toString() + "]"
    return this
  }
  /**
Specify in which format (JSON or XML) and chartset (in case of not ASCII characters) you're sending the body. E.g.: application/xml or application/json; charset=UTF-8
*/
  content_type(value: "JSON" | "XML"): PostEntity {
    this.options.headers["Content-type"] = value
    return this
  }
}

export class DeleteEntity extends Operation {
  constructor(targetProcess: TargetProcess, entity: Entity, id: number) {
    super(targetProcess, entity, "DELETE", id)
  }
}