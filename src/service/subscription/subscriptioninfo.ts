/**
 * This contains the details of the backup service.
 */
export class SubscriptionInfo {
    private serviceDid: string;
    private pricePlan: string;
    private startTime: Date;
    private endTime: Date; // nullable
    private storageQuota: number;
    private storageUsed: number;
    private created: Date;
    private updated: Date;

    setServiceDid(serviceDid: string): SubscriptionInfo {
        this.serviceDid = serviceDid;
        return this;
    }

    setStorageQuota(storageQuota: number): SubscriptionInfo {
        this.storageQuota = storageQuota;
        return this;
    }

    setStorageUsed(storageUsed: number): SubscriptionInfo {
        this.storageUsed = storageUsed;
        return this;
    }

    setCreated(created: Date): SubscriptionInfo {
        this.created = created;
        return this;
    }

    setUpdated(updated: Date): SubscriptionInfo {
        this.updated = updated;
        return this;
    }

    setPricePlan(pricePlan: string): SubscriptionInfo {
        this.pricePlan = pricePlan;
        return this;
    }

    setStartTime(start: Date): SubscriptionInfo {
        this.startTime = start;
        return this;
    }

    setEndTime(end: Date): SubscriptionInfo {
        this.endTime = end;
        return this;
    }

    getServiceDid(): string {
        return this.serviceDid;
    }

    getStorageQuota(): number {
        return this.storageQuota;
    }

    getStorageUsed(): number {
        return this.storageUsed;
    }

    getCreated(): Date {
        return this.created;
    }

    getUpdated(): Date {
        return this.updated;
    }

    getPricePlan(): string {
        return this.pricePlan;
    }

    getStartTime(): Date {
        return this.startTime;
    }

    getEndTime(): Date {
        return this.endTime;
    }
}
    