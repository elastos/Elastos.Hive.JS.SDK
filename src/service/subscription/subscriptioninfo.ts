/**
 * This contains the details of the backup service.
 */
 export class SubscriptionInfo {
    //	@SerializedName("service_did")
        private serviceDid: string;
    //	@SerializedName("storage_quota")
        private storageQuota: number;
    //	@SerializedName("storage_used")
        private storageUsed: number;
    //	@SerializedName("created")
        private created: Date;
    //	@SerializedName("updated")
        private updated: Date;
    //	@SerializedName("price_plan")
        private pricePlan: string;
    
        public setServiceDid(serviceDid: string): SubscriptionInfo {
            this.serviceDid = serviceDid;
            return this;
        }
    
        public setStorageQuota(storageQuota: number): SubscriptionInfo {
            this.storageQuota = storageQuota;
            return this;
        }
    
        public setStorageUsed(storageUsed: number): SubscriptionInfo {
            this.storageUsed = storageUsed;
            return this;
        }
    
        public setCreated(created: Date): SubscriptionInfo {
            this.created = created;
            return this;
        }
    
        public setUpdated(updated: Date): SubscriptionInfo {
            this.updated = updated;
            return this;
        }
    
        public setPricePlan(pricePlan: string): SubscriptionInfo {
            this.pricePlan = pricePlan;
            return this;
        }
    
        public getServiceDid(): string {
            return this.serviceDid;
        }
    
        public getStorageQuota(): number {
            return this.storageQuota;
        }
    
        public getStorageUsed(): number {
            return this.storageUsed;
        }
    
        public getCreated(): Date {
            return this.created;
        }
    
        public getUpdated(): Date {
            return this.updated;
        }
    
        public getPricePlan(): string {
            return this.pricePlan;
        }
    }
    