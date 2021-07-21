package org.elastos.hive.backup;

import org.elastos.hive.ServiceEndpoint;
import org.elastos.hive.service.PromotionService;

public class ServiceBuilder {
	private ServiceEndpoint backup;

	public ServiceBuilder(ServiceEndpoint backup) {
		this.backup = backup;
	}

	public PromotionService createPromotionService() {
		return new PromotionServiceRender(backup);
	}
}
