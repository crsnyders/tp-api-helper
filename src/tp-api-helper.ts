let request = require("request")

export type EntityType =
  | "UserStories"
  | "Bugs"
  | "Builds"
  | "Epics"
  | "Features"
  | "Tasks"
  | "Requesters"
  | "Users"
  | "Assignables"
  | "Generals"
  | "Projects"
  | "EntityStates"

export interface PasswordAuth {
  username?: string
  password?: string
}
export interface TokenAuth {
  token?: string
  access_token?: string
}
export interface Entity {
  ResourceType: EntityType
  EntityType: any
}
export interface Results {
  Next?: string
  Prev?: string
  Items: Array<Entity>
}

export class TargetProcess {
  public options: any = {
    json: true,
    qs: { token: undefined, access_token: undefined },
    headers: { authorization: undefined },
    url: undefined
  }

  constructor(
    public domain: string,
    public protocol: "http" | "https",
    public version: number,
    public auth: PasswordAuth | TokenAuth
  ) {
    this.options.url =
      this.protocol + "://" + this.domain + "/api/v" + this.version
    if (
      auth &&
      (this.auth as PasswordAuth).username &&
      (this.auth as PasswordAuth).password
    ) {
      this.options.headers.authorization = new Buffer(
        (this.auth as PasswordAuth).username +
          ":" +
          (this.auth as PasswordAuth).password
      ).toString("base64")
    } else if (
      auth &&
      ((auth as TokenAuth).access_token || (auth as TokenAuth).token)
    ) {
      this.options.qs.token = (auth as TokenAuth).token
      this.options.qs.access_token = (auth as TokenAuth).access_token
    }
  }

  /**
   * Fetch an entity
   */
  get(entity: EntityType, id?: number) {
    return new GetEntity(this, entity, id)
  }
  /**
   * Create or update an entity
   */
  post(entity: EntityType, id?: number) {
    return new PostEntity(this, entity, id)
  }
  /**
   * Delete an entity id required
   */
  delete(entity: EntityType, id: number) {
    return new DeleteEntity(this, entity, id)
  }

  execute(): Promise<Results | Entity> {
    return new Promise((resolve, reject) => {
      this.options.callback = (error: any, response: any, body: any) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(body)
        }
      }
      return new request.Request(this.options)
    })
  }
}

