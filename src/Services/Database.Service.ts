
import { ISessionItems } from "../Interfaces/ISessionItems";
import { Util } from "../Util";

export interface IInsertOneOptions{
    bypass_document_validation: boolean
}

export interface IInsertOneResponse{
    acknowledged: boolean,
    inserted_id: string
}

export interface IUpdateOneOptions{
    upsert?: boolean,
    bypass_document_validation?: boolean
}

export interface IUpdateOneResponse{
    acknowledged: boolean,
    matched_count: number,
    modified_count: number
    upserted_id: string
}


export interface IInsertManyOptions{
    bypass_document_validation?: boolean,
    ordered?: boolean
}

export interface IInsertManyResponse{
    acknowledged: boolean,
    inserted_ids: string[]
}


export interface IUpdateManyOptions{
    upsert?: boolean,
    bypass_document_validation?: boolean
}

export interface IUpdateManyResponse{
    acknowledged: boolean,
    matched_count: number,
    modified_count: number
    upserted_id: string
}

export interface IDeleteOneResponse{
    acknowledged: boolean,
    deleted_count: number
}

export interface IDeleteManyResponse{
    acknowledged: boolean,
    deleted_count: number
}

export interface ICountDocumentsOptions{
    skip?: number,
    limit?: number,
    maxTimeMS: number
}

export interface ICountDocumentsResponse{
    count: number
}

export enum EnumDirection{
    Ascending =  "asc",
    Descending = "desc"
}

export interface ISortDirection{
    [key: string]: EnumDirection
}

export interface IFindOneOptions{
    skip?: number,
    projection?: any,
    sort?: ISortDirection,
    allow_partial_results?: boolean,
    return_key: boolean,
    show_record_id: boolean,
    batch_size: number
}

export interface IFindManyOptions extends IFindOneOptions{
    limit?: number
}


export interface IDatabaseService{
    createCollection(collectionName: string): Promise<IDatabaseCollection>;
    deleteCollection(collectionName: string): Promise<void>;
    getCollection(collectionName: string): IDatabaseCollection;
    insertOne(collectionName: string, newDocument: any, options?:IInsertOneOptions): Promise<IInsertOneResponse>;
    insertMany(collectionName: string, newDocuments: any[], options?:IInsertManyOptions): Promise<IInsertManyResponse>;
    updateOne(collectionName: string, filter:any, updateCommand: any, options?:IUpdateOneOptions): Promise<IUpdateOneResponse>;
    updateMany(collectionName: string, filter: any, updateCommand: any, options?:IUpdateManyOptions): Promise<IUpdateManyResponse>;
    deleteOne(collectionName: string, filter:any): Promise<IDeleteOneResponse>;
    deleteMany(collectionName: string, filter: any): Promise<IDeleteManyResponse>;
    countDocuments(collectionName: string, filter: any,  options?:ICountDocumentsOptions): Promise<ICountDocumentsResponse>;
    findOne(collectionName: string, filter: any,  options?:IFindOneOptions): Promise<any>;
    findMany(collectionName: string, filter?: any,  options?:IFindManyOptions): Promise<any[]>;
}

export class DatabaseService implements IDatabaseService{
    private _session: ISessionItems;
    private _isConnected: boolean = false;
    
   constructor(session: ISessionItems) {
        if (session && !session.isAnonymous && session.userToken && session.userToken.length > 0) {
            this._isConnected = true;
        }
        this._session = session;
    }

    private checkConnection(){
        if (!this._isConnected){
            throw Error("Hive is not connected")
        }
    }

    async createCollection(collectionName: string) : Promise<IDatabaseCollection> {
        this.checkConnection()

        let url = `${this._session.hiveInstanceUrl}/api/v1/db/create_collection`
        let document = {
            "collection": collectionName
        }
        
        await Util.SendPost({
            url: url,
            body: document,
            userToken: this._session.userToken
        })

        return this.getCollection(collectionName)
    }

    getCollection(collectionName: string) : IDatabaseCollection{
        return new DatabaseCollection(collectionName, this)
    }

