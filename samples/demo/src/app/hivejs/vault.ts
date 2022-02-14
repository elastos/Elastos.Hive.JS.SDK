import SdkContext from './testdata';
import ClientConfig from './config/clientconfig';
import {
  Executable, FileDownloadExecutable,
  FileUploadExecutable,
  InsertOptions,
  VaultInfo,
  VaultServices,
  VaultSubscriptionService
} from '@dchagastelles/elastos-hive-js-sdk';
// import {showContents} from "./bfs";
// import {readdirSync} from "./bfs";
// import {readdirSync} from "@elastosfoundation/did-js-sdk/typings/fs.browser";

export default class Vault {
  private static instance: Vault = null;
  private static readonly COLLECTION_NAME: string = 'HiveJsCollection';
  private static readonly FILE_CONTENT: string = 'file content for the files service';
  private static readonly FILE_NAME: string = 'testing_file';
  private static readonly FILE_NAME_SCRIPTING: string = 'testing_file_scripting';
  private static readonly SCRIPT_NAME_UPLOAD: string = 'upload_file';
  private static readonly SCRIPT_NAME_DOWNLOAD: string = 'download_file';

  private readonly hiveUrl: string;
  private sdkContext: SdkContext;
  private vaultSubscriptionService: VaultSubscriptionService;
  private vaultService: VaultServices;
  private targetUserDid: string;
  private targetAppDid: string;

  private constructor(hiveUrl: string) {
    this.hiveUrl = hiveUrl
  }

  public static async getInstance(hiveUrl: string): Promise<Vault> {
      if (!Vault.instance) {
          Vault.instance = new Vault(hiveUrl);
          await Vault.instance.init();
      }
      return Vault.instance;
  }

  private async init(): Promise<void> {
    this.sdkContext = await SdkContext.getInstance('hive js demo', ClientConfig.CUSTOM, SdkContext.USER_DIR);
    this.targetUserDid = this.sdkContext.getUserDid();
    this.targetAppDid = this.sdkContext.getAppDid();
  }

  private getVaultSubscriptionService() {
    if (!this.vaultSubscriptionService) {
      this.vaultSubscriptionService = new VaultSubscriptionService(this.sdkContext.getAppContext(), this.hiveUrl);
    }
    return this.vaultSubscriptionService;
  }

  private getVaultService() {
    if (!this.vaultService) {
      this.vaultService = new VaultServices(this.sdkContext.getAppContext(), this.hiveUrl);
    }
    return this.vaultService;
  }

  async subscribe(): Promise<boolean> {
    try {
      const vaultInfo: VaultInfo = await this.getVaultSubscriptionService().subscribe();
      console.log(`vault info: ${vaultInfo}`);
      return true;
    } catch (e) {
      console.log(`ERROR: Failed to subscribe: ${e}.`);
      return false;
    }
  }

  async vaultInfo(): Promise<boolean> {
    try {
      const vaultInfo: VaultInfo = await this.getVaultSubscriptionService().checkSubscription();
      console.log(`vault info: ${vaultInfo}`);
      // showContents();
      return true;
    } catch (e) {
      console.error(`ERROR: Failed to get vault information: ${e}.`);
      return false;
    }
  }

  async unsubscribe(): Promise<boolean> {
    try {
      await this.getVaultSubscriptionService().unsubscribe();
      return true;
    } catch (e) {
      console.log(`ERROR: Failed to unsubscribe: ${e}.`);
      return false;
    }
  }

  private async createCollection() {
    try {
      await this.getVaultService().getDatabaseService().createCollection(Vault.COLLECTION_NAME);
    } catch (e) {
      console.log(`INFO: Failed to create collection ${Vault.COLLECTION_NAME}: ${e}`);
    }
  }

  private async deleteCollectionAnyway() {
    try {
      await this.getVaultService().getDatabaseService().deleteCollection(Vault.COLLECTION_NAME);
    } catch (e) {
      console.log(`INFO: Failed to delete collection ${Vault.COLLECTION_NAME}: ${e}`);
    }
  }

