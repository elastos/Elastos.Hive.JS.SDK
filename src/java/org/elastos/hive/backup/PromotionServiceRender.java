package org.elastos.hive.backup;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;

import org.elastos.hive.ServiceContext;
import org.elastos.hive.backup.promotion.PromotionController;
import org.elastos.hive.exception.HiveException;
import org.elastos.hive.service.PromotionService;

class PromotionServiceRender implements PromotionService {
	private PromotionController controller;

	PromotionServiceRender(ServiceContext ServiceContext) {
		controller = new PromotionController(ServiceContext);
	}

	@Override
	public CompletableFuture<Void> promote() {
		return CompletableFuture.runAsync(() -> {
			try {
				controller.promote();
			} catch (HiveException | RuntimeException e) {
				throw new CompletionException(e);
			}
		});
	}
}
