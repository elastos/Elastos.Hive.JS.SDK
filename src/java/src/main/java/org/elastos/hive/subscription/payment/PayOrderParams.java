package org.elastos.hive.subscription.payment;

import com.google.gson.annotations.SerializedName;

class PayOrderParams {
	@SerializedName("transaction_id")
	private String transactionId;

	public PayOrderParams(String transactionId) {
		this.transactionId = transactionId;
	}
}
