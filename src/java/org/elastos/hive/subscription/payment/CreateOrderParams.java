package org.elastos.hive.subscription.payment;

import com.google.gson.annotations.SerializedName;

class CreateOrderParams {
	@SerializedName("subscription")
	private String subscription;

	@SerializedName("pricing_name")
	private String pricingName;

	public CreateOrderParams(String subscription, String pricingName) {
		this.subscription = subscription;
		this.pricingName = pricingName;
	}
}
