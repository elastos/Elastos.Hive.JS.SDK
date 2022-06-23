import {
    DID,
    DIDDocument,
    DIDStore,
    RootIdentity
  } from '@elastosfoundation/did-js-sdk';
import { HiveException } from "./exceptions";
import { AppContextProvider }  from "./connection/auth/appcontextprovider";
import { AppContextParameters } from "./connection/auth/defaultappcontextprovider";  
import { Logger } from '@tuum-tech/commons.js.tools';
  
export abstract class HiveContextProvider implements AppContextProvider {
  private static LOG = new Logger('HiveContextProvider');
  private contextParameters: AppContextParameters;

  private appRootId?: RootIdentity;
  private userRootId?: RootIdentity;
  private store?: DIDStore;

  constructor(contextParameters: AppContextParameters) {
    this.contextParameters = contextParameters;
  }

  async init(): Promise<void> {
    HiveContextProvider.LOG.trace('init');
    this.store = await DIDStore.open(this.contextParameters.storePath);
    this.appRootId = await this.initPrivateIdentity(
      this.contextParameters.appMnemonics,
      this.contextParameters.appDID,
      this.contextParameters.appPhrasePass,
      this.contextParameters.appStorePass
    );
    HiveContextProvider.LOG.debug('Init app private identity');

    if (this.contextParameters.userMnemonics !== '') {
      this.userRootId = await this.initPrivateIdentity(
        this.contextParameters.userMnemonics,
        this.contextParameters.userDID,
        this.contextParameters.userPhrasePass,
        this.contextParameters.userStorePass
      );
      await this.initDid(this.userRootId);
    }
    HiveContextProvider.LOG.debug('Init user private identity');

    await this.initDid(this.appRootId);
  }

  public async initPrivateIdentity(
    mnemonic: string,
    did: string | DID,
    phrasePass: string,
    storePass: string
  ): Promise<RootIdentity> {
    HiveContextProvider.LOG.trace('initPrivateIdentity');
    HiveContextProvider.LOG.debug('Opens store');

    let id = RootIdentity.getIdFromMnemonic(mnemonic, phrasePass);

    HiveContextProvider.LOG.debug('ID from mnemonic {} : {}', mnemonic, id);

    if (this.store!.containsRootIdentity(id)) {
      HiveContextProvider.LOG.debug('Store constains RootIdentity');
      return await this.store!.loadRootIdentity(id);
    }

    let rootIdentity: RootIdentity;
    try {
      HiveContextProvider.LOG.info(
        'Creating root identity for mnemonic {}',
        mnemonic
      );
      rootIdentity = RootIdentity.createFromMnemonic(
        mnemonic,
        phrasePass,
        this.store!,
        storePass
      );
    } catch (e) {
      HiveContextProvider.LOG.error(
        'Error Creating root identity for mnemonic {}. Error {}',
        mnemonic,
        JSON.stringify(e)
      );
      throw new Error('Error Creating root identity for mnemonic');
    }

    await rootIdentity.synchronize();

    did = rootIdentity.getDid(0);
    let doc = await DID.from(did)?.resolve(true);
    await this.store?.storeDid(doc as DIDDocument);

    //let userDocument = await this.store?.loadDid(did);

    //this.store!.storeRootIdentity(rootIdentity, storePass);
    return rootIdentity;
  }

  public async initDid(rootIdentity: RootIdentity): Promise<void> {
    HiveContextProvider.LOG.trace('initDid');

    let did: DID = DID.from(`${process.env.REACT_APP_APPLICATION_DID}`) as DID;
    let resolvedDoc = await did.resolve(true);
    await this.store!.storeDid(resolvedDoc);
    HiveContextProvider.LOG.debug('Resolve app doc');
  }

  getLocalDataDir(): string {
    HiveContextProvider.LOG.trace('getLocalDataDir');
    return this.contextParameters.storePath;
  }

  /**
   * The method for upper Application to implement to provide current application
   * instance did document as the running context.
   * @return The application instance did document.
   */
  // eslint-disable-next-line require-await
  async getAppInstanceDocument(): Promise<DIDDocument> {
    HiveContextProvider.LOG.error("AppContextProvider.getAppInstanceDocument hasn't been implemented.");
    throw new HiveException("AppContextProvider.getAppInstanceDocument hasn't been implemented.");
  }

  /**
   * The method for upper Application to implement to acquire the authorization
   * code from user's approval.
   * @param authenticationChallengeJWtCode  The input challenge code from back-end node service.
   * @return The credential issued by user.
   */
  // eslint-disable-next-line require-await
  async getAuthorization(
    authenticationChallengeJWtCode: string
  ): Promise<string> {
    HiveContextProvider.LOG.error("AppContextProvider.getAuthorization hasn't been implemented.");
    throw new HiveException("AppContextProvider.getAuthorization hasn't been implemented.");
  }

  // Copied from did.service.new.ts
  private getExpirationDate() {
    HiveContextProvider.LOG.trace('getExpirationDate');
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();
    var c = new Date(year + 5, month, day);
    return c;
  }
}