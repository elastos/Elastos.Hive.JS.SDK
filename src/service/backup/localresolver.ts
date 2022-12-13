import {VerifiableCredential} from "@elastosfoundation/did-js-sdk";
import {SHA256} from "../../utils/sha256";
import {NotImplementedException} from "../../exceptions";
import {ServiceEndpoint} from "../../connection/serviceendpoint";
import {CodeFetcher} from "../../connection/auth/codefetcher";
import {BackupContext} from "./backupcontext";

/**
 * Local token fetcher and keeper.
 * It will get the token from remote hive node if local does not exist.
 */
export class LocalResolver implements CodeFetcher {
	private endpoint: ServiceEndpoint;
	private backupContext: BackupContext;
	private nextFetcher: CodeFetcher;
    private storageKey: string;

	constructor(endpoint: ServiceEndpoint, backupContext: BackupContext, nextFetcher: CodeFetcher) {
		this.endpoint = endpoint;
		this.backupContext = backupContext;
		this.nextFetcher = nextFetcher;
	}

	async fetch(): Promise<string> {
	    const key = await this.getStorageKey();

	    // restore backup credential and check expired.
		let token = this.endpoint.getStorage().loadBackupCredential(key);
		if (token) {
            const credential = VerifiableCredential.parse(token);
            const expire_time: Date = await credential.getExpirationDate();
            if (expire_time.getTime() < Date.now()) {
                this.endpoint.getStorage().clearBackupCredential(key);
                token = null;
            }
        }

		// if not get from local, try to get from remote.
		if (token == null) {
			token = await this.nextFetcher.fetch();
            this.endpoint.getStorage().storeBackupCredential(key, token);
		}

		return token;
	}

	invalidate(): Promise<void> {
		throw new NotImplementedException();
	}

    private async getStorageKey(): Promise<string> {
        if (!this.storageKey) {
            const userDid = this.endpoint.getUserDid();
            const targetDid = this.backupContext.getParameter("targetServiceDid");
            const sourceDid = await this.endpoint.getServiceInstanceDid();

            const keySource = `${userDid};${sourceDid};${targetDid}`;
            this.storageKey = SHA256.encodeToStr(keySource);
        }
        return this.storageKey;
    }
}
