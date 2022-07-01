import { ServiceEndpoint } from "../../connection/serviceendpoint";
import { CodeFetcher } from "../../connection/auth/codefetcher";
import {BackupContext} from "./backupcontext";
import {NotImplementedException} from "../../exceptions";
import {VerifiableCredential} from "@elastosfoundation/did-js-sdk";
import * as crypto from 'crypto';

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
		let token = this.restoreToken(key);
		if (token) {
            const credential = VerifiableCredential.parse(token);
            const expire_time: Date = await credential.getExpirationDate();
            if (expire_time.getTime() < Date.now()) {
                this.clearToken(key);
                token = null;
            }
        }

		// if not get from local, try to get from remote.
		if (token == null) {
			token = await this.nextFetcher.fetch();
			this.saveToken(key, token);
		}

		return token;
	}

	invalidate(): void {
		throw new NotImplementedException();
	}

    private async getStorageKey(): Promise<string> {
        if (!this.storageKey) {
            const userDid = this.endpoint.getUserDid();
            const targetDid = this.backupContext.getParameter("targetServiceDid");

            // try to refresh source node did
            if (!this.endpoint.getServiceInstanceDid()) {
                await this.endpoint.refreshAccessToken();
            }
            const sourceDid = this.endpoint.getServiceInstanceDid();

            this.storageKey = crypto.createHash('md5').update('some_string').digest("hex")
        }
        return this.storageKey;
    }

	private restoreToken(key: string): string {
		return this.endpoint.getStorage().loadBackupCredential(key);
	}

	private saveToken(key: string, token: string): void {
	    this.endpoint.getStorage().storeBackupCredential(key, token);
	}

	private clearToken(key: string): void {
        this.endpoint.getStorage().clearBackupCredential(key);
	}
}
