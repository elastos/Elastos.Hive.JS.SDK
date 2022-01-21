import { DID, DIDDocument, DIDBackend, DefaultDIDAdapter } from "@elastosfoundation/did-js-sdk";
import {
     IllegalArgumentException,
     DIDResoverAlreadySetupException,
     BadContextProviderException,
     DIDResolverNotSetupException,
     MalformedDIDException,
     NetworkException,
	 ProviderNotSetException,
	 DIDResolveException,
     DIDNotPublishedException } from '../../exceptions';
import { AppContextProvider } from './appcontextprovider';
import { Logger } from '../../logger';

/**
 * The application context would contain the resources list below:
 *
 * <ul>
 * <li>The reference of application context provider;</li>
 * <li>The user did which uses this application.</li>
 * </ul>
 *
 * <p>Normally, there are only one application context for one application.</p>
 */
export class AppContext {
	private static LOG = new Logger("AppContext");
	
	public static debug = false;
    private static resolverHasSetup = false;

    private contextProvider: AppContextProvider;
    private userDid: string;

    private constructor(provider: AppContextProvider, userDid: string) {
        this.contextProvider = provider;
        this.userDid = userDid;
    }

	/**
	 * Get the provider of the application context.
	 *
	 * @return The provider of the application context.
	 */
    public getAppContextProvider(): AppContextProvider {
		return this.contextProvider;
	}

	/**
	 * Get the user DID.
	 *
	 * @return The user DID.
	 */
    public getUserDid(): string {
		return this.userDid;
	}

	/**
	 * Setup the resolver for the DID verification.
	 *
	 * @param resolver The URL of the resolver.
	 * @param cacheDir The local directory for DID cache.
	 * @throws HiveException See {@link HiveException}
	 */
	public static setupResolver(resolver: string, cacheDir: string): void {
		if (cacheDir == null || resolver == null)
			throw new IllegalArgumentException("Invalid parameters to setup DID resolver");

		if (AppContext.resolverHasSetup)
			throw new DIDResoverAlreadySetupException();

		this.LOG.trace("Initializing DIDBackend with " + resolver);
		DIDBackend.initialize(new DefaultDIDAdapter(resolver));
		AppContext.resolverHasSetup = true;
	}

	/**
	 * Create the application context.
	 *
	 * @param provider The provider of the application context.
	 * @param userDid The user DID.
	 * @return The application context.
	 */
	public static async build(provider: AppContextProvider, userDid: string): Promise<AppContext> {
		if (provider == null)
			throw new IllegalArgumentException("Missing AppContext provider");

		if (provider.getLocalDataDir() == null)
			throw new BadContextProviderException("Missing method to acquire data location");

		if (await provider.getAppInstanceDocument() == null)
			throw new BadContextProviderException("Missing method to acquire App instance DID document");

		if (!AppContext.resolverHasSetup)
			throw new DIDResolverNotSetupException();

		return new AppContext(provider, userDid);
	}

	/**
	 * Get the URL address of the provider by the user DID.
	 * The will access the property of the user DID.
	 *
	 * @param targetDid The user DID.
	 * @param preferredProviderAddress The preferred URL address of the provider.
	 * @return The URL address of the provider
	 */
	public static async getProviderAddress(targetDid: string, preferredProviderAddress?: string): Promise<string> {
        if (targetDid == null)
            throw new IllegalArgumentException("Missing input parameter for target Did");

        // Prioritize the use of external input value for 'preferredProviderAddress';
        if (preferredProviderAddress != null)
            return(preferredProviderAddress);

        try {
            let services: Array<DIDDocument.Service> = null;
            let did: DID = new DID(targetDid);
            let doc: DIDDocument = await did.resolve();
            if (doc == null)
                throw (new DIDNotPublishedException("The DID " + targetDid + " has not published onto sideChain"));

            services = doc.selectServices(null, "HiveVault");
            if (services == null || services.length == 0)
                throw (new ProviderNotSetException("No 'HiveVault' services declared on DID document " + targetDid));

            /*
                * Should we throw special exception when it has more than one end-point
                * of service "HiveVault";
                */
            return services[0].getServiceEndpoint();

        } catch (e) {
            if (e instanceof MalformedDIDException) {
                AppContext.LOG.error("Malformed target did " + targetDid + " with error: " + e.message);
                throw new IllegalArgumentException("Malformed did string: " + targetDid, e);
            } else if (e instanceof DIDResolveException) {
                AppContext.LOG.error("Resolving the target DID " + targetDid + " failed: " + e.message);
                throw new NetworkException("Resolving DID failed: " + e.message, e);
            }
        }
	}
}