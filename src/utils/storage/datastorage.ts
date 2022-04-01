/**
 * The data storage for the access token, the backup credential, etc. which comes from the hive node.
 */
export interface DataStorage {
	loadBackupCredential(serviceDid: string): string;
	loadAccessToken(serviceDid: string): string;
	loadAccessTokenByAddress(providerAddress: string): string;

	storeBackupCredential(serviceDid: string, credential: string): void;
	storeAccessToken(serviceDid: string, accessToken: string): void;
	storeAccessTokenByAddress(providerAddress: string, accessToken: string): void;

	clearBackupCredential(serviceDid: string): void;
	clearAccessToken(serviceDid: string): void;
	clearAccessTokenByAddress(providerAddress: string): void;
}
