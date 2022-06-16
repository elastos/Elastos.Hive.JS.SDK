import { Vault } from "./vault";
import { ScriptingService } from "./service/scripting/scriptingservice";
import { DatabaseService } from "./service/database/databaseservice";
import { VaultSubscription } from "./service/subscription/vaultsubscription/vaultsubscription";
import { AppContext } from "./connection/auth/appcontext";
import { AppContextParameters } from "./connection/auth/defaultappcontextprovider";
import { ServiceEndpoint } from "./connection/serviceendpoint";
import { DIDResolverAlreadySetupException  } from './exceptions';
import { HiveContextProvider } from "./hivecontextprovider";

import { Logger, CacheManager } from '@carlduranleau/commons.js.tools';

  
  export class HiveClientParameters {
    public context = {} as AppContextParameters;
    public hiveHost = '';
    public resolverUrl = '';
    public resolverCache = '';
  }
  
  const environmentParameters: HiveClientParameters = {
    hiveHost: process.env.REACT_APP_HIVE_HOST as string,
    resolverUrl: process.env.REACT_APP_HIVE_RESOLVER_URL as string,
    resolverCache: process.env.REACT_APP_HIVE_CACHE_DIR as string,
    context: {
      storePath: process.env.REACT_APP_APPLICATION_STORE_PATH,
      appDID: process.env.REACT_APP_APPLICATION_DID,
      appMnemonics: process.env.REACT_APP_APPLICATION_MNEMONICS,
      appPhrasePass: process.env.REACT_APP_APPLICATION_PASSPHRASE,
      appStorePass: process.env.REACT_APP_APPLICATION_STORE_PASS,
      userDID: '',
      userMnemonics: '', // 'web text team glue winner violin zebra case long alert share afford',
      userPhrasePass: '',
      userStorePass: process.env.REACT_APP_APPLICATION_STORE_PASS
    } as AppContextParameters
  };
  
  export const appParameters: HiveClientParameters = {
    hiveHost: process.env.REACT_APP_HIVE_HOST as string,
    resolverUrl: process.env.REACT_APP_HIVE_RESOLVER_URL as string,
    resolverCache: process.env.REACT_APP_HIVE_CACHE_DIR as string,
    context: {
      storePath: process.env.REACT_APP_APPLICATION_STORE_PATH,
      appDID: process.env.REACT_APP_APPLICATION_DID,
      appMnemonics: process.env.REACT_APP_APPLICATION_MNEMONICS,
      appPhrasePass: process.env.REACT_APP_APPLICATION_PASSPHRASE,
      appStorePass: process.env.REACT_APP_APPLICATION_STORE_PASS,
      userDID: process.env.REACT_APP_APPLICATION_DID,
      userMnemonics: process.env.REACT_APP_APPLICATION_MNEMONICS,
      userPhrasePass: process.env.REACT_APP_APPLICATION_PASSPHRASE,
      userStorePass: process.env.REACT_APP_APPLICATION_STORE_PASS
    } as AppContextParameters
  };
  
  export class HiveClient {
    private static APP_INSTANCE_DOCUMENT_CACHE_KEY = 'APP_INSTANCE_DOCUMENT';
    private static LOG = new Logger('HiveClient');
    private databaseService?: DatabaseService;
    private scriptingService?: ScriptingService;
    private vaultSubscriptionService?: VaultSubscription;
    private vaultServices?: Vault;
    private anonymous: boolean;
    private hiveClientParameters: HiveClientParameters;
    private appContext: AppContext;
  
    private constructor(
      anonymous: boolean,
      appContext: AppContext,
      hiveClientParameters: HiveClientParameters,
      vaultServices?: Vault,
      vaultSubscriptionService?: VaultSubscription
    ) {
      // HiveClient.LOG.debug(
      //   'Creating HiveClient instance with {} ...',
      //   JSON.stringify(appContext)
      // );
      this.anonymous = anonymous;
      this.appContext = appContext;
      this.hiveClientParameters = hiveClientParameters;
      if (!anonymous) {
        this.databaseService = vaultServices?.getDatabaseService();
        this.scriptingService = vaultServices?.getScriptingService();
        this.vaultSubscriptionService = vaultSubscriptionService;
        this.vaultServices = vaultServices;
      } else {
      }
    }
  
    get Database(): DatabaseService {
      HiveClient.LOG.trace('Database');
      if (!this.databaseService)
        throw new Error('HiveClient: Authentication required.');
      return this.databaseService;
    }
  
    get Vault(): Vault {
      HiveClient.LOG.trace('Vault');
      if (!this.vaultServices)
        throw new Error('HiveClient: Authentication required.');
      return this.vaultServices;
    }
  
    get VaultSubscription(): VaultSubscription {
      HiveClient.LOG.trace('VaultSubscription');
      if (!this.vaultSubscriptionService)
        throw new Error('HiveClient: Authentication required.');
      return this.vaultSubscriptionService;
    }
  
    get Scripting(): ScriptingService {
      HiveClient.LOG.trace('Scripting');
      if (!this.anonymous && !this.scriptingService)
        throw new Error('HiveClient: Authentication required.');
    //   if (this.anonymous && !this.anonymousScriptingService)
    //     throw new Error('HiveClient: Anonymous Scripting Service unavailable.');
      return this.scriptingService!;
    }
  
    public isAnonymous(): boolean {
      HiveClient.LOG.trace('isAnonymous');
      return this.anonymous;
    }
  
    // public static async createAnonymousInstance(
    //   hiveHost: string
    // ): Promise<HiveClient> {
    //   HiveClient.LOG.trace('createAnonymousInstance');
    //   let hiveClient: HiveClient = CacheManager.get(hiveHost, 'HiveClient');
  
    //   if (!hiveClient) {
    //     HiveClient.LOG.debug('Creating new anonymous HiveClient instance...');
    //     let appContextParameters = environmentParameters;
    //     appContextParameters.hiveHost = hiveHost;
    //     let instanceAppContextParameters = HiveClient.resolveDefaultParameters(
    //       appContextParameters
    //     );
    //     HiveClient.LOG.debug(
    //       'Initializing anonymous resolver with {} and {} ...',
    //       instanceAppContextParameters.resolverUrl,
    //       instanceAppContextParameters.resolverCache
    //     );
    //     try {
    //       AppContext.setupResolver(
    //         instanceAppContextParameters.resolverUrl,
    //         instanceAppContextParameters.resolverCache
    //       );
    //     } catch (e) {
    //       if (!(e instanceof DIDResolverAlreadySetupException)) {
    //         throw e;
    //       }
    //     }
    //     HiveClient.LOG.debug(
    //       'Building anonymous Hive context with {} ...',
    //       JSON.stringify(instanceAppContextParameters)
    //     );
    //     let appContext = await HiveClient.buildAnonymousAppContext(
    //       instanceAppContextParameters
    //     );
    //     hiveClient = new HiveClient(
    //       true,
    //       appContext,
    //       instanceAppContextParameters,
    //       new VaultServices(appContext, instanceAppContextParameters.hiveHost)
    //     );
    //     HiveClient.LOG.debug('New anonymous HiveClient created.');
    //     hiveClient.setAnonymousScriptingService(hiveHost);
    //     CacheManager.set('HiveClient', hiveHost, hiveClient);
    //   }
    //   return hiveClient;
    // }
  
    public static async createInstance(
      appContextParameters?: HiveClientParameters
    ): Promise<HiveClient> {
      HiveClient.LOG.trace('createInstance');
      let hiveClient = CacheManager.get(appContextParameters, 'HiveClient');
  
      if (!hiveClient) {
        HiveClient.LOG.debug('Creating new HiveClient instance...');
        let instanceAppContextParameters = HiveClient.resolveDefaultParameters(
          appContextParameters
        );
        HiveClient.LOG.debug(
          'Initializing resolver with {} and {} ...',
          instanceAppContextParameters.resolverUrl,
          instanceAppContextParameters.resolverCache
        );
        try {
          AppContext.setupResolver(
            instanceAppContextParameters.resolverUrl,
            instanceAppContextParameters.resolverCache
          );
        } catch (e) {
          if (!(e instanceof DIDResolverAlreadySetupException)) {
            throw e;
          }
        }
        HiveClient.LOG.debug(
          'Building Hive context with {} ...',
          JSON.stringify(instanceAppContextParameters)
        );
        let appContext = await HiveClient.buildAppContext(
          instanceAppContextParameters
        );
        hiveClient = new HiveClient(
          false,
          appContext,
          instanceAppContextParameters,
          new Vault(appContext, instanceAppContextParameters.hiveHost),
          new VaultSubscription(
            appContext,
            instanceAppContextParameters.hiveHost
          )
        );
        HiveClient.LOG.debug('New HiveClient created.');
        CacheManager.set(appContextParameters, hiveClient, 'Hiveclient');
      }
      return hiveClient as HiveClient;
    }
  
    public static async getHiveVersion(hiveHost: string): Promise<string> {
      HiveClient.LOG.trace('getHiveVersion');
  
      let params = appParameters;
      params.hiveHost = hiveHost;
      let hiveClient = await HiveClient.createInstance(params);
  
      let serviceEndpoint = new ServiceEndpoint(
        hiveClient.appContext,
        hiveClient.hiveClientParameters.hiveHost
      );
  
      return (await serviceEndpoint.getNodeVersion()).toString();
      // TODO: fix sdk endpoint
      //return '2.7.2';
    }
  
    private static resolveDefaultParameters(
      hiveClientParameters?: HiveClientParameters
    ): HiveClientParameters {
      HiveClient.LOG.trace('resolveDefaultParameters');
      if (!hiveClientParameters) return environmentParameters;
      for (const defaultPropertyKey in environmentParameters) {
        const key = defaultPropertyKey as keyof HiveClientParameters;
        if (key == 'context') {
          if (!hiveClientParameters.context) {
            hiveClientParameters.context = environmentParameters.context;
          } else {
            let appContextParameters = hiveClientParameters.context;
            for (const defaultContextPropertyKey in environmentParameters.context) {
              const contextKey = defaultContextPropertyKey as keyof AppContextParameters;
              if (!appContextParameters[contextKey]) {
                appContextParameters[contextKey] = environmentParameters.context[contextKey] as string;
              }
            }
          }
        } else {
          if (!hiveClientParameters[key]) {
            hiveClientParameters[key] = environmentParameters[key];
          }
        }
      }
      return hiveClientParameters;
    }
  
    // private static async buildAnonymousAppContext(
    //   appContextParameters: HiveClientParameters
    // ): Promise<AppContext> {
    //   HiveClient.LOG.trace('buildAnonymousAppContext');
    //   return await AppContext.build(
    //     {
    //       getLocalDataDir(): string {
    //         HiveClient.LOG.trace('HiveAnonymousContextProvider: getLocalDataDir');
    //         return appContextParameters.context.storePath;
    //       },
  
    //       /**
    //        * The method for upper Application to implement to provide current application
    //        * instance did document as the running context.
    //        * @return The application instance did document.
    //        */
    //       async getAppInstanceDocument(): Promise<DIDDocument> {
    //         HiveClient.LOG.trace(
    //           'HiveAnonymousContextProvider: getAppInstanceDocument'
    //         );
    //         return new Promise((resolve, reject) => {
    //           resolve(new DIDDocument());
    //         });
    //       },
  
    //       /**
    //        * The method for upper Application to implement to acquire the authorization
    //        * code from user's approval.
    //        * @param authenticationChallengeJWtCode  The input challenge code from back-end node service.
    //        * @return The credential issued by user.
    //        */
    //       getAuthorization(
    //         authenticationChallengeJWtCode: string
    //       ): Promise<string> {
    //         HiveClient.LOG.trace(
    //           'HiveAnonymousContextProvider: getAuthorization'
    //         );
    //         return new Promise((resolve, reject) => {
    //           resolve('');
    //         });
    //       }
    //     },
    //     appContextParameters.context.userDID as string
    //   );
    // }
  
    private static async buildAppContext(
      appContextParameters: HiveClientParameters
    ): Promise<AppContext> {
      HiveClient.LOG.trace('buildAppContext');
      return await AppContext.build(
        await HiveContextProvider.create(appContextParameters.context),
        appContextParameters.context.userDID as string
      );
    }
  
    public isConnected(): boolean {
      return true;
      // HiveClient.LOG.trace('isConnected');
      // return this.isConnected() || this.getAccessToken() ? true : false;
    }
  
    public getAccessToken(): string | null {
      HiveClient.LOG.trace('getAccessToken');
      try {
        return this.Vault.getAccessToken().getJwtCode();
      } catch (e) {
        HiveClient.LOG.error(e);
      }
      return null;
    }
  
   
  }
  