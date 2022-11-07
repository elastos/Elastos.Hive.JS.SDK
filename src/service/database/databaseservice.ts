import {JSONObject} from "@elastosfoundation/did-js-sdk";
import {ServiceEndpoint} from "../..";
import {RestServiceT} from "../restservice";
import {InsertOptions} from "./insertoptions";
import {InsertResult} from "./insertresult";
import {FindOptions} from "./findoptions";
import {CountOptions} from "./countoptions";
import {QueryOptions} from "./queryoptions";
import {UpdateOptions} from "./updateoptions";
import {UpdateResult} from "./updateresult";
import {DeleteOptions} from "./deleteoptions";
import {DatabaseAPI} from "./databaseapi";
import {FindResult} from "./findresult";
import {EncryptionValue} from "../../utils/encryption/encryptionvalue";
import {Collection} from "./collection";

/**
 * Database service is for save JSON data on the mongo database on hive node.
 *
 * It also support the encryption of the fields of documents.
 *
 * If wants encryptDoc the document, please make sure the document is Object or Map.
 */
export class DatabaseService extends RestServiceT<DatabaseAPI> {
    constructor(serviceContext: ServiceEndpoint) {
		super(serviceContext);
	}

    /**
     * Get all collections under user database.
     *
     * @return collection list
     */
    async getCollections(): Promise<Collection[]>{
        return await this.callAPI(DatabaseAPI, async (api) => {
            return await api.getCollections(await this.getAccessToken());
        });
    }

	/**
	 * Lets the vault owner create a collection on database.
	 *
	 * @param collectionName the collection name.
	 * @param isEncrypt whether the collection is encryption.
	 * @return void
	 */
	protected async createCollectionInternal(collectionName: string, isEncrypt=false): Promise<void>{
	    let body = {};
	    if (isEncrypt) {
	        body['is_encrypt'] = true;
	        body['encrypt_method'] = EncryptionValue.ENCRYPT_METHOD;
        }
        await this.callAPI(DatabaseAPI, async (api) => {
            return await api.createCollection(await this.getAccessToken(), collectionName, body);
        });
	}

	async createCollection(collectionName: string): Promise<void> {
	    return this.createCollectionInternal(collectionName);
    }

	/**
	 * Lets the vault owner delete a collection on database according to collection name.
	 *
	 * @param collectionName the collection name
	 * @return void
	 */
	async deleteCollection(collectionName: string): Promise<void>{
        await this.callAPI(DatabaseAPI, async (api) => {
            return await api.deleteCollection(await this.getAccessToken(), collectionName);
        })
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
		return await this.insertMany(collectionName, [doc], options);
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
        let body = {
            "document": docs
        };
        if (options) {
            body['options'] = options;
        }

        return await this.callAPI(DatabaseAPI, async (api) => {
            return await api.insert(await this.getAccessToken(), collectionName, body);
        });
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
        let body = {
            "filter": filter
        };
        if (options) {
            body['options'] = options;
        }

        return await this.callAPI(DatabaseAPI, async (api) => {
            return await api.count(await this.getAccessToken(), collectionName, body);
        });
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
		const docs = await this.findMany(collectionName, filter, options);
        return !docs || docs.length === 0 ? null : docs[0];
	}

	/**
	 * Find many documents.
	 *
	 * @param collectionName the collection name
	 * @param filter optional, a JSON object specifying elements which must be present for a document to be included in the result set
	 * @param options optional,refer to {@link FindOptions}
	 * @return a JsonNode array result of document
	 */
	protected async findManyInternal(collectionName: string, filter: JSONObject, options?: FindOptions) : Promise<FindResult> {
        const filterJson = filter === null ? {} : filter;
        const skip = options ? options.skip : undefined;
        const limit = options ? options.limit : undefined;

        return await this.callAPI(DatabaseAPI, async (api) => {
            return await api.find(await this.getAccessToken(), collectionName, JSON.stringify(filterJson), skip, limit);
        });
	}

    async findMany(collectionName: string, filter: JSONObject, options?: FindOptions) : Promise<JSONObject[]> {
	    const result: FindResult = await this.findManyInternal(collectionName, filter, options);
	    return result.getItems();
    }

 	/**
 	 * Find many documents by many options.
 	 *
 	 * @param collectionName the collection name
 	 * @param filter optional, a JSON object specifying elements which must be present for a document to be included in the result set
 	 * @param options optional,refer to {@link QueryOptions}
 	 * @return a JsonNode array result of document
 	 */
	protected async queryInternal(collectionName: string, filter: JSONObject, options?: QueryOptions): Promise<FindResult> {
        let body = {
            "collection": collectionName,
            "filter": filter
        };
        const optionsJson = DatabaseService.normalizeSortQueryOptions(options);
        if (optionsJson) {
            body['options'] = optionsJson;
        }

        return await this.callAPI(DatabaseAPI, async (api) => {
            return await api.query(await this.getAccessToken(), collectionName, body);
        });
	}

    async query(collectionName: string, filter: JSONObject, options?: QueryOptions): Promise<JSONObject[]> {
        const result: FindResult = await this.queryInternal(collectionName, filter, options);
        return result.getItems();
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
		return await this.updateInternal(collectionName, true, filter, update, options);
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
		 return await this.updateInternal(collectionName, false, filter, update, options);
	}


 	/**
 	 * Delete an existing document in a given collection.
 	 *
 	 * @param collectionName the collection name
 	 * @param filter A query that matches the document to delete.
 	 * @return Delete result
 	 */
	async deleteOne(collectionName: string, filter: JSONObject): Promise<void> {
		return await this.deleteInternal(collectionName, true, filter);
	}


 	/**
 	 * Delete many existing documents in a given collection.
 	 *
 	 * @param collectionName the collection name
 	 * @param filter A query that matches the document to delete.
 	 * @return Delete result
 	 */
	async deleteMany(collectionName: string, filter: JSONObject): Promise<void> {
		return await this.deleteInternal(collectionName, false, filter);
	}

	private static normalizeSortQueryOptions(options: QueryOptions): QueryOptions {
		if (options && options.sort) {
			let sortQuery = [];
			for (const s of options.sort) {
				sortQuery.push([s.key, s.order])
			}
			options.sort = sortQuery;
		}
		return options;
	}

	protected async updateInternal(collectionName: string, isOnlyOne: boolean, filter: JSONObject, update: JSONObject,
                                 options?: UpdateOptions): Promise<UpdateResult> {
        let body = {
            "filter": filter,
            "update": update
        };
        if (options) {
            body['options'] = options;
        }
        return await this.callAPI(DatabaseAPI, async (api) => {
            return await api.update(await this.getAccessToken(), collectionName, isOnlyOne, body);
        });
	}

	private async deleteInternal(collectionName: string, isOnlyOne:boolean, filter: JSONObject,
                                 options?: DeleteOptions): Promise<void> {
        let body = {
            "filter": filter
        };
        if (options) {
            body['options'] = options;
        }
        await this.callAPI(DatabaseAPI, async (api) => {
            return await api.delete(await this.getAccessToken(), collectionName, isOnlyOne, {
                "filter": filter,
                "options": options
            });
        });
	}
}