export class Operation extends TargetProcess {
  constructor(
    targetProcess: TargetProcess,
    entity: EntityType,
    method: string,
    id?: number
  ) {
    super(
      targetProcess.domain,
      targetProcess.protocol,
      targetProcess.version,
      targetProcess.auth
    )
    this.options.entity = entity
    this.options.url = this.options.url + "/" + this.options.entity
    if (id) {
      this.options.entityId = id
      this.options.url = this.options.url + "/" + this.options.entityId
    }
    this.options.method = method

    if (this.options.headers.authorization) {
      this.basicAuthorization("Basic " + this.options.headers.authorization)
    } else if (this.options.qs.token) {
      this.token(this.options.qs.token)
    } else if (this.options.qs.access_token) {
      this.access_token(this.options.qs.access_token)
    }
  }
  /**
   * Token, which was generated at Personal Details page (Access Tokens tab). Other options: token or basic authentication
   */
  access_token(value: string): Operation {
    this.options.qs.access_token = value
    return this
  }
  /**
   * Token, which was generated at /api/v1/Authentication. Other options: access_token or basic authentication
   */
  token(value: string): Operation {
    this.options.qs.token = value
    return this
  }
  /** 
   * Basic authentication as a a Base64 encoded values for login:password. Other options: access_token or token
   */
  basicAuthorization(value: string): Operation {
    this.options.headers["Authorization"] = value
    return this
  }
}
export class GetEntity extends Operation {
  constructor(targetProcess: TargetProcess, entity: EntityType, id?: number) {
    super(targetProcess, entity, "GET", id)
  }
  /**
   * Filtering by fields and nested fields. Example: EntityState.IsInitial eq 'true'
   */
  where(value: string): GetEntity {
    this.options.qs.where = value
    return this
  }
  /**
   * You can explicitly specify attributes that you want to have in the response. It is possible to include Fields, Collections and Nested Entities (with inner Fields). Example: [Name, Iteration[Name]]. Cannot be used together with 'exclude' param.
   */
  include(...value: string[]): GetEntity {
    if (this.options.qs.exclude) {
      this.options.qs.exclude = undefined
    }
    this.options.qs.include = "[" + value.toString() + "]"
    return this
  }
  /**
   * You can explicitly specify attributes that you do not want to have in the response. Cannot be used together with 'include' param.
   */
  exclude(...value: string[]): GetEntity {
    if (this.options.qs.include) {
      this.options.qs.include = undefined
    }
    this.options.qs.exclude = "[" + value.toString() + "]"
    return this
  }
  /**
   * Get more information about Entity in a single request. For example, you can retrieve Tasks and Bugs count: [Bugs-Count,Tasks-Count]
   */
  append(value: string): GetEntity {
    this.options.qs.append = value
    return this
  }
  /** 
   * This parameter controls paging. Defines how many items will be skipped
   */
  skip(value: number): GetEntity {
    this.options.qs.skip = value
    return this
  }
  /**
   * This parameter controls paging. Defines how many items will be returned. Limit is 1000
   */
  take(value: number): GetEntity {
    this.options.qs.take = value
    return this
  }
  /**
   * This parameter controls paging for inner collections. Defines how many items will be returned. Limit is 1000 (in total, not per one item)
   */
  innerTake(value: number): GetEntity {
    this.options.qs.innerTake = value
    return this
  }
  /**
   * Ordering by fields and nested fields
   */
  orderBy(value: string): GetEntity {
    this.options.qs.orderBy = value
    return this
  }
  /**
   * Ordering by fields and nested fields
   */
  orderByDesc(value: string): GetEntity {
    this.options.qs.orderByDesc = value
    return this
  }
  /**
   * Response format (JSON or XML)
   */
  format(value: "JSON" | "XML"): GetEntity {
    this.options.qs.format = value
    return this
  }
}

export class PostEntity extends Operation {
  constructor(targetProcess: TargetProcess, entity: EntityType, id?: number) {
    super(targetProcess, entity, "POST", id)
  }

  withBody<T>(value: T) {
    this.options.json = value
    return this
  }
  /**
   * Response format (JSON or XML)
   */
  format(value: string): PostEntity {
    this.options.qs.format = value
    return this
  }

  /**
   * You can explicitly specify attributes of newly created or updated Story that you want to have in the response. It is possible to include Fields, Collections and Nested Entities (with inner Fields). Example: [Name, Iteration[Name]]. Cannot be used together with 'exclude' param.
   */
  include(...value: string[]): PostEntity {
    if (this.options.qs.exclude) {
      this.options.qs.exclude = undefined
    }
    this.options.qs.include = "[" + value.toString() + "]"
    return this
  }
  /**
   * You can explicitly specify attributes of newly created or updated Story that you do not want to have in the response. Cannot be used together with 'include' param.
   */
  exclude(...value: string[]): PostEntity {
    if (this.options.qs.include) {
      this.options.qs.include = undefined
    }
    this.options.qs.exclude = "[" + value.toString() + "]"
    return this
  }
  /**
   * Specify in which format (JSON or XML) and charset (in case of not ASCII characters) you're sending the body. E.g.: application/xml or application/json; charset=UTF-8
   */
  content_type(value: "JSON" | "XML"): PostEntity {
    this.options.headers["Content-type"] = value
    return this
  }
}

export class DeleteEntity extends Operation {
  constructor(targetProcess: TargetProcess, entity: EntityType, id: number) {
    super(targetProcess, entity, "DELETE", id)
  }
}