    async deleteCollection(collectionName: string) {
        this.checkConnection()

        let url = `${this._session.hiveInstanceUrl}/api/v1/db/delete_collection`
        let document = {
            "collection": collectionName
        }
        await Util.SendPost({
            url: url,
            body: document,
            userToken: this._session.userToken
        })
    }


    async insertOne(collectionName: string, newDocument: any, options?:IInsertOneOptions): Promise<IInsertOneResponse> {
        this.checkConnection()

        let url = `${this._session.hiveInstanceUrl}/api/v1/db/insert_one`


        let document:any = {
            "collection": collectionName,
            "document": newDocument
        }
        if (options) document.options = options

        let response =  await Util.SendPost({
            url: url,
            body: document,
            userToken: this._session.userToken
        })

        return {
            acknowledged : response.acknowledged,
            inserted_id: response.inserted_id
        }
    }

    async insertMany(collectionName: string, newDocuments: any[], options?:IInsertManyOptions): Promise<IInsertManyResponse> {
        this.checkConnection()

        let url = `${this._session.hiveInstanceUrl}/api/v1/db/insert_many`

        if (!options)
        {
            options = {
                bypass_document_validation: false,
                ordered: true
            }
        }

        let document : any = {
            "collection": collectionName,
            "document": newDocuments,
        }

        let response =  await Util.SendPost({
            url: url,
            body: document,
            userToken: this._session.userToken
        })

        return {
            acknowledged : response.acknowledged,
            inserted_ids: response.inserted_ids
        }
    }


    async updateOne(collectionName: string, filter:any, updateCommand: any, options?:IUpdateOneOptions): Promise<IUpdateOneResponse> {
        this.checkConnection()

        let url = `${this._session.hiveInstanceUrl}/api/v1/db/update_one`


        let document:any = {
            "collection": collectionName,
            "filter": filter,
            "update": updateCommand
        }
        if (options) document.options = options

        let response =  await Util.SendPost({
            url: url,
            body: document,
            userToken: this._session.userToken
        })

        return {
            acknowledged : response.acknowledged,
            matched_count: response.matched_count,
            modified_count: response.modified_count,
            upserted_id: response.upserted_id
        }
    }

    async updateMany(collectionName: string, filter: any, updateCommand: any, options?:IUpdateManyOptions): Promise<IUpdateManyResponse> {
        this.checkConnection()

        let url = `${this._session.hiveInstanceUrl}/api/v1/db/update_many`


        let document:any = {
            "collection": collectionName,
            "filter": filter,
            "update": updateCommand
        }
        if (options) document.options = options

        let response =  await Util.SendPost({
            url: url,
            body: document,
            userToken: this._session.userToken
        })

        return {
            acknowledged : response.acknowledged,
            matched_count: response.matched_count,
            modified_count: response.modified_count,
            upserted_id: response.upserted_id
        }
    }

    async deleteOne(collectionName: string, filter:any): Promise<IDeleteOneResponse> {
        this.checkConnection()

        let url = `${this._session.hiveInstanceUrl}/api/v1/db/delete_one`


        let document:any = {
            "collection": collectionName,
            "filter": filter
        }

        let response =  await Util.SendPost({
            url: url,
            body: document,
            userToken: this._session.userToken
        })

        return {
            acknowledged : response.acknowledged,
            deleted_count: response.deleted_count
        }
    }

    async deleteMany(collectionName: string, filter: any): Promise<IDeleteManyResponse> {
        this.checkConnection()

        let url = `${this._session.hiveInstanceUrl}/api/v1/db/delete_many`


        let document:any = {
            "collection": collectionName,
            "filter": filter
        }

        let response =  await Util.SendPost({
            url: url,
            body: document,
            userToken: this._session.userToken
        })

        return {
            acknowledged : response.acknowledged,
            deleted_count: response.deleted_count
        }
    }

