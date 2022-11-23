import {JSONObject, Cipher} from "@elastosfoundation/did-js-sdk";
import {InvalidParameterException} from "../../exceptions";
import {ServiceEndpoint} from "../../connection/serviceendpoint";
import {DatabaseService} from "./databaseservice";
import {CountOptions} from "./countoptions";
import {FindOptions} from "./findoptions";
import {InsertOptions} from "./insertoptions";
import {InsertResult} from "./insertresult";
import {QueryOptions} from "./queryoptions";
import {UpdateOptions} from "./updateoptions";
import {UpdateResult} from "./updateresult";
import {DatabaseEncryption} from "./databaseencryption";
import {FindResult} from "./findresult";

/**
 * The encryption database service is the encryption version of the database service.
 */
export class EncryptionDatabaseService extends DatabaseService {
    private databaseEncrypt: DatabaseEncryption;

    constructor(serviceContext: ServiceEndpoint, cipher: Cipher, nonce: Buffer) {
        super(serviceContext);
        this.databaseEncrypt = new DatabaseEncryption(cipher, nonce);
    }

    /**
     * Create a new collection.
     *
     * @param collectionName the collection name.
     * @return void
     */
    async createCollection(collectionName: string): Promise<void> {
        return super.createCollectionInternal(collectionName, true);
    }

    /**
     * Insert a new document in a given collection.
     *
     * @param collectionName the collection name
     * @param doc The document to insert. Must be a mutable mapping type. If
     *			the document does not have an _id field one will be added automatically
     * @param options bypass_document_validation: (optional) If True, allows
     *				the write to opt-out of document level validation. Default is False.
     * @return Results returned by {@link InsertResult} wrapper
     */
    async insertOne(collectionName: string, doc: any, options?: InsertOptions): Promise<InsertResult> {
        return super.insertMany(collectionName, [this.databaseEncrypt.encryptDoc(doc)], options);
    }

    /**
     * Insert many new documents in a given collection.
     *
     * @param collectionName the collection name
     * @param docs The document to insert. Must be a mutable mapping type. If the
     *			 document does not have an _id field one will be added automatically.
     * @param options ordered (optional): If True (the default) documents will be inserted on the server serially,
     *				in the order provided. If an error occurs all remaining inserts are aborted. If False, documents
     *				will be inserted on the server in arbitrary order, possibly in parallel, and all document inserts will be attempted.
     *				bypass_document_validation: (optional) If True, allows the write to opt-out of document level validation. Default is False.
     * @return Results returned by {@link InsertResult} wrapper
     */
    async insertMany(collectionName: string, docs: any[], options?: InsertOptions): Promise<InsertResult>{
        return super.insertMany(collectionName, this.databaseEncrypt.encryptDocs(docs), options);
    }

    /**
     * Count documents.
     *
     * @param collectionName the collection name
     * @param filter The document of filter
     * @param options
     *			  skip (number): The number of matching documents to skip before returning results.
     *			  limit (number): The maximum number of documents to count. Must be a positive integer. If not provided, no limit is imposed.
     *			  maxTimeMS (number): The maximum amount of time to allow this operation to run, in milliseconds.
     * @return count size
     */
    async countDocuments(collectionName: string, filter: JSONObject, options?: CountOptions): Promise<number> {
        return super.countDocuments(collectionName, this.databaseEncrypt.encryptFilter(filter), options);
    }

    /**
     * Find a specific document.
     *
     * @param collectionName the collection name
     * @param filter optional, a JSON object specifying elements which must be present for a document to be included in the result set
     * @param options optional,refer to {@link FindOptions}
     * @return a JSON object document result
     */
    async findOne(collectionName: string, filter: JSONObject, options?: FindOptions): Promise<JSONObject> {
        return super.findOne(collectionName, this.databaseEncrypt.encryptFilter(filter), options);
    }

    /**
     * Find all matched documents.
     *
     * @param collectionName the collection name
     * @param filter optional, a JSON object specifying elements which must be present for a document to be included in the result set
     * @param options optional,refer to {@link FindOptions}
     * @return a JSON object document result
     */
    async findMany(collectionName: string, filter: JSONObject, options?: FindOptions) : Promise<JSONObject[]> {
        const result: FindResult = await super.findManyInternal(
            collectionName, this.databaseEncrypt.encryptFilter(filter), options);
        if (!result.isEncrypt())
            throw new InvalidParameterException('Cannot decrypt the documents from the encryption collection.');

        return this.databaseEncrypt.encryptDocs(result.getItems(), false);
    }

    /**
     * Find many documents by many options.
     *
     * @param collectionName the collection name
     * @param filter optional, a JSON object specifying elements which must be present for a document to be included in the result set
     * @param options optional,refer to {@link QueryOptions}
     * @return a JsonNode array result of document
     */
    async query(collectionName: string, filter: JSONObject, options?: QueryOptions): Promise<JSONObject[]> {
        const result: FindResult = await super.queryInternal(collectionName,
            this.databaseEncrypt.encryptFilter(filter), options);
        if (!result.isEncrypt())
            throw new InvalidParameterException('Cannot decrypt the documents from the encryption collection.');

        return this.databaseEncrypt.encryptDocs(result.getItems(), false);
    }

    /**
     * Update an existing document in a given collection.
     *
     * @param collectionName the collection name
     * @param filter A query that matches the document to update.
     * @param update The modifications to apply.
     * @param options optional, refer to {@link UpdateOptions}
     * @return Results returned by {@link UpdateResult} wrapper
     */
    async updateOne(collectionName: string, filter: JSONObject, update: JSONObject,
                    options?: UpdateOptions): Promise<UpdateResult> {
        const filter_ = this.databaseEncrypt.encryptFilter(filter);
        const update_ = this.databaseEncrypt.encryptUpdate(update);
        return await super.updateInternal(collectionName, true, filter_, update_, options);
    }

    /**
     * Update many existing documents in a given collection.
     *
     * @param collectionName the collection name
     * @param filter A query that matches the document to update.
     * @param update The modifications to apply.
     * @param options optional, refer to {@link UpdateOptions}
     * @return Results returned by {@link UpdateResult} wrapper
     */
    async updateMany(collectionName: string, filter: JSONObject, update: JSONObject,
                     options?: UpdateOptions): Promise<UpdateResult> {
        const filter_ = this.databaseEncrypt.encryptFilter(filter);
        const update_ = this.databaseEncrypt.encryptUpdate(update);
        return await this.updateInternal(collectionName, false, filter_, update_, options);
    }

    /**
     * Delete an existing document in a given collection.
     *
     * @param collectionName the collection name
     * @param filter A query that matches the document to delete.
     * @return Delete result
     */
    async deleteOne(collectionName: string, filter: JSONObject): Promise<void> {
        await super.deleteOne(collectionName, this.databaseEncrypt.encryptFilter(filter));
    }

    /**
     * Delete many existing documents in a given collection.
     *
     * @param collectionName the collection name
     * @param filter A query that matches the document to delete.
     * @return Delete result
     */
    async deleteMany(collectionName: string, filter: JSONObject): Promise<void> {
        await super.deleteMany(collectionName, this.databaseEncrypt.encryptFilter(filter));
    }
}
