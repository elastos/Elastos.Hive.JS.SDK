package org.elastos.hive.subscription.payment;

import com.google.gson.annotations.SerializedName;

public class Receipt {
	@SerializedName("receipt_id")
	private String receiptId;
	@SerializedName("order_id")
	private String orderId;
	@SerializedName("transaction_id")
	private String transactionId;
	@SerializedName("pricing_name")
	private String pricingName;
	@SerializedName("paid_did")
	private String paidDid;
	@SerializedName("ela_amount")
	private Float elaAmount;
	private String proof;

	public String getReceiptId() {
		return receiptId;
	}

	public void setReceiptId(String receiptId) {
		this.receiptId = receiptId;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public String getTransactionId() {
		return transactionId;
	}

	public void setTransactionId(String transactionId) {
		this.transactionId = transactionId;
	}

	public String getPricingName() {
		return pricingName;
	}

	public void setPricingName(String pricingName) {
		this.pricingName = pricingName;
	}

	public String getPaidDid() {
		return paidDid;
	}

	public void setPaidDid(String paidDid) {
		this.paidDid = paidDid;
	}

	public Float getElaAmount() {
		return elaAmount;
	}

	public void setElaAmount(Float elaAmount) {
		this.elaAmount = elaAmount;
	}

	public String getProof() {
		return proof;
	}

	public void setProof(String proof) {
		this.proof = proof;
	}
}
