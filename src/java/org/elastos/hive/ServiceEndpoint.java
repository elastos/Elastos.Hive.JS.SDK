package org.elastos.hive;

import java.io.File;
import java.lang.ref.WeakReference;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;

import org.elastos.did.jwt.Claims;
import org.elastos.did.jwt.JwtParserBuilder;
import org.elastos.hive.connection.NodeRPCConnection;
import org.elastos.hive.connection.NodeRPCException;
import org.elastos.hive.connection.auth.AccessToken;
import org.elastos.hive.connection.auth.BridgeHandler;
import org.elastos.hive.endpoint.AboutController;
import org.elastos.hive.endpoint.NodeVersion;
import org.elastos.hive.exception.HiveException;
import org.elastos.hive.exception.NotImplementedException;

public class ServiceEndpoint extends NodeRPCConnection {
	private AppContext context;
	private String providerAddress;

	private String appDid;
	private String appInstanceDid;
	private String serviceInstanceDid;

	private AccessToken accessToken;
	private DataStorage dataStorage;

	protected ServiceEndpoint(AppContext context, String providerAddress) {
		if (context == null || providerAddress == null)
			throw new IllegalArgumentException("Empty context or provider address parameter");

		this.context = context;
		this.providerAddress = providerAddress;

		String dataDir = context.getAppContextProvider().getLocalDataDir();
		if (!dataDir.endsWith(File.separator))
			dataDir += File.separator;

		this.dataStorage = new FileStorage(dataDir, context.getUserDid());
		this.accessToken = new AccessToken(this, dataStorage, new BridgeHandler() {
			private WeakReference<ServiceEndpoint> weakref;

			@Override
			public void flush(String value) {
				try {
					ServiceEndpoint endpoint = weakref.get();
					Claims claims;

					claims = new JwtParserBuilder().build().parseClaimsJws(value).getBody();
					endpoint.flushDids(claims.getAudience(), claims.getIssuer());

				} catch (Exception e) {
					e.printStackTrace();
					return;
				}
			}

			BridgeHandler setTarget(ServiceEndpoint endpoint) {
				this.weakref = new WeakReference<>(endpoint);
				return this;
			}

			@Override
			public Object target() {
				return weakref.get();
			}

		}.setTarget(this));
	}

	public AppContext getAppContext() {
		return context;
	}

	/**
	 * Get the end-point address of this service End-point.
	 *
	 * @return provider address
	 */
	@Override
	public String getProviderAddress() {
		return providerAddress;
	}

	/**
	 * Get the user DID string of this serviceEndpoint.
	 *
	 * @return user did
	 */
	public String getUserDid() {
		return context.getUserDid();
	}

	/**
	 * Get the application DID in the current calling context.
	 *
	 * @return application did
	 */
	public String getAppDid() {
		return appDid;
	}

	/**
	 * Get the application instance DID in the current calling context;
	 *
	 * @return application instance did
	 */
	public String getAppInstanceDid() {
		return appInstanceDid;
	}

	/**
	 * Get the remote node service application DID.
	 *
	 * @return node service did
	 */
	public String getServiceDid() {
		throw new NotImplementedException();
	}

	/**
	 * Get the remote node service instance DID where is serving the storage service.
	 *
	 * @return node service instance did
	 */
	public String getServiceInstanceDid() {
		return serviceInstanceDid;
	}

	private void flushDids(String appInstanceDId, String serviceInstanceDid) {
		this.appInstanceDid = appInstanceDId;
		this.serviceInstanceDid = serviceInstanceDid;
	}

	public DataStorage getStorage() {
		return dataStorage;
	}

	public void refreshAccessToken() throws NodeRPCException {
		accessToken.fetch();
	}

	@Override
	protected AccessToken getAccessToken() {
		return accessToken;
	}

	public CompletableFuture<NodeVersion> getNodeVersion() {
		return CompletableFuture.supplyAsync(() -> {
			try {
				return new AboutController(this).getNodeVersion();
			} catch (HiveException | RuntimeException e) {
				throw new CompletionException(e);
			}
		});
	}

	public CompletableFuture<String> getLatestCommitId() {
		return CompletableFuture.supplyAsync(() -> {
			try {
				return new AboutController(this).getCommitId();
			} catch (HiveException | RuntimeException e) {
				throw new CompletionException(e);
			}
		});
	}
}
