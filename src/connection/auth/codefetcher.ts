/**
 * CodeFetcher is for accessing the code by the network and can be invalidate.
 */
export interface CodeFetcher {
	/**
	 * Fetch the code.
	 *
	 * @return The code.
	 * @throws HiveException The exception shows the error returned by hive node.
	 */
	fetch(): Promise<string>;

	/**
	 * Invalidate the code for getting the code from remote server.
	 */
	invalidate(): Promise<void>;
}
