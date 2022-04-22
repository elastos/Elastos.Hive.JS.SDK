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

    public getName(): string {
        return this.name;
    }

    public getDeveloperDid(): string {
        return this.developer_did;
    }

    public getIconUrl(): string {
        return this.icon_url;
    }

    public getUserDid(): string {
        return this.user_did;
    }

    public getAppDid(): string {
        return this.app_did;
    }

    public getUsedStorageSize(): number {
        return this.used_storage_size;
    }

}
