export interface BackupContext {
    /**
	* Get the backup destination type which the vault want to go.
	*
	* @return The type of the backup, such as cloud backup service, hive node, etc.
	*/
	getType(): string;

    /**
	* Get the parameter for backup operation by key.
	*
	* @param key The parameter name.
	* @return The parameter value.
	 */
    getParameter(key: string): string;
    
    /**
	* Get the authorization information for the backup processing. The authorization information is for the hive node
	* to access the backup server which the backup information is in.
	*
	* @param srcDid hive node service instance DID.
	* @param targetDid	The instance did of the destination of the backup.
	* @param targetHost The host url of the destination of the backup.
	* @return The authorization token.
	*/
	getAuthorization(srcDid: string, targetDid: string, targetHost: string): Promise<string>;
}



