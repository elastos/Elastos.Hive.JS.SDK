package org.elastos.hive.subscription.payment;

import com.google.gson.annotations.SerializedName;

import java.util.List;

import org.elastos.hive.subscription.PricingPlan;

public class Order {
	@SerializedName("order_id")
	private String orderId;
	private String subscription;
	@SerializedName("pricing_name")
	private String pricingName;
	@SerializedName("ela_amount")
	private Float elaAmount;
	@SerializedName("ela_address")
	private String elaAddress;
	private String proof;
	@SerializedName("create_time")
	private Integer createTime;

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public String getSubscription() {
		return subscription;
	}

	public void setSubscription(String subscription) {
		this.subscription = subscription;
	}

	public String getPricingName() {
		return pricingName;
	}

	public void setPricingName(String pricingName) {
		this.pricingName = pricingName;
	}

	public Float getElaAmount() {
		return elaAmount;
	}

	public void setElaAmount(Float elaAmount) {
		this.elaAmount = elaAmount;
	}

	public String getElaAddress() {
		return elaAddress;
	}

	public void setElaAddress(String elaAddress) {
		this.elaAddress = elaAddress;
	}

	public String getProof() {
		return proof;
	}

	public void setProof(String proof) {
		this.proof = proof;
	}

	public Integer getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Integer createTime) {
		this.createTime = createTime;
	}
}
