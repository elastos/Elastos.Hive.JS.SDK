package org.elastos.hive.service;

import org.elastos.hive.vault.scripting.Condition;
import org.elastos.hive.vault.scripting.Executable;

import java.util.concurrent.CompletableFuture;

/**
 * Vault provides the scripting service to vault owners to register executable
 * script and make invocation as well. The executable script registered by the
 * vault owner mainly serves external users to invoke for executing the preset
 * routine defined in the script.
 */
public interface ScriptingService extends ScriptingInvocationService {
	CompletableFuture<Void> registerScript(String name, Executable executable);
	CompletableFuture<Void> registerScript(String name, Condition condition, Executable executable);

	/**
	 *
	 * Lets the vault owner register a script on his vault for a given application.
	 * The script is built on the client-side, then serialized and stored on the
	 * vault service. Later on, the vault owner or external users can invoke the script
	 * to execute one of those scripts and get results or data.
	 *
	 * @param name the name of script to register
	 * @param executable the executable body of the script with preset routines
	 * @param allowAnonymousUser whether allows anonymous user.
	 * @param allowAnonymousApp whether allows anonymous application.
	 * @return Void
	 */
	CompletableFuture<Void> registerScript(String name, Executable executable,
						boolean allowAnonymousUser, boolean allowAnonymousApp);

	/**
	 * Let the vault owner register a script on his vault for a given application.
	 *
	 * @param name the name of script to register
	 * @param condition the condition on which the script could be executed.
	 * @param executable the executable body of the script with preset routines
	 * @param allowAnonymousUser whether allows anonymous user.
	 * @param allowAnonymousApp whether allows anonymous application.
	 * @return Void
	 */
	CompletableFuture<Void> registerScript(String name, Condition condition, Executable executable,
						boolean allowAnonymousUser, boolean allowAnonymousApp);


	/**
	 * Let the vault owner unregister a script when the script become useless to
	 * applications.
	 *
	 * @param name the name of script to unregister.
	 * @return void
	 */
	CompletableFuture<Void> unregisterScript(String name);
}

