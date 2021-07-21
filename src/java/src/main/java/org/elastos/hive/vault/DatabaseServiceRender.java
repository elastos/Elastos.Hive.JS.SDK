package org.elastos.hive.vault;

import com.fasterxml.jackson.databind.JsonNode;

import org.elastos.hive.ServiceEndpoint;
import org.elastos.hive.service.DatabaseService;
import org.elastos.hive.vault.database.*;
import org.elastos.hive.exception.HiveException;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;

class DatabaseServiceRender implements DatabaseService {
	DatabaseController controller;

	public DatabaseServiceRender(ServiceEndpoint serviceEndpoint) {
		controller = new DatabaseController(serviceEndpoint);
	}

	@Override
	public CompletableFuture<Void> createCollection(String name) {
		return CompletableFuture.runAsync(() -> {
			try {
				controller.createCollection(name);
			} catch (HiveException | RuntimeException e) {
				throw new CompletionException(e);
			}
		});
	}

	@Override
	public CompletableFuture<Void> deleteCollection(String name) {
		return CompletableFuture.runAsync(() -> {
			try {
				controller.deleteCollection(name);
			} catch (HiveException | RuntimeException e) {
				throw new CompletionException(e);
			}
		});
	}

	@Override
	public CompletableFuture<InsertResult> insertOne(String collection, JsonNode doc, InsertOptions options) {
		return CompletableFuture.supplyAsync(() -> {
			try {
				return controller.insertOne(collection, doc, options);
			} catch (HiveException | RuntimeException e) {
				throw new CompletionException(e);
			}
		});
	}

	@Override
	public CompletableFuture<InsertResult> insertMany(String collection, List<JsonNode> docs, InsertOptions options) {
		return CompletableFuture.supplyAsync(() -> {
			try {
				return controller.insertMany(collection, docs, options);
			} catch (HiveException | RuntimeException e) {
				throw new CompletionException(e);
			}
		});
	}

	@Override
	public CompletableFuture<Long> countDocuments(String collection, JsonNode query, CountOptions options) {
		return CompletableFuture.supplyAsync(() -> {
			try {
				return controller.countDocuments(collection, query, options);
			} catch (HiveException | RuntimeException e) {
				throw new CompletionException(e);
			}
		});
	}

	@Override
	public CompletableFuture<JsonNode> findOne(String collection, JsonNode query, FindOptions options) {
		return CompletableFuture.supplyAsync(() -> {
			try {
				return controller.findOne(collection, query, options);
			} catch (HiveException | RuntimeException e) {
				throw new CompletionException(e);
			}
		});
	}




	@Override
	public CompletableFuture<List<JsonNode>> findMany(String collection, JsonNode query, FindOptions options) {
		return CompletableFuture.supplyAsync(() -> {
			try {
				return controller.find(collection, query, options);
			} catch (HiveException | RuntimeException e) {
				throw new CompletionException(e);
			}
		});
	}

	@Override
	public CompletableFuture<List<JsonNode>> query(String collection, JsonNode query, QueryOptions options) {
		return CompletableFuture.supplyAsync(() -> {
			try {
				return controller.query(collection, query, options);
			} catch (HiveException | RuntimeException e) {
				throw new CompletionException(e);
			}
		});
	}

	@Override
	public CompletableFuture<UpdateResult> updateOne(String collection, JsonNode filter, JsonNode update, UpdateOptions options) {
		return CompletableFuture.supplyAsync(() -> {
			try {
				return controller.updateOne(collection, filter, update, options);
			} catch (HiveException | RuntimeException e) {
				throw new CompletionException(e);
			}
		});
	}

	@Override
	public CompletableFuture<UpdateResult> updateMany(String collection, JsonNode filter, JsonNode update, UpdateOptions options) {
		return CompletableFuture.supplyAsync(() -> {
			try {
				return controller.updateMany(collection, filter, update, options);
			} catch (HiveException | RuntimeException e) {
				throw new CompletionException(e);
			}
		});
	}

	@Override
	public CompletableFuture<Void> deleteOne(String collection, JsonNode filter) {
		return CompletableFuture.runAsync(() -> {
			try {
				controller.deleteOne(collection, filter, null);
			} catch (HiveException | RuntimeException e) {
				throw new CompletionException(e);
			}
		});
	}

	@Override
	public CompletableFuture<Void> deleteMany(String collection, JsonNode filter) {
		return CompletableFuture.runAsync(() -> {
			try {
				controller.deleteMany(collection, filter, null);
			} catch (HiveException | RuntimeException e) {
				throw new CompletionException(e);
			}
		});
	}
}
