package org.elastos.hive.service;

import java.util.concurrent.CompletableFuture;

public interface PromotionService {
	/**
	 * Promote the backup node to vault node by backup data.
	 *
	 * @return Void
	 */
	CompletableFuture<Void> promote();
}
