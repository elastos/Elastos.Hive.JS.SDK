import { NetworkException, NodeRPCException } from "../../exceptions";
import { HttpClient } from "../../connection/httpclient";
import { HttpMethod } from "../../connection/httpmethod";
import { ServiceEndpoint } from "../../connection/serviceendpoint";
import { Logger } from '../../utils/logger';
import { RestService } from "../restservice";
import { HttpResponseParser } from '../../connection/httpresponseparser';
import { InsertOptions } from "./insertoptions";
import { InsertResult } from "./insertresult";
import { FindOptions } from "./findoptions";
import { JSONObject } from "@elastosfoundation/did-js-sdk";
import { CountOptions } from "./countoptions";
import { QueryOptions } from "./queryoptions";
import { UpdateOptions } from "./updateoptions";
import { UpdateResult } from "./updateresult";
import { DeleteOptions } from "./deleteoptions";
import { DatabaseEncryption } from "./databaseencryption";

/**
 * Database service is for save JSON data on the mongo database on hive node.
 *
 * It also support the encryption of the fields of documents.
 *
 * If wants encryptDoc the document, please make sure the document is Object or Map.
 */
export class DatabaseService extends RestService {
	private static LOG = new Logger("DatabaseService");

	private static API_COLLECTION_ENDPOINT = "/api/v2/vault/db/collection";
	private static API_COLLECTIONS_ENDPOINT = "/api/v2/vault/db/collections";
	private static API_DB_ENDPOINT = "/api/v2/vault/db";

	private encrypt: boolean;
	private databaseEncrypt: DatabaseEncryption;

    constructor(serviceContext: ServiceEndpoint, httpClient: HttpClient) {
		super(serviceContext, httpClient);
        this.encrypt = false;
        this.databaseEncrypt = null;
	}

	public async encryptionInit(identifier: string, secureCode: number, storepass: string, nonce: Buffer) {
        this.encrypt = true;
        const cipher = await this.getEncryptionCipher(identifier, secureCode, storepass);
        this.databaseEncrypt = new DatabaseEncryption(cipher, nonce);
        // this.nonce = nonce;
    }

	/**
	 * Lets the vault owner create a collection on database.
	 *
	 * @param collectionName the collection name
	 * @return fail(false) or success(true)
	 */
	public async createCollection(collectionName: string) : Promise<void>{
        try {
            await this.httpClient.send<string>(`${DatabaseService.API_COLLECTIONS_ENDPOINT}/${collectionName}`, HttpClient.NO_PAYLOAD,
                <HttpResponseParser<string>>{
                    deserialize(content: any): string {
                        return JSON.parse(content)['name'];
                    }
                },
                HttpMethod.PUT);
        } catch (e) {
            this.handleError(e);
        }
	}

	/**
	 * Lets the vault owner delete a collection on database according to collection name.
	 *
	 * @param name the collection name
	 * @return fail(false) or success(true)
	 */
	public async deleteCollection(name: string) : Promise<void>{
		try {
			await this.httpClient.send(`${DatabaseService.API_DB_ENDPOINT}/${name}`, HttpClient.NO_PAYLOAD, HttpClient.NO_RESPONSE, HttpMethod.DELETE);
		} catch (e){
			this.handleError(e);
		}
	}

	/**
	* Insert a new document in a given collection.
	*
	* @param collection the collection name
	* @param doc The document to insert. Must be a mutable mapping type. If
	*			the document does not have an _id field one will be added automatically
	* @param options bypass_document_validation: (optional) If True, allows
	*				the write to opt-out of document level validation. Default is False.
	* @return Results returned by {@link InsertResult} wrapper
	*/
	public async insertOne( collection: string, doc: any, options?: InsertOptions) : Promise<InsertResult> {
		return await this.insertMany(collection, [doc], options);
	}

	/**
	* Insert many new documents in a given collection.
	*
	* @param collection the collection name
	* @param docs The document to insert. Must be a mutable mapping type. If the
	*			 document does not have an _id field one will be added automatically.
	* @param options ordered (optional): If True (the default) documents will be inserted on the server serially,
	*				in the order provided. If an error occurs all remaining inserts are aborted. If False, documents
	*				will be inserted on the server in arbitrary order, possibly in parallel, and all document inserts will be attempted.
	*				bypass_document_validation: (optional) If True, allows the write to opt-out of document level validation. Default is False.
	* @return Results returned by {@link InsertResult} wrapper
	*/
	public async insertMany(collection: string, docs: any[], options?: InsertOptions) : Promise<InsertResult>{
		try {
		    const encryptedDocs = this.encrypt ? this.databaseEncrypt.encryptDocs(docs) : docs;
			return await this.httpClient.send<InsertResult>(`${DatabaseService.API_COLLECTION_ENDPOINT}/${collection}`,
                {
                    "document": encryptedDocs,
                    "options": options
                },
                <HttpResponseParser<InsertResult>> {
                    deserialize(content: any): InsertResult {
                        let jsonObj = JSON.parse(content);
                        let result = new InsertResult();
                        result.setAcknowledge(jsonObj['acknowledge']);
                        result.setInsertedIds(jsonObj['inserted_ids']);

                        return result;
                    }
                },
                HttpMethod.POST);
		} catch (e){
			this.handleError(e);
		}
	}

