/**
 * The bridge handler is for the {@link AccessToken#AccessToken(ServiceEndpoint, DataStorage, BridgeHandler)} ()}
 * to notify the caller some information.
 */
export interface BridgeHandler {
	/**
	 * Flush the value of the access token.
	 *
	 * @param value The value of the access token.
	 */
	flush(value: string): Promise<void>;

	/**
	 * The target is what the access token for.
	 *
	 * @return The target object, such as service end point, etc.
	 */
	target(): any;
}
