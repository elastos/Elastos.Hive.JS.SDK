import { AlreadyExistsException, HttpException, InvalidParameterException, IOException, NetworkException, NodeRPCException, NotFoundException, ServerUnknownException, UnauthorizedException, VaultForbiddenException } from "../../exceptions";
import { HttpClient } from "../../http/httpclient";
import { HttpMethod } from "../../http/httpmethod";
import { ServiceContext } from "../../http/servicecontext";
import { Logger } from '../../logger';
import { RestService } from "../restservice";
import { CreateCollectionResult } from "./createcollectionresult";
import { HttpResponseParser } from '../../http/httpresponseparser';
import { InsertOptions } from "./insertoptions";
import { InsertResult } from "./insertresult";
import { InsertParams } from "./insertparams";
import { FindOptions } from "./findoptions";
import { JSONObject } from "@elastosfoundation/did-js-sdk/";
import { FindResult } from "./findresult";


export class DatabaseService extends RestService {
	private static LOG = new Logger("DatabaseService");

	private static API_COLLECTION_ENDPOINT = "/api/v2/vault/db/collection";
	private static API_COLLECTIONS_ENDPOINT = "/api/v2/vault/db/collections";
	private static API_DB_ENDPOINT = "/api/v2/vault/db";

    constructor(serviceContext: ServiceContext, httpClient: HttpClient) {
		super(serviceContext, httpClient);
	}


	/**
	 * Lets the vault owner create a collection on database.
	 *
	 * @param name the collection name
	 * @return fail(false) or success(true)
	 */
	async createCollection(collectionName: string) : Promise<void>{
		try {
			let result: CreateCollectionResult = 
			await this.httpClient.send<CreateCollectionResult>(`${DatabaseService.API_COLLECTIONS_ENDPOINT}/${collectionName}`, HttpClient.NO_PAYLOAD, <HttpResponseParser<CreateCollectionResult>> {
				deserialize(content: any): CreateCollectionResult {
					return JSON.parse(content) as CreateCollectionResult;
				}}, HttpMethod.PUT);

			if (collectionName !== result.name)
				throw new ServerUnknownException("Different collection created, impossible to happen");
		}
		catch (e){
			if (e instanceof HttpException) {
				switch (e.getHttpCode()) {
					case NodeRPCException.UNAUTHORIZED:
						throw new UnauthorizedException(e.message, e);
					case NodeRPCException.FORBIDDEN:
						throw new VaultForbiddenException(e.message, e);
					case NodeRPCException.ALREADY_EXISTS:
						throw new AlreadyExistsException(e.message, e);
					default:
						throw new ServerUnknownException(e.message, e);
				}
			}
			if (e instanceof IOException){
				throw new NetworkException(e.message, e);
			}	
		}
	}
		
	


