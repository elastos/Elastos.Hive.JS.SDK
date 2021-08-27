package org.elastos.hive.backup;

import org.elastos.hive.ServiceContext;
import org.elastos.hive.service.PromotionService;

public class ServiceBuilder {
	private ServiceContext backup;

	public ServiceBuilder(ServiceContext backup) {
		this.backup = backup;
	}

	public PromotionService createPromotionService() {
		return new PromotionServiceRender(backup);
	}
}
