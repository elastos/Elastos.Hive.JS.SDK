package org.elastos.hive;

import java.util.concurrent.CompletableFuture;
import org.elastos.did.DIDDocument;

/**
 * The application context provider.
 */
public interface AppContextProvider {
	/**
	 * The method for upper Application to implement to set up the directory
	 * to store local data, especially for access tokens.
	 * @return The full path to the directory;
	 */
	String getLocalDataDir();

	/**
	 * The method for upper Application to implement to provide current application
	 * instance did document as the running context.
	 * @return The application instance did document.
	 */
	DIDDocument getAppInstanceDocument();

	/**
	 * The method for upper Application to implement to acquire the authorization
	 * code from user's approval.
	 * @param authenticationChallengeJWtCode  The input challenge code from back-end node service.
	 * @return The credential issued by user.
	 */
	CompletableFuture<String> getAuthorization(String authenticationChallengeJWtCode);
}
