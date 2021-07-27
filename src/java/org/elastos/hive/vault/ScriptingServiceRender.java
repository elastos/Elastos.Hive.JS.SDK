package org.elastos.hive.vault;

import com.fasterxml.jackson.databind.JsonNode;
import org.elastos.hive.ServiceEndpoint;
import org.elastos.hive.exception.HiveException;
import org.elastos.hive.exception.NotImplementedException;
import org.elastos.hive.vault.scripting.Condition;
import org.elastos.hive.vault.scripting.Executable;
import org.elastos.hive.service.ScriptingService;
import org.elastos.hive.vault.scripting.ScriptingController;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;

class ScriptingServiceRender implements ScriptingService {
	private ScriptingController controller;

	public ScriptingServiceRender(ServiceEndpoint serviceEndpoint) {
		this.controller = new ScriptingController(serviceEndpoint);
	}

	@Override
	public CompletableFuture<Void> registerScript(String name, Executable executable) {
		return registerScript(name, null, executable, false, false);
	}

	@Override
	public CompletableFuture<Void> registerScript(String name, Condition condition,
											Executable executable) {
		return registerScript(name, condition, executable, false, false);
	}

	@Override
	public CompletableFuture<Void> registerScript(String name,
											Executable executable,
											boolean allowAnonymousUser,
											boolean allowAnonymousApp) {
		return registerScript(name, null, executable, allowAnonymousUser, allowAnonymousApp);
	}

	@Override
	public CompletableFuture<Void> registerScript(String name,
											Condition condition,
											Executable executable,
											boolean allowAnonymousUser,
											boolean allowAnonymousApp) {
		return CompletableFuture.runAsync(()-> {
			if (name == null)
				throw new IllegalArgumentException("Missing script name.");

			if (executable == null)
				throw new IllegalArgumentException("Missing executable script");

			try {
				controller.registerScript(name, condition, executable,
											allowAnonymousUser,	allowAnonymousApp);
			} catch (HiveException | RuntimeException e) {
				throw new CompletionException(e);
			}
		});
	}

	@Override
	public CompletableFuture<Void> unregisterScript(String name) {
		return CompletableFuture.runAsync(()-> {
			try {
				controller.unregisterScript(name);
			} catch (HiveException | RuntimeException e) {
				throw new CompletionException(e);
			}
		});
	}

	@Override
	public <T> CompletableFuture<T> callScript(String name,
											JsonNode params,
											String targetDid,
											String targetAppDid,
											Class<T> resultType) {
		return CompletableFuture.supplyAsync(()-> {
			if (name == null)
				throw new IllegalArgumentException("Missing script name.");

			if (params == null)
				throw new IllegalArgumentException("Missing parameters to run the script");

			if (targetDid == null)
				throw new IllegalArgumentException("Missing target user DID");

			if (targetAppDid == null)
				throw new IllegalArgumentException("Missing target application DID");

			if (resultType == null)
				throw new IllegalArgumentException("Missing result type");

			try {
				return controller.callScript(name, params, targetDid, targetAppDid, resultType);
			} catch (HiveException | RuntimeException e) {
				throw new CompletionException(e);
			}
		});
	}

	public <T> CompletableFuture<T> callScriptUrl(String name,
											String params,
											String targetDid,
											String targetAppDid,
											Class<T> resultType) {
		return CompletableFuture.supplyAsync(()-> {
			try {
				if (name == null)
					throw new IllegalArgumentException("Missing script name.");

				if (params == null)
					throw new IllegalArgumentException("Missing parameters to run the script");

				if (targetDid == null)
					throw new IllegalArgumentException("Missing target user DID");

				if (targetAppDid == null)
					throw new IllegalArgumentException("Missing target application DID");

				if (resultType == null)
					throw new IllegalArgumentException("Missing result type");

				return controller.callScriptUrl(name, params, targetDid, targetAppDid, resultType);
			} catch (HiveException | RuntimeException e) {
				throw new CompletionException(e);
			}
		});
	}

	@Override
	public <T> CompletableFuture<T> uploadFile(String transactionId, Class<T> resultType) {
		return CompletableFuture.supplyAsync(()-> {
			try {
				if (transactionId == null)
					throw new IllegalArgumentException("Missing transactionId.");

				if (resultType == null)
					throw new IllegalArgumentException("Missing result type");

				return controller.uploadFile(transactionId, resultType);
			} catch (HiveException | RuntimeException e) {
				throw new CompletionException(e);
			}
		});
	}

	@Override
	public <T> CompletableFuture<T> downloadFile(String transactionId, Class<T> resultType) {
		return CompletableFuture.supplyAsync(()-> {
			try {
				if (transactionId == null)
					throw new IllegalArgumentException("Missing transactionId.");

				if (resultType == null)
					throw new IllegalArgumentException("Missing result type");

				return controller.downloadFile(transactionId, resultType);
			} catch (HiveException | RuntimeException e) {
				throw new CompletionException(e);
			}
		});
	}
}
