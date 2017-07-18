export declare type EntityType = "UserStories" | "Bugs" | "Builds" | "Epics" | "Features" | "Tasks" | "Requesters" | "Users" | "Assignables" | "Generals" | "Projects" | "EntityStates";
export declare class Entity {
    ResourceType: EntityType;
    EntityType: any;
}
export declare class Results {
    Next?: string;
    Prev?: string;
    Items: Array<Entity>;
}
export declare class TargetProcess {
    domain: string;
    protocol: "http" | "https";
    version: number;
    username: string | undefined;
    password: string | undefined;
    options: any;
    headers: Headers;
    private url;
    constructor(domain: string, protocol: "http" | "https", version: number, username?: string | undefined, password?: string | undefined);
    /**
    Fetch an entity
    */
    get(entity: Entity, id?: number): GetEntity;
    /**
    Create or update an entity
    */
    post(entity: Entity, id?: number): PostEntity;
    /**
    Delete an entity id required
    */
    delete(entity: Entity, id: number): DeleteEntity;
    execute(): Promise<Results | Entity>;
}
export declare class Operation extends TargetProcess {
    constructor(targetProcess: TargetProcess, entity: Entity, method: string, id?: number);
    /**
  Token, which was generated at Personal Details page (Access Tokens tab). Other options: token or basic authentication
  */
    access_token(value: string): Operation;
    /**
    Token, which was generated at /api/v1/Authentication. Other options: access_token or basic authentication
    */
    token(value: string): Operation;
    /**
    Basic authentication as a a Base64 encoded values for login:password. Other options: access_token or token
    */
    autherization(value: string): Operation;
}
export declare class GetEntity extends Operation {
    constructor(targetProcess: TargetProcess, entity: Entity, id?: number);
    /**
    Filtering by fields and nested fields. Example: EntityState.IsInitial eq 'true'
    */
    where(value: string): GetEntity;
    /**
    You can explicitly specify attributes that you want to have in the response. It is possible to include Fields, Collections and Nested Entities (with inner Fields). Example: [Name, Iteration[Name]]. Cannot be used together with 'exclude' param.
    */
    include(...value: string[]): GetEntity;
    /**
    You can explicitly specify attributes that you do not want to have in the response. Cannot be used together with 'include' param.
    */
    exclude(...value: string[]): GetEntity;
    /**
    Get more information about Entity in a single request. For example, you can retrieve Tasks and Bugs count: [Bugs-Count,Tasks-Count]
    */
    append(value: string): GetEntity;
    /**
    This parameter controls paging. Defines how many items will be skipped
    */
    skip(value: number): GetEntity;
    /**
    This parameter controls paging. Defines how many items will be returned. Limit is 1000
    */
    take(value: number): GetEntity;
    /**
    This parameter controls paging for inner collections. Defines how many items will be returned. Limit is 1000 (in total, not per one item)
    */
    innertake(value: number): GetEntity;
    /**
    Ordering by fields and nested fields
    */
    ordreby(value: string): GetEntity;
    /**
    Ordering by fields and nested fields
    */
    orderbydesc(value: string): GetEntity;
    /**
    Response format (JSON or XML)
    */
    format(value: "JSON" | "XML"): GetEntity;
}
export declare class PostEntity extends Operation {
    constructor(targetProcess: TargetProcess, entity: Entity, id?: number);
    withBody<T>(value: T): this;
    /**
    Response format (JSON or XML)
    */
    format(value: string): PostEntity;
    /**
  You can explicitly specify attributes of newly created or updated Story that you want to have in the response. It is possible to include Fields, Collections and Nested Entities (with inner Fields). Example: [Name, Iteration[Name]]. Cannot be used together with 'exclude' param.
  */
    include(...value: string[]): PostEntity;
    /**
    You can explicitly specify attributes of newly created or updated Story that you do not want to have in the response. Cannot be used together with 'include' param.
    */
    exclude(...value: string[]): PostEntity;
    /**
  Specify in which format (JSON or XML) and chartset (in case of not ASCII characters) you're sending the body. E.g.: application/xml or application/json; charset=UTF-8
  */
    content_type(value: "JSON" | "XML"): PostEntity;
}
export declare class DeleteEntity extends Operation {
    constructor(targetProcess: TargetProcess, entity: Entity, id: number);
}