 	/**
 	 * Count documents.
 	 *
 	 * @param collection the collection name
 	 * @param filter The document of filter
 	 * @param options
 	 *			  skip (number): The number of matching documents to skip before returning results.
 	 *			  limit (number): The maximum number of documents to count. Must be a positive integer. If not provided, no limit is imposed.
 	 *			  maxTimeMS (number): The maximum amount of time to allow this operation to run, in milliseconds.
 	 * @return count size
 	 */
 	public async countDocuments(collection: string, filter: JSONObject, options?: CountOptions): Promise<number> {
		try {
		    const encryptedFilter = this.encrypt ? this.databaseEncrypt.encryptFilter(filter) : filter;
			return await this.httpClient.send<number>(`${DatabaseService.API_COLLECTION_ENDPOINT}/${collection}?op=count`,
                {
                    "filter": encryptedFilter,
                    "options": options
                },
                <HttpResponseParser<number>> {
                    deserialize(content: any): number {
                        return JSON.parse(content)["count"];
                    }
                }, HttpMethod.POST);
		} catch (e){
			this.handleError(e);
		}
	}

	/**
	 * Find a specific document.
	 *
	 * @param collection the collection name
	 * @param query optional, a JSON object specifying elements which must be present for a document to be included in the result set
	 * @param options optional,refer to {@link FindOptions}
	 * @return a JSON object document result
	 */
	public async findOne(collection: string, filter: JSONObject, options?: FindOptions): Promise<JSONObject> {
        const encryptedFilter = this.encrypt ? this.databaseEncrypt.encryptFilter(filter) : filter;
		const docs = await this.findMany(collection, encryptedFilter, options);
		DatabaseService.LOG.debug(`fine docs: ${JSON.stringify(docs)}`);

		if (!docs || docs.length === 0) {
		    return null;
        }

		return this.encrypt ? this.databaseEncrypt.encryptDoc(docs[0], false) : docs[0];
	}

	/**
	 * Find many documents.
	 *
	 * @param collection the collection name
	 * @param query optional, a JSON object specifying elements which must be present for a document to be included in the result set
	 * @param options optional,refer to {@link FindOptions}
	 * @return a JsonNode array result of document
	 */

	public async findMany(collectionName: string, filter: JSONObject, options?: FindOptions) : Promise<JSONObject[]> {
		try {
            const encryptedFilter = this.encrypt ? this.databaseEncrypt.encryptFilter(filter) : filter;
            const filterStr = encryptedFilter === null ? "" : encodeURIComponent(JSON.stringify(encryptedFilter));
			DatabaseService.LOG.debug("FILTER_STR: " + filterStr);

            const skip = options !== undefined ? options.skip.toString() : 0;
            const limit = options !== undefined ? options.limit.toString() : 0;

			const result = await this.httpClient.send<JSONObject[]>(`${DatabaseService.API_DB_ENDPOINT}/${collectionName}`,
                    {
                        "skip": skip,
                        "limit": limit,
                        "filter": filterStr
                    },
                    <HttpResponseParser<JSONObject[]>> {
                        deserialize(content: any): JSONObject[] {
                            return JSON.parse(content)["items"];
                        }
                    },
                    HttpMethod.GET
                );

			return this.encrypt ? this.databaseEncrypt.encryptDocs(result, false) : result;
		} catch (e) {
			this.handleError(e);
		}
	}

 	/**
 	 * Find many documents by many options.
 	 *
 	 * @param collection the collection name
 	 * @param filter optional, a JSON object specifying elements which must be present for a document to be included in the result set
 	 * @param options optional,refer to {@link QueryOptions}
 	 * @return a JsonNode array result of document
 	 */
	public async query(collection: string, filter: JSONObject, options?: QueryOptions): Promise<JSONObject[]> {
		try {
            const encryptedFilter = this.encrypt ? this.databaseEncrypt.encryptFilter(filter) : filter;
			const result = await this.httpClient.send<JSONObject[]>(`${DatabaseService.API_DB_ENDPOINT}/query`,
                {
                        "collection": collection,
                        "filter": encryptedFilter,
                        "options": this.normalizeSortQueryOptions(options)
                },
                <HttpResponseParser<JSONObject[]>> {
                    deserialize(content: any): JSONObject[] {
                        return JSON.parse(content)["items"];
                    }
                },
                HttpMethod.POST);
			
			return this.encrypt ? this.databaseEncrypt.encryptDocs(result) : result;
		} catch (e){
			this.handleError(e);
		}
	}