	/**
	 * Lets the vault owner delete a collection on database according to collection name.
	 *
	 * @param name the collection name
	 * @return fail(false) or success(true)
	 */
	async deleteCollection(collectionName: string) : Promise<void>{
		try {
			await this.httpClient.send(`${DatabaseService.API_DB_ENDPOINT}/${collectionName}`, HttpClient.NO_PAYLOAD, HttpClient.NO_RESPONSE, HttpMethod.DELETE);
		} catch (e){
			if (e instanceof NodeRPCException) {

				// TODO: waiting for the codes
				switch (e.getCode()) {
					case NodeRPCException.UNAUTHORIZED:
						throw new UnauthorizedException(e.message, e);
					case NodeRPCException.FORBIDDEN:
						throw new VaultForbiddenException(e.message, e);
					default:
						throw new ServerUnknownException(e.message, e);
				}
			}
			if (e instanceof IOException){
				throw new NetworkException(e.message, e);
			}	
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
	async insertOne( collection: string, doc: any, options: InsertOptions) : Promise<InsertResult>{
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
	async insertMany(collection: string, docs: any[], options: InsertOptions) : Promise<InsertResult>{
		try {
			let result = await this.httpClient.send<InsertResult>(`${DatabaseService.API_COLLECTION_ENDPOINT}/${collection}`, new InsertParams(docs, options), <HttpResponseParser<InsertResult>> {
				deserialize(content: any): InsertResult {
					return JSON.parse(content) as InsertResult;
				}}, HttpMethod.POST);
			
			return result;
		} catch (e){
			if (e instanceof HttpException) {
				// TODO: waiting for the codes
				switch (e.getHttpCode()) {
					case NodeRPCException.UNAUTHORIZED:
						throw new UnauthorizedException(e.message, e);
					case NodeRPCException.FORBIDDEN:
						throw new VaultForbiddenException(e.message, e);
					case NodeRPCException.BAD_REQUEST:
						throw new InvalidParameterException(e.message, e);
					case NodeRPCException.NOT_FOUND:
						throw new NotFoundException(e.message, e);
					default:
						throw new ServerUnknownException(e.message, e);
				}
			}
			if (e instanceof IOException){
				throw new NetworkException(e.message, e);
			}	
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
	async findOne(collection: string, filter: JSONObject, options: FindOptions): Promise<JSONObject>{
		let docs = await this.find(collection, filter, options);
		return docs !== null && !(docs.length === 0) ? docs[0] : null;
	}

	/**
	 * Find many documents.
	 *
	 * @param collection the collection name
	 * @param query optional, a JSON object specifying elements which must be present for a document to be included in the result set
	 * @param options optional,refer to {@link FindOptions}
	 * @return a JsonNode array result of document
	 */

	async find(collectionName: string, filter: JSONObject, options: FindOptions) : Promise<JSONObject[]> {
		try {
			let filterStr = filter === null ? "" : filter.toString();
			let skip = options !== null ? options.getSkip().toString() : "";
			let limit = options !== null ? options.getLimit().toString() : "";
			let ret = await this.httpClient.send<FindResult>(`${DatabaseService.API_DB_ENDPOINT}/${collectionName}?skip=${skip}&limit=${limit}&filter=${filter}`, 
				HttpClient.NO_PAYLOAD, <HttpResponseParser<FindResult>> {
					deserialize(content: any): FindResult {
						return JSON.parse(content) as FindResult;
					}}, HttpMethod.GET);

			return ret.items;
		} catch (e) {
			if (e instanceof HttpException) {
				switch (e.getHttpCode()) {
					case NodeRPCException.UNAUTHORIZED:
						throw new UnauthorizedException(e.message, e);
					case NodeRPCException.FORBIDDEN:
						throw new VaultForbiddenException(e.message, e);
					case NodeRPCException.BAD_REQUEST:
						throw new InvalidParameterException(e.message, e);
					case NodeRPCException.NOT_FOUND:
						throw new NotFoundException(e.message, e);
					default:
						throw new ServerUnknownException(e.message, e);
				}
			}
			if (e instanceof IOException) {
				throw new NetworkException(e.message, e);
			}
		}
	}

}



// package org.elastos.hive.service;

// import com.fasterxml.jackson.databind.JsonNode;

// import org.elastos.hive.vault.database.*;

// import java.util.List;
// import java.util.concurrent.CompletableFuture;

// /**
//  * Mongo database service.
//  *
//  * <p>TODO: refine APIs like *One, *Many, find*.</p>
//  */
// public interface DatabaseService {
// 	/**
// 	 * Lets the vault owner create a collection on database.
// 	 *
// 	 * @param name the collection name
// 	 * @return fail(false) or success(true)
// 	 */
// 	CompletableFuture<Void> createCollection(String name);


// 	/**
// 	 * Lets the vault owner delete a collection on database according to collection name.
// 	 *
// 	 * @param name the collection name
// 	 * @return fail(false) or success(true)
// 	 */
// 	CompletableFuture<Void> deleteCollection(String name);


// 	/**
// 	 * Insert a new document in a given collection.
// 	 *
// 	 * @param collection the collection name
// 	 * @param doc The document to insert. Must be a mutable mapping type. If
// 	 *			the document does not have an _id field one will be added automatically
// 	 * @param options bypass_document_validation: (optional) If True, allows
// 	 *				the write to opt-out of document level validation. Default is False.
// 	 * @return Results returned by {@link InsertResult} wrapper
// 	 */
// 	CompletableFuture<InsertResult> insertOne(String collection, JsonNode doc, InsertOptions options);


// 	/**
// 	 * Insert many new documents in a given collection.
// 	 *
// 	 * @param collection the collection name
// 	 * @param docs The document to insert. Must be a mutable mapping type. If the
// 	 *			 document does not have an _id field one will be added automatically.
// 	 * @param options ordered (optional): If True (the default) documents will be inserted on the server serially,
// 	 *				in the order provided. If an error occurs all remaining inserts are aborted. If False, documents
// 	 *				will be inserted on the server in arbitrary order, possibly in parallel, and all document inserts will be attempted.
// 	 *				bypass_document_validation: (optional) If True, allows the write to opt-out of document level validation. Default is False.
// 	 * @return Results returned by {@link InsertResult} wrapper
// 	 */
// 	CompletableFuture<InsertResult> insertMany(String collection, List<JsonNode> docs, InsertOptions options);


// 	/**
// 	 * Count documents.
// 	 *
// 	 * @param collection the collection name
// 	 * @param query The document of filter
// 	 * @param options
// 	 *			  skip (int): The number of matching documents to skip before returning results.
// 	 *			  limit (int): The maximum number of documents to count. Must be a positive integer. If not provided, no limit is imposed.
// 	 *			  maxTimeMS (int): The maximum amount of time to allow this operation to run, in milliseconds.
// 	 * @return count size
// 	 */
// 	CompletableFuture<Long> countDocuments(String collection, JsonNode query, CountOptions options);


// 	/**
// 	 * Find a specific document.
// 	 *
// 	 * @param collection the collection name
// 	 * @param query optional, a JSON object specifying elements which must be present for a document to be included in the result set
// 	 * @param options optional,refer to {@link FindOptions}
// 	 * @return a JSON object document result
// 	 */
// 	CompletableFuture<JsonNode> findOne(String collection, JsonNode query, FindOptions options);

// 	/**
// 	 * Find many documents.
// 	 *
// 	 * @param collection the collection name
// 	 * @param query optional, a JSON object specifying elements which must be present for a document to be included in the result set
// 	 * @param options optional,refer to {@link FindOptions}
// 	 * @return a JsonNode array result of document
// 	 */
// 	CompletableFuture<List<JsonNode>> findMany(String collection, JsonNode query, FindOptions options);

// 	/**
// 	 * Find many documents by many options.
// 	 *
// 	 * @param collection the collection name
// 	 * @param query optional, a JSON object specifying elements which must be present for a document to be included in the result set
// 	 * @param options optional,refer to {@link QueryOptions}
// 	 * @return a JsonNode array result of document
// 	 */
// 	CompletableFuture<List<JsonNode>> query(String collection, JsonNode query, QueryOptions options);

// 	/**
// 	 * Update an existing document in a given collection.
// 	 *
// 	 * @param collection the collection name
// 	 * @param filter A query that matches the document to update.
// 	 * @param update The modifications to apply.
// 	 * @param options optional, refer to {@link UpdateOptions}
// 	 * @return Results returned by {@link UpdateResult} wrapper
// 	 */
// 	CompletableFuture<UpdateResult> updateOne(String collection, JsonNode filter, JsonNode update, UpdateOptions options);


// 	/**
// 	 * Update many existing documents in a given collection.
// 	 *
// 	 * @param collection the collection name
// 	 * @param filter A query that matches the document to update.
// 	 * @param update The modifications to apply.
// 	 * @param options optional, refer to {@link UpdateOptions}
// 	 * @return Results returned by {@link UpdateResult} wrapper
// 	 */
// 	CompletableFuture<UpdateResult> updateMany(String collection, JsonNode filter, JsonNode update, UpdateOptions options);


// 	/**
// 	 * Delete an existing document in a given collection.
// 	 *
// 	 * @param collection the collection name
// 	 * @param filter A query that matches the document to delete.
// 	 * @return Delete result
// 	 */
// 	CompletableFuture<Void> deleteOne(String collection, JsonNode filter);


// 	/**
// 	 * Delete many existing documents in a given collection.
// 	 *
// 	 * @param collection the collection name
// 	 * @param filter A query that matches the document to delete.
// 	 * @return Delete result
// 	 */
// 	CompletableFuture<Void> deleteMany(String collection, JsonNode filter);
// }