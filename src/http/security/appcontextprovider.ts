import { DIDDocument } from '@elastosfoundation/did-js-sdk';

/**
 * The application context provider.
 */
export interface AppContextProvider {
	/**
	 * The method for upper Application to implement to set up the directory
	 * to store local data, especially for access tokens.
	 * @return The full path to the directory;
	 */
	getLocalDataDir(): string;

	/**
	 * The method for upper Application to implement to provide current application
	 * instance did document as the running context.
	 * @return The application instance did document.
	 */
	getAppInstanceDocument(): Promise<DIDDocument>;

	/**
	 * The method for upper Application to implement to acquire the authorization
	 * code from user's approval.
	 * @param authenticationChallengeJWtCode  The input challenge code from back-end node service.
	 * @return The credential issued by user.
	 */
	getAuthorization(authenticationChallengeJWtCode: string): Promise<string>;
}
