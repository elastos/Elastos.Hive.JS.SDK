/**
 * The data storage for the access token, the backup credential, etc. which comes from the hive node.
 */
export interface DataStorage {
	loadBackupCredential(serviceDid: string): Promise<string>;
	loadAccessToken(serviceDid: string): Promise<string>;
	loadAccessTokenByAddress(providerAddress: string): Promise<string>;

	storeBackupCredential(serviceDid: string, credential: string): Promise<void>;
	storeAccessToken(serviceDid: string, accessToken: string): Promise<void>;
	storeAccessTokenByAddress(providerAddress: string, accessToken: string): Promise<void>;

	clearBackupCredential(serviceDid: string): Promise<void>;
	clearAccessToken(serviceDid: string): Promise<void>;
	clearAccessTokenByAddress(providerAddress: string): Promise<void>;
}
