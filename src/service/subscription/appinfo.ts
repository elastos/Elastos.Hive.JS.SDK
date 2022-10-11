/**
 * This contains the details of the vault application.
 */
export class AppInfo {
    private name: string;
    private developer_did: string;
    private icon_url: string;
    // skip redirect_url
    private user_did: string;
    private app_did: string;
    private used_storage_size: number;
    private access_count: number;
    private access_amount: number;
    private access_last_time: Date;

    getName(): string {
        return this.name;
    }

    getDeveloperDid(): string {
        return this.developer_did;
    }

    getIconUrl(): string {
        return this.icon_url;
    }

    getUserDid(): string {
        return this.user_did;
    }

    getAppDid(): string {
        return this.app_did;
    }

    getUsedStorageSize(): number {
        return this.used_storage_size;
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
