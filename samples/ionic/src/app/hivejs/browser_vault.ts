import {VaultBase} from "./vault_base";
import {BrowserConnectivitySDKHiveAuthHelper} from "./browser_helper";
import {AppContext, BackupService, HiveException, Vault} from "@elastosfoundation/hive-js-sdk";
import {browserLogin} from "./browser_login";

/**
 * This class is used to work with essentials app in browser.
 *
 * Usage:
 *
 *      const browser = new BrowserVault();
 *      const vault = await node.createVault();
 *
 *      // create collection.
 *      await vault.getDatabaseService().createCollection(collectionName);
 *
 */
export class BrowserVault extends VaultBase {
    private helper: BrowserConnectivitySDKHiveAuthHelper;

    constructor() {
        super();
        this.helper = new BrowserConnectivitySDKHiveAuthHelper(this.config['resolverUrl']);
    }

    protected async createAppContext(): Promise<AppContext> {
        return await this.helper.getAppContext(browserLogin.getUserDidStr());
    }

    public getTargetUserDid(): string {
        return browserLogin.getUserDidStr();
    }

    getBackupService(vault: Vault): BackupService {
        const backupService = vault.getBackupService();
        const self = this;
        backupService.setBackupContext({
            getParameter(parameter:string): string {
                switch (parameter) {
                    case "targetAddress":
                        return self.config['node']['provider'];

                    case "targetServiceDid":
                        return VaultBase.LOCALHOST_SERVICE_DID;

                    default:
                        break;
                }
                return null;
            },

            getType(): string {
                return null;
            },

            async getAuthorization(srcDid: string, targetDid: string, targetHost: string): Promise<string> {
                try {
                    // TODO: EE return wrong format credential, just place a correct one to make demo work.
                    await self.helper.getBackupCredential(srcDid, targetDid, targetHost);
                    return '{"id":"did:elastos:ipUGBPuAgEx6Le99f4TyDfNZtXVT2NKXPR#backupId","type":["BackupCredential","VerifiableCredential"],"issuer":"did:elastos:iWVsBA12QrDcp4UBjuys1tykHD2u6XWVYq","issuanceDate":"2022-06-28T10:40:21Z","expirationDate":"2027-06-28T10:40:21Z","credentialSubject":{"id":"did:elastos:ipUGBPuAgEx6Le99f4TyDfNZtXVT2NKXPR","sourceDID":"did:elastos:ipUGBPuAgEx6Le99f4TyDfNZtXVT2NKXPR","targetDID":"did:elastos:ipUGBPuAgEx6Le99f4TyDfNZtXVT2NKXPR","targetHost":"http://localhost:5005"},"proof":{"type":"ECDSAsecp256r1","created":"2022-06-28T10:40:21Z","verificationMethod":"did:elastos:iWVsBA12QrDcp4UBjuys1tykHD2u6XWVYq#primary","signature":"F8-_6_RojEda3DFEzcQLgeALp0L-6tuLjwVoenk85O9G_AUCNfv5yjTNfus_obVjPXAVwa9kB24UbSjcOjMK2g"}}';
                } catch (e) {
                    throw new HiveException(e.toString());
                }

            }
        });
        return backupService;
    }

}
