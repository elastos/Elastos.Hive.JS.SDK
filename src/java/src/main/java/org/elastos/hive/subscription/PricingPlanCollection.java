package org.elastos.hive.subscription;

import com.google.gson.annotations.SerializedName;

import java.util.List;

class PricingPlanCollection {
	@SerializedName("backupPlans")
	private List<PricingPlan> backupPlans;

	@SerializedName("pricingPlans")
	private List<PricingPlan> pricingPlans;

	@SerializedName("version")
	String version;

	public List<PricingPlan> getBackupPlans() {
		return backupPlans;
	}

	public List<PricingPlan> getPricingPlanCollection() {
		return pricingPlans;
	}

	public String getVersion() {
		return version;
	}
}
