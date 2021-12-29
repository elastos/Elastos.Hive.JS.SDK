export interface CodeFetcher {
	/**
	 * Fetch the code.
	 *
	 * @return The code.
	 * @throws NodeRPCException The exception shows the error returned by hive node.
	 */
	fetch(): Promise<string>;

	/**
	 * Invalidate the code for getting the code from remote server.
	 */
	invalidate(): void;
}