    async countDocuments(collectionName: string, filter: any = {},  options?:ICountDocumentsOptions): Promise<ICountDocumentsResponse> {
        this.checkConnection()

        let url = `${this._session.hiveInstanceUrl}/api/v1/db/count_documents`


        let document:any = {
            "collection": collectionName,
            "filter": filter
        }

        if (options) document.options = options

        let response =  await Util.SendPost({
            url: url,
            body: document,
            userToken: this._session.userToken
        })

        return {
            count : response.count
        }
    }


    async findOne(collectionName: string, filter: any,  options?:IFindOneOptions): Promise<any> {
        this.checkConnection()

        let url = `${this._session.hiveInstanceUrl}/api/v1/db/find_one`


        let document:any = {
            "collection": collectionName,
            "filter": filter
        }
        if (options) document.options = options

        let response =  await Util.SendPost({
            url: url,
            body: document,
            userToken: this._session.userToken
        })

        return response.items
    }

    async findMany(collectionName: string, filter?: any,  options?:IFindManyOptions): Promise<any[]> {
        this.checkConnection()

        let url = `${this._session.hiveInstanceUrl}/api/v1/db/find_many`


        let document:any = {
            "collection": collectionName,
            
        }
        if (filter) document.filter = filter;
        if (options) document.options = options

        let response =  await Util.SendPost({
            url: url,
            body: document,
            userToken: this._session.userToken
        })

        return response.items
    }

    
}

export interface IDatabaseCollection{
    drop() :Promise<void>
    insertOne(newDocument: any, options?:IInsertOneOptions): Promise<IInsertOneResponse>;
    insertMany(newDocuments: any[], options?:IInsertManyOptions): Promise<IInsertManyResponse>;
    updateOne(filter:any, updateCommand: any, options?:IUpdateOneOptions): Promise<IUpdateOneResponse>;
    updateMany(filter: any, updateCommand: any, options?:IUpdateManyOptions): Promise<IUpdateManyResponse>;
    deleteOne(filter:any): Promise<IDeleteOneResponse>;
    deleteMany(filter: any): Promise<IDeleteManyResponse>;
    count(filter: any,  options?:ICountDocumentsOptions): Promise<ICountDocumentsResponse>;
    findOne(filter: any,  options?:IFindOneOptions): Promise<any>;
    findMany(filter?: any,  options?:IFindManyOptions): Promise<any[]>;
}

class DatabaseCollection implements IDatabaseCollection{
    private _collectionName: string = "";
    private _service!: IDatabaseService

    constructor(collectionName: string, service: IDatabaseService) {
        this._collectionName = collectionName
        this._service = service;
    }

    drop(): Promise<void> {
        return this._service.deleteCollection(this._collectionName)
    }
    insertOne(newDocument: any, options?: IInsertOneOptions): Promise<IInsertOneResponse> {
        return this._service.insertOne(this._collectionName, newDocument, options)
    }
    insertMany(newDocuments: any[], options?: IInsertManyOptions): Promise<IInsertManyResponse> {
        return this._service.insertMany(this._collectionName, newDocuments, options)
    }
    updateOne(filter: any, updateCommand: any, options?: IUpdateOneOptions): Promise<IUpdateOneResponse> {
        return this._service.updateOne(this._collectionName, filter, updateCommand, options)
    }
    updateMany(filter: any, updateCommand: any, options?: IUpdateManyOptions): Promise<IUpdateManyResponse> {
        return this._service.updateMany(this._collectionName, filter, updateCommand, options)
    }
    deleteOne(filter: any): Promise<IDeleteOneResponse> {
        return this._service.deleteOne(this._collectionName, filter)
    }
    deleteMany(filter: any): Promise<IDeleteManyResponse> {
        return this._service.deleteMany(this._collectionName, filter)
    }
    count(filter: any = {}, options?: ICountDocumentsOptions): Promise<ICountDocumentsResponse> {
        return this._service.countDocuments(this._collectionName, filter, options)
    }
    findOne(filter: any, options?: IFindOneOptions): Promise<any> {
        return this._service.findOne(this._collectionName, filter, options)
    }
    findMany(filter?: any, options?: IFindManyOptions): Promise<any[]> {
        return this._service.findMany(this._collectionName, filter, options)
    }

    

}

