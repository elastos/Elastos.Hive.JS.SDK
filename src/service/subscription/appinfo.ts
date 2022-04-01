/**
 * This contains the details of the vault application.
 */
export class AppInfo {
    private user_did: string;
    private app_did: string;
    private database_name: string;
    private file_use_storage: number;
    private db_use_storage: number;

    public getUserDid() {
        return this.user_did;
    }

    public setUserDid(userDid) {
        this.user_did = userDid;
    }

    public getAppDid() {
        return this.app_did;
    }

    public setAppDid(appDid) {
        this.app_did = appDid;
    }

    public getDatabaseName() {
        return this.database_name;
    }

    public setDatabaseName(databaseName) {
        this.database_name = databaseName;
    }

    public getFileUseStorage() {
        return this.file_use_storage;
    }

    public setFileUseStorage(fileUseStorage) {
        this.file_use_storage = fileUseStorage;
    }

    public getDatabaseUseStorage() {
        return this.db_use_storage;
    }

    public setDatabaseUseStorage(databaseUseStorage) {
        this.db_use_storage = databaseUseStorage;
    }
}
