import { ISessionItems } from "../Interfaces/ISessionItems";
export interface IInsertOneOptions {
    bypass_document_validation: boolean;
}
export interface IInsertOneResponse {
    acknowledged: boolean;
    inserted_id: string;
}
export interface IUpdateOneOptions {
    upsert?: boolean;
    bypass_document_validation?: boolean;
}
export interface IUpdateOneResponse {
    acknowledged: boolean;
    matched_count: number;
    modified_count: number;
    upserted_id: string;
}
export interface IInsertManyOptions {
    bypass_document_validation?: boolean;
    ordered?: boolean;
}
export interface IInsertManyResponse {
    acknowledged: boolean;
    inserted_ids: string[];
}
export interface IUpdateManyOptions {
    upsert?: boolean;
    bypass_document_validation?: boolean;
}
export interface IUpdateManyResponse {
    acknowledged: boolean;
    matched_count: number;
    modified_count: number;
    upserted_id: string;
}
export interface IDeleteOneResponse {
    acknowledged: boolean;
    deleted_count: number;
}
export interface IDeleteManyResponse {
    acknowledged: boolean;
    deleted_count: number;
}
export interface ICountDocumentsOptions {
    skip?: number;
    limit?: number;
    maxTimeMS: number;
}
export interface ICountDocumentsResponse {
    count: number;
}
export declare enum EnumDirection {
    Ascending = "asc",
    Descending = "desc"
}
export interface ISortDirection {
    [key: string]: EnumDirection;
}
export interface IFindOneOptions {
    skip?: number;
    projection?: any;
    sort?: ISortDirection;
    allow_partial_results?: boolean;
    return_key: boolean;
    show_record_id: boolean;
    batch_size: number;
}
export interface IFindManyOptions extends IFindOneOptions {
    limit?: number;
}
export interface IDatabaseService {
    createCollection(collectionName: string): Promise<IDatabaseCollection>;
    deleteCollection(collectionName: string): Promise<void>;
    getCollection(collectionName: string): IDatabaseCollection;
    insertOne(collectionName: string, newDocument: any, options?: IInsertOneOptions): Promise<IInsertOneResponse>;
    insertMany(collectionName: string, newDocuments: any[], options?: IInsertManyOptions): Promise<IInsertManyResponse>;
    updateOne(collectionName: string, filter: any, updateCommand: any, options?: IUpdateOneOptions): Promise<IUpdateOneResponse>;
    updateMany(collectionName: string, filter: any, updateCommand: any, options?: IUpdateManyOptions): Promise<IUpdateManyResponse>;
    deleteOne(collectionName: string, filter: any): Promise<IDeleteOneResponse>;
    deleteMany(collectionName: string, filter: any): Promise<IDeleteManyResponse>;
    countDocuments(collectionName: string, filter: any, options?: ICountDocumentsOptions): Promise<ICountDocumentsResponse>;
    findOne(collectionName: string, filter: any, options?: IFindOneOptions): Promise<any>;
    findMany(collectionName: string, filter?: any, options?: IFindManyOptions): Promise<any[]>;
}
export declare class DatabaseService implements IDatabaseService {
    private _session;
    private _isConnected;
    constructor(session: ISessionItems);
    private checkConnection;
    createCollection(collectionName: string): Promise<IDatabaseCollection>;
    getCollection(collectionName: string): IDatabaseCollection;
    deleteCollection(collectionName: string): Promise<void>;
    insertOne(collectionName: string, newDocument: any, options?: IInsertOneOptions): Promise<IInsertOneResponse>;
    insertMany(collectionName: string, newDocuments: any[], options?: IInsertManyOptions): Promise<IInsertManyResponse>;
    updateOne(collectionName: string, filter: any, updateCommand: any, options?: IUpdateOneOptions): Promise<IUpdateOneResponse>;
    updateMany(collectionName: string, filter: any, updateCommand: any, options?: IUpdateManyOptions): Promise<IUpdateManyResponse>;
    deleteOne(collectionName: string, filter: any): Promise<IDeleteOneResponse>;
    deleteMany(collectionName: string, filter: any): Promise<IDeleteManyResponse>;
    countDocuments(collectionName: string, filter?: any, options?: ICountDocumentsOptions): Promise<ICountDocumentsResponse>;
    findOne(collectionName: string, filter: any, options?: IFindOneOptions): Promise<any>;
    findMany(collectionName: string, filter?: any, options?: IFindManyOptions): Promise<any[]>;
}
export interface IDatabaseCollection {
    drop(): Promise<void>;
    insertOne(newDocument: any, options?: IInsertOneOptions): Promise<IInsertOneResponse>;
    insertMany(newDocuments: any[], options?: IInsertManyOptions): Promise<IInsertManyResponse>;
    updateOne(filter: any, updateCommand: any, options?: IUpdateOneOptions): Promise<IUpdateOneResponse>;
    updateMany(filter: any, updateCommand: any, options?: IUpdateManyOptions): Promise<IUpdateManyResponse>;
    deleteOne(filter: any): Promise<IDeleteOneResponse>;
    deleteMany(filter: any): Promise<IDeleteManyResponse>;
    count(filter: any, options?: ICountDocumentsOptions): Promise<ICountDocumentsResponse>;
    findOne(filter: any, options?: IFindOneOptions): Promise<any>;
    findMany(filter?: any, options?: IFindManyOptions): Promise<any[]>;
}
