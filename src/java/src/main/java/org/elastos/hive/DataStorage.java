package org.elastos.hive;

public interface DataStorage {
	String loadBackupCredential(String serviceDid);
	String loadAccessToken(String serviceDid);
	String loadAccessTokenByAddress(String providerAddress);

	void storeBackupCredential(String serviceDid, String credential);
	void storeAccessToken(String serviceDid, String accessToken);
	void storeAccessTokenByAddress(String providerAddress, String accessToken);

	void clearBackupCredential(String serviceDid);
	void clearAccessToken(String serviceDid);
	void clearAccessTokenByAddress(String providerAddress);
}
