import {JSONObject, Cipher} from "@elastosfoundation/did-js-sdk";
import {DatabaseService} from "./databaseservice";
import {CountOptions} from "./countoptions";
import {FindOptions} from "./findoptions";
import {InsertOptions} from "./insertoptions";
import {InsertResult} from "./insertresult";
import {QueryOptions} from "./queryoptions";
import {UpdateOptions} from "./updateoptions";
import {UpdateResult} from "./updateresult";
import {ServiceEndpoint} from "../../connection/serviceendpoint";
import {InvalidParameterException} from "../../exceptions";
import {DatabaseEncryption} from "./databaseencryption";
import {FindResult} from "./findresult";

export class EncryptionDatabaseService extends DatabaseService {
    private databaseEncrypt: DatabaseEncryption;

    constructor(serviceContext: ServiceEndpoint, cipher: Cipher, nonce: Buffer) {
        super(serviceContext);
        this.databaseEncrypt = new DatabaseEncryption(cipher, nonce);
    }

    async createCollection(collectionName: string): Promise<void> {
        return super.createCollectionInternal(collectionName, true);
    }

    async insertOne(collectionName: string, doc: any, options?: InsertOptions): Promise<InsertResult> {
        return super.insertMany(collectionName, [this.databaseEncrypt.encryptDoc(doc)], options);
    }

    async insertMany(collectionName: string, docs: any[], options?: InsertOptions): Promise<InsertResult>{
        return super.insertMany(collectionName, this.databaseEncrypt.encryptDocs(docs), options);
    }

    async countDocuments(collectionName: string, filter: JSONObject, options?: CountOptions): Promise<number> {
        return super.countDocuments(collectionName, this.databaseEncrypt.encryptFilter(filter), options);
    }

    async findOne(collectionName: string, filter: JSONObject, options?: FindOptions): Promise<JSONObject> {
        return super.findOne(collectionName, this.databaseEncrypt.encryptFilter(filter), options);
    }

    async findMany(collectionName: string, filter: JSONObject, options?: FindOptions) : Promise<JSONObject[]> {
        const result: FindResult = await super.findManyInternal(
            collectionName, this.databaseEncrypt.encryptFilter(filter), options);
        if (!result.isEncrypt())
            throw new InvalidParameterException('Cannot decrypt the documents from the encryption collection.');

        return this.databaseEncrypt.encryptDocs(result.getItems(), false);
    }

    async query(collectionName: string, filter: JSONObject, options?: QueryOptions): Promise<JSONObject[]> {
        const result: FindResult = await super.queryInternal(collectionName,
            this.databaseEncrypt.encryptFilter(filter), options);
        if (!result.isEncrypt())
            throw new InvalidParameterException('Cannot decrypt the documents from the encryption collection.');

        return this.databaseEncrypt.encryptDocs(result.getItems(), false);
    }

    async updateOne(collectionName: string, filter: JSONObject, update: JSONObject,
                    options?: UpdateOptions): Promise<UpdateResult> {
        const filter_ = this.databaseEncrypt.encryptFilter(filter);
        const update_ = this.databaseEncrypt.encryptUpdate(update);
        return await super.updateInternal(collectionName, true, filter_, update_, options);
    }

    async updateMany(collectionName: string, filter: JSONObject, update: JSONObject,
                     options?: UpdateOptions): Promise<UpdateResult> {
        const filter_ = this.databaseEncrypt.encryptFilter(filter);
        const update_ = this.databaseEncrypt.encryptUpdate(update);
        return await this.updateInternal(collectionName, false, filter_, update_, options);
    }

    async deleteOne(collectionName: string, filter: JSONObject): Promise<void> {
        await super.deleteOne(collectionName, this.databaseEncrypt.encryptFilter(filter));
    }

    async deleteMany(collectionName: string, filter: JSONObject): Promise<void> {
        await super.deleteMany(collectionName, this.databaseEncrypt.encryptFilter(filter));
    }
}