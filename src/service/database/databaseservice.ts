import {  NetworkException,	NodeRPCException, ServerUnknownException, } from "../../exceptions";
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

export class DatabaseService extends RestService {
	private static LOG = new Logger("DatabaseService");

	private static API_COLLECTION_ENDPOINT = "/api/v2/vault/db/collection";
	private static API_COLLECTIONS_ENDPOINT = "/api/v2/vault/db/collections";
	private static API_DB_ENDPOINT = "/api/v2/vault/db";

    constructor(serviceContext: ServiceEndpoint, httpClient: HttpClient) {
		super(serviceContext, httpClient);
	}

	/**
	 * Lets the vault owner create a collection on database.
	 *
	 * @param name the collection name
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
	public async insertOne( collection: string, doc: any, options?: InsertOptions) : Promise<InsertResult>{
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
			let result = await this.httpClient.send<InsertResult>(`${DatabaseService.API_COLLECTION_ENDPOINT}/${collection}`,
			{
				"document": docs,
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
			
			return result;
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
			let result = await this.httpClient.send<number>(`${DatabaseService.API_COLLECTION_ENDPOINT}/${collection}?op=count`,
			{
				"filter": filter,
				"options": options
			},
			<HttpResponseParser<number>> {
				deserialize(content: any): number {
					return JSON.parse(content)["count"];
				}
			}, HttpMethod.POST);
			
			return result;
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
		let docs = await this.findMany(collection, filter, options);

		DatabaseService.LOG.debug(JSON.stringify(docs));
		return docs !== undefined && !(docs.length === 0) ? docs[0] : null;
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
			let filterStr = filter === null ? "" : encodeURIComponent(JSON.stringify(filter));
			DatabaseService.LOG.debug("FILTER_STR: " + filterStr);
			let skip = options !== undefined ? options.skip.toString() : 0;
			let limit = options !== undefined ? options.limit.toString() : 0;
			let ret = await this.httpClient.send<JSONObject[]>(`${DatabaseService.API_DB_ENDPOINT}/${collectionName}`, 
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

			return ret;
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
			let result = await this.httpClient.send<JSONObject[]>(`${DatabaseService.API_DB_ENDPOINT}/query`,
			{
					"collection": collection,
					"filter": filter,
					"options": this.normalizeSortQueryOptions(options)
			},
			<HttpResponseParser<JSONObject[]>> {
				deserialize(content: any): JSONObject[] {
					return JSON.parse(content)["items"];
				}
			},
			HttpMethod.POST);
			
			return result;
		} catch (e){
			this.handleError(e);
		}
	}

	/*
	public async query(collection: string, filter: JSONObject, options: QueryOptions): Promise<JSONObject[]> {
		try {
			let textPayload = "{\"collection\":\"" + collection + "\",\"filter\":" + JSON.stringify(filter);
			if (options) {
				if (options.sort) {
					let textOptions = "";
					textOptions += (options.skip !== null ? "\"skip\":" + options.skip : "");

					textOptions += (textOptions ? ",":"");
					textOptions += (options.limit !== null ? "\"limit\":" + options.limit : "");

					textOptions += (textOptions ? ",":"");
					textOptions += (options.batch_size !== null ? "\"batch_size\":" + options.batch_size : "");

					textOptions += (textOptions ? ",":"");
					textOptions += (options.allow_partial_results !== null ? "\"allow_partial_results\":" + options.allow_partial_results : "");

					textOptions += (textOptions ? ",":"");
					textOptions += (options.return_key !== null ? "\"return_key\":" + options.return_key : "");

					textOptions += (textOptions ? ",":"");
					textOptions += (options.show_record_id !== null ? "\"show_record_id\":" + options.show_record_id : "");

					textOptions += (textOptions ? ",":"");
					textOptions += (options.projection !== null ? "\"projection\":" + JSON.stringify(options.projection) : "");

					let sortOptions = "";
					for (let field of options.sort) {
						sortOptions += (sortOptions ? ",":"");
						//sortOptions += "(\"" + field.key + "\"," + field.order + ")"
						sortOptions += "{\"" + field.key + "\":" + field.order + "}"
					}
					if (sortOptions) {
						textOptions += (textOptions ? ",":"");
						textOptions += ("\"sort\":[" + sortOptions + "]");
					}
					if (textOptions) {
						textPayload += (",\"options\":{" + textOptions + "}");
					}
				} else {
					textPayload += (",\"options\":" + JSON.stringify(options));
				}
			}
			textPayload += "}";
			let result = await this.httpClient.send<JSONObject[]>(`${DatabaseService.API_DB_ENDPOINT}/query`, textPayload,
			<HttpResponseParser<JSONObject[]>> {
				deserialize(content: any): JSONObject[] {
					return JSON.parse(content)["items"];
				}
			}, HttpMethod.POST);
			
			return result;
		} catch (e){
			this.handleError(e);
		}
	}
	*/

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
			let result = await this.httpClient.send<UpdateResult>(`${DatabaseService.API_COLLECTION_ENDPOINT}/${collection}?updateone=${isOnlyOne}`,
			{
				"filter": filter,
				"update": update,
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
			
			return result;
		} catch (e){
			this.handleError(e);
		}
	}

	private async deleteInternal(collection: string, isOnlyOne:boolean, filter: JSONObject, options?: DeleteOptions): Promise<void> {
		try {
			return await this.httpClient.send<void>(`${DatabaseService.API_COLLECTION_ENDPOINT}/${collection}?deleteone=${isOnlyOne}`,
			{
				"filter": filter,
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