  async insertDocument(): Promise<boolean> {
    await this.createCollection();
    try {
      const doc = {"author": "john doe1", "title": "Eve for Dummies1"};
      await this.getVaultService().getDatabaseService().insertOne(Vault.COLLECTION_NAME, doc, new InsertOptions(false, false));
    } catch (e) {
      console.error(`ERROR: Failed to insert document: ${e}`);
      return false;
    }
  }

  async deleteDocument(): Promise<boolean> {
    try {
      const filter = { "author": "john doe1" };
      await this.getVaultService().getDatabaseService().deleteMany(Vault.COLLECTION_NAME, filter);
      await this.deleteCollectionAnyway();
      return true;
    } catch (e) {
      console.error(`ERROR: Failed to delete document: ${e}`);
      return false;
    }
  }

  async uploadFile(): Promise<boolean> {
    try {
      const c = Buffer.from(Vault.FILE_CONTENT, 'utf8');
      await this.getVaultService().getFilesService().upload(Vault.FILE_NAME, c);
      return true;
    } catch (e) {
      console.error(`ERROR: Failed to upload file: ${e}`);
      return false;
    }
  }

  async downloadFile(): Promise<boolean> {
    try {
      const content = await this.getVaultService().getFilesService().download(Vault.FILE_NAME);
      console.log(`Get the content of the file '${Vault.FILE_NAME}': ${content}`);
      return true;
    } catch (e) {
      console.error(`ERROR: Failed to download file: ${e}`);
      return false;
    }
  }

  async scriptingUpload(): Promise<boolean> {
    try {
      await this.registerScriptFileUpload(Vault.SCRIPT_NAME_UPLOAD);
      let uploadTransactionId = await this.callScriptFileUpload(Vault.SCRIPT_NAME_UPLOAD, Vault.FILE_NAME_SCRIPTING);
      await this.uploadFileByTransActionId(uploadTransactionId, Vault.FILE_CONTENT);
      console.log(`success to upload the file.`);
      return true;
    } catch (e) {
      console.error(`ERROR: Failed to upload file by scripting: ${e}`);
      return false;
    }
  }

  private async registerScriptFileUpload(scriptName: string) {
    await this.getVaultService().getScriptingService().registerScript(scriptName,
      new FileUploadExecutable(scriptName).setOutput(true),
      undefined, false, false);
  }

  private async callScriptFileUpload(scriptName: string, fileName: string): Promise<string> {
    let result = await this.getVaultService().getScriptingService().callScript<any>(scriptName,
      Executable.createRunFileParams(fileName), this.targetUserDid, this.targetAppDid);
    return result[scriptName].transaction_id;
  }

  private async uploadFileByTransActionId( transactionId: string, content: string): Promise<void> {
    const c = Buffer.from(content, 'utf8');
    await this.getVaultService().getScriptingService().uploadFile(transactionId, c);
  }

  async scriptingDownload(): Promise<boolean> {
    try {
      await this.registerScriptFileDownload(Vault.SCRIPT_NAME_DOWNLOAD);
      let transId = await this.callScriptFileDownload(Vault.SCRIPT_NAME_DOWNLOAD, Vault.FILE_NAME_SCRIPTING);
      let buffer = await this.downloadFileByTransActionId(transId);
      console.log(`Get the file content of the scripting file: ${buffer.toString()}`);
      return true;
    } catch (e) {
      console.error(`ERROR: Failed to download file by scripting: ${e}`);
      return false;
    }
  }

  private async registerScriptFileDownload( scriptName: string) {
    await this.getVaultService().getScriptingService().registerScript(scriptName,
      new FileDownloadExecutable(scriptName).setOutput(true),
      undefined, false, false);
  }

  private async callScriptFileDownload(scriptName: string, fileName: string): Promise<string> {
    let result = await this.getVaultService().getScriptingService().callScript(scriptName,
      Executable.createRunFileParams(fileName), this.targetUserDid, this.targetAppDid);
    return result[scriptName].transaction_id;
  }

  private async downloadFileByTransActionId(transactionId: string): Promise<Buffer> {
    return await this.getVaultService().getScriptingService().downloadFile(transactionId);
  }
}
