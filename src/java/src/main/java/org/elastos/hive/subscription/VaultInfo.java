package org.elastos.hive.subscription;

import com.google.gson.annotations.SerializedName;

public class VaultInfo {
	@SerializedName("service_did")
	private String serviceDid;
	@SerializedName("storage_quota")
	private int storageQuota;
	@SerializedName("storage_used")
	private int storageUsed;
	@SerializedName("created")
	private long created;
	@SerializedName("updated")
	private long updated;
	@SerializedName("price_plan")
	private String pricePlan;

	public void setServiceDid(String serviceDid) {
		this.serviceDid = serviceDid;
	}

	public void setStorageQuota(int storageQuota) {
		this.storageQuota = storageQuota;
	}

	public void setStorageUsed(int storageUsed) {
		this.storageUsed = storageUsed;
	}

	public void setCreated(long created) {
		this.created = created;
	}

	public void setUpdated(long updated) {
		this.updated = updated;
	}

	public void setPricePlan(String pricePlan) {
		this.pricePlan = pricePlan;
	}

	public String getServiceDid() {
		return serviceDid;
	}

	public int getStorageQuota() {
		return storageQuota;
	}

	public int getStorageUsed() {
		return storageUsed;
	}

	public long getCreated() {
		return created;
	}

	public long getUpdated() {
		return updated;
	}

	public String getPricePlan() {
		return pricePlan;
	}
}
