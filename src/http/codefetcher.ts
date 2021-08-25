/**
 * CodeFetcher is for accessing the code by the network and can be invalidate.
 */
export interface CodeFetcher {
	/**
	 * Fetch the code.
	 *
	 * @return The code.
	 * @throws NodeRPCException The exception shows the error returned by hive node.
	 */
	fetch(): string;

	/**
	 * Invalidate the code for getting the code from remote server.
	 */
	invalidate(): void;
}
