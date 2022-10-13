import { SubscriptionInfo } from "./subscriptioninfo";

/**
 * This contains the details of the backup service.
 */
export class VaultInfo extends SubscriptionInfo {
    private app_count: number;
    private access_count: number;
    private access_amount: number;
    private access_last_time: Date;

    setAppCount(count: number) {
        this.app_count = count;
        return this;
    }

    setAccessCount(count: number) {
        this.access_count = count;
        return this;
    }

    setAccessAmount(amount: number) {
        this.access_amount = amount;
        return this;
    }

    setAccessLastTime(time: Date) {
        this.access_last_time = time;
        return this;
    }

    getAppCount(): number {
        return this.app_count;
    }

    getAccessCount(): number {
        return this.access_count;
    }

    getAccessAmount(): number {
        return this.access_amount;
    }

    getAccessLastTime(): Date {
        return this.access_last_time;
    }
}
