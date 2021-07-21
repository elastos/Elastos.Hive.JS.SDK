package org.elastos.hive.subscription;

public class PricingPlan {
	private float amount;
	private String currency;
	private int maxStorage;
	private String name;
	private int serviceDays;

	public PricingPlan setAmount(float amount) {
		this.amount = amount;
		return this;
	}

	public PricingPlan setCurrency(String currency) {
		this.currency = currency;
		return this;
	}

	public PricingPlan setMaxStorage(int maxStorage) {
		this.maxStorage = maxStorage;
		return this;
	}

	public PricingPlan setName(String name) {
		this.name = name;
		return this;
	}

	public PricingPlan setServiceDays(int serviceDays) {
		this.serviceDays = serviceDays;
		return this;
	}

	public float getAmount() {
		return amount;
	}

	public String getCurrency() {
		return currency;
	}

	public int getMaxStorage() {
		return maxStorage;
	}

	public String getName() {
		return name;
	}

	public int getServiceDays() {
		return serviceDays;
	}
}
