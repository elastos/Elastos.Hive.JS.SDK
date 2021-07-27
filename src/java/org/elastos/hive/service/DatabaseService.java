package org.elastos.hive.service;

import com.fasterxml.jackson.databind.JsonNode;

import org.elastos.hive.vault.database.*;

import java.util.List;
import java.util.concurrent.CompletableFuture;

/**
 * TODO: refine APIs like *One, *Many, find*.
 */
public interface DatabaseService {
	/**
	 * Lets the vault owner create a collection on database.
	 * @param name the collection name
	 * @return fail(false) or success(true)
	 */
	CompletableFuture<Void> createCollection(String name);


	/**
	 * Lets the vault owner delete a collection on database according to collection name.
	 * @param name the collection name
	 * @return fail(false) or success(true)
	 */
	CompletableFuture<Void> deleteCollection(String name);


	/**
	 * Insert a new document in a given collection
	 * @param collection the collection name
	 * @param doc The document to insert. Must be a mutable mapping type. If
	 *			the document does not have an _id field one will be added automatically
	 * @param options bypass_document_validation: (optional) If True, allows
	 *				the write to opt-out of document level validation. Default is False.
	 * @return Results returned by {@link InsertResult} wrapper
	 */
	CompletableFuture<InsertResult> insertOne(String collection, JsonNode doc, InsertOptions options);


	/**
	 * Insert many new documents in a given collection
	 * @param collection the collection name
	 * @param docs The document to insert. Must be a mutable mapping type. If the
	 *			 document does not have an _id field one will be added automatically.
	 * @param options ordered (optional): If True (the default) documents will be inserted on the server serially,
	 *				in the order provided. If an error occurs all remaining inserts are aborted. If False, documents
	 *				will be inserted on the server in arbitrary order, possibly in parallel, and all document inserts will be attempted.
	 *				bypass_document_validation: (optional) If True, allows the write to opt-out of document level validation. Default is False.
	 * @return Results returned by {@link InsertResult} wrapper
	 */
	CompletableFuture<InsertResult> insertMany(String collection, List<JsonNode> docs, InsertOptions options);


	/**
	 * Count documents
	 * @param collection the collection name
	 * @param query The document of filter
	 * @param options
	 *			  skip (int): The number of matching documents to skip before returning results.
	 *			  limit (int): The maximum number of documents to count. Must be a positive integer. If not provided, no limit is imposed.
	 *			  maxTimeMS (int): The maximum amount of time to allow this operation to run, in milliseconds.
	 * @return count size
	 */
	CompletableFuture<Long> countDocuments(String collection, JsonNode query, CountOptions options);


	/**
	 * Find a specific document
	 * @param collection the collection name
	 * @param query optional, a JSON object specifying elements which must be present for a document to be included in the result set
	 * @param options optional,refer to {@link FindOptions}
	 * @return a JSON object document result
	 */
	CompletableFuture<JsonNode> findOne(String collection, JsonNode query, FindOptions options);

	/**
	 * Find many documents
	 * @param collection the collection name
	 * @param query optional, a JSON object specifying elements which must be present for a document to be included in the result set
	 * @param options optional,refer to {@link FindOptions}
	 * @return a JsonNode array result of document
	 */
	CompletableFuture<List<JsonNode>> findMany(String collection, JsonNode query, FindOptions options);

	/**
	 * Find many documents by many options.
	 * @param collection the collection name
	 * @param query optional, a JSON object specifying elements which must be present for a document to be included in the result set
	 * @param options optional,refer to {@link QueryOptions}
	 * @return a JsonNode array result of document
	 */
	CompletableFuture<List<JsonNode>> query(String collection, JsonNode query, QueryOptions options);

	/**
	 * Update an existing document in a given collection
	 * @param collection the collection name
	 * @param filter A query that matches the document to update.
	 * @param update The modifications to apply.
	 * @param options optional, refer to {@link UpdateOptions}
	 * @return Results returned by {@link UpdateResult} wrapper
	 */
	CompletableFuture<UpdateResult> updateOne(String collection, JsonNode filter, JsonNode update, UpdateOptions options);


	/**
	 * Update many existing documents in a given collection
	 * @param collection the collection name
	 * @param filter A query that matches the document to update.
	 * @param update The modifications to apply.
	 * @param options optional, refer to {@link UpdateOptions}
	 * @return Results returned by {@link UpdateResult} wrapper
	 */
	CompletableFuture<UpdateResult> updateMany(String collection, JsonNode filter, JsonNode update, UpdateOptions options);


	/**
	 * Delete an existing document in a given collection
	 * @param collection the collection name
	 * @param filter A query that matches the document to delete.
	 * @return Delete result
	 */
	CompletableFuture<Void> deleteOne(String collection, JsonNode filter);


	/**
	 * Delete many existing documents in a given collection
	 * @param collection the collection name
	 * @param filter A query that matches the document to delete.
	 * @return Delete result
	 */
	CompletableFuture<Void> deleteMany(String collection, JsonNode filter);
}