	/**
 	 * Update an existing document in a given collection.
 	 *
 	 * @param collection the collection name
 	 * @param filter A query that matches the document to update.
 	 * @param update The modifications to apply.
 	 * @param options optional, refer to {@link UpdateOptions}
 	 * @return Results returned by {@link UpdateResult} wrapper
 	 */
	public async updateOne(collection: string, filter: JSONObject, update: JSONObject, options?: UpdateOptions): Promise<UpdateResult> {
		return await this.updateInternal(collection, true, filter, update, options);
	}


 	/**
 	 * Update many existing documents in a given collection.
 	 *
 	 * @param collection the collection name
 	 * @param filter A query that matches the document to update.
 	 * @param update The modifications to apply.
 	 * @param options optional, refer to {@link UpdateOptions}
 	 * @return Results returned by {@link UpdateResult} wrapper
 	 */
 	public async updateMany(collection: string, filter: JSONObject, update: JSONObject, options?: UpdateOptions): Promise<UpdateResult> {
		 return await this.updateInternal(collection, false, filter, update, options);
	}


 	/**
 	 * Delete an existing document in a given collection.
 	 *
 	 * @param collection the collection name
 	 * @param filter A query that matches the document to delete.
 	 * @return Delete result
 	 */
	public async deleteOne(collection: string, filter: JSONObject): Promise<void> {
		return await this.deleteInternal(collection, true, filter);
	}


 	/**
 	 * Delete many existing documents in a given collection.
 	 *
 	 * @param collection the collection name
 	 * @param filter A query that matches the document to delete.
 	 * @return Delete result
 	 */
	public async deleteMany(collection: string, filter: JSONObject): Promise<void> {
		return await this.deleteInternal(collection, false, filter);
	}

	private normalizeSortQueryOptions (options: QueryOptions): QueryOptions {
		if (options && options.sort) {
			let sortQuery = [];
			for (var s of options.sort) {
				sortQuery.push([s.key, s.order])
			}
			options.sort = sortQuery;
		}

		return options;
	}

	private async updateInternal(collection: string, isOnlyOne:boolean, filter: JSONObject, update: JSONObject, options?: UpdateOptions): Promise<UpdateResult> {
		try {
            const encryptedFilter = this.encrypt ? this.databaseEncrypt.encryptFilter(filter) : filter;
            const encryptedUpdate = this.encrypt ? this.databaseEncrypt.encryptUpdate(update) : update;
			return await this.httpClient.send<UpdateResult>(`${DatabaseService.API_COLLECTION_ENDPOINT}/${collection}?updateone=${isOnlyOne}`,
                {
                    "filter": encryptedFilter,
                    "update": encryptedUpdate,
                    "options": options
                },
                <HttpResponseParser<UpdateResult>> {
                    deserialize(content: any): UpdateResult {
                        let jsonObj = JSON.parse(content);
                        let result = new UpdateResult();

                        result.setAcknowledged(jsonObj['acknowledged']);
                        result.setMatchedCount(jsonObj['matched_count']);
                        result.setModifiedCount(jsonObj['modified_count']);
                        result.setUpsertedId(jsonObj['upserted_id']);
                        return result;
                    }
                },
                HttpMethod.PATCH);
		} catch (e){
			this.handleError(e);
		}
	}

	private async deleteInternal(collection: string, isOnlyOne:boolean, filter: JSONObject, options?: DeleteOptions): Promise<void> {
		try {
            const encryptedFilter = this.encrypt ? this.databaseEncrypt.encryptFilter(filter) : filter;
			return await this.httpClient.send<void>(`${DatabaseService.API_COLLECTION_ENDPOINT}/${collection}?deleteone=${isOnlyOne}`,
                {
                    "filter": encryptedFilter,
                    "options": options
                },
                HttpClient.NO_RESPONSE,
                HttpMethod.DELETE);
		} catch (e){
			this.handleError(e);
		}
	}

	private handleError(e: Error): unknown {
		if (e instanceof NodeRPCException) {
			throw e;
		}
		throw new NetworkException(e.message, e);
	}

}